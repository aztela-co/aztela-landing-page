"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// ─── Animated node graph ──────────────────────────────────────────────────────
type NodeDef = { id: string; label: string; x: number; y: number; alert?: boolean };
type EdgeDef = { from: string; to: string; alert?: boolean };

function OperationalGraph({ nodes, edges, alertNode }: { nodes: NodeDef[]; edges: EdgeDef[]; alertNode?: string }) {
  const [drawn, setDrawn] = useState<string[]>([]);
  const [alerted, setAlerted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        nodes.forEach((n, i) => {
          setTimeout(() => setDrawn(d => [...d, n.id]), i * 160);
        });
        if (alertNode) setTimeout(() => setAlerted(true), nodes.length * 160 + 600);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [nodes, alertNode]);

  return (
    <div ref={ref} className="relative w-full" style={{ height: 340 }}>
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        {edges.map(e => {
          const from = nodes.find(n => n.id === e.from);
          const to = nodes.find(n => n.id === e.to);
          if (!from || !to || !drawn.includes(from.id) || !drawn.includes(to.id)) return null;
          const isAlert = alerted && e.alert;
          return (
            <line key={`${e.from}-${e.to}`}
              x1={`${from.x}%`} y1={`${from.y}%`}
              x2={`${to.x}%`} y2={`${to.y}%`}
              stroke={isAlert ? "#ff6b6b" : "rgba(77,128,255,0.3)"}
              strokeWidth={isAlert ? 1.5 : 1}
              strokeDasharray={isAlert ? "4 3" : "none"}
              style={{ transition: "stroke 0.5s ease" }}
            />
          );
        })}
      </svg>
      {nodes.map(n => {
        const isAlert = alerted && n.id === alertNode;
        const isImpacted = alerted && edges.some(e => e.alert && (e.from === n.id || e.to === n.id)) && n.id !== alertNode;
        return (
          <div key={n.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${n.x}%`, top: `${n.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: drawn.includes(n.id) ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5"
              style={{
                background: isAlert ? "rgba(255,107,107,0.15)" : isImpacted ? "rgba(255,179,71,0.12)" : "rgba(77,128,255,0.1)",
                border: `1px solid ${isAlert ? "rgba(255,107,107,0.5)" : isImpacted ? "rgba(255,179,71,0.4)" : "rgba(77,128,255,0.25)"}`,
                boxShadow: isAlert ? "0 0 16px rgba(255,107,107,0.3)" : "none",
                transition: "all 0.5s ease",
              }}
            >
              <span style={{ fontSize: 14 }}>{n.alert ? "⚠" : "◆"}</span>
            </div>
            <span className="text-[10px] text-center leading-tight max-w-[72px]"
              style={{
                fontFamily: "var(--font-inter)",
                color: isAlert ? "#ff6b6b" : isImpacted ? "#ffb347" : "var(--muted)",
                fontWeight: isAlert || isImpacted ? 600 : 400,
                transition: "color 0.5s ease",
              }}>
              {n.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Solutions data ────────────────────────────────────────────────────────────
const solutions = [
  {
    id: "supply-chain",
    area: "Supply Chain Intelligence",
    segment: "Manufacturers · All Segments",
    color: "#4ade80",
    urgentProblem: "A supplier slips a delivery date. Your MRP logs it. Nobody connects it to the 14 work orders waiting on that component — until the line stops, $80K in staged materials is idle, and 8 customers are already expecting orders you can't fill.",
    howItWorks: "Aztela connects your supplier PO data, open work orders, and production schedule into a single live model. The moment a delivery slips, it traces the full cascade automatically — which jobs are affected, which deliveries are at risk, what actions are available — and surfaces it to the right person before anything reaches the floor.",
    outcomes: [
      { metric: "47 min", label: "Supplier delay to planner alert — down from 4.3 days" },
      { metric: "Zero", label: "Line stoppages from component shortages in 90 days" },
      { metric: "↓ 91%", label: "Expedite freight costs" },
      { metric: "$84K/mo", label: "Downtime cost eliminated" },
    ],
    forWho: ["Plant Manager", "Production Planner", "VP of Operations"],
    graphNodes: [
      { id: "supplier", label: "Supplier PO", x: 15, y: 30 },
      { id: "component", label: "Component HV-442", x: 38, y: 20, alert: true },
      { id: "wo1", label: "Work Order 114", x: 62, y: 15 },
      { id: "wo2", label: "Work Order 118", x: 75, y: 35 },
      { id: "wo3", label: "Work Order 121", x: 62, y: 55 },
      { id: "line", label: "Production Line", x: 85, y: 70 },
      { id: "delivery", label: "8 Deliveries", x: 50, y: 80 },
      { id: "aztela", label: "Aztela Model", x: 15, y: 65 },
    ],
    graphEdges: [
      { from: "supplier", to: "component", alert: true },
      { from: "component", to: "wo1", alert: true },
      { from: "component", to: "wo2", alert: true },
      { from: "component", to: "wo3", alert: true },
      { from: "wo1", to: "delivery", alert: true },
      { from: "wo2", to: "line", alert: true },
      { from: "wo3", to: "delivery", alert: true },
      { from: "aztela", to: "supplier" },
      { from: "aztela", to: "line" },
    ],
    alertNode: "component",
  },
  {
    id: "inventory",
    area: "Inventory Intelligence",
    segment: "Distributors",
    color: "#4d80ff",
    urgentProblem: "Your fastest-moving SKUs run dry in 3 branches while the same items sit fully stocked in 2 others. Orders get declined. Customers call you before you know there's a problem. Expedite freight piles up on stock you already own — somewhere.",
    howItWorks: "Aztela connects all branch systems into a live unified inventory view, with dynamic transfer logic based on real-time velocity and stock positions. When a branch goes low, the system identifies available stock across the network and triggers a transfer recommendation — before the stockout, not after.",
    outcomes: [
      { metric: "$340K", label: "Annual revenue recovered from prevented stockouts" },
      { metric: "↓ 71%", label: "Inter-branch expedite freight" },
      { metric: "94%", label: "Customer fill rate — up from 81% in 90 days" },
      { metric: "23 days", label: "Time to first prevented stockout" },
    ],
    forWho: ["VP of Operations", "Branch Manager", "Director of Distribution"],
    graphNodes: [
      { id: "branch1", label: "Branch — Detroit", x: 15, y: 25, alert: true },
      { id: "branch2", label: "Branch — Cleveland", x: 50, y: 15 },
      { id: "branch3", label: "Branch — Pittsburgh", x: 82, y: 25 },
      { id: "sku", label: "SKU Velocity", x: 50, y: 50 },
      { id: "customer", label: "Customer Order", x: 15, y: 72 },
      { id: "transfer", label: "Transfer Logic", x: 50, y: 78 },
      { id: "aztela", label: "Aztela Model", x: 82, y: 65 },
    ],
    graphEdges: [
      { from: "branch2", to: "branch1", alert: true },
      { from: "branch3", to: "branch1", alert: true },
      { from: "sku", to: "branch1", alert: true },
      { from: "sku", to: "branch2" },
      { from: "sku", to: "branch3" },
      { from: "customer", to: "branch1", alert: true },
      { from: "transfer", to: "branch1", alert: true },
      { from: "aztela", to: "sku" },
      { from: "aztela", to: "transfer" },
    ],
    alertNode: "branch1",
  },
  {
    id: "margin",
    area: "Margin Intelligence",
    segment: "Wholesalers",
    color: "#ffb347",
    urgentProblem: "Your team quotes jobs using costs that are already out of date. Supplier prices changed 18 days ago. The invoice arrives, the gap gets absorbed silently — by the margin. Nobody has visibility into which open quotes are priced on stale data until it's too late.",
    howItWorks: "Aztela monitors supplier price feeds across all portals and PO acknowledgements automatically. Price changes are staged the same day with analyst review. A live margin dashboard shows real landed cost per SKU against every open quote — so your team sees the exposure before they commit.",
    outcomes: [
      { metric: "$47K/mo", label: "Margin leakage stopped in the first full month" },
      { metric: "Same day", label: "Supplier price changes reflected — down from 18 days" },
      { metric: "↓ 89%", label: "Invoice-vs-PO discrepancies" },
      { metric: "2.1pts", label: "Gross margin improvement over 6 months" },
    ],
    forWho: ["COO", "Purchasing Director", "Pricing Analyst"],
    graphNodes: [
      { id: "supplier1", label: "Supplier A", x: 10, y: 20 },
      { id: "supplier2", label: "Supplier B", x: 10, y: 50, alert: true },
      { id: "supplier3", label: "Supplier C", x: 10, y: 78 },
      { id: "price", label: "Price Change +3.2%", x: 40, y: 38, alert: true },
      { id: "quotes", label: "14 Open Quotes", x: 68, y: 25 },
      { id: "margin", label: "Margin at Risk", x: 68, y: 60, alert: true },
      { id: "aztela", label: "Aztela Model", x: 40, y: 72 },
    ],
    graphEdges: [
      { from: "supplier2", to: "price", alert: true },
      { from: "price", to: "quotes", alert: true },
      { from: "price", to: "margin", alert: true },
      { from: "supplier1", to: "aztela" },
      { from: "supplier2", to: "aztela", alert: true },
      { from: "supplier3", to: "aztela" },
      { from: "aztela", to: "margin" },
    ],
    alertNode: "price",
  },
  {
    id: "delivery",
    area: "Delivery Intelligence",
    segment: "All Segments",
    color: "#c084fc",
    urgentProblem: "Sales quotes 3-week lead times. The line running that job is booked 5 weeks out. Promises are made on instinct, confirmed with a call to the floor, and broken when reality catches up. The customer absorbs the hit. This happens on multiple quotes every month.",
    howItWorks: "Aztela builds a live view of capacity, committed load, and open work order status that sales can access before quoting. Delivery promises are grounded in what the floor can actually deliver. When capacity tightens, risk flags surface automatically — before the commitment is made.",
    outcomes: [
      { metric: "↑ 91%", label: "Quote accuracy against actual delivery" },
      { metric: "Eliminated", label: "Late deliveries from capacity oversell" },
      { metric: "↓ 70%", label: "Customer escalations from missed dates" },
      { metric: "Real-time", label: "Capacity visibility for sales before every quote" },
    ],
    forWho: ["VP of Sales", "VP of Operations", "COO"],
    graphNodes: [
      { id: "sales", label: "Sales Quote", x: 15, y: 25 },
      { id: "capacity", label: "Live Capacity", x: 50, y: 20 },
      { id: "committed", label: "Committed Load", x: 82, y: 35 },
      { id: "workorders", label: "Open Work Orders", x: 50, y: 55 },
      { id: "risk", label: "Risk Flag", x: 15, y: 65, alert: true },
      { id: "customer", label: "Customer Commit", x: 80, y: 72 },
      { id: "aztela", label: "Aztela Model", x: 50, y: 80 },
    ],
    graphEdges: [
      { from: "sales", to: "capacity" },
      { from: "capacity", to: "committed" },
      { from: "workorders", to: "capacity" },
      { from: "aztela", to: "capacity" },
      { from: "aztela", to: "workorders" },
      { from: "capacity", to: "risk", alert: true },
      { from: "risk", to: "sales", alert: true },
      { from: "sales", to: "customer" },
    ],
    alertNode: "risk",
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
              Four operational failures. Each one costs you money every month.
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-2xl leading-relaxed mb-12" style={{ fontFamily: "var(--font-inter)" }}>
              We don't sell software categories. We eliminate specific failures — cascade blindness, inventory gaps, margin leakage, delivery misses — with a live intelligence layer built around your operation.
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

              {/* Header */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-sm tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-inter)", background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                  {s.segment}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 leading-tight" style={{ fontFamily: "var(--font-playfair)", color: s.color }}>
                {s.area}
              </h2>

              {/* Urgent problem */}
              <div className="mb-12 max-w-3xl">
                <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)", color: "var(--muted)" }}>
                  The Problem
                </p>
                <p className="text-[var(--off-white)] text-lg font-light leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  {s.urgentProblem}
                </p>
              </div>

              {/* How it works + graph */}
              <div className="grid md:grid-cols-2 gap-12 mb-14 items-start">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)", color: s.color }}>
                    How It Works
                  </p>
                  <p className="text-[var(--muted)] leading-relaxed text-sm mb-8" style={{ fontFamily: "var(--font-inter)" }}>
                    {s.howItWorks}
                  </p>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)", color: s.color }}>
                    Built For
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {s.forWho.map(r => (
                      <span key={r} className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] rounded-sm" style={{ fontFamily: "var(--font-inter)" }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live node graph */}
                <div className="border border-[var(--border)] p-6 rounded-sm" style={{ background: "rgba(77,128,255,0.02)" }}>
                  <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                    Live operational model
                  </p>
                  <OperationalGraph nodes={s.graphNodes} edges={s.graphEdges} alertNode={s.alertNode} />
                  <p className="text-[10px] text-[var(--muted)] mt-3" style={{ fontFamily: "var(--font-inter)" }}>
                    ● Red = detected signal &nbsp;·&nbsp; Orange = impacted nodes &nbsp;·&nbsp; Dashed = cascade path
                  </p>
                </div>
              </div>

              {/* Outcomes */}
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-inter)", color: s.color }}>
                  Measured Outcomes
                </p>
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
