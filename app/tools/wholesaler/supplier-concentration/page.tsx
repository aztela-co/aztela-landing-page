"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

export default function SupplierConcentrationPage() {
  const [revenue,    setRevenue]    = useState(95);
  const [sup1Pct,    setSup1Pct]    = useState(32);
  const [sup2Pct,    setSup2Pct]    = useState(20);
  const [sup3Pct,    setSup3Pct]    = useState(13);
  const [margin,     setMargin]     = useState(16);
  const [calculated, setCalculated] = useState(false);

  const revenueVal      = revenue * 1_000_000;
  const top3Pct         = Math.min(sup1Pct + sup2Pct + sup3Pct, 100);
  const sup1Rev         = revenueVal * (sup1Pct / 100);
  const sup2Rev         = revenueVal * (sup2Pct / 100);
  const sup3Rev         = revenueVal * (sup3Pct / 100);
  const top3Rev         = sup1Rev + sup2Rev + sup3Rev;

  // If top supplier disrupted 30 days: ~25% of their revenue lost
  const sup1Disruption  = sup1Rev * 0.25;
  // Margin impact: you still have fixed costs, revenue drops
  const marginOnSup1    = sup1Rev * (margin / 100);
  // Score: 0–10
  const score           = Math.min(10, (top3Pct / 10) * 1.1);
  const riskLabel       = top3Pct < 30 ? "Diversified" : top3Pct < 50 ? "Moderate" : top3Pct < 70 ? "Elevated" : "Critical";
  const riskColor       = top3Pct < 30 ? "#4ade80" : top3Pct < 50 ? "#4d80ff" : top3Pct < 70 ? "#f59e0b" : "#f87171";

  // Pricing leverage: high concentration = supplier can push price increases
  const pricingLeverage = Math.round(sup1Rev * 0.04); // 4% price increase impact if they push it

  const SLIDERS = [
    { label: "Annual Revenue",                val: revenue, set: setRevenue, min: 20, max: 500, step: 5,  display: `$${revenue}M` },
    { label: "Top supplier — % of revenue",   val: sup1Pct, set: setSup1Pct, min: 5,  max: 80,  step: 1,  display: `${sup1Pct}%` },
    { label: "2nd supplier — % of revenue",   val: sup2Pct, set: setSup2Pct, min: 1,  max: 60,  step: 1,  display: `${sup2Pct}%` },
    { label: "3rd supplier — % of revenue",   val: sup3Pct, set: setSup3Pct, min: 1,  max: 40,  step: 1,  display: `${sup3Pct}%` },
    { label: "Average gross margin",           val: margin,  set: setMargin,  min: 5,  max: 45,  step: 1,  display: `${margin}%` },
  ];

  const pct = (score / 10) * 100;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="px-6 py-16 md:py-24 grid-bg">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/tools" className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
              ← Back to tools
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Wholesaler Tool</p>
            <h1 className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}>
              How exposed is your business to your top 3 suppliers?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Supplier concentration isn't just a supply risk — it's a pricing and margin risk. Calculate your exposure and what a single disruption costs you.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your supplier mix</h2>
                {SLIDERS.map(({ label, val, set, min, max, step, display }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{label}</label>
                      <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{display}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={val}
                      onChange={e => { set(+e.target.value); setCalculated(false); }}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, var(--coral) ${(val - min) / (max - min) * 100}%, var(--border) 0%)` }} />
                    <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                      <span>{min}</span><span>{max}</span>
                    </div>
                  </div>
                ))}
                <button onClick={() => setCalculated(true)}
                  className="w-full py-4 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all hover:translate-y-[-1px] rounded-sm"
                  style={{ fontFamily: "var(--font-inter)" }}>
                  Score My Concentration Risk →
                </button>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Concentration risk profile</h2>

                {/* Score gauge */}
                <div className="border border-[var(--border)] rounded-sm p-6 mb-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>Concentration Score</p>
                      <p className="text-5xl font-bold" style={{ color: riskColor, fontFamily: "var(--font-inter)" }}>
                        {score.toFixed(1)}<span className="text-2xl text-[var(--muted)]">/10</span>
                      </p>
                    </div>
                    <span className="text-sm font-semibold px-3 py-1.5 rounded"
                      style={{ fontFamily: "var(--font-inter)", color: riskColor, background: `${riskColor}15`, border: `1px solid ${riskColor}40` }}>
                      {riskLabel}
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full overflow-hidden mb-2"
                    style={{ background: "linear-gradient(to right, #4ade80 0%, #f59e0b 40%, #f87171 100%)" }}>
                    <div className="absolute top-0 left-0 h-full rounded-full bg-[var(--charcoal)] transition-all duration-700" style={{ left: `${pct}%`, right: 0 }} />
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 transition-all duration-700"
                      style={{ left: `${pct}%`, borderColor: riskColor }} />
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-3" style={{ fontFamily: "var(--font-inter)" }}>
                    Your top 3 suppliers account for <span style={{ color: riskColor }}>{top3Pct}%</span> of revenue — {fmt(top3Rev)}/yr.
                  </p>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "Revenue at risk if top supplier disrupted 30 days", value: sup1Disruption,  sub: `${((sup1Disruption / revenueVal) * 100).toFixed(1)}% of annual revenue`,      color: "#f87171" },
                    { label: "Margin at risk from top supplier alone",            value: marginOnSup1,    sub: `${sup1Pct}% supplier × ${margin}% margin = concentrated P&L exposure`,        color: "#f87171" },
                    { label: "Impact if top supplier raises prices 4%",           value: pricingLeverage, sub: `${((pricingLeverage / (revenueVal * margin / 100)) * 100).toFixed(0)}% of gross margin wiped by one price move`, color: "#f59e0b" },
                  ].map(row => (
                    <div key={row.label} className="border border-[var(--border)] rounded-sm p-4 flex justify-between items-start">
                      <p className="text-sm text-[var(--muted)] pr-4" style={{ fontFamily: "var(--font-inter)" }}>{row.label}</p>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: row.color, fontFamily: "var(--font-inter)" }}>{fmt(row.value)}</p>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>{row.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela monitors supplier performance and price movements in real time — so concentration risk is visible before it becomes a P&L event.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    Get a Free Supplier Risk Review →
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
