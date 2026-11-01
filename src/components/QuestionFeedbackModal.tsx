import React from 'react';
import { QuestionEvaluation } from '../types/interview';
import { PillarCard } from './PillarCard';
import { RubricBadge } from './RubricBadge';
import { ConfidenceRail, ThinkingBlock } from './LhPrimitives';
import { ArrowRight } from 'lucide-react';

interface QuestionFeedbackModalProps {
  evaluation: QuestionEvaluation;
  questionNumber: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  onFinishSession?: () => void;
  isLastQuestion: boolean;
}

export const QuestionFeedbackModal: React.FC<QuestionFeedbackModalProps> = ({
  evaluation,
  questionNumber,
  totalQuestions,
  onNextQuestion,
  onFinishSession,
  isLastQuestion,
}) => {
  const isLocalEvaluation = evaluation.evaluationSource !== 'ai';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#241910]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop my-8 w-full max-w-4xl rounded-2xl border border-[#513A42] bg-[#44323A] p-6 text-[#E9DFDF] shadow-2xl shadow-[#482832]/60">
        {/* Top Eyebrow Row */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#513A42] pb-3">
          <div className="flex items-center gap-2 font-ui text-xs uppercase tracking-wider text-[#C69BA5]">
            <span>
              Probe {questionNumber} / {totalQuestions}
            </span>
            <span>·</span>
            <span>{evaluation.category}</span>
            <span className="font-mono text-[10px] text-[#B9A5AA]">
              {isLocalEvaluation ? 'Local rubric fallback' : 'AI practice evaluation'}
            </span>
            <RubricBadge type="recommendation" value={evaluation.hireRecommendation} />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-mono text-lg font-semibold tabular-nums text-[#F4EDEF]">
              {evaluation.overallScore}%
            </span>
            <RubricBadge type="grade" value={evaluation.grade} />
          </div>
        </div>

        <p className="mb-3 rounded-md border border-[#513A42] bg-[#302329] px-3 py-2 text-xs text-[#B9A5AA]">
          {isLocalEvaluation
            ? 'This answer was checked with the built-in local rubric because OpenAI API credits were unavailable. Voice answers are assessed from their transcript; spoken cadence is not evaluated.'
            : 'AI-generated practice feedback can be imperfect and is not a hiring recommendation. Voice answers are assessed from their transcript; spoken cadence is not evaluated.'}
        </p>

        {/* Confidence Rail Readout */}
        <div className="mb-4 flex items-center gap-3">
          <span className="font-ui text-xs uppercase tracking-wide text-[#B18A91]">
            Score
          </span>
          <ConfidenceRail value={evaluation.overallScore} className="flex-1" />
          <span className="w-10 text-right font-mono text-xs tabular-nums text-[#C69BA5]">
            {evaluation.overallScore}/100
          </span>
        </div>

        {/* User Thinking Block */}
        <ThinkingBlock
          label={`YOUR THINKING (${evaluation.inputMethod === 'voice' ? 'DICTATED' : 'TYPED'})`}
          text={evaluation.userAnswer}
          defaultOpen={false}
          inCard
        />

        {/* Executive Synthesis Callout */}
        <div className="my-4 rounded-lg border border-[#513A42] bg-[#302329] px-4 py-3">
          <p className="lh-prose text-sm text-[#E9DFDF] font-sans-editorial leading-relaxed">
            <strong className="text-[#C69BA5] font-ui text-xs uppercase tracking-wider">Assessment: </strong>
            {evaluation.executiveSummary}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <PillarCard pillar={evaluation.pillars.relevanceAccuracy} />
          <PillarCard pillar={evaluation.pillars.communicationDelivery} />
          <PillarCard pillar={evaluation.pillars.domainPolish} />
          <PillarCard pillar={evaluation.pillars.actionableGaps} />
        </div>

        {/* Footer Action Bar */}
        <div className="mt-5 flex items-center justify-between border-t border-[#513A42] pt-4">
          <span className="font-ui text-xs text-[#B9A5AA]">
            ↵ continues to {isLastQuestion ? 'session scorecard' : `question ${questionNumber + 1}`}
          </span>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={onFinishSession || onNextQuestion}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#C69BA5] bg-[#754653] px-5 font-ui text-xs font-bold uppercase tracking-wide text-[#F4EDEF] transition-all hover:bg-[#C6A0A7] hover:text-[#241910] shadow-md shadow-[#482832]/50"
            >
              <span>View scorecard</span>
              <ArrowRight className="w-4 h-4 text-[#F4EDEF]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#B18A91]/50 bg-[#754653] px-5 font-ui text-xs font-semibold uppercase tracking-wide text-[#F4EDEF] transition-all hover:bg-[#C6A0A7] hover:text-[#241910] shadow-md shadow-[#482832]/50"
            >
              <span>Next problem</span>
              <ArrowRight className="w-4 h-4 text-[#F4EDEF]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
