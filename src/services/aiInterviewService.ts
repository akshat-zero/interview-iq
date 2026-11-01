import {
  DifficultyLevel,
  DomainId,
  InterviewQuestion,
  QuestionEvaluation
} from '../types/interview';

export class AIServiceError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
  }
}

async function postAI<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new AIServiceError(
      typeof result.error === 'string' ? result.error : 'The AI service is unavailable. Check the server and API key, then try again.',
      typeof result.code === 'string' ? result.code : undefined
    );
  }
  return result as T;
}

interface GenerateQuestionsInput {
  domainId: DomainId;
  domain: string;
  domainDescription: string;
  roleId: string;
  role: string;
  roleDescription: string;
  profession: string;
  difficulty: DifficultyLevel;
  count: number;
  excludedPrompts: string[];
}

interface GeneratedQuestion {
  category: string;
  prompt: string;
  contextNotes: string;
  hints: string[];
  evaluationFocus: string[];
  idealAnswerHighlights: string[];
}

export async function generateInterviewQuestions(input: GenerateQuestionsInput): Promise<InterviewQuestion[]> {
  const result = await postAI<{ questions: GeneratedQuestion[] }>('/api/generate-questions', input);
  if (!Array.isArray(result.questions) || result.questions.length !== input.count) {
    throw new Error('The AI did not return the requested number of questions. Please try again.');
  }

  const seen = new Set<string>();
  const questions = result.questions.map((question, index) => {
    const normalizedPrompt = question.prompt?.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!normalizedPrompt || seen.has(normalizedPrompt)) {
      throw new Error('The AI returned duplicate or empty questions. Please generate the session again.');
    }
    seen.add(normalizedPrompt);
    return {
      id: `ai-${crypto.randomUUID?.() || `${Date.now()}-${index}`}`,
      domainId: input.domainId,
      roleId: input.roleId,
      difficulty: input.difficulty,
      category: question.category,
      prompt: question.prompt,
      contextNotes: question.contextNotes,
      hints: question.hints,
      evaluationFocus: question.evaluationFocus,
      idealAnswerHighlights: question.idealAnswerHighlights
    };
  });

  const priorPrompts = new Set(input.excludedPrompts.map(prompt => prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()));
  if (questions.some(question => priorPrompts.has(question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()))) {
    throw new Error('The AI repeated a question from an earlier session. Please generate the session again.');
  }
  return questions;
}

export interface CrossQuestionDecision {
  satisfied: boolean;
  followUp: string;
  reason: string;
}

export function requestCrossQuestionDecision(input: {
  question: string;
  answer: string;
  domain: string;
  role: string;
  difficulty: DifficultyLevel;
}): Promise<CrossQuestionDecision> {
  return postAI<CrossQuestionDecision>('/api/cross-question', input).then(decision => {
    if (typeof decision.satisfied !== 'boolean' || typeof decision.followUp !== 'string' || typeof decision.reason !== 'string') {
      throw new Error('The AI returned an invalid follow-up decision. Please retry.');
    }
    return decision;
  });
}

export async function evaluateAnswerWithAI(input: {
  question: InterviewQuestion;
  answer: string;
  domain: string;
  role: string;
  difficulty: DifficultyLevel;
  inputMethod: 'voice' | 'text';
  timeSpentSeconds: number;
}): Promise<QuestionEvaluation> {
  const result = await postAI<Omit<QuestionEvaluation, 'questionId' | 'questionPrompt' | 'category' | 'userAnswer' | 'inputMethod' | 'timeSpentSeconds'>>(
    '/api/evaluate-answer',
    {
      question: input.question.prompt,
      category: input.question.category,
      contextNotes: input.question.contextNotes,
      evaluationFocus: input.question.evaluationFocus,
      idealAnswerHighlights: input.question.idealAnswerHighlights,
      answer: input.answer,
      domain: input.domain,
      role: input.role,
      difficulty: input.difficulty
    }
  );
  return {
    ...result,
    questionId: input.question.id,
    questionPrompt: input.question.prompt,
    category: input.question.category,
    userAnswer: input.answer,
    inputMethod: input.inputMethod,
    timeSpentSeconds: input.timeSpentSeconds,
    rubricSatisfied: true,
    evaluationSource: 'ai'
  };
}

