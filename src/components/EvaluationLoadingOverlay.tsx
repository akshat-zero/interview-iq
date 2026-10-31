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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#241910]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop w-full max-w-md rounded-2xl border border-[#513A42] bg-[#44323A] p-6 shadow-2xl shadow-[#482832]/60">
        <div className="mb-4 flex items-center justify-between border-b border-[#513A42] pb-3">
          <div className="flex items-center gap-2.5 font-ui text-xs uppercase tracking-wider text-[#C69BA5]">
            <BrailleSpinner className="h-3 w-auto text-[#C69BA5]" />
            <span>Evaluating Response</span>
          </div>
          <span className="font-mono text-xs tabular-nums text-[#D5BFC3]">
            4-pillar harness
          </span>
        </div>

        <div className="space-y-2 rounded-xl border border-[#513A42] bg-[#302329] p-3.5">
          {STEPS.map((step, idx) => {
            const isDone = currentIndex > idx;
            const isCurrent = currentIndex === idx || (currentIndex === -1 && idx === 0);

            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 font-ui text-xs transition-colors ${
                  isDone
                    ? 'text-[#E9DFDF]'
                    : isCurrent
                    ? 'text-[#F4EDEF] font-semibold'
                    : 'text-[#B9A5AA]/50'
                }`}
              >
                <span className="w-4 shrink-0 text-center font-mono">
                  {isDone ? <span className="text-[#C69BA5]">✓</span> : isCurrent ? <BrailleSpinner className="h-3 w-auto text-[#C69BA5]" /> : '·'}
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
