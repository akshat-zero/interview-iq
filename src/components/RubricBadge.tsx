import React from 'react';

interface RubricBadgeProps {
  type: 'score' | 'recommendation' | 'grade' | 'difficulty';
  value: string | number;
  className?: string;
}

export const RubricBadge: React.FC<RubricBadgeProps> = ({ type, value, className = '' }) => {
  if (type === 'score') {
    const num = Number(value);
    const tone =
      num >= 75
        ? 'bg-[#C68C6E]/20 text-[#EEE9E3] border border-[#C68C6E]/40'
        : num >= 50
        ? 'bg-[#A55534]/20 text-[#C68C6E] border border-[#A55534]/40'
        : 'bg-[#3A1D19]/40 text-[#A55534] border border-[#3A1D19]';

    return (
      <span
        className={`inline-flex items-center rounded px-2 py-0.5 font-ui text-xs tabular-nums ${tone} ${className}`}
      >
        {num}/100
      </span>
    );
  }

  if (type === 'grade') {
    const val = String(value);
    const isFailing = val === 'F' || val === 'D';
    const isMid = val === 'C' || val === 'C+';
    const tone = isFailing
      ? 'border-[#3A1D19] bg-[#3A1D19]/40 text-[#A55534]'
      : isMid
      ? 'border-[#A55534]/50 bg-[#A55534]/20 text-[#C68C6E]'
      : 'border-[#C68C6E]/60 bg-[#C68C6E]/20 text-[#F5F1EC]';

    return (
      <span
        className={`inline-flex h-6 min-w-6 items-center justify-center rounded border px-2 font-ui text-xs font-semibold ${tone} ${className}`}
      >
        {value}
      </span>
    );
  }

  if (type === 'recommendation') {
    const val = String(value);
    let tone = 'bg-[#12161F] text-[#F5F1EC] border-[#281E1C]';
    if (val === 'Strong No Hire' || val === 'Critical Mismatch' || val === 'Needs Improvement') {
      tone = 'bg-[#3A1D19]/40 text-[#A55534] border-[#3A1D19]';
    } else if (val === 'Borderline') {
      tone = 'bg-[#A55534]/20 text-[#C68C6E] border-[#A55534]/40';
    } else if (val === 'Hire' || val === 'Strong Hire' || val === 'Leaning Hire') {
      tone = 'bg-[#C68C6E]/20 text-[#F5F1EC] border-[#C68C6E]/50';
    }

    return (
      <span
        className={`inline-flex items-center rounded border px-2.5 py-0.5 font-ui text-[11px] uppercase tracking-wider ${tone} ${className}`}
      >
        {val}
      </span>
    );
  }

  if (type === 'difficulty') {
    const map: Record<string, string> = {
      entry: 'entry',
      mid: 'mid',
      senior: 'senior',
      lead_executive: 'principal',
    };
    return (
      <span
        className={`inline-flex items-center rounded border border-[#281E1C] bg-[#12161F] px-2.5 py-0.5 font-ui text-[11px] uppercase tracking-wider text-[#C68C6E] ${className}`}
      >
        {map[String(value)] || value}
      </span>
    );
  }

  return null;
};
