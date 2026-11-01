import { DifficultyLevel, DomainInfo, InterviewQuestion } from '../types/interview';

export const DOMAINS: DomainInfo[] = [
  {
    id: 'swe',
    title: 'Software Engineering & Architecture',
    shortTitle: 'Software Engineering',
    badge: 'Tech & Architecture',
    tagline: 'System design, algorithmic trade-offs, scalability & technical leadership',
    description: 'Master technical discussions from distributed systems and low-latency architecture to clean code refactoring and incident triage.',
    iconName: 'Code2',
    themeColor: {
      primary: '#754653',
      secondary: '#B18A91',
      border: 'border-[#513A42]',
      bgGlow: 'bg-[#482832]/40',
      textAccent: 'text-[#C69BA5]',
      gradient: 'from-[#754653] to-[#B18A91]',
    },
    roles: [
      {
        id: 'dist-sys',
        name: 'Distributed Systems & Backend Architect',
        description: 'Focus on high throughput, fault tolerance, replication, and CAP trade-offs.',
        focusKeywords: ['latency', 'throughput', 'sharding', 'consensus', 'idempotency', 'caching', 'microservices', 'p99']
      },
      {
        id: 'fullstack-lead',
        name: 'Staff Full-Stack Engineer',
        description: 'End-to-end web applications, state management, API design, and performance.',
        focusKeywords: ['react', 'node', 'graphql', 'rest', 'bundle size', 'hydration', 'database indexing', 'concurrency']
      },
      {
        id: 'sre-devops',
        name: 'Site Reliability & Infrastructure Lead',
        description: 'Zero-downtime deployments, observability, incident response, and SLAs/SLOs.',
        focusKeywords: ['slo', 'sli', 'kubernetes', 'canary', 'postmortem', 'mttr', 'chaos engineering', 'observability']
      }
    ],
    rubricFocus: {
      relevanceKeywords: ['scale', 'trade-off', 'latency', 'consistency', 'bottleneck', 'resilience', 'data integrity'],
      communicationExpectations: 'Clear architectural articulation, back-of-the-envelope calculations, and STAR structure for behavioral scenarios.',
      polishKeywords: ['idempotency', 'partition tolerance', 'eventual consistency', 'circuit breaker', 'backpressure', 'read-through cache'],
      commonGaps: ['Neglecting failure modes and single points of failure', 'Over-engineering without justifying volume/cost', 'Vagueness in database choice']
    }
  },
  {
    id: 'management',
    title: 'Corporate Management & Executive Leadership',
    shortTitle: 'Corporate Management',
    badge: 'Leadership & Strategy',
    tagline: 'Strategic vision, P&L ownership, crisis management & people empowerment',
    description: 'Elevate your executive presence, cross-functional stakeholder alignment, high-stakes trade-offs, and operational change management.',
    iconName: 'Briefcase',
    themeColor: {
      primary: '#482832',
      secondary: '#754653',
      border: 'border-[#513A42]',
      bgGlow: 'bg-[#482832]/30',
      textAccent: 'text-[#E9DFDF]',
      gradient: 'from-[#482832] to-[#754653]',
    },
    roles: [
      {
        id: 'dir-ops',
        name: 'Director of Operations / General Manager',
        description: 'Operational efficiency, budget management, cross-departmental throughput, and change leadership.',
        focusKeywords: ['okrs', 'kpi', 'ebitda', 'efficiency', 'workforce planning', 'cost-benefit', 'change management']
      },
      {
        id: 'eng-mgr',
        name: 'Senior Engineering Manager / VP',
        description: 'Team topologies, talent retention, roadmap prioritization, and managing technical debt vs business impact.',
        focusKeywords: ['retention', 'mentorship', 'velocity', 'burnout', 'stakeholder alignment', 'headcount', 'psychological safety']
      },
      {
        id: 'strategy-exec',
        name: 'Chief of Staff / VP of Strategy',
        description: 'Corporate growth, market positioning, executive decision frameworks, and crisis leadership.',
        focusKeywords: ['go-to-market', 'market expansion', 'risk mitigation', 'executive communication', 'mece', 'board alignment']
      }
    ],
    rubricFocus: {
      relevanceKeywords: ['roi', 'business outcome', 'alignment', 'stakeholder', 'morale', 'governance', 'risk appetite'],
      communicationExpectations: 'Top-down communication (Minto Pyramid / MECE), empathetic tone, and quantitative impact framing.',
      polishKeywords: ['fiduciary responsibility', 'cross-functional cadence', 'servant leadership', 'organizational resilience', 'talent density'],
      commonGaps: ['Failing to consider employee psychological safety or morale', 'Giving tactical answers instead of systemic/strategic vision', 'Lack of measurable KPIs']
    }
  },
  {
    id: 'arts_vocal',
    title: 'Arts & Vocal Performance',
    shortTitle: 'Arts & Vocal Performance',
    badge: 'Performance & Expression',
    tagline: 'Acoustic mechanics, audition psychology, stagecraft & artistic interpretation',
    description: 'Refine your audition repertoire presentation, vocal health regimen, character embodiment, and collaboration with directors and conductors.',
    iconName: 'Mic2',
    themeColor: {
      primary: '#B18A91',
      secondary: '#C69BA5',
      border: 'border-[#513A42]',
      bgGlow: 'bg-[#754653]/30',
      textAccent: 'text-[#F4EDEF]',
      gradient: 'from-[#B18A91] to-[#C69BA5]',
    },
    roles: [
      {
        id: 'classical-opera',
        name: 'Classical Opera Soloist',
        description: 'Bel canto / dramatic repertoire, acoustic unamplified projection, diction, and vocal stamina.',
        focusKeywords: ['passaggio', 'appoggio', 'formant', 'diction', 'coloratura', 'phrasing', 'breath support', 'legato']
      },
      {
        id: 'musical-theatre',
        name: 'Musical Theatre Lead Performer',
        description: 'Triple-threat vocal balance, mix/belt transition, dramatic intent, and 8-show-a-week recovery.',
        focusKeywords: ['mix-belt', 'character arc', 'audition cut', 'vocal fatigue', 'acting through song', 'vocal resonance']
      },
      {
        id: 'contemporary-artist',
        name: 'Contemporary Vocalist & Producer',
        description: 'Studio microphone technique, vocal stylization, ear-monitor management, and artistic identity.',
        focusKeywords: ['proximity effect', 'dynamic control', 'falsetto', 'runs and riffs', 'stylistic authenticity', 'in-ear monitors']
      }
    ],
    rubricFocus: {
      relevanceKeywords: ['technique', 'interpretation', 'character', 'breath', 'acoustics', 'repertoire', 'dramatic intention'],
      communicationExpectations: 'Vivid sensory terminology, deep artistic self-awareness, and clear technical rationale for interpretive choices.',
      polishKeywords: ['appoggio', 'chiaroscuro', 'singer’s formant', 'laryngeal tilt', 'prosody', 'subglottic pressure'],
      commonGaps: ['Focusing purely on emotional feeling while ignoring anatomical/vocal mechanics', 'Neglecting warm-up and restorative vocal health routines', 'Passive artistic responses to directorial friction']
    }
  },
  {
    id: 'product',
    title: 'Product Management & Innovation',
    shortTitle: 'Product Management',
    badge: 'Product & Growth',
    tagline: 'User empathy, north star metrics, product vision & discovery trade-offs',
    description: 'Nail product design questions, metric root-cause analysis, and executive roadmapping.',
    iconName: 'Sparkles',
    themeColor: {
      primary: '#754653',
      secondary: '#482832',
      border: 'border-[#513A42]',
      bgGlow: 'bg-[#482832]/40',
      textAccent: 'text-[#C69BA5]',
      gradient: 'from-[#754653] to-[#482832]',
    },
    roles: [
      {
        id: 'senior-pm',
        name: 'Principal Product Manager',
        description: 'Core product strategy, complex prioritization matrices, and customer problem framing.',
        focusKeywords: ['north star', 'retention', 'user journey', 'jtbd', 'product-market fit', 'trade-offs']
      },
      {
        id: 'ai-pm',
        name: 'AI & Data Product Lead',
        description: 'Model evaluation loops, human-in-the-loop workflows, latency vs accuracy, and ethical AI.',
        focusKeywords: ['latency', 'hallucination guardrails', 'rag', 'ground truth', 'precision-recall', 'evals']
      }
    ],
    rubricFocus: {
      relevanceKeywords: ['user pain point', 'metric', 'adoption', 'trade-off', 'hypothesis', 'mvp', 'business impact'],
      communicationExpectations: 'Structured problem decomposition (CIRCLES or similar), customer-centric empathy, and measurable validation.',
      polishKeywords: ['Jobs To Be Done', 'funnel friction', 'cohort retention', 'cannibalization', 'counter-metrics'],
      commonGaps: ['Jumping straight into solutions before validating user segments', 'Lacking guardrail metrics for trade-offs']
    }
  }
];

export const OTHER_DOMAIN: DomainInfo = {
  id: 'other',
  title: 'Other Profession',
  shortTitle: 'Other',
  badge: 'Custom Profession',
  tagline: 'Enter a profession that is not listed',
  description: 'Practice general professional interview questions tailored to your selected profession.',
  iconName: 'Briefcase',
  themeColor: {
    primary: '#754653', secondary: '#B18A91', border: 'border-[#513A42]',
    bgGlow: 'bg-[#482832]/40', textAccent: 'text-[#C69BA5]', gradient: 'from-[#754653] to-[#B18A91]',
  },
  roles: [{ id: 'custom-profession', name: 'Custom profession', description: 'Enter your profession below.', focusKeywords: [] }],
  rubricFocus: {
    relevanceKeywords: ['experience', 'challenge', 'decision', 'result'],
    communicationExpectations: 'Clear, structured answers with specific examples and outcomes.',
    polishKeywords: ['trade-off', 'process', 'outcome'],
    commonGaps: ['Unclear personal contribution', 'Missing results or lessons learned'],
  },
};

const CUSTOM_PROFESSION_QUESTIONS = [
  (profession: string) => `What interests you about working as a ${profession}, and how has your experience prepared you for this role?`,
  (profession: string) => `Describe a challenging situation you faced in ${profession}. How did you approach it, and what was the result?`,
  (profession: string) => `How do you maintain quality and safety in your work as a ${profession} when priorities or conditions change?`,
  (profession: string) => `Tell me about a time you had to communicate a difficult decision or recommendation related to ${profession}.`,
  (profession: string) => `How do you keep your skills current and evaluate whether your approach in ${profession} is working?`,
  (profession: string) => `Describe a mistake or setback in your work as a ${profession}. What did you learn and change afterward?`,
  (profession: string) => `How do you prioritize competing responsibilities as a ${profession} when time or resources are limited?`,
  (profession: string) => `Tell me about a time you had to earn the trust of a client, colleague, or community member as a ${profession}.`,
  (profession: string) => `Describe a decision you made as a ${profession} with incomplete information. How did you manage the uncertainty?`,
  (profession: string) => `How do you respond when someone challenges your professional judgment as a ${profession}?`,
  (profession: string) => `Tell me about a time you improved a process or service in your work as a ${profession}.`,
  (profession: string) => `How do you protect quality and confidentiality in your work as a ${profession}?`,
  (profession: string) => `Describe a time you had to adapt your approach for someone with different needs or expectations.`,
  (profession: string) => `How do you explain complex information to people who are unfamiliar with your field as a ${profession}?`,
  (profession: string) => `Tell me about a time a project or case did not go to plan. How did you communicate and recover?`,
  (profession: string) => `How do you decide when to ask for help or escalate an issue in your work as a ${profession}?`,
  (profession: string) => `Describe a professional standard or ethical principle that guides your work as a ${profession}.`,
  (profession: string) => `How do you balance speed with accuracy in a demanding situation as a ${profession}?`,
  (profession: string) => `Tell me about a time you helped a colleague or junior team member improve their work.`,
  (profession: string) => `What feedback has changed how you work as a ${profession}, and what did you do with it?`,
  (profession: string) => `How would you handle a dissatisfied client or stakeholder who disagrees with your recommendation?`,
  (profession: string) => `Describe how you would prepare for an unfamiliar assignment in your profession.`,
  (profession: string) => `How do you measure whether your work as a ${profession} has created a good outcome?`,
  (profession: string) => `Tell me about a time you had to coordinate with people from another discipline to solve a problem.`,
  (profession: string) => `How do you keep your work consistent when you have several deadlines at once?`,
  (profession: string) => `Describe a time you identified a risk early and took action before it became a larger problem.`,
  (profession: string) => `How would you respond if a new rule or technology changed an important part of your work as a ${profession}?`,
  (profession: string) => `What would you do if you noticed a colleague taking a shortcut that could affect quality or safety?`,
  (profession: string) => `Tell me about a goal you set for your professional growth and how you worked toward it.`,
];

export const getCustomProfessionQuestionPool = (profession: string, difficulty: DifficultyLevel): InterviewQuestion[] =>
  CUSTOM_PROFESSION_QUESTIONS.map((createPrompt, index): InterviewQuestion => {
    const prompt = createPrompt(profession);
    return {
      id: `other-${index + 1}`,
      domainId: 'other',
      roleId: 'custom-profession',
      category: ['Motivation', 'Problem Solving', 'Quality & Safety', 'Communication', 'Professional Growth', 'Learning'][index % CUSTOM_PROFESSION_QUESTIONS.length],
      difficulty,
      prompt,
      contextNotes: `Answer from the perspective of your work as a ${profession}.`,
      hints: ['Use a specific example', 'Explain your own actions', 'Share the outcome and what you learned'],
      evaluationFocus: ['experience', 'challenge', 'decision', 'result'],
      idealAnswerHighlights: ['Specific context and personal contribution', 'Reasoning behind the approach', 'Clear outcome and reflection'],
    };
  });

export const getCustomProfessionQuestions = (
  profession: string,
  count: number,
  difficulty: DifficultyLevel,
  excludedQuestionIds: string[] = [],
): InterviewQuestion[] => {
  const excluded = new Set(excludedQuestionIds);
  const available = getCustomProfessionQuestionPool(profession, difficulty)
    .filter((question) => !excluded.has(question.id));
  return shuffleQuestions(available).slice(0, count);
};

export const QUESTION_BANK: InterviewQuestion[] = [
  // SOFTWARE ENGINEERING
  {
    id: 'swe-1',
    domainId: 'swe',
    roleId: 'dist-sys',
    category: 'System Design & Scalability',
    difficulty: 'senior',
    prompt: 'Design a distributed, fault-tolerant rate limiting service capable of handling 500,000 requests per second across multiple global data centers. How do you maintain consistency without introducing intolerable cross-region latency?',
    contextNotes: 'The interviewer wants to see you balance local fast-path decisions with global limit synchronization, handling split-brain or network partitions gracefully.',
    hints: [
      'Consider the difference between token bucket and sliding window counter algorithms.',
      'Think about Redis clusters with local in-memory batching or token synchronization.',
      'Address what happens when cross-region replication is delayed (fail open vs fail closed).'
    ],
    evaluationFocus: [
      'Precision of algorithm selection (e.g. Sliding window log vs Token Bucket)',
      'Handling of network partitions (CAP theorem practical trade-off)',
      'Minimizing latency via local batching/leasing tokens'
    ],
    idealAnswerHighlights: [
      'Propose a token-bucket algorithm with local memory cache in front of regional Redis clusters.',
      'Use asynchronous token replenishment or centralized lease allocation to minimize cross-region RPCs.',
      'Define fail-open vs fail-closed policy based on tier of API service (e.g. security auth fails closed, analytics fails open).',
      'Address idempotency and clock skew issues via monotonic clock or logical timestamps.'
    ]
  },
  {
    id: 'swe-2',
    domainId: 'swe',
    roleId: 'dist-sys',
    category: 'Incident Management & Triage',
    difficulty: 'senior',
    prompt: 'During peak traffic on Black Friday, your payment service p99 latency spikes from 80ms to 4.2 seconds, causing cascading timeouts in downstream checkouts. Walk me through your first 15 minutes of triage, mitigation, and post-incident prevention.',
    contextNotes: 'Evaluates your technical composure, systematic diagnostic methodology, telemetry usage, and blast-radius containment under pressure.',
    hints: [
      'Prioritize immediate mitigation (customer relief) over root-cause investigation.',
      'Discuss circuit breakers, shedding non-critical load, and rollback strategies.',
      'Mention key telemetry: connection pools, database thread exhaustion, external payment gateway latency.'
    ],
    evaluationFocus: [
      'Speed to mitigate vs diagnosing root cause',
      'Use of circuit breaking or graceful degradation',
      'Blameless post-mortem actions and preventive alerting'
    ],
    idealAnswerHighlights: [
      'Immediate action: Activate incident commander role, check telemetry for external vs internal bottlenecks.',
      'Mitigation: Trip circuit breakers to fallback payment queues or degrade non-essential checks (e.g., fraud score fast-path).',
      'Scale connection pools or spin up extra replicas if CPU/threads are saturated.',
      'Post-mortem: Identify thread contention or locked DB rows, institute synthetic canary alerts and automated load shedding.'
    ]
  },
  {
    id: 'swe-3',
    domainId: 'swe',
    roleId: 'fullstack-lead',
    category: 'Architecture & Technical Debt',
    difficulty: 'mid',
    prompt: 'You inherit a legacy 500k-line monolithic application that takes 45 minutes to build and suffers frequent regression bugs. How do you persuade stakeholders to invest in modernization, and what incremental refactoring roadmap would you propose without freezing feature delivery?',
    contextNotes: 'Focuses on communication with non-technical stakeholders, modular design, and pragmatic Strangler Fig pattern application.',
    hints: [
      'Frame technical debt in business terms: engineering velocity, bug fix cost, customer churn.',
      'Use the Strangler Fig pattern rather than a multi-month rewrite.',
      'Establish a baseline of automated integration tests and feature flags.'
    ],
    evaluationFocus: [
      'Translating technical debt to executive ROI and risk',
      'Safe incremental refactoring strategy (Strangler Fig, vertical slices)',
      'Maintaining continuous delivery with feature flags'
    ],
    idealAnswerHighlights: [
      'Quantify the cost of delay: "We spend 30% of engineering hours patching regressions, costing \$X/quarter."',
      'Propose 80/20 allocation: 20% capacity per sprint dedicated to modularizing bounded contexts.',
      'Implement automated test coverage around the most volatile domain boundaries.',
      'Carve out high-traffic or independently scaled domains using reverse proxies and contract-based APIs.'
    ]
  },
  {
    id: 'swe-4',
    domainId: 'swe',
    roleId: 'fullstack-lead',
    category: 'Data Structures & Algorithmic Trade-offs',
    difficulty: 'senior',
    prompt: 'Compare an LSM-tree (Log-Structured Merge-tree) with a B+ Tree in the context of high-write vs read-heavy database workloads. In what scenario would an LSM-tree degrade drastically in performance?',
    contextNotes: 'Checks deep conceptual understanding of storage engines, write amplification, compaction stalls, and read amplification.',
    hints: [
      'Discuss sequential disk writes vs random page lookups.',
      'Mention compaction storms and Bloom filters.',
      'Highlight point reads vs range scans.'
    ],
    evaluationFocus: [
      'Clear differentiation of read vs write trade-offs',
      'Explanation of write amplification and background compactions',
      'Concrete scenarios where compaction saturation leads to write stalls'
    ],
    idealAnswerHighlights: [
      'LSM-trees turn random writes into sequential appends to MemTable/WAL, providing superior write throughput.',
      'B+ Trees provide predictable single-lookup reads and balanced traversal at the cost of random disk I/O on updates.',
      'LSM-tree degrades during "compaction debt" where background merges fall behind heavy ingest, causing write stalls and massive read amplification requiring multiple SSTable checks.'
    ]
  },
  {
    id: 'swe-5',
    domainId: 'swe',
    roleId: 'sre-devops',
    category: 'Behavioral & Leadership Conflict',
    difficulty: 'senior',
    prompt: 'Describe a time you strongly disagreed with a Product Manager who wanted to ship a critical revenue feature ahead of a security patch and database migration. How did you resolve the conflict while protecting system integrity?',
    contextNotes: 'Assesses executive persuasion, risk quantification, compromise, and mutual alignment without antagonizing cross-functional peers.',
    hints: [
      'Use the STAR method (Situation, Task, Action, Result).',
      'Frame the decision not as "No", but as "Yes, and here is how we de-risk it".',
      'Demonstrate business empathy alongside engineering rigor.'
    ],
    evaluationFocus: [
      'Structure of response (STAR method)',
      'Collaborative problem solving instead of dogmatic obstruction',
      'Measurable outcome that protected user trust and revenue'
    ],
    idealAnswerHighlights: [
      'Situation & Task: PM wanted to launch promo code engine during holiday rush, but unindexed migration could lock orders.',
      'Action: Ran a benchmark simulating peak concurrency to demonstrate that launching without the migration would crash checkout for all users, jeopardizing \$2M in sales.',
      'Compromise: Pair-programmed with backend to run an online zero-downtime shadow migration 3 days earlier, unblocking the feature on schedule with zero customer disruption.',
      'Result: Feature shipped on target with 99.99% uptime and zero security vulnerabilities.'
    ]
  },

  // CORPORATE MANAGEMENT & EXECUTIVE LEADERSHIP
  {
    id: 'mgmt-1',
    domainId: 'management',
    roleId: 'dir-ops',
    category: 'Strategic Prioritization & Resource Reallocation',
    difficulty: 'lead_executive',
    prompt: 'Due to macroeconomic pressure, the board requires an immediate 20% operational budget reduction without compromising the delivery of the company’s flagship annual strategic commitment. How do you approach this cut across departments, vendors, and headcount?',
    contextNotes: 'Tests strategic composure, stakeholder transparency, objective prioritization frameworks (e.g. Zero-Based Budgeting), and preserving team morale.',
    hints: [
      'Avoid peanut-butter slicing (equal cuts across all teams); protect the strategic core.',
      'Audit contractor spend, software SaaS tool sprawl, and non-essential travel first.',
      'Communicate transparently with staff to maintain psychological safety.'
    ],
    evaluationFocus: [
      'Structured evaluation criteria (Zero-Based Budgeting / Core vs Context)',
      'Protecting strategic revenue engines rather than across-the-board haircuts',
      'Executive communication strategy to prevent panic and attrition'
    ],
    idealAnswerHighlights: [
      'Framework: Differentiate "Core" (direct revenue/strategic differentiator) from "Context" (support services).',
      'Tiered approach: First eliminate duplicate SaaS licenses and consolidate vendor contracts (typically 8-12% savings).',
      'Reallocate underutilized personnel from speculative exploratory bets to the flagship initiative rather than immediate mass layoffs.',
      'Communicate decisions with radical clarity: Explain the macro context, the objective rubric used, and clear path to profitability.'
    ]
  },
  {
    id: 'mgmt-2',
    domainId: 'management',
    roleId: 'eng-mgr',
    category: 'People Leadership & Underperformance',
    difficulty: 'senior',
    prompt: 'A previously stellar senior lead has experienced a noticeable decline in delivery quality and team responsiveness over the last six weeks. Two junior engineers have complained about unreturned pull request reviews. How do you diagnose and handle this situation?',
    contextNotes: 'Assesses empathetic leadership, constructive candor, root-cause inquiry before punitive action, and clear performance coaching.',
    hints: [
      'Start with curious empathy, not an interrogation.',
      'Inquire about burnout, personal emergencies, or organizational blockers.',
      'Re-establish clear, time-bound agreements and offer actionable support.'
    ],
    evaluationFocus: [
      'Balance of empathy and accountability',
      'Separating skill issue from will/blocker/burnout issue',
      'Establishing clear metric-driven check-in cadence'
    ],
    idealAnswerHighlights: [
      '1-on-1 dialogue: "I value your leadership and noticed a shift in responsiveness recently. How are you doing, and what is currently taking up your bandwidth?"',
      'Identify root causes: Screen for personal crisis, role misalignment, or cognitive overload.',
      'Temporary relief: Delegate review load to a peer if temporary personal emergency, while setting firm boundaries.',
      'Structured 30-day coaching plan: Define unambiguous expectations (e.g., 24h PR turnaround, weekly sync) with compassionate accountability.'
    ]
  },
  {
    id: 'mgmt-3',
    domainId: 'management',
    roleId: 'strategy-exec',
    category: 'Cross-Functional Conflict & Alignment',
    difficulty: 'lead_executive',
    prompt: 'The VP of Sales is aggressively pushing to customize the core product for a single enterprise prospect offering a \$2M contract, while the VP of Product argues this custom fork will derail the general market roadmap for months. As Chief of Staff, how do you facilitate a decision?',
    contextNotes: 'Evaluates your ability to weigh short-term cash flow against long-term product-market fit, and establish a repeatable evaluation framework.',
    hints: [
      'Examine customer concentration risk and technical debt cost.',
      'Explore modular/extensible options (e.g. webhook/plugin API instead of a hard fork).',
      'Align on corporate North Star metrics approved by the CEO.'
    ],
    evaluationFocus: [
      'Objective decision matrix (Lifetime Value vs Opportunity Cost of delay)',
      'Seeking creative middle grounds (partner APIs, professional services wrapper)',
      'Executive consensus building without political animosity'
    ],
    idealAnswerHighlights: [
      'De-escalate the debate into data: Calculate the true opportunity cost (loss of general ARR vs \$2M one-time contract).',
      'Propose an Architectural Compromise: Can the enterprise requirements be built as a modular integration / extension point rather than a hard code fork?',
      'Pricing model: If bespoke work is unavoidable, charge professional services fees that fund external contract capacity to protect core roadmap.',
      'CEO decision memo: Present a structured MECE memo with clear trade-offs, financial models, and strategic recommendation.'
    ]
  },
  {
    id: 'mgmt-4',
    domainId: 'management',
    roleId: 'dir-ops',
    category: 'Crisis Management & Public Relations',
    difficulty: 'senior',
    prompt: 'A critical data breach has just been confirmed: sensitive customer billing details were exposed due to a misconfigured cloud storage bucket. Regulatory compliance demands public disclosure within 48 hours. What is your hour-by-hour executive playbook?',
    contextNotes: 'Tests crisis leadership, legal coordination, customer transparency, operational containment, and brand preservation.',
    hints: [
      'Contain the leak immediately before notifying anyone.',
      'Form an executive tiger team: Legal, PR, Engineering, Customer Success.',
      'Transparency and ownership over deflection.'
    ],
    evaluationFocus: [
      'Containment and preservation of forensic evidence',
      'Multi-stakeholder communication plan (board, regulators, affected users)',
      'Accountability and remedial security investments'
    ],
    idealAnswerHighlights: [
      'Hours 0-4: Containment — lock bucket permissions, revoke credentials, preserve forensic logs for legal counsel.',
      'Hours 4-12: Assemble War Room — quantify exact blast radius (number of affected accounts, data fields exposed).',
      'Hours 12-24: Regulatory & Legal filing — draft GDPR/CCPA notifications and board briefing.',
      'Hours 24-48: Transparent customer comms — direct email to affected users offering free identity monitoring, plain-language explanation of what happened, what was done, and what preventative guardrails were deployed.'
    ]
  },

  // ARTS & VOCAL PERFORMANCE
  {
    id: 'arts-1',
    domainId: 'arts_vocal',
    roleId: 'classical-opera',
    category: 'Vocal Technique & Acoustic Mechanics',
    difficulty: 'senior',
    prompt: 'When singing through the primo and secondo passaggio into the upper register in a high-demand operatic piece, how do you adjust your laryngeal position, pharyngeal resonance space, and appoggio breath support to avoid vocal fold strain while maintaining ring (squillo)?',
    contextNotes: 'Tests anatomical precision, awareness of vocal pedagogy (appoggio, acoustic cover, singer’s formant), and injury prevention.',
    hints: [
      'Discuss subglottic pressure vs airflow rate.',
      'Explain the "covering" sensation without depressing the tongue root.',
      'Mention epigastric expansion and costal breathing engagement.'
    ],
    evaluationFocus: [
      'Anatomical accuracy of vocal tract mechanisms (cricothyroid, vocalis, soft palate)',
      'Coordination of appoggio breath management without excess tension',
      'Acoustic management of resonance formants (F1/F2 coupling)'
    ],
    idealAnswerHighlights: [
      'Breath coordination: Maintain appoggio through active engagement of the lower abdominal wall and intercostal expansion, preventing excessive subglottic pressure surges.',
      'Laryngeal tilt: Allow the thyroid cartilage to tilt (cricothyroid dominant) naturally without forcing the larynx down.',
      'Vowel modification (aggiustamento): Narrow the vowel slightly (e.g. from /a/ toward open /o/) to match formant frequencies with the harmonic partials.',
      'Resonance: Elevate the velum (soft palate) to maximize pharyngeal volume, cultivating the 2.8-3.2 kHz "singer\'s formant" for effortless orchestral cut.'
    ]
  },
  {
    id: 'arts-2',
    domainId: 'arts_vocal',
    roleId: 'musical-theatre',
    category: 'Audition Psychology & Character Embodiment',
    difficulty: 'mid',
    prompt: 'You are walking into an open call callback for a career-defining role. The casting directors appear exhausted, and you only have a 16-bar cut to convey both vulnerability and commanding vocal presence. How do you calibrate your entrance, moment before, and vocal delivery?',
    contextNotes: 'Assesses professional poise, audition technique, dramatic intention, grounding under adrenaline, and vocal storytelling.',
    hints: [
      'Focus on the "moment before" you begin singing.',
      'Choose active verbs for dramatic objectives rather than generalized emotion.',
      'Connect breath directly to character thought.'
    ],
    evaluationFocus: [
      'Professional entrance etiquette and owning the room',
      'Clarity of dramatic objective (who are you talking to, what do you need?)',
      'Seamless vocal transition from conversational intimacy to resonant climax'
    ],
    idealAnswerHighlights: [
      'Entrance: Warm, grounded presence; treat the accompanist with professional clarity (give tempo cleanly with a quiet tap, not conducting).',
      'Moment before: Establish the specific scene partner just past the casting table; inhale the character’s urgent need before the first sound.',
      'Vocal arc: Start with spoken-inflected mix for intimate text delivery, transitioning smoothly into a resonant, supported belt on the dynamic climax.',
      'Exit: Thank the panel and accompanist warmly, leaving a professional, unshakeable impression regardless of their visible fatigue.'
    ]
  },
  {
    id: 'arts-3',
    domainId: 'arts_vocal',
    roleId: 'musical-theatre',
    category: 'Vocal Health & Touring Stamina',
    difficulty: 'senior',
    prompt: 'You are midway through an 8-show-a-week performance contract, and on Sunday morning before a two-show day you wake up with mild mucosal swelling and vocal fatigue. How do you assess your vocal folds, modify your performance safely, and manage recovery without canceling?',
    contextNotes: 'Tests responsible self-assessment, semi-occluded vocal tract (SOVT) exercises, hydration protocols, and safe vocal pacing.',
    hints: [
      'Explain gentle acoustic assessment tests (staccato phonation, quiet high notes).',
      'Describe SOVT exercises (straw phonation, lip trills, tongue rolls).',
      'Detail vocal pacing adjustments on stage (marking, mic balance, modified vowels).'
    ],
    evaluationFocus: [
      'Safe diagnosis of swelling vs structural pathology',
      'Use of evidence-based vocal rehabilitation exercises (SOVT, gentle glide)',
      'Responsible stage performance adjustments and vocal conservation'
    ],
    idealAnswerHighlights: [
      'Diagnostic check: Gentle siren on /u/ and quiet staccato in upper octave to test for delayed phonation onset (sign of vocal fold edema).',
      'Rehabilitation: Straw phonation in water to create backpressure and reduce laryngeal collision force; nebulizer with 0.9% sterile saline.',
      'Performance pacing: Partner with sound engineer to boost monitor presence; choose acoustic mix over high-pressure chest belting on non-essential phrases.',
      'Post-performance protocol: Silent steam therapy, zero alcohol/caffeine, 9 hours of sleep with humidified environment.'
    ]
  },
  {
    id: 'arts-4',
    domainId: 'arts_vocal',
    roleId: 'contemporary-artist',
    category: 'Artistic Collaboration & Directorial Feedback',
    difficulty: 'senior',
    prompt: 'During the final dress rehearsal of a high-profile production, the guest conductor insists that your climax phrase be sung at half the tempo with straight tone, which compromises both your breath line and dramatic emotional climax. How do you navigate this artistic disagreement collaboratively?',
    contextNotes: 'Evaluates artistic diplomacy, mutual respect, offering technical alternatives, and finding compromise without compromising vocal safety.',
    hints: [
      'Never argue in front of the full orchestra or ensemble.',
      'Understand the conductor’s underlying musical intent (rubato, mood, tension).',
      'Propose a test run with modified ornamentation or phrasing.'
    ],
    evaluationFocus: [
      'Professional etiquette and respectful dialogue in high-stress rehearsal',
      'Diagnosing the musical root need behind the conductor’s request',
      'Presenting a vocally healthy acoustic alternative that serves the collective piece'
    ],
    idealAnswerHighlights: [
      'Private conversation: Approach the maestro during intermission: "Maestro, I love the haunting stillness you are creating here. Let me understand your musical vision for the tempo deceleration."',
      'Vocal safety explanation: Respectfully explain that an absolute straight tone at 40 BPM creates immense subglottic tension at that pitch.',
      'Collaborative counter-proposal: "Could we start the note straight-toned with whisper-light pianissimo, and allow a natural subtle vibrato to warm the tone into the resolution?"',
      'Outcome: Demonstrate the solution live, building mutual trust and enhancing the final performance without vocal compromise.'
    ]
  },

  // PRODUCT MANAGEMENT
  {
    id: 'prod-1',
    domainId: 'product',
    roleId: 'senior-pm',
    category: 'Product Strategy & Metric Trade-offs',
    difficulty: 'senior',
    prompt: 'Your SaaS company’s Daily Active Users (DAU) have grown 40% quarter-over-quarter, but 90-day retention has dropped by 18%. How do you identify the underlying problem, and what experiments would you prioritize to stabilize long-term customer lifetime value?',
    contextNotes: 'Tests cohort analysis, differentiating acquisition vanity metrics from genuine product value realization, and retention levers.',
    hints: [
      'Break down user cohorts by acquisition channel and activation milestone.',
      'Check if top-of-funnel marketing attracted low-intent or mismatched users.',
      'Analyze time-to-first-value (Aha! moment).'
    ],
    evaluationFocus: [
      'Rigorous decomposition of retention cohorts',
      'Distinction between vanity acquisition and value activation',
      'Formulating clear, testable hypotheses for product onboarding'
    ],
    idealAnswerHighlights: [
      'Segment cohort analysis: Map retention curves by acquisition channel, user persona, and feature usage.',
      'Diagnose churn driver: Is it poor user qualification (marketing mismatch) or onboarding friction (failing to reach "Aha!" moment)?',
      'Measure activation: Define the critical core action (e.g. inviting 3 team members or publishing 1 project within 7 days).',
      'Prioritize experiments: In-app guided milestone tours, personalized workspace templates, and trigger-based re-engagement emails.'
    ]
  },
  {
    id: 'prod-2',
    domainId: 'product',
    roleId: 'senior-pm',
    category: 'Experimentation & Growth',
    difficulty: 'senior',
    prompt: 'A sign-up experiment increased trial starts by 22%, but paid conversion fell and support requests rose. How would you determine whether to ship, revise, or roll back the change?',
    contextNotes: 'Look for a balanced experiment readout, segment analysis, guardrail metrics, and a clear decision rule.',
    hints: ['Check experiment validity and segment-level effects.', 'Follow the funnel from sign-up through activation and payment.', 'Include support burden and customer quality as guardrails.'],
    evaluationFocus: ['experiment validity', 'conversion funnel', 'guardrail metrics', 'customer segments'],
    idealAnswerHighlights: ['Validate assignment, sample size, and duration.', 'Find which cohorts drove the lift and conversion decline.', 'Make a decision using activation, paid conversion, and support guardrails.'],
  },
  {
    id: 'prod-3',
    domainId: 'product',
    roleId: 'senior-pm',
    category: 'Prioritization & Product Strategy',
    difficulty: 'senior',
    prompt: 'Sales asks for a large enterprise feature that could close an important deal, while research shows many smaller customers struggle with onboarding. How would you prioritize the roadmap?',
    contextNotes: 'Explain how you weigh strategic fit, customer evidence, opportunity cost, and reversible options.',
    hints: ['Clarify the problem behind the enterprise request.', 'Estimate reach, impact, confidence, and effort for both opportunities.', 'Consider a smaller test or configurable solution.'],
    evaluationFocus: ['customer evidence', 'strategic fit', 'opportunity cost', 'prioritization rationale'],
    idealAnswerHighlights: ['Separate the customer problem from the requested solution.', 'Compare impact and cost across customer segments.', 'State the decision, trade-off, and evidence that would change it.'],
  },
  {
    id: 'prod-4',
    domainId: 'product',
    roleId: 'senior-pm',
    category: 'Launch & Adoption',
    difficulty: 'mid',
    prompt: 'A feature launch met its delivery date but only 8% of eligible users tried it in the first month. How would you diagnose adoption and decide what to do next?',
    contextNotes: 'Focus on discoverability, user need, activation friction, and measurable follow-up actions.',
    hints: ['Verify exposure and instrumentation.', 'Interview users who tried it and those who did not.', 'Separate awareness, relevance, and usability problems.'],
    evaluationFocus: ['adoption funnel', 'user research', 'activation friction', 'instrumentation'],
    idealAnswerHighlights: ['Validate eligibility and event tracking.', 'Identify where users fail to discover or complete the workflow.', 'Choose a targeted improvement and success metric.'],
  },
  {
    id: 'prod-5',
    domainId: 'product',
    roleId: 'senior-pm',
    category: 'Metrics & Product Outcomes',
    difficulty: 'senior',
    prompt: 'Your team’s weekly active users are increasing, but the rate of users completing the product’s core task is flat. What would you investigate and which metric would you use to guide the team?',
    contextNotes: 'Tests metric quality, user segmentation, and connecting activity to customer value.',
    hints: ['Define the core task and successful completion.', 'Break down new versus returning users and key segments.', 'Pair a primary outcome with quality or retention guardrails.'],
    evaluationFocus: ['core task completion', 'metric definition', 'user segmentation', 'guardrail metric'],
    idealAnswerHighlights: ['Check whether more activity represents meaningful use.', 'Find segment and funnel differences.', 'Align the team around a value-linked outcome and guardrail.'],
  },
  {
    id: 'prod-6',
    domainId: 'product',
    roleId: 'senior-pm',
    category: 'Customer Feedback & Product Decisions',
    difficulty: 'mid',
    prompt: 'A small group of influential customers relies on a feature that most users never use and that is expensive to maintain. How would you decide whether to improve, limit, or retire it?',
    contextNotes: 'Look for customer impact, usage evidence, migration planning, and communication.',
    hints: ['Measure usage and business value across segments.', 'Understand whether alternatives meet the same need.', 'Plan notice, migration support, and success criteria.'],
    evaluationFocus: ['usage data', 'customer impact', 'maintenance cost', 'migration plan'],
    idealAnswerHighlights: ['Combine quantitative usage with customer conversations.', 'Compare maintenance cost with strategic value.', 'Mitigate disruption through a clear transition plan.'],
  },
  {
    id: 'prod-7',
    domainId: 'product',
    roleId: 'ai-pm',
    category: 'AI Product Quality & Latency',
    difficulty: 'senior',
    prompt: 'An AI assistant gives more accurate answers after a model upgrade, but median response time doubles and infrastructure cost rises sharply. How would you decide whether to launch the upgrade?',
    contextNotes: 'Tests evaluation quality, user impact, latency and cost trade-offs, and rollout strategy.',
    hints: ['Define quality on representative tasks, not one aggregate score.', 'Compare latency and cost against user value.', 'Consider staged rollout, routing, or model choice by task.'],
    evaluationFocus: ['evaluation set', 'latency', 'inference cost', 'staged rollout'],
    idealAnswerHighlights: ['Use representative offline and human evaluation.', 'Set quality, latency, and cost guardrails by use case.', 'Roll out gradually with monitoring and rollback criteria.'],
  },
  {
    id: 'prod-8',
    domainId: 'product',
    roleId: 'ai-pm',
    category: 'AI Reliability & Launch Readiness',
    difficulty: 'lead_executive',
    prompt: 'During a pilot, users report that an AI assistant occasionally invents policy details. Leadership wants a broad launch next week. What would you recommend and how would you reduce the risk?',
    contextNotes: 'Look for severity assessment, evidence, mitigation, user communication, and a launch decision.',
    hints: ['Identify affected workflows and potential harm.', 'Test retrieval, refusal, and escalation behavior.', 'Define launch gates and a rollback plan.'],
    evaluationFocus: ['hallucination risk', 'launch criteria', 'human escalation', 'monitoring'],
    idealAnswerHighlights: ['Scope the failure with targeted evaluation and incident review.', 'Constrain high-risk answers and provide safe escalation.', 'Gate rollout on measurable reliability and monitoring.'],
  },
  {
    id: 'prod-9',
    domainId: 'product',
    roleId: 'ai-pm',
    category: 'AI Evaluation & Measurement',
    difficulty: 'senior',
    prompt: 'Your team is choosing between two AI models for a support product. Offline benchmark scores favor one model, but support agents prefer the other in a small pilot. How would you make the decision?',
    contextNotes: 'Tests evaluation design, representative tasks, human judgment, and production outcomes.',
    hints: ['Review benchmark coverage and failure cases.', 'Run a blinded comparison on representative workflows.', 'Measure resolution quality, handling time, and escalation.'],
    evaluationFocus: ['benchmark coverage', 'human evaluation', 'support outcomes', 'pilot design'],
    idealAnswerHighlights: ['Align the test set to real user tasks.', 'Combine blinded human review with operational metrics.', 'Choose with explicit thresholds and ongoing monitoring.'],
  },
  {
    id: 'prod-10',
    domainId: 'product',
    roleId: 'ai-pm',
    category: 'AI Data Governance & Privacy',
    difficulty: 'lead_executive',
    prompt: 'A proposed AI feature would use customer conversations to personalize future responses. What product, privacy, and trust questions would you resolve before approving the feature?',
    contextNotes: 'Focus on data purpose, consent, retention, access, user controls, and product value.',
    hints: ['Map what data is collected and how it is used.', 'Define retention, access, deletion, and opt-out controls.', 'Consult privacy, security, and legal partners before launch.'],
    evaluationFocus: ['data purpose', 'user consent', 'retention policy', 'privacy controls'],
    idealAnswerHighlights: ['Document data flow and intended use.', 'Provide meaningful notice and user controls.', 'Set retention and access limits with review before rollout.'],
  }
];

const SUPPLEMENTAL_QUESTION_SEEDS: Pick<InterviewQuestion, 'id' | 'domainId' | 'roleId' | 'category' | 'difficulty' | 'prompt'>[] = [
  { id: 'swe-6', domainId: 'swe', roleId: 'dist-sys', category: 'Distributed Systems Reliability', difficulty: 'senior', prompt: 'A background job is occasionally processed twice after a worker restart. How would you make the workflow safe and observable across retries?' },
  { id: 'swe-7', domainId: 'swe', roleId: 'dist-sys', category: 'Data Consistency', difficulty: 'senior', prompt: 'Two services update related records, and users sometimes see conflicting states. How would you diagnose and improve consistency without slowing every request?' },
  { id: 'swe-8', domainId: 'swe', roleId: 'sre-devops', category: 'Incident Response', difficulty: 'senior', prompt: 'A deployment causes intermittent errors that affect only one region. Walk through how you would contain the incident, find the cause, and prevent recurrence.' },
  { id: 'swe-9', domainId: 'swe', roleId: 'sre-devops', category: 'Capacity Planning', difficulty: 'senior', prompt: 'Traffic is expected to triple during a major event. How would you test capacity, identify bottlenecks, and define a safe degradation plan?' },
  { id: 'swe-10', domainId: 'swe', roleId: 'fullstack-lead', category: 'API Design', difficulty: 'senior', prompt: 'A public API is difficult to evolve because clients depend on undocumented behavior. How would you improve the contract and roll out a compatible migration?' },
  { id: 'swe-11', domainId: 'swe', roleId: 'fullstack-lead', category: 'Performance Engineering', difficulty: 'mid', prompt: 'A key page became noticeably slower after a release. How would you isolate whether the cause is rendering, network requests, or backend work?' },
  { id: 'swe-12', domainId: 'swe', roleId: 'dist-sys', category: 'Storage Architecture', difficulty: 'senior', prompt: 'A product needs to retain rapidly growing event data for analytics and customer audits. How would you choose storage, retention, and access patterns?' },
  { id: 'swe-13', domainId: 'swe', roleId: 'sre-devops', category: 'Security & Operations', difficulty: 'lead_executive', prompt: 'A dependency used by several production services receives a critical security advisory. How would you prioritize remediation while keeping services reliable?' },
  { id: 'mgmt-5', domainId: 'management', roleId: 'eng-mgr', category: 'Team Leadership', difficulty: 'senior', prompt: 'Two strong team leads disagree about a technical direction, and the disagreement is delaying delivery. How would you help them reach a decision?' },
  { id: 'mgmt-6', domainId: 'management', roleId: 'dir-ops', category: 'Operational Improvement', difficulty: 'senior', prompt: 'A process has missed its service targets for three months, but each department attributes the problem to another team. How would you find the constraint and drive improvement?' },
  { id: 'mgmt-7', domainId: 'management', roleId: 'strategy-exec', category: 'Strategic Prioritization', difficulty: 'lead_executive', prompt: 'Leadership has committed to more initiatives than the organization can deliver this quarter. How would you reset priorities and align stakeholders?' },
  { id: 'mgmt-8', domainId: 'management', roleId: 'eng-mgr', category: 'Performance Coaching', difficulty: 'senior', prompt: 'A previously reliable employee has missed several commitments and stopped participating in team discussions. How would you respond?' },
  { id: 'mgmt-9', domainId: 'management', roleId: 'dir-ops', category: 'Change Management', difficulty: 'senior', prompt: 'A new operating process is improving efficiency in one group but creating extra work for another. How would you assess and adjust the change?' },
  { id: 'mgmt-10', domainId: 'management', roleId: 'strategy-exec', category: 'Executive Communication', difficulty: 'lead_executive', prompt: 'You have to recommend delaying a visible launch because of unresolved operational risks. How would you present the recommendation to executives and customers?' },
  { id: 'mgmt-11', domainId: 'management', roleId: 'eng-mgr', category: 'Talent Development', difficulty: 'mid', prompt: 'Your team depends heavily on one specialist, and their workload is becoming unsustainable. How would you reduce the risk while supporting that person?' },
  { id: 'mgmt-12', domainId: 'management', roleId: 'dir-ops', category: 'Business Metrics', difficulty: 'senior', prompt: 'A cost-reduction program met its savings target but customer complaints increased. How would you determine what to change next?' },
  { id: 'arts-5', domainId: 'arts_vocal', roleId: 'classical-opera', category: 'Audition Preparation', difficulty: 'senior', prompt: 'You receive an audition request with unfamiliar repertoire and limited preparation time. How would you select material and prepare a reliable performance?' },
  { id: 'arts-6', domainId: 'arts_vocal', roleId: 'musical-theatre', category: 'Performance Recovery', difficulty: 'senior', prompt: 'Your voice feels fatigued midway through a demanding performance week. How would you adjust practice and performance preparation while protecting vocal health?' },
  { id: 'arts-7', domainId: 'arts_vocal', roleId: 'contemporary-artist', category: 'Creative Collaboration', difficulty: 'mid', prompt: 'A producer asks you to change an arrangement in a way that does not fit your artistic intent. How would you discuss alternatives and move the collaboration forward?' },
  { id: 'arts-8', domainId: 'arts_vocal', roleId: 'classical-opera', category: 'Technique & Interpretation', difficulty: 'senior', prompt: 'A technically demanding passage is accurate in practice but unreliable under performance pressure. How would you diagnose and improve it?' },
  { id: 'arts-9', domainId: 'arts_vocal', roleId: 'musical-theatre', category: 'Character & Storytelling', difficulty: 'mid', prompt: 'A director says your performance is vocally strong but the character’s objective is unclear. How would you revise your interpretation?' },
  { id: 'arts-10', domainId: 'arts_vocal', roleId: 'contemporary-artist', category: 'Studio Performance', difficulty: 'mid', prompt: 'A recording session is producing inconsistent vocal takes despite a good rehearsal. How would you work with the engineer and adjust your approach?' },
  { id: 'arts-11', domainId: 'arts_vocal', roleId: 'classical-opera', category: 'Ensemble Collaboration', difficulty: 'senior', prompt: 'You and a scene partner have different interpretations that affect timing and musical coordination. How would you resolve the difference in rehearsal?' },
  { id: 'arts-12', domainId: 'arts_vocal', roleId: 'musical-theatre', category: 'Career Development', difficulty: 'mid', prompt: 'You want to broaden your casting range while maintaining a sustainable training routine. How would you set goals and measure progress?' },
];

type QuestionScenario = [roleId: string, category: string, scenario: string];

const QUESTION_SCENARIOS: Record<'swe' | 'management' | 'arts_vocal' | 'product', QuestionScenario[]> = {
  swe: [
    ['sre-devops', 'Deployment Safety', 'rolling out a risky service migration to production'],
    ['dist-sys', 'Distributed Queues', 'designing a queue that must survive worker and broker failures'],
    ['fullstack-lead', 'Data Migration', 'moving customer data to a new schema without downtime'],
    ['sre-devops', 'Observability', 'reducing alert noise while preserving fast incident detection'],
    ['dist-sys', 'Caching Strategy', 'serving frequently requested data across regions with stale reads'],
    ['fullstack-lead', 'Accessibility', 'improving a core workflow that excludes keyboard and screen-reader users'],
    ['dist-sys', 'Rate Limiting', 'protecting a public API from bursts without blocking legitimate users'],
    ['sre-devops', 'Recovery Planning', 'restoring service after a regional dependency outage'],
    ['fullstack-lead', 'Technical Debt', 'deciding whether to refactor a fragile feature before adding new capability'],
    ['dist-sys', 'Service Boundaries', 'splitting a growing application into independently operated services'],
    ['sre-devops', 'Reliability Targets', 'setting service objectives for a product with uneven traffic patterns'],
    ['fullstack-lead', 'Frontend Performance', 'improving a complex page that performs poorly on lower-end devices'],
  ],
  management: [
    ['dir-ops', 'Budget Planning', 'delivering an annual plan after a midyear budget reduction'],
    ['eng-mgr', 'Team Conflict', 'resolving a disagreement that is affecting collaboration across two teams'],
    ['strategy-exec', 'Strategic Change', 'shifting organizational priorities after a major market change'],
    ['dir-ops', 'Service Quality', 'improving a customer-facing operation with inconsistent service levels'],
    ['eng-mgr', 'Hiring Decisions', 'filling a critical role while maintaining a fair and consistent hiring process'],
    ['strategy-exec', 'Stakeholder Alignment', 'aligning executives who have conflicting definitions of success'],
    ['dir-ops', 'Process Redesign', 'removing delays from a high-volume process without reducing quality controls'],
    ['eng-mgr', 'Team Capacity', 'responding to sustained workload growth without relying on overtime'],
    ['strategy-exec', 'Risk Management', 'deciding whether to enter a market with meaningful regulatory uncertainty'],
    ['dir-ops', 'Vendor Management', 'addressing a critical vendor that is missing service commitments'],
    ['eng-mgr', 'Organizational Change', 'introducing a new operating model to a team that is skeptical of the change'],
    ['strategy-exec', 'Crisis Communication', 'communicating an operational failure to employees, customers, and the board'],
  ],
  arts_vocal: [
    ['classical-opera', 'Repertoire Choice', 'choosing repertoire that fits an audition brief and your current vocal condition'],
    ['musical-theatre', 'Vocal Stamina', 'preparing for repeated performances with limited recovery time'],
    ['contemporary-artist', 'Creative Direction', 'developing a distinct artistic sound while meeting a producer’s brief'],
    ['classical-opera', 'Language & Diction', 'preparing a role in a language you do not speak fluently'],
    ['musical-theatre', 'Character Work', 'making a character’s objective clear through a demanding song'],
    ['contemporary-artist', 'Live Sound', 'adapting a performance when the stage monitoring system is unreliable'],
    ['classical-opera', 'Audition Feedback', 'responding to feedback that conflicts with your established technique'],
    ['musical-theatre', 'Ensemble Work', 'resolving timing and blend issues within a close-harmony ensemble'],
    ['contemporary-artist', 'Recording Preparation', 'delivering consistent takes during a long recording session'],
    ['classical-opera', 'Vocal Health', 'adjusting a performance plan when early signs of vocal fatigue appear'],
    ['musical-theatre', 'Director Collaboration', 'discussing a staging choice that makes singing less sustainable'],
    ['contemporary-artist', 'Career Planning', 'balancing creative projects with the practical demands of a sustainable career'],
  ],
  product: [
    ['senior-pm', 'Product Discovery', 'validating a customer problem before committing a team to a large feature'],
    ['senior-pm', 'Roadmap Planning', 'replanning a roadmap after a major customer need changes'],
    ['senior-pm', 'Pricing Strategy', 'evaluating a proposed price change that could improve revenue but increase churn'],
    ['senior-pm', 'Customer Segmentation', 'deciding which of several customer segments should be served first'],
    ['senior-pm', 'Launch Readiness', 'launching a feature when adoption risks remain but the market window is short'],
    ['senior-pm', 'Product Quality', 'addressing a rise in customer complaints despite stable usage metrics'],
    ['ai-pm', 'AI Safety', 'launching an AI feature whose errors could create a meaningful user harm'],
    ['ai-pm', 'Model Selection', 'choosing between a faster model and a more capable but costly model'],
    ['ai-pm', 'Human Review', 'deciding where human review is needed in an AI-assisted workflow'],
    ['ai-pm', 'Evaluation Data', 'building an evaluation set when production examples are sensitive or incomplete'],
    ['ai-pm', 'AI Adoption', 'improving trust in an AI feature that users try once but rarely use again'],
    ['ai-pm', 'Responsible AI', 'responding to a new policy requirement that changes how an AI feature can be used'],
  ],
};

const GENERATED_QUESTION_VARIANTS = [
  (scenario: string) => `Plan an approach to ${scenario}. What constraints would you clarify, and how would you define success?`,
  (scenario: string) => `A problem emerges while ${scenario}. How would you diagnose it, respond, and prevent it from happening again?`,
  (scenario: string) => `Stakeholders disagree on how to handle ${scenario}. How would you compare options, build alignment, and decide what to do next?`,
];

const GENERATED_QUESTIONS: InterviewQuestion[] = Object.entries(QUESTION_SCENARIOS).flatMap(([domainId, scenarios]) =>
  scenarios.flatMap(([roleId, category, scenario], scenarioIndex) =>
    GENERATED_QUESTION_VARIANTS.map((createPrompt, variantIndex) => ({
      id: `${domainId}-scenario-${scenarioIndex + 1}-${variantIndex + 1}`,
      domainId,
      roleId,
      category,
      difficulty: variantIndex === 2 ? 'lead_executive' : 'senior',
      prompt: createPrompt(scenario),
      contextNotes: `Explore your approach to ${category.toLowerCase()} and the reasoning behind your choices.`,
      hints: ['Clarify the goal and constraints.', 'Explain actions and trade-offs.', 'Describe the outcome and how you would measure it.'],
      evaluationFocus: [category.toLowerCase(), 'reasoning', 'trade-offs', 'outcome'],
      idealAnswerHighlights: ['A clear diagnosis of the central challenge', 'Specific actions and reasoning', 'A measurable outcome or reflection'],
    } as InterviewQuestion)),
  ),
);

QUESTION_BANK.push(...SUPPLEMENTAL_QUESTION_SEEDS.map((seed): InterviewQuestion => ({
  ...seed,
  contextNotes: `Explain your approach to ${seed.category.toLowerCase()}, including the reasoning behind your choices.`,
  hints: ['Clarify the goal and constraints.', 'Describe your actions and trade-offs.', 'Explain the outcome and how you would assess success.'],
  evaluationFocus: [seed.category.toLowerCase(), 'reasoning', 'trade-offs', 'outcome'],
  idealAnswerHighlights: ['A clear diagnosis of the central challenge', 'Specific actions and reasoning', 'A measurable outcome or reflection'],
})), ...GENERATED_QUESTIONS);

export const getQuestionPoolForDomainAndRole = (
  domainId: string,
  roleId?: string,
): InterviewQuestion[] => {
  const domainQuestions = QUESTION_BANK.filter((question) => question.domainId === domainId);
  if (!roleId) return domainQuestions;
  const roleQuestions = domainQuestions.filter((question) => question.roleId === roleId);
  return [...roleQuestions, ...domainQuestions.filter((question) => question.roleId !== roleId)];
};

export const getQuestionsForDomainAndRole = (
  domainId: string,
  roleId: string | undefined,
  count: number = 3,
  excludedQuestionIds: string[] = [],
): InterviewQuestion[] => {
  if (count <= 0) return [];
  const excluded = new Set(excludedQuestionIds);
  const allQuestions = getQuestionPoolForDomainAndRole(domainId, roleId);
  const freshQuestions = allQuestions.filter((question) => !excluded.has(question.id));
  const preferredRoleQuestions = roleId
    ? freshQuestions.filter((question) => question.roleId === roleId)
    : freshQuestions;
  const pool = preferredRoleQuestions.length >= count
    ? preferredRoleQuestions
    : freshQuestions;
  return shuffleQuestions(pool).slice(0, count);
};

const shuffleQuestions = (questions: InterviewQuestion[]): InterviewQuestion[] => {
  const shuffled = [...questions];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};
