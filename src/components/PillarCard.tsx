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
      ? 'bg-[#754653]/30 text-[#F4EDEF] border border-[#C69BA5]/50'
      : pillar.verdict === 'Adequate'
      ? 'bg-[#482832]/50 text-[#B18A91] border border-[#513A42]'
      : 'bg-[#302329] text-[#B9A5AA] border border-[#513A42]';

  return (
    <div className="lh-card-enter flex flex-col justify-between rounded-xl border border-[#513A42] bg-[#302329] p-4 text-[#E9DFDF] shadow-md">
      <div>
        {/* Eyebrow + Verdict */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-ui text-xs font-medium uppercase tracking-wide text-[#B18A91]">
            <span>{pillar.title}</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] ${verdictTone}`}>
              {pillar.verdict.toLowerCase()}
            </span>
          </div>
          <span className="font-mono text-sm tabular-nums text-[#F4EDEF]">
            {pillar.score}%
          </span>
        </div>

        {/* ConfidenceRail Bar */}
        <div className="mb-3">
          <ConfidenceRail value={pillar.score} />
        </div>

        {/* Summary */}
        <p className="lh-prose mb-3 text-sm text-[#D5BFC3] leading-relaxed font-sans-editorial">
          {pillar.summary}
        </p>

        {/* Strengths & Gaps */}
        <div className="space-y-2.5 text-sm">
          <div>
            <div className="mb-1 font-ui text-[11px] uppercase tracking-wider text-[#C69BA5]">
              Strengths
            </div>
            <ul className="space-y-1">
              {pillar.strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-[#754653]/40 bg-[#3B2931] px-2.5 py-1.5 font-sans-editorial text-sm text-[#E9DFDF]"
                >
                  <span className="mt-0.5 font-mono text-xs text-[#C69BA5]">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-1 font-ui text-[11px] uppercase tracking-wider text-[#B18A91]">
              Gaps
            </div>
            <ul className="space-y-1">
              {pillar.gaps.map((gap, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-[#513A42] bg-[#241910] px-2.5 py-1.5 font-sans-editorial text-sm text-[#D5BFC3]"
                >
                  <span className="mt-0.5 font-mono text-xs text-[#B18A91]">–</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pro Tip Callout */}
      <div className="mt-3 border-t border-[#513A42] pt-2.5">
        <div className="font-sans-editorial text-xs text-[#D5BFC3]">
          <strong className="font-ui text-[11px] uppercase tracking-wide text-[#F4EDEF]">
            Note:{' '}
          </strong>
          {pillar.actionableTip}
        </div>
      </div>
    </div>
  );
};
