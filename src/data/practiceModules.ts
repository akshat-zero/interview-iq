import { PracticeModule } from '../types/interview';

export const PRACTICE_MODULES: PracticeModule[] = [
  {
    id: 'mod-swe',
    domainId: 'swe',
    title: 'Distributed Systems & Backend Architecture Study Guide',
    subtitle: 'Core mechanical foundations, storage engines, isolation anomalies & protocol trade-offs',
    estimatedMinutes: 25,
    iconName: 'Cpu',
    overview:
      'This preparation module focuses on foundational distributed systems theory and backend primitives. Review the trade-off frameworks, examine the core cheat sheet, and practice with the self-study drills below before entering full mock interviews.',
    frameworks: [
      {
        name: 'The PACELC Theorem',
        description: 'An extension to the CAP theorem that accounts for normal operational latency.',
        steps: [
          'If there is a Partition (P), trade off Availability (A) versus Consistency (C).',
          'Else (E), trade off Latency (L) versus Consistency (C).',
          'Example: MongoDB favors Consistency and Partition tolerance (CP), but under normal operation trades off Latency for Consistency.'
        ]
      },
      {
        name: 'Cache Invalidation Strategies',
        description: 'Comparison of data propagation between application memory and persistent storage.',
        steps: [
          'Cache-Aside (Lazy Loading): App reads from cache; on miss, reads DB and writes to cache. Risk: Stale data until TTL expires.',
          'Write-Through: App writes to cache; cache writes synchronously to DB. Upside: Clean consistency. Downside: Higher write latency.',
          'Write-Behind (Write-Back): App writes to cache; cache asynchronously writes to DB. Upside: Ultra-low latency. Downside: Risk of data loss if cache fails before flush.'
        ]
      }
    ],
    cheatSheet: [
      {
        term: 'Idempotency Key',
        definition: 'A unique identifier sent with an API request allowing servers to recognize duplicate operations.',
        practicalTip: 'Store idempotency keys in Redis with a 24-hour TTL to prevent double-charging credit cards during network retries.'
      },
      {
        term: 'Write-Ahead Logging (WAL)',
        definition: 'A mechanism where changes are appended to non-volatile disk before being applied to the in-memory data page.',
        practicalTip: 'WAL guarantees durability (D in ACID) and enables point-in-time recovery without random disk write penalties.'
      },
      {
        term: 'Consistent Hashing with Virtual Nodes',
        definition: 'Mapping keys and nodes onto a circular hash ring where each node owns multiple virtual positions.',
        practicalTip: 'Virtual nodes prevent cascading failure cascades when a single database cache node drops out of the ring.'
      },
      {
        term: 'Read Committed vs Serializable',
        definition: 'Transaction isolation levels defining which concurrency anomalies are permitted.',
        practicalTip: 'Read Committed prevents Dirty Reads. Serializable prevents Phantom Reads, Non-Repeatable Reads, and Serialization Anomalies via two-phase locking or SSI.'
      }
    ],
    practiceQuestions: [
      {
        id: 'drill-swe-1',
        title: 'Drill 1: Protocol Trade-offs (gRPC vs REST)',
        drillType: 'Trade-off Comparison',
        prompt:
          'Compare gRPC (HTTP/2 binary protobuf) with REST (HTTP/1.1 JSON) for internal microservice communication. Under what conditions is gRPC NOT the optimal choice?',
        conceptExplanation:
          'gRPC uses binary serialization and multiplexed streams, significantly reducing CPU cycles and wire overhead. However, it introduces schema maintenance, tooling complexity, and challenges with public browser accessibility without proxy gateways.',
        modelAnswer:
          'gRPC provides superior throughput and lower p99 latency via multiplexed HTTP/2 streams and Protobuf binary serialization, making it ideal for internal east-west microservice traffic. However, gRPC is NOT optimal when: 1) You are exposing public APIs directly to third-party web browsers without a gRPC-Web envoy proxy; 2) Human readability and ad-hoc curl debugging are prioritized in early-stage prototyping; 3) Your edge CDN or load balancers lack native HTTP/2 trailer and gRPC streaming support.',
        keyTakeaways: [
          'HTTP/2 multiplexing prevents Head-of-Line blocking at the request level.',
          'Protobuf eliminates costly JSON string serialization and UTF-8 parsing overhead.',
          'Edge firewalls and legacy corporate proxies often strip HTTP trailers required by gRPC.'
        ],
        commonPitfalls: [
          'Blindly suggesting gRPC for client-facing mobile or web apps without mentioning proxy requirements.',
          'Failing to mention backward compatibility through proto field numbering.'
        ]
      },
      {
        id: 'drill-swe-2',
        title: 'Drill 2: Database Isolation Levels & Anomalies',
        drillType: 'Concept Drill',
        prompt:
          'Explain what a "Dirty Read", "Non-Repeatable Read", and "Phantom Read" are. Which isolation level guarantees complete prevention of all three?',
        conceptExplanation:
          'ACID isolation levels exist on a spectrum: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. Each step prevents specific concurrent race conditions at the cost of concurrency throughput.',
        modelAnswer:
          '1) Dirty Read: Transaction A reads uncommitted mutated data from Transaction B, which later rolls back (B vanishes, A acted on false data). Prevented by Read Committed.\n2) Non-Repeatable Read: Transaction A reads a row, Transaction B updates that row and commits; Transaction A re-reads the row and sees different values. Prevented by Repeatable Read.\n3) Phantom Read: Transaction A queries a range of rows with a WHERE clause, Transaction B inserts new rows matching that range and commits; Transaction A re-runs the range query and sees new "phantom" rows.\nSerializable isolation level guarantees prevention of all three anomalies, typically implemented via Serial Snapshot Isolation (SSI) or strict 2-Phase Locking (2PL).',
        keyTakeaways: [
          'Postgres Repeatable Read also prevents phantom reads in addition to non-repeatable reads.',
          'Serializable transactions require application-level retry logic to handle serialization failures (HTTP 409 or DB 40001).'
        ],
        commonPitfalls: [
          'Confusing a Non-Repeatable Read (updating existing row) with a Phantom Read (inserting new range rows).'
        ]
      },
      {
        id: 'drill-swe-3',
        title: 'Drill 3: Caching Invalidation & Thundering Herd',
        drillType: 'Scenario Drill',
        prompt:
          'What is the "Thundering Herd" (or Cache Stampede) problem, and what are two architectural techniques used to defend against it?',
        conceptExplanation:
          'When a heavily accessed cache key expires under high concurrency, thousands of simultaneous requests miss the cache and overwhelm the underlying database simultaneously.',
        modelAnswer:
          'The Thundering Herd problem occurs when a high-traffic cache key expires or is evicted, causing thousands of concurrent read requests to simultaneously query the database to regenerate the value, resulting in connection pool exhaustion and database collapse.\n\nTwo primary defenses:\n1) Mutual Exclusion (Mutex / Distributed Lock): Only the first cache miss acquires a short distributed lock (e.g., Redis Redlock) to query the database and repopulate the cache, while all subsequent requests wait or receive stale data.\n2) Probabilistic Early Expiration (XFetch algorithm): The application computes a probability based on read delta and remaining TTL; as the key nears expiration, one background worker preemptively re-computes the cache value before it actually expires.',
        keyTakeaways: [
          'Stale-While-Revalidate allows serving slightly old data while a background thread updates.',
          'Never set hard synchronous DB fallbacks without concurrency limiters on cache misses.'
        ],
        commonPitfalls: [
          'Simply increasing the TTL without addressing what happens when the key inevitably expires.'
        ]
      }
    ]
  },
  {
    id: 'mod-mgmt',
    domainId: 'management',
    title: 'Corporate Leadership & Executive Strategy Study Guide',
    subtitle: 'Top-down synthesis, P&L levers, executive memos & situational coaching frameworks',
    estimatedMinutes: 30,
    iconName: 'Briefcase',
    overview:
      'This study guide covers executive communication structure, financial operational levers, and human-centric talent management. Review the frameworks and practice articulating strategic decisions using the curated leadership drills.',
    frameworks: [
      {
        name: 'The Minto Pyramid Principle',
        description: 'Executive communication method created by Barbara Minto at McKinsey.',
        steps: [
          'Start with the Answer / Bottom Line First: State your primary recommendation in sentence 1.',
          'Group and Summarize Supporting Arguments: Provide 3 mutually exclusive, collectively exhaustive (MECE) rationale categories.',
          'Logically Order Detailed Evidence: Only dive into granular data if the executive requests supporting depth.'
        ]
      },
      {
        name: 'Situational Leadership Matrix (Hersey-Blanchard)',
        description: 'Adapting your management approach based on the direct report’s competence and commitment.',
        steps: [
          'Directing (High Commitment, Low Competence): Give clear step-by-step instructions (new hires).',
          'Coaching (Low Commitment, Developing Competence): Explain why, listen, and build confidence.',
          'Supporting (Variable Commitment, High Competence): Facilitate and empower; remove blockers.',
          'Delegating (High Commitment, High Competence): Give full autonomy on outcome and accountability.'
        ]
      }
    ],
    cheatSheet: [
      {
        term: 'MECE Framework',
        definition: 'Mutually Exclusive, Collectively Exhaustive. A problem-structuring rule ensuring no gaps or overlaps.',
        practicalTip: 'When decomposing a business cost reduction, separate spend into People, Vendors, and Infrastructure (mutually exclusive).'
      },
      {
        term: 'Rule of 40 (SaaS)',
        definition: 'A benchmark stating that a software company’s growth rate plus its profit margin should exceed 40%.',
        practicalTip: 'If your ARR is growing 50% year-over-year, you can tolerate a -10% EBITDA margin and still be elite.'
      },
      {
        term: 'Psychological Safety',
        definition: 'A shared belief that the team is safe for interpersonal risk-taking and constructive dissent.',
        practicalTip: 'Praise direct reports who bring forward severe vulnerabilities or early warning signs in team meetings.'
      },
      {
        term: 'Zero-Based Budgeting (ZBB)',
        definition: 'Budgeting where every department must justify all expenses starting from zero, rather than adjusting prior year budgets.',
        practicalTip: 'ZBB quickly flushes out legacy software licenses, duplicate contractor retainers, and stale tool sprawl.'
      }
    ],
    practiceQuestions: [
      {
        id: 'drill-mgmt-1',
        title: 'Drill 1: Output Velocity vs Business Outcome Framing',
        drillType: 'Framework Exercise',
        prompt:
          'How do you explain the difference between "Output Metrics" and "Outcome Metrics" to an engineering team that wants to be evaluated purely on story points shipped?',
        conceptExplanation:
          'Teams often conflate activity (features shipped, PRs merged) with business impact (customer retention, checkout conversion, latency reduction).',
        modelAnswer:
          'Output metrics measure activity: "We shipped 14 features and completed 180 story points this quarter." Outcome metrics measure customer and financial impact: "Our checkout redesign reduced cart abandonment by 4.2%, unlocking \$1.2M in annual recurring revenue."\n\nI coach teams with this mental model: "Shipping 20 features that no customer uses produces negative business value because it introduces maintenance overhead. Our goal is to achieve the maximum outcome with the minimum necessary output."',
        keyTakeaways: [
          'Link engineering effort directly to customer retention, conversion, or reliability.',
          'Avoid celebrating vanity velocity when churn is accelerating.'
        ],
        commonPitfalls: [
          'Demotivating the team by dismissing their hard work instead of reframing their metrics.'
        ]
      },
      {
        id: 'drill-mgmt-2',
        title: 'Drill 2: Coaching a Defensive Senior Manager',
        drillType: 'Scenario Drill',
        prompt:
          'A senior manager becomes defensive when you share 360-degree feedback indicating that their team feels micromanaged. How do you de-escalate the tension and establish constructive accountability?',
        conceptExplanation:
          'Defensiveness stems from perceived threat to status and competence. Effective leaders separate identity from behavior and ground the conversation in observed impact rather than accusations.',
        modelAnswer:
          '1) Acknowledge intent and establish safety: "I know how deeply you care about the quality of our deliverables, and your technical standards have saved us multiple times. My objective today is to help you scale your leadership so you do not burn out."\n2) Share concrete behavioral observations: "When you require approval on every internal pull request, two junior engineers reported feeling unable to make decisions, which increased review wait times from 4 hours to 3 days."\n3) Collaborative solutioning: "Let’s define clear guardrails: which decisions require your explicit sign-off, and which can be fully delegated with an asynchronous summary?"\n4) Time-bound check-in: Schedule a 30-day review to measure delegation velocity and team sentiment.',
        keyTakeaways: [
          'Frame feedback around behavior and impact, never character or competence.',
          'Provide clear guardrails for delegation so managers do not feel they are relinquishing control.'
        ],
        commonPitfalls: [
          'Quoting anonymous team members verbatim, which causes the manager to witch-hunt subordinates.'
        ]
      }
    ]
  },
  {
    id: 'mod-arts',
    domainId: 'arts_vocal',
    title: 'Acoustic Mechanics & Vocal Performance Study Guide',
    subtitle: 'Laryngeal musculature, vowel aggiustamento, formant acoustics & vocal rehabilitation',
    estimatedMinutes: 25,
    iconName: 'Mic2',
    overview:
      'This study guide breaks down anatomical vocal pedagogy, acoustic resonance tuning, and high-performance recovery regimens. Master these scientific principles and study drills before recording live vocal takes.',
    frameworks: [
      {
        name: 'The Appoggio Breath Support System',
        description: 'The historic Italian bel canto coordination of breath management without abdominal collapse.',
        steps: [
          'Inhalation: Expand the lower intercostal ribs and epigastrium; allow pelvic floor and diaphragm to descend naturally.',
          'Phonation: Retain the inspiratory rib expansion during singing (inhalare la voce / "inhale the voice").',
          'Epigastric Control: Dynamic engagement of the transversus abdominis prevents sudden subglottic pressure spikes.'
        ]
      },
      {
        name: 'Acoustic Formant Tuning (F1 / F2 Coupling)',
        description: 'Matching vocal tract resonances with vocal fold harmonic frequencies to maximize projection.',
        steps: [
          'F1 (First Formant): Governed primarily by jaw opening and pharyngeal volume.',
          'F2 (Second Formant): Governed by tongue shape and vowel frontness/backness.',
          'Singer’s Formant (F3-F5 cluster): A 2.8 - 3.2 kHz acoustic ring created by epilarynx tube narrowing, allowing unamplified voices to cut over a 90-piece orchestra.'
        ]
      }
    ],
    cheatSheet: [
      {
        term: 'Aggiustamento (Vowel Modification)',
        definition: 'Slight acoustic shading of vowels as pitch ascends to prevent vocal fold hyperfunction.',
        practicalTip: 'Near the secondo passaggio, shade /a/ toward an open /o/ to maintain acoustic coupling and prevent larynx elevation.'
      },
      {
        term: 'SOVT (Semi-Occluded Vocal Tract)',
        definition: 'Exercises with partial mouth resistance (straw in water, lip trills, puffy cheeks) that create backpressure.',
        practicalTip: 'Use 5 minutes of straw phonation between audition takes to reduce laryngeal collision force and lower phonation threshold pressure.'
      },
      {
        term: 'Thyroarytenoid (TA) vs Cricothyroid (CT)',
        definition: 'The antagonistic muscular pairing governing chest register (TA) versus head/falsetto register (CT).',
        practicalTip: 'A balanced mixed voice requires gradual CT dominance without abruptly disengaging the TA stabilizer.'
      },
      {
        term: 'Phonation Threshold Pressure (PTP)',
        definition: 'The minimum subglottic lung pressure required to initiate vocal fold oscillation.',
        practicalTip: 'PTP spikes when vocal fold tissue is dehydrated or swollen. Gentle sirens reveal early edema before hoarseness sounds.'
      }
    ],
    practiceQuestions: [
      {
        id: 'drill-arts-1',
        title: 'Drill 1: SOVT Acoustics & Vocal Fold Edema Recovery',
        drillType: 'Concept Drill',
        prompt:
          'Why is straw phonation in water (SOVT) considered one of the safest acoustic rehabilitation tools for fatigued vocal folds?',
        conceptExplanation:
          'Semi-occluding the mouth creates positive supraglottic backpressure, equalizing pressure across the glottis and widening the epilaryngeal tube.',
        modelAnswer:
          'Straw phonation in water creates positive acoustic backpressure at the lips, which reflects down into the vocal tract to partially separate the vocal folds. This accomplishes three distinct biomechanical benefits:\n1) Reduces Collision Force: The vocal folds vibrate with lower impact velocity, massaging swollen mucosal tissue without mechanical trauma.\n2) Lowers Phonation Threshold Pressure (PTP): Less lung pressure is required to initiate sound, preventing compensatory neck tension.\n3) Promotes Acoustic Inertance: Enhances source-filter coupling, training the singer to produce maximum acoustic ring with minimal muscular effort.',
        keyTakeaways: [
          'SOVT trains vocal tract impedance matching without strain.',
          'Water resistance allows tactile visual feedback via bubbling rate.'
        ],
        commonPitfalls: [
          'Blowing excess air through the straw rather than phonating a focused, resonant tone.'
        ]
      },
      {
        id: 'drill-arts-2',
        title: 'Drill 2: Mix-Belt Registration in Auditions',
        drillType: 'Trade-off Comparison',
        prompt:
          'What is the physiological difference between a healthy acoustic "mix-belt" and a raw "pulled chest voice"? How do you identify the difference auditorily?',
        conceptExplanation:
          'A healthy mix balances thyroarytenoid thickness with cricothyroid stretch and pharyngeal resonance, whereas pulled chest pushes thick fold mass into high pitch frequencies.',
        modelAnswer:
          'In a healthy mix-belt, the singer coordinates cricothyroid (CT) dominance to stretch the vocal folds while retaining just enough thyroarytenoid (TA) medial compression, assisted by narrow pharyngeal acoustic tuning. Auditorily, the tone sounds powerful, resonant, and bright, with rapid vibrato release and zero audible strain.\n\nIn a pulled chest voice, the singer forces heavy, thick TA muscle above the passaggio under high subglottic pressure without laryngeal tilt. Auditorily, this sounds pressed, metallic, flat in pitch, and exhibits a frozen vibrato and visible neck vein engorgement.',
        keyTakeaways: [
          'Pulled chest is unsustainable and leads to vocal nodules or hemorrhage under 8-show schedules.',
          'Mix-belt relies on acoustic vocal tract filtering rather than brute subglottic air pressure.'
        ],
        commonPitfalls: [
          'Confusing a quiet breathy falsetto with a supported acoustic head-mix.'
        ]
      }
    ]
  },
  {
    id: 'mod-prod',
    domainId: 'product',
    title: 'Product Discovery & Retention Metrics Study Guide',
    subtitle: 'Cohort retention decomposition, leading vs lagging indicators & discovery roadmapping',
    estimatedMinutes: 20,
    iconName: 'Sparkles',
    overview:
      'This study guide focuses on product discovery methodologies, retention analytics, and metric trade-off frameworks. Review the analytical mental models and practice deconstructing product problems.',
    frameworks: [
      {
        name: 'The CIRCLES Method (Product Design)',
        description: 'Comprehensive framework for decomposing ambiguous product design challenges.',
        steps: Array.of<string>(
          'Comprehend Situation: Clarify constraints, business goals, and platform context.',
          'Identify Customer: Segment users into distinct personas and select the primary target.',
          'Report User Needs: Map unmet Jobs-To-Be-Done and pain points.',
          'Cut Through Prioritization: Evaluate user value versus engineering complexity.',
          'List Solutions: Brainstorm 3 distinct structural product approaches.',
          'Evaluate Trade-offs: Identify pros, cons, and counter-metrics.',
          'Summarize Recommendation: Conclude with MVP roadmap and validation telemetry.'
        )
      }
    ],
    cheatSheet: [
      {
        term: 'Leading vs Lagging Indicator',
        definition: 'Leading indicators predict future performance (e.g., weekly active creators). Lagging indicators reflect past performance (e.g., quarterly revenue).',
        practicalTip: 'Always optimize product onboarding for leading activation actions rather than 90-day retention.'
      },
      {
        term: 'Net Revenue Retention (NRR)',
        definition: 'The percentage of recurring revenue retained from existing customers over a given period, including expansions and churn.',
        practicalTip: 'An NRR above 120% indicates strong product expansion even with flat top-of-funnel customer acquisition.'
      }
    ],
    practiceQuestions: [
      {
        id: 'drill-prod-1',
        title: 'Drill 1: Identifying Valid Leading Activation Indicators',
        drillType: 'Framework Exercise',
        prompt:
          'How do you prove that an "Aha! moment" (e.g. inviting 3 teammates within 48 hours) is actually a causative driver of retention rather than a mere correlation of already enthusiastic users?',
        conceptExplanation:
          'Correlational vanity metrics trick PMs into optimizing for behaviors that power users would do anyway.',
        modelAnswer:
          'To separate causation from correlation, I run an intentional intervention experiment:\n1) Cohort Baseline: Identify the correlated action (e.g. creating 2 folders in week 1).\n2) Controlled A/B Test: For a randomized 50% of new signups (Treatment), actively guide them through forced or incentivized folder creation during onboarding; the Control group receives standard onboarding without the prompt.\n3) Retention Verification: Measure 30-day and 90-day retention between Treatment and Control. If the Treatment cohort shows statistically significant retention lift, the milestone is causative. If retention remains flat, the action was merely correlational with already high-intent users.',
        keyTakeaways: [
          'Never confuse high-intent user correlation with causative product onboarding levers.',
          'Always set a guardrail metric (e.g. onboarding completion rate or time-to-first-task).'
        ],
        commonPitfalls: [
          'Assuming that because retained users do X, forcing everyone to do X will fix retention.'
        ]
      }
    ]
  }
];
