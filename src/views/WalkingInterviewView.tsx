import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Headphones, Mic, Pause, Play, RotateCcw, Send, Volume2 } from 'lucide-react';
import { DomainInfo, DifficultyLevel, InterviewQuestion, InterviewSession, PillarKey, QuestionEvaluation } from '../types/interview';
import { AIServiceError, evaluateAnswerWithAI, requestCrossQuestionDecision } from '../services/aiInterviewService';
import { evaluateInterviewAnswer } from '../services/evaluationEngine';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface WalkingInterviewViewProps {
  domain: DomainInfo;
  roleId: string;
  difficulty: DifficultyLevel;
  questions: InterviewQuestion[];
  initialLocalFallback?: boolean;
  onFinishInterview: (session: InterviewSession) => void;
  onExit: () => void;
}

export const WalkingInterviewView: React.FC<WalkingInterviewViewProps> = ({
  domain, roleId, difficulty, questions, initialLocalFallback = false, onFinishInterview, onExit
}) => {
  const role = domain.roles.find(item => item.id === roleId) || domain.roles[0];
  const [index, setIndex] = useState(0);
  const [followUp, setFollowUp] = useState('');
  const [answer, setAnswer] = useState('');
  const [combinedAnswer, setCombinedAnswer] = useState('');
  const [followUpCount, setFollowUpCount] = useState(0);
  const [evaluations, setEvaluations] = useState<QuestionEvaluation[]>([]);
  const [localMode, setLocalMode] = useState(initialLocalFallback);
  const [isStarted, setIsStarted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const voicePrefixRef = useRef('');
  const [seconds, setSeconds] = useState(0);
  const currentQuestion = questions[index];
  const spokenQuestion = followUp || currentQuestion?.prompt || '';
  const { isListening, transcript, setTranscript, isSupported: speechInputSupported, error: speechError, startListening, stopListening } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: speechOutputSupported } = useSpeechSynthesis();
  const progress = useMemo(() => Math.round((evaluations.length / Math.max(questions.length, 1)) * 100), [evaluations.length, questions.length]);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (transcript) setAnswer([voicePrefixRef.current, transcript].filter(Boolean).join('\n'));
  }, [transcript]);

  useEffect(() => {
    if (!speechInputSupported || speechError) setInputMode('text');
  }, [speechInputSupported, speechError]);

  useEffect(() => () => {
    stopListening();
    stopSpeaking();
  }, []);

  const readQuestion = () => {
    if (!spokenQuestion) return;
    setIsStarted(true);
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    speak(spokenQuestion);
  };

  const localEvaluation = (fullAnswer: string) => evaluateInterviewAnswer({
    question: currentQuestion,
    userAnswer: fullAnswer,
    timeSpentSeconds: seconds,
    inputMethod: inputMode,
    domain
  });

  const finalize = (all: QuestionEvaluation[]) => {
    const average = (values: number[]) => Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1));
    const avgScore = average(all.map(item => item.overallScore));
    const keys: PillarKey[] = ['relevanceAccuracy', 'communicationDelivery', 'domainPolish', 'actionableGaps'];
    const averagePillarScores = Object.fromEntries(keys.map(key => [key, average(all.map(item => item.pillars[key].score))])) as InterviewSession['averagePillarScores'];
    const hireVerdict: InterviewSession['hireVerdict'] = avgScore >= 90 ? 'Strong Hire' : avgScore >= 82 ? 'Hire' : avgScore >= 74 ? 'Leaning Hire' : avgScore >= 60 ? 'Borderline' : avgScore >= 40 ? 'Needs Improvement' : 'Strong No Hire';
    onFinishInterview({
      id: `walking-session-${Date.now()}`,
      createdAt: new Date().toISOString(),
      domainId: domain.id,
      domainTitle: domain.title,
      roleName: role.name,
      difficulty,
      questions,
      evaluations: all,
      evaluationSource: all.every(item => item.evaluationSource === 'ai') ? 'ai' : all.every(item => item.evaluationSource !== 'ai') ? 'local' : 'mixed',
      overallScore: avgScore,
      averagePillarScores,
      hireVerdict,
      keyStrengths: [...new Set(all.flatMap(item => Object.values(item.pillars).flatMap(pillar => pillar.strengths)))].slice(0, 4),
      criticalImprovements: [...new Set(all.flatMap(item => Object.values(item.pillars).flatMap(pillar => pillar.gaps)))].slice(0, 4),
      totalTimeSeconds: seconds
    });
  };

  const submitAnswer = async () => {
    if (!answer.trim() || isThinking || !currentQuestion) return;
    stopListening();
    stopSpeaking();
    setIsThinking(true);
    setError('');
    const responsePart = answer.trim();
    const completeAnswer = combinedAnswer
      ? `${combinedAnswer}\n\nFollow-up ${followUpCount}: ${responsePart}`
      : `Answer: ${responsePart}`;
    try {
      let nextLocalMode = localMode;
      let decision: Awaited<ReturnType<typeof requestCrossQuestionDecision>> | null = null;
      if (!nextLocalMode) {
        try {
          decision = await requestCrossQuestionDecision({ question: currentQuestion.prompt, answer: completeAnswer, domain: domain.title, role: role.name, difficulty });
        } catch (failure) {
          if (!(failure instanceof AIServiceError) || failure.code !== 'AI_CREDITS') throw failure;
          nextLocalMode = true;
          setLocalMode(true);
          setNotice('AI usage reached its limit, so this walking interview is continuing with local practice feedback.');
        }
      }

      let evaluation: QuestionEvaluation | null = null;
      let needsFollowUp = false;
      if (nextLocalMode) {
        evaluation = { ...(await localEvaluation(completeAnswer)), evaluationSource: 'local' };
        needsFollowUp = !evaluation.rubricSatisfied;
      } else if (decision && !decision.satisfied) {
        needsFollowUp = true;
      } else {
        try {
          evaluation = await evaluateAnswerWithAI({ question: currentQuestion, answer: completeAnswer, domain: domain.title, role: role.name, difficulty, inputMethod, timeSpentSeconds: seconds });
        } catch (failure) {
          if (!(failure instanceof AIServiceError) || failure.code !== 'AI_CREDITS') throw failure;
          nextLocalMode = true;
          setLocalMode(true);
          setNotice('AI usage reached its limit, so the remaining interview is continuing with local practice feedback.');
          evaluation = { ...(await localEvaluation(completeAnswer)), evaluationSource: 'local' };
          needsFollowUp = !evaluation.rubricSatisfied;
        }
      }

      if (needsFollowUp) {
        const localPrompt = evaluation?.executiveSummary.toLowerCase().includes('too short or repetitive')
          ? 'Could you add a specific example and explain what you did and what happened?'
          : evaluation?.missingConcepts?.length
            ? `Could you explain how ${evaluation.missingConcepts.slice(0, 2).join(' and ')} affect your approach?`
            : 'Could you give a concrete example and explain the result?';
        const nextPrompt = nextLocalMode ? localPrompt : decision?.followUp.trim();
        if (!nextPrompt) throw new Error('The interviewer could not prepare a follow-up. Please try again.');
        setCombinedAnswer(completeAnswer);
        setFollowUpCount(value => value + 1);
        setFollowUp(nextPrompt);
        setAnswer('');
        setTranscript('');
        setIsThinking(false);
        speak(nextPrompt);
        return;
      }

      if (!evaluation) throw new Error('The interviewer could not evaluate this answer. Please try again.');
      const completedEvaluation = { ...evaluation, inputMethod };
      const nextEvaluations = [...evaluations, completedEvaluation];
      setEvaluations(nextEvaluations);
      if (index + 1 >= questions.length) {
        finalize(nextEvaluations);
        return;
      }
      setIndex(value => value + 1);
      setFollowUp('');
      setFollowUpCount(0);
      setCombinedAnswer('');
      setAnswer('');
      setTranscript('');
      voicePrefixRef.current = '';
      setIsThinking(false);
      window.setTimeout(() => speak(questions[index + 1].prompt), 150);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'The AI interviewer is unavailable. Your answer is still here; please try again.');
      setIsThinking(false);
    }
  };

  if (!currentQuestion) return null;
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <main className="flex h-dvh flex-col overflow-y-auto bg-[#241910] text-[#E9DFDF]">
      <header className="flex items-center justify-between border-b border-[#513A42] px-5 py-3 sm:px-8">
        <button type="button" onClick={onExit} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#D5BFC3] hover:bg-[#302329] hover:text-[#F4EDEF]"><ArrowLeft className="h-4 w-4" />Exit walk</button>
        <div className="text-center"><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C69BA5]">Walking Interview</div><div className="text-xs text-[#B9A5AA]">{role.name} · {mins}:{secs}</div></div>
        <div className="flex items-center gap-2 text-xs text-[#B9A5AA]"><Headphones className="h-4 w-4 text-[#C69BA5]" /><span>{index + 1}/{questions.length}</span></div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-8 sm:px-8">
        <div className="mb-7">
          <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#B18A91]"><span>{domain.title}</span><span>{evaluations.length} completed</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#302329]"><div className="h-full rounded-full bg-[#C69BA5] transition-all" style={{ width: `${progress}%` }} /></div>
        </div>

        <div className="mb-5 rounded-3xl border border-[#754653]/80 bg-[#44323A] p-6 shadow-xl shadow-black/10 sm:p-9">
          <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#C69BA5]"><span className={`h-2 w-2 rounded-full ${isSpeaking ? 'animate-pulse bg-emerald-300' : 'bg-[#754653]'}`} />{isSpeaking ? 'Interviewer speaking' : followUp ? 'Follow-up question' : 'Interviewer'}</div>
          <p className="font-editorial text-2xl leading-relaxed text-[#F4EDEF] sm:text-3xl">{spokenQuestion}</p>
          <button type="button" onClick={readQuestion} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#754653] px-3 py-2 text-xs text-[#D5BFC3] hover:bg-[#754653]/40"><Volume2 className="h-4 w-4" />{isSpeaking ? 'Stop speaking' : 'Repeat question'}</button>
        </div>

        {!isStarted && <p className="mb-4 text-center text-sm text-[#B9A5AA]">Put on your headphones, start walking when you’re ready, then begin the conversation. Stay aware of your surroundings.</p>}

        {speechInputSupported && inputMode === 'voice' && !speechError ? (
          <div className="mb-4 rounded-2xl border border-[#513A42] bg-[#302329] p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-widest text-[#C69BA5]">Your answer</span><span className="text-xs text-[#B9A5AA]">{isListening ? 'Listening… tap pause when done' : 'Microphone paused'}</span></div>
            <div className="min-h-20 whitespace-pre-wrap text-sm leading-relaxed text-[#F4EDEF]">{answer || <span className="text-[#8F767C]">Your speech transcript will appear here…</span>}</div>
          </div>
        ) : (
          <label className="mb-4 block"><span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#C69BA5]">Text answer</span><textarea value={answer} onChange={event => setAnswer(event.target.value)} rows={5} className="w-full resize-y rounded-2xl border border-[#513A42] bg-[#302329] p-4 text-sm leading-relaxed text-[#F4EDEF] outline-none focus:border-[#C69BA5]" placeholder="Type your answer here…" /></label>
        )}

        {speechError && <p role="alert" className="mb-3 text-sm text-rose-300">{speechError} You can type your answer instead.</p>}
        {notice && <p className="mb-3 rounded-lg border border-[#754653] bg-[#302329] px-3 py-2 text-xs text-[#D5BFC3]">{notice}</p>}
        {error && <p role="alert" className="mb-3 rounded-lg border border-rose-900/70 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">{error}</p>}

        <div className="mb-3 flex justify-center gap-2">
          {speechInputSupported && !speechError && <button type="button" onClick={() => { stopListening(); const nextMode = inputMode === 'voice' ? 'text' : 'voice'; if (nextMode === 'voice') { voicePrefixRef.current = answer.trim(); setTranscript(''); } setInputMode(nextMode); setError(''); }} className="rounded-lg px-3 py-2 text-xs text-[#B9A5AA] underline decoration-[#754653] underline-offset-4 hover:text-[#F4EDEF]">{inputMode === 'voice' ? 'Switch to text' : 'Switch to voice'}</button>}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {!isStarted && <button type="button" onClick={readQuestion} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#754653] px-5 py-3 text-sm font-semibold text-white hover:bg-[#916370]"><Play className="h-4 w-4" />Begin walk</button>}
          {speechInputSupported && inputMode === 'voice' && !speechError && <button type="button" disabled={isThinking} onClick={() => isListening ? stopListening() : (stopSpeaking(), setIsStarted(true), startListening())} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#754653] bg-[#302329] px-5 py-3 text-sm font-semibold text-[#F4EDEF] disabled:opacity-50">{isListening ? <><Pause className="h-4 w-4" />Pause mic</> : <><Mic className="h-4 w-4" />{answer ? 'Continue answering' : 'Answer aloud'}</>}</button>}
          <button type="button" disabled={!answer.trim() || isThinking} onClick={() => void submitAnswer()} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#C69BA5]/70 bg-[#C69BA5] px-5 py-3 text-sm font-bold text-[#241910] hover:bg-[#D8B5BD] disabled:cursor-not-allowed disabled:opacity-40">{isThinking ? <><RotateCcw className="h-4 w-4 animate-spin" />Thinking…</> : <><Send className="h-4 w-4" />{isListening ? 'Finish answer' : 'Send answer'}</>}</button>
        </div>
        <div className="mt-5 text-center text-[11px] text-[#8F767C]">{speechOutputSupported ? 'Audio plays through your device. Stop playback or pause the microphone any time.' : 'Speech playback is unavailable in this browser. Read the questions on screen and answer by text.'} Speech is transcribed by your browser; this app does not record or save audio. AI feedback uses the transcript.</div>
      </section>
    </main>
  );
};
