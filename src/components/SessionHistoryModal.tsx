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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-xs">
      <div className="settings-dialog-pop relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
              Session Archive
            </div>
            <h2 className="font-title mt-0.5 text-2xl text-foreground">
              Completed Sessions ({sessions.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-ui text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        {sessions.length === 0 ? (
          <div className="rounded-xl border border-border bg-background/60 py-12 text-center">
            <p className="font-ui text-sm text-muted-foreground">
              No completed sessions yet.
            </p>
            <p className="mt-1 font-ui text-xs text-muted-foreground/70">
              Start an interview session to record transcripts and 4-pillar evaluations.
            </p>
          </div>
        ) : (
          <div className="max-h-96 space-y-1.5 overflow-y-auto pr-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => {
                  onSelectSession(session);
                  onClose();
                }}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background/60 px-4 py-3 text-left transition-colors hover:bg-accent"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-prose text-base font-medium text-foreground">
                    {session.roleName}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 font-ui text-xs text-muted-foreground">
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
                  <span className="font-mono text-sm font-medium tabular-nums text-foreground">
                    {session.overallScore}%
                  </span>
                  <RubricBadge type="recommendation" value={session.hireVerdict} />
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[6px] border border-border bg-background px-4 font-ui text-xs text-foreground transition-colors hover:bg-accent"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
