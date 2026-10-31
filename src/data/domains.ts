import { DomainInfo, InterviewQuestion } from '../types/interview';

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
      primary: '#A55534',
      secondary: '#C68C6E',
      border: 'border-[#3A1D19]',
      bgGlow: 'bg-[#3A1D19]/50',
      textAccent: 'text-[#C68C6E]',
      gradient: 'from-[#A55534] to-[#C68C6E]',
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
      primary: '#3A1D19',
      secondary: '#A55534',
      border: 'border-[#3A1D19]',
      bgGlow: 'bg-[#3A1D19]/40',
      textAccent: 'text-[#F5F1EC]',
      gradient: 'from-[#3A1D19] to-[#A55534]',
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
      primary: '#C68C6E',
      secondary: '#EEE9E3',
      border: 'border-[#3A1D19]',
      bgGlow: 'bg-[#A55534]/20',
      textAccent: 'text-[#EEE9E3]',
      gradient: 'from-[#C68C6E] to-[#EEE9E3]',
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
      primary: '#A55534',
      secondary: '#3A1D19',
      border: 'border-[#3A1D19]',
      bgGlow: 'bg-[#3A1D19]/40',
      textAccent: 'text-[#C68C6E]',
      gradient: 'from-[#A55534] to-[#3A1D19]',
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
  }
];

export const getQuestionsForDomainAndRole = (
  domainId: string,
  roleId?: string,
  count: number = 3
): InterviewQuestion[] => {
  let filtered = QUESTION_BANK.filter((q) => q.domainId === domainId);
  if (roleId) {
    const roleQuestions = filtered.filter((q) => q.roleId === roleId);
    if (roleQuestions.length >= count) {
      filtered = roleQuestions;
    }
  }
  
  // Return requested count, cycling or picking representative questions
  return filtered.slice(0, count);
};
