"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import CascadeIntelligenceGraphic from "@/components/graphics/CascadeIntelligenceGraphic";
import InventoryIntelligenceGraphic from "@/components/graphics/InventoryIntelligenceGraphic";
import MarginIntelligenceGraphic from "@/components/graphics/MarginIntelligenceGraphic";
import DeliveryIntelligenceGraphic from "@/components/graphics/DeliveryIntelligenceGraphic";

const solutions = [
  {
    id: "supply-chain",
    area: "Supply Chain Intelligence",
    segment: "Manufacturers",
    segmentColor: "#4ade80",
    color: "#4ade80",
    urgentProblem: "A supplier slips a delivery date. Your MRP logs it. Nobody connects it to the 14 work orders waiting on that component — until the line stops, $80K in staged materials is idle, and 8 customers are expecting deliveries you can't fill.",
    what: "The moment a supplier PO is updated, Aztela traces the full cascade automatically — which jobs are affected, which deliveries are at risk, what actions are available — and surfaces it to your planner before anything reaches the floor.",
    outcomes: [
      { metric: "47 min", label: "Supplier delay to planner alert — down from 4.3 days" },
      { metric: "Zero", label: "Line stoppages from component shortages in 90 days" },
      { metric: "↓ 91%", label: "Expedite freight costs" },
      { metric: "$84K/mo", label: "Downtime cost eliminated" },
    ],
    forWho: ["Plant Manager", "Production Planner", "VP of Operations"],
    Graphic: CascadeIntelligenceGraphic,
  },
  {
    id: "inventory",
    area: "Inventory Intelligence",
    segment: "Distributors",
    segmentColor: "#4d80ff",
    color: "#4d80ff",
    urgentProblem: "Your fastest-moving SKUs run dry in 3 branches while the same items sit fully stocked in 2 others. Orders get declined. The customer calls you before you know there's a problem. Expedite freight piles up on stock you already own — somewhere.",
    what: "Aztela connects all branch systems into a live unified inventory view with dynamic transfer logic based on real-time velocity and stock positions. When a branch goes critical, the system locates stock across the network and triggers a transfer recommendation — before the stockout, not after.",
    outcomes: [
      { metric: "$340K", label: "Annual revenue recovered from prevented stockouts" },
      { metric: "↓ 71%", label: "Inter-branch expedite freight" },
      { metric: "94%", label: "Customer fill rate — up from 81% in 90 days" },
      { metric: "23 days", label: "Time to first prevented stockout" },
    ],
    forWho: ["VP of Operations", "Branch Manager", "Director of Distribution"],
    Graphic: InventoryIntelligenceGraphic,
  },
  {
    id: "margin",
    area: "Margin Intelligence",
    segment: "Wholesalers",
    segmentColor: "#ffb347",
    color: "#ffb347",
    urgentProblem: "Your team quotes jobs using costs that are already out of date. Supplier prices changed 18 days ago. The invoice arrives, the gap gets absorbed silently — by the margin. Nobody has visibility into which open quotes are priced on stale data until it's too late.",
    what: "Aztela monitors supplier price feeds across all portals and PO acknowledgements automatically — same day. A live margin dashboard shows real landed cost per SKU against every open quote so your team sees the exposure before they commit.",
    outcomes: [
      { metric: "$47K/mo", label: "Margin leakage stopped in the first full month" },
      { metric: "Same day", label: "Supplier price changes reflected — down from 18 days" },
      { metric: "↓ 89%", label: "Invoice-vs-PO discrepancies" },
      { metric: "2.1pts", label: "Gross margin improvement over 6 months" },
    ],
    forWho: ["COO", "Purchasing Director", "Pricing Analyst"],
    Graphic: MarginIntelligenceGraphic,
  },
  {
    id: "delivery",
    area: "Delivery Intelligence",
    segment: "All Segments",
    segmentColor: "#c084fc",
    color: "#c084fc",
    urgentProblem: "Sales quotes 3-week lead times. The line is booked 5 weeks out. Promises are made on instinct and broken when reality catches up. The customer relationship absorbs the hit — every month, on multiple quotes.",
    what: "A real-time view of line capacity and committed load that sales can access before quoting. Delivery promises are grounded in what the floor can actually deliver, with automatic risk flags when capacity tightens — before the commitment is made.",
    outcomes: [
      { metric: "↑ 91%", label: "Quote accuracy against actual delivery" },
      { metric: "Eliminated", label: "Late deliveries from capacity oversell" },
      { metric: "↓ 70%", label: "Customer escalations from missed dates" },
      { metric: "Real-time", label: "Capacity visibility for sales before every quote" },
    ],
    forWho: ["VP of Sales", "VP of Operations", "COO"],
    Graphic: DeliveryIntelligenceGraphic,
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="px-6 py-20 md:py-28 grid-bg">
          <div className="max-w-6xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
              ← Back to overview
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-inter)" }}>
              What We Solve
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold text-[var(--off-white)] mb-6 max-w-3xl leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.025em" }}>
              Four operational failures.<br />
              <span className="text-[var(--coral)]">Each one costs you money every month.</span>
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-2xl leading-relaxed mb-12" style={{ fontFamily: "var(--font-inter)" }}>
              We eliminate specific failures — cascade blindness, inventory gaps, margin leakage, delivery misses — with a live intelligence layer built around your operation. Not a software platform. Not a dashboard. A model of how your business actually moves.
            </p>
            <div className="flex flex-wrap gap-3">
              {solutions.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-sm text-sm text-[var(--muted)] hover:text-[var(--off-white)] hover:border-[var(--coral)] transition-all"
                  style={{ fontFamily: "var(--font-inter)" }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                  {s.area}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Each solution */}
        {solutions.map((s, idx) => (
          <section key={s.id} id={s.id} className={`px-6 py-20 md:py-28 ${idx % 2 === 1 ? "bg-[var(--charcoal-light)]" : ""}`}>
            <div className="max-w-6xl mx-auto">

              {/* Segment badge + area name */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-sm tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-inter)", background: `${s.segmentColor}15`, color: s.segmentColor, border: `1px solid ${s.segmentColor}30` }}>
                  {s.segment}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-3 leading-tight" style={{ fontFamily: "var(--font-playfair)", color: s.color }}>
                {s.area}
              </h2>

              {/* Urgent problem — full width, prominent */}
              <div className="mb-12 max-w-3xl border-l-2 pl-6 py-1" style={{ borderColor: s.color }}>
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase mb-3 text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>The Urgent Problem</p>
                <p className="text-[var(--off-white)] text-lg font-light leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  {s.urgentProblem}
                </p>
              </div>

              {/* Live graphic + what we do, side by side */}
              <div className="grid md:grid-cols-2 gap-10 mb-14 items-start">

                {/* Live animation — LEFT */}
                <div>
                  <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)" }}>
                    Live — watch it work
                  </p>
                  <s.Graphic />
                </div>

                {/* What + Who — RIGHT */}
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)", color: s.color }}>What Aztela Does</p>
                    <p className="text-[var(--muted)] leading-relaxed text-sm" style={{ fontFamily: "var(--font-inter)" }}>{s.what}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)", color: s.color }}>Built For</p>
                    <div className="flex flex-wrap gap-2">
                      {s.forWho.map(r => (
                        <span key={r} className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] rounded-sm" style={{ fontFamily: "var(--font-inter)" }}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Outcomes — full width */}
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-inter)", color: s.color }}>Measured Outcomes</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {s.outcomes.map(o => (
                    <div key={o.label} className="border border-[var(--border)] p-5 rounded-sm hover:border-[var(--coral)] transition-colors">
                      <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-inter)", color: s.color }}>{o.metric}</p>
                      <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{o.label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="px-6 py-20 border-t border-[var(--border)] bg-[var(--charcoal-light)]">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Which one is costing you the most right now?
            </h2>
            <p className="text-[var(--muted)] mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              30 minutes. We map your specific gaps, put a dollar figure on each, and show you what fixing them looks like.
            </p>
            <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center px-10 py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-2px] rounded-sm"
              style={{ fontFamily: "var(--font-inter)" }}>
              Get Your Free Operations Assessment →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
