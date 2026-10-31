import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioRecorderState {
  isRecording: boolean;
  audioUrl: string | null;
  audioBlob: Blob | null;
  durationSeconds: number;
  transcript: string;
  isSpeechRecognitionActive: boolean;
  hasSpeechNetworkError: boolean;
  audioLevels: number[];
  permissionError: string | null;
}

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    audioUrl: null,
    audioBlob: null,
    durationSeconds: 0,
    transcript: '',
    isSpeechRecognitionActive: false,
    hasSpeechNetworkError: false,
    audioLevels: Array.from({ length: 28 }, () => 6),
    permissionError: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  // Analyze real mic frequencies for the visualizer
  const updateAudioLevels = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const barCount = 28;
    const step = Math.floor(bufferLength / barCount);
    const newLevels: number[] = [];

    for (let i = 0; i < barCount; i++) {
      const val = dataArray[i * step] || 0;
      // Map 0-255 to 6-56px height
      const height = Math.max(6, Math.round((val / 255) * 50) + 6);
      newLevels.push(height);
    }

    setState((prev) => ({ ...prev, audioLevels: newLevels }));
    animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
  }, []);

  const startRecording = async () => {
    cleanupResources();
    setState((prev) => ({
      ...prev,
      audioUrl: null,
      audioBlob: null,
      durationSeconds: 0,
      transcript: '',
      hasSpeechNetworkError: false,
      permissionError: null,
      isRecording: true,
    }));
    transcriptRef.current = '';
    audioChunksRef.current = [];

    try {
      // 1. Request microphone access locally (100% offline, zero network error possible)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = stream;

      // 2. Set up Web Audio Analyser for live visualizer
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;
          updateAudioLevels();
        }
      } catch (e) {
        console.warn('AudioContext setup error (non-fatal):', e);
      }

      // 3. Set up MediaRecorder
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
        else mimeType = '';
      }

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm',
        });
        const url = URL.createObjectURL(audioBlob);
        setState((prev) => ({
          ...prev,
          audioBlob,
          audioUrl: url,
          isRecording: false,
        }));
      };

      mediaRecorder.start(250);

      // 4. Start timer counter
      timerIntervalRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, durationSeconds: prev.durationSeconds + 1 }));
      }, 1000);

      // 5. Concurrently initialize SpeechRecognition if supported
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript + ' ';
            }
            const clean = current.trim();
            if (clean) {
              transcriptRef.current = clean;
              setState((prev) => ({ ...prev, transcript: clean }));
            }
          };

          recognition.onerror = (event: any) => {
            console.warn('SpeechRecognition event (handled gracefully):', event.error);
            // If Chrome throws 'network' error because Google's cloud speech backend is unreachable,
            // we catch it silently so it DOES NOT block or halt the user's voice recording!
            if (event.error === 'network') {
              setState((prev) => ({
                ...prev,
                hasSpeechNetworkError: true,
                isSpeechRecognitionActive: false,
              }));
            } else if (event.error === 'not-allowed') {
              setState((prev) => ({
                ...prev,
                isSpeechRecognitionActive: false,
              }));
            }
          };

          recognition.onend = () => {
            setState((prev) => ({ ...prev, isSpeechRecognitionActive: false }));
          };

          recognition.start();
          recognitionRef.current = recognition;
          setState((prev) => ({ ...prev, isSpeechRecognitionActive: true }));
        } catch (speechErr) {
          console.warn('SpeechRecognition start failed (fallback to audio recording):', speechErr);
        }
      }
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setState((prev) => ({
        ...prev,
        isRecording: false,
        permissionError:
          'Microphone permission was denied. Please allow microphone access in your browser bar, or switch to Text Mode.',
      }));
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isRecording: false,
      isSpeechRecognitionActive: false,
      audioLevels: Array.from({ length: 28 }, () => 6),
    }));
  };

  const resetRecording = () => {
    cleanupResources();
    setState({
      isRecording: false,
      audioUrl: null,
      audioBlob: null,
      durationSeconds: 0,
      transcript: '',
      isSpeechRecognitionActive: false,
      hasSpeechNetworkError: false,
      audioLevels: Array.from({ length: 28 }, () => 6),
      permissionError: null,
    });
    transcriptRef.current = '';
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
