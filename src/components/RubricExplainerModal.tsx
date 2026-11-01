import React from 'react';
import { X } from 'lucide-react';

interface RubricExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PILLARS = [
  {
    title: 'Relevance & Accuracy',
    subtitle: 'Relevance and sound reasoning',
    description:
      'Evaluates whether you directly resolved the core challenge posed without digressing or rambling. Off-topic responses receive severe penalties.',
    rule: 'Connect your answer to the question and explain your reasoning.',
  },
  {
    title: 'Communication & Delivery',
    subtitle: 'Clarity and organization',
    description:
      'Considers whether your answer is understandable, organized, and appropriately concise.',
    rule: 'Use examples or signposting when they make your explanation easier to follow.',
  },
  {
    title: 'Domain-Specific Polish',
    subtitle: 'Role-specific knowledge',
    description:
      'Measures fluency in authentic professional terminology (e.g. idempotency, p99 latency, zero-based budgeting, appoggio acoustics).',
    rule: 'Explicit trade-off justifications over generic buzzwords.',
  },
  {
    title: 'Actionable Gaps',
    subtitle: 'Completeness and risks',
    description:
      'Audits what you overlooked: failure modes, partition recovery, human burnout, or vocal fatigue.',
    rule: 'Proactively anticipating interviewer follow-up drills.',
  },
];

export const RubricExplainerModal: React.FC<RubricExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#241910]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop relative my-8 w-full max-w-2xl rounded-2xl border border-[#513A42] bg-[#44323A] p-6 text-[#E9DFDF] shadow-2xl shadow-[#482832]/60 font-sans-editorial">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-[#513A42] pb-3">
          <div>
            <div className="font-ui text-xs uppercase tracking-wider text-[#C69BA5]">
              AI Feedback Guide
            </div>
            <h2 className="font-editorial mt-0.5 text-2xl text-[#F4EDEF] font-bold">
              The 4-Pillar Rubric
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#B18A91] transition-colors hover:bg-[#3B2931] hover:text-[#F4EDEF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pillars List */}
        <div className="space-y-3">
          {PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#513A42] bg-[#302329] p-4"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-ui text-xs font-semibold uppercase tracking-wide text-[#F4EDEF]">
                  {idx + 1}. {p.title}
                </span>
                <span className="font-mono text-xs tabular-nums text-[#C69BA5] font-semibold">
                  AI-scored area
                </span>
              </div>

              <p className="lh-prose mb-2 text-sm text-[#D5BFC3] leading-relaxed">
                {p.description}
              </p>

              <div className="font-ui text-[11px] text-[#E9DFDF] flex items-center gap-1.5">
                <span className="text-[#C69BA5]">✓</span>
                <span>{p.rule}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#B9A5AA]">
          AI-generated scores and feedback can be mistaken or inconsistent. Use them for practice, not as a hiring decision or a verified measure of ability.
        </p>

        {/* Footer */}
        <div className="mt-5 flex justify-end border-t border-[#513A42] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-[#B18A91]/50 bg-[#754653] px-5 font-ui text-xs font-bold text-[#F4EDEF] transition-all hover:bg-[#C6A0A7] hover:text-[#241910] shadow-md shadow-[#482832]/50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
