import React from 'react';
import { DOMAINS } from '../data/domains';
import {
  DomainId,
  DifficultyLevel,
  InterviewLength,
  InterviewSession,
  UserProfile,
} from '../types/interview';
import {
  Brain,
  ArrowRight,
  BookOpen,
  History,
  Check,
  X,
  Play,
  Dumbbell,
  Compass,
} from 'lucide-react';

export interface LandingViewProps {
  onStartDomain: (domainId: DomainId) => void;
  onOpenWalkingSelector?: () => void;
  onQuickStartInterview?: (
    domainId: DomainId,
    roleId: string,
    difficulty: DifficultyLevel,
    length: InterviewLength
  ) => void;
  onOpenSelector: () => void;
  onOpenRubric: () => void;
  onOpenStudy?: () => void;
  onOpenHistory?: () => void;
  onOpenProfile?: () => void;
  savedSessions?: InterviewSession[];
  currentUser?: UserProfile;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartDomain,
  onOpenWalkingSelector,
  onOpenSelector,
  onOpenRubric,
  onOpenStudy,
  onOpenHistory,
  onOpenProfile,
  savedSessions = [],
  currentUser,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#241910] text-[#E9DFDF] texture-plum selection:bg-[#754653]/40 selection:text-[#F4EDEF] font-sans-editorial">
      {/* Editorial Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#513A42] bg-[#241910]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
            aria-label="InterviewIQ Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#482832] via-[#754653] to-[#C69BA5] p-[1px] shadow-lg shadow-[#482832]/60">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#241910]">
                <Brain className="h-4 w-4 text-[#C69BA5]" />
              </div>
            </div>
            <span className="font-editorial text-lg tracking-tight text-[#F4EDEF]">
              Interview<span className="text-[#C69BA5]">IQ</span>
            </span>
            <span className="rounded border border-[#513A42] bg-[#482832] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#C69BA5]">
              MVP
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-7 font-mono text-xs text-[#D5BFC3] md:flex">
            <a href="#idea" className="transition-colors hover:text-[#F4EDEF]">
              Idea
            </a>
            <a href="#teaching" className="transition-colors hover:text-[#F4EDEF]">
              Method
            </a>
            <a href="#practice" className="transition-colors hover:text-[#F4EDEF]">
              Practice
            </a>
            <a href="#graph" className="transition-colors hover:text-[#F4EDEF]">
              Domains
            </a>
            <a href="#terms" className="transition-colors hover:text-[#F4EDEF]">
              Terms
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenRubric}
              className="hidden items-center gap-1.5 font-mono text-xs text-[#B18A91] transition-colors hover:text-[#F4EDEF] sm:inline-flex"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#754653]" />
              <span>4-Pillar Rubric</span>
            </button>

            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="hidden items-center gap-1.5 font-mono text-xs text-[#B18A91] transition-colors hover:text-[#F4EDEF] sm:inline-flex"
              >
                <History className="h-3.5 w-3.5 text-[#C69BA5]" />
                <span>Past Sessions</span>
                {savedSessions.length > 0 && (
                  <span className="rounded bg-[#513A42] px-1.5 py-0.2 text-[10px] text-[#F4EDEF]">
                    {savedSessions.length}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSelector}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#754653] bg-[#754653] px-3.5 py-1.5 font-ui text-xs font-semibold text-[#F4EDEF] transition-all hover:bg-[#C6A0A7] hover:text-[#241910]"
            >
              <Play className="h-3 w-3 fill-current text-[#F4EDEF]" />
              <span>Start Mock</span>
            </button>

            {currentUser && onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                title={`Logged in as ${currentUser.name}`}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#513A42] transition-transform hover:scale-105"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-full w-full object-cover"
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-20">
        {/* Editorial Sub-Head */}
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-[#C69BA5]">
          A web app for structured mock interviews and practice.
        </div>

        {/* Hero Title & Emblem Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6">
          <h1 className="font-editorial text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#F4EDEF] font-normal">
            InterviewIQ
          </h1>
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#482832] via-[#754653] to-[#C69BA5] p-[2px] shadow-2xl shadow-[#482832]/60 shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#241910]">
              <Brain className="h-11 w-11 sm:h-14 sm:w-14 text-[#C69BA5]" />
            </div>
          </div>
        </div>

        {/* Sub-Hero 3-Column Info Strip */}
        <div className="grid grid-cols-1 gap-6 border-b border-[#513A42] pb-14 pt-4 md:grid-cols-3 md:items-baseline">
          {/* Col 1 */}
          <div className="font-mono text-xs uppercase tracking-widest text-[#B18A91]">
            AN AGENT HARNESS
            <br />
            FOR INTERVIEWS
          </div>

          {/* Col 2: High contrast CTA button */}
          <div className="flex flex-col items-start gap-2.5 md:items-center">
            <button
              type="button"
              onClick={onOpenSelector}
              className="inline-flex items-center gap-2 rounded-lg border border-[#B18A91]/50 bg-[#754653] px-5 py-2.5 font-ui text-xs font-bold text-[#F4EDEF] transition-all hover:bg-[#C6A0A7] hover:text-[#241910] hover:scale-[1.02] shadow-lg shadow-[#482832]/30"
            >
              <span>Start Mock Interview</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#F4EDEF]" />
            </button>
            {onOpenWalkingSelector && (
              <button
                type="button"
                onClick={onOpenWalkingSelector}
                className="inline-flex items-center gap-2 rounded-lg border border-[#754653]/70 bg-[#302329] px-5 py-2.5 font-ui text-xs font-semibold text-[#E9DFDF] transition-all hover:border-[#C69BA5] hover:text-[#F4EDEF]"
              >
                <span>Try Walking Interview</span>
                <span aria-hidden="true">🎧</span>
              </button>
            )}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#D5BFC3]">
              {DOMAINS.map((d, i) => (
                <React.Fragment key={d.id}>
                  <button
                    type="button"
                    onClick={() => onStartDomain(d.id)}
                    className="transition-colors hover:text-[#F4EDEF]"
                  >
                    {d.shortTitle}
                  </button>
                  {i < DOMAINS.length - 1 && <span className="text-[#513A42]">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div className="font-mono text-xs text-[#B9A5AA] md:text-right">
            Free and open source.
            <br />
              AI-generated 4-pillar evaluation.
          </div>
        </div>

        {/* SECTION I. THE IDEA */}
        <section id="idea" className="grid grid-cols-1 gap-12 border-b border-[#513A42] py-24 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F4EDEF]">
              I. THE IDEA
            </h2>
            <p className="font-sans-editorial text-base leading-relaxed text-[#E9DFDF]/90">
              Practice with AI-generated interview questions and feedback tailored to your selected profession and role.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#D5BFC3]">
              InterviewIQ generates role-specific questions, probes answers with AI follow-ups, and provides AI-generated practice feedback. AI responses can be imperfect and are not hiring assessments.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 font-mono text-xs text-[#B18A91] hover:text-[#C6A0A7] transition-colors"
              >
                <span>Launch an interview session</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Right window frame */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-[#513A42] bg-[#302329] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[#513A42] bg-[#241910] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#482832]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#754653]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C69BA5]" />
                </div>
                <span className="mx-auto font-mono text-[11px] text-[#D5BFC3]">
                  InterviewIQ — System Design & Behavioral Mock
                </span>
              </div>
              <img
                src="/assets/teaching-session.png"
                alt="InterviewIQ session interface"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-[#B9A5AA]">
              A sample interview screen with answer recording and structured rubric feedback.
            </p>
          </div>
        </section>

        {/* SECTION II. TEACHING & EVALUATION */}
        <section id="teaching" className="border-b border-[#513A42] py-24">
          <h2 className="mb-16 text-center font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F4EDEF]">
            II. TEACHING
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Phase 1: PROBE */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-editorial text-xl font-bold text-[#F4EDEF]">
                i) PROBE
              </h3>
              <p className="font-sans-editorial text-sm leading-relaxed text-[#D5BFC3]">
                Choose from a prepared question bank for your selected domain and role. Questions do not adapt to your previous answers.
              </p>

              {/* Probe SVG Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#513A42] bg-[#302329] p-4 font-mono text-xs">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-full rounded border border-[#513A42] bg-[#241910] px-3 py-2 text-center text-[#F4EDEF]">
                    Candidate Answer
                  </div>
                  <div className="h-4 w-px bg-[#513A42]" />
                  <div className="w-full rounded border border-[#754653]/50 bg-[#482832]/30 px-3 py-1.5 flex items-center justify-between text-[#B18A91]">
                    <span>Edge case check?</span>
                    <X className="h-3.5 w-3.5" />
                  </div>
                  <div className="h-4 w-px bg-[#513A42]" />
                  <div className="w-full rounded border border-[#C69BA5]/50 bg-[#3B2931] px-3 py-1.5 flex items-center justify-between text-[#C69BA5]">
                    <span>Trade-off justified</span>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div className="h-4 w-px bg-[#513A42]" />
                  <div className="w-full rounded border border-[#E9DFDF]/40 bg-[#754653]/20 px-3 py-1.5 flex items-center justify-between text-[#F4EDEF]">
                    <span>Evaluate next probe</span>
                    <Check className="h-3.5 w-3.5 text-[#C69BA5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2: PLAN */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-editorial text-xl font-bold text-[#F4EDEF]">
                ii) PLAN
              </h3>
              <p className="font-sans-editorial text-sm leading-relaxed text-[#D5BFC3]">
                Review the concepts associated with each prompt and use the feedback to decide what to practice next.
              </p>

              {/* Plan Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#513A42] bg-[#302329] p-4 font-mono text-[11px]">
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 rounded border border-[#C69BA5]/50 bg-[#3B2931] px-2 py-1 text-center text-[#C69BA5]">
                      Problem Framing
                    </span>
                    <span className="flex-1 rounded border border-[#C69BA5]/50 bg-[#3B2931] px-2 py-1 text-center text-[#C69BA5]">
                      Complexity
                    </span>
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#513A42]" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 rounded border border-[#754653]/50 bg-[#482832]/30 px-2 py-1 text-center text-[#B18A91]">
                      Data Structures
                    </span>
                    <span className="flex-1 rounded border border-[#513A42] bg-[#241910] px-2 py-1 text-center text-[#B9A5AA]">
                      Locking
                    </span>
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#513A42]" />
                  <div className="rounded border border-[#754653]/60 bg-[#482832]/40 px-2 py-1 text-center text-[#C69BA5]">
                    Failure Recovery
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#513A42]" />
                  <div className="rounded border border-[#513A42] bg-[#241910] px-2 py-1 text-center text-[#B9A5AA]">
                    Production Readiness
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3: TEACH */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-editorial text-xl font-bold text-[#F4EDEF]">
                iii) TEACH
              </h3>
              <p className="font-sans-editorial text-sm leading-relaxed text-[#D5BFC3]">
                Every complete response gets AI-generated feedback across four practice areas. Scores can be imperfect, so treat them as guidance rather than objective measurements.
              </p>

              {/* Evaluate Loop Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#513A42] bg-[#302329] p-4 font-mono text-xs">
                <div className="flex flex-col items-center justify-around h-full space-y-3">
                  <div className="w-full rounded border border-[#513A42] bg-[#241910] px-3 py-2 text-center text-[#F4EDEF]">
                    Question Prompt
                  </div>
                  <div className="h-4 w-px bg-[#513A42]" />
                  <div className="w-full rounded border border-[#754653] bg-[#3B2931] px-3 py-2 text-center text-[#F4EDEF]">
                    4-Pillar Rubric
                  </div>
                  <div className="h-4 w-px bg-[#513A42]" />
                  <div className="w-full rounded border border-[#C69BA5]/60 bg-[#482832]/40 px-3 py-2 text-center text-[#C69BA5]">
                    Practice Feedback
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION III. PRACTICE */}
        <section id="practice" className="grid grid-cols-1 gap-12 border-b border-[#513A42] py-24 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-6">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F4EDEF]">
              III. PRACTICE
            </h2>
            <p className="font-sans-editorial text-base leading-relaxed text-[#E9DFDF]/90">
              Focused drill-down questions tailored to specific blind spots. Practice difficult architectural trade-offs, STAR behavioral framing, or vocal delivery until it becomes instinctive.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#D5BFC3]">
              Unlike passive video lectures, you learn by doing. Each practice problem isolates one competency and provides immediate, targeted feedback with exemplar responses.
            </p>
            {onOpenStudy && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenStudy}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#513A42] bg-[#3B2931] px-4 py-2 font-mono text-xs text-[#F4EDEF] transition-colors hover:border-[#754653] hover:bg-[#482832]"
                >
                  <Dumbbell className="h-3.5 w-3.5 text-[#C69BA5]" />
                  <span>Explore Practice Modules</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#B18A91]" />
                </button>
              </div>
            )}
          </div>

          {/* Right Logic Diagram */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-[#513A42] bg-[#302329] p-6 font-mono text-sm shadow-xl">
              <div className="space-y-4">
                {/* Logic box 1: Failure mode */}
                <div className="flex items-center justify-between rounded-lg border border-[#754653]/50 bg-[#482832]/30 p-3 text-[#B18A91]">
                  <span className="tracking-wide">A ∧ B → C</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#754653]/20 text-[#C69BA5]">
                    <X className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#C69BA5]">↓</div>

                {/* Logic box 2: Targeted Drill */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 flex items-center justify-between rounded-lg border border-[#754653]/50 bg-[#482832]/30 p-2.5 text-[#B18A91]">
                    <span>B (Gap)</span>
                    <X className="h-3.5 w-3.5 text-[#C69BA5]" />
                  </div>
                  <span className="text-[#C69BA5]">→</span>
                  <div className="flex-1 flex items-center justify-between rounded-lg border border-[#C69BA5]/60 bg-[#3B2931] p-2.5 text-[#C69BA5]">
                    <span>B (Drill)</span>
                    <Check className="h-3.5 w-3.5 text-[#C69BA5]" />
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#C69BA5]">↓</div>

                {/* Logic box 3: Mastery Proven */}
                <div className="flex items-center justify-between rounded-lg border border-[#E9DFDF]/40 bg-[#754653]/20 p-3 text-[#F4EDEF]">
                  <span className="tracking-wide">A ∧ B → C</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#754653]/30 text-[#C69BA5]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-[#B9A5AA]">
              Practice pathways with prepared drills, frameworks, and review prompts.
            </p>
          </div>
        </section>

        {/* SECTION IV. GRAPH & DOMAINS */}
        <section id="graph" className="grid grid-cols-1 gap-12 border-b border-[#513A42] py-24 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F4EDEF]">
              IV. GRAPH
            </h2>
            <p className="font-sans-editorial text-base leading-relaxed text-[#E9DFDF]/90">
              Every interview role, question, and sub-skill is mapped into a competency graph spanning Software Engineering, Product Management, System Design, Leadership, and Arts & Vocal Communication.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#D5BFC3]">
              As you complete mocks, your graph lights up. Nodes track your demonstrated mastery, historical score distributions, and recommended areas to drill next.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 rounded-lg border border-[#513A42] bg-[#3B2931] px-4 py-2 font-mono text-xs text-[#F4EDEF] transition-colors hover:border-[#754653] hover:bg-[#482832]"
              >
                <Compass className="h-3.5 w-3.5 text-[#C69BA5]" />
                <span>Browse Domain Catalog</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#B18A91]" />
              </button>
            </div>
          </div>

          {/* Right window frame */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-[#513A42] bg-[#302329] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[#513A42] bg-[#241910] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#482832]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#754653]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C69BA5]" />
                </div>
                <span className="mx-auto font-mono text-[11px] text-[#D5BFC3]">
                  InterviewIQ — Competency Knowledge Graph
                </span>
              </div>
              <img
                src="/assets/knowledge-graph.png"
                alt="InterviewIQ competency knowledge graph"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-[#B9A5AA]">
              The interview competency graph. Nodes highlight as mastery across specific skills is proven.
            </p>
          </div>
        </section>

        {/* SECTION V. THE TERMS */}
        <section id="terms" className="border-b border-[#513A42] py-24">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F4EDEF]">
              V. THE TERMS
            </h2>
            <p className="font-sans-editorial text-base leading-relaxed text-[#E9DFDF]/90">
              Session history and transcripts are saved in this browser. Interview answers, role details, and generated questions are sent to OpenAI to provide AI questions, follow-ups, and evaluation. If API credits are unavailable, the built-in question bank and local rubric are used instead. Voice transcription uses your browser's speech recognition service, whose processing may involve that browser provider. Optional video cues run on-device; the app does not record or upload video. The MediaPipe runtime may send product usage metrics. Recorded audio is not included in saved session history.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#D5BFC3]">
              AI-generated 4-pillar feedback with suggested strengths, gaps, and answer outlines. It can make mistakes, does not assess spoken cadence, and does not make hiring decisions.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#B9A5AA]">
              Free and open source. Train whenever you want, for as long as you want.
            </p>
          </div>
        </section>

        {/* BOTTOM LAUNCH CTA */}
        <section className="py-28 text-center">
          <div className="mx-auto max-w-xl space-y-6">
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#F4EDEF]">
              Launch InterviewIQ
            </h2>
            <p className="font-sans-editorial text-base text-[#D5BFC3]">
              Select your domain and role to begin a focused mock interview session.
            </p>
            <div>
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 rounded-xl border border-[#B18A91]/60 bg-[#754653] px-7 py-3.5 font-ui text-sm font-bold text-[#F4EDEF] transition-all hover:bg-[#C6A0A7] hover:text-[#241910] hover:scale-105 shadow-xl shadow-[#482832]/50"
              >
                <span>Start Mock Interview</span>
                <ArrowRight className="h-4 w-4 text-[#F4EDEF]" />
              </button>
            </div>
            <div className="font-mono text-xs text-[#B9A5AA]">
              Free & open source · Local-first in your browser
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#513A42] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 font-mono text-xs text-[#D5BFC3] sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-[#482832] to-[#754653] p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-[#241910]">
                <Brain className="h-3 w-3 text-[#C69BA5]" />
              </div>
            </div>
            <span>InterviewIQ · Open Source Interview Practice</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenRubric}
              className="hover:text-[#F4EDEF] transition-colors"
            >
              Rubrics
            </button>
            <button
              type="button"
              onClick={onOpenSelector}
              className="hover:text-[#F4EDEF] transition-colors"
            >
              Domains
            </button>
            {onOpenStudy && (
              <button
                type="button"
                onClick={onOpenStudy}
                className="hover:text-[#F4EDEF] transition-colors"
              >
                Practice
              </button>
            )}
            <a
              href="https://github.com/akshat-zero/interview-iq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#F4EDEF] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
