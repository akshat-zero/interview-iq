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
    <div className="flex h-dvh flex-col overflow-hidden bg-[#241910] text-[#E9DFDF] texture-plum font-sans-editorial">
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

      {/* Minimal 60px TopBar matching theme */}
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        title={currentRole.name}
        rightContent={
          <div className="flex items-center gap-2.5 font-mono text-xs text-[#D5BFC3]">
            {isTtsSupported && (
              <button
                type="button"
                onClick={handleSpeakQuestion}
                className="flex items-center gap-1.5 rounded border border-[#513A42] bg-[#302329] px-2 py-1 text-xs text-[#D5BFC3] transition-colors hover:border-[#C69BA5] hover:text-[#F4EDEF]"
                title="Read question aloud"
              >
                {isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-[#C69BA5]" /> : <Volume2 className="h-3.5 w-3.5 text-[#C69BA5]" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Read'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowHints(v => !v)}
              className="rounded border border-[#513A42] bg-[#302329] px-2.5 py-1 text-xs text-[#D5BFC3] transition-colors hover:border-[#C69BA5] hover:text-[#F4EDEF]"
            >
              {showHints ? 'Hide hints' : 'Hints'}
            </button>
            <span className="rounded border border-[#513A42] bg-[#3B2931] px-2.5 py-1 text-xs tabular-nums text-[#F4EDEF]">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        }
      />

      {/* Clean Scrollable Conversation Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
          {/* Previously Answered Turns */}
          {evaluations.map((ev, idx) => (
            <div key={ev.questionId} className="space-y-4 border-b border-[#513A42]/60 pb-8">
              <div className="font-editorial text-xl text-[#F4EDEF] tracking-tight">
                <p>{ev.questionPrompt}</p>
              </div>

              <div className="rounded-xl border border-[#513A42] bg-[#302329] px-4 py-3 text-sm shadow-md">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#C69BA5]">
                    Q{idx + 1} · {ev.category}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-xs uppercase tracking-wider ${
                      ev.overallScore >= 80
                        ? 'bg-[#754653]/40 text-[#F4EDEF] border border-[#C69BA5]/60'
                        : ev.overallScore >= 60
                        ? 'bg-[#482832]/60 text-[#B18A91] border border-[#513A42]'
                        : 'bg-[#302329] text-[#B9A5AA] border border-[#513A42]'
                    }`}
                  >
                    {ev.grade} · {ev.overallScore}%
                  </span>
                </div>
                <ConfidenceRail value={ev.overallScore} />
              </div>

              <ThinkingBlock>{ev.userAnswer}</ThinkingBlock>

              <div className="rounded-lg border-l-2 border-[#754653] bg-[#3B2931]/50 px-3.5 py-2 text-sm text-[#D5BFC3] font-sans-editorial italic">
                <p>{ev.executiveSummary}</p>
              </div>
            </div>
          ))}

          {/* Active Question Prose */}
          <div className="space-y-4" ref={transcriptEndRef}>
            <div className="font-editorial text-2xl sm:text-3xl text-[#F4EDEF] tracking-tight leading-snug">
              <p>{currentQuestion.prompt}</p>
            </div>

            <p className="font-sans-editorial text-sm sm:text-base text-[#D5BFC3] leading-relaxed">
              {currentQuestion.contextNotes}
            </p>

            {showHints && (
              <div className="rounded-xl border border-[#513A42] bg-[#302329] p-4 space-y-2 text-sm text-[#D5BFC3] font-sans-editorial shadow-inner">
                <div className="font-mono text-xs uppercase tracking-widest text-[#C69BA5] mb-1">
                  ✦ Interviewer Hints & Focus
                </div>
                {currentQuestion.hints.map((hint, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <span className="text-[#B18A91] font-mono">·</span>
                    <span>{hint}</span>
                  </p>
                ))}
              </div>
            )}

            {permissionError && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs text-red-300 flex items-center gap-2 font-mono">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{permissionError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Floating QuestionDock + StatsBar */}
      <div className="shrink-0 bg-gradient-to-t from-[#241910] via-[#241910]/95 to-transparent pb-4 pt-2">
        <div className="mx-auto w-full max-w-[48rem] px-4">
          <div className="overflow-hidden rounded-2xl border border-[#513A42] bg-[#302329] shadow-2xl shadow-[#241910]/90">
            {/* Subtle top bar inside dock: Probe label + 1-click sample fillers */}
            <div className="flex items-center justify-between px-4 py-2.5 text-xs font-mono text-[#D5BFC3] bg-[#3B2931]/70 border-b border-[#513A42]">
              <span className="uppercase tracking-wider text-[#C69BA5] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C69BA5]" />
                Probe · {currentQuestion.category}
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-[#B9A5AA]">Sample fill:</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('strong')}
                  className="rounded border border-[#754653] bg-[#754653]/30 px-2 py-0.5 text-[#F4EDEF] transition-colors hover:bg-[#754653] hover:text-[#F4EDEF]"
                  title="Fill 98/100 exemplar answer"
                >
                  Exemplar (98)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('developing')}
                  className="rounded border border-[#513A42] bg-[#482832]/50 px-2 py-0.5 text-[#D5BFC3] transition-colors hover:bg-[#482832] hover:text-[#F4EDEF]"
                  title="Fill developing sample answer"
                >
                  Developing
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('irrelevant')}
                  className="rounded border border-[#513A42] bg-[#241910] px-2 py-0.5 text-[#B9A5AA] transition-colors hover:bg-[#3B2931] hover:text-[#D5BFC3]"
                  title="Fill off-topic answer"
                >
                  Off-topic
                </button>
              </div>
            </div>

            {/* Confidence Slider Row */}
            <div className="border-b border-[#513A42] bg-[#302329] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-[#B18A91]">
                  Confidence
                </span>
                <div className="relative h-4 min-w-0 flex-1">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-2 right-2 h-1.5 -translate-y-1/2 rounded-full border border-[#513A42]"
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
                <span className="w-10 shrink-0 text-right font-mono text-xs font-semibold tabular-nums text-[#F4EDEF]">
                  {activeConfidencePct}%
                </span>
              </div>
            </div>

            {/* YOUR THINKING Field */}
            <form
              className="p-2.5 bg-[#241910]/80"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="rounded-xl border border-[#513A42] bg-[#241910] transition-colors focus-within:border-[#C69BA5] shadow-inner">
                <div className="flex items-center justify-between px-3 pt-2.5">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#C69BA5]">
                    YOUR THINKING / ANSWER
                  </span>
                  {audioUrl && !isRecording && (
                    <button
                      type="button"
                      onClick={toggleAudioPlayback}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-[#B18A91] hover:text-[#F4EDEF] transition-colors"
                    >
                      {isPlayingRecordedAudio ? <Pause className="h-3 w-3 text-[#C69BA5]" /> : <Play className="h-3 w-3 text-[#C69BA5]" />}
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
                  placeholder="Articulate your structured response, trade-offs, and operational approach..."
                  className="w-full resize-none bg-transparent px-3 py-2 font-sans-editorial text-[14.5px] text-[#F4EDEF] outline-none placeholder:text-[#B9A5AA]/60 max-h-48 min-h-[4.5rem] leading-relaxed"
                />

                <div className="flex items-center justify-between gap-2 border-t border-[#513A42]/50 bg-[#302329]/40 px-3 py-2">
                  <span className="font-mono text-[11px] text-[#B9A5AA]">
                    ↵ Enter submits · ⇧ Shift+Enter newline
                  </span>
                  <button
                    type="submit"
                    disabled={!userAnswer.trim() || isEvaluating}
                    className="ml-auto h-9 rounded-lg border border-[#C69BA5]/50 bg-[#754653] px-4 font-mono text-xs font-bold uppercase tracking-wider text-[#F4EDEF] shadow-md shadow-[#482832]/50 transition-all hover:bg-[#C6A0A7] hover:text-[#241910] disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Submit answer →
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* StatsBar below dock */}
          <div className="relative flex items-center justify-between gap-3 px-3 pt-2 font-mono text-xs text-[#D5BFC3]">
            <div className="flex items-center gap-1.5 tabular-nums text-[#B9A5AA]">
              <span className="text-[#F4EDEF] font-semibold">{wordCount}</span>w
              <span>·</span>
              <span className="text-[#D5BFC3]">{formatTimer(questionSeconds)}</span>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-center max-w-xs">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={toggleMic}
                  className="flex h-7 w-full items-center justify-center gap-1.5 rounded-lg border border-[#513A42] bg-[#3B2931] px-3 text-xs font-mono text-[#D5BFC3] shadow-md transition-colors hover:border-[#C69BA5] hover:text-[#F4EDEF]"
                >
                  <Mic className="w-3.5 h-3.5 text-[#C69BA5]" />
                  <span>Dictate (Mic)</span>
                </button>
              ) : (
                <div className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-[#754653] bg-[#482832] px-2.5 py-1">
                  <button
                    type="button"
                    onClick={toggleMic}
                    className="flex h-6 shrink-0 items-center gap-1 rounded bg-[#754653] px-2 text-xs font-mono font-bold text-[#F4EDEF] transition-colors hover:bg-[#C6A0A7] hover:text-[#241910]"
                  >
                    <Mic className="w-3 h-3 text-[#F4EDEF]" />
                    <span>Stop</span>
                  </button>
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#C69BA5]" />
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

            <div className="flex shrink-0 items-center gap-2 text-[#B9A5AA]">
              <span className="text-[#C69BA5] uppercase">{domain.id}:{roleId.split('_')[1] || 'lead'}</span>
              <span>·</span>
              <span className="text-[#D5BFC3] uppercase">{difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
