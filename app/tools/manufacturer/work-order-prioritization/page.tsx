"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

// Deterministic pseudo-random
function prng(seed: number) { return ((seed * 2654435761) >>> 0) / 4294967296; }

type WOPriority = "critical" | "high" | "standard";

export default function WorkOrderPrioritizationPage() {
  const [workOrders,    setWorkOrders]    = useState(160);
  const [shortPct,      setShortPct]      = useState(30);   // % WOs affected by short components
  const [mtoPct,        setMtoPct]        = useState(60);   // % make-to-order
  const [avgOrderVal,   setAvgOrderVal]   = useState(40);   // $K
  const [penaltyPct,    setPenaltyPct]    = useState(5);    // % late penalty
  const [margin,        setMargin]        = useState(18);   // %
  const [calculated,    setCalculated]    = useState(false);

  const affectedWOs     = Math.round(workOrders * (shortPct / 100));
  const mtoAffected     = Math.round(affectedWOs * (mtoPct / 100));
  const revenueInPlay   = mtoAffected * avgOrderVal * 1_000;

  // Without intelligent prioritization: ~45% of MTO WOs go late
  const lateWithout     = Math.round(mtoAffected * 0.45);
  const penaltyWithout  = lateWithout * avgOrderVal * 1_000 * (penaltyPct / 100);
  const marginLostWithout = lateWithout * avgOrderVal * 1_000 * (margin / 100);

  // With Aztela prioritization: ~8% late (only unavoidable delays)
  const lateWith        = Math.round(mtoAffected * 0.08);
  const penaltyWith     = lateWith * avgOrderVal * 1_000 * (penaltyPct / 100);
  const marginSavedWith = (lateWithout - lateWith) * avgOrderVal * 1_000 * (margin / 100);

  const penaltySaving   = penaltyWithout - penaltyWith;
  const totalBenefit    = penaltySaving + marginSavedWith;

  // Priority bands for visual WO cards
  const woCards = useMemo(() => {
    return Array.from({ length: Math.min(affectedWOs, 16) }, (_, i) => {
      const r1 = prng(i * 3 + 1);
      const r2 = prng(i * 3 + 2);
      const isMTO = r1 < mtoPct / 100;
      const isHighVal = r2 > 0.6;
      let priority: WOPriority = "standard";
      if (isMTO && isHighVal) priority = "critical";
      else if (isMTO || isHighVal) priority = "high";
      const valMultiplier = priority === "critical" ? 1.4 : priority === "high" ? 1.0 : 0.6;
      return {
        id: i + 1,
        priority,
        value: Math.round(avgOrderVal * valMultiplier),
        isMTO,
      };
    }).sort((a, b) => {
      const order: Record<WOPriority, number> = { critical: 0, high: 1, standard: 2 };
      return order[a.priority] - order[b.priority];
    });
  }, [affectedWOs, mtoPct, avgOrderVal]);

  const priorityStyle: Record<WOPriority, { bg: string; border: string; color: string; label: string }> = {
    critical: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.4)", color: "#f87171", label: "CRITICAL" },
    high:     { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.4)",  color: "#f59e0b", label: "HIGH" },
    standard: { bg: "rgba(255,255,255,0.02)",border: "var(--border)",          color: "var(--muted)", label: "STD" },
  };

  const SLIDERS = [
    { label: "Active work orders",                    val: workOrders,  set: setWorkOrders,  min: 20,  max: 2000, step: 10, disp: String(workOrders) },
    { label: "% WOs affected by component shortage",  val: shortPct,    set: setShortPct,    min: 5,   max: 70,  step: 5,  disp: `${shortPct}%` },
    { label: "% production make-to-order (MTO)",      val: mtoPct,      set: setMtoPct,      min: 10,  max: 90,  step: 5,  disp: `${mtoPct}%` },
    { label: "Average order value ($K)",              val: avgOrderVal, set: setAvgOrderVal, min: 5,   max: 500, step: 5,  disp: `$${avgOrderVal}K` },
    { label: "Late delivery penalty (% of order)",    val: penaltyPct,  set: setPenaltyPct,  min: 1,   max: 15,  step: 0.5,disp: `${penaltyPct}%` },
    { label: "Average gross margin",                  val: margin,      set: setMargin,      min: 5,   max: 45,  step: 1,  disp: `${margin}%` },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16">

        <section className="px-6 py-16 md:py-24 grid-bg">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/tools" className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
              ← Back to tools
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Manufacturer Tool</p>
            <h1 className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}>
              When components are short, which work orders do you run first?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Random sequencing when stock is short burns margin and breaks delivery commitments. Calculate the cost of getting the order wrong — and the value of getting it right.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your production mix</h2>

                {SLIDERS.map(({ label, val, set, min, max, step, disp }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{label}</label>
                      <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{disp}</span>
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
                  Calculate Prioritization Value →
                </button>

                {/* Live WO priority stack */}
                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
                      Intelligently ranked work orders
                    </p>
                    <span className="text-[10px] text-[var(--muted)] opacity-60" style={{ fontFamily: "var(--font-inter)" }}>
                      {affectedWOs} affected
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {woCards.map((wo, i) => {
                      const s = priorityStyle[wo.priority];
                      return (
                        <div key={wo.id}
                          className="flex items-center justify-between px-3 py-2 rounded-sm transition-all duration-300"
                          style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-bold" style={{ color: s.color, fontFamily: "var(--font-inter)" }}>{s.label}</span>
                            <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>WO-{String(wo.id).padStart(3, "0")}</span>
                            {wo.isMTO && <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: "rgba(77,128,255,0.15)", color: "#4d80ff", fontFamily: "var(--font-inter)" }}>MTO</span>}
                          </div>
                          <span className="text-xs font-semibold" style={{ color: s.color, fontFamily: "var(--font-inter)" }}>${wo.value}K</span>
                        </div>
                      );
                    })}
                    {affectedWOs > 16 && (
                      <p className="text-[10px] text-[var(--muted)] text-center pt-1" style={{ fontFamily: "var(--font-inter)" }}>
                        +{affectedWOs - 16} more work orders ranked below
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Cost of wrong sequencing</h2>

                {/* Before / after */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    {
                      label: "Without prioritization",
                      late: lateWithout,
                      penalty: penaltyWithout,
                      marginLost: marginLostWithout,
                      color: "#f87171",
                      bad: true,
                    },
                    {
                      label: "With Aztela intelligence",
                      late: lateWith,
                      penalty: penaltyWith,
                      marginLost: marginLostWithout - marginSavedWith,
                      color: "#4ade80",
                      bad: false,
                    },
                  ].map(col => (
                    <div key={col.label} className="border border-[var(--border)] rounded-sm p-4"
                      style={{ borderColor: col.bad ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.3)", background: col.bad ? "rgba(248,113,113,0.04)" : "rgba(74,222,128,0.04)" }}>
                      <p className="text-[9px] font-semibold uppercase tracking-widest mb-3" style={{ color: col.color, fontFamily: "var(--font-inter)" }}>{col.label}</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>Late deliveries</p>
                          <p className="text-lg font-bold" style={{ color: col.color, fontFamily: "var(--font-inter)" }}>{col.late} WOs</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>Penalty cost</p>
                          <p className="text-sm font-bold" style={{ color: col.color, fontFamily: "var(--font-inter)" }}>{fmt(col.penalty)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "Revenue in affected MTO work orders",           value: revenueInPlay,   sub: `${mtoAffected} MTO WOs × $${avgOrderVal}K avg`,                                                                    color: "var(--off-white)" },
                    { label: "Penalty saved by intelligent sequencing",        value: penaltySaving,   sub: `${lateWithout - lateWith} fewer late WOs — from ${lateWithout} to ${lateWith}`,                                     color: "#4ade80" },
                    { label: "Margin protected by running right orders first", value: marginSavedWith, sub: `${((marginSavedWith / revenueInPlay) * 100).toFixed(1)}% of MTO revenue protected`,                                  color: "#4ade80" },
                    { label: "Total value of intelligent prioritization",      value: totalBenefit,    sub: `${((totalBenefit / revenueInPlay) * 100).toFixed(1)}% return on affected pipeline`,                                  color: "#4ade80" },
                  ].map(row => (
                    <div key={row.label} className="border border-[var(--border)] rounded-sm p-4 flex justify-between items-start">
                      <p className="text-sm text-[var(--muted)] pr-4" style={{ fontFamily: "var(--font-inter)" }}>{row.label}</p>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: row.color, fontFamily: "var(--font-inter)" }}>{fmt(row.value)}</p>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5 max-w-[180px]" style={{ fontFamily: "var(--font-inter)" }}>{row.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--off-white)] mb-1 font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela ranks work orders by margin, delivery commitment, and penalty exposure — automatically.
                  </p>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    When components are short, your team sees exactly which orders to run first — no spreadsheet, no guessing. Aligned to Eaton's production intelligence model.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    See Intelligent Prioritization in Action →
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
