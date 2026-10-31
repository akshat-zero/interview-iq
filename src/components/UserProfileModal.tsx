import React, { useState } from 'react';
import { UserProfile, InterviewSession } from '../types/interview';
import { X, LogOut } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  sessions: InterviewSession[];
  onUpdateUser: (updated: UserProfile) => void;
  onSignOut: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  sessions,
  onUpdateUser,
  onSignOut,
}) => {
  const [phoneToLink, setPhoneToLink] = useState('+1 555-019-9944');
  const [emailToLink, setEmailToLink] = useState('user.backup@gmail.com');
  const [isLinkingPhone, setIsLinkingPhone] = useState(false);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);

  if (!isOpen) return null;

  const totalScore = sessions.reduce((acc, s) => acc + s.overallScore, 0);
  const avgScore = sessions.length > 0 ? Math.round(totalScore / sessions.length) : 0;

  const handleToggleGoogleLink = () => {
    if (user.isGoogleLinked) {
      if (!user.isPhoneLinked) {
        alert('You must keep at least one sign-in method linked.');
        return;
      }
      onUpdateUser({
        ...user,
        isGoogleLinked: false,
        googleEmail: undefined,
      });
    } else {
      onUpdateUser({
        ...user,
        isGoogleLinked: true,
        googleEmail: emailToLink,
      });
      setIsLinkingGoogle(false);
    }
  };

  const handleTogglePhoneLink = () => {
    if (user.isPhoneLinked) {
      if (!user.isGoogleLinked) {
        alert('You must keep at least one sign-in method linked.');
        return;
      }
      onUpdateUser({
        ...user,
        isPhoneLinked: false,
        phoneNumber: undefined,
      });
    } else {
      onUpdateUser({
        ...user,
        isPhoneLinked: true,
        phoneNumber: phoneToLink,
      });
      setIsLinkingPhone(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-xs">
      <div className="settings-dialog-pop relative my-8 w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
              Settings
            </div>
            <h2 className="font-title mt-0.5 text-2xl text-foreground">
              Candidate & Harness Config
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

        {/* Profile Row */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-background/60 p-3.5">
          <div>
            <div className="font-prose text-base font-medium text-foreground">
              {user.name}
            </div>
            <div className="font-ui text-xs text-muted-foreground">
              Provider: {user.primaryProvider} · Local storage active
            </div>
          </div>

          <div className="text-right font-mono text-xs text-muted-foreground">
            <div>{sessions.length} sessions</div>
            <div className="text-foreground">Avg: {avgScore}%</div>
          </div>
        </div>

        {/* Linked Providers */}
        <div className="mb-5 space-y-2">
          <div className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
            Identity & Sync
          </div>

          {/* Google */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-3.5 py-2.5">
            <div>
              <div className="font-ui text-xs text-foreground">Google Account</div>
              <div className="font-ui text-[11px] text-muted-foreground">
                {user.isGoogleLinked ? user.googleEmail || user.email : 'Not linked'}
              </div>
            </div>

            {user.isGoogleLinked ? (
              <span className="rounded bg-green-500/15 px-2 py-0.5 font-ui text-[11px] text-green-500">
                linked
              </span>
            ) : isLinkingGoogle ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  value={emailToLink}
                  onChange={(e) => setEmailToLink(e.target.value)}
                  className="rounded border border-border bg-background px-2 py-1 font-ui text-xs text-foreground w-36"
                />
                <button
                  type="button"
                  onClick={handleToggleGoogleLink}
                  className="rounded bg-primary px-2.5 py-1 font-ui text-xs text-primary-foreground"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLinkingGoogle(true)}
                className="rounded border border-border bg-card px-2.5 py-1 font-ui text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                + Link
              </button>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-3.5 py-2.5">
            <div>
              <div className="font-ui text-xs text-foreground">Phone Number</div>
              <div className="font-ui text-[11px] text-muted-foreground">
                {user.isPhoneLinked ? user.phoneNumber || user.phone : 'Not linked'}
              </div>
            </div>

            {user.isPhoneLinked ? (
              <span className="rounded bg-green-500/15 px-2 py-0.5 font-ui text-[11px] text-green-500">
                linked
              </span>
            ) : isLinkingPhone ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="tel"
                  value={phoneToLink}
                  onChange={(e) => setPhoneToLink(e.target.value)}
                  className="rounded border border-border bg-background px-2 py-1 font-ui text-xs text-foreground w-36"
                />
                <button
                  type="button"
                  onClick={handleTogglePhoneLink}
                  className="rounded bg-primary px-2.5 py-1 font-ui text-xs text-primary-foreground"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLinkingPhone(true)}
                className="rounded border border-border bg-card px-2.5 py-1 font-ui text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                + Link
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-ui text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-red-400"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[6px] bg-primary px-4 font-ui text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
