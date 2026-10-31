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
      <div className="flex h-dvh w-72 flex-col border-r border-[#513A42] bg-[#482832] select-none text-[#E9DFDF]">
        {/* Top Wordmark Band (InterviewIQ mark + title + close icon) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#513A42]">
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
                <span className="text-sm font-bold tracking-tight text-[#F4EDEF] font-editorial">
                  Interview<span className="text-[#C69BA5]">IQ</span>
                </span>
                <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#302329] text-[#C69BA5] uppercase border border-[#513A42]">MVP</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-label="Close sidebar"
            title="Close sidebar (⌘B)"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#D5BFC3] transition-colors hover:bg-[#5A333E] hover:text-[#F4EDEF]"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Two Stacked Doors: + Teaching and Practice */}
        <div className="mx-3 my-2 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={onOpenDomainSelector}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-[#D5BFC3] transition-colors hover:bg-[#5A333E] hover:text-[#F4EDEF]"
          >
            <Plus className="w-3.5 h-3.5 text-[#C69BA5]" />
            <span>Teaching</span>
          </button>

          <button
            type="button"
            onClick={onOpenStudy}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-[#D5BFC3] transition-colors hover:bg-[#5A333E] hover:text-[#F4EDEF]"
          >
            <Dumbbell className="w-3.5 h-3.5 text-[#C69BA5]" />
            <span>Practice</span>
          </button>
        </div>

        {/* SESSIONS + Search Input */}
        <div className="mx-3 mb-2 flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#B18A91]">
            Sessions
          </span>
          <span className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label="Search sessions"
              className="h-7 w-full rounded-md border border-[#513A42] bg-[#302329] pl-6 pr-2 font-mono text-xs text-[#F4EDEF] placeholder:text-[#B9A5AA]/60 outline-none focus:border-[#C69BA5]"
            />
            <Search className="pointer-events-none absolute left-1.5 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-[#B18A91]" />
          </span>
        </div>

        {/* Three-Way Filter: TEACHING | PRACTICE | ALL */}
        <div className="mx-3 flex items-center gap-0.5 rounded-lg border border-[#513A42] bg-[#302329] p-0.5">
          {(['teach', 'practice', 'all'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setKindFilter(f)}
              className={`flex-1 rounded-md px-2 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                kindFilter === f
                  ? 'bg-[#754653] text-[#F4EDEF] border border-[#C69BA5]/60 font-semibold shadow-sm'
                  : 'text-[#B9A5AA] hover:text-[#F4EDEF]'
              }`}
            >
              {f === 'teach' ? 'Teaching' : f === 'practice' ? 'Practice' : 'All'}
            </button>
          ))}
        </div>

        {/* Scrollable Session List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredSaved.map((session) => {
            const isActive =
              currentView === 'dashboard' && currentSessionId === session.id;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelectSession?.(session)}
                className={`relative mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors border ${
                  isActive
                    ? 'border-[#C69BA5] bg-[#754653]/40 text-[#F4EDEF]'
                    : 'border-transparent hover:bg-[#5A333E] text-[#D5BFC3]'
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-sans-editorial text-[15px] font-medium text-[#F4EDEF]">
                    {session.roleName}
                  </span>
                  <span className="block font-mono text-xs text-[#B18A91]">
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
                className={`relative mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors border ${
                  isActive
                    ? 'border-[#C69BA5] bg-[#754653]/40 text-[#F4EDEF]'
                    : 'border-transparent hover:bg-[#5A333E] text-[#D5BFC3]'
                }`}
              >
                {isActive && <BrailleSpinner className="h-3 w-auto text-[#C69BA5]" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-sans-editorial text-[15px] font-medium text-[#F4EDEF]">
                    {track.title}
                  </span>
                  <span className="block font-mono text-xs text-[#B18A91]">
                    {isActive ? 'In session · just now' : track.meta}
                  </span>
                </span>
                {track.kind === 'practice' && (
                  <Dumbbell className="w-3.5 h-3.5 shrink-0 text-[#C69BA5]/70" />
                )}
              </button>
            );
          })}

          {filteredSaved.length === 0 && filteredTracks.length === 0 && (
            <div className="px-2 py-4 font-mono text-xs text-[#B9A5AA]">
              {query.trim() ? 'No sessions match.' : 'No sessions yet.'}
            </div>
          )}
        </div>

        {/* Background Agents Section */}
        <section className="border-t border-[#513A42] px-3 pb-2 pt-2.5">
          <button
            type="button"
            onClick={onOpenRubricExplainer}
            className="flex w-full items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#B18A91] hover:text-[#F4EDEF] transition-colors"
            title="View 4-Pillar Evaluation Rubric"
          >
            <Activity className="w-3.5 h-3.5 text-[#C69BA5]" />
            <span>Background agents</span>
          </button>
        </section>

        {/* Settings Entry */}
        <div className="px-3 pb-3 pt-1">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-[#D5BFC3] transition-colors hover:bg-[#5A333E] hover:text-[#F4EDEF]"
          >
            <Settings className="w-3.5 h-3.5 text-[#C69BA5]" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
