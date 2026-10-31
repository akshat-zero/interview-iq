import React, { useState } from 'react';
import { PRACTICE_MODULES } from '../data/practiceModules';
import { DOMAINS } from '../data/domains';
import { DomainId, PracticeModule } from '../types/interview';
import { TopBar } from '../components/LhPrimitives';
import { Printer, Eye, EyeOff } from 'lucide-react';

interface PracticeModulesViewProps {
  onBackToHome: () => void;
  onLaunchInterviewForDomain: (domainId: DomainId) => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const PracticeModulesView: React.FC<PracticeModulesViewProps> = ({
  onBackToHome,
  onLaunchInterviewForDomain,
  sidebarOpen = true,
  onToggleSidebar
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<DomainId>('swe');
  const [revealedDrillIds, setRevealedDrillIds] = useState<Record<string, boolean>>({});
  const [drillNotes, setDrillNotes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'drills' | 'frameworks' | 'cheatsheet'>('drills');

  const activeModule: PracticeModule =
    PRACTICE_MODULES.find(m => m.domainId === selectedDomainId) || PRACTICE_MODULES[0];

  const activeDomainInfo = DOMAINS.find(d => d.id === selectedDomainId) || DOMAINS[0];

  const toggleRevealDrill = (id: string) => {
    setRevealedDrillIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* LearnHarness TopBar */}
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        title={activeModule.title}
        rightContent={
          <div className="no-print flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print PDF</span>
            </button>
            <button
              type="button"
              onClick={() => onLaunchInterviewForDomain(selectedDomainId)}
              className="rounded-md bg-primary px-3 py-1 font-sans text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Start Interview →
            </button>
          </div>
        }
      />

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 space-y-8 pb-20">
          {/* Domain Selector + Mode Switcher Bar */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {DOMAINS.map(domain => {
                const isSelected = domain.id === selectedDomainId;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => {
                      setSelectedDomainId(domain.id);
                      setRevealedDrillIds({});
                    }}
                    className={`rounded-md border px-2.5 py-1 transition-colors ${
                      isSelected
                        ? 'border-foreground/60 bg-accent text-foreground'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {domain.shortTitle}
                  </button>
                );
              })}
            </div>

            {/* Segmented Tab Bar */}
            <div className="inline-flex rounded-md border border-border bg-card p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('drills')}
                className={`rounded px-2.5 py-1 transition-colors ${
                  activeTab === 'drills'
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Drills ({activeModule.practiceQuestions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('frameworks')}
                className={`rounded px-2.5 py-1 transition-colors ${
                  activeTab === 'frameworks'
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Frameworks ({activeModule.frameworks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cheatsheet')}
                className={`rounded px-2.5 py-1 transition-colors ${
                  activeTab === 'cheatsheet'
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Cheat Sheet ({activeModule.cheatSheet.length})
              </button>
            </div>
          </div>

          {/* Module Overview */}
          <div className="space-y-2">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              PRACTICE MODULE · {activeDomainInfo.badge.toUpperCase()} · ~{activeModule.estimatedMinutes} MIN
            </div>
            <p className="lh-prose text-muted-foreground">{activeModule.overview}</p>
          </div>

          {/* TAB 1: DRILLS (with LearnHarness PracticeDock style scratchpad) */}
          {activeTab === 'drills' && (
            <div className="space-y-6">
              {activeModule.practiceQuestions.map((drill, index) => {
                const isRevealed = !!revealedDrillIds[drill.id];
                const note = drillNotes[drill.id] || '';
                return (
                  <div
                    key={drill.id}
                    className="rounded-2xl border border-border bg-card p-5 space-y-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        DRILL {index + 1} · {drill.drillType}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleRevealDrill(drill.id)}
                        className="no-print inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        <span>{isRevealed ? 'Hide solution' : 'Reveal solution'}</span>
                      </button>
                    </div>

                    <div className="lh-prose">
                      <h3 className="font-sans text-lg font-medium text-foreground mb-1">
                        {drill.title}
                      </h3>
                      <p>{drill.prompt}</p>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 px-3.5 py-2.5 text-sm font-prose text-muted-foreground">
                      <span className="font-mono text-xs uppercase tracking-wider text-foreground mr-2">
                        Focus Concept:
                      </span>
                      {drill.conceptExplanation}
                    </div>

                    {/* Interactive Practice Scratchpad (like LearnHarness PracticeDock) */}
                    <div className="no-print rounded-[10px] border border-border/70 bg-background/60 px-3 py-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Your thinking (scratchpad)
                        </span>
                        {note.trim() && !isRevealed && (
                          <button
                            type="button"
                            onClick={() => toggleRevealDrill(drill.id)}
                            className="font-mono text-xs text-foreground underline"
                          >
                            Compare with model answer →
                          </button>
                        )}
                      </div>
                      <textarea
                        value={note}
                        onChange={(e) =>
                          setDrillNotes(prev => ({ ...prev, [drill.id]: e.target.value }))
                        }
                        rows={3}
                        placeholder="Draft your response structure or key points before revealing the solution..."
                        className="lh-input w-full resize-y bg-transparent"
                      />
                    </div>

                    {/* Revealed Solution */}
                    {isRevealed && (
                      <div className="space-y-4 border-t border-border pt-4">
                        <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                          <div className="font-mono text-xs uppercase tracking-wider text-foreground">
                            Exemplar Answer Breakdown
                          </div>
                          <div className="font-prose text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                            {drill.modelAnswer}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-lg border border-border bg-background/60 p-3.5">
                            <div className="font-mono text-xs uppercase tracking-wider text-[#C68C6E] mb-1.5">
                              + Key Takeaways
                            </div>
                            <ul className="space-y-1 text-xs font-prose text-muted-foreground">
                              {drill.keyTakeaways.map((point, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="font-mono">·</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-lg border border-border bg-background/60 p-3.5">
                            <div className="font-mono text-xs uppercase tracking-wider text-[#A55534] mb-1.5">
                              - Common Pitfalls
                            </div>
                            <ul className="space-y-1 text-xs font-prose text-muted-foreground">
                              {drill.commonPitfalls.map((pitfall, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="font-mono">·</span>
                                  <span>{pitfall}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: FRAMEWORKS */}
          {activeTab === 'frameworks' && (
            <div className="grid grid-cols-1 gap-4">
              {activeModule.frameworks.map((fw, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-5 space-y-3"
                >
                  <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    FRAMEWORK 0{idx + 1}
                  </div>
                  <h4 className="font-sans text-lg font-medium text-foreground">{fw.name}</h4>
                  <p className="font-prose text-sm text-muted-foreground">{fw.description}</p>
                  <ul className="space-y-1.5 pt-1 font-prose text-sm text-foreground/90">
                    {fw.steps.map((st, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{i + 1}.</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CHEAT SHEET */}
          {activeTab === 'cheatsheet' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeModule.cheatSheet.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-4 space-y-2"
                >
                  <div className="font-mono text-xs uppercase tracking-wider text-foreground">
                    {item.term}
                  </div>
                  <p className="font-prose text-sm text-muted-foreground leading-relaxed">
                    {item.definition}
                  </p>
                  <div className="border-t border-border/60 pt-2 font-prose text-xs text-foreground/80">
                    <span className="font-mono uppercase text-muted-foreground mr-1">Tip:</span>
                    {item.practicalTip}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Navigation */}
          <div className="no-print flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              onClick={onBackToHome}
              className="rounded-md border border-border bg-card px-3.5 py-2 font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              ← Back to Home
            </button>
            <button
              type="button"
              onClick={() => onLaunchInterviewForDomain(selectedDomainId)}
              className="rounded-md bg-primary px-4 py-2 font-sans text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Start {activeDomainInfo.shortTitle} Session →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
