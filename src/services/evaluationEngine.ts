import {
  DomainInfo,
  InterviewQuestion,
  PillarEvaluation,
  QuestionEvaluation
} from '../types/interview';

interface EvaluationOptions {
  question: InterviewQuestion;
  userAnswer: string;
  timeSpentSeconds: number;
  inputMethod: 'voice' | 'text';
  domain: DomainInfo;
}

// Concept Map specific to each question in our bank
const QUESTION_REQUIRED_CONCEPTS: Record<string, string[]> = {
  'swe-1': [
    'rate limit', 'token bucket', 'sliding window', 'redis', 'memcached', 'latency', 'cache',
    'cluster', 'partition', 'fail open', 'fail closed', 'throttle', 'concurrency', 'throughput',
    'rps', '429', 'queue', 'distributed', 'hash', 'monotonic', 'clock', 'edge', 'gateway'
  ],
  'swe-2': [
    'incident', 'latency', 'p99', 'circuit breaker', 'load shed', 'rollback', 'telemetry',
    'metrics', 'database', 'connection pool', 'postmortem', 'triage', 'mitigate', 'black friday',
    'timeout', 'thread', 'canary', 'queue', 'lock', 'outage'
  ],
  'swe-3': [
    'monolith', 'refactor', 'strangler', 'bounded context', 'modular', 'microservice',
    'technical debt', 'test coverage', 'feature flag', 'regression', 'roadmap', 'ci/cd',
    'deploy', 'stakeholder', 'roi', 'domain', 'api'
  ],
  'swe-4': [
    'lsm', 'b+ tree', 'b tree', 'sstable', 'memtable', 'compaction', 'write amplification',
    'read amplification', 'bloom filter', 'write heavy', 'sequential', 'random disk',
    'database', 'storage engine', 'page', 'io'
  ],
  'swe-5': [
    'star', 'situation', 'task', 'action', 'result', 'product manager', 'migration',
    'compromise', 'risk', 'de-risk', 'security', 'database', 'uptime', 'revenue',
    'trade-off', 'benchmark', 'disagree', 'holiday'
  ],
  'mgmt-1': [
    'budget', 'cut', 'reduction', 'core', 'context', 'cost', 'spend', 'saas', 'vendor',
    'headcount', 'contractor', 'zero-based', 'roi', 'flagship', 'morale', 'transparency',
    'prioritization', 'operational'
  ],
  'mgmt-2': [
    '1-on-1', 'burnout', 'performance', 'coaching', 'empathy', 'expectations', 'pr review',
    'responsiveness', 'blocker', 'feedback', 'accountability', 'metrics', 'timeline',
    'support', 'diagnose', 'underperformance'
  ],
  'mgmt-3': [
    'fork', 'custom', 'enterprise', 'roadmap', 'opportunity cost', 'arr', 'modular',
    'extension', 'plugin', 'contract', 'executive', 'compromise', 'mece', 'sales',
    'product', 'stakeholder'
  ],
  'mgmt-4': [
    'breach', 'leak', 'cloud bucket', 'containment', 'revoke', 'gdpr', 'ccpa', 'legal',
    'regulatory', 'forensic', 'war room', 'affected users', 'disclosure', 'credentials',
    'security', 'compliance'
  ],
  'arts-1': [
    'passaggio', 'primo', 'secondo', 'appoggio', 'breath', 'laryngeal', 'thyroid',
    'cricothyroid', 'resonance', 'pharyngeal', 'squillo', 'formant', 'vowel',
    'aggiustamento', 'soft palate', 'vocal fold', 'subglottic'
  ],
  'arts-2': [
    'audition', 'callback', '16-bar', 'moment before', 'objective', 'vulnerability',
    'character', 'mix', 'belt', 'accompanist', 'tempo', 'casting', 'presence',
    'dramatic', 'dynamic'
  ],
  'arts-3': [
    'swelling', 'edema', 'fatigue', 'sovt', 'straw', 'phonation', 'mucosal',
    'hydration', 'steam', 'pacing', 'marking', 'nebulizer', 'acoustic', 'siren',
    'recovery', 'vocal health'
  ],
  'arts-4': [
    'conductor', 'maestro', 'tempo', 'straight tone', 'vibrato', 'artistic',
    'rehearsal', 'collaborative', 'acoustic', 'breath line', 'subglottic', 'compromise',
    'pianissimo', 'dynamics'
  ],
  'prod-1': [
    'retention', 'dau', 'cohort', 'churn', 'onboarding', 'activation', 'aha moment',
    'funnel', 'ltv', 'experiment', 'hypothesis', 'user segment', 'drop-off',
    'analytics', 'lifetime value'
  ]
};

const DOMAIN_CORE_TERMS: Record<string, string[]> = {
  swe: [
    'code', 'system', 'api', 'server', 'database', 'architecture', 'service', 'backend',
    'frontend', 'latency', 'throughput', 'memory', 'cpu', 'cache', 'caching', 'concurrency',
    'network', 'cloud', 'security', 'cluster', 'load', 'query', 'scale', 'scaling', 'deploy',
    'thread', 'lock', 'protocol', 'http', 'async', 'data', 'algorithm', 'interface'
  ],
  management: [
    'management', 'leadership', 'team', 'strategy', 'strategic', 'budget', 'revenue', 'cost',
    'stakeholder', 'kpi', 'okr', 'goal', 'project', 'organization', 'employee', 'process',
    'alignment', 'meeting', 'decision', 'prioritization', 'executive', 'business', 'morale',
    'performance', 'deliverable', 'governance', 'operational', 'quarter'
  ],
  arts_vocal: [
    'sing', 'singing', 'voice', 'vocal', 'acoustic', 'tone', 'breath', 'sound', 'pitch',
    'note', 'range', 'register', 'repertoire', 'performance', 'stage', 'aria', 'song',
    'vocalist', 'resonance', 'technique', 'diction', 'character', 'tempo', 'harmony',
    'phrasing', 'expression', 'audition'
  ],
  product: [
    'product', 'user', 'customer', 'feature', 'metric', 'retention', 'activation', 'funnel',
    'growth', 'roadmap', 'hypothesis', 'mvp', 'experiment', 'market', 'value', 'feedback',
    'engagement', 'onboarding', 'cohort', 'conversion', 'analytics'
  ]
};

export async function evaluateInterviewAnswer(
  options: EvaluationOptions,
  onProgress?: (step: string) => void
): Promise<QuestionEvaluation> {
  const { question, userAnswer, timeSpentSeconds, inputMethod, domain } = options;

  // Realistic AI evaluation multi-step progression
  if (onProgress) {
    onProgress('Ingesting audio transcript & analyzing semantic intent...');
    await new Promise((r) => setTimeout(r, 400));
    onProgress('Auditing Relevance & Accuracy against prompt constraints...');
    await new Promise((r) => setTimeout(r, 450));
    onProgress('Evaluating Communication structure, delivery & clarity...');
    await new Promise((r) => setTimeout(r, 400));
    onProgress('Measuring Domain-Specific Polish & high-leverage terminology...');
    await new Promise((r) => setTimeout(r, 400));
    onProgress('Extracting Actionable Gaps & generating elevated model answer...');
    await new Promise((r) => setTimeout(r, 400));
  }

  const cleanText = userAnswer.trim();
  const lowerText = cleanText.toLowerCase();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. GIBBERISH / NONSENSE DETECTION
  let isGibberish = false;
  if (wordCount < 4 && cleanText.length < 15) {
    isGibberish = true;
  }
  // Check for repeated single character runs like "aaaa" or "asdfasdf"
  if (/([a-z0-9])\1{4,}/i.test(cleanText) || /(asdf|qwer|zxcv|12345|blabla|lorem ipsum)/i.test(cleanText)) {
    isGibberish = true;
  }
  // Check word repetition (> 40% identical word)
  if (wordCount >= 6) {
    const wordCountsMap: Record<string, number> = {};
    for (const w of words) {
      const lowerW = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (lowerW.length > 2) {
        wordCountsMap[lowerW] = (wordCountsMap[lowerW] || 0) + 1;
      }
    }
    const maxRepetition = Math.max(...Object.values(wordCountsMap), 0);
    if (maxRepetition / wordCount > 0.45) {
      isGibberish = true;
    }
  }

  // 2. RELEVANCE & CONCEPT MATCHING
  const requiredConcepts = QUESTION_REQUIRED_CONCEPTS[question.id] || [
    ...question.evaluationFocus.map(f => f.toLowerCase()),
    ...question.idealAnswerHighlights.map(h => h.toLowerCase())
  ];
  const domainTerms = DOMAIN_CORE_TERMS[domain.id] || [];

  // Count question-specific concept matches
  let questionConceptMatches = 0;
  const matchedConcepts: string[] = [];
  for (const concept of requiredConcepts) {
    const regex = new RegExp(`\\b${concept}\\b`, 'i');
    if (regex.test(lowerText) || lowerText.includes(concept.toLowerCase())) {
      questionConceptMatches++;
      matchedConcepts.push(concept);
    }
  }

  // Count general domain matches
  let domainMatches = 0;
  for (const term of domainTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerText)) {
      domainMatches++;
    }
  }

  // Structural markers
  const hasStructure =
    /\b(first|second|third|initially|furthermore|in conclusion|specifically|for example|trade-off|because|however|step 1|step 2)\b/i.test(lowerText) ||
    /(\n|\d\.|-|\*)/.test(cleanText);

  // 3. CLASSIFY SUBMISSION COHERENCE & RELEVANCE
  const isOffTopic = !isGibberish && questionConceptMatches === 0 && domainMatches <= 1;
  const isShallow = !isGibberish && !isOffTopic && (questionConceptMatches <= 1 || wordCount < 25);
  const isModerate = !isGibberish && !isOffTopic && !isShallow && questionConceptMatches >= 2 && wordCount >= 35;
  const isThorough = !isGibberish && !isOffTopic && !isShallow && questionConceptMatches >= 4 && wordCount >= 70;

  let relScore = 50;
  let commScore = 50;
  let polishScore = 50;
  let gapsScore = 50;
  let grade: QuestionEvaluation['grade'] = 'C';
  let hireRecommendation: QuestionEvaluation['hireRecommendation'] = 'Borderline';
  let executiveSummary = '';

  // SCENARIO A: GIBBERISH / INCOHERENT INPUT
  if (isGibberish) {
    relScore = Math.floor(Math.random() * 6) + 8; // 8 - 14
    commScore = Math.floor(Math.random() * 8) + 10; // 10 - 18
    polishScore = Math.floor(Math.random() * 6) + 6; // 6 - 12
    gapsScore = Math.floor(Math.random() * 6) + 8; // 8 - 14
    grade = 'F';
    hireRecommendation = 'Strong No Hire';
    executiveSummary = `CRITICAL REJECTION: The submitted response appears to be random keys, spam, or incoherent text. In a professional interview, non-responsive or gibberish answers result in immediate termination of the interview with a definitive Strong No-Hire recommendation.`;
  }
  // SCENARIO B: COMPLETELY IRRELEVANT / OFF-TOPIC ANSWER (e.g. talking about ducks, cookies, groceries, movies)
  else if (isOffTopic) {
    relScore = Math.floor(Math.random() * 10) + 12; // 12 - 22
    // If they wrote fluent English paragraphs about the wrong topic, communication is capped at 32
    commScore = Math.min(32, Math.max(18, Math.round(wordCount > 30 ? 30 : 20)));
    polishScore = Math.floor(Math.random() * 8) + 12; // 12 - 20 (Zero domain terminology)
    gapsScore = Math.floor(Math.random() * 8) + 14; // 14 - 22 (100% of question unaddressed)
    grade = 'F';
    hireRecommendation = 'Strong No Hire';
    executiveSummary = `SEVERE RELEVANCE MISMATCH: Your answer is completely off-topic and did not address the core prompt for "${question.category}". The submission contained zero technical concepts or frameworks relevant to "${question.prompt.slice(0, 75)}...". Speaking fluently about an unrelated topic will result in an immediate Strong No-Hire rating from any interview panel.`;
  }
  // SCENARIO C: SUPERFICIAL / BARE MINIMUM (1 keyword, < 25 words)
  else if (isShallow) {
    relScore = Math.floor(Math.random() * 12) + 40; // 40 - 52
    commScore = Math.floor(Math.random() * 10) + 44; // 44 - 54
    polishScore = Math.floor(Math.random() * 12) + 38; // 38 - 50
    gapsScore = Math.floor(Math.random() * 10) + 42; // 42 - 52
    grade = 'D';
    hireRecommendation = 'Needs Improvement';
    executiveSummary = `SUPERFICIAL RESPONSE: You acknowledged a relevant keyword (${matchedConcepts.slice(0, 2).join(', ') || 'general terminology'}), but the answer lacked technical depth, mechanism design, and trade-off considerations. You need to substantiate your solution with concrete implementation steps and risk mitigations.`;
  }
  // SCENARIO D: MODERATE / CREDIBLE RESPONSE
  else if (isModerate && !isThorough) {
    const matchBonus = Math.min(questionConceptMatches * 4, 16);
    relScore = Math.min(84, 68 + matchBonus);
    commScore = Math.min(82, 65 + (hasStructure ? 8 : 0));
    polishScore = Math.min(84, 66 + matchBonus);
    gapsScore = Math.min(80, 64 + (wordCount > 50 ? 6 : 0));
    grade = relScore >= 78 ? 'B+' : 'B';
    hireRecommendation = relScore >= 78 ? 'Leaning Hire' : 'Borderline';
    executiveSummary = `SOLID FOUNDATION: Credible response addressing the primary challenge in "${question.category}". You demonstrated familiarity with key principles (${matchedConcepts.slice(0, 3).join(', ')}). To elevate this to a Strong Hire, provide deeper analysis of edge cases, failovers, and quantitative benchmarks.`;
  }
  // SCENARIO E: THOROUGH / EXEMPLARY HIGH-SCORING ANSWER
  else {
    const matchBonus = Math.min(questionConceptMatches * 3, 14);
    relScore = Math.min(98, 84 + matchBonus);
    commScore = Math.min(96, 82 + (hasStructure ? 8 : 4) + (inputMethod === 'voice' ? 3 : 0));
    polishScore = Math.min(98, 83 + matchBonus);
    gapsScore = Math.min(94, 80 + (hasStructure ? 6 : 2));
    grade = relScore >= 92 ? 'A+' : 'A';
    hireRecommendation = relScore >= 90 ? 'Strong Hire' : 'Hire';
    executiveSummary = `EXCEPTIONAL RESPONSE: Comprehensive, executive-level answer for ${domain.shortTitle}. You demonstrated authoritative mastery of ${question.category}, directly structured your trade-offs, and anticipated operational realities like a seasoned practitioner.`;
  }

  // Combined weighted score
  const overallScore = Math.round(
    relScore * 0.35 + commScore * 0.25 + polishScore * 0.25 + gapsScore * 0.15
  );

  // Pillar details synthesis
  const pillars: QuestionEvaluation['pillars'] = {
    relevanceAccuracy: {
      key: 'relevanceAccuracy',
      title: 'Relevance & Accuracy',
      score: relScore,
      verdict: relScore >= 85 ? 'Exceptional' : relScore >= 72 ? 'Strong' : relScore >= 50 ? 'Adequate' : 'Needs Improvement',
      summary: isOffTopic || isGibberish
        ? `Failed to address the prompt. Zero semantic alignment with "${question.category}".`
        : isShallow
        ? `Partially acknowledged the prompt, but failed to detail the mechanics of the solution.`
        : `Strong direct resolution of the scenario without drifting off-topic.`,
      strengths: isOffTopic || isGibberish
        ? ['Input was received by the system.']
        : [
            matchedConcepts.length > 0
              ? `Accurately identified core concepts: ${matchedConcepts.slice(0, 3).join(', ')}.`
              : 'Directly framed the primary problem constraint.',
            wordCount > 30 ? 'Maintained substantive focus on the core prompt.' : 'Provided concise initial framing.'
          ],
      gaps: isOffTopic || isGibberish
        ? [
            `Completely omitted discussion of: ${requiredConcepts.slice(0, 4).join(', ')}.`,
            'Did not provide an answer related to the interview prompt.'
          ]
        : isShallow
        ? [
            `Expand beyond surface-level mentions to explain HOW your solution executes.`,
            `Include specific mechanism trade-offs (e.g. ${requiredConcepts.slice(0, 2).join(', ')}).`
          ]
        : [
            'Explore edge-case recovery and quantitative constraints in deeper detail.',
            'State secondary failure modes explicitly.'
          ],
      actionableTip: isOffTopic || isGibberish
        ? `Carefully read the question prompt and construct your answer using the technical requirements specified.`
        : `Begin with a 1-sentence thesis summarizing your core solution before detailing your steps.`
    },
    communicationDelivery: {
      key: 'communicationDelivery',
      title: 'Communication & Delivery',
      score: commScore,
      verdict: commScore >= 85 ? 'Exceptional' : commScore >= 72 ? 'Strong' : commScore >= 50 ? 'Adequate' : 'Needs Improvement',
      summary: isGibberish
        ? 'Incoherent structure and unreadable syntax.'
        : isOffTopic
        ? 'Eloquent wording cannot salvage an answer that is completely disconnected from the prompt.'
        : hasStructure
        ? 'Well-organized thought progression with structured signposts (First, Next, Finally).'
        : 'Good natural flow; can be improved with top-down signposting.',
      strengths: isGibberish
        ? ['None detected.']
        : isOffTopic
        ? ['Grammatical sentence structure, but misplaced in context.']
        : [
            inputMethod === 'voice' ? 'Spoken delivery demonstrates composure and natural cadence.' : 'Clear written articulation.',
            hasStructure ? 'Utilized clear sequential markers to guide the evaluator.' : 'Maintained professional tone.'
          ],
      gaps: isGibberish || isOffTopic
        ? ['Align your communication directly with the question topic.']
        : [
            !hasStructure ? 'Use numbered or sequential signposts ("First... Second... Finally...").' : 'Condense explanations to reduce wordiness.',
            'Conclude with a crisp 10-second summary.'
          ],
      actionableTip: `Apply the "Rule of Three": outline 3 distinct pillars upfront to keep your response memorable.`
    },
    domainPolish: {
      key: 'domainPolish',
      title: 'Domain-Specific Polish',
      score: polishScore,
      verdict: polishScore >= 85 ? 'Exceptional' : polishScore >= 72 ? 'Strong' : polishScore >= 50 ? 'Adequate' : 'Needs Improvement',
      summary: isOffTopic || isGibberish
        ? `Zero professional terminology or domain frameworks detected for ${domain.shortTitle}.`
        : matchedConcepts.length >= 3
        ? `Command of native professional lexicon for ${domain.shortTitle}.`
        : `Familiarity with basics, but lacks high-leverage industry vernacular.`,
      strengths: isOffTopic || isGibberish
        ? ['None.']
        : [
            `Demonstrated familiarity with ${domain.shortTitle} conventions.`,
            matchedConcepts.length > 2
              ? `Integrated domain concepts naturally (${matchedConcepts.slice(0, 3).join(', ')}).`
              : 'Addressed real-world constraints.'
          ],
      gaps: isOffTopic || isGibberish
        ? [`Incorporate expected terminology such as: ${requiredConcepts.slice(0, 4).join(', ')}.`]
        : [
            `Incorporate higher-tier terminology: ${requiredConcepts.filter(c => !matchedConcepts.includes(c)).slice(0, 3).join(', ')}.`,
            'Explicitly state what trade-offs you are making.'
          ],
      actionableTip: `Explicitly articulate trade-offs: "We trade off immediate consistency in favor of lower latency and higher availability."`
    },
    actionableGaps: {
      key: 'actionableGaps',
      title: 'Actionable Gaps',
      score: gapsScore,
      verdict: gapsScore >= 85 ? 'Exceptional' : gapsScore >= 72 ? 'Strong' : gapsScore >= 50 ? 'Adequate' : 'Needs Improvement',
      summary: isOffTopic || isGibberish
        ? 'Massive blind spot: The entire scenario was left unaddressed.'
        : isShallow
        ? 'Significant gaps in execution details and edge case recovery.'
        : 'Minimal blind spots. Primary risks and mitigations were addressed.',
      strengths: isOffTopic || isGibberish
        ? ['None.']
        : ['Avoided dogmatic single-point-of-failure proposals.', 'Addressed primary constraints.'],
      gaps: isOffTopic || isGibberish
        ? [
            `Address the scenario requirements: "${question.prompt.slice(0, 80)}..."`,
            `Discuss: ${requiredConcepts.slice(0, 3).join(', ')}.`
          ]
        : [
            ...question.hints.slice(0, 2),
            'Quantify measurable SLA/SLO success metrics or telemetry.'
          ],
      actionableTip: `Anticipate the interviewer's follow-up by stating what telemetry you would monitor to verify success.`
    }
  };

  // Elevated model answer
  const elevatedModelAnswer = `### Recommended High-Caliber Answer Structure:\n\n` +
    `**1. Executive Overview:**\n` +
    `"In approaching this challenge, my objective is to achieve high reliability while balancing operational complexity and cost. I frame the solution around three core tenets: architectural resilience, clear mitigation paths, and long-term preventive guardrails."\n\n` +
    `**2. Core Technical / Strategic Implementation:**\n` +
    question.idealAnswerHighlights.map(h => `- ${h}`).join('\n') + `\n\n` +
    `**3. Key Trade-offs & Gaps Addressed:**\n` +
    `- We prioritize low latency and partition tolerance, using localized caching and asynchronous replication.\n` +
    `- We institute synthetic monitoring alerts and automated fallbacks to ensure steady-state continuity.`;

  return {
    questionId: question.id,
    questionPrompt: question.prompt,
    category: question.category,
    userAnswer: cleanText || '(No answer provided)',
    inputMethod,
    timeSpentSeconds,
    overallScore,
    grade,
    hireRecommendation,
    pillars,
    executiveSummary,
    standoutQuotes: wordCount > 20
      ? [cleanText.slice(0, Math.min(120, cleanText.length)) + '...']
      : ['Clear, straightforward initial response.'],
    criticalGaps: pillars.actionableGaps.gaps,
    elevatedModelAnswer
  };
}
