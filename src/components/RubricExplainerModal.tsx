import React from 'react';
import { X } from 'lucide-react';
import { ConfidenceRail } from './LhPrimitives';

interface RubricExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PILLARS = [
  {
    title: 'Relevance & Accuracy',
    weight: 35,
    subtitle: 'Semantic precision & technical truth',
    description:
      'Evaluates whether you directly resolved the core challenge posed without digressing or rambling. Off-topic responses receive severe penalties.',
    rule: 'Direct problem resolution under explicit scenario constraints.',
  },
  {
    title: 'Communication & Delivery',
    weight: 25,
    subtitle: 'Structure, conciseness & composure',
    description:
      'Assesses verbal cadence, structural frameworks (STAR, MECE, top-down synthesis), and executive clarity under pressure.',
    rule: 'Clear signposting (First, Second, Trade-offs) and thesis-first synthesis.',
  },
  {
    title: 'Domain-Specific Polish',
    weight: 25,
    subtitle: 'Industry lexicon & trade-off mastery',
    description:
      'Measures fluency in authentic professional terminology (e.g. idempotency, p99 latency, zero-based budgeting, appoggio acoustics).',
    rule: 'Explicit trade-off justifications over generic buzzwords.',
  },
  {
    title: 'Actionable Gaps',
    weight: 15,
    subtitle: 'Edge cases, failure modes & blind spots',
    description:
      'Audits what you overlooked: failure modes, partition recovery, human burnout, or vocal fatigue.',
    rule: 'Proactively anticipating interviewer follow-up drills.',
  },
];

export const RubricExplainerModal: React.FC<RubricExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0C0F14]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop relative my-8 w-full max-w-2xl rounded-2xl border border-[#281E1C] bg-[#12161F] p-6 text-[#F5F1EC] shadow-2xl shadow-[#3A1D19]/50 font-sans-editorial">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-[#281E1C] pb-3">
          <div>
            <div className="font-ui text-xs uppercase tracking-wider text-[#A55534]">
              Evaluation Engine Specification
            </div>
            <h2 className="font-editorial mt-0.5 text-2xl text-[#F5F1EC] font-bold">
              The 4-Pillar Rubric
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#C68C6E] transition-colors hover:bg-[#241A18] hover:text-[#F5F1EC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pillars List */}
        <div className="space-y-3">
          {PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#281E1C] bg-[#0C0F14] p-4"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-ui text-xs font-semibold uppercase tracking-wide text-[#F5F1EC]">
                  {idx + 1}. {p.title}
                </span>
                <span className="font-mono text-xs tabular-nums text-[#A55534] font-semibold">
                  {p.weight}% weight
                </span>
              </div>

              <div className="mb-2.5">
                <ConfidenceRail value={p.weight * 2.8} />
              </div>

              <p className="lh-prose mb-2 text-sm text-[#C68C6E] leading-relaxed">
                {p.description}
              </p>

              <div className="font-ui text-[11px] text-[#EEE9E3]/90 flex items-center gap-1.5">
                <span className="text-[#C68C6E]">✓</span>
                <span>{p.rule}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end border-t border-[#281E1C] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-[#C68C6E] bg-[#EEE9E3] px-5 font-ui text-xs font-bold text-[#0C0F14] transition-all hover:bg-[#F5F1EC] shadow-md shadow-[#A55534]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
