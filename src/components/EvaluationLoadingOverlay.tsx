import React from 'react';
import { BrailleSpinner } from './LhPrimitives';

interface EvaluationLoadingOverlayProps {
  currentStepText: string;
}

export const EvaluationLoadingOverlay: React.FC<EvaluationLoadingOverlayProps> = ({
  currentStepText,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#241910]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop w-full max-w-md rounded-2xl border border-[#513A42] bg-[#44323A] p-6 shadow-2xl shadow-[#482832]/60">
        <div className="mb-4 flex items-center justify-between border-b border-[#513A42] pb-3">
          <div className="flex items-center gap-2.5 font-ui text-xs uppercase tracking-wider text-[#C69BA5]">
            <BrailleSpinner className="h-3 w-auto text-[#C69BA5]" />
            <span>AI Interviewer</span>
          </div>
          <span className="font-mono text-xs tabular-nums text-[#D5BFC3]">
            Generating feedback
          </span>
        </div>

        <div className="space-y-2 rounded-xl border border-[#513A42] bg-[#302329] p-3.5">
          <div className="flex items-center gap-2.5 font-ui text-xs font-semibold text-[#F4EDEF]">
            <BrailleSpinner className="h-3 w-auto shrink-0 text-[#C69BA5]" />
            <span>{currentStepText || 'Preparing your AI interview feedback…'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
