import React from 'react';
import { PillarEvaluation } from '../types/interview';
import { ConfidenceRail } from './LhPrimitives';

interface PillarCardProps {
  pillar: PillarEvaluation;
  accentClass?: string;
}

export const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => {
  const verdictTone =
    pillar.verdict === 'Exceptional' || pillar.verdict === 'Strong'
      ? 'bg-green-500/15 text-green-500'
      : pillar.verdict === 'Adequate'
      ? 'bg-amber-500/15 text-amber-400'
      : 'bg-red-500/15 text-red-500';

  return (
    <div className="lh-card-enter flex flex-col justify-between rounded-xl border border-border bg-card p-4 text-card-foreground">
      <div>
        {/* Eyebrow + Verdict */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-ui text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>{pillar.title}</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] ${verdictTone}`}>
              {pillar.verdict.toLowerCase()}
            </span>
          </div>
          <span className="font-mono text-sm tabular-nums text-foreground">
            {pillar.score}%
          </span>
        </div>

        {/* LearnHarness ConfidenceRail Bar */}
        <div className="mb-3">
          <ConfidenceRail value={pillar.score} />
        </div>

        {/* Summary */}
        <p className="lh-prose mb-3 text-sm text-muted-foreground">
          {pillar.summary}
        </p>

        {/* Strengths & Gaps */}
        <div className="space-y-2.5 text-sm">
          <div>
            <div className="mb-1 font-ui text-[11px] uppercase tracking-wider text-muted-foreground">
              Strengths
            </div>
            <ul className="space-y-1">
              {pillar.strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-2.5 py-1.5 font-prose text-sm text-foreground"
                >
                  <span className="mt-0.5 font-mono text-xs text-green-500">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-1 font-ui text-[11px] uppercase tracking-wider text-muted-foreground">
              Gaps
            </div>
            <ul className="space-y-1">
              {pillar.gaps.map((gap, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 font-prose text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 font-mono text-xs text-muted-foreground">–</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pro Tip Callout */}
      <div className="mt-3 border-t border-border/60 pt-2.5">
        <div className="font-prose text-xs text-muted-foreground">
          <strong className="font-ui text-[11px] uppercase tracking-wide text-foreground">
            Note:{' '}
          </strong>
          {pillar.actionableTip}
        </div>
      </div>
    </div>
  );
};
