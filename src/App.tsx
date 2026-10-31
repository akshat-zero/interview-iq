import React, { useState, useEffect } from 'react';
import { DOMAINS, getQuestionsForDomainAndRole } from './data/domains';
import {
  DomainId,
  DifficultyLevel,
  InterviewLength,
  InterviewSession,
  InterviewQuestion,
  DomainInfo,
  UserProfile
} from './types/interview';
import { Navbar } from './components/Navbar';
import { LoginPortal } from './views/LoginPortal';
import { LandingView } from './views/LandingView';
import { InterviewView } from './views/InterviewView';
import { PracticeModulesView } from './views/PracticeModulesView';
import { DashboardView } from './views/DashboardView';
import { DomainSelectorModal } from './components/DomainSelectorModal';
import { RubricExplainerModal } from './components/RubricExplainerModal';
import { SessionHistoryModal } from './components/SessionHistoryModal';
import { UserProfileModal } from './components/UserProfileModal';

const USER_STORAGE_KEY = 'interviewiq_active_user_v1';
const SESSIONS_BASE_KEY = 'interviewiq_user_sessions_v1';
const SIDEBAR_STORAGE_KEY = 'lh:sidebar-open';

const DEFAULT_USER: UserProfile = {
  id: 'usr_local_default',
  name: 'Candidate',
  email: 'candidate@interviewiq.local',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=interviewiq&backgroundColor=1c1c1c',
  primaryProvider: 'google',
  isGoogleLinked: true,
  googleEmail: 'candidate@interviewiq.local',
  isPhoneLinked: false,
  createdAt: new Date().toISOString()
};

export function App() {
  // Authentication State: Default to local learner so the minimal workspace opens immediately like LearnHarness
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [currentView, setCurrentView] = useState<'landing' | 'interview' | 'dashboard' | 'study'>('landing');

  // LearnHarness persistent collapsible left sidebar state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return saved === null ? true : saved === '1';
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? '1' : '0');
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut Cmd/Ctrl + B to toggle sidebar like LearnHarness
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Active interview configuration
  const [activeDomain, setActiveDomain] = useState<DomainInfo>(DOMAINS[0]);
  const [activeRoleId, setActiveRoleId] = useState<string>(DOMAINS[0].roles[0].id);
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>('senior');
  const [activeQuestions, setActiveQuestions] = useState<InterviewQuestion[]>([]);

  // Current session & completed sessions
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [savedSessions, setSavedSessions] = useState<InterviewSession[]>([]);

  // Modals
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [modalInitialDomain, setModalInitialDomain] = useState<DomainId>('swe');

  // Load user sessions whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setSavedSessions([]);
      return;
    }

    try {
      const key = `${SESSIONS_BASE_KEY}_${currentUser.id}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedSessions(parsed);
        }
      } else {
        const legacyStored = localStorage.getItem('interviewiq_saved_sessions_v1');
        if (legacyStored) {
          const parsed = JSON.parse(legacyStored);
          if (Array.isArray(parsed)) {
            setSavedSessions(parsed);
            localStorage.setItem(key, JSON.stringify(parsed));
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse sessions for user:', e);
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to store active user:', e);
    }
    setCurrentView('landing');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentSession(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear user from storage:', e);
    }
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Failed to update user profile in storage:', e);
    }
  };

  const saveSession = (session: InterviewSession) => {
    if (!currentUser) return;
    try {
      const key = `${SESSIONS_BASE_KEY}_${currentUser.id}`;
      const updated = [{ ...session, userId: currentUser.id }, ...savedSessions.filter(s => s.id !== session.id)];
      setSavedSessions(updated);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save session for user:', e);
    }
  };

  const handleClearHistory = () => {
    if (!currentUser) return;
    setSavedSessions([]);
    try {
      const key = `${SESSIONS_BASE_KEY}_${currentUser.id}`;
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Failed to remove user history from storage:', e);
    }
  };

  const handleStartInterview = (
    domainId: DomainId,
    roleId: string,
    difficulty: DifficultyLevel,
    length: InterviewLength
  ) => {
    const domain = DOMAINS.find(d => d.id === domainId) || DOMAINS[0];
    const resolvedRoleId = roleId || domain.roles[0].id;
    const questions = getQuestionsForDomainAndRole(domainId, resolvedRoleId, length);

    setActiveDomain(domain);
    setActiveRoleId(resolvedRoleId);
    setActiveDifficulty(difficulty);
    setActiveQuestions(questions);

    setIsDomainModalOpen(false);
    setCurrentView('interview');
  };

  const handleStartDomainFromLanding = (domainId: DomainId) => {
    setModalInitialDomain(domainId);
    setIsDomainModalOpen(true);
  };

  const handleFinishInterview = (session: InterviewSession) => {
    setCurrentSession(session);
    saveSession(session);
    setCurrentView('dashboard');
  };

  const handleSelectHistorySession = (session: InterviewSession) => {
    setCurrentSession(session);
    setCurrentView('dashboard');
  };

  if (!currentUser) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans">
      {currentView === 'landing' ? (
        <LandingView
          onStartDomain={handleStartDomainFromLanding}
          onQuickStartInterview={handleStartInterview}
          onOpenSelector={() => {
            setModalInitialDomain(activeDomain.id);
            setIsDomainModalOpen(true);
          }}
          onOpenRubric={() => setIsRubricModalOpen(true)}
          onOpenStudy={() => setCurrentView('study')}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          savedSessions={savedSessions}
          currentUser={currentUser}
        />
      ) : (
        <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground font-sans">
          {/* Persistent Collapsible Left Sidebar for Workspace */}
          <Navbar
            open={sidebarOpen}
            onToggle={toggleSidebar}
            onOpenDomainSelector={() => {
              setModalInitialDomain(activeDomain.id);
              setIsDomainModalOpen(true);
            }}
            onOpenRubricExplainer={() => setIsRubricModalOpen(true)}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenStudy={() => setCurrentView('study')}
            onNavigateHome={() => setCurrentView('landing')}
            onQuickStartRole={handleStartInterview}
            onSelectSession={handleSelectHistorySession}
            savedSessions={savedSessions}
            activeDomainId={activeDomain.id}
            activeRoleId={activeRoleId}
            currentSessionId={currentSession?.id}
            historyCount={savedSessions.length}
            currentView={currentView}
            currentUser={currentUser}
          />

          {/* Main Content Area */}
          <div className="relative min-w-0 flex-1 h-dvh overflow-hidden bg-background">
            {currentView === 'interview' && (
              <InterviewView
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                domain={activeDomain}
                roleId={activeRoleId}
                difficulty={activeDifficulty}
                questions={activeQuestions}
                onFinishInterview={handleFinishInterview}
                onExitToHome={() => setCurrentView('landing')}
              />
            )}

            {currentView === 'dashboard' && currentSession && (
              <DashboardView
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                session={currentSession}
                onStartNewSession={() => {
                  setModalInitialDomain(currentSession.domainId);
                  setIsDomainModalOpen(true);
                }}
                onExitHome={() => setCurrentView('landing')}
              />
            )}

            {currentView === 'study' && (
              <PracticeModulesView
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                onBackToHome={() => setCurrentView('landing')}
                onLaunchInterviewForDomain={(domainId) => {
                  const defaultRoleId = DOMAINS.find(d => d.id === domainId)?.roles[0].id || '';
                  handleStartInterview(domainId, defaultRoleId, 'senior', 3);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <DomainSelectorModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        onStartInterview={handleStartInterview}
        initialDomainId={modalInitialDomain}
      />

      <RubricExplainerModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
      />

      <SessionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        sessions={savedSessions}
        onSelectSession={handleSelectHistorySession}
        onClearHistory={handleClearHistory}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        sessions={savedSessions}
        onUpdateUser={handleUpdateUser}
        onSignOut={handleSignOut}
      />
    </div>
  );
}

export default App;
