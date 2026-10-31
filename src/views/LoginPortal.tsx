import React, { useState } from 'react';
import { UserProfile } from '../types/interview';
import { LhMark, BrailleSpinner } from '../components/LhPrimitives';
import { Check } from 'lucide-react';

interface LoginPortalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'google' | 'phone'>('google');

  // Google flow states
  const [googleEmail, setGoogleEmail] = useState('alex.vance.dev@gmail.com');
  const [googleName, setGoogleName] = useState('Alex Vance');
  const [isCustomGoogle, setIsCustomGoogle] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Phone flow states
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('555-019-8234');
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otpCode, setOtpCode] = useState('849201');
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  // Optional account linking checkbox
  const [linkBoth, setLinkBoth] = useState(true);

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: 'usr_g_' + btoa(googleEmail).slice(0, 10),
        name: googleName || 'Google Candidate',
        email: googleEmail,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${googleEmail}&backgroundColor=1c1c1c`,
        primaryProvider: 'google',
        isGoogleLinked: true,
        googleEmail: googleEmail,
        isPhoneLinked: linkBoth,
        phoneNumber: linkBoth ? `${countryCode} ${phoneNumber}` : undefined,
        createdAt: new Date().toISOString()
      };
      setIsGoogleLoading(false);
      onLoginSuccess(user);
    }, 350);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsPhoneLoading(true);
    setTimeout(() => {
      setIsPhoneLoading(false);
      setPhoneStep('otp');
    }, 350);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhoneLoading(true);
    setTimeout(() => {
      const fullPhone = `${countryCode} ${phoneNumber}`;
      const user: UserProfile = {
        id: 'usr_p_' + btoa(fullPhone).slice(0, 10),
        name: 'Candidate (' + fullPhone.slice(-4) + ')',
        phone: fullPhone,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${fullPhone}&backgroundColor=1c1c1c`,
        primaryProvider: 'phone',
        isPhoneLinked: true,
        phoneNumber: fullPhone,
        isGoogleLinked: linkBoth,
        googleEmail: linkBoth ? googleEmail : undefined,
        createdAt: new Date().toISOString()
      };
      setIsPhoneLoading(false);
      onLoginSuccess(user);
    }, 350);
  };

  const handleQuickDemoLogin = () => {
    const user: UserProfile = {
      id: 'usr_demo_882',
      name: 'Elena Rostova',
      email: 'elena.rostova@interviewiq.io',
      phone: '+1 415-555-0199',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=elena&backgroundColor=1c1c1c',
      primaryProvider: 'google',
      isGoogleLinked: true,
      googleEmail: 'elena.rostova@interviewiq.io',
      isPhoneLinked: true,
      phoneNumber: '+1 415-555-0199',
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(user);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2">
              <LhMark className="w-8 h-8" iconClassName="w-4 h-4 text-[#C69BA5]" />
              <span className="text-base font-bold tracking-tight text-foreground font-ui">
                Interview<span className="text-[#C69BA5]">IQ</span>
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C69BA5]">
              INTERVIEW HARNESS
            </span>
          <h1 className="font-title text-2xl text-foreground font-editorial">Sign in to continue</h1>
          <p className="font-prose text-sm text-[#D5BFC3]">
            Local-first session history, 4-pillar rubrics, and knowledge graph.
          </p>
        </div>

        {/* Segmented Auth Switcher */}
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-border bg-background p-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('google');
              setPhoneStep('input');
            }}
            className={`rounded-md py-1.5 transition-colors ${
              activeTab === 'google'
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            GOOGLE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`rounded-md py-1.5 transition-colors ${
              activeTab === 'phone'
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            PHONE
          </button>
        </div>

        {/* TAB 1: GOOGLE */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3.5 py-2.5">
              <div className="min-w-0">
                <div className="font-sans text-sm font-medium text-foreground truncate">
                  {googleName}
                </div>
                <div className="font-mono text-xs text-muted-foreground truncate">
                  {googleEmail}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomGoogle(!isCustomGoogle)}
                className="font-mono text-xs text-muted-foreground hover:text-foreground underline"
              >
                {isCustomGoogle ? 'Done' : 'Edit'}
              </button>
            </div>

            {isCustomGoogle && (
              <div className="space-y-2.5 rounded-lg border border-border bg-background p-3">
                <div>
                  <label className="block font-mono text-xs uppercase text-muted-foreground mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 font-sans text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase text-muted-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setLinkBoth(!linkBoth)}
              className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-background/60 px-3 py-2 text-left font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  linkBoth ? 'border-foreground bg-foreground text-background' : 'border-border'
                }`}
              >
                {linkBoth && <Check className="h-3 w-3" />}
              </span>
              <span>Link recovery phone (+1 555-019-8234)</span>
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-sans text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {isGoogleLoading ? (
                <>
                  <BrailleSpinner />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Continue with Google →</span>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: PHONE */}
        {activeTab === 'phone' && (
          <div className="space-y-4">
            {phoneStep === 'input' ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block font-mono text-xs uppercase text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="rounded-lg border border-border bg-background px-2.5 py-2 font-mono text-xs text-foreground"
                    >
                      <option value="+1">+1 US</option>
                      <option value="+44">+44 UK</option>
                      <option value="+91">+91 IN</option>
                      <option value="+61">+61 AU</option>
                      <option value="+49">+49 DE</option>
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPhoneLoading}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-sans text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {isPhoneLoading ? <BrailleSpinner /> : null}
                  <span>Send verification code →</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="rounded-lg border border-border bg-background p-3 text-center font-mono text-xs text-muted-foreground">
                  Code sent to <span className="text-foreground">{countryCode} {phoneNumber}</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 text-center font-mono text-base tracking-[0.4em] text-foreground"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPhoneStep('input')}
                    className="w-1/3 rounded-lg border border-border bg-background py-2 font-mono text-xs text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isPhoneLoading}
                    className="w-2/3 rounded-lg bg-primary py-2 font-sans text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Verify
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Quick Guest Demo */}
        <div className="mt-5 border-t border-border pt-4">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full rounded-lg border border-border bg-background py-2 font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            1-Click Demo Session (Elena Rostova)
          </button>
        </div>
      </div>
    </div>
  );
};
