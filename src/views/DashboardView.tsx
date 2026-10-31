import React, { useState } from 'react';
import { InterviewSession, PillarEvaluation } from '../types/interview';
import { PillarCard } from '../components/PillarCard';
import { RubricBadge } from '../components/RubricBadge';
import { TopBar, ConfidenceRail, ThinkingBlock } from '../components/LhPrimitives';
import {
  Download,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DashboardViewProps {
  session: InterviewSession;
  onStartNewSession: () => void;
  onExitHome: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  session,
  onStartNewSession,
  onExitHome,
  sidebarOpen = true,
  onToggleSidebar
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    session.evaluations[0]?.questionId || null
  );

  const handleCopySummary = () => {
    const summaryText = `InterviewIQ Session Results:
Domain: ${session.domainTitle} (${session.roleName})
Overall Score: ${session.overallScore}/100
Hire Verdict: ${session.hireVerdict}
Pillars:
- Relevance & Accuracy: ${session.averagePillarScores.relevanceAccuracy}/100
- Communication & Delivery: ${session.averagePillarScores.communicationDelivery}/100
- Domain-Specific Polish: ${session.averagePillarScores.domainPolish}/100
- Actionable Gaps: ${session.averagePillarScores.actionableGaps}/100
Questions Completed: ${session.evaluations.length}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const aggregatePillars: Record<string, PillarEvaluation> = {
    relevanceAccuracy: {
      key: 'relevanceAccuracy',
      title: 'Relevance & Accuracy',
      score: session.averagePillarScores.relevanceAccuracy,
      verdict:
        session.averagePillarScores.relevanceAccuracy >= 85
          ? 'Exceptional'
          : session.averagePillarScores.relevanceAccuracy >= 72
          ? 'Strong'
          : session.averagePillarScores.relevanceAccuracy >= 50
          ? 'Adequate'
          : 'Needs Improvement',
      summary: 'Session average across all answered technical/behavioral prompts.',
      strengths:
        session.averagePillarScores.relevanceAccuracy >= 50
          ? [
              'Direct alignment with primary question requirements.',
              'Demonstrated contextual comprehension without drifting off-topic.'
            ]
          : ['Answer submission recorded.'],
      gaps:
        session.averagePillarScores.relevanceAccuracy >= 50
          ? [
              'Include more edge cases and failure mode handling.',
              'Support statements with quantitative metrics or benchmarks.'
            ]
          : [
              'Critical failure: Response did not address the required scenario constraints.',
              'Incorporate specific mechanisms directly requested in the prompt.'
            ],
      actionableTip:
        'State a 1-sentence thesis upfront directly answering the question before elaborating.'
    },
    communicationDelivery: {
      key: 'communicationDelivery',
      title: 'Communication & Delivery',
      score: session.averagePillarScores.communicationDelivery,
      verdict:
        session.averagePillarScores.communicationDelivery >= 85
          ? 'Exceptional'
          : session.averagePillarScores.communicationDelivery >= 72
          ? 'Strong'
          : session.averagePillarScores.communicationDelivery >= 50
          ? 'Adequate'
          : 'Needs Improvement',
      summary: 'Evaluates executive cadence, structural framing, and conciseness.',
      strengths: [
        'Organized thought flow and professional presentation.',
        'Effective use of structural markers for clarity.'
      ],
      gaps: [
        'Use explicit signposting (First, Next, Finally).',
        'Summarize with a closing sentence before concluding.'
      ],
      actionableTip: 'Apply the Rule of Three to keep complex answers memorable.'
    },
    domainPolish: {
      key: 'domainPolish',
      title: 'Domain-Specific Polish',
      score: session.averagePillarScores.domainPolish,
      verdict:
        session.averagePillarScores.domainPolish >= 85
          ? 'Exceptional'
          : session.averagePillarScores.domainPolish >= 72
          ? 'Strong'
          : session.averagePillarScores.domainPolish >= 50
          ? 'Adequate'
          : 'Needs Improvement',
      summary: 'Mastery of professional vocabulary, frameworks, and trade-offs.',
      strengths:
        session.averagePillarScores.domainPolish >= 50
          ? [
              `Command of core concepts in ${session.domainTitle}.`,
              'Demonstrated practical industry realism.'
            ]
          : ['Basic vocabulary.'],
      gaps: [
        'Explicitly state trade-offs (e.g. latency vs consistency, cost vs velocity).',
        'Incorporate standard industry-level design patterns.'
      ],
      actionableTip:
        'Explicitly explain what you are giving up to achieve your chosen priority.'
    },
    actionableGaps: {
      key: 'actionableGaps',
      title: 'Actionable Gaps',
      score: session.averagePillarScores.actionableGaps,
      verdict:
        session.averagePillarScores.actionableGaps >= 85
          ? 'Exceptional'
          : session.averagePillarScores.actionableGaps >= 72
          ? 'Strong'
          : session.averagePillarScores.actionableGaps >= 50
          ? 'Adequate'
          : 'Needs Improvement',
      summary: 'Identifies unaddressed risks, omissions, and blind spots.',
      strengths: [
        'Identified the primary challenge accurately.',
        'Avoided common anti-patterns.'
      ],
      gaps: [
        'Always anticipate what the interviewer will drill down on next.',
        'Ensure measurable verification criteria are mentioned.'
      ],
      actionableTip:
        'Conclude answers by stating what further telemetry or steps you would explore.'
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#241910] text-[#E9DFDF] texture-plum font-sans-editorial">
      {/* LearnHarness TopBar */}
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        title={session.roleName}
        rightContent={
          <div className="no-print flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#513A42] bg-[#3B2931] px-3 py-1.5 text-[#D5BFC3] hover:border-[#C69BA5] hover:text-[#F4EDEF] transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#C69BA5]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#513A42] bg-[#3B2931] px-3 py-1.5 text-[#D5BFC3] hover:border-[#C69BA5] hover:text-[#F4EDEF] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onStartNewSession}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#C69BA5]/60 bg-[#754653] px-3.5 py-1.5 font-bold text-[#F4EDEF] hover:bg-[#C6A0A7] hover:text-[#241910] transition-all shadow-md shadow-[#482832]/50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>New Session</span>
            </button>
          </div>
        }
      />

      {/* Scrollable Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8 space-y-8 pb-20">
          {/* Executive Summary Card */}
          <div className="rounded-2xl border border-[#513A42] bg-[#302329] p-6 sm:p-8 space-y-6 shadow-2xl shadow-[#241910]/70">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#513A42] pb-5">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-[#C69BA5]">
                  SESSION SCORECARD · {session.domainTitle.toUpperCase()} · {formatDate(session.createdAt)} · {formatTime(session.totalTimeSeconds)}
                </div>
                <h2 className="mt-1 font-editorial text-3xl sm:text-4xl text-[#F4EDEF] font-bold">
                  {session.roleName} — {session.overallScore}/100
                </h2>
              </div>
              <RubricBadge type="recommendation" value={session.hireVerdict} />
            </div>

            <ConfidenceRail value={session.overallScore} />

            <p className="font-sans-editorial text-base text-[#D5BFC3] leading-relaxed">
              {session.overallScore >= 85
                ? `Candidate delivered an exceptional interview session for ${session.roleName}. Answers demonstrated deep conceptual command, explicit awareness of trade-offs, and crisp executive communication.`
                : session.overallScore >= 75
                ? `Candidate demonstrated solid operational competence and domain literacy for ${session.roleName}. With minor refinement around failure modes and quantitative precision, this converts to an unambiguous Strong Hire.`
                : session.overallScore >= 55
                ? `Candidate possesses foundational knowledge for ${session.roleName}. Focus on structured frameworks (STAR/MECE), native domain terminology, and addressing unstated trade-offs.`
                : `Critical performance alert: Candidate submitted non-responsive, superficial, or off-topic responses for ${session.roleName}. Substantive domain mechanisms, architectural trade-offs, and prompt requirements were missing.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="rounded-xl border border-[#513A42] bg-[#241910] p-4 shadow-inner">
                <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] mb-2 font-semibold">
                  + Key Strengths
                </div>
                <ul className="space-y-1.5 text-sm font-sans-editorial text-[#E9DFDF]">
                  {session.keyStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-[#C69BA5]">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#513A42] bg-[#241910] p-4 shadow-inner">
                <div className="font-mono text-xs uppercase tracking-wider text-[#B18A91] mb-2 font-semibold">
                  - Priority Focus Areas
                </div>
                <ul className="space-y-1.5 text-sm font-sans-editorial text-[#D5BFC3]">
                  {session.criticalImprovements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-[#B18A91]">–</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4-Pillar Rubric Breakdown */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#C69BA5]">
                4-PILLAR RUBRIC AVERAGES
              </h3>
              <span className="font-mono text-xs text-[#B9A5AA]">
                {session.evaluations.length} questions evaluated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PillarCard pillar={aggregatePillars.relevanceAccuracy} />
              <PillarCard pillar={aggregatePillars.communicationDelivery} />
              <PillarCard pillar={aggregatePillars.domainPolish} />
              <PillarCard pillar={aggregatePillars.actionableGaps} />
            </div>
          </div>

          {/* Question-by-Question Transcript & Deep Dive */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#C69BA5]">
              QUESTION-BY-QUESTION TRANSCRIPT
            </h3>

            <div className="space-y-3">
              {session.evaluations.map((evaluation, idx) => {
                const isExpanded = expandedQuestionId === evaluation.questionId;
                return (
                  <div
                    key={evaluation.questionId}
                    className="rounded-xl border border-[#513A42] bg-[#302329] overflow-hidden shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedQuestionId(isExpanded ? null : evaluation.questionId)
                      }
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#3B2931]/60 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs text-[#B18A91]">
                          Q{idx + 1} · {evaluation.category} · {evaluation.inputMethod === 'voice' ? 'Spoken' : 'Written'} ({evaluation.timeSpentSeconds}s)
                        </div>
                        <div className="mt-1 font-sans-editorial text-base text-[#F4EDEF] truncate">
                          {evaluation.questionPrompt}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-sm text-[#F4EDEF] font-semibold">
                          {evaluation.overallScore}%
                        </span>
                        <RubricBadge type="grade" value={evaluation.grade} />
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-[#C69BA5]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#B18A91]" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[#513A42] bg-[#241910]/60 px-5 py-5 space-y-5">
                        <div className="lh-prose">
                          <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] mb-1">
                            Prompt
                          </div>
                          <p className="text-[#F4EDEF] font-sans-editorial">{evaluation.questionPrompt}</p>
                        </div>

                        <div>
                          <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] mb-1">
                            Your Response
                          </div>
                          <ThinkingBlock>{evaluation.userAnswer}</ThinkingBlock>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <PillarCard pillar={evaluation.pillars.relevanceAccuracy} />
                          <PillarCard pillar={evaluation.pillars.communicationDelivery} />
                          <PillarCard pillar={evaluation.pillars.domainPolish} />
                          <PillarCard pillar={evaluation.pillars.actionableGaps} />
                        </div>

                        <div className="rounded-xl border border-[#754653]/60 bg-[#3B2931] p-5 shadow-md">
                          <div className="font-mono text-xs uppercase tracking-wider text-[#C69BA5] mb-2 font-semibold flex items-center gap-2">
                            <span>✦</span>
                            <span>Reference Model Answer (98/100)</span>
                          </div>
                          <div className="font-sans-editorial text-sm text-[#F4EDEF] whitespace-pre-wrap leading-relaxed">
                            {evaluation.elevatedModelAnswer}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="no-print flex items-center justify-between border-t border-[#513A42] pt-6">
            <button
              type="button"
              onClick={onExitHome}
              className="rounded-lg border border-[#513A42] bg-[#3B2931] px-4 py-2 font-mono text-xs text-[#D5BFC3] hover:border-[#C69BA5] hover:text-[#F4EDEF] transition-colors"
            >
              ← Return to Home
            </button>
            <button
              type="button"
              onClick={onStartNewSession}
              className="rounded-lg border border-[#C69BA5]/60 bg-[#754653] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#F4EDEF] hover:bg-[#C6A0A7] hover:text-[#241910] transition-all shadow-md shadow-[#482832]/50"
            >
              Start another session →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
