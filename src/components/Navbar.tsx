import React, { useState, useMemo } from 'react';
import {
  DomainId,
  DifficultyLevel,
  InterviewLength,
  InterviewSession,
  UserProfile,
} from '../types/interview';
import { DOMAINS } from '../data/domains';
import { LhMark, BrailleSpinner, timeAgo } from './LhPrimitives';
import {
  Dumbbell,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  Activity,
} from 'lucide-react';

export interface NavbarProps {
  open?: boolean;
  onToggle?: () => void;
  onOpenDomainSelector: () => void;
  onOpenRubricExplainer: () => void;
  onOpenHistory: () => void;
  onNavigateHome: () => void;
  onOpenProfile: () => void;
  onOpenStudy: () => void;
  onQuickStartRole?: (
    domainId: DomainId,
    roleId: string,
    difficulty: DifficultyLevel,
    length: InterviewLength
  ) => void;
  onSelectSession?: (session: InterviewSession) => void;
  savedSessions?: InterviewSession[];
  activeDomainId?: DomainId;
  activeRoleId?: string;
  currentSessionId?: string;
  historyCount: number;
  currentView: 'landing' | 'interview' | 'dashboard' | 'study';
  currentUser: UserProfile;
}

type KindFilter = 'teach' | 'practice' | 'all';

export const Navbar: React.FC<NavbarProps> = ({
  open = true,
  onToggle,
  onOpenDomainSelector,
  onOpenRubricExplainer,
  onNavigateHome,
  onOpenProfile,
  onOpenStudy,
  onQuickStartRole,
  onSelectSession,
  savedSessions = [],
  activeDomainId,
  activeRoleId,
  currentSessionId,
  currentView,
}) => {
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');

  // Role tracks shown cleanly as single-title rows like LearnHarness SessionRow
  const roleTracks = useMemo(() => {
    const tracks: Array<{
      id: string;
      domainId: DomainId;
      roleId: string;
      title: string;
      meta: string;
      kind: 'teach' | 'practice';
    }> = [];

    DOMAINS.forEach((domain) => {
      domain.roles.forEach((role, idx) => {
        tracks.push({
          id: `track-${domain.id}-${role.id}`,
          domainId: domain.id,
          roleId: role.id,
          title: role.name,
          meta: domain.shortTitle.toLowerCase(),
          kind: idx === 2 ? 'practice' : 'teach',
        });
      });
    });
    return tracks;
  }, []);

  const filteredSaved = useMemo(() => {
    const q = query.trim().toLowerCase();
    return savedSessions.filter((s) => {
      if (kindFilter === 'practice') return false;
      if (!q) return true;
      return (
        s.roleName.toLowerCase().includes(q) ||
        s.domainTitle.toLowerCase().includes(q)
      );
    });
  }, [savedSessions, query, kindFilter]);

  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roleTracks.filter((t) => {
      if (kindFilter !== 'all' && t.kind !== kindFilter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.meta.toLowerCase().includes(q)
      );
    });
  }, [roleTracks, query, kindFilter]);

  return (
    <aside
      className={`shrink-0 overflow-hidden transition-[width] duration-200 no-print ${
        open ? 'w-72' : 'w-0'
      }`}
      aria-hidden={!open}
    >
      <div className="flex h-dvh w-72 flex-col border-r border-border bg-background select-none">
        {/* Top Wordmark Band (InterviewIQ mark + title + close icon) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <button
            type="button"
            onClick={onNavigateHome}
            aria-label="InterviewIQ Home"
            title="InterviewIQ Home"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85 text-left"
          >
            <LhMark className="w-8 h-8" iconClassName="w-4 h-4 text-[#C69BA5]" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-foreground font-sans">
                  Interview<span className="text-[#C69BA5]">IQ</span>
                </span>
                <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#482832] text-[#C69BA5] uppercase border border-[#513A42]">MVP</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-label="Close sidebar"
            title="Close sidebar (⌘B)"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Two Stacked Doors: + Teaching and Practice (exact sidebar.tsx lines 699-720) */}
        <div className="mx-3 mb-2 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={onOpenDomainSelector}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 font-ui text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Plus className="w-3 h-3" />
            <span>Teaching</span>
          </button>

          <button
            type="button"
            onClick={onOpenStudy}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 font-ui text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Dumbbell className="w-3 h-3" />
            <span>Practice</span>
          </button>
        </div>

        {/* SESSIONS + Search Input (exact sidebar.tsx lines 722-781) */}
        <div className="mx-3 mb-2 flex items-center gap-2">
          <span className="font-ui text-xs uppercase tracking-widest text-muted-foreground/70">
            Sessions
          </span>
          <span className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label="Search sessions"
              className="h-6 w-full rounded-sm border border-border bg-background pl-6 pr-2 font-ui text-xs text-foreground placeholder:text-muted-foreground/60"
            />
            <Search className="pointer-events-none absolute left-1.5 top-1/2 w-3 h-3 -translate-y-1/2 text-muted-foreground/70" />
          </span>
        </div>

        {/* Three-Way Filter: TEACHING | PRACTICE | ALL (exact sidebar.tsx lines 790-807) */}
        <div className="mx-3 flex items-center gap-0.5 rounded-md border border-border/60 bg-background p-0.5">
          {(['teach', 'practice', 'all'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setKindFilter(f)}
              className={`flex-1 rounded-sm px-2 py-1 font-ui text-[11px] uppercase tracking-wider transition-colors ${
                kindFilter === f
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'teach' ? 'Teaching' : f === 'practice' ? 'Practice' : 'All'}
            </button>
          ))}
        </div>

        {/* Scrollable Session List (exact SessionRow geometry) */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredSaved.map((session) => {
            const isActive =
              currentView === 'dashboard' && currentSessionId === session.id;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelectSession?.(session)}
                className={`relative mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent ${
                  isActive ? 'bg-accent' : ''
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-prose text-[16px] text-foreground">
                    {session.roleName}
                  </span>
                  <span className="block font-ui text-xs text-muted-foreground">
                    {session.overallScore}% · {timeAgo(session.createdAt)}
                  </span>
                </span>
              </button>
            );
          })}

          {filteredTracks.map((track) => {
            const isActive =
              currentView === 'interview' &&
              activeDomainId === track.domainId &&
              activeRoleId === track.roleId;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => {
                  if (track.kind === 'practice' && kindFilter === 'practice') {
                    onOpenStudy();
                  } else if (onQuickStartRole) {
                    onQuickStartRole(track.domainId, track.roleId, 'senior', 3);
                  }
                }}
                className={`relative mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent ${
                  isActive ? 'bg-accent' : ''
                }`}
              >
                {isActive && <BrailleSpinner />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-prose text-[16px] text-foreground">
                    {track.title}
                  </span>
                  <span className="block font-ui text-xs text-muted-foreground">
                    {isActive ? 'Waiting for input · just now' : track.meta}
                  </span>
                </span>
                {track.kind === 'practice' && (
                  <Dumbbell className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
                )}
              </button>
            );
          })}

          {filteredSaved.length === 0 && filteredTracks.length === 0 && (
            <div className="px-2 py-4 font-ui text-xs text-muted-foreground">
              {query.trim() ? 'No sessions match.' : 'No sessions yet.'}
            </div>
          )}
        </div>

        {/* Background Agents Section — empty means empty (exact activity-dock.tsx lines 347-356) */}
        <section className="border-t border-border px-3 pb-3 pt-2">
          <button
            type="button"
            onClick={onOpenRubricExplainer}
            className="flex w-full items-center gap-1.5 font-ui text-xs uppercase tracking-widest text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            title="View 4-Pillar Evaluation Rubric"
          >
            <Activity className="w-3 h-3" />
            <span>Background agents</span>
          </button>
        </section>

        {/* Settings Entry (exact sidebar.tsx lines 852-864) */}
        <div className="px-3 pb-3 pt-1">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 font-ui text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings className="w-3 h-3" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
