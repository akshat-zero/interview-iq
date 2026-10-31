import React, { useState, useEffect, useRef } from 'react';
import {
  DomainInfo,
  DifficultyLevel,
  InterviewQuestion,
  QuestionEvaluation,
  InterviewSession,
  PillarKey
} from '../types/interview';
import { evaluateInterviewAnswer } from '../services/evaluationEngine';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { EvaluationLoadingOverlay } from '../components/EvaluationLoadingOverlay';
import { QuestionFeedbackModal } from '../components/QuestionFeedbackModal';
import {
  TopBar,
  ConfidenceRail,
  ThinkingBlock,
  CONFIDENCE_STOPS,
  CONFIDENCE_COLORS,
  confidenceRailStyle
} from '../components/LhPrimitives';
import {
  Mic,
  Volume2,
  VolumeX,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';

interface InterviewViewProps {
  domain: DomainInfo;
  roleId: string;
  difficulty: DifficultyLevel;
  questions: InterviewQuestion[];
  onFinishInterview: (session: InterviewSession) => void;
  onExitToHome: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  domain,
  roleId,
  difficulty,
  questions,
  onFinishInterview,
  sidebarOpen = true,
  onToggleSidebar
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex] || questions[0];

  // User Answer state
  const [userAnswer, setUserAnswer] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');
  const [showHints, setShowHints] = useState(false);
  const [confidenceIndex, setConfidenceIndex] = useState<number>(2); // 50% default

  // Timing
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Evaluations accumulator
  const [evaluations, setEvaluations] = useState<QuestionEvaluation[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<QuestionEvaluation | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Loading state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStep, setEvaluationStep] = useState('');

  // Audio Playback state for recorded answer
  const [isPlayingRecordedAudio, setIsPlayingRecordedAudio] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const {
    isRecording,
    audioUrl,
    durationSeconds: recordDuration,
    transcript,
    audioLevels,
    permissionError,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder();

  const { speak, stop: stopSpeaking, isSpeaking, isSupported: isTtsSupported } = useSpeechSynthesis();

  const currentRole = domain.roles.find(r => r.id === roleId) || domain.roles[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setQuestionSeconds(prev => prev + 1);
      setTotalSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (transcript && transcript.trim()) {
      setUserAnswer(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    return () => {
      stopRecording();
      stopSpeaking();
    };
  }, []);

  const toggleMic = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
      setInputMode('voice');
    }
  };

  const handleSpeakQuestion = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(currentQuestion.prompt);
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    if (isPlayingRecordedAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingRecordedAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingRecordedAudio(true);
    }
  };

  const handleLoadSample = (type: 'strong' | 'developing' | 'irrelevant') => {
    if (type === 'strong') {
      setConfidenceIndex(4);
      if (domain.id === 'swe') {
        setUserAnswer(
          `To design a globally distributed rate limiter at 500k RPS, I recommend a tiered token-bucket architecture. First, we deploy regional Redis clusters fronted by local in-memory token caches on edge application instances to minimize cross-region latency. Second, we use an asynchronous lease allocation mechanism where local instances batch-request tokens from Redis every 500ms rather than on every hit, keeping p99 latency under 2ms. Third, for partition tolerance during network partitions, we define an explicit policy: critical security authentication endpoints fail-closed, while public browsing and analytics APIs fail-open to protect availability. Finally, we mitigate clock drift by relying on monotonic time offsets and distributed telemetry canaries.`
        );
      } else if (domain.id === 'management') {
        setUserAnswer(
          `When faced with a mandatory 20% budget reduction without compromising our flagship strategic launch, I approach the decision through a Zero-Based Prioritization framework. First, I delineate "Core" differentiators directly tied to revenue and customer retention from "Context" support operational expenses. Second, we immediately audit non-headcount spend—consolidating redundant SaaS tools and renegotiating contractor contracts, which typically captures 8-12% in cost savings. Third, rather than executing indiscriminate peanut-butter cuts that damage morale, I reassign high-capacity contributors from speculative exploratory projects directly to the flagship launch team. Finally, I communicate the rationale to the entire organization with radical transparency, explaining the macro drivers and the objective evaluation matrix used to ensure psychological safety.`
        );
      } else if (domain.id === 'arts_vocal') {
        setUserAnswer(
          `Navigating the primo and secondo passaggio in high-demand repertoire requires coordinating breath pressure, acoustic vowel modification, and balanced laryngeal mechanics. First, I maintain stable appoggio breath support through dynamic intercostal expansion and abdominal wall engagement, resisting the temptation to push excessive subglottic air pressure. Second, as I approach the upper pass, I allow natural thyroid cartilage tilt to engage cricothyroid dominance without depressing the tongue root. Third, I utilize aggiustamento—narrowing open vowels slightly toward an open /o/—to align acoustic formant resonances with the harmonic partials. This achieves squillo and singer’s formant cut over the orchestra without risking vocal fold hyperfunction.`
        );
      } else {
        setUserAnswer(
          `To address the divergence where DAU grew 40% but 90-day retention dropped 18%, I first perform a granular cohort decomposition. I segment users by acquisition channel and time-to-first-activation to separate vanity traffic from high-intent retention. Second, I audit the user onboarding funnel to pinpoint where drop-off occurs before reaching our core "Aha!" moment. Third, I formulate a targeted hypothesis to improve activation by deploying in-app guided workflows and personalized workspace setup. We will run an A/B experiment measuring 30-day repeat usage as our primary metric with churn as our guardrail.`
        );
      }
    } else if (type === 'developing') {
      setConfidenceIndex(1);
      setUserAnswer(
        `I would probably just tell the team to work faster and maybe hire more people or use standard tools. If there is a problem, we can restart the servers or just see what happens next week. We should also have a meeting to discuss it with everyone.`
      );
    } else {
      setConfidenceIndex(0);
      setUserAnswer(
        `Yesterday afternoon I went down to the local supermarket and bought twenty yellow bananas, ten green apples, and a large box of chocolate chip cookies. Then my neighbor's cat jumped over the fence and started chasing a blue butterfly across the front lawn.`
      );
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    stopRecording();
    stopSpeaking();
    setIsEvaluating(true);

    try {
      const evaluation = await evaluateInterviewAnswer(
        {
          question: currentQuestion,
          userAnswer,
          timeSpentSeconds: questionSeconds,
          inputMethod: inputMode,
          domain
        },
        (step) => setEvaluationStep(step)
      );

      setCurrentEvaluation(evaluation);
      setEvaluations(prev => [...prev, evaluation]);
      setIsEvaluating(false);
      setShowFeedbackModal(true);
    } catch (err) {
      console.error('Evaluation error:', err);
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedbackModal(false);
    setCurrentEvaluation(null);
    setUserAnswer('');
    resetRecording();
    setQuestionSeconds(0);
    setShowHints(false);
    setConfidenceIndex(2);
    setIsPlayingRecordedAudio(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      finishEntireSession([...evaluations]);
    }
  };

  const finishEntireSession = (allEvals: QuestionEvaluation[]) => {
    const totalScore = allEvals.reduce((acc, curr) => acc + curr.overallScore, 0);
    const avgScore = Math.round(totalScore / allEvals.length);

    const pillarTotals: Record<PillarKey, number> = {
      relevanceAccuracy: 0,
      communicationDelivery: 0,
      domainPolish: 0,
      actionableGaps: 0
    };

    allEvals.forEach(e => {
      pillarTotals.relevanceAccuracy += e.pillars.relevanceAccuracy.score;
      pillarTotals.communicationDelivery += e.pillars.communicationDelivery.score;
      pillarTotals.domainPolish += e.pillars.domainPolish.score;
      pillarTotals.actionableGaps += e.pillars.actionableGaps.score;
    });

    const averagePillarScores = {
      relevanceAccuracy: Math.round(pillarTotals.relevanceAccuracy / allEvals.length),
      communicationDelivery: Math.round(pillarTotals.communicationDelivery / allEvals.length),
      domainPolish: Math.round(pillarTotals.domainPolish / allEvals.length),
      actionableGaps: Math.round(pillarTotals.actionableGaps / allEvals.length)
    };

    let hireVerdict: InterviewSession['hireVerdict'] = 'Leaning Hire';
    if (avgScore >= 90) hireVerdict = 'Strong Hire';
    else if (avgScore >= 82) hireVerdict = 'Hire';
    else if (avgScore >= 74) hireVerdict = 'Leaning Hire';
    else if (avgScore >= 60) hireVerdict = 'Borderline';
    else if (avgScore >= 40) hireVerdict = 'Needs Improvement';
    else hireVerdict = 'Strong No Hire';

    const session: InterviewSession = {
      id: 'session-' + Date.now(),
      createdAt: new Date().toISOString(),
      domainId: domain.id,
      domainTitle: domain.title,
      roleName: currentRole.name,
      difficulty,
      questions,
      evaluations: allEvals,
      overallScore: avgScore,
      averagePillarScores,
      hireVerdict,
      keyStrengths: avgScore >= 65 ? [
        'Demonstrated contextual awareness of the operational problem space.',
        'Structured thought progression and professional tone.',
        'Practical alignment with domain constraints.'
      ] : [
        'Answer was submitted and processed against the 4-pillar rubric.'
      ],
      criticalImprovements: avgScore < 60 ? [
        'Ensure answers directly resolve the prompt requirements without introducing off-topic subjects.',
        'Incorporate standard domain terminology and architectural frameworks.'
      ] : [
        'Explore edge-case recovery and failure modes in greater detail.',
        'Explicitly state quantitative business or technical metrics for success verification.'
      ],
      totalTimeSeconds: totalSeconds
    };

    onFinishInterview(session);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;
  const activeConfidencePct = CONFIDENCE_STOPS[confidenceIndex] ?? 50;
  const activeConfidenceColor = CONFIDENCE_COLORS[confidenceIndex] ?? CONFIDENCE_COLORS[2];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {isEvaluating && <EvaluationLoadingOverlay currentStepText={evaluationStep} />}

      {audioUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onEnded={() => setIsPlayingRecordedAudio(false)}
          className="hidden"
        />
      )}

      {showFeedbackModal && currentEvaluation && (
        <QuestionFeedbackModal
          evaluation={currentEvaluation}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onNextQuestion={handleNextQuestion}
          onFinishSession={() => {
            setShowFeedbackModal(false);
            finishEntireSession(evaluations);
          }}
          isLastQuestion={currentIndex + 1 === questions.length}
        />
      )}

      {/* Minimal 60px TopBar (exact top-bar.tsx) */}
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        title={currentRole.name}
        rightContent={
          <div className="flex items-center gap-3 font-ui text-xs text-muted-foreground">
            {isTtsSupported && (
              <button
                type="button"
                onClick={handleSpeakQuestion}
                className="flex items-center gap-1 transition-colors hover:text-foreground"
                title="Read question aloud"
              >
                {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Read'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowHints(v => !v)}
              className="transition-colors hover:text-foreground"
            >
              {showHints ? 'hide hints' : 'hints'}
            </button>
            <span className="tabular-nums">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
        }
      />

      {/* Clean Scrollable Conversation Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
          {/* Previously Answered Turns */}
          {evaluations.map((ev, idx) => (
            <div key={ev.questionId} className="space-y-4 border-b border-border/50 pb-6">
              <div className="lh-prose">
                <p>{ev.questionPrompt}</p>
              </div>

              <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="font-ui text-xs text-muted-foreground">
                    Q{idx + 1} · {ev.category}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider ${
                      ev.overallScore >= 80
                        ? 'bg-green-500/15 text-green-500'
                        : ev.overallScore >= 60
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-red-500/15 text-red-500'
                    }`}
                  >
                    {ev.grade} · {ev.overallScore}%
                  </span>
                </div>
                <ConfidenceRail value={ev.overallScore} />
              </div>

              <ThinkingBlock>{ev.userAnswer}</ThinkingBlock>

              <div className="lh-prose text-muted-foreground">
                <p>{ev.executiveSummary}</p>
              </div>
            </div>
          ))}

          {/* Active Question Prose (quiet, no nested boxes) */}
          <div className="space-y-4" ref={transcriptEndRef}>
            <div className="lh-prose">
              <p className="text-foreground">{currentQuestion.prompt}</p>
            </div>

            <p className="font-prose text-sm text-muted-foreground">
              {currentQuestion.contextNotes}
            </p>

            {showHints && (
              <div className="border-l-2 border-border pl-4 space-y-2 text-sm text-muted-foreground font-prose">
                {currentQuestion.hints.map((hint, idx) => (
                  <p key={idx}>· {hint}</p>
                ))}
              </div>
            )}

            {permissionError && (
              <div className="text-xs text-red-400 flex items-center gap-2 font-ui">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{permissionError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Floating QuestionDock + StatsBar (exact question-dock.tsx lines 755-928) */}
      <div className="shrink-0 bg-background pb-4 pt-2">
        <div className="mx-auto w-full max-w-[46rem] px-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Subtle top bar inside dock: Probe label + 1-click sample fillers */}
            <div className="flex items-center justify-between px-4 py-2 text-xs font-ui text-muted-foreground">
              <span className="uppercase tracking-wide">
                Probe · {currentQuestion.category}
              </span>
              <div className="flex items-center gap-2.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleLoadSample('strong')}
                  className="hover:text-foreground transition-colors"
                  title="Fill strong sample answer"
                >
                  Exemplar
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('developing')}
                  className="hover:text-foreground transition-colors"
                  title="Fill basic sample answer"
                >
                  Basic
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('irrelevant')}
                  className="hover:text-foreground transition-colors"
                  title="Fill off-topic sample answer"
                >
                  Off-topic
                </button>
              </div>
            </div>

            {/* Confidence Slider Row (exact question-dock.tsx lines 756-830) */}
            <div className="border-t border-border/60 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="shrink-0 font-ui text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Confidence
                </span>
                <div className="relative h-4 min-w-0 flex-1">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-2 right-2 h-1.5 -translate-y-1/2 rounded-full border border-border"
                    style={confidenceRailStyle(activeConfidencePct)}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={activeConfidencePct}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      let best = 0;
                      for (let i = 1; i < CONFIDENCE_STOPS.length; i++) {
                        if (
                          Math.abs(CONFIDENCE_STOPS[i] - v) <
                          Math.abs(CONFIDENCE_STOPS[best] - v)
                        ) {
                          best = i;
                        }
                      }
                      setConfidenceIndex(best);
                    }}
                    style={{ color: activeConfidenceColor }}
                    aria-label="Confidence"
                    className="absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent outline-none [&::-webkit-slider-runnable-track]:h-4 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-current [&::-moz-range-track]:h-4 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-current"
                  />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
                  {activeConfidencePct}%
                </span>
              </div>
            </div>

            {/* YOUR THINKING Field (exact question-dock.tsx lines 838-927) */}
            <form
              className="border-t border-border/60 p-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="rounded-[10px] border border-border/70 bg-background/60 transition-colors focus-within:border-primary/50">
                <div className="flex items-center justify-between px-2.5 pt-2">
                  <span className="font-ui text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    YOUR THINKING
                  </span>
                  {audioUrl && !isRecording && (
                    <button
                      type="button"
                      onClick={toggleAudioPlayback}
                      className="inline-flex items-center gap-1 font-ui text-xs text-muted-foreground hover:text-foreground"
                    >
                      {isPlayingRecordedAudio ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      <span>{isPlayingRecordedAudio ? 'Pause' : `Play (${formatTimer(recordDuration)})`}</span>
                    </button>
                  )}
                </div>

                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (!e.shiftKey || e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      if (userAnswer.trim() && !isEvaluating) {
                        handleSubmit();
                      }
                    }
                  }}
                  rows={3}
                  placeholder="Why this answer? Whatever comes to mind."
                  className="lh-input max-h-48 min-h-[4.5rem] w-full resize-none bg-transparent px-2.5 py-2 outline-none placeholder:text-muted-foreground/70"
                />

                <div className="flex items-center justify-between gap-2 p-1">
                  <span className="pl-1.5 font-ui text-xs text-muted-foreground">
                    ↵ submits · ⇧↵ newline
                  </span>
                  <button
                    type="submit"
                    disabled={!userAnswer.trim() || isEvaluating}
                    className="ml-auto h-9 rounded-[6px] bg-primary px-3.5 font-sans text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Submit answer
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* StatsBar below dock (exact stats-bar.tsx) */}
          <div className="relative flex items-center justify-between gap-3 px-3 pt-2 font-ui text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 tabular-nums">
              <span>{wordCount}w</span>
              <span>·</span>
              <span>{formatTimer(questionSeconds)}</span>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-center">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={toggleMic}
                  className="flex h-7 w-full items-center justify-center gap-1.5 rounded-md border border-border/50 bg-card/50 text-xs text-muted-foreground/70 shadow-lg backdrop-blur transition-colors hover:border-border hover:text-muted-foreground"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Dictate</span>
                </button>
              ) : (
                <div className="flex w-full min-w-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMic}
                    className="flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-red-500/15 px-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/25"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </button>
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-red-500" />
                  <div className="min-w-0 flex-1">
                    <AudioVisualizer
                      isRecording={isRecording}
                      audioLevels={audioLevels}
                      barCount={24}
                      compact
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span>{domain.id}:{roleId.split('_')[1] || 'lead'}</span>
              <span>·</span>
              <span>{difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
