export type DomainId = 'swe' | 'management' | 'arts_vocal' | 'product' | 'other';

export type DifficultyLevel = 'entry' | 'mid' | 'senior' | 'lead_executive';

export type InterviewLength = number;

export interface RoleOption {
  id: string;
  name: string;
  description: string;
  focusKeywords: string[];
}

export interface DomainInfo {
  id: DomainId;
  title: string;
  shortTitle: string;
  badge: string;
  tagline: string;
  description: string;
  iconName: string;
  themeColor: {
    primary: string;
    secondary: string;
    border: string;
    bgGlow: string;
    textAccent: string;
    gradient: string;
  };
  roles: RoleOption[];
  rubricFocus: {
    relevanceKeywords: string[];
    communicationExpectations: string;
    polishKeywords: string[];
    commonGaps: string[];
  };
}

export interface InterviewQuestion {
  id: string;
  domainId: DomainId;
  roleId: string;
  category: string;
  difficulty: DifficultyLevel;
  prompt: string;
  contextNotes: string;
  hints: string[];
  evaluationFocus: string[];
  idealAnswerHighlights: string[];
}

export type PillarKey = 'relevanceAccuracy' | 'communicationDelivery' | 'domainPolish' | 'actionableGaps';

export interface PillarEvaluation {
  key: PillarKey;
  title: string;
  score: number; // 0 - 100
  verdict: 'Exceptional' | 'Strong' | 'Adequate' | 'Needs Improvement';
  summary: string;
  strengths: string[];
  gaps: string[];
  actionableTip: string;
}

export interface QuestionEvaluation {
  questionId: string;
  questionPrompt: string;
  category: string;
  userAnswer: string;
  inputMethod: 'voice' | 'text';
  timeSpentSeconds: number;
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  hireRecommendation: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Borderline' | 'Needs Improvement' | 'Strong No Hire';
  pillars: {
    relevanceAccuracy: PillarEvaluation;
    communicationDelivery: PillarEvaluation;
    domainPolish: PillarEvaluation;
    actionableGaps: PillarEvaluation;
  };
  executiveSummary: string;
  standoutQuotes: string[];
  criticalGaps: string[];
  elevatedModelAnswer: string;
  /** Local practice-rubric gate used to decide whether another follow-up is needed. */
  rubricSatisfied?: boolean;
  missingConcepts?: string[];
  evaluationSource?: 'ai' | 'local';
}

export interface PracticeQuestion {
  id: string;
  title: string;
  drillType: 'Concept Drill' | 'Trade-off Comparison' | 'Scenario Drill' | 'Framework Exercise';
  prompt: string;
  conceptExplanation: string;
  modelAnswer: string;
  keyTakeaways: string[];
  commonPitfalls: string[];
}

export interface PracticeModule {
  id: string;
  domainId: DomainId;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  iconName: string;
  overview: string;
  frameworks: {
    name: string;
    description: string;
    steps: string[];
  }[];
  cheatSheet: {
    term: string;
    definition: string;
    practicalTip: string;
  }[];
  practiceQuestions: PracticeQuestion[];
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  primaryProvider: 'google' | 'phone' | 'guest' | 'chatgpt';
  isGoogleLinked: boolean;
  googleEmail?: string;
  isPhoneLinked: boolean;
  phoneNumber?: string;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  userId?: string;
  createdAt: string;
  domainId: DomainId;
  domainTitle: string;
  roleName: string;
  difficulty: DifficultyLevel;
  questions: InterviewQuestion[];
  evaluations: QuestionEvaluation[];
  overallScore: number;
  averagePillarScores: {
    relevanceAccuracy: number;
    communicationDelivery: number;
    domainPolish: number;
    actionableGaps: number;
  };
  hireVerdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Borderline' | 'Needs Improvement' | 'Strong No Hire';
  keyStrengths: string[];
  criticalImprovements: string[];
  totalTimeSeconds: number;
  evaluationSource?: 'ai' | 'local' | 'mixed';
}
