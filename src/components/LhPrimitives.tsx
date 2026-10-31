import React, { useState, CSSProperties, ReactNode } from 'react';
import { Brain, ChevronDown, PanelLeftOpen } from 'lucide-react';

/**
 * InterviewIqMark — Warm Desert Editorial brand mark.
 */
export const InterviewIqMark: React.FC<{
  className?: string;
  iconClassName?: string;
}> = ({
  className = 'w-9 h-9',
  iconClassName = 'w-5 h-5 text-[#C68C6E]',
}) => (
  <div
    className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#3A1D19] via-[#A55534] to-[#C68C6E] p-[1px] shadow-lg shadow-[#3A1D19]/50 shrink-0 transition-transform ${className}`}
  >
    <div className="w-full h-full bg-[#0C0F14] rounded-[11px] flex items-center justify-center">
      <Brain className={iconClassName} />
    </div>
  </div>
);

/**
 * LhMark alias pointing to InterviewIqMark so all existing imports use InterviewIQ logo.
 */
export const LhMark = InterviewIqMark;


/**
 * BrailleSpinner — monochrome terminal braille spinner.
 */
const FRAMES: ReadonlyArray<{ dots: ReadonlyArray<readonly [number, number]> }> = [
  { dots: [[1, 1], [1, 3], [3, 1]] },
  { dots: [[1, 1], [3, 1], [3, 3]] },
  { dots: [[1, 1], [3, 1], [3, 3], [3, 5]] },
  { dots: [[3, 1], [3, 3], [3, 5]] },
  { dots: [[1, 5], [3, 1], [3, 3], [3, 5]] },
  { dots: [[1, 5], [3, 3], [3, 5]] },
  { dots: [[1, 3], [1, 5], [3, 5]] },
  { dots: [[1, 1], [1, 3], [1, 5], [3, 5]] },
  { dots: [[1, 1], [1, 3], [1, 5]] },
  { dots: [[1, 1], [1, 3], [1, 5], [3, 1]] },
];

export const BrailleSpinner: React.FC<{ className?: string; label?: string }> = ({
  className = 'h-3 w-auto shrink-0 text-foreground',
  label = 'Working',
}) => (
  <svg viewBox="0 0 4 8" role="status" aria-label={label} className={className}>
    {FRAMES.map((frame, k) => (
      <g
        key={k}
        className="braille-frame"
        data-frame={k}
        style={{ animationDelay: `${k * 80}ms` }}
      >
        {frame.dots.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.8} className="fill-current" />
        ))}
      </g>
    ))}
  </svg>
);

/**
 * ConfidenceRail — Warm Desert sunset progression ramp.
 */
export const CONFIDENCE_STOPS = [0, 30, 50, 70, 90, 100] as const;

export const CONFIDENCE_COLORS: readonly string[] = [
  '#3A1D19', // 0   (Oxblood)
  '#A55534', // 30  (Burnt Umber)
  '#C68C6E', // 50  (Terracotta)
  '#D4A373', // 70  (Sandstone)
  '#EEE9E3', // 90  (Paper)
  '#F5F1EC', // 100 (Warm Ivory)
];

export function getColorForScore(score: number): string {
  if (score < 20) return CONFIDENCE_COLORS[0];
  if (score < 45) return CONFIDENCE_COLORS[1];
  if (score < 65) return CONFIDENCE_COLORS[2];
  if (score < 80) return CONFIDENCE_COLORS[3];
  if (score < 92) return CONFIDENCE_COLORS[4];
  return CONFIDENCE_COLORS[5];
}

export function confidenceRailStyle(value: number): CSSProperties {
  const color = getColorForScore(value);
  return {
    backgroundColor: '#0C0F14',
    backgroundImage: [
      `linear-gradient(90deg, ${color} 0%, ${color} ${value}%, transparent ${value}%, transparent 100%)`,
      ...[30, 50, 70, 90].map(
        () => 'linear-gradient(90deg, rgba(238,233,227,0.2), rgba(238,233,227,0.2))'
      ),
    ].join(', '),
    backgroundSize: ['100% 100%', '1px 100%', '1px 100%', '1px 100%', '1px 100%'].join(', '),
    backgroundPosition: ['0 0', ...[30, 50, 70, 90].map((p) => `${p}% 0`)].join(', '),
    backgroundRepeat: 'no-repeat',
  };
}

export const ConfidenceRail: React.FC<{ value: number; className?: string }> = ({
  value,
  className = '',
}) => (
  <div
    aria-hidden
    className={`h-1.5 w-full rounded-full border border-border/80 ${className}`}
    style={confidenceRailStyle(value)}
  />
);

/**
 * ThinkingBlock — unified user-thinking / response block with left rail + 50% italic quote.
 */
export const ThinkingBlock: React.FC<{
  label?: string;
  text?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  inCard?: boolean;
  metaRight?: ReactNode;
}> = ({
  label = 'YOUR THINKING',
  text,
  children,
  defaultOpen = true,
  inCard = false,
  metaRight,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={`lh-card-enter my-2 w-full border-l-[6px] border-muted-foreground/30 py-1.5 pl-3.5 pr-4 font-ui text-xs ${
        inCard ? '' : 'bg-card'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          {label}
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </span>
        {metaRight && <span className="font-mono text-[11px] normal-case text-muted-foreground">{metaRight}</span>}
      </button>
      {open && (
        <span className="lh-prose mt-1.5 block whitespace-pre-wrap text-[15px] italic text-foreground/60">
          {text ?? children}
        </span>
      )}
    </div>
  );
};

/**
 * TopBar — standardized 60px top header bar matching LearnHarness.
 */
export const TopBar: React.FC<{
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  title?: string;
  children?: ReactNode;
  rightContent?: ReactNode;
}> = ({ sidebarOpen = true, onToggleSidebar, title, children, rightContent }) => (
  <header className="flex h-15 shrink-0 select-none items-center gap-3 border-b border-border bg-background px-4">
    {!sidebarOpen && onToggleSidebar && (
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Open sidebar"
        title="Open sidebar (⌘B)"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <PanelLeftOpen className="w-4 h-4" />
      </button>
    )}
    {title && (
      <h1 className="font-title min-w-0 truncate text-2xl sm:text-3xl tracking-tight text-foreground">
        {title}
      </h1>
    )}
    <div className="ml-auto flex items-center gap-2">{rightContent ?? children}</div>
  </header>
);

/**
 * timeAgo — compact relative timestamp from LearnHarness.
 */
export function timeAgo(iso: string, now = new Date()): string {
  try {
    const ms = now.getTime() - new Date(iso).getTime();
    if (ms < 60_000) return 'just now';
    const min = Math.floor(ms / 60_000);
    if (min < 60) return `${min}m ago`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    const date = new Date(iso);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${mm}-${dd}`;
  } catch {
    return 'just now';
  }
}
