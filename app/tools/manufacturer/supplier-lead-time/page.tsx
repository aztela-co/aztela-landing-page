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

function prng(seed: number) { return ((seed * 2654435761) >>> 0) / 4294967296; }

type RiskTier = "critical" | "watch" | "stable";

export default function SupplierLeadTimePage() {
  const [suppliers,     setSuppliers]     = useState(22);
  const [avgLeadDays,   setAvgLeadDays]   = useState(24);
  const [variability,   setVariability]   = useState(28);  // % coefficient of variation
  const [criticalPct,   setCriticalPct]   = useState(35);  // % single-source
  const [monthlySpend,  setMonthlySpend]  = useState(680); // $K
  const [stoppageCost,  setStoppageCost]  = useState(6500); // $/hr
  const [calculated,    setCalculated]    = useState(false);

  // Risk model
  const highRiskSuppliers  = Math.round(suppliers * (variability / 100) * (criticalPct / 100) * 2.2);
  const watchSuppliers     = Math.round(suppliers * (variability / 100) * 0.9);
  const stableSuppliers    = Math.max(0, suppliers - highRiskSuppliers - watchSuppliers);

  // Variability score (0–100, higher = worse)
  const rawScore = Math.min(100, (variability / 50) * 60 + (criticalPct / 100) * 25 + (highRiskSuppliers / Math.max(suppliers, 1)) * 15);
  const score    = Math.round(rawScore);
  const scoreColor = score >= 65 ? "#f87171" : score >= 40 ? "#f59e0b" : "#4ade80";
  const scoreLabel = score >= 65 ? "High Risk" : score >= 40 ? "Elevated" : "Controlled";

  // Financial exposure
  const dailySpend         = (monthlySpend * 1_000) / 30;
  const exposureDays       = avgLeadDays * (variability / 100) * 1.65; // 95th percentile slip
  const inventoryExposure  = dailySpend * exposureDays;
  const annualSlippages    = Math.round(highRiskSuppliers * 3.2); // avg slippages/yr per high-risk supplier
  const avgSlipHours       = avgLeadDays * 0.4 * 8; // convert days slip to production hours
  const annualStoppageCost = annualSlippages * avgSlipHours * stoppageCost;
  const totalExposure      = inventoryExposure + annualStoppageCost;

  // Supplier heat cards
  const supplierCards = useMemo(() => {
    return Array.from({ length: Math.min(suppliers, 14) }, (_, i) => {
      const r1 = prng(i * 5 + 1);
      const r2 = prng(i * 5 + 2);
      const r3 = prng(i * 5 + 3);
      const isSingleSource = r1 < criticalPct / 100;
      const slipDays = Math.round(avgLeadDays * (variability / 100) * r2 * 2);
      const spend = Math.round((monthlySpend / suppliers) * (0.5 + r3));
      let tier: RiskTier = "stable";
      if (isSingleSource && slipDays > avgLeadDays * 0.2) tier = "critical";
      else if (slipDays > avgLeadDays * 0.1 || isSingleSource) tier = "watch";
      return { id: i + 1, tier, isSingleSource, slipDays, spend };
    }).sort((a, b) => {
      const o: Record<RiskTier, number> = { critical: 0, watch: 1, stable: 2 };
      return o[a.tier] - o[b.tier];
    });
  }, [suppliers, criticalPct, variability, avgLeadDays, monthlySpend]);

  const tierStyle: Record<RiskTier, { bg: string; border: string; color: string; label: string }> = {
    critical: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.4)", color: "#f87171", label: "HIGH RISK" },
    watch:    { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.4)",  color: "#f59e0b", label: "WATCH" },
    stable:   { bg: "rgba(255,255,255,0.02)",border: "var(--border)",          color: "var(--muted)", label: "STABLE" },
  };

  const SLIDERS = [
    { label: "Active suppliers",                        val: suppliers,    set: setSuppliers,    min: 3,   max: 80,    step: 1,   disp: String(suppliers) },
    { label: "Average quoted lead time (days)",         val: avgLeadDays,  set: setAvgLeadDays,  min: 5,   max: 90,    step: 1,   disp: `${avgLeadDays}d` },
    { label: "Lead time variability (CV %)",            val: variability,  set: setVariability,  min: 5,   max: 60,    step: 1,   disp: `${variability}%` },
    { label: "% single-source components",              val: criticalPct,  set: setCriticalPct,  min: 5,   max: 90,    step: 5,   disp: `${criticalPct}%` },
    { label: "Monthly component spend ($K)",            val: monthlySpend, set: setMonthlySpend, min: 50,  max: 10000, step: 50,  disp: `$${monthlySpend}K` },
    { label: "Line stoppage cost per hour",             val: stoppageCost, set: setStoppageCost, min: 500, max: 20000, step: 100, disp: `$${stoppageCost.toLocaleString()}` },
  ];

  // Gauge arc
  const GAUGE_R = 54; const CX = 70; const CY = 70;
  const startAngle = Math.PI; const sweepAngle = Math.PI;
  const scoreAngle = startAngle + (score / 100) * sweepAngle;
  const needleX = CX + GAUGE_R * Math.cos(scoreAngle);
  const needleY = CY + GAUGE_R * Math.sin(scoreAngle);

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
              How much does supplier lead time variability actually cost you?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Quoted lead times are fiction. The real number is quoted lead time plus slip — and that slip is what stops your lines. Score your supplier network and see the exposure.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your supplier network</h2>

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
                  Score My Supplier Network →
                </button>

                {/* Live supplier heat list */}
                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
                      Supplier risk ranking
                    </p>
                    <span className="text-[10px] text-[var(--muted)] opacity-60" style={{ fontFamily: "var(--font-inter)" }}>
                      {suppliers} suppliers
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {supplierCards.map((s) => {
                      const st = tierStyle[s.tier];
                      return (
                        <div key={s.id}
                          className="flex items-center justify-between px-3 py-2 rounded-sm transition-all duration-300"
                          style={{ background: st.bg, border: `1px solid ${st.border}` }}>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-bold" style={{ color: st.color, fontFamily: "var(--font-inter)" }}>{st.label}</span>
                            <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>SUP-{String(s.id).padStart(2, "0")}</span>
                            {s.isSingleSource && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", fontFamily: "var(--font-inter)" }}>SINGLE</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>±{s.slipDays}d slip</span>
                            <span className="text-xs font-semibold" style={{ color: st.color, fontFamily: "var(--font-inter)" }}>${s.spend}K/mo</span>
                          </div>
                        </div>
                      );
                    })}
                    {suppliers > 14 && (
                      <p className="text-[10px] text-[var(--muted)] text-center pt-1" style={{ fontFamily: "var(--font-inter)" }}>
                        +{suppliers - 14} more suppliers scored below
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Lead time variability score</h2>

                {/* Gauge */}
                <div className="border border-[var(--border)] rounded-sm p-6 mb-4 flex items-center gap-8" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <svg viewBox="0 0 140 80" width={140} height={80}>
                    {/* Background arc */}
                    <path d="M 16 70 A 54 54 0 0 1 124 70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} strokeLinecap="round" />
                    {/* Green zone */}
                    <path d="M 16 70 A 54 54 0 0 1 54 22" fill="none" stroke="rgba(74,222,128,0.3)" strokeWidth={10} strokeLinecap="round" />
                    {/* Yellow zone */}
                    <path d="M 54 22 A 54 54 0 0 1 96 22" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth={10} strokeLinecap="round" />
                    {/* Red zone */}
                    <path d="M 96 22 A 54 54 0 0 1 124 70" fill="none" stroke="rgba(248,113,113,0.3)" strokeWidth={10} strokeLinecap="round" />
                    {/* Needle */}
                    <line x1={CX} y1={CY} x2={needleX} y2={needleY} stroke={scoreColor} strokeWidth={2.5} strokeLinecap="round" />
                    <circle cx={CX} cy={CY} r={4} fill={scoreColor} />
                    {/* Score text */}
                    <text x={CX} y={CY + 18} textAnchor="middle" fontSize={18} fontWeight="bold" fill={scoreColor} style={{ fontFamily: "var(--font-inter)" }}>{score}</text>
                    <text x={CX} y={CY + 30} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.4)" style={{ fontFamily: "var(--font-inter)" }}>/ 100</text>
                  </svg>
                  <div>
                    <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Variability Score</p>
                    <p className="text-2xl font-bold mb-1" style={{ color: scoreColor, fontFamily: "var(--font-inter)" }}>{scoreLabel}</p>
                    <div className="flex gap-3 text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
                      <span style={{ color: "#f87171" }}>● {highRiskSuppliers} high risk</span>
                      <span style={{ color: "#f59e0b" }}>● {watchSuppliers} watch</span>
                      <span style={{ color: "#4ade80" }}>● {stableSuppliers} stable</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "95th-percentile lead time slip (days)",              value: `${Math.round(exposureDays)}d`,  sub: `${variability}% CV × ${avgLeadDays}d quoted LT × 1.65 z-score`,                                          color: "#f87171" },
                    { label: "Inventory exposure from timing uncertainty",          value: fmt(inventoryExposure),          sub: `${((inventoryExposure / (monthlySpend * 1000)) * 100).toFixed(0)}% of monthly spend held as timing buffer`, color: "#f59e0b" },
                    { label: `Expected line stoppages/yr from supplier slip — ${annualSlippages} events`, value: fmt(annualStoppageCost), sub: `${((annualStoppageCost / (monthlySpend * 12 * 1000)) * 100).toFixed(1)}% of annual component spend lost to slip`, color: "#f87171" },
                    { label: "Total annual exposure (inventory + stoppages)",       value: fmt(totalExposure),              sub: `${highRiskSuppliers} of ${suppliers} suppliers driving ${((highRiskSuppliers / Math.max(suppliers, 1)) * 100).toFixed(0)}% of risk`, color: "var(--off-white)" },
                  ].map(row => (
                    <div key={row.label} className="border border-[var(--border)] rounded-sm p-4 flex justify-between items-start">
                      <p className="text-sm text-[var(--muted)] pr-4" style={{ fontFamily: "var(--font-inter)" }}>{row.label}</p>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: row.color, fontFamily: "var(--font-inter)" }}>{row.value}</p>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5 max-w-[180px]" style={{ fontFamily: "var(--font-inter)" }}>{row.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* High-risk breakdown */}
                <div className="border border-[var(--border)] rounded-sm p-5 mb-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)" }}>
                    Network composition
                  </p>
                  {[
                    { label: "High-risk (single-source + high slip)", count: highRiskSuppliers, total: suppliers, color: "#f87171" },
                    { label: "Watch (elevated slip or single-source)",  count: watchSuppliers,  total: suppliers, color: "#f59e0b" },
                    { label: "Stable (multi-source, low variability)",  count: stableSuppliers, total: suppliers, color: "#4ade80" },
                  ].map(b => (
                    <div key={b.label} className="mb-2.5">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{b.label}</span>
                        <span className="text-xs font-bold" style={{ color: b.color, fontFamily: "var(--font-inter)" }}>{b.count} / {b.total}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(b.count / Math.max(b.total, 1)) * 100}%`, background: b.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--off-white)] mb-1 font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela tracks actual vs. quoted lead time — per supplier, per component.
                  </p>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    When a supplier starts slipping, you know before the shortage hits your line — not after. Score updates daily so your safety stock targets stay calibrated to real variability, not guesses.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    Get a Free Supplier Risk Assessment →
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
