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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0C0F14]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop relative my-8 w-full max-w-2xl rounded-2xl border border-[#281E1C] bg-[#12161F] p-6 text-[#F5F1EC] shadow-2xl shadow-[#3A1D19]/50 font-sans-editorial">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-[#281E1C] pb-3">
          <div>
            <div className="font-ui text-xs uppercase tracking-wider text-[#A55534]">
              New Session Configuration
            </div>
            <h2 className="font-editorial mt-0.5 text-2xl text-[#F5F1EC] font-bold">
              Select Domain & Target Role
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#C68C6E] transition-colors hover:bg-[#241A18] hover:text-[#F5F1EC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Domain Selection */}
        <div className="mb-5">
          <label className="mb-2 block font-ui text-xs uppercase tracking-wider text-[#C68C6E]">
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
                      ? 'border-[#C68C6E] bg-[#241A18] text-[#F5F1EC]'
                      : 'border-[#281E1C] bg-[#0C0F14] text-[#C68C6E]/90 hover:border-[#A55534]/60 hover:text-[#F5F1EC]'
                  }`}
                >
                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSel
                        ? 'border-[#C68C6E] bg-[#A55534] text-[#F5F1EC]'
                        : 'border-[#3A1D19]'
                    }`}
                  >
                    {isSel && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-xs font-semibold text-[#F5F1EC]">
                      {domain.shortTitle}
                    </span>
                    <span className="block font-sans text-[11px] text-[#C68C6E]/80 line-clamp-1">
                      {domain.tagline}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Role Selection */}
        <div className="mb-5">
          <label className="mb-2 block font-ui text-xs uppercase tracking-wider text-[#C68C6E]">
            Role Track in {currentDomain.shortTitle}
          </label>
          <div className="space-y-1.5">
            {currentDomain.roles.map((role) => {
              const isSel = role.id === selectedRoleId;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                    isSel
                      ? 'border-[#C68C6E] bg-[#241A18] text-[#F5F1EC]'
                      : 'border-[#281E1C] bg-[#0C0F14] text-[#C68C6E]/90 hover:border-[#A55534]/60 hover:text-[#F5F1EC]'
                  }`}
                >
                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSel
                        ? 'border-[#C68C6E] bg-[#A55534] text-[#F5F1EC]'
                        : 'border-[#3A1D19]'
                    }`}
                  >
                    {isSel && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-xs font-semibold text-[#F5F1EC]">
                      {role.name}
                    </span>
                    <span className="block font-sans text-[11px] text-[#C68C6E]/80">
                      {role.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Difficulty & Length Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-ui text-xs uppercase tracking-wider text-[#C68C6E]">
              Difficulty
            </label>
            <div className="flex items-center gap-0.5 rounded-md border border-[#281E1C] bg-[#0C0F14] p-0.5">
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
                        ? 'bg-[#A55534] text-[#F5F1EC] font-semibold'
                        : 'text-[#C68C6E]/70 hover:text-[#F5F1EC]'
                    }`}
                  >
                    {labels[lvl]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-ui text-xs uppercase tracking-wider text-[#C68C6E]">
              Session Length
            </label>
            <div className="flex items-center gap-0.5 rounded-md border border-[#281E1C] bg-[#0C0F14] p-0.5">
              {([3, 5] as InterviewLength[]).map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setLength(len)}
                  className={`flex-1 rounded-sm px-2 py-1 font-ui text-[11px] uppercase tracking-wider transition-colors ${
                    length === len
                      ? 'bg-[#A55534] text-[#F5F1EC] font-semibold'
                      : 'text-[#C68C6E]/70 hover:text-[#F5F1EC]'
                  }`}
                >
                  {len} Questions ({len === 3 ? '~10m' : '~20m'})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#281E1C] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 font-ui text-xs text-[#C68C6E] transition-colors hover:bg-[#241A18] hover:text-[#F5F1EC]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onStartInterview(selectedDomainId, selectedRoleId, difficulty, length)}
            className="flex h-9 items-center gap-2 rounded-lg border border-[#C68C6E] bg-[#EEE9E3] px-5 font-ui text-xs font-bold text-[#0C0F14] transition-all hover:bg-[#F5F1EC] shadow-md shadow-[#A55534]/20"
          >
            <span>Start session</span>
            <CornerDownLeft className="w-3.5 h-3.5 text-[#A55534]" />
          </button>
        </div>
      </div>
    </div>
  );
};
