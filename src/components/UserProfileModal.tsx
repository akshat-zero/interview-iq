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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#241910]/85 p-4 backdrop-blur-sm">
      <div className="settings-dialog-pop relative my-8 w-full max-w-lg rounded-2xl border border-[#513A42] bg-[#44323A] p-6 text-[#E9DFDF] shadow-2xl shadow-[#482832]/60 font-sans-editorial">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-[#513A42] pb-3">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5]">
              Settings
            </div>
            <h2 className="font-editorial mt-0.5 text-2xl text-[#F4EDEF] font-bold">
              Candidate & Harness Config
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#B18A91] transition-colors hover:bg-[#3B2931] hover:text-[#F4EDEF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Row */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-[#513A42] bg-[#302329] p-4 shadow-md">
          <div>
            <div className="font-sans-editorial text-base font-semibold text-[#F4EDEF]">
              {user.name}
            </div>
            <div className="font-mono text-xs text-[#B18A91]">
              Provider: {user.primaryProvider} · Local storage active
            </div>
          </div>

          <div className="text-right font-mono text-xs text-[#D5BFC3]">
            <div>{sessions.length} sessions</div>
            <div className="text-[#F4EDEF] font-semibold">Avg: {avgScore}%</div>
          </div>
        </div>

        {/* Linked Providers */}
        <div className="mb-5 space-y-2.5">
          <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5]">
            Identity & Sync
          </div>

          {/* Google */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#513A42] bg-[#302329] px-4 py-3">
            <div>
              <div className="font-sans-editorial text-sm font-medium text-[#F4EDEF]">Google Account</div>
              <div className="font-mono text-xs text-[#B18A91]">
                {user.isGoogleLinked ? user.googleEmail || user.email : 'Not linked'}
              </div>
            </div>

            {user.isGoogleLinked ? (
              <span className="rounded-md border border-[#C69BA5]/60 bg-[#754653]/30 px-2.5 py-1 font-mono text-xs text-[#F4EDEF]">
                linked
              </span>
            ) : isLinkingGoogle ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  value={emailToLink}
                  onChange={(e) => setEmailToLink(e.target.value)}
                  className="rounded-lg border border-[#513A42] bg-[#241910] px-2.5 py-1 font-mono text-xs text-[#F4EDEF] outline-none focus:border-[#C69BA5] w-40"
                />
                <button
                  type="button"
                  onClick={handleToggleGoogleLink}
                  className="rounded-lg bg-[#754653] px-3 py-1 font-mono text-xs text-[#F4EDEF] hover:bg-[#C6A0A7] hover:text-[#241910]"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLinkingGoogle(true)}
                className="rounded-lg border border-[#513A42] bg-[#3B2931] px-3 py-1 font-mono text-xs text-[#D5BFC3] hover:border-[#C69BA5] hover:text-[#F4EDEF]"
              >
                + Link
              </button>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#513A42] bg-[#302329] px-4 py-3">
            <div>
              <div className="font-sans-editorial text-sm font-medium text-[#F4EDEF]">Phone Number</div>
              <div className="font-mono text-xs text-[#B18A91]">
                {user.isPhoneLinked ? user.phoneNumber || user.phone : 'Not linked'}
              </div>
            </div>

            {user.isPhoneLinked ? (
              <span className="rounded-md border border-[#C69BA5]/60 bg-[#754653]/30 px-2.5 py-1 font-mono text-xs text-[#F4EDEF]">
                linked
              </span>
            ) : isLinkingPhone ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="tel"
                  value={phoneToLink}
                  onChange={(e) => setPhoneToLink(e.target.value)}
                  className="rounded-lg border border-[#513A42] bg-[#241910] px-2.5 py-1 font-mono text-xs text-[#F4EDEF] outline-none focus:border-[#C69BA5] w-40"
                />
                <button
                  type="button"
                  onClick={handleTogglePhoneLink}
                  className="rounded-lg bg-[#754653] px-3 py-1 font-mono text-xs text-[#F4EDEF] hover:bg-[#C6A0A7] hover:text-[#241910]"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLinkingPhone(true)}
                className="rounded-lg border border-[#513A42] bg-[#3B2931] px-3 py-1 font-mono text-xs text-[#D5BFC3] hover:border-[#C69BA5] hover:text-[#F4EDEF]"
              >
                + Link
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#513A42] pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-[#513A42] bg-[#302329] px-3 py-1.5 font-mono text-xs text-[#D5BFC3] transition-colors hover:border-red-500/50 hover:bg-red-950/20 hover:text-red-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-[#C69BA5]/60 bg-[#754653] px-5 font-mono text-xs font-bold uppercase tracking-wider text-[#F4EDEF] transition-all hover:bg-[#C6A0A7] hover:text-[#241910] shadow-md shadow-[#482832]/50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
