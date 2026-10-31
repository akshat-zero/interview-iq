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
      ? 'bg-[#C68C6E]/20 text-[#EEE9E3] border border-[#C68C6E]/40'
      : pillar.verdict === 'Adequate'
      ? 'bg-[#A55534]/20 text-[#C68C6E] border border-[#A55534]/40'
      : 'bg-[#3A1D19]/40 text-[#A55534] border border-[#3A1D19]';

  return (
    <div className="lh-card-enter flex flex-col justify-between rounded-xl border border-[#281E1C] bg-[#12161F] p-4 text-[#F5F1EC] shadow-md">
      <div>
        {/* Eyebrow + Verdict */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-ui text-xs font-medium uppercase tracking-wide text-[#C68C6E]">
            <span>{pillar.title}</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] ${verdictTone}`}>
              {pillar.verdict.toLowerCase()}
            </span>
          </div>
          <span className="font-mono text-sm tabular-nums text-[#F5F1EC]">
            {pillar.score}%
          </span>
        </div>

        {/* ConfidenceRail Bar */}
        <div className="mb-3">
          <ConfidenceRail value={pillar.score} />
        </div>

        {/* Summary */}
        <p className="lh-prose mb-3 text-sm text-[#C68C6E]/90 leading-relaxed font-sans-editorial">
          {pillar.summary}
        </p>

        {/* Strengths & Gaps */}
        <div className="space-y-2.5 text-sm">
          <div>
            <div className="mb-1 font-ui text-[11px] uppercase tracking-wider text-[#A55534]">
              Strengths
            </div>
            <ul className="space-y-1">
              {pillar.strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-[#C68C6E]/30 bg-[#241A18] px-2.5 py-1.5 font-sans-editorial text-sm text-[#F5F1EC]"
                >
                  <span className="mt-0.5 font-mono text-xs text-[#C68C6E]">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-1 font-ui text-[11px] uppercase tracking-wider text-[#A55534]">
              Gaps
            </div>
            <ul className="space-y-1">
              {pillar.gaps.map((gap, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-[#281E1C] bg-[#0C0F14] px-2.5 py-1.5 font-sans-editorial text-sm text-[#C68C6E]"
                >
                  <span className="mt-0.5 font-mono text-xs text-[#A55534]">–</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pro Tip Callout */}
      <div className="mt-3 border-t border-[#281E1C] pt-2.5">
        <div className="font-sans-editorial text-xs text-[#C68C6E]/90">
          <strong className="font-ui text-[11px] uppercase tracking-wide text-[#F5F1EC]">
            Note:{' '}
          </strong>
          {pillar.actionableTip}
        </div>
      </div>
    </div>
  );
};
