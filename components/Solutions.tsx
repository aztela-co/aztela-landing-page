"use client";

import { useState, useEffect, useCallback } from "react";
import AnimatedSection from "./AnimatedSection";

const segments = [
  {
    id: "distributors",
    label: "Distributors",
    solutions: [
      {
        title: "Inter-Branch Inventory Intelligence",
        body: "Real-time stock levels across every location in one unified view. Automated transfer recommendations eliminate manual guesswork — the right stock moves to where it's needed before a stockout happens.",
        outcomes: ["Stockout incidents ↓ 58%", "Overstock exposure ↓ 34%", "Transfer cycle time ↓ 70%"],
      },
      {
        title: "Supplier Disruption Radar",
        body: "Automated monitoring of supplier lead times, shipment statuses, and risk signals. 48-hour early warnings surface alternative sourcing options before you're out of stock and paying expedite fees.",
        outcomes: ["Reaction lag: 3 days → 4 hours", "Expedited freight costs ↓ 42%", "Customer fill rate ↑ 15%"],
      },
      {
        title: "Dynamic Reorder Engine",
        body: "Reorder points that automatically update with real demand velocity, seasonality shifts, and supplier lead time changes. No more static PAR levels built on last year's data.",
        outcomes: ["Spot-buy premiums ↓ 35%", "Dead stock ratio ↓ 28%", "Inventory turns ↑ 22%"],
      },
      {
        title: "Unified Operational Data Layer",
        body: "ERP, WMS, and 3PL data unified into one trusted source of truth. Reports generate in minutes. Pre-meeting reconciliation projects disappear entirely.",
        outcomes: ["Reporting time ↓ 87%", "Decision latency ↓ 60%", "10+ hrs/week reclaimed"],
      },
    ],
  },
  {
    id: "wholesalers",
    label: "Wholesalers",
    solutions: [
      {
        title: "SKU-Level Demand Intelligence",
        body: "Know exactly which products are trending up, which are dying, and the optimal buy quantity for each. Buying becomes a data-driven discipline, not a relationship guess.",
        outcomes: ["Dead stock ratio ↓ 40%", "Stockout rate ↓ 28%", "Inventory ROI ↑ 33%"],
      },
      {
        title: "Real-Time Landed Cost Engine",
        body: "Every cost component — freight, duties, surcharges — calculated at PO time, not reconciled 6 weeks later. Price jobs with actual cost data and protect your margin from day one.",
        outcomes: ["Pricing accuracy ↑ 94%", "Margin leakage eliminated", "Invoice disputes ↓ 78%"],
      },
      {
        title: "Supplier Performance Scorecard",
        body: "Consolidated visibility across all suppliers: on-time rates, cost trends, quality flags, and volume leverage. Know exactly where to renegotiate and which relationships to exit.",
        outcomes: ["Sourcing cost ↓ 12% in 90 days", "At-risk supplier alerts automated", "Negotiation leverage quantified"],
      },
      {
        title: "Automated Price Sync",
        body: "Supplier price changes detected and staged in your system same-day via automated feed monitoring. No more margin erosion from pricing lag, no more invoice-vs-PO surprises.",
        outcomes: ["Pricing lag: weeks → same day", "Margin erosion ↓ to near zero", "Pricing team time savings: 6 hrs/wk"],
      },
    ],
  },
  {
    id: "manufacturers",
    label: "Manufacturers",
    solutions: [
      {
        title: "Live WIP Stage Tracker",
        body: "Every work order tracked stage-by-stage in real time. Bottlenecks are flagged automatically the moment they form — before they cost you hours, not after the shift ends.",
        outcomes: ["WIP cycle time ↓ 38%", "On-time delivery ↑ 22%", "Bottleneck response: hours → minutes"],
      },
      {
        title: "BOM Change Propagation",
        body: "Engineering changes flow automatically to the production floor with full version control and cutover logic. Production always runs the right BOM — no manual handoffs, no costly mistakes.",
        outcomes: ["BOM-related scrap ↓ 80%", "Rework hours ↓ 65%", "Version mismatch incidents: eliminated"],
      },
      {
        title: "Constraint Intelligence Dashboard",
        body: "Real-time OEE per line with automated bottleneck identification. See your throughput constraint the moment it forms. Make shift decisions with live data, not yesterday's report.",
        outcomes: ["OEE improvement: +18–25 pts", "Throughput ↑ 15%", "Shift supervisor decision time ↓ 70%"],
      },
      {
        title: "Internal Material Availability View",
        body: "Every raw material and component tracked across all buildings and staging areas in real time. Line stoppages from material location failures become a thing of the past.",
        outcomes: ["Avoidable stoppages ↓ to near zero", "6+ hrs/month recovered", "Material search time ↓ 90%"],
      },
    ],
  },
];

export default function Solutions() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % segments.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(advance, 5500);
    return () => clearInterval(id);
  }, [paused, advance]);

  const seg = segments[active];

  return (
    <section id="solutions" className="px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
            How we fix it
          </p>
          <h2
            className="text-4xl md:text-5xl font-semibold text-[var(--off-white)] mb-10 max-w-xl leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Precision solutions. Outcomes you can put in a board deck.
          </h2>

          {/* Segment tabs */}
          <div className="flex gap-1 mb-12 border border-[var(--border)] p-1 rounded-sm w-fit">
            {segments.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActive(i); setPaused(true); }}
                className={`px-5 py-2 text-sm font-medium transition-all rounded-sm ${
                  active === i
                    ? "bg-[var(--coral)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--off-white)]"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div key={seg.id} className="grid md:grid-cols-2 gap-6 pain-grid-enter">
          {seg.solutions.map(({ title, body, outcomes }, i) => (
            <div
              key={title}
              className="border border-[var(--border)] p-8 md:p-10 h-full group hover:border-[var(--coral)] transition-all hover:translate-y-[-3px] duration-300 flex flex-col"
            >
              <div className="w-8 h-px bg-[var(--coral)] mb-6 group-hover:w-16 transition-all duration-300" />
              <h3
                className="text-xl font-semibold text-[var(--off-white)] mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 flex-1" style={{ fontFamily: "var(--font-inter)" }}>
                {body}
              </p>
              {/* Outcome chips */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {outcomes.map((o) => (
                  <span
                    key={o}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-sm"
                    style={{
                      fontFamily: "var(--font-inter)",
                      background: "rgba(77,128,255,0.08)",
                      color: "var(--coral)",
                      border: "1px solid rgba(77,128,255,0.2)",
                    }}
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicators */}
        <div className="flex gap-2 mt-6">
          {segments.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setPaused(true); }}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-[var(--coral)]" : "w-4 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
