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
    <div className="flex h-dvh flex-col overflow-hidden bg-[#241910] text-[#E9DFDF] texture-plum font-sans-editorial">
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#513A42] bg-[#3B2931] px-3 py-1.5 text-[#D5BFC3] hover:border-[#C69BA5] hover:text-[#F4EDEF] transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print PDF</span>
            </button>
            <button
              type="button"
              onClick={() => onLaunchInterviewForDomain(selectedDomainId)}
              className="rounded-lg border border-[#C69BA5]/60 bg-[#754653] px-3.5 py-1.5 font-bold text-[#F4EDEF] hover:bg-[#C6A0A7] hover:text-[#241910] transition-all shadow-md shadow-[#482832]/50"
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
          <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-[#513A42] pb-4">
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
                    className={`rounded-lg border px-3 py-1 transition-colors ${
                      isSelected
                        ? 'border-[#C69BA5] bg-[#754653]/40 text-[#F4EDEF] font-semibold'
                        : 'border-[#513A42] bg-[#302329] text-[#D5BFC3] hover:border-[#754653] hover:text-[#F4EDEF]'
                    }`}
                  >
                    {domain.shortTitle}
                  </button>
                );
              })}
            </div>

            {/* Segmented Tab Bar */}
            <div className="inline-flex rounded-lg border border-[#513A42] bg-[#302329] p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('drills')}
                className={`rounded-md px-3 py-1 transition-colors ${
                  activeTab === 'drills'
                    ? 'bg-[#754653] text-[#F4EDEF] border border-[#C69BA5]/60 font-semibold'
                    : 'text-[#B9A5AA] hover:text-[#F4EDEF]'
                }`}
              >
                Drills ({activeModule.practiceQuestions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('frameworks')}
                className={`rounded-md px-3 py-1 transition-colors ${
                  activeTab === 'frameworks'
                    ? 'bg-[#754653] text-[#F4EDEF] border border-[#C69BA5]/60 font-semibold'
                    : 'text-[#B9A5AA] hover:text-[#F4EDEF]'
                }`}
              >
                Frameworks ({activeModule.frameworks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cheatsheet')}
                className={`rounded-md px-3 py-1 transition-colors ${
                  activeTab === 'cheatsheet'
                    ? 'bg-[#754653] text-[#F4EDEF] border border-[#C69BA5]/60 font-semibold'
                    : 'text-[#B9A5AA] hover:text-[#F4EDEF]'
                }`}
              >
                Cheat Sheet ({activeModule.cheatSheet.length})
              </button>
            </div>
          </div>

          {/* Module Overview */}
          <div className="space-y-2">
            <div className="font-mono text-xs uppercase tracking-widest text-[#C69BA5]">
              PRACTICE MODULE · {activeDomainInfo.badge.toUpperCase()} · ~{activeModule.estimatedMinutes} MIN
            </div>
            <p className="font-sans-editorial text-[#D5BFC3] leading-relaxed text-base">{activeModule.overview}</p>
          </div>

          {/* TAB 1: DRILLS */}
          {activeTab === 'drills' && (
            <div className="space-y-6">
              {activeModule.practiceQuestions.map((drill, index) => {
                const isRevealed = !!revealedDrillIds[drill.id];
                const note = drillNotes[drill.id] || '';
                return (
                  <div
                    key={drill.id}
                    className="rounded-2xl border border-[#513A42] bg-[#302329] p-6 space-y-4 shadow-md"
                  >
                    <div className="flex items-baseline justify-between gap-3 border-b border-[#513A42]/50 pb-3">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] font-semibold">
                        DRILL {index + 1} · {drill.drillType}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleRevealDrill(drill.id)}
                        className="no-print inline-flex items-center gap-1.5 rounded-lg border border-[#513A42] bg-[#241910] px-3 py-1 font-mono text-xs text-[#D5BFC3] hover:border-[#C69BA5] hover:text-[#F4EDEF] transition-colors"
                      >
                        {isRevealed ? <EyeOff className="h-3 w-3 text-[#C69BA5]" /> : <Eye className="h-3 w-3 text-[#C69BA5]" />}
                        <span>{isRevealed ? 'Hide solution' : 'Reveal solution'}</span>
                      </button>
                    </div>

                    <div>
                      <h3 className="font-editorial text-xl font-bold text-[#F4EDEF] mb-1.5">
                        {drill.title}
                      </h3>
                      <p className="font-sans-editorial text-sm sm:text-base text-[#D5BFC3] leading-relaxed">{drill.prompt}</p>
                    </div>

                    <div className="rounded-xl border border-[#513A42] bg-[#241910]/70 px-4 py-3 text-sm font-sans-editorial text-[#D5BFC3]">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] mr-2 font-semibold">
                        Focus Concept:
                      </span>
                      {drill.conceptExplanation}
                    </div>

                    {/* Interactive Practice Scratchpad */}
                    <div className="no-print rounded-xl border border-[#513A42] bg-[#241910] p-3 shadow-inner">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#C69BA5]">
                          Your thinking (scratchpad)
                        </span>
                        {note.trim() && !isRevealed && (
                          <button
                            type="button"
                            onClick={() => toggleRevealDrill(drill.id)}
                            className="font-mono text-xs text-[#F4EDEF] underline hover:text-[#C6A0A7]"
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
                        className="w-full resize-y bg-transparent font-sans-editorial text-sm text-[#F4EDEF] outline-none placeholder:text-[#B9A5AA]/60 leading-relaxed"
                      />
                    </div>

                    {/* Revealed Solution */}
                    {isRevealed && (
                      <div className="space-y-4 border-t border-[#513A42] pt-4">
                        <div className="rounded-xl border border-[#754653]/60 bg-[#3B2931] p-5 space-y-2 shadow-md">
                          <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] font-semibold flex items-center gap-1.5">
                            <span>✦</span>
                            <span>Exemplar Answer Breakdown</span>
                          </div>
                          <div className="font-sans-editorial text-sm text-[#F4EDEF] whitespace-pre-wrap leading-relaxed">
                            {drill.modelAnswer}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-xl border border-[#513A42] bg-[#241910] p-4 shadow-inner">
                            <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] mb-2 font-semibold">
                              + Key Takeaways
                            </div>
                            <ul className="space-y-1.5 text-xs font-sans-editorial text-[#D5BFC3]">
                              {drill.keyTakeaways.map((point, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="font-mono text-[#C69BA5]">✓</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-[#513A42] bg-[#241910] p-4 shadow-inner">
                            <div className="font-mono text-xs uppercase tracking-wider text-[#B18A91] mb-2 font-semibold">
                              - Common Pitfalls
                            </div>
                            <ul className="space-y-1.5 text-xs font-sans-editorial text-[#D5BFC3]">
                              {drill.commonPitfalls.map((pitfall, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="font-mono text-[#B18A91]">–</span>
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
                  className="rounded-2xl border border-[#513A42] bg-[#302329] p-6 space-y-3 shadow-md"
                >
                  <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5]">
                    FRAMEWORK 0{idx + 1}
                  </div>
                  <h4 className="font-editorial text-2xl font-bold text-[#F4EDEF]">{fw.name}</h4>
                  <p className="font-sans-editorial text-sm text-[#D5BFC3] leading-relaxed">{fw.description}</p>
                  <ul className="space-y-2 pt-2 font-sans-editorial text-sm text-[#E9DFDF]">
                    {fw.steps.map((st, i) => (
                      <li key={i} className="flex items-start gap-2.5 rounded-lg border border-[#513A42] bg-[#241910] p-3">
                        <span className="font-mono text-xs text-[#C69BA5] font-semibold">{i + 1}.</span>
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
                  className="rounded-2xl border border-[#513A42] bg-[#302329] p-5 space-y-2.5 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] font-semibold">
                      {item.term}
                    </div>
                    <p className="font-sans-editorial text-sm text-[#D5BFC3] leading-relaxed mt-1">
                      {item.definition}
                    </p>
                  </div>
                  <div className="border-t border-[#513A42] pt-2.5 font-sans-editorial text-xs text-[#E9DFDF]">
                    <span className="font-mono uppercase text-[#B18A91] mr-1.5 font-semibold">Tip:</span>
                    {item.practicalTip}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Navigation */}
          <div className="no-print flex items-center justify-between border-t border-[#513A42] pt-6">
            <button
              type="button"
              onClick={onBackToHome}
              className="rounded-lg border border-[#513A42] bg-[#3B2931] px-4 py-2 font-mono text-xs text-[#D5BFC3] hover:border-[#C69BA5] hover:text-[#F4EDEF] transition-colors"
            >
              ← Back to Home
            </button>
            <button
              type="button"
              onClick={() => onLaunchInterviewForDomain(selectedDomainId)}
              className="rounded-lg border border-[#C69BA5]/60 bg-[#754653] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#F4EDEF] hover:bg-[#C6A0A7] hover:text-[#241910] transition-all shadow-md shadow-[#482832]/50"
            >
              Start {activeDomainInfo.shortTitle} Session →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
