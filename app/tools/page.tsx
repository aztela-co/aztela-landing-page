"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// ─── Shared helpers ───────────────────────────────────────────────────────────

type Segment = "distributor" | "wholesaler" | "manufacturer";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

// ─── ROI CALCULATOR ───────────────────────────────────────────────────────────

function calcDistributor(revenue: number, locations: number) {
  return [
    { label: "Revenue lost to stockouts & inter-branch blindness", value: revenue * 0.028, pct: "2.8% of revenue" },
    { label: "Expedited freight on avoidable shortages",            value: revenue * 0.006, pct: "0.6% of revenue" },
    { label: "Working capital tied up in dead stock",               value: revenue * 0.018, pct: "1.8% of revenue" },
    { label: "Staff time reconciling inventory across branches",    value: locations * 52 * 3 * 75, pct: `${locations} locations × 3 hrs/week` },
  ];
}

function calcWholesaler(revenue: number, suppliers: number) {
  return [
    { label: "Margin eroded by supplier pricing lag",             value: revenue * 0.018, pct: "1.8% of revenue" },
    { label: "Capital tied up in dead & slow-moving stock",       value: revenue * 0.022, pct: "2.2% of revenue" },
    { label: "Margin lost on quotes priced on stale cost data",   value: revenue * 0.009, pct: "0.9% of revenue" },
    { label: "Supplier reconciliation & pricing admin",           value: suppliers * 12 * 2.5 * 85, pct: `${suppliers} suppliers × 2.5 hrs/month` },
  ];
}

function calcManufacturer(revenue: number, stoppages: number, workOrders: number) {
  return [
    { label: "Line stoppages from component shortages",                          value: stoppages * 12 * 6 * 4200,      pct: `${stoppages}/mo × 6 hrs avg × $4,200/hr` },
    { label: "Assembly starvation — labor staged for jobs that can't run",       value: workOrders * 12 * 0.08 * 2400,  pct: `~8% of ${workOrders} work orders/mo stalled` },
    { label: "Expedite freight on avoidable shortages",                          value: revenue * 0.012,                pct: "1.2% of revenue" },
    { label: "Late delivery penalties & customer relationship cost",             value: revenue * 0.006,                pct: "0.6% of revenue" },
  ];
}

function ROICalculator() {
  const [segment, setSegment] = useState<Segment>("distributor");
  const [revenue, setRevenue] = useState(25);
  const [field2, setField2] = useState(6);
  const [field3, setField3] = useState(100);
  const [calculated, setCalculated] = useState(false);

  const rev = revenue * 1_000_000;
  const rows =
    segment === "distributor" ? calcDistributor(rev, field2) :
    segment === "wholesaler"  ? calcWholesaler(rev, field2) :
    calcManufacturer(rev, field2, field3);
  const total = rows.reduce((s, r) => s + r.value, 0);
  const conservative = total * 0.35;

  const f2Label: Record<Segment, string> = {
    distributor: "Number of branches / locations",
    wholesaler:  "Number of active suppliers",
    manufacturer: "Monthly line stoppages from component shortages",
  };
  const f2Max: Record<Segment, number> = { distributor: 100, wholesaler: 100, manufacturer: 15 };
  const f2Default: Record<Segment, number> = { distributor: 6, wholesaler: 12, manufacturer: 3 };

  function switchSegment(s: Segment) {
    setSegment(s);
    setField2(f2Default[s]);
    setField3(100);
    setCalculated(false);
  }

  return (
    <div>
      {/* Segment tabs */}
      <div className="flex gap-1 p-1 border border-[var(--border)] rounded w-fit mb-10">
        {(["distributor", "wholesaler", "manufacturer"] as Segment[]).map(s => (
          <button key={s} onClick={() => switchSegment(s)}
            className={`px-6 py-2.5 text-sm font-medium transition-all rounded ${segment === s ? "bg-[var(--coral)] text-white" : "text-[var(--muted)] hover:text-[var(--off-white)]"}`}
            style={{ fontFamily: "var(--font-inter)" }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* Inputs */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your numbers</h2>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>Annual Revenue</label>
              <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>${revenue}M</span>
            </div>
            <input type="range" min={5} max={250} value={revenue}
              onChange={e => { setRevenue(+e.target.value); setCalculated(false); }}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, var(--coral) ${(revenue - 5) / 245 * 100}%, var(--border) 0%)` }} />
            <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              <span>$5M</span><span>$250M</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{f2Label[segment]}</label>
              <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{field2}</span>
            </div>
            <input type="range" min={1} max={f2Max[segment]} value={field2}
              onChange={e => { setField2(+e.target.value); setCalculated(false); }}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, var(--coral) ${(field2 - 1) / (f2Max[segment] - 1) * 100}%, var(--border) 0%)` }} />
            <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              <span>1</span><span>{f2Max[segment]}</span>
            </div>
          </div>

          {segment === "manufacturer" && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>Active work orders per month</label>
                <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{field3}</span>
              </div>
              <input type="range" min={10} max={500} value={field3}
                onChange={e => { setField3(+e.target.value); setCalculated(false); }}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, var(--coral) ${(field3 - 10) / 490 * 100}%, var(--border) 0%)` }} />
              <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                <span>10</span><span>500</span>
              </div>
            </div>
          )}

          <button onClick={() => setCalculated(true)}
            className="w-full py-4 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all hover:translate-y-[-1px] rounded"
            style={{ fontFamily: "var(--font-inter)" }}>
            Calculate My Operational Cost →
          </button>
          <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
            Based on industry benchmarks from Palantir, Gartner, and our own client data. Conservative estimates.
          </p>
        </div>

        {/* Results */}
        <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
          <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            Estimated annual cost of data gaps
          </h2>
          <div className="space-y-3 mb-6">
            {rows.map((r, i) => (
              <div key={i} className="border border-[var(--border)] p-4 rounded hover:border-[var(--coral)] transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{r.label}</p>
                  <p className="text-sm font-bold text-red-400 shrink-0" style={{ fontFamily: "var(--font-inter)" }}>{fmt(r.value)}</p>
                </div>
                <div className="w-full h-0.5 rounded-full bg-[var(--border)]">
                  <div className="h-full rounded-full bg-red-400 transition-all duration-700" style={{ width: calculated ? `${(r.value / total) * 100}%` : "0%" }} />
                </div>
                <p className="text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>{r.pct}</p>
              </div>
            ))}
          </div>
          <div className="border border-[var(--border)] rounded p-6" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Total identified exposure</p>
                <p className="text-2xl font-bold text-red-400" style={{ fontFamily: "var(--font-inter)" }}>{fmt(total)}/yr</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Conservative recoverable (35%)</p>
                <p className="text-2xl font-bold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(conservative)}/yr</p>
              </div>
            </div>
            <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-3.5 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded"
              style={{ fontFamily: "var(--font-inter)" }}>
              Get Your Free Assessment — We'll Verify These Numbers →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── RISK SCORE ───────────────────────────────────────────────────────────────

type Question = { q: string; options: string[]; scores: number[]; vulnerability: string };

const RISK_QUESTIONS: Record<Segment, Question[]> = {
  distributor: [
    {
      q: "How do branch managers alert you to a critical stockout?",
      options: ["Flagged in ERP same day", "Weekly inventory report", "They email or call when a customer asks", "Customer calls us first"],
      scores: [0, 1, 1, 2],
      vulnerability: "You're learning about stockouts from customers — your operation is at least one step behind every fulfillment failure.",
    },
    {
      q: "When your top supplier is 2 weeks late on a shipment, how do you find out?",
      options: ["Automated PO monitoring alert", "We track POs manually each week", "Supplier eventually emails us", "We notice when stock runs out"],
      scores: [0, 1, 1, 2],
      vulnerability: "No early-warning on supplier delays means you're absorbing the full cost of every disruption — no buffer, no prep.",
    },
    {
      q: "How quickly can you locate and transfer stock between branches when needed?",
      options: ["Under 24 hours with live visibility", "1–2 days with manual checks", "3–5 business days", "We don't have a reliable process"],
      scores: [0, 0, 1, 2],
      vulnerability: "3+ day transfer cycles are invisible to customers. By the time stock moves, they've already ordered elsewhere.",
    },
    {
      q: "What share of your top 20 SKUs comes from a single supplier?",
      options: ["Under 15%", "15–35%", "35–55%", "Over 55%"],
      scores: [0, 0, 1, 2],
      vulnerability: "High single-supplier concentration means one bad month cascades across your entire catalog — immediately.",
    },
    {
      q: "When do you typically know an order won't arrive on time for a customer?",
      options: ["Before confirming with the customer", "After the PO is sent to supplier", "Day of the expected delivery", "When the customer calls us"],
      scores: [0, 1, 2, 2],
      vulnerability: "If your system tells you after the customer does, every late delivery is a reactive scramble — and a relationship at risk.",
    },
    {
      q: "How long before slow-moving or dead stock gets flagged and actioned?",
      options: ["30-day automated flag", "Quarterly manual review", "When someone physically notices it", "We don't have a clear process"],
      scores: [0, 1, 2, 2],
      vulnerability: "Undetected dead stock is working capital sitting idle — capital that could be covering real, live demand elsewhere.",
    },
  ],
  wholesaler: [
    {
      q: "How often are you quoting customers on cost data that's more than 2 weeks old?",
      options: ["Rarely — costs update daily", "Occasionally — weekly updates", "Often — costs update monthly", "Regularly — quarterly or less"],
      scores: [0, 0, 1, 2],
      vulnerability: "Quoting on stale costs means your margin is wrong from the first line item — you may not find out until invoicing.",
    },
    {
      q: "When a supplier raises prices, how quickly does it show up in your open quotes?",
      options: ["Same day — automated", "Within a week — manual update", "End of the month review", "We find out when we invoice the customer"],
      scores: [0, 1, 2, 2],
      vulnerability: "Finding out about price increases at invoicing means you've already committed to a margin you can't recover.",
    },
    {
      q: "What share of your total revenue runs through your top 3 suppliers?",
      options: ["Under 25%", "25–40%", "40–60%", "Over 60%"],
      scores: [0, 0, 1, 2],
      vulnerability: "60%+ revenue through 3 suppliers is a single point of failure — pricing moves, delays, or disruptions hit your whole book.",
    },
    {
      q: "How do you catch margin erosion on orders that have already been committed?",
      options: ["Automated alerts on live cost changes", "Weekly margin review by ops team", "Monthly P&L reconciliation", "We find out at year-end or audit"],
      scores: [0, 1, 2, 2],
      vulnerability: "If year-end is when you see margin erosion, you've already booked 12 months of avoidable losses with no recovery window.",
    },
    {
      q: "How long is your typical quote-to-close cycle?",
      options: ["Under 3 days", "3–7 days", "7–14 days", "14+ days"],
      scores: [0, 0, 1, 2],
      vulnerability: "14+ day quote cycles mean your cost assumptions are almost certainly stale by the time you close the deal.",
    },
    {
      q: "When you commit to a price, how confident are you that margin is protected through delivery?",
      options: ["Very — costs are locked or live-monitored", "Mostly — we review at milestones", "Not really — a lot can shift", "We often find out on delivery"],
      scores: [0, 1, 2, 2],
      vulnerability: "Discovering margin compression at delivery means the window to reprice, renegotiate, or exit is already closed.",
    },
  ],
  manufacturer: [
    {
      q: "How many of your top 50 components come from a single source?",
      options: ["Fewer than 5", "5–15", "15–25", "More than 25"],
      scores: [0, 1, 2, 2],
      vulnerability: "25+ single-source components means your production schedule has 25+ individual points of failure — any one can stop a line.",
    },
    {
      q: "When a supplier's lead time changes, how do you find out?",
      options: ["Automated ERP alert within 24 hours", "Supplier notifies us proactively", "We notice when a PO doesn't arrive on time", "When the line slows down or stops"],
      scores: [0, 0, 1, 2],
      vulnerability: "Finding out from a slowdown means you're always reacting after the damage is done — expedite freight, idle labor, delayed orders.",
    },
    {
      q: "How often are work orders paused or delayed due to missing components?",
      options: ["Rarely — under once a month", "1–3 times per month", "Weekly", "Multiple times per week"],
      scores: [0, 1, 2, 2],
      vulnerability: "Weekly work order pauses mean your labor and capital are staged but idle — that's pure overhead with no output.",
    },
    {
      q: "How far in advance can you predict a line stoppage from a component shortage?",
      options: ["1+ week out — live BOM monitoring", "2–3 days ahead", "Day before at best", "We can't — we react when it happens"],
      scores: [0, 1, 1, 2],
      vulnerability: "No predictive window = no prevention window. Every line stop is a surprise you pay full price for with no time to mitigate.",
    },
    {
      q: "What does your monthly expedite freight spend look like?",
      options: ["Under $5K", "$5K–$15K", "$15K–$40K", "Over $40K"],
      scores: [0, 1, 2, 2],
      vulnerability: "$40K+/month in expedite freight is a premium you're paying to fix problems your data could have surfaced weeks earlier.",
    },
    {
      q: "What % of your production has committed customer delivery dates set before production starts?",
      options: ["Under 20%", "20–40%", "40–70%", "Over 70%"],
      scores: [0, 0, 1, 2],
      vulnerability: "70%+ make-to-order without early-warning on component risk is maximum delivery exposure with minimal protection.",
    },
  ],
};

const RISK_LEVELS = [
  { label: "Low Risk",      color: "#4ade80", range: "0–4",  desc: "Your operation shows solid data visibility. There may be untapped efficiency gains — but no critical blind spots." },
  { label: "Elevated Risk", color: "#f59e0b", range: "5–8",  desc: "Several visibility gaps are exposing you to avoidable operational cost. Addressable — but compounding over time." },
  { label: "Critical Risk", color: "#f87171", range: "9–12", desc: "Your operation is running blind in key areas. These gaps are likely costing you significantly right now." },
];

function RiskScore() {
  const [segment, setSegment] = useState<Segment>("distributor");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = RISK_QUESTIONS[segment];
  const answered = Object.keys(answers).length;
  const totalScore = Object.values(answers).reduce((s, v) => s + v, 0);
  const riskLevel = totalScore <= 4 ? RISK_LEVELS[0] : totalScore <= 8 ? RISK_LEVELS[1] : RISK_LEVELS[2];
  const pct = Math.min((totalScore / 12) * 100, 100);

  const worstVulnerabilities = questions
    .map((q, i) => ({ q, i, score: answers[i] ?? 0 }))
    .filter(x => x.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  function switchSegment(s: Segment) {
    setSegment(s);
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div>
      {/* Segment tabs */}
      <div className="flex gap-1 p-1 border border-[var(--border)] rounded w-fit mb-10">
        {(["distributor", "wholesaler", "manufacturer"] as Segment[]).map(s => (
          <button key={s} onClick={() => switchSegment(s)}
            className={`px-6 py-2.5 text-sm font-medium transition-all rounded ${segment === s ? "bg-[var(--coral)] text-white" : "text-[var(--muted)] hover:text-[var(--off-white)]"}`}
            style={{ fontFamily: "var(--font-inter)" }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* Questions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>
              {answered < 6 ? `${answered} of 6 answered` : "All questions answered"}
            </h2>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className="w-5 h-1 rounded-full transition-all duration-300"
                  style={{ background: answers[i] !== undefined ? "var(--coral)" : "var(--border)" }} />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {questions.map((q, i) => (
              <div key={`${segment}-${i}`} className="border border-[var(--border)] rounded p-4 transition-colors hover:border-[rgba(77,128,255,0.3)]">
                <p className="text-sm text-[var(--off-white)] mb-3 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  <span className="text-[var(--coral)] font-semibold mr-2 text-xs">Q{i + 1}</span>
                  {q.q}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <button key={j} onClick={() => { setAnswers(a => ({ ...a, [i]: q.scores[j] })); setSubmitted(false); }}
                      className="w-full text-left px-3 py-2.5 text-sm rounded transition-all"
                      style={{
                        fontFamily: "var(--font-inter)",
                        background: answers[i] === q.scores[j] && answers[i] !== undefined
                          ? (q.scores[j] === 0 ? "rgba(74,222,128,0.1)" : q.scores[j] === 1 ? "rgba(245,158,11,0.1)" : "rgba(248,113,113,0.1)")
                          : "rgba(255,255,255,0.03)",
                        border: answers[i] !== undefined && answers[i] === q.scores[j]
                          ? `1px solid ${q.scores[j] === 0 ? "#4ade80" : q.scores[j] === 1 ? "#f59e0b" : "#f87171"}`
                          : "1px solid transparent",
                        color: answers[i] !== undefined && answers[i] === q.scores[j] ? "var(--off-white)" : "var(--muted)",
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSubmitted(true)}
            disabled={answered < 6}
            className="mt-6 w-full py-4 text-white font-medium text-sm rounded transition-all hover:translate-y-[-1px] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-inter)", background: "var(--coral)" }}>
            {answered < 6 ? `Answer ${6 - answered} more to see your score` : "See My Risk Score →"}
          </button>
        </div>

        {/* Result */}
        <div className={`transition-all duration-600 ${submitted ? "opacity-100 translate-y-0" : "opacity-20 translate-y-6 pointer-events-none"}`}>
          <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            Your operational risk profile
          </h2>

          {/* Score gauge */}
          <div className="border border-[var(--border)] rounded p-6 mb-5"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>Risk Score</p>
                <p className="text-5xl font-bold" style={{ color: riskLevel.color, fontFamily: "var(--font-inter)" }}>{totalScore}<span className="text-2xl text-[var(--muted)]">/12</span></p>
              </div>
              <span className="text-sm font-semibold px-3 py-1.5 rounded"
                style={{ fontFamily: "var(--font-inter)", background: `${riskLevel.color}15`, color: riskLevel.color, border: `1px solid ${riskLevel.color}40` }}>
                {riskLevel.label}
              </span>
            </div>

            {/* Bar */}
            <div className="relative h-2 rounded-full overflow-hidden mb-2"
              style={{ background: "linear-gradient(to right, #4ade80 0%, #f59e0b 40%, #f87171 100%)" }}>
              <div className="absolute top-0 left-0 h-full rounded-full bg-[var(--charcoal)] transition-all duration-700"
                style={{ left: `${pct}%`, right: 0 }} />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-lg transition-all duration-700 border-2"
                style={{ left: `${pct}%`, borderColor: riskLevel.color }} />
            </div>
            <div className="flex justify-between text-[9px] text-[var(--muted)] uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
              <span>Low</span><span>Elevated</span><span>Critical</span>
            </div>

            <p className="text-sm text-[var(--muted)] mt-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              {riskLevel.desc}
            </p>
          </div>

          {/* Vulnerabilities */}
          {worstVulnerabilities.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)] mb-3" style={{ fontFamily: "var(--font-inter)" }}>
                Top vulnerabilities flagged
              </p>
              <div className="space-y-2.5">
                {worstVulnerabilities.map(({ q, i, score }) => (
                  <div key={i} className="rounded p-4 border"
                    style={{
                      fontFamily: "var(--font-inter)",
                      background: score === 2 ? "rgba(248,113,113,0.05)" : "rgba(245,158,11,0.05)",
                      borderColor: score === 2 ? "rgba(248,113,113,0.25)" : "rgba(245,158,11,0.25)",
                    }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-semibold uppercase tracking-widest"
                        style={{ color: score === 2 ? "#f87171" : "#f59e0b" }}>
                        {score === 2 ? "Critical" : "Elevated"} — Q{i + 1}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">{q.vulnerability}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {worstVulnerabilities.length === 0 && submitted && (
            <div className="rounded p-4 border mb-5" style={{ background: "rgba(74,222,128,0.05)", borderColor: "rgba(74,222,128,0.25)" }}>
              <p className="text-sm text-[#4ade80]" style={{ fontFamily: "var(--font-inter)" }}>
                Strong visibility across all areas — your operation is in good shape.
              </p>
            </div>
          )}

          <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center py-3.5 text-white font-medium text-sm rounded transition-all hover:translate-y-[-1px]"
            style={{ fontFamily: "var(--font-inter)", background: "var(--coral)", boxShadow: "0 0 20px rgba(77,128,255,0.2)" }}>
            Get a Free Assessment — We'll Review These Gaps With You →
          </a>
        </div>

      </div>
    </div>
  );
}

// ─── CASCADE SIMULATOR ────────────────────────────────────────────────────────

type CascadeStep = {
  label: string;
  value: string;
  sub: string;
  severity: "trigger" | "warning" | "critical";
};

function CascadeSimulator() {
  const [revenue,    setRevenue]    = useState(30);
  const [workOrders, setWorkOrders] = useState(80);
  const [singleSrc,  setSingleSrc]  = useState(30);
  const [mto,        setMto]        = useState(60);
  const [running,    setRunning]    = useState(false);
  const [step,       setStep]       = useState(0);

  function simulate() {
    setRunning(true);
    setStep(0);
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => setStep(i), i * 600);
    }
  }

  function reset() { setRunning(false); setStep(0); }

  const monthlyRev       = (revenue * 1_000_000) / 12;
  const affectedComponents = Math.round(workOrders * (singleSrc / 100));
  const pausedOrders     = Math.round(affectedComponents * 0.65);
  const revenueAtRisk    = Math.round(monthlyRev * (pausedOrders / workOrders));
  const expediteCost     = Math.round(revenueAtRisk * 0.038);
  const deliveriesAtRisk = Math.round(pausedOrders * (mto / 100));

  const steps: CascadeStep[] = [
    {
      label: "Trigger — Supplier 3 weeks late",
      value: "21 days",
      sub: `Key component supplier misses delivery window`,
      severity: "trigger",
    },
    {
      label: "Components at risk",
      value: `${affectedComponents} component lines`,
      sub: `${singleSrc}% of your ${workOrders} active work orders depend on single-source parts`,
      severity: "warning",
    },
    {
      label: "Work orders paused",
      value: `${pausedOrders} work orders`,
      sub: `Labor staged, machinery ready — but can't run. Cost accumulates without output.`,
      severity: "critical",
    },
    {
      label: "Revenue delayed",
      value: fmt(revenueAtRisk),
      sub: `${deliveriesAtRisk} delivery commitments at risk of missing customer dates`,
      severity: "critical",
    },
    {
      label: "Emergency response cost",
      value: fmt(expediteCost),
      sub: `Expedite freight, premium sourcing, and overtime to partially recover`,
      severity: "critical",
    },
  ];

  const severityStyle = {
    trigger:  { bg: "rgba(77,128,255,0.08)",  border: "rgba(77,128,255,0.35)",  color: "#4d80ff" },
    warning:  { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.35)",  color: "#f59e0b" },
    critical: { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.35)", color: "#f87171" },
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-[var(--coral)] uppercase tracking-widest font-medium mb-1" style={{ fontFamily: "var(--font-inter)" }}>
              Scenario
            </p>
            <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>
              Your top supplier misses delivery by 3 weeks. What breaks?
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              Input your operation. We'll trace the cascade through your work orders, deliveries, and margin.
            </p>
          </div>

          {[
            { label: "Annual Revenue", val: revenue, set: setRevenue, min: 5, max: 250, display: `$${revenue}M` },
            { label: "Active work orders / month", val: workOrders, set: setWorkOrders, min: 10, max: 500, display: workOrders.toString() },
            { label: "% components from a single source", val: singleSrc, set: setSingleSrc, min: 5, max: 90, display: `${singleSrc}%` },
            { label: "% production that is make-to-order", val: mto, set: setMto, min: 0, max: 100, display: `${mto}%` },
          ].map(({ label, val, set, min, max, display }) => (
            <div key={label}>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{label}</label>
                <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{display}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(+e.target.value); reset(); }}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, var(--coral) ${(val - min) / (max - min) * 100}%, var(--border) 0%)` }} />
              <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                <span>{min}</span><span>{max}</span>
              </div>
            </div>
          ))}

          <button onClick={simulate}
            className="w-full py-4 text-white font-medium text-sm rounded transition-all hover:translate-y-[-1px]"
            style={{ fontFamily: "var(--font-inter)", background: "var(--coral)" }}>
            Run Cascade Simulation →
          </button>

          <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
            Aztela's cascade logic traces exactly this ripple in real-time — surfacing it before the supplier misses, not after.
          </p>
        </div>

        {/* Cascade visual */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            {step === 0 ? "Cascade will appear here" : step < 5 ? "Tracing impact..." : "Full cascade mapped"}
          </h2>

          <div className="relative">
            {steps.map((s, i) => {
              const style = severityStyle[s.severity];
              const visible = step > i;
              return (
                <div key={i} className="relative">
                  {/* Connector line */}
                  {i > 0 && (
                    <div className="flex justify-center my-1">
                      <div className="flex flex-col items-center gap-0.5">
                        {[0,1,2].map(d => (
                          <div key={d} className="w-px h-1.5 rounded-full transition-all duration-300"
                            style={{ background: visible ? style.color : "var(--border)", opacity: visible ? 0.5 : 0.3 }} />
                        ))}
                        {visible && (
                          <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                            <path d="M1 1l3 3 3-3" stroke={style.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className="rounded p-4 transition-all duration-500"
                    style={{
                      opacity: visible ? 1 : 0.15,
                      transform: visible ? "translateY(0)" : "translateY(8px)",
                      background: visible ? style.bg : "transparent",
                      border: `1px solid ${visible ? style.border : "var(--border)"}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-widest mb-1"
                          style={{ fontFamily: "var(--font-inter)", color: style.color }}>{s.label}</p>
                        <p className="text-lg font-bold text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{s.value}</p>
                        <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{s.sub}</p>
                      </div>
                      {i > 0 && visible && (
                        <div className="w-2 h-2 rounded-full mt-1 shrink-0 animate-pulse" style={{ background: style.color }} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {step === 5 && (
            <div className="mt-6 rounded p-5 border transition-all duration-500"
              style={{ background: "rgba(77,128,255,0.05)", borderColor: "rgba(77,128,255,0.25)" }}>
              <p className="text-sm text-[var(--off-white)] font-medium mb-1" style={{ fontFamily: "var(--font-inter)" }}>
                Aztela surfaces this cascade before the supplier misses.
              </p>
              <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                Live BOM monitoring + supplier lead time correlation = alerts 7–14 days ahead of impact, not after it.
              </p>
              <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3 text-white font-medium text-sm rounded transition-all hover:translate-y-[-1px]"
                style={{ fontFamily: "var(--font-inter)", background: "var(--coral)" }}>
                See It Running in Your Data →
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

type Tool = "roi" | "risk" | "cascade";

const TOOLS: { id: Tool; label: string; sub: string }[] = [
  { id: "roi",     label: "ROI Calculator",       sub: "Quantify your exposure" },
  { id: "risk",    label: "Risk Score",            sub: "Find your blind spots" },
  { id: "cascade", label: "Cascade Simulator",    sub: "Trace impact before it hits" },
];

export default function ToolsPage() {
  const [tool, setTool] = useState<Tool>("roi");

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="px-6 py-14 md:py-20 grid-bg">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
              ← Back to overview
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              Operational Intelligence Tools
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}>
              Know what your operation is hiding — before it costs you.
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Three tools. One picture. Quantify your exposure, find your risk, and trace your cascade.
            </p>
          </div>
        </section>

        {/* Tool selector */}
        <section className="px-6 border-b border-[var(--border)]">
          <div className="max-w-5xl mx-auto flex gap-0">
            {TOOLS.map(t => (
              <button key={t.id} onClick={() => setTool(t.id)}
                className="flex flex-col items-start px-8 py-5 transition-all relative"
                style={{ fontFamily: "var(--font-inter)" }}>
                <span className={`text-sm font-medium transition-colors ${tool === t.id ? "text-[var(--off-white)]" : "text-[var(--muted)]"}`}>
                  {t.label}
                </span>
                <span className="text-xs text-[var(--muted)] opacity-60 mt-0.5">{t.sub}</span>
                {tool === t.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--coral)]" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Active tool */}
        <section className="px-6 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            {tool === "roi"     && <ROICalculator />}
            {tool === "risk"    && <RiskScore />}
            {tool === "cascade" && <CascadeSimulator />}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
