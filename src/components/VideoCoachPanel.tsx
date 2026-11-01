import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, ScanFace, ShieldCheck } from 'lucide-react';

interface VideoCoachPanelProps {
  paused?: boolean;
}

interface CoachingCues {
  framing: string;
  posture: string;
  movement: string;
}

type PoseLandmarkerInstance = import('@mediapipe/tasks-vision').PoseLandmarker;

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm';

export const VideoCoachPanel: React.FC<VideoCoachPanelProps> = ({ paused = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<PoseLandmarkerInstance | null>(null);
  const animationRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const movementSamplesRef = useRef<number[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Start the camera to get local framing and movement cues.');
  const [cues, setCues] = useState<CoachingCues | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [stream]);

  useEffect(() => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !paused;
    });
  }, [paused, stream]);

  const stopCamera = useCallback(() => {
    requestIdRef.current += 1;
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    setIsReady(false);
    setIsLoading(false);
    setCues(null);
    setError(null);
    setStatus('Camera off. No video is saved with your session.');
    lastPositionRef.current = null;
    movementSamplesRef.current = [];
  }, []);

  useEffect(() => () => {
    requestIdRef.current += 1;
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    landmarkerRef.current?.close();
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is unavailable. Use a supported browser on localhost or HTTPS.');
      return;
    }

    const requestId = ++requestIdRef.current;
    setError(null);
    setIsLoading(true);
    setStatus('Requesting camera permission…');

    let nextStream: MediaStream | null = null;
    let nextLandmarker: PoseLandmarkerInstance | null = null;
    try {
      nextStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 15, max: 20 },
        },
      });
      if (requestId !== requestIdRef.current) {
        nextStream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = nextStream;
      setStream(nextStream);
      setStatus('Loading the on-device pose model…');
      const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);
      nextLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      if (requestId !== requestIdRef.current) {
        nextLandmarker.close();
        nextStream.getTracks().forEach((track) => track.stop());
        return;
      }

      landmarkerRef.current = nextLandmarker;
      setIsReady(true);
      setIsLoading(false);
      setStatus('Looking for visible framing and movement cues…');
    } catch (cause) {
      nextLandmarker?.close();
      nextStream?.getTracks().forEach((track) => track.stop());
      if (requestId === requestIdRef.current) {
        streamRef.current = null;
        setStream(null);
        setIsLoading(false);
        setError(cause instanceof Error && cause.name === 'NotAllowedError'
          ? 'Camera permission was denied. You can continue the interview without video.'
          : 'The camera or pose model could not start. You can continue without video.');
        setStatus('Camera coaching is unavailable.');
      }
    }
  };

  useEffect(() => {
    if (!stream || !isReady || paused || !landmarkerRef.current) return;

    let lastInferenceAt = 0;
    const analyze = (timestamp: number) => {
      if (timestamp - lastInferenceAt >= 450) {
        lastInferenceAt = timestamp;
        const video = videoRef.current;
        const landmarker = landmarkerRef.current;
        if (video && landmarker && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          try {
            const result = landmarker.detectForVideo(video, timestamp);
            const pose = result.landmarks[0];
            const nose = pose?.[0];
            const leftShoulder = pose?.[11];
            const rightShoulder = pose?.[12];
            const leftHip = pose?.[23];
            const rightHip = pose?.[24];
            const visible = (point: typeof nose) => Boolean(point && (point.visibility ?? 1) >= 0.45);

            if (!visible(nose) || !visible(leftShoulder) || !visible(rightShoulder)) {
              setCues({
                framing: 'Move into view so your face and both shoulders are visible.',
                posture: 'Upper body not clear enough to check.',
                movement: 'Waiting for a clear pose.',
              });
              setStatus('No clear upper-body pose detected. Adjust your camera or seating.');
            } else {
              const shoulderCenterX = (leftShoulder!.x + rightShoulder!.x) / 2;
              const shoulderCenterY = (leftShoulder!.y + rightShoulder!.y) / 2;
              const isCentered = nose!.x >= 0.25 && nose!.x <= 0.75 && nose!.y >= 0.04 && nose!.y <= 0.42;
              const shouldersLevel = Math.abs(leftShoulder!.y - rightShoulder!.y) <= 0.09;
              const torsoVisible = visible(leftHip) && visible(rightHip);

              if (lastPositionRef.current) {
                const distance = Math.hypot(
                  shoulderCenterX - lastPositionRef.current.x,
                  shoulderCenterY - lastPositionRef.current.y,
                );
                movementSamplesRef.current = [...movementSamplesRef.current.slice(-11), distance];
              }
              lastPositionRef.current = { x: shoulderCenterX, y: shoulderCenterY };
              const averageMovement = movementSamplesRef.current.length
                ? movementSamplesRef.current.reduce((sum, value) => sum + value, 0) / movementSamplesRef.current.length
                : 0;

              const nextCues = {
                framing: isCentered
                  ? 'Face is near the center of the frame.'
                  : 'Try centering your face with a little space above your head.',
                posture: shouldersLevel
                  ? torsoVisible ? 'Shoulders look level; upper body is in frame.' : 'Shoulders look level; move back to include more of your upper body.'
                  : 'Shoulder line is tilted; check your camera angle or seating.',
                movement: movementSamplesRef.current.length < 4
                  ? 'Collecting a few more frames…'
                  : averageMovement > 0.035
                  ? 'Noticeable upper-body movement in this sample.'
                  : 'Upper-body position looks steady in this sample.',
              };
              setCues(nextCues);
              setStatus('On-device checks are active. These cues describe visible movement, not emotion.');
            }
          } catch {
            setStatus('Pose tracking paused. The camera preview is still available.');
          }
        }
      }
      animationRef.current = requestAnimationFrame(analyze);
    };

    animationRef.current = requestAnimationFrame(analyze);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isReady, paused, stream]);

  return (
    <section className="rounded-xl border border-[#513A42] bg-[#302329] p-4 shadow-inner" aria-label="Optional video coaching">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <ScanFace className="mt-0.5 h-4 w-4 shrink-0 text-[#C69BA5]" />
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F4EDEF]">Optional video coaching</h3>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#B9A5AA]">
              Get simple framing, shoulder alignment, and movement cues. This does not detect confidence, anxiety, fear, or other emotions.
            </p>
          </div>
        </div>
        {stream ? (
          <button type="button" onClick={stopCamera} className="inline-flex items-center gap-1.5 rounded-md border border-[#754653]/60 px-2.5 py-1.5 font-mono text-xs text-[#F4EDEF] hover:bg-[#482832]">
            <CameraOff className="h-3.5 w-3.5" /> Stop camera
          </button>
        ) : (
          <button type="button" onClick={startCamera} disabled={isLoading} className="inline-flex items-center gap-1.5 rounded-md border border-[#C69BA5]/60 bg-[#754653] px-2.5 py-1.5 font-mono text-xs font-semibold text-[#F4EDEF] hover:bg-[#C6A0A7] hover:text-[#241910] disabled:opacity-60">
            <Camera className="h-3.5 w-3.5" /> {isLoading ? 'Starting…' : 'Start camera'}
          </button>
        )}
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-[#B9A5AA]">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C69BA5]" />
        Camera frames are analyzed in this browser and are not recorded or uploaded by InterviewIQ. MediaPipe loads its runtime and model from Google-hosted URLs and may send product usage metrics; see the <a className="underline underline-offset-2 hover:text-[#F4EDEF]" href="https://goo.gle/mediapipe-privacy" target="_blank" rel="noreferrer">MediaPipe privacy notice</a>.
      </p>
      {!stream && <p className="mt-1 text-[11px] text-[#B9A5AA]">First use downloads the pose model and runtime. Camera permission is requested only after you choose Start camera.</p>}

      {error && <p className="mt-3 rounded-md border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs text-red-200">{error}</p>}
      {isLoading && <p className="mt-3 text-xs text-[#C69BA5]" role="status">{status}</p>}

      {stream && (
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-lg border border-[#513A42] bg-[#241910]">
            <video ref={videoRef} autoPlay muted playsInline className="aspect-video w-full object-cover [transform:scaleX(-1)]" aria-label="Live camera preview" />
            <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white">LIVE PREVIEW</span>
          </div>
          <div className="space-y-2" aria-live="polite">
            <p className="text-xs leading-relaxed text-[#D5BFC3]">{paused ? 'Analysis paused while you review feedback.' : status}</p>
            {cues && (
              <ul className="space-y-2 text-xs text-[#E9DFDF]">
                {[cues.framing, cues.posture, cues.movement].map((cue) => (
                  <li key={cue} className="rounded-md border border-[#513A42] bg-[#241910] px-3 py-2">{cue}</li>
                ))}
              </ul>
            )}
            <p className="text-[11px] leading-relaxed text-[#B9A5AA]">Lighting, camera angle, and seating can affect these rough pose cues. Use them as prompts for self-review, not a score.</p>
          </div>
        </div>
      )}
    </section>
  );
};
