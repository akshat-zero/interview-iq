import React from 'react';
import { InterviewSession } from '../types/interview';
import { RubricBadge } from './RubricBadge';
import { timeAgo } from './LhPrimitives';
import { X, Trash2 } from 'lucide-react';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: InterviewSession[];
  onSelectSession: (session: InterviewSession) => void;
  onClearHistory: () => void;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#241910]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop relative my-8 w-full max-w-2xl rounded-2xl border border-[#513A42] bg-[#44323A] p-6 text-[#E9DFDF] shadow-2xl shadow-[#482832]/60 font-sans-editorial">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-[#513A42] pb-3">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5]">
              Session Archive
            </div>
            <h2 className="font-editorial mt-0.5 text-2xl text-[#F4EDEF] font-bold">
              Completed Sessions ({sessions.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 rounded-lg border border-[#513A42] bg-[#302329] px-2.5 py-1 font-mono text-xs text-[#D5BFC3] transition-colors hover:border-red-500/50 hover:bg-red-950/20 hover:text-red-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#B18A91] transition-colors hover:bg-[#3B2931] hover:text-[#F4EDEF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        {sessions.length === 0 ? (
          <div className="rounded-xl border border-[#513A42] bg-[#302329] py-12 text-center">
            <p className="font-sans-editorial text-sm text-[#F4EDEF]">
              No completed sessions yet.
            </p>
            <p className="mt-1 font-sans-editorial text-xs text-[#B9A5AA]">
              Start an interview session to record transcripts and 4-pillar evaluations.
            </p>
          </div>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => {
                  onSelectSession(session);
                  onClose();
                }}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#513A42] bg-[#302329] px-4 py-3 text-left transition-all hover:bg-[#3B2931] hover:border-[#C69BA5]"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans-editorial text-base font-semibold text-[#F4EDEF]">
                    {session.roleName}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-xs text-[#B18A91]">
                    <span>{session.domainTitle}</span>
                    <span>·</span>
                    <span>{session.evaluations.length} questions</span>
                    <span>·</span>
                    <span>{formatTime(session.totalTimeSeconds)}</span>
                    <span>·</span>
                    <span>{timeAgo(session.createdAt)}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="font-mono text-sm font-semibold tabular-nums text-[#F4EDEF]">
                    {session.overallScore}%
                  </span>
                  <RubricBadge type="recommendation" value={session.hireVerdict} />
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end border-t border-[#513A42] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-[#513A42] bg-[#3B2931] px-5 font-mono text-xs uppercase tracking-wider text-[#F4EDEF] transition-colors hover:bg-[#754653]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
