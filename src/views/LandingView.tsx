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
  ExternalLink,
  Play,
  Dumbbell,
  Compass,
} from 'lucide-react';

export interface LandingViewProps {
  onStartDomain: (domainId: DomainId) => void;
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
  onQuickStartInterview,
  onOpenSelector,
  onOpenRubric,
  onOpenStudy,
  onOpenHistory,
  onOpenProfile,
  savedSessions = [],
  currentUser,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#141414] text-[#ececec] selection:bg-[#754653]/40 selection:text-white">
      {/* Editorial Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#262626]/80 bg-[#141414]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
            aria-label="InterviewIQ Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#754653] via-[#8a5362] to-[#B18A91] p-[1px] shadow-lg shadow-[#482832]/40">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#241910]">
                <Brain className="h-4 w-4 text-[#C69BA5]" />
              </div>
            </div>
            <span className="font-title text-base font-bold tracking-tight text-[#ececec]">
              Interview<span className="text-[#C69BA5]">IQ</span>
            </span>
            <span className="rounded bg-[#262626] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#a0a0a0]">
              MVP
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 font-mono text-xs text-[#a0a0a0] md:flex">
            <a href="#idea" className="transition-colors hover:text-[#ececec]">
              Idea
            </a>
            <a href="#teaching" className="transition-colors hover:text-[#ececec]">
              Method
            </a>
            <a href="#practice" className="transition-colors hover:text-[#ececec]">
              Practice
            </a>
            <a href="#graph" className="transition-colors hover:text-[#ececec]">
              Domains
            </a>
            <a href="#terms" className="transition-colors hover:text-[#ececec]">
              Terms
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenRubric}
              className="hidden items-center gap-1.5 font-mono text-xs text-[#a0a0a0] transition-colors hover:text-[#ececec] sm:inline-flex"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#B18A91]" />
              <span>4-Pillar Rubric</span>
            </button>

            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="hidden items-center gap-1.5 font-mono text-xs text-[#a0a0a0] transition-colors hover:text-[#ececec] sm:inline-flex"
              >
                <History className="h-3.5 w-3.5 text-[#C69BA5]" />
                <span>Past Sessions</span>
                {savedSessions.length > 0 && (
                  <span className="rounded bg-[#262626] px-1.5 py-0.2 text-[10px] text-[#ececec]">
                    {savedSessions.length}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSelector}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#383838] bg-[#222222] px-3.5 py-1.5 font-ui text-xs font-semibold text-[#ececec] transition-all hover:border-[#4d4d4d] hover:bg-[#2c2c2c]"
            >
              <Play className="h-3 w-3 fill-current text-[#C69BA5]" />
              <span>Start Mock</span>
            </button>

            {currentUser && onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                title={`Logged in as ${currentUser.name}`}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#383838] transition-transform hover:scale-105"
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
      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-16">
        {/* Editorial Sub-Head */}
        <div className="mb-4 font-mono text-xs tracking-wider text-[#888888]">
          A desktop and web app for AI mock interviews and practice.
        </div>

        {/* Hero Title & Emblem Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6">
          <h1 className="font-title text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#f4edef] font-normal">
            InterviewIQ
          </h1>
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#754653] via-[#8a5362] to-[#B18A91] p-[2px] shadow-2xl shadow-[#482832]/50 shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#241910]">
              <Brain className="h-11 w-11 sm:h-14 sm:w-14 text-[#C69BA5]" />
            </div>
          </div>
        </div>

        {/* Sub-Hero 3-Column Info Strip */}
        <div className="grid grid-cols-1 gap-6 border-b border-[#262626] pb-12 pt-4 md:grid-cols-3 md:items-baseline">
          {/* Col 1 */}
          <div className="font-mono text-xs uppercase tracking-widest text-[#888888]">
            AN AGENT HARNESS
            <br />
            FOR INTERVIEWS
          </div>

          {/* Col 2 */}
          <div className="flex flex-col items-start gap-2.5 md:items-center">
            <button
              type="button"
              onClick={onOpenSelector}
              className="inline-flex items-center gap-2 rounded-lg border border-[#444444] bg-[#241910] px-5 py-2.5 font-ui text-xs font-semibold text-[#f4edef] transition-all hover:border-[#C69BA5] hover:bg-[#302329] hover:scale-[1.02] shadow-lg shadow-[#482832]/30"
            >
              <span>Start Mock Interview</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#C69BA5]" />
            </button>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#888888]">
              {DOMAINS.map((d, i) => (
                <React.Fragment key={d.id}>
                  <button
                    type="button"
                    onClick={() => onStartDomain(d.id)}
                    className="transition-colors hover:text-[#ececec]"
                  >
                    {d.shortTitle}
                  </button>
                  {i < DOMAINS.length - 1 && <span className="text-[#444444]">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div className="font-mono text-xs text-[#888888] md:text-right">
            Free and open source.
            <br />
            Objective 4-pillar evaluation.
          </div>
        </div>

        {/* SECTION I. THE IDEA */}
        <section id="idea" className="grid grid-cols-1 gap-10 border-b border-[#262626] py-20 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-title text-3xl font-bold tracking-tight text-[#f4edef]">
              I. THE IDEA
            </h2>
            <p className="font-prose text-base leading-relaxed text-[#c0c0c0]">
              The app probes and evaluates your problem-solving under pressure: assessing what you know, how you communicate, and where your thinking breaks down.
            </p>
            <p className="font-prose text-base leading-relaxed text-[#a0a0a0]">
              Mock interviews are traditionally either shallow scripted question sets or expensive $200/hr human sessions with inconsistent feedback. InterviewIQ acts as an adaptive harness: it analyzes trade-offs, challenges weak assumptions, and constructs a live competency profile across 4 transparent pillars.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 font-mono text-xs text-[#C69BA5] hover:underline"
              >
                <span>Launch an interview session</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Right window frame */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-[#2c2c2c] bg-[#181818] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[#2c2c2c] bg-[#1a1a1a] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="mx-auto font-mono text-[11px] text-[#888888]">
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
            <p className="mt-2 text-center font-mono text-[11px] text-[#777777]">
              An active interview session. The harness probes architectural trade-offs, evaluates vocal cadence, and breaks down rubric scores in real time.
            </p>
          </div>
        </section>

        {/* SECTION II. TEACHING & EVALUATION */}
        <section id="teaching" className="border-b border-[#262626] py-20">
          <h2 className="mb-14 text-center font-title text-3xl font-bold tracking-tight text-[#f4edef]">
            II. TEACHING
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Phase 1: PROBE */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-title text-lg font-bold text-[#ececec]">
                i) PROBE
              </h3>
              <p className="font-prose text-sm leading-relaxed text-[#a0a0a0]">
                The agent probes the limits of your answers to find gaps, edge-cases, and fuzzy assumptions. Questions are reasoned and adaptive, not scripted.
              </p>

              {/* Probe SVG Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#262626] bg-[#181818] p-4 font-mono text-xs">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-full rounded border border-[#333333] bg-[#202020] px-3 py-2 text-center text-[#ececec]">
                    Candidate Answer
                  </div>
                  <div className="h-4 w-px bg-[#444444]" />
                  <div className="w-full rounded border border-red-500/40 bg-red-950/20 px-3 py-1.5 flex items-center justify-between text-red-400">
                    <span>Edge case check?</span>
                    <X className="h-3.5 w-3.5" />
                  </div>
                  <div className="h-4 w-px bg-[#444444]" />
                  <div className="w-full rounded border border-green-500/40 bg-green-950/30 px-3 py-1.5 flex items-center justify-between text-green-400">
                    <span>Trade-off justified</span>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div className="h-4 w-px bg-[#444444]" />
                  <div className="w-full rounded border border-green-500/50 bg-[#1c2c20] px-3 py-1.5 flex items-center justify-between text-green-300">
                    <span>Evaluate next probe</span>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2: PLAN */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-title text-lg font-bold text-[#ececec]">
                ii) PLAN
              </h3>
              <p className="font-prose text-sm leading-relaxed text-[#a0a0a0]">
                The agent builds a directed dependency graph of your competencies, tracking what you've proven and what concepts to test next.
              </p>

              {/* Plan SVG Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#262626] bg-[#181818] p-4 font-mono text-[11px]">
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 rounded border border-green-500/40 bg-green-950/30 px-2 py-1 text-center text-green-400">
                      Problem Framing
                    </span>
                    <span className="flex-1 rounded border border-green-500/40 bg-green-950/30 px-2 py-1 text-center text-green-400">
                      Complexity
                    </span>
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#444444]" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 rounded border border-amber-500/40 bg-amber-950/30 px-2 py-1 text-center text-amber-400">
                      Data Structures
                    </span>
                    <span className="flex-1 rounded border border-[#333333] bg-[#202020] px-2 py-1 text-center text-[#888888]">
                      Locking
                    </span>
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#444444]" />
                  <div className="rounded border border-red-500/40 bg-red-950/30 px-2 py-1 text-center text-red-400">
                    Failure Recovery
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#444444]" />
                  <div className="rounded border border-[#333333] bg-[#202020] px-2 py-1 text-center text-[#888888]">
                    Production Readiness
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3: EVALUATE */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-title text-lg font-bold text-[#ececec]">
                iii) TEACH
              </h3>
              <p className="font-prose text-sm leading-relaxed text-[#a0a0a0]">
                Every response is scored across 4 objective pillars: Technical Relevance, Delivery & Cadence, Domain Polish, and Critical Gaps.
              </p>

              {/* Evaluate Loop Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#262626] bg-[#181818] p-4 font-mono text-xs">
                <div className="flex flex-col items-center justify-around h-full space-y-3">
                  <div className="w-full rounded border border-[#383838] bg-[#202020] px-3 py-2 text-center text-[#ececec]">
                    Question Prompt
                  </div>
                  <div className="h-4 w-px bg-[#444444]" />
                  <div className="w-full rounded border border-[#754653] bg-[#241910] px-3 py-2 text-center text-[#f4edef]">
                    4-Pillar Rubric
                  </div>
                  <div className="h-4 w-px bg-[#444444]" />
                  <div className="w-full rounded border border-green-500/40 bg-green-950/20 px-3 py-2 text-center text-green-300">
                    Adaptive Feedback
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION III. PRACTICE */}
        <section id="practice" className="grid grid-cols-1 gap-10 border-b border-[#262626] py-20 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-6">
            <h2 className="font-title text-3xl font-bold tracking-tight text-[#f4edef]">
              III. PRACTICE
            </h2>
            <p className="font-prose text-base leading-relaxed text-[#c0c0c0]">
              Focused drill-down questions tailored to specific blind spots. Practice difficult architectural trade-offs, STAR behavioral framing, or vocal delivery until it becomes instinctive.
            </p>
            <p className="font-prose text-base leading-relaxed text-[#a0a0a0]">
              Unlike passive video lectures, you learn by doing. Each practice problem isolates one competency and provides immediate, targeted feedback with exemplar responses.
            </p>
            {onOpenStudy && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenStudy}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#383838] bg-[#202020] px-4 py-2 font-mono text-xs text-[#ececec] transition-colors hover:border-[#555555] hover:bg-[#282828]"
                >
                  <Dumbbell className="h-3.5 w-3.5 text-[#C69BA5]" />
                  <span>Explore Practice Modules</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#888888]" />
                </button>
              </div>
            )}
          </div>

          {/* Right SVG Logic Diagram */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-[#2c2c2c] bg-[#181818] p-6 font-mono text-sm shadow-xl">
              <div className="space-y-4">
                {/* Logic box 1: Failure mode */}
                <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-[#221718] p-3 text-red-300">
                  <span className="tracking-wide">A ∧ B → C</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-red-500/20 text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#555555]">↓</div>

                {/* Logic box 2: Targeted Drill */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 flex items-center justify-between rounded-lg border border-red-500/30 bg-[#221718] p-2.5 text-red-300">
                    <span>B (Gap)</span>
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <span className="text-[#666666]">→</span>
                  <div className="flex-1 flex items-center justify-between rounded-lg border border-green-500/30 bg-[#172218] p-2.5 text-green-300">
                    <span>B (Drill)</span>
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#555555]">↓</div>

                {/* Logic box 3: Mastery Proven */}
                <div className="flex items-center justify-between rounded-lg border border-green-500/40 bg-[#172218] p-3 text-green-300">
                  <span className="tracking-wide">A ∧ B → C</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-green-500/20 text-green-400">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-center font-mono text-[11px] text-[#777777]">
              Adaptive remediation. Isolating prerequisite failure modes and proving mastery before composite evaluation.
            </p>
          </div>
        </section>

        {/* SECTION IV. GRAPH & DOMAINS */}
        <section id="graph" className="grid grid-cols-1 gap-10 border-b border-[#262626] py-20 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-title text-3xl font-bold tracking-tight text-[#f4edef]">
              IV. GRAPH
            </h2>
            <p className="font-prose text-base leading-relaxed text-[#c0c0c0]">
              Every interview role, question, and sub-skill is mapped into a competency graph spanning Software Engineering, Product Management, System Design, Leadership, and Arts & Vocal Communication.
            </p>
            <p className="font-prose text-base leading-relaxed text-[#a0a0a0]">
              As you complete mocks, your graph lights up. Nodes track your demonstrated mastery, historical score distributions, and recommended areas to drill next.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 rounded-lg border border-[#383838] bg-[#202020] px-4 py-2 font-mono text-xs text-[#ececec] transition-colors hover:border-[#555555] hover:bg-[#282828]"
              >
                <Compass className="h-3.5 w-3.5 text-[#C69BA5]" />
                <span>Browse Domain Catalog</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#888888]" />
              </button>
            </div>
          </div>

          {/* Right window frame */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-[#2c2c2c] bg-[#181818] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[#2c2c2c] bg-[#1a1a1a] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="mx-auto font-mono text-[11px] text-[#888888]">
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
            <p className="mt-2 text-center font-mono text-[11px] text-[#777777]">
              The interview competency graph. Nodes highlight as mastery across specific skills is proven.
            </p>
          </div>
        </section>

        {/* SECTION V. THE TERMS */}
        <section id="terms" className="border-b border-[#262626] py-20">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h2 className="font-title text-3xl font-bold tracking-tight text-[#f4edef]">
              V. THE TERMS
            </h2>
            <p className="font-prose text-base leading-relaxed text-[#c0c0c0]">
              Local-first evaluation and audio recording. All your interview transcripts, recorded audio, and rubric evaluations are stored directly in your browser. Zero telemetry or data harvesting.
            </p>
            <p className="font-prose text-base leading-relaxed text-[#a0a0a0]">
              Transparent 4-pillar rubrics. Every score is explained with concrete strengths, weaknesses, and exemplar answers — no opaque, black-box AI scores.
            </p>
            <p className="font-prose text-base leading-relaxed text-[#888888]">
              Free and open source. Train whenever you want, for as long as you want.
            </p>
          </div>
        </section>

        {/* BOTTOM LAUNCH CTA */}
        <section className="py-24 text-center">
          <div className="mx-auto max-w-xl space-y-6">
            <h2 className="font-title text-4xl sm:text-5xl font-bold tracking-tight text-[#f4edef]">
              Launch InterviewIQ
            </h2>
            <p className="font-prose text-base text-[#a0a0a0]">
              Select your domain and role to begin a focused mock interview session.
            </p>
            <div>
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 rounded-xl border border-[#555555] bg-[#241910] px-6 py-3 font-ui text-sm font-semibold text-[#f4edef] transition-all hover:border-[#C69BA5] hover:bg-[#302329] hover:scale-105 shadow-xl shadow-[#482832]/40"
              >
                <span>Start Mock Interview</span>
                <ArrowRight className="h-4 w-4 text-[#C69BA5]" />
              </button>
            </div>
            <div className="font-mono text-xs text-[#777777]">
              Free & open source · Local-first in your browser
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#262626] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 font-mono text-xs text-[#777777] sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-[#754653] to-[#8a5362] p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-[#241910]">
                <Brain className="h-3 w-3 text-[#C69BA5]" />
              </div>
            </div>
            <span>InterviewIQ · Open Source AI Interview Harness</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenRubric}
              className="hover:text-[#ececec] transition-colors"
            >
              Rubrics
            </button>
            <button
              type="button"
              onClick={onOpenSelector}
              className="hover:text-[#ececec] transition-colors"
            >
              Domains
            </button>
            {onOpenStudy && (
              <button
                type="button"
                onClick={onOpenStudy}
                className="hover:text-[#ececec] transition-colors"
              >
                Practice
              </button>
            )}
            <a
              href="https://github.com/akshat-zero/interview-iq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#ececec] transition-colors"
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
