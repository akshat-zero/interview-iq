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
  onOpenSelector,
  onOpenRubric,
  onOpenStudy,
  onOpenHistory,
  onOpenProfile,
  savedSessions = [],
  currentUser,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#0C0F14] text-[#F5F1EC] texture-obsidian selection:bg-[#A55534]/35 selection:text-[#F5F1EC] font-sans-editorial">
      {/* Editorial Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#281E1C] bg-[#0C0F14]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
            aria-label="InterviewIQ Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3A1D19] via-[#A55534] to-[#C68C6E] p-[1px] shadow-lg shadow-[#3A1D19]/50">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0C0F14]">
                <Brain className="h-4 w-4 text-[#C68C6E]" />
              </div>
            </div>
            <span className="font-editorial text-lg tracking-tight text-[#F5F1EC]">
              Interview<span className="text-[#C68C6E]">IQ</span>
            </span>
            <span className="rounded border border-[#3A1D19] bg-[#1a1413] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#C68C6E]">
              MVP
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-7 font-mono text-xs text-[#C68C6E]/90 md:flex">
            <a href="#idea" className="transition-colors hover:text-[#F5F1EC]">
              Idea
            </a>
            <a href="#teaching" className="transition-colors hover:text-[#F5F1EC]">
              Method
            </a>
            <a href="#practice" className="transition-colors hover:text-[#F5F1EC]">
              Practice
            </a>
            <a href="#graph" className="transition-colors hover:text-[#F5F1EC]">
              Domains
            </a>
            <a href="#terms" className="transition-colors hover:text-[#F5F1EC]">
              Terms
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenRubric}
              className="hidden items-center gap-1.5 font-mono text-xs text-[#C68C6E] transition-colors hover:text-[#F5F1EC] sm:inline-flex"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#A55534]" />
              <span>4-Pillar Rubric</span>
            </button>

            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="hidden items-center gap-1.5 font-mono text-xs text-[#C68C6E] transition-colors hover:text-[#F5F1EC] sm:inline-flex"
              >
                <History className="h-3.5 w-3.5 text-[#C68C6E]" />
                <span>Past Sessions</span>
                {savedSessions.length > 0 && (
                  <span className="rounded bg-[#281E1C] px-1.5 py-0.2 text-[10px] text-[#F5F1EC]">
                    {savedSessions.length}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSelector}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#C68C6E]/40 bg-[#161B24] px-3.5 py-1.5 font-ui text-xs font-semibold text-[#F5F1EC] transition-all hover:border-[#A55534] hover:bg-[#201815]"
            >
              <Play className="h-3 w-3 fill-current text-[#C68C6E]" />
              <span>Start Mock</span>
            </button>

            {currentUser && onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                title={`Logged in as ${currentUser.name}`}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#3A1D19] transition-transform hover:scale-105"
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
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-[#C68C6E]">
          A desktop and web app for AI mock interviews and practice.
        </div>

        {/* Hero Title & Emblem Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6">
          <h1 className="font-editorial text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#F5F1EC] font-normal">
            InterviewIQ
          </h1>
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#3A1D19] via-[#A55534] to-[#C68C6E] p-[2px] shadow-2xl shadow-[#3A1D19]/60 shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#0C0F14]">
              <Brain className="h-11 w-11 sm:h-14 sm:w-14 text-[#C68C6E]" />
            </div>
          </div>
        </div>

        {/* Sub-Hero 3-Column Info Strip */}
        <div className="grid grid-cols-1 gap-6 border-b border-[#281E1C] pb-14 pt-4 md:grid-cols-3 md:items-baseline">
          {/* Col 1 */}
          <div className="font-mono text-xs uppercase tracking-widest text-[#A55534]">
            AN AGENT HARNESS
            <br />
            FOR INTERVIEWS
          </div>

          {/* Col 2: High contrast Paper CTA button */}
          <div className="flex flex-col items-start gap-2.5 md:items-center">
            <button
              type="button"
              onClick={onOpenSelector}
              className="inline-flex items-center gap-2 rounded-lg border border-[#C68C6E]/60 bg-[#EEE9E3] px-5 py-2.5 font-ui text-xs font-bold text-[#0C0F14] transition-all hover:bg-[#F5F1EC] hover:scale-[1.02] shadow-lg shadow-[#A55534]/15"
            >
              <span>Start Mock Interview</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#A55534]" />
            </button>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#C68C6E]">
              {DOMAINS.map((d, i) => (
                <React.Fragment key={d.id}>
                  <button
                    type="button"
                    onClick={() => onStartDomain(d.id)}
                    className="transition-colors hover:text-[#F5F1EC]"
                  >
                    {d.shortTitle}
                  </button>
                  {i < DOMAINS.length - 1 && <span className="text-[#3A1D19]">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div className="font-mono text-xs text-[#C68C6E] md:text-right">
            Free and open source.
            <br />
            Objective 4-pillar evaluation.
          </div>
        </div>

        {/* SECTION I. THE IDEA */}
        <section id="idea" className="grid grid-cols-1 gap-12 border-b border-[#281E1C] py-24 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F1EC]">
              I. THE IDEA
            </h2>
            <p className="font-sans-editorial text-base leading-relaxed text-[#EEE9E3]/90">
              The app probes and evaluates your problem-solving under pressure: assessing what you know, how you communicate, and where your thinking breaks down.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#C68C6E]">
              Mock interviews are traditionally either shallow scripted question sets or expensive $200/hr human sessions with inconsistent feedback. InterviewIQ acts as an adaptive harness: it analyzes trade-offs, challenges weak assumptions, and constructs a live competency profile across 4 transparent pillars.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 font-mono text-xs text-[#A55534] hover:text-[#C68C6E] transition-colors"
              >
                <span>Launch an interview session</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Right window frame */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-[#281E1C] bg-[#12161F] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[#281E1C] bg-[#0C0F14] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#A55534]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C68C6E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EEE9E3]" />
                </div>
                <span className="mx-auto font-mono text-[11px] text-[#C68C6E]">
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
            <p className="mt-3 text-center font-mono text-[11px] text-[#C68C6E]/70">
              An active interview session. The harness probes architectural trade-offs, evaluates vocal cadence, and breaks down rubric scores in real time.
            </p>
          </div>
        </section>

        {/* SECTION II. TEACHING & EVALUATION */}
        <section id="teaching" className="border-b border-[#281E1C] py-24">
          <h2 className="mb-16 text-center font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F1EC]">
            II. TEACHING
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Phase 1: PROBE */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-editorial text-xl font-bold text-[#F5F1EC]">
                i) PROBE
              </h3>
              <p className="font-sans-editorial text-sm leading-relaxed text-[#C68C6E]">
                The agent probes the limits of your answers to find gaps, edge-cases, and fuzzy assumptions. Questions are reasoned and adaptive, not scripted.
              </p>

              {/* Probe SVG Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#281E1C] bg-[#12161F] p-4 font-mono text-xs">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-full rounded border border-[#3A1D19] bg-[#0C0F14] px-3 py-2 text-center text-[#F5F1EC]">
                    Candidate Answer
                  </div>
                  <div className="h-4 w-px bg-[#3A1D19]" />
                  <div className="w-full rounded border border-[#A55534]/50 bg-[#3A1D19]/30 px-3 py-1.5 flex items-center justify-between text-[#A55534]">
                    <span>Edge case check?</span>
                    <X className="h-3.5 w-3.5" />
                  </div>
                  <div className="h-4 w-px bg-[#3A1D19]" />
                  <div className="w-full rounded border border-[#C68C6E]/50 bg-[#241A18] px-3 py-1.5 flex items-center justify-between text-[#C68C6E]">
                    <span>Trade-off justified</span>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div className="h-4 w-px bg-[#3A1D19]" />
                  <div className="w-full rounded border border-[#EEE9E3]/50 bg-[#EEE9E3]/10 px-3 py-1.5 flex items-center justify-between text-[#F5F1EC]">
                    <span>Evaluate next probe</span>
                    <Check className="h-3.5 w-3.5 text-[#C68C6E]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2: PLAN */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-editorial text-xl font-bold text-[#F5F1EC]">
                ii) PLAN
              </h3>
              <p className="font-sans-editorial text-sm leading-relaxed text-[#C68C6E]">
                The agent builds a directed dependency graph of your competencies, tracking what you've proven and what concepts to test next.
              </p>

              {/* Plan Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#281E1C] bg-[#12161F] p-4 font-mono text-[11px]">
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 rounded border border-[#C68C6E]/50 bg-[#241A18] px-2 py-1 text-center text-[#C68C6E]">
                      Problem Framing
                    </span>
                    <span className="flex-1 rounded border border-[#C68C6E]/50 bg-[#241A18] px-2 py-1 text-center text-[#C68C6E]">
                      Complexity
                    </span>
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#3A1D19]" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 rounded border border-[#A55534]/50 bg-[#3A1D19]/30 px-2 py-1 text-center text-[#A55534]">
                      Data Structures
                    </span>
                    <span className="flex-1 rounded border border-[#281E1C] bg-[#0C0F14] px-2 py-1 text-center text-[#C68C6E]/60">
                      Locking
                    </span>
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#3A1D19]" />
                  <div className="rounded border border-[#A55534]/60 bg-[#3A1D19]/40 px-2 py-1 text-center text-[#A55534]">
                    Failure Recovery
                  </div>
                  <div className="mx-auto h-3 w-px bg-[#3A1D19]" />
                  <div className="rounded border border-[#281E1C] bg-[#0C0F14] px-2 py-1 text-center text-[#C68C6E]/60">
                    Production Readiness
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3: TEACH */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-editorial text-xl font-bold text-[#F5F1EC]">
                iii) TEACH
              </h3>
              <p className="font-sans-editorial text-sm leading-relaxed text-[#C68C6E]">
                Every response is scored across 4 objective pillars: Technical Relevance, Delivery & Cadence, Domain Polish, and Critical Gaps.
              </p>

              {/* Evaluate Loop Diagram */}
              <div className="mt-4 flex-1 rounded-xl border border-[#281E1C] bg-[#12161F] p-4 font-mono text-xs">
                <div className="flex flex-col items-center justify-around h-full space-y-3">
                  <div className="w-full rounded border border-[#281E1C] bg-[#0C0F14] px-3 py-2 text-center text-[#F5F1EC]">
                    Question Prompt
                  </div>
                  <div className="h-4 w-px bg-[#3A1D19]" />
                  <div className="w-full rounded border border-[#A55534] bg-[#241A18] px-3 py-2 text-center text-[#F5F1EC]">
                    4-Pillar Rubric
                  </div>
                  <div className="h-4 w-px bg-[#3A1D19]" />
                  <div className="w-full rounded border border-[#C68C6E]/60 bg-[#3A1D19]/40 px-3 py-2 text-center text-[#C68C6E]">
                    Adaptive Feedback
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION III. PRACTICE */}
        <section id="practice" className="grid grid-cols-1 gap-12 border-b border-[#281E1C] py-24 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-6">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F1EC]">
              III. PRACTICE
            </h2>
            <p className="font-sans-editorial text-base leading-relaxed text-[#EEE9E3]/90">
              Focused drill-down questions tailored to specific blind spots. Practice difficult architectural trade-offs, STAR behavioral framing, or vocal delivery until it becomes instinctive.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#C68C6E]">
              Unlike passive video lectures, you learn by doing. Each practice problem isolates one competency and provides immediate, targeted feedback with exemplar responses.
            </p>
            {onOpenStudy && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenStudy}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#3A1D19] bg-[#161B24] px-4 py-2 font-mono text-xs text-[#F5F1EC] transition-colors hover:border-[#A55534] hover:bg-[#201815]"
                >
                  <Dumbbell className="h-3.5 w-3.5 text-[#A55534]" />
                  <span>Explore Practice Modules</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#C68C6E]" />
                </button>
              </div>
            )}
          </div>

          {/* Right Logic Diagram */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-[#281E1C] bg-[#12161F] p-6 font-mono text-sm shadow-xl">
              <div className="space-y-4">
                {/* Logic box 1: Failure mode */}
                <div className="flex items-center justify-between rounded-lg border border-[#A55534]/50 bg-[#3A1D19]/30 p-3 text-[#A55534]">
                  <span className="tracking-wide">A ∧ B → C</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#A55534]/20 text-[#A55534]">
                    <X className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#C68C6E]">↓</div>

                {/* Logic box 2: Targeted Drill */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 flex items-center justify-between rounded-lg border border-[#A55534]/50 bg-[#3A1D19]/30 p-2.5 text-[#A55534]">
                    <span>B (Gap)</span>
                    <X className="h-3.5 w-3.5 text-[#A55534]" />
                  </div>
                  <span className="text-[#C68C6E]">→</span>
                  <div className="flex-1 flex items-center justify-between rounded-lg border border-[#C68C6E]/60 bg-[#241A18] p-2.5 text-[#C68C6E]">
                    <span>B (Drill)</span>
                    <Check className="h-3.5 w-3.5 text-[#C68C6E]" />
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#C68C6E]">↓</div>

                {/* Logic box 3: Mastery Proven */}
                <div className="flex items-center justify-between rounded-lg border border-[#EEE9E3]/50 bg-[#EEE9E3]/10 p-3 text-[#F5F1EC]">
                  <span className="tracking-wide">A ∧ B → C</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#C68C6E]/30 text-[#C68C6E]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-[#C68C6E]/70">
              Adaptive remediation. Isolating prerequisite failure modes and proving mastery before composite evaluation.
            </p>
          </div>
        </section>

        {/* SECTION IV. GRAPH & DOMAINS */}
        <section id="graph" className="grid grid-cols-1 gap-12 border-b border-[#281E1C] py-24 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F1EC]">
              IV. GRAPH
            </h2>
            <p className="font-sans-editorial text-base leading-relaxed text-[#EEE9E3]/90">
              Every interview role, question, and sub-skill is mapped into a competency graph spanning Software Engineering, Product Management, System Design, Leadership, and Arts & Vocal Communication.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#C68C6E]">
              As you complete mocks, your graph lights up. Nodes track your demonstrated mastery, historical score distributions, and recommended areas to drill next.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 rounded-lg border border-[#3A1D19] bg-[#161B24] px-4 py-2 font-mono text-xs text-[#F5F1EC] transition-colors hover:border-[#A55534] hover:bg-[#201815]"
              >
                <Compass className="h-3.5 w-3.5 text-[#A55534]" />
                <span>Browse Domain Catalog</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#C68C6E]" />
              </button>
            </div>
          </div>

          {/* Right window frame */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-[#281E1C] bg-[#12161F] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[#281E1C] bg-[#0C0F14] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#A55534]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C68C6E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EEE9E3]" />
                </div>
                <span className="mx-auto font-mono text-[11px] text-[#C68C6E]">
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
            <p className="mt-3 text-center font-mono text-[11px] text-[#C68C6E]/70">
              The interview competency graph. Nodes highlight as mastery across specific skills is proven.
            </p>
          </div>
        </section>

        {/* SECTION V. THE TERMS */}
        <section id="terms" className="border-b border-[#281E1C] py-24">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F1EC]">
              V. THE TERMS
            </h2>
            <p className="font-sans-editorial text-base leading-relaxed text-[#EEE9E3]/90">
              Local-first evaluation and audio recording. All your interview transcripts, recorded audio, and rubric evaluations are stored directly in your browser. Zero telemetry or data harvesting.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#C68C6E]">
              Transparent 4-pillar rubrics. Every score is explained with concrete strengths, weaknesses, and exemplar answers — no opaque, black-box AI scores.
            </p>
            <p className="font-sans-editorial text-base leading-relaxed text-[#C68C6E]/80">
              Free and open source. Train whenever you want, for as long as you want.
            </p>
          </div>
        </section>

        {/* BOTTOM LAUNCH CTA */}
        <section className="py-28 text-center">
          <div className="mx-auto max-w-xl space-y-6">
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F1EC]">
              Launch InterviewIQ
            </h2>
            <p className="font-sans-editorial text-base text-[#C68C6E]">
              Select your domain and role to begin a focused mock interview session.
            </p>
            <div>
              <button
                type="button"
                onClick={onOpenSelector}
                className="inline-flex items-center gap-2 rounded-xl border border-[#C68C6E]/80 bg-[#A55534] px-7 py-3.5 font-ui text-sm font-bold text-[#F5F1EC] transition-all hover:bg-[#b8613e] hover:scale-105 shadow-xl shadow-[#A55534]/30"
              >
                <span>Start Mock Interview</span>
                <ArrowRight className="h-4 w-4 text-[#EEE9E3]" />
              </button>
            </div>
            <div className="font-mono text-xs text-[#C68C6E]/70">
              Free & open source · Local-first in your browser
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#281E1C] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 font-mono text-xs text-[#C68C6E] sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-[#3A1D19] to-[#A55534] p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-[#0C0F14]">
                <Brain className="h-3 w-3 text-[#C68C6E]" />
              </div>
            </div>
            <span>InterviewIQ · Open Source AI Interview Harness</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenRubric}
              className="hover:text-[#F5F1EC] transition-colors"
            >
              Rubrics
            </button>
            <button
              type="button"
              onClick={onOpenSelector}
              className="hover:text-[#F5F1EC] transition-colors"
            >
              Domains
            </button>
            {onOpenStudy && (
              <button
                type="button"
                onClick={onOpenStudy}
                className="hover:text-[#F5F1EC] transition-colors"
              >
                Practice
              </button>
            )}
            <a
              href="https://github.com/akshat-zero/interview-iq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#F5F1EC] transition-colors"
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
