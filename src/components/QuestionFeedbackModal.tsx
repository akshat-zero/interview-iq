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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0C0F14]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop my-8 w-full max-w-4xl rounded-2xl border border-[#281E1C] bg-[#12161F] p-6 text-[#F5F1EC] shadow-2xl shadow-[#3A1D19]/50">
        {/* Top Eyebrow Row */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#281E1C] pb-3">
          <div className="flex items-center gap-2 font-ui text-xs uppercase tracking-wider text-[#C68C6E]">
            <span>
              Probe {questionNumber} / {totalQuestions}
            </span>
            <span>·</span>
            <span>{evaluation.category}</span>
            <RubricBadge type="recommendation" value={evaluation.hireRecommendation} />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-mono text-lg font-semibold tabular-nums text-[#F5F1EC]">
              {evaluation.overallScore}%
            </span>
            <RubricBadge type="grade" value={evaluation.grade} />
          </div>
        </div>

        {/* Confidence Rail Readout */}
        <div className="mb-4 flex items-center gap-3">
          <span className="font-ui text-xs uppercase tracking-wide text-[#C68C6E]">
            Score
          </span>
          <ConfidenceRail value={evaluation.overallScore} className="flex-1" />
          <span className="w-10 text-right font-mono text-xs tabular-nums text-[#C68C6E]">
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
        <div className="my-4 rounded-lg border border-[#281E1C] bg-[#0C0F14] px-4 py-3">
          <p className="lh-prose text-sm text-[#F5F1EC] font-sans-editorial leading-relaxed">
            <strong className="text-[#A55534] font-ui text-xs uppercase tracking-wider">Assessment: </strong>
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
        <div className="mt-5 flex items-center justify-between border-t border-[#281E1C] pt-4">
          <span className="font-ui text-xs text-[#C68C6E]/80">
            ↵ continues to {isLastQuestion ? 'session scorecard' : `question ${questionNumber + 1}`}
          </span>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={onFinishSession || onNextQuestion}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#C68C6E] bg-[#EEE9E3] px-5 font-ui text-xs font-bold uppercase tracking-wide text-[#0C0F14] transition-all hover:bg-[#F5F1EC] shadow-md shadow-[#A55534]/20"
            >
              <span>View scorecard</span>
              <ArrowRight className="w-4 h-4 text-[#A55534]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#C68C6E]/60 bg-[#A55534] px-5 font-ui text-xs font-semibold uppercase tracking-wide text-[#F5F1EC] transition-all hover:bg-[#b8613e] shadow-md shadow-[#A55534]/30"
            >
              <span>Next problem</span>
              <ArrowRight className="w-4 h-4 text-[#EEE9E3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
