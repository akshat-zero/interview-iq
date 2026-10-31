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
    weight: 30,
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
    weight: 20,
    subtitle: 'Edge cases, failure modes & blind spots',
    description:
      'Audits what you overlooked: failure modes, partition recovery, human burnout, or vocal fatigue.',
    rule: 'Proactively anticipating interviewer follow-up drills.',
  },
];

export const RubricExplainerModal: React.FC<RubricExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-xs">
      <div className="settings-dialog-pop relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
              Evaluation Engine Specification
            </div>
            <h2 className="font-title mt-0.5 text-2xl text-foreground">
              The 4-Pillar Rubric
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pillars List */}
        <div className="space-y-3">
          {PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-background/60 p-4"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-ui text-xs font-medium uppercase tracking-wide text-foreground">
                  {idx + 1}. {p.title}
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {p.weight}% weight
                </span>
              </div>

              <div className="mb-2.5">
                <ConfidenceRail value={p.weight * 3} />
              </div>

              <p className="lh-prose mb-2 text-sm text-muted-foreground">
                {p.description}
              </p>

              <div className="font-ui text-[11px] text-foreground/80">
                ✓ {p.rule}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[6px] bg-primary px-4 font-ui text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
