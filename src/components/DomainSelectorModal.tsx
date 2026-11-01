import React, { useState, useEffect } from 'react';
import { DOMAINS, OTHER_DOMAIN } from '../data/domains';
import { DomainId, DifficultyLevel, InterviewLength } from '../types/interview';
import { X, CornerDownLeft } from 'lucide-react';

interface DomainSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInterview: (
    domainId: DomainId,
    roleId: string,
    difficulty: DifficultyLevel,
    length: InterviewLength,
    customProfession?: string
  ) => Promise<void>;
  initialDomainId?: DomainId;
  initialRoleId?: string;
  initialCustomProfession?: string;
  isGeneratingQuestions: boolean;
  generationError: string;
}

export const DomainSelectorModal: React.FC<DomainSelectorModalProps> = ({
  isOpen,
  onClose,
  onStartInterview,
  initialDomainId = 'swe',
  initialRoleId,
  initialCustomProfession = '',
  isGeneratingQuestions,
  generationError,
}) => {
  const selectableDomains = [...DOMAINS, OTHER_DOMAIN];
  const [selectedDomainId, setSelectedDomainId] = useState<DomainId>(initialDomainId);
  const [customProfession, setCustomProfession] = useState(initialCustomProfession);
  const currentDomain = selectableDomains.find((d) => d.id === selectedDomainId) || DOMAINS[0];

  const [selectedRoleId, setSelectedRoleId] = useState<string>(currentDomain.roles[0].id);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('senior');
  const [questionCountInput, setQuestionCountInput] = useState('5');
  const length = Math.max(1, Math.floor(Number(questionCountInput) || 1));

  useEffect(() => {
    setSelectedDomainId(initialDomainId);
    setCustomProfession(initialCustomProfession);
    const domain = selectableDomains.find((d) => d.id === initialDomainId);
    if (domain && domain.roles.length > 0) {
      setSelectedRoleId(domain.roles.some((role) => role.id === initialRoleId) ? initialRoleId! : domain.roles[0].id);
    }
  }, [initialDomainId, initialRoleId, initialCustomProfession, isOpen]);

  const handleDomainChange = (id: DomainId) => {
    setSelectedDomainId(id);
    const domain = selectableDomains.find((d) => d.id === id);
    if (domain && domain.roles.length > 0) {
      setSelectedRoleId(domain.roles[0].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#241910]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop relative my-8 w-full max-w-2xl rounded-2xl border border-[#513A42] bg-[#44323A] p-6 text-[#E9DFDF] shadow-2xl shadow-[#482832]/60 font-sans-editorial">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-[#513A42] pb-3">
          <div>
            <div className="font-ui text-xs uppercase tracking-wider text-[#C69BA5]">
              New Session Configuration
            </div>
            <h2 className="font-editorial mt-0.5 text-2xl text-[#F4EDEF] font-bold">
              Select Domain & Target Role
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#B18A91] transition-colors hover:bg-[#3B2931] hover:text-[#F4EDEF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Domain Selection */}
        <div className="mb-5">
          <label className="mb-2 block font-ui text-xs uppercase tracking-wider text-[#B18A91]">
            Domain
          </label>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {selectableDomains.map((domain) => {
              const isSel = domain.id === selectedDomainId;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => handleDomainChange(domain.id)}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    isSel
                      ? 'border-[#C69BA5] bg-[#3B2931] text-[#F4EDEF]'
                      : 'border-[#513A42] bg-[#302329] text-[#D5BFC3] hover:border-[#754653]/70 hover:text-[#F4EDEF]'
                  }`}
                >
                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSel
                        ? 'border-[#C69BA5] bg-[#754653] text-[#F4EDEF]'
                        : 'border-[#513A42]'
                    }`}
                  >
                    {isSel && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-xs font-semibold text-[#F4EDEF]">
                      {domain.shortTitle}
                    </span>
                    <span className="block font-sans text-[11px] text-[#B9A5AA] line-clamp-1">
                      {domain.tagline}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedDomainId === 'other' && (
          <div className="mb-5">
            <label htmlFor="custom-profession" className="mb-2 block font-ui text-xs uppercase tracking-wider text-[#B18A91]">
              Profession or role
            </label>
            <input
              id="custom-profession"
              type="text"
              value={customProfession}
              onChange={(event) => setCustomProfession(event.target.value)}
              placeholder="e.g. Dentist, Architect, UX Researcher"
              maxLength={80}
              className="w-full rounded-lg border border-[#513A42] bg-[#302329] px-3 py-2.5 text-sm text-[#F4EDEF] placeholder:text-[#B9A5AA] focus:border-[#C69BA5]"
            />
            <p className="mt-1.5 text-xs text-[#B9A5AA]">AI generates interview questions and evaluations tailored to this profession.</p>
          </div>
        )}

        {/* Step 2: Role Selection */}
        {selectedDomainId !== 'other' && <div className="mb-5">
          <label className="mb-2 block font-ui text-xs uppercase tracking-wider text-[#B18A91]">
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
                      ? 'border-[#C69BA5] bg-[#3B2931] text-[#F4EDEF]'
                      : 'border-[#513A42] bg-[#302329] text-[#D5BFC3] hover:border-[#754653]/70 hover:text-[#F4EDEF]'
                  }`}
                >
                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSel
                        ? 'border-[#C69BA5] bg-[#754653] text-[#F4EDEF]'
                        : 'border-[#513A42]'
                    }`}
                  >
                    {isSel && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-xs font-semibold text-[#F4EDEF]">
                      {role.name}
                    </span>
                    <span className="block font-sans text-[11px] text-[#B9A5AA]">
                      {role.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>}

        {/* Step 3: Difficulty & Length Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-ui text-xs uppercase tracking-wider text-[#B18A91]">
              Difficulty
            </label>
            <div className="flex items-center gap-0.5 rounded-md border border-[#513A42] bg-[#302329] p-0.5">
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
                        ? 'bg-[#754653] text-[#F4EDEF] font-semibold'
                        : 'text-[#B9A5AA] hover:text-[#F4EDEF]'
                    }`}
                  >
                    {labels[lvl]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="question-count" className="mb-1.5 block font-ui text-xs uppercase tracking-wider text-[#B18A91]">
              Questions in this mock
            </label>
            <input
              id="question-count"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              value={questionCountInput}
              onChange={(event) => setQuestionCountInput(event.target.value.replace(/\D/g, '').slice(0, 2))}
              onBlur={() => {
                const requestedCount = Number(questionCountInput) || 1;
                setQuestionCountInput(String(Math.max(1, Math.min(requestedCount, 50))));
              }}
              className="w-full rounded-md border border-[#513A42] bg-[#302329] px-3 py-2 text-sm text-[#F4EDEF] focus:border-[#C69BA5] disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-[#B9A5AA]">
              AI generates {length} new question{length === 1 ? '' : 's'} for this mock (1–50 per session). Previous prompts are sent to help avoid repeats; question generation and answer evaluation use OpenAI.
            </p>
          </div>
        </div>

        {generationError && (
          <p role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-950/20 px-3 py-2.5 text-sm text-red-200">
            {generationError}
            {generationError.toLowerCase().includes('credits remaining') && (
              <> <a className="underline underline-offset-2" href="https://platform.openai.com/settings/organization/billing/" target="_blank" rel="noreferrer">Open API billing settings</a>.</>
            )}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#513A42] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 font-ui text-xs text-[#D5BFC3] transition-colors hover:bg-[#3B2931] hover:text-[#F4EDEF]"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isGeneratingQuestions || !questionCountInput || length > 50 || (selectedDomainId === 'other' && !customProfession.trim())}
            onClick={() => onStartInterview(selectedDomainId, selectedRoleId, difficulty, length, customProfession.trim())}
            className="flex h-9 items-center gap-2 rounded-lg border border-[#B18A91]/50 bg-[#754653] px-5 font-ui text-xs font-bold text-[#F4EDEF] transition-all hover:bg-[#C6A0A7] hover:text-[#241910] shadow-md shadow-[#482832]/50"
          >
            <span>{isGeneratingQuestions ? 'Generating questions…' : 'Start session'}</span>
            {!isGeneratingQuestions && <CornerDownLeft className="w-3.5 h-3.5 text-[#F4EDEF]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
