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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-xs">
      <div className="settings-dialog-pop my-8 w-full max-w-4xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        {/* Top Eyebrow Row */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-ui text-xs uppercase tracking-wider text-muted-foreground">
            <span>
              Probe {questionNumber} / {totalQuestions}
            </span>
            <span>·</span>
            <span>{evaluation.category}</span>
            <RubricBadge type="recommendation" value={evaluation.hireRecommendation} />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
              {evaluation.overallScore}%
            </span>
            <RubricBadge type="grade" value={evaluation.grade} />
          </div>
        </div>

        {/* Confidence Rail Readout */}
        <div className="mb-4 flex items-center gap-3">
          <span className="font-ui text-xs uppercase tracking-wide text-muted-foreground">
            Score
          </span>
          <ConfidenceRail value={evaluation.overallScore} className="flex-1" />
          <span className="w-10 text-right font-mono text-xs tabular-nums text-muted-foreground">
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
        <div className="my-4 border border-border bg-background/80 px-4 py-3">
          <p className="lh-prose text-sm text-foreground">
            <strong>Assessment: </strong>
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
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="font-ui text-xs text-muted-foreground">
            ↵ continues to {isLastQuestion ? 'session scorecard' : `question ${questionNumber + 1}`}
          </span>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={onFinishSession || onNextQuestion}
              className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-primary px-4 font-ui text-xs font-medium uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              <span>View scorecard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-green-600 px-4 font-ui text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-green-500"
            >
              <span>Next problem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
