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
        ? 'bg-green-500/15 text-green-500'
        : num >= 50
        ? 'bg-amber-500/15 text-amber-400'
        : 'bg-red-500/15 text-red-500';

    return (
      <span
        className={`inline-flex items-center rounded px-1.5 py-0.5 font-ui text-xs tabular-nums ${tone} ${className}`}
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
      ? 'border-red-500/50 bg-red-500/10 text-red-500'
      : isMid
      ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
      : 'border-green-500/50 bg-green-500/10 text-green-500';

    return (
      <span
        className={`inline-flex h-6 min-w-6 items-center justify-center rounded border px-1.5 font-ui text-xs font-medium ${tone} ${className}`}
      >
        {value}
      </span>
    );
  }

  if (type === 'recommendation') {
    const val = String(value);
    let tone = 'bg-accent text-foreground border-border';
    if (val === 'Strong No Hire' || val === 'Critical Mismatch' || val === 'Needs Improvement') {
      tone = 'bg-red-500/15 text-red-500 border-red-500/40';
    } else if (val === 'Borderline') {
      tone = 'bg-amber-500/15 text-amber-400 border-amber-500/40';
    } else if (val === 'Hire' || val === 'Strong Hire' || val === 'Leaning Hire') {
      tone = 'bg-green-500/15 text-green-500 border-green-500/40';
    }

    return (
      <span
        className={`inline-flex items-center rounded border px-2 py-0.5 font-ui text-[11px] uppercase tracking-wider ${tone} ${className}`}
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
        className={`inline-flex items-center rounded border border-border bg-card px-2 py-0.5 font-ui text-[11px] uppercase tracking-wider text-muted-foreground ${className}`}
      >
        {map[String(value)] || value}
      </span>
    );
  }

  return null;
};
