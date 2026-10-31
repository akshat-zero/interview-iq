import React, { useState, CSSProperties, ReactNode } from 'react';
import { ChevronDown, PanelLeftOpen } from 'lucide-react';

/**
 * LhMark — the LearnHarness spiral + ring SVG mark.
 */
export const LhMark: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 806 806"
    className={className}
    style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 2 }}
    aria-hidden="true"
  >
    <g transform="matrix(1,0,0,1,-109.002299,-109.002299)">
      <g transform="matrix(0.939904,0,0,0.939904,30.769428,30.766742)">
        <g transform="matrix(-0.232199,0,0,0.232199,1384.403797,-416.791824)">
          <g transform="matrix(0.573992,-2.142166,2.142166,0.573992,-5516.07298,4432.117471)">
            <path
              d="M1234.728,3305.937C871.642,3324.965 587,3624.915 587,3988.5C587,4365.734 893.266,4672 1270.5,4672C1647.734,4672 1954,4365.734 1954,3988.5C1954,3880.637 1928.472,3774.304 1879.503,3678.197L1794.243,3721.64C1836.356,3804.292 1858.31,3895.737 1858.31,3988.5C1858.31,4312.921 1594.921,4576.31 1270.5,4576.31C946.079,4576.31 682.69,4312.921 682.69,3988.5C682.69,3675.817 927.482,3417.86 1239.736,3401.496L1234.728,3305.937Z"
              style={{ fill: 'rgb(148,148,148)' }}
            />
          </g>
          <g transform="matrix(1.261034,-0,-0,1.261034,1170.373407,-2014.261188)">
            <path
              d="M1270.5,3305C893.266,3305 587,3611.266 587,3988.5C587,4365.734 893.266,4672 1270.5,4672C1647.734,4672 1954,4365.734 1954,3988.5C1954,3611.266 1647.734,3305 1270.5,3305ZM1270.5,3471.537C1555.819,3471.537 1787.463,3703.181 1787.463,3988.5C1787.463,4273.819 1555.819,4505.463 1270.5,4505.463C985.181,4505.463 753.537,4273.819 753.537,3988.5C753.537,3703.181 985.181,3471.537 1270.5,3471.537Z"
              style={{ fill: '#fff' }}
            />
          </g>
          <g transform="matrix(1.261034,0,-0,1.261034,3139.627182,-45.007413)">
            <circle cx="1270.5" cy="3988.5" r="683.5" style={{ fill: '#fff' }} />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

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
 * ConfidenceRail — the six-stop ramp & ticks from LearnHarness.
 */
export const CONFIDENCE_STOPS = [0, 30, 50, 70, 90, 100] as const;

export const CONFIDENCE_COLORS: readonly string[] = [
  '#ef4444', // 0
  '#f97316', // 30
  '#eab308', // 50
  '#84cc16', // 70
  '#22c55e', // 90
  '#10b981', // 100
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
    backgroundColor: '#141414',
    backgroundImage: [
      `linear-gradient(90deg, ${color} 0%, ${color} ${value}%, transparent ${value}%, transparent 100%)`,
      ...[30, 50, 70, 90].map(
        () => 'linear-gradient(90deg, rgba(230,230,230,0.35), rgba(230,230,230,0.35))'
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
    className={`h-1.5 w-full rounded-full border border-border ${className}`}
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
