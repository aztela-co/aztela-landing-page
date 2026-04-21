"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

type Option = { label: string; sub: string; points: number };
type Dimension = {
  id: string;
  title: string;
  question: string;
  options: Option[];
  calculatorHref: string;
  calculatorLabel: string;
};

const DIMENSIONS: Dimension[] = [
  {
    id: "visibility",
    title: "Cross-Branch Visibility",
    question: "Can you see in real time what stock exists at every branch in your network?",
    options: [
      { label: "No visibility",           sub: "Each branch operates independently — no central view",                          points: 0  },
      { label: "Manual process",          sub: "Phone calls, emails, or spreadsheets to check other branches",                   points: 5  },
      { label: "Partial ERP view",        sub: "Some visibility but incomplete — not trusted for decisions",                     points: 12 },
      { label: "Full real-time view",     sub: "Live stock across all locations, trusted by sales and ops",                      points: 20 },
    ],
    calculatorHref: "/tools/distributor/stockout-predictor",
    calculatorLabel: "Stockout Predictor",
  },
  {
    id: "deadstock",
    title: "Dead Stock Detection",
    question: "How quickly do you identify items that have stopped moving before they become fully dead?",
    options: [
      { label: "Annual audit",            sub: "Dead stock discovered once a year — usually at write-off time",                  points: 0  },
      { label: "Quarterly review",        sub: "Reviewed every 90 days — slow-movers often become dead before action",          points: 5  },
      { label: "Monthly report",          sub: "Monthly visibility — some recovery possible but capital already tied up",        points: 12 },
      { label: "Automated weekly alert",  sub: "Flagged automatically before 60-day threshold — capital still recoverable",      points: 20 },
    ],
    calculatorHref: "/tools/distributor/dead-stock",
    calculatorLabel: "Dead Stock Calculator",
  },
  {
    id: "ordering",
    title: "Order Proposal Intelligence",
    question: "How are purchase orders and replenishment decisions generated in your operation?",
    options: [
      { label: "Gut feel and experience", sub: "Buyers decide based on memory and instinct — no system input",                   points: 0  },
      { label: "Manual rules in Excel",   sub: "Spreadsheet-based reorder points — updated infrequently",                       points: 5  },
      { label: "Semi-automated review",   sub: "System generates proposals but buyers override frequently",                      points: 12 },
      { label: "Fully automated",         sub: "Proposals driven by live velocity, lead time, and demand signal",                points: 20 },
    ],
    calculatorHref: "/tools/distributor/transfer-vs-reorder",
    calculatorLabel: "Transfer vs. Reorder Calculator",
  },
  {
    id: "margin",
    title: "Margin Visibility at Point of Sale",
    question: "Do your salespeople know true landed cost — including current freight and duties — before quoting?",
    options: [
      { label: "Never",                   sub: "Reps quote from memory or old price sheets — no cost visibility",                points: 0  },
      { label: "Sometimes",               sub: "Cost data available but rarely checked before quoting",                          points: 5  },
      { label: "Usually",                 sub: "Most reps check cost before quoting — manual lookup required",                   points: 12 },
      { label: "Always in real time",     sub: "Live landed cost including freight and duties at point of quote",                 points: 20 },
    ],
    calculatorHref: "/tools/distributor/stockout-predictor",
    calculatorLabel: "Stockout Predictor",
  },
  {
    id: "demand",
    title: "Demand Signal Quality",
    question: "How far in advance can you see demand building before a stockout occurs?",
    options: [
      { label: "We find out when it happens", sub: "Stockouts discovered at point of order — no forward signal",                 points: 0  },
      { label: "1–3 days notice",         sub: "Short warning window — not enough time to act",                                  points: 5  },
      { label: "Around 1 week",           sub: "Some lead time to respond — limited by supplier lead times",                     points: 12 },
      { label: "2+ weeks forward signal", sub: "Demand building detected early enough to reposition or reorder",                 points: 20 },
    ],
    calculatorHref: "/tools/distributor/stockout-predictor",
    calculatorLabel: "Stockout Predictor",
  },
];

type Tier = { label: string; color: string; bg: string; border: string; diagnosis: string };

const TIERS: Tier[] = [
  {
    label: "Critical",
    color: "#f87171",
    bg: "rgba(248,113,113,0.06)",
    border: "rgba(248,113,113,0.3)",
    diagnosis: "Significant capital is at risk from inventory blindness across your network. Your operation is making daily decisions — fulfillment, ordering, quoting — without the data to make them correctly. The cost shows up as stockouts, emergency freight, dead stock write-offs, and margin you can't explain. This isn't a technology problem yet. It's a visibility problem that becomes a P&L problem every single week.",
  },
  {
    label: "Developing",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.3)",
    diagnosis: "Core gaps exist that are creating measurable, recurring cost. You have some systems in place but they're not connected, not trusted, or not fast enough to drive the decisions that matter. The money you're losing isn't catastrophic — but it's consistent and predictable, which means it's also fixable. The gaps in your lowest dimensions are where the real exposure lives.",
  },
  {
    label: "Functional",
    color: "#4d80ff",
    bg: "rgba(77,128,255,0.06)",
    border: "rgba(77,128,255,0.3)",
    diagnosis: "Your operation works — but it's leaving measurable money on the table. The systems exist, the processes are mostly in place, but there are specific dimensions where you're still operating reactively. The opportunity isn't to fix something broken — it's to close the gap between functional and intelligent, where the real margin and competitive advantage live.",
  },
  {
    label: "Intelligent",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.06)",
    border: "rgba(74,222,128,0.3)",
    diagnosis: "Your inventory intelligence is a competitive advantage. You're operating with real-time visibility, automated signals, and proactive decision-making across most dimensions. The question now is whether that advantage is compounding — or whether specific gaps are limiting how much value the strong dimensions can actually deliver.",
  },
];

function getTier(score: number): Tier {
  if (score <= 40) return TIERS[0];
  if (score <= 60) return TIERS[1];
  if (score <= 80) return TIERS[2];
  return TIERS[3];
}

export default function InventoryScorecardPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalScore = useMemo(() =>
    Object.values(answers).reduce((a, b) => a + b, 0),
    [answers]
  );

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === DIMENSIONS.length;

  const weakestDimension = useMemo(() => {
    if (!allAnswered) return null;
    return DIMENSIONS.reduce((weakest, dim) =>
      (answers[dim.id] ?? 20) < (answers[weakest.id] ?? 20) ? dim : weakest
    );
  }, [answers, allAnswered]);

  const tier = getTier(totalScore);

  return (
    <>
      <Navbar />
      <main className="pt-16">

        <section className="px-6 py-16 md:py-24 grid-bg">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/tools" className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
              ← Back to tools
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Distributor Tool</p>
            <h1 className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}>
              Inventory Intelligence Scorecard
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              5 questions. 3 minutes. A clear picture of where your inventory operation is costing you — and where to fix it first.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
              <span>5 dimensions scored</span>
              <span style={{ color: "var(--border)" }}>|</span>
              <span>Personalised diagnosis</span>
              <span style={{ color: "var(--border)" }}>|</span>
              <span>No email required</span>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">

            {/* Progress */}
            <div className="mb-10">
              <div className="flex justify-between text-xs text-[var(--muted)] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                <span>{answeredCount} of {DIMENSIONS.length} answered</span>
                <span style={{ color: answeredCount === DIMENSIONS.length ? "#4ade80" : "var(--muted)" }}>
                  {answeredCount === DIMENSIONS.length ? "Ready to score" : `${DIMENSIONS.length - answeredCount} remaining`}
                </span>
              </div>
              <div className="w-full h-1 rounded-full bg-[var(--border)] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(answeredCount / DIMENSIONS.length) * 100}%`, background: "var(--coral)" }} />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-8 mb-10">
              {DIMENSIONS.map((dim, dimIdx) => (
                <div key={dim.id} className="border border-[var(--border)] rounded-sm p-6"
                  style={{ background: answers[dim.id] !== undefined ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <div className="flex items-start gap-4 mb-5">
                    <span className="text-xs font-bold px-2 py-1 rounded flex-shrink-0 mt-0.5"
                      style={{ fontFamily: "var(--font-inter)", background: "rgba(77,128,255,0.12)", color: "#4d80ff" }}>
                      {dimIdx + 1} / {DIMENSIONS.length}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>
                        {dim.title}
                      </p>
                      <p className="text-base font-medium text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>
                        {dim.question}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dim.options.map((opt) => {
                      const selected = answers[dim.id] === opt.points;
                      return (
                        <button
                          key={opt.points}
                          onClick={() => { setAnswers(prev => ({ ...prev, [dim.id]: opt.points })); setSubmitted(false); }}
                          className="w-full text-left px-4 py-3 rounded-sm border transition-all duration-150"
                          style={{
                            background: selected ? "rgba(77,128,255,0.08)" : "rgba(255,255,255,0.01)",
                            borderColor: selected ? "rgba(77,128,255,0.5)" : "var(--border)",
                          }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all"
                                style={{ borderColor: selected ? "#4d80ff" : "var(--border)", background: selected ? "#4d80ff" : "transparent" }} />
                              <div>
                                <p className="text-sm font-medium" style={{ color: selected ? "var(--off-white)" : "var(--muted)", fontFamily: "var(--font-inter)" }}>
                                  {opt.label}
                                </p>
                                <p className="text-xs text-[var(--muted)] mt-0.5 opacity-70" style={{ fontFamily: "var(--font-inter)" }}>
                                  {opt.sub}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold flex-shrink-0" style={{ color: selected ? "#4d80ff" : "var(--border)", fontFamily: "var(--font-inter)" }}>
                              {opt.points} pts
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Score button */}
            <button
              onClick={() => { if (allAnswered) setSubmitted(true); }}
              disabled={!allAnswered}
              className="w-full py-4 font-medium text-sm transition-all rounded-sm mb-10"
              style={{
                fontFamily: "var(--font-inter)",
                background: allAnswered ? "var(--coral)" : "rgba(255,255,255,0.05)",
                color: allAnswered ? "white" : "var(--muted)",
                cursor: allAnswered ? "pointer" : "not-allowed",
              }}
            >
              {allAnswered ? "Score My Inventory Intelligence →" : `Answer all ${DIMENSIONS.length} questions to see your score`}
            </button>

            {/* Results */}
            {submitted && (
              <div className="space-y-5 animate-in fade-in duration-500">

                {/* Score headline */}
                <div className="border rounded-sm p-8 text-center"
                  style={{ background: tier.bg, borderColor: tier.border }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: tier.color, fontFamily: "var(--font-inter)" }}>
                    Your Inventory Intelligence Score
                  </p>
                  <p className="text-7xl font-bold mb-2" style={{ color: tier.color, fontFamily: "var(--font-inter)" }}>
                    {totalScore}
                  </p>
                  <p className="text-lg text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>out of 100</p>
                  <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded mt-2"
                    style={{ color: tier.color, background: `${tier.color}18`, border: `1px solid ${tier.color}40`, fontFamily: "var(--font-inter)" }}>
                    {tier.label}
                  </span>
                </div>

                {/* Dimension breakdown */}
                <div className="border border-[var(--border)] rounded-sm p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-5" style={{ fontFamily: "var(--font-inter)" }}>
                    Score breakdown
                  </p>
                  <div className="space-y-4">
                    {DIMENSIONS.map((dim) => {
                      const pts = answers[dim.id] ?? 0;
                      const pct = (pts / 20) * 100;
                      const isWeakest = weakestDimension?.id === dim.id;
                      const barColor = pts >= 20 ? "#4ade80" : pts >= 12 ? "#4d80ff" : pts >= 5 ? "#f59e0b" : "#f87171";
                      return (
                        <div key={dim.id}>
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{dim.title}</span>
                              {isWeakest && (
                                <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                                  style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", fontFamily: "var(--font-inter)" }}>
                                  Biggest gap
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-bold" style={{ color: barColor, fontFamily: "var(--font-inter)" }}>{pts} / 20</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="border border-[var(--border)] rounded-sm p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3" style={{ fontFamily: "var(--font-inter)" }}>
                    Your diagnosis
                  </p>
                  <p className="text-sm text-[var(--off-white)] leading-relaxed mb-5" style={{ fontFamily: "var(--font-inter)" }}>
                    {tier.diagnosis}
                  </p>

                  {weakestDimension && (
                    <div className="border border-[var(--border)] rounded-sm p-4"
                      style={{ background: "rgba(248,113,113,0.04)", borderColor: "rgba(248,113,113,0.2)" }}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#f87171", fontFamily: "var(--font-inter)" }}>
                        Where to start: {weakestDimension.title}
                      </p>
                      <p className="text-xs text-[var(--muted)] leading-relaxed mb-3" style={{ fontFamily: "var(--font-inter)" }}>
                        This is your lowest-scoring dimension and your highest-leverage fix. Before anything else, quantify what this gap is costing you in dollars — not as a percentage, as a number your CFO can act on.
                      </p>
                      <Link
                        href={weakestDimension.calculatorHref}
                        className="inline-flex items-center gap-2 text-sm font-medium text-white px-4 py-2.5 rounded-sm transition-all hover:opacity-90"
                        style={{ background: "var(--coral)", fontFamily: "var(--font-inter)" }}
                      >
                        Put a dollar figure on it → {weakestDimension.calculatorLabel}
                      </Link>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="border border-[var(--border)] rounded-sm p-6"
                  style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm font-medium text-[var(--off-white)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>
                    See exactly what your score costs you — on your own data.
                  </p>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    The scorecard shows you where the gaps are. Aztela shows you what they cost — live, from your own ERP and inventory data. Most clients see the number in under 48 hours.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    See What Your Score Costs You in Dollars →
                  </a>
                </div>

              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
