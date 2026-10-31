import React, { useState, useMemo } from 'react';
import { DOMAINS } from '../data/domains';
import {
  DomainId,
  DifficultyLevel,
  InterviewLength,
  InterviewSession,
} from '../types/interview';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { AudioVisualizer } from '../components/AudioVisualizer';
import {
  CornerDownLeft,
  Dumbbell,
  ListTree,
  Mic,
  PanelLeftOpen,
  Upload,
} from 'lucide-react';

interface LandingViewProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onStartDomain: (domainId: DomainId) => void;
  onQuickStartInterview?: (
    domainId: DomainId,
    roleId: string,
    difficulty: DifficultyLevel,
    length: InterviewLength
  ) => void;
  onOpenSelector: () => void;
  onOpenRubric: () => void;
  onOpenStudy?: () => void;
  savedSessions?: InterviewSession[];
}

export const LandingView: React.FC<LandingViewProps> = ({
  sidebarOpen = true,
  onToggleSidebar,
  onStartDomain,
  onQuickStartInterview,
  onOpenSelector,
  onOpenRubric,
  onOpenStudy,
  savedSessions = [],
}) => {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'teach' | 'practice'>('teach');

  // Selected Domain, Role, Difficulty, Length for the bottom bar pills
  const [selectedDomainId, setSelectedDomainId] = useState<DomainId>('swe');
  const currentDomain = useMemo(
    () => DOMAINS.find((d) => d.id === selectedDomainId) || DOMAINS[0],
    [selectedDomainId]
  );
  const [selectedRoleId, setSelectedRoleId] = useState<string>(DOMAINS[0].roles[0].id);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('senior');
  const [length] = useState<InterviewLength>(3);

  // Voice dictation for the home composer
  const {
    isRecording,
    transcript,
    audioLevels,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  React.useEffect(() => {
    if (transcript && transcript.trim()) {
      setTopic(transcript);
    }
  }, [transcript]);

  const handleCycleDomainRole = () => {
    const allPairs: Array<{ domainId: DomainId; roleId: string }> = [];
    DOMAINS.forEach((d) => {
      d.roles.forEach((r) => allPairs.push({ domainId: d.id, roleId: r.id }));
    });
    const idx = allPairs.findIndex(
      (p) => p.domainId === selectedDomainId && p.roleId === selectedRoleId
    );
    const next = allPairs[(idx + 1) % allPairs.length];
    setSelectedDomainId(next.domainId);
    setSelectedRoleId(next.roleId);
  };

  const handleCycleDifficulty = () => {
    const order: DifficultyLevel[] = ['entry', 'mid', 'senior', 'lead_executive'];
    const next = order[(order.indexOf(difficulty) + 1) % order.length];
    setDifficulty(next);
  };

  const handleSubmitComposer = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isRecording) {
      stopRecording();
    }

    if (mode === 'practice' && onOpenStudy) {
      onOpenStudy();
      return;
    }

    const q = topic.trim().toLowerCase();
    let targetDomain = selectedDomainId;
    let targetRole = selectedRoleId;

    if (q) {
      for (const d of DOMAINS) {
        for (const r of d.roles) {
          if (
            r.name.toLowerCase().includes(q) ||
            d.title.toLowerCase().includes(q) ||
            d.shortTitle.toLowerCase().includes(q) ||
            r.focusKeywords.some((k) => k.toLowerCase().includes(q))
          ) {
            targetDomain = d.id;
            targetRole = r.id;
            break;
          }
        }
      }
    }

    if (onQuickStartInterview) {
      onQuickStartInterview(targetDomain, targetRole, difficulty, length);
    } else {
      onStartDomain(targetDomain);
    }
  };

  const totalQuestionsCount = 30;
  const totalRolesCount = useMemo(
    () => DOMAINS.reduce((acc, d) => acc + d.roles.length, 0),
    []
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background select-none">
      {/* Top-Left Sidebar Reopen Toggle when closed (exact home.tsx lines 202-206) */}
      {!sidebarOpen && (
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-2 px-3 py-2">
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Open sidebar"
              title="Open sidebar (⌘B)"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Top-Right Chrome Survivors (exact minimal-home.tsx lines 156-176: Chains + Rubric) */}
      <div className="absolute right-2 top-2 z-10 flex flex-col items-end gap-2">
        <div className="flex items-start gap-2">
          <div className="shrink-0 rounded-xl border border-border bg-card/85 px-1 py-[3px] shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={onOpenSelector}
              className="flex h-7 items-center gap-1.5 rounded-lg px-2.5 font-ui text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ListTree className="w-3 h-3" />
              <span>Chains</span>
            </button>
          </div>

          <div className="shrink-0 rounded-xl border border-border bg-card/85 px-1 py-[3px] shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={onOpenRubric}
              className="flex h-7 items-center gap-1.5 rounded-lg px-2.5 font-ui text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Upload className="w-3 h-3" />
              <span>Rubric…</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Quiet Centered Summary (exact minimal-home.tsx KnowledgeSummary lines 32-80) */}
      <main className="pointer-events-none absolute inset-0 flex h-full items-center justify-center pb-40">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-col gap-1">
            <p className="font-ui text-sm text-muted-foreground">
              {totalQuestionsCount} propositions
            </p>
            <p className="font-ui text-sm text-muted-foreground">
              {totalRolesCount} chains
            </p>
          </div>
          <div className="h-4" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <p className="font-ui text-sm text-muted-foreground">
              {savedSessions.length}{' '}
              {savedSessions.length === 1 ? 'teaching session' : 'teaching sessions'}
            </p>
            <p className="font-ui text-sm text-muted-foreground">
              4 practice sessions
            </p>
          </div>
          <div className="h-4" aria-hidden="true" />
          <p className="font-ui text-sm text-muted-foreground">
            4 evaluation pillars
          </p>
        </div>
      </main>

      {/* Bottom Floating Composer Dock (exact home.tsx lines 212-320) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-5">
        <div className="pointer-events-auto mx-auto w-full max-w-[46rem] px-4">
          {/* Only show Pick nodes chip in practice mode (exact home.tsx line 222) */}
          {mode === 'practice' && (
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenSelector}
                className="rounded-md border border-dashed border-border bg-card px-2.5 py-1 font-ui text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
              >
                + Pick nodes ({currentDomain.shortTitle})
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmitComposer}
            className="flex items-end gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-lg"
          >
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                mode === 'practice'
                  ? 'What do you want to practice?'
                  : 'What do you want to learn?'
              }
              autoFocus
              className="lh-input min-h-10 flex-1 bg-transparent px-2.5 py-2 text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Start session"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground transition-colors hover:opacity-90"
            >
              <CornerDownLeft className="w-5 h-5" />
            </button>
          </form>

          {/* Under-Composer StatsBar (exact stats-bar.tsx + dictation.tsx) */}
          <div className="relative flex items-center justify-between gap-3 px-3 pt-2 font-ui text-xs text-muted-foreground">
            {/* Leading slot: Teach | Practice switch (exact home.tsx lines 298-317) */}
            <div className="flex items-center gap-0.5 rounded-md border border-border/60 bg-background p-0.5">
              {(['teach', 'practice'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider transition-colors ${
                    mode === m
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m === 'practice' ? <Dumbbell className="w-3 h-3" /> : null}
                  <span>{m === 'teach' ? 'Teach' : 'Practice'}</span>
                </button>
              ))}
            </div>

            {/* Middle slot: DictationBar (exact dictation.tsx lines 714-748) */}
            <div className="flex min-w-0 flex-1 items-center justify-center">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={() => startRecording()}
                  className="flex h-7 w-full items-center justify-center gap-1.5 rounded-md border border-border/50 bg-card/50 text-xs text-muted-foreground/70 shadow-lg backdrop-blur transition-colors hover:border-border hover:text-muted-foreground"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="max-w-full truncate">Dictate</span>
                </button>
              ) : (
                <div className="flex w-full min-w-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stopRecording()}
                    className="flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-red-500/15 px-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/25"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </button>
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-red-500" />
                  <div className="min-w-0 flex-1">
                    <AudioVisualizer
                      isRecording={isRecording}
                      audioLevels={audioLevels}
                      barCount={24}
                      compact
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right slot: Model / Domain & Thinking / Seniority control */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleCycleDomainRole}
                title={`Active role: ${currentDomain.shortTitle} — click to cycle`}
                className="flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <span>
                  {selectedDomainId}:{selectedRoleId.split('_')[1] || 'lead'}
                </span>
                <span className="text-muted-foreground/70">▾</span>
              </button>

              <button
                type="button"
                onClick={handleCycleDifficulty}
                title="Click to cycle difficulty level"
                className="flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <span>{difficulty === 'lead_executive' ? 'max' : difficulty}</span>
                <span className="text-muted-foreground/70">▾</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
