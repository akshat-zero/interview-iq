import React from 'react';

interface RubricBadgeProps {
  type: 'score' | 'recommendation' | 'grade' | 'difficulty';
  value: string | number;
  className?: string;
}

export const formatPracticeSignal = (value: string | number): string => {
  const labels: Record<string, string> = {
    'Strong No Hire': 'Needs work',
    'Needs Improvement': 'Needs work',
    Borderline: 'Developing',
    'Leaning Hire': 'On track',
    Hire: 'Strong practice signal',
    'Strong Hire': 'Strong practice signal',
  };
  const label = String(value);
  return labels[label] || label;
};

export const RubricBadge: React.FC<RubricBadgeProps> = ({ type, value, className = '' }) => {
  if (type === 'score') {
    const num = Number(value);
    const tone =
      num >= 75
        ? 'bg-[#754653]/30 text-[#F4EDEF] border border-[#C69BA5]/50'
        : num >= 50
        ? 'bg-[#482832]/50 text-[#B18A91] border border-[#513A42]'
        : 'bg-[#302329] text-[#B9A5AA] border border-[#513A42]';

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
      ? 'border-[#513A42] bg-[#302329] text-[#B9A5AA]'
      : isMid
      ? 'border-[#513A42] bg-[#482832]/50 text-[#B18A91]'
      : 'border-[#C69BA5]/60 bg-[#754653]/30 text-[#F4EDEF]';

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
    const practiceLabel = formatPracticeSignal(val);
    let tone = 'bg-[#302329] text-[#E9DFDF] border-[#513A42]';
    if (val === 'Strong No Hire' || val === 'Critical Mismatch' || val === 'Needs Improvement') {
      tone = 'bg-[#302329] text-[#B9A5AA] border-[#513A42]';
    } else if (val === 'Borderline') {
      tone = 'bg-[#482832]/50 text-[#B18A91] border-[#513A42]';
    } else if (val === 'Hire' || val === 'Strong Hire' || val === 'Leaning Hire') {
      tone = 'bg-[#754653]/30 text-[#F4EDEF] border-[#C69BA5]/50';
    }

    return (
      <span
        className={`inline-flex items-center rounded border px-2.5 py-0.5 font-ui text-[11px] uppercase tracking-wider ${tone} ${className}`}
      >
        {practiceLabel}
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
        className={`inline-flex items-center rounded border border-[#513A42] bg-[#302329] px-2.5 py-0.5 font-ui text-[11px] uppercase tracking-wider text-[#D5BFC3] ${className}`}
      >
        {map[String(value)] || value}
      </span>
    );
  }

  return null;
};
