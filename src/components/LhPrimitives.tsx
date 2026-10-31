import React, { useState, CSSProperties, ReactNode } from 'react';
import { Brain, ChevronDown, PanelLeftOpen } from 'lucide-react';

/**
 * InterviewIqMark — Graphite & Oxblood brand mark.
 */
export const InterviewIqMark: React.FC<{
  className?: string;
  iconClassName?: string;
}> = ({
  className = 'w-9 h-9',
  iconClassName = 'w-5 h-5 text-[#C69BA5]',
}) => (
  <div
    className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#482832] via-[#754653] to-[#C69BA5] p-[1px] shadow-lg shadow-[#482832]/60 shrink-0 transition-transform ${className}`}
  >
    <div className="w-full h-full bg-[#241910] rounded-[11px] flex items-center justify-center">
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
 * ConfidenceRail — Graphite & Oxblood rose progression ramp.
 */
export const CONFIDENCE_STOPS = [0, 30, 50, 70, 90, 100] as const;

export const CONFIDENCE_COLORS: readonly string[] = [
  '#482832', // 0   (Oxblood)
  '#754653', // 30  (Burgundy Wine)
  '#B18A91', // 50  (Antique Rose)
  '#C6A0A7', // 70  (Soft Rose)
  '#C69BA5', // 90  (Rose Blush)
  '#F4EDEF', // 100 (Porcelain White)
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
    backgroundColor: '#241910',
    backgroundImage: [
      `linear-gradient(90deg, ${color} 0%, ${color} ${value}%, transparent ${value}%, transparent 100%)`,
      ...[30, 50, 70, 90].map(
        () => 'linear-gradient(90deg, rgba(233,223,223,0.18), rgba(233,223,223,0.18))'
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
      className={`lh-card-enter my-2 w-full rounded-r-lg border-l-[4px] border-[#754653] border-y border-r border-[#513A42] py-2 pl-3.5 pr-4 font-ui text-xs shadow-sm ${
        inCard ? 'bg-[#241910]' : 'bg-[#302329]'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 font-mono uppercase tracking-wider text-[#C69BA5] transition-colors hover:text-[#F4EDEF]"
      >
        <span className="flex items-center gap-2">
          {label}
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </span>
        {metaRight && <span className="font-mono text-[11px] normal-case text-[#B18A91]">{metaRight}</span>}
      </button>
      {open && (
        <span className="lh-prose mt-2 block whitespace-pre-wrap font-sans-editorial text-[14.5px] italic text-[#E9DFDF]/90 leading-relaxed">
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
  <header className="flex h-15 shrink-0 select-none items-center gap-3 border-b border-[#513A42] bg-[#241910]/95 backdrop-blur-md px-4">
    {!sidebarOpen && onToggleSidebar && (
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Open sidebar"
        title="Open sidebar (⌘B)"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#D5BFC3] transition-colors hover:bg-[#3B2931] hover:text-[#F4EDEF]"
      >
        <PanelLeftOpen className="w-4 h-4 text-[#C69BA5]" />
      </button>
    )}
    {title && (
      <h1 className="font-editorial min-w-0 truncate text-2xl sm:text-3xl tracking-tight text-[#F4EDEF] font-bold">
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
