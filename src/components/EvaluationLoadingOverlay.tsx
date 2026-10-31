import React from 'react';
import { BrailleSpinner } from './LhPrimitives';

interface EvaluationLoadingOverlayProps {
  currentStepText: string;
}

const STEPS = [
  'Ingesting audio transcript & analyzing semantic intent...',
  'Auditing Relevance & Accuracy against prompt constraints...',
  'Evaluating Communication structure, delivery & clarity...',
  'Measuring Domain-Specific Polish & high-leverage terminology...',
  'Extracting Actionable Gaps & generating elevated model answer...',
];

export const EvaluationLoadingOverlay: React.FC<EvaluationLoadingOverlayProps> = ({
  currentStepText,
}) => {
  const currentIndex = STEPS.findIndex((s) => s === currentStepText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="settings-dialog-pop w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5 font-ui text-xs uppercase tracking-wider text-muted-foreground">
            <BrailleSpinner />
            <span>Evaluating Response</span>
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            4-pillar harness
          </span>
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-background p-3.5">
          {STEPS.map((step, idx) => {
            const isDone = currentIndex > idx;
            const isCurrent = currentIndex === idx || (currentIndex === -1 && idx === 0);

            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 font-ui text-xs transition-colors ${
                  isDone
                    ? 'text-foreground'
                    : isCurrent
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground/50'
                }`}
              >
                <span className="w-4 shrink-0 text-center font-mono">
                  {isDone ? '✓' : isCurrent ? <BrailleSpinner /> : '·'}
                </span>
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
