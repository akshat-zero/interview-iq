import React, { useState, useEffect } from 'react';
import { DOMAINS } from '../data/domains';
import { DomainId, DifficultyLevel, InterviewLength } from '../types/interview';
import { X, CornerDownLeft } from 'lucide-react';

interface DomainSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInterview: (
    domainId: DomainId,
    roleId: string,
    difficulty: DifficultyLevel,
    length: InterviewLength
  ) => void;
  initialDomainId?: DomainId;
}

export const DomainSelectorModal: React.FC<DomainSelectorModalProps> = ({
  isOpen,
  onClose,
  onStartInterview,
  initialDomainId = 'swe',
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<DomainId>(initialDomainId);
  const currentDomain = DOMAINS.find((d) => d.id === selectedDomainId) || DOMAINS[0];

  const [selectedRoleId, setSelectedRoleId] = useState<string>(currentDomain.roles[0].id);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('senior');
  const [length, setLength] = useState<InterviewLength>(3);

  useEffect(() => {
    setSelectedDomainId(initialDomainId);
    const domain = DOMAINS.find((d) => d.id === initialDomainId);
    if (domain && domain.roles.length > 0) {
      setSelectedRoleId(domain.roles[0].id);
    }
  }, [initialDomainId, isOpen]);

  const handleDomainChange = (id: DomainId) => {
    setSelectedDomainId(id);
    const domain = DOMAINS.find((d) => d.id === id);
    if (domain && domain.roles.length > 0) {
      setSelectedRoleId(domain.roles[0].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-xs">
      <div className="settings-dialog-pop relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
              New Session Configuration
            </div>
            <h2 className="font-title mt-0.5 text-2xl text-foreground">
              Select Domain & Target Role
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Domain Selection (LearnHarness option rows) */}
        <div className="mb-5">
          <label className="mb-2 block font-ui text-xs uppercase tracking-wider text-muted-foreground">
            Domain
          </label>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {DOMAINS.map((domain) => {
              const isSel = domain.id === selectedDomainId;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => handleDomainChange(domain.id)}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    isSel
                      ? 'border-primary bg-accent text-foreground'
                      : 'border-border bg-background/40 text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  }`}
                >
                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSel
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/40'
                    }`}
                  >
                    {isSel && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-prose text-base font-medium text-foreground">
                      {domain.shortTitle}
                    </span>
                    <span className="block truncate font-ui text-[11px] text-muted-foreground">
                      {domain.badge}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Role Selection (LearnHarness radio list) */}
        <div className="mb-5">
          <label className="mb-2 block font-ui text-xs uppercase tracking-wider text-muted-foreground">
            Target Role
          </label>
          <div className="flex flex-col gap-1.5">
            {currentDomain.roles.map((role) => {
              const isSel = role.id === selectedRoleId;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                    isSel
                      ? 'border-primary bg-accent text-foreground'
                      : 'border-border bg-background/40 text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  }`}
                >
                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSel
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/40'
                    }`}
                  >
                    {isSel && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-prose text-base font-medium text-foreground">
                      {role.name}
                    </span>
                    <span className="lh-prose block text-xs text-muted-foreground">
                      {role.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Seniority & Length */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-ui text-xs uppercase tracking-wider text-muted-foreground">
              Calibration Level
            </label>
            <div className="flex items-center gap-0.5 rounded-md border border-border/70 bg-background p-0.5">
              {(['entry', 'mid', 'senior', 'lead_executive'] as DifficultyLevel[]).map((lvl) => {
                const labels: Record<DifficultyLevel, string> = {
                  entry: 'Entry',
                  mid: 'Mid',
                  senior: 'Senior',
                  lead_executive: 'Lead',
                };
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 rounded-sm px-2 py-1 font-ui text-[11px] uppercase tracking-wider transition-colors ${
                      difficulty === lvl
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {labels[lvl]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-ui text-xs uppercase tracking-wider text-muted-foreground">
              Session Length
            </label>
            <div className="flex items-center gap-0.5 rounded-md border border-border/70 bg-background p-0.5">
              {([3, 5] as InterviewLength[]).map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setLength(len)}
                  className={`flex-1 rounded-sm px-2 py-1 font-ui text-[11px] uppercase tracking-wider transition-colors ${
                    length === len
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {len} Questions ({len === 3 ? '~10m' : '~20m'})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 font-ui text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onStartInterview(selectedDomainId, selectedRoleId, difficulty, length)}
            className="flex h-9 items-center gap-2 rounded-[6px] bg-primary px-4 font-ui text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <span>Start session</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
