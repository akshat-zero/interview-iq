import React, { useState, useEffect, useRef } from 'react';
import {
  DomainInfo,
  DifficultyLevel,
  InterviewQuestion,
  QuestionEvaluation,
  InterviewSession,
  PillarKey
} from '../types/interview';
import { AIServiceError, evaluateAnswerWithAI, requestCrossQuestionDecision } from '../services/aiInterviewService';
import { evaluateInterviewAnswer } from '../services/evaluationEngine';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { EvaluationLoadingOverlay } from '../components/EvaluationLoadingOverlay';
import { QuestionFeedbackModal } from '../components/QuestionFeedbackModal';
import { VideoCoachPanel } from '../components/VideoCoachPanel';
import {
  TopBar,
  ConfidenceRail,
  ThinkingBlock
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
  fallbackQuestions: InterviewQuestion[];
  initialLocalFallback?: boolean;
  initialFallbackNotice?: string;
  onLocalFallbackActivated?: (questions: InterviewQuestion[]) => void;
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
  fallbackQuestions,
  initialLocalFallback = false,
  initialFallbackNotice = '',
  onLocalFallbackActivated,
  onFinishInterview,
  sidebarOpen = true,
  onToggleSidebar
}) => {
  const [sessionQuestions, setSessionQuestions] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseQuestion = sessionQuestions[currentIndex] || sessionQuestions[0];
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [followUpCount, setFollowUpCount] = useState(0);
  const [cumulativeAnswer, setCumulativeAnswer] = useState('');
  const [followUpReason, setFollowUpReason] = useState('');
  const [followUpSource, setFollowUpSource] = useState<'ai' | 'local'>('ai');
  const [isLocalFallback, setIsLocalFallback] = useState(initialLocalFallback);
  const [localFallbackNotice, setLocalFallbackNotice] = useState(initialFallbackNotice);
  const currentQuestion = followUpPrompt
    ? { ...baseQuestion, prompt: followUpPrompt, contextNotes: 'Follow-up on your previous answer. Keep building on the same main question.' }
    : baseQuestion;

  // User Answer state
  const [userAnswer, setUserAnswer] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');
  const [showHints, setShowHints] = useState(false);

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
  const [serviceError, setServiceError] = useState('');

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

  const activateLocalFallback = () => {
    setIsLocalFallback(true);
    const questionsSoFar = sessionQuestions.slice(0, currentIndex + 1);
    const alreadyAsked = new Set(questionsSoFar.map(question => question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()));
    const remainingCount = Math.max(0, sessionQuestions.length - questionsSoFar.length);
    const localQuestions = fallbackQuestions
      .filter(question => !alreadyAsked.has(question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()))
      .slice(0, remainingCount);
    setSessionQuestions([...questionsSoFar, ...localQuestions]);
    onLocalFallbackActivated?.(localQuestions);
    setLocalFallbackNotice(
      `OpenAI API credits ran out during this interview. The local practice rubric will handle follow-ups and evaluations, and remaining main questions will come from the built-in bank${localQuestions.length < remainingCount ? ` (${localQuestions.length} role-specific questions available)` : ''}.`
    );
  };

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

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    stopRecording();
    stopSpeaking();
    setIsEvaluating(true);
    setServiceError('');

    try {
      const combinedAnswer = cumulativeAnswer
        ? `${cumulativeAnswer}\n\nFollow-up ${followUpCount}: ${userAnswer.trim()}`
        : `Answer: ${userAnswer.trim()}`;
      const evaluateLocally = async () => {
        const localEvaluation = await evaluateInterviewAnswer({
          question: baseQuestion,
          userAnswer: combinedAnswer,
          timeSpentSeconds: questionSeconds,
          inputMethod: inputMode,
          domain
        });
        return { ...localEvaluation, evaluationSource: 'local' as const };
      };

      let useLocalRubric = isLocalFallback;
      let aiDecision: Awaited<ReturnType<typeof requestCrossQuestionDecision>> | null = null;
      let evaluation: QuestionEvaluation | null = null;
      if (!useLocalRubric) {
        setEvaluationStep('Asking the AI interviewer whether a follow-up is needed...');
        try {
          aiDecision = await requestCrossQuestionDecision({
            question: baseQuestion.prompt,
            answer: combinedAnswer,
            domain: domain.title,
            role: currentRole.name,
            difficulty
          });
        } catch (error) {
          if (!(error instanceof AIServiceError) || error.code !== 'AI_CREDITS') throw error;
          useLocalRubric = true;
          activateLocalFallback();
        }
      }

      let needsFollowUp: boolean;
      if (useLocalRubric) {
        setEvaluationStep('Checking your answer with the built-in practice rubric...');
        evaluation = await evaluateLocally();
        needsFollowUp = !evaluation.rubricSatisfied;
      } else if (aiDecision && !aiDecision.satisfied) {
        needsFollowUp = true;
      } else {
        setEvaluationStep('Generating your AI evaluation and feedback...');
        try {
          evaluation = await evaluateAnswerWithAI({
            question: baseQuestion,
            answer: combinedAnswer,
            domain: domain.title,
            role: currentRole.name,
            difficulty,
            inputMethod: inputMode,
            timeSpentSeconds: questionSeconds
          });
          needsFollowUp = false;
        } catch (error) {
          if (!(error instanceof AIServiceError) || error.code !== 'AI_CREDITS') throw error;
          useLocalRubric = true;
          activateLocalFallback();
          setEvaluationStep('Checking your answer with the built-in practice rubric...');
          evaluation = await evaluateLocally();
          needsFollowUp = !evaluation.rubricSatisfied;
        }
      }

      if (needsFollowUp) {
        const nextFollowUp = followUpCount + 1;
        const concepts = (evaluation?.missingConcepts || []).slice(0, 2);
        const localPrompt = evaluation?.executiveSummary.toLowerCase().includes('too short or repetitive')
          ? 'Please expand your answer with a specific example. What did you do, why did you choose that approach, and what happened?'
          : evaluation?.executiveSummary.toLowerCase().includes('did not include terms')
            ? `Please answer the original question directly: ${baseQuestion.prompt}`
            : concepts.length
              ? `You have not yet covered ${concepts.join(' and ')}. How do these affect your approach to the original question?`
              : 'Can you add a concrete example, explain your reasoning, and describe the outcome?';
        const nextPrompt = useLocalRubric ? localPrompt : aiDecision?.followUp.trim();
        if (!nextPrompt) throw new Error('The interviewer could not provide a follow-up. Please submit your answer again.');

        setCumulativeAnswer(combinedAnswer);
        setFollowUpCount(nextFollowUp);
        setFollowUpPrompt(nextPrompt);
        setFollowUpSource(useLocalRubric ? 'local' : 'ai');
        setFollowUpReason(useLocalRubric
          ? 'The local practice rubric needs more relevant detail.'
          : aiDecision?.reason || 'The answer needs more detail.');
        setUserAnswer('');
        resetRecording();
        setIsEvaluating(false);
        setTimeout(() => transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
        return;
      }

      if (!evaluation) throw new Error('The interview could not evaluate this answer. Please submit it again.');
      setCumulativeAnswer(combinedAnswer);
      setCurrentEvaluation(evaluation);
      setEvaluations(prev => [...prev, evaluation]);
      setIsEvaluating(false);
      setShowFeedbackModal(true);
    } catch (err) {
      console.error('Evaluation error:', err);
      setServiceError(err instanceof Error ? err.message : 'The AI service is unavailable. Your answer is still here; please retry.');
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedbackModal(false);
    setCurrentEvaluation(null);
    setFollowUpPrompt('');
    setFollowUpCount(0);
    setFollowUpSource('ai');
    setCumulativeAnswer('');
    setFollowUpReason('');
    setServiceError('');
    setUserAnswer('');
    resetRecording();
    setQuestionSeconds(0);
    setShowHints(false);
    setIsPlayingRecordedAudio(false);

    if (currentIndex + 1 < sessionQuestions.length) {
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
      questions: sessionQuestions,
      evaluations: allEvals,
      evaluationSource: allEvals.every(evaluation => evaluation.evaluationSource === 'ai')
        ? 'ai'
        : allEvals.every(evaluation => evaluation.evaluationSource !== 'ai') ? 'local' : 'mixed',
      overallScore: avgScore,
      averagePillarScores,
      hireVerdict,
      keyStrengths: [...new Set(allEvals.flatMap(evaluation =>
        Object.values(evaluation.pillars).flatMap(pillar => pillar.strengths)
      ))].slice(0, 4),
      criticalImprovements: [...new Set(allEvals.flatMap(evaluation =>
        Object.values(evaluation.pillars).flatMap(pillar => pillar.gaps)
      ))].slice(0, 4),
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
          totalQuestions={sessionQuestions.length}
          onNextQuestion={handleNextQuestion}
          onFinishSession={() => {
            setShowFeedbackModal(false);
            finishEntireSession(evaluations);
          }}
          isLastQuestion={currentIndex + 1 === sessionQuestions.length}
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
              {currentIndex + 1} / {sessionQuestions.length}
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
            {isLocalFallback && (
              <div role="status" className="rounded-lg border border-amber-400/30 bg-amber-950/20 px-3.5 py-2.5 text-sm text-amber-100">
                <span className="font-mono text-[11px] uppercase tracking-wider">Local fallback active</span>
                <p className="mt-1">{localFallbackNotice || 'Using the built-in question bank and practice rubric because OpenAI API credits are unavailable.'}</p>
              </div>
            )}
            <div className="font-editorial text-2xl sm:text-3xl text-[#F4EDEF] tracking-tight leading-snug">
              <p>{baseQuestion.prompt}</p>
            </div>

            {followUpPrompt && (
              <div className="rounded-lg border border-[#C69BA5]/40 bg-[#3B2931]/50 px-3.5 py-2.5 text-sm text-[#D5BFC3] font-sans-editorial">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#C69BA5]">{followUpSource === 'ai' ? 'AI interviewer' : 'Local rubric'} · Follow-up {followUpCount}</span>
                <p className="mt-1 text-[#F4EDEF]">{followUpPrompt}</p>
                <p className="mt-2 text-xs">{followUpReason} Your answers are combined; the next main question appears when the answer is judged sufficient.</p>
              </div>
            )}

            <p className="font-sans-editorial text-sm sm:text-base text-[#D5BFC3] leading-relaxed">
              {baseQuestion.contextNotes}
            </p>

            <VideoCoachPanel paused={showFeedbackModal || isEvaluating} />

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
            {/* Current prompt label */}
            <div className="px-4 py-2.5 text-xs font-mono text-[#D5BFC3] bg-[#3B2931]/70 border-b border-[#513A42]">
              <span className="uppercase tracking-wider text-[#C69BA5] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C69BA5]" />
                Probe · {currentQuestion.category}
              </span>
            </div>

            {/* YOUR THINKING Field */}
            <form
              className="p-2.5 bg-[#241910]/80"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {serviceError && (
                <p role="alert" className="mb-2 rounded-lg border border-red-400/30 bg-red-950/20 px-3 py-2 text-sm text-red-200">
                  {serviceError} Your answer is still here. You can retry when the AI service is available.
                </p>
              )}
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
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setServiceError('');
                  }}
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
