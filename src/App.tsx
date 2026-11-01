import React, { useState, useEffect } from 'react';
import {
  DOMAINS,
  OTHER_DOMAIN,
  getCustomProfessionQuestions,
  getQuestionsForDomainAndRole
} from './data/domains';
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
import { WalkingInterviewView } from './views/WalkingInterviewView';
import { PracticeModulesView } from './views/PracticeModulesView';
import { DashboardView } from './views/DashboardView';
import { DomainSelectorModal } from './components/DomainSelectorModal';
import { RubricExplainerModal } from './components/RubricExplainerModal';
import { SessionHistoryModal } from './components/SessionHistoryModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AIServiceError, generateInterviewQuestions } from './services/aiInterviewService';

const USER_STORAGE_KEY = 'interviewiq_active_user_v1';
const SESSIONS_BASE_KEY = 'interviewiq_user_sessions_v1';
const QUESTION_HISTORY_BASE_KEY = 'interviewiq_seen_questions_v1';
const QUESTION_PROMPT_HISTORY_BASE_KEY = 'interviewiq_seen_question_prompts_v1';
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

  const [seenQuestionIds, setSeenQuestionIds] = useState<string[]>(() => {
    try {
      const stored = currentUser
        ? localStorage.getItem(`${QUESTION_HISTORY_BASE_KEY}_${currentUser.id}`)
        : null;
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  const [seenQuestionPrompts, setSeenQuestionPrompts] = useState<string[]>([]);

  const [currentView, setCurrentView] = useState<'landing' | 'interview' | 'walking' | 'dashboard' | 'study'>('landing');

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
  const [activeFallbackQuestions, setActiveFallbackQuestions] = useState<InterviewQuestion[]>([]);
  const [activeUsesLocalFallback, setActiveUsesLocalFallback] = useState(false);
  const [activeFallbackNotice, setActiveFallbackNotice] = useState('');

  // Current session & completed sessions
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [savedSessions, setSavedSessions] = useState<InterviewSession[]>([]);

  // Modals
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [modalInitialDomain, setModalInitialDomain] = useState<DomainId>('swe');
  const [modalInitialRoleId, setModalInitialRoleId] = useState<string | undefined>();
  const [modalInitialCustomProfession, setModalInitialCustomProfession] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questionGenerationError, setQuestionGenerationError] = useState('');
  const [walkingLaunch, setWalkingLaunch] = useState(false);

  // Load user sessions whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setSavedSessions([]);
      setSeenQuestionIds([]);
      setSeenQuestionPrompts([]);
      return;
    }

    try {
      const storedQuestionIds = localStorage.getItem(`${QUESTION_HISTORY_BASE_KEY}_${currentUser.id}`);
      const parsedQuestionIds = storedQuestionIds ? JSON.parse(storedQuestionIds) : [];
      setSeenQuestionIds(Array.isArray(parsedQuestionIds)
        ? parsedQuestionIds.filter((id): id is string => typeof id === 'string')
        : []);
    } catch {
      setSeenQuestionIds([]);
    }

    try {
      const storedPrompts = localStorage.getItem(`${QUESTION_PROMPT_HISTORY_BASE_KEY}_${currentUser.id}`);
      const parsedPrompts = storedPrompts ? JSON.parse(storedPrompts) : [];
      setSeenQuestionPrompts(Array.isArray(parsedPrompts) ? parsedPrompts.filter((prompt): prompt is string => typeof prompt === 'string') : []);
    } catch {
      setSeenQuestionPrompts([]);
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
      localStorage.removeItem(`${QUESTION_HISTORY_BASE_KEY}_${currentUser.id}`);
      localStorage.removeItem(`${QUESTION_PROMPT_HISTORY_BASE_KEY}_${currentUser.id}`);
      setSeenQuestionIds([]);
      setSeenQuestionPrompts([]);
    } catch (e) {
      console.warn('Failed to remove user history from storage:', e);
    }
  };

  const handleStartInterview = async (
    domainId: DomainId,
    roleId: string,
    difficulty: DifficultyLevel,
    length: InterviewLength,
    customProfession = ''
  ) => {
    const requestedCount = Math.max(1, Math.min(50, Math.floor(length) || 1));
    const domain = domainId === 'other'
      ? {
          ...OTHER_DOMAIN,
          title: customProfession,
          shortTitle: customProfession,
          roles: [{ ...OTHER_DOMAIN.roles[0], name: customProfession }],
        }
      : DOMAINS.find(d => d.id === domainId) || DOMAINS[0];
    const resolvedRoleId = domainId === 'other' ? OTHER_DOMAIN.roles[0].id : (roleId || domain.roles[0].id);
    const selectedRole = domain.roles.find(roleOption => roleOption.id === resolvedRoleId) || domain.roles[0];
    setIsGeneratingQuestions(true);
    setQuestionGenerationError('');
    try {
      const excludedPrompts = [...new Set([
        ...seenQuestionPrompts,
        ...savedSessions.flatMap(session => session.questions.map(question => question.prompt))
      ])];
      const excludedIds = [...new Set([
        ...seenQuestionIds,
        ...savedSessions.flatMap(session => session.questions.map(question => question.id))
      ])];
      const getLocalQuestions = (count: number, excluded: string[]) => domainId === 'other'
        ? getCustomProfessionQuestions(customProfession, count, difficulty, excluded)
        : getQuestionsForDomainAndRole(domainId, resolvedRoleId, count, excluded);
      const previouslyUsedPrompts = new Set(excludedPrompts.map(prompt => prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()));
      let fallbackQuestions = getLocalQuestions(50, excludedIds);
      fallbackQuestions = fallbackQuestions.filter(question => !previouslyUsedPrompts.has(question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()));
      if (fallbackQuestions.length === 0) {
        fallbackQuestions = getLocalQuestions(50, [])
          .filter(question => !previouslyUsedPrompts.has(question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()));
      }
      if (fallbackQuestions.length === 0) fallbackQuestions = getLocalQuestions(50, []);
      let usingLocalFallback = false;
      let fallbackNotice = '';
      let questions: InterviewQuestion[];
      try {
        questions = await generateInterviewQuestions({
          domainId,
          domain: domain.title,
          domainDescription: domain.description,
          roleId: resolvedRoleId,
          role: selectedRole.name,
          roleDescription: selectedRole.description,
          profession: domainId === 'other' ? customProfession : '',
          difficulty,
          count: requestedCount,
          excludedPrompts: excludedPrompts.slice(-120)
        });
      } catch (error) {
        if (!(error instanceof AIServiceError) || error.code !== 'AI_CREDITS') throw error;
        usingLocalFallback = true;
        questions = fallbackQuestions.slice(0, requestedCount);
        if (questions.length === 0) throw new Error('No questions are available for this role.');
        fallbackNotice = `OpenAI usage is unavailable or has reached its limit. This mock is using the built-in question bank and local practice rubric${questions.length < requestedCount ? `; only ${questions.length} questions are available for this role` : ''}.`;
      }
      const nextSeenQuestionIds = [...new Set([...seenQuestionIds, ...questions.map(question => question.id)])];
      const nextSeenPrompts = [...new Set([...seenQuestionPrompts, ...questions.map(question => question.prompt)])];
      setSeenQuestionIds(nextSeenQuestionIds);
      setSeenQuestionPrompts(nextSeenPrompts);
      if (currentUser) {
        try {
          localStorage.setItem(`${QUESTION_HISTORY_BASE_KEY}_${currentUser.id}`, JSON.stringify(nextSeenQuestionIds));
          localStorage.setItem(`${QUESTION_PROMPT_HISTORY_BASE_KEY}_${currentUser.id}`, JSON.stringify(nextSeenPrompts));
        } catch {
          // The generated session remains usable if browser storage is unavailable.
        }
      }

      setActiveDomain(domain);
      setActiveRoleId(resolvedRoleId);
      setActiveDifficulty(difficulty);
      setActiveQuestions(questions);
      setActiveFallbackQuestions(fallbackQuestions);
      setActiveUsesLocalFallback(usingLocalFallback);
      setActiveFallbackNotice(fallbackNotice);
      setModalInitialCustomProfession(domainId === 'other' ? customProfession : '');
      setIsDomainModalOpen(false);
      setCurrentView(walkingLaunch ? 'walking' : 'interview');
      setWalkingLaunch(false);
    } catch (error) {
      setQuestionGenerationError(error instanceof Error ? error.message : 'The AI could not generate questions. Please try again.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleLocalFallbackActivated = (questions: InterviewQuestion[]) => {
    if (questions.length === 0) return;
    const nextSeenQuestionIds = [...new Set([...seenQuestionIds, ...questions.map(question => question.id)])];
    const nextSeenPrompts = [...new Set([...seenQuestionPrompts, ...questions.map(question => question.prompt)])];
    setSeenQuestionIds(nextSeenQuestionIds);
    setSeenQuestionPrompts(nextSeenPrompts);
    if (!currentUser) return;
    try {
      localStorage.setItem(`${QUESTION_HISTORY_BASE_KEY}_${currentUser.id}`, JSON.stringify(nextSeenQuestionIds));
      localStorage.setItem(`${QUESTION_PROMPT_HISTORY_BASE_KEY}_${currentUser.id}`, JSON.stringify(nextSeenPrompts));
    } catch {
      // Continue the current interview if browser storage is unavailable.
    }
  };

  const handleStartDomainFromLanding = (domainId: DomainId) => {
    setWalkingLaunch(false);
    setModalInitialDomain(domainId);
    setModalInitialRoleId(undefined);
    setModalInitialCustomProfession('');
    setIsDomainModalOpen(true);
  };

  const handleConfigureRole = (domainId: DomainId, roleId?: string) => {
    setWalkingLaunch(false);
    setModalInitialDomain(domainId);
    setModalInitialRoleId(roleId);
    setModalInitialCustomProfession('');
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
    <div className="min-h-screen w-full bg-[#241910] text-[#E9DFDF] font-sans-editorial selection:bg-[#754653]/40 selection:text-[#F4EDEF]">
      {currentView === 'landing' ? (
        <LandingView
          onStartDomain={handleStartDomainFromLanding}
          onOpenWalkingSelector={() => {
            setWalkingLaunch(true);
            setModalInitialDomain(activeDomain.id);
            setModalInitialRoleId(activeRoleId);
            setModalInitialCustomProfession(activeDomain.id === 'other' ? activeDomain.roles[0].name : '');
            setIsDomainModalOpen(true);
          }}
          onQuickStartInterview={handleStartInterview}
          onOpenSelector={() => {
            setWalkingLaunch(false);
            setModalInitialDomain(activeDomain.id);
            setModalInitialRoleId(activeRoleId);
            setModalInitialCustomProfession(activeDomain.id === 'other' ? activeDomain.roles[0].name : '');
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
        <div className="flex h-dvh w-full overflow-hidden bg-[#241910] text-[#E9DFDF] font-sans-editorial">
          {/* Persistent Collapsible Left Sidebar for Workspace (Oxblood: #482832) */}
          <Navbar
            open={sidebarOpen}
            onToggle={toggleSidebar}
            onOpenDomainSelector={() => {
              setWalkingLaunch(false);
              setModalInitialDomain(activeDomain.id);
              setModalInitialRoleId(activeRoleId);
              setModalInitialCustomProfession(activeDomain.id === 'other' ? activeDomain.roles[0].name : '');
              setIsDomainModalOpen(true);
            }}
            onOpenRubricExplainer={() => setIsRubricModalOpen(true)}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenStudy={() => setCurrentView('study')}
            onNavigateHome={() => setCurrentView('landing')}
            onQuickStartRole={handleConfigureRole}
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
          <div className="relative min-w-0 flex-1 h-dvh overflow-hidden bg-[#241910] texture-plum">
            {currentView === 'interview' && (
              <InterviewView
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                domain={activeDomain}
                roleId={activeRoleId}
                difficulty={activeDifficulty}
                questions={activeQuestions}
                fallbackQuestions={activeFallbackQuestions}
                initialLocalFallback={activeUsesLocalFallback}
                initialFallbackNotice={activeFallbackNotice}
                onLocalFallbackActivated={handleLocalFallbackActivated}
                onFinishInterview={handleFinishInterview}
                onExitToHome={() => setCurrentView('landing')}
              />
            )}

            {currentView === 'walking' && (
              <WalkingInterviewView
                domain={activeDomain}
                roleId={activeRoleId}
                difficulty={activeDifficulty}
                questions={activeQuestions}
                initialLocalFallback={activeUsesLocalFallback}
                onFinishInterview={handleFinishInterview}
                onExit={() => setCurrentView('landing')}
              />
            )}

            {currentView === 'dashboard' && currentSession && (
              <DashboardView
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                session={currentSession}
                onStartNewSession={() => {
                  setWalkingLaunch(false);
                  setModalInitialDomain(currentSession.domainId);
                  setModalInitialRoleId(undefined);
                  setModalInitialCustomProfession(currentSession.domainId === 'other' ? currentSession.roleName : '');
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
                  handleConfigureRole(domainId, defaultRoleId);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <DomainSelectorModal
        isOpen={isDomainModalOpen}
        onClose={() => { setWalkingLaunch(false); setIsDomainModalOpen(false); }}
        onStartInterview={handleStartInterview}
        initialDomainId={modalInitialDomain}
        initialRoleId={modalInitialRoleId}
        initialCustomProfession={modalInitialCustomProfession}
        isGeneratingQuestions={isGeneratingQuestions}
        generationError={questionGenerationError}
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
