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

export default function StockoutPredictorPage() {
  const [revenue,     setRevenue]     = useState(40);
  const [branches,    setBranches]    = useState(8);
  const [daysOnHand,  setDaysOnHand]  = useState(21);
  const [variability, setVariability] = useState(20);
  const [leadTime,    setLeadTime]    = useState(12);
  const [calculated,  setCalculated]  = useState(false);

  const revenueVal      = revenue * 1_000_000;
  const bufferDays      = Math.max(0, daysOnHand - leadTime);
  const vulnerabilityR  = Math.min(1, leadTime / Math.max(daysOnHand, 1));
  const atRiskPct       = Math.min(0.9, vulnerabilityR * (variability / 100) * 1.8);
  const criticalPct     = atRiskPct * 0.35;
  const warningPct      = atRiskPct * 0.45;

  const atRiskItems     = Math.round(branches * 18 * atRiskPct);
  const criticalItems   = Math.round(branches * 18 * criticalPct);
  const warningItems    = Math.round(branches * 18 * warningPct);
  const monitorItems    = atRiskItems - criticalItems - warningItems;
  const weeklyRevenue   = revenueVal / 52;
  const revenueAtRisk   = Math.round(weeklyRevenue * Math.min(atRiskPct * 0.55, 0.35));
  const annualImpact    = Math.round(revenueAtRisk * 52 * 0.42);

  const riskColor = criticalItems > branches * 3 ? "#f87171" : criticalItems > branches ? "#f59e0b" : "#4ade80";
  const riskLabel = criticalItems > branches * 3 ? "Critical" : criticalItems > branches ? "Elevated" : "Manageable";

  const SLIDERS = [
    { label: "Annual Revenue",               val: revenue,     set: setRevenue,     min: 5,  max: 250, display: `$${revenue}M`,      unit: "" },
    { label: "Number of branches",           val: branches,    set: setBranches,    min: 1,  max: 80,  display: String(branches),    unit: "" },
    { label: "Avg inventory days on hand",   val: daysOnHand,  set: setDaysOnHand,  min: 5,  max: 60,  display: `${daysOnHand} days`, unit: "" },
    { label: "Weekly demand variability",    val: variability, set: setVariability, min: 5,  max: 50,  display: `${variability}%`,    unit: "" },
    { label: "Supplier reorder lead time",   val: leadTime,    set: setLeadTime,    min: 2,  max: 45,  display: `${leadTime} days`,   unit: "" },
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
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Distributor Tool</p>
            <h1 className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}>
              Which branches will stockout in the next 14 days?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Input your network. See how many branch-SKU combinations are at risk — and how much revenue is sitting in the gap.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your network</h2>
                {SLIDERS.map(({ label, val, set, min, max, display }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{label}</label>
                      <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{display}</span>
                    </div>
                    <input type="range" min={min} max={max} value={val}
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
                  Predict Stockout Risk →
                </button>
                <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  Based on demand variability modelling and lead time buffer analysis across your branch network.
                </p>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>14-day risk picture</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded"
                    style={{ fontFamily: "var(--font-inter)", color: riskColor, background: `${riskColor}18`, border: `1px solid ${riskColor}40` }}>
                    {riskLabel}
                  </span>
                </div>

                {/* Buffer days indicator */}
                <div className="border border-[var(--border)] rounded-sm p-4 mb-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Current inventory buffer above lead time</p>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-inter)", color: bufferDays >= 7 ? "#4ade80" : bufferDays >= 3 ? "#f59e0b" : "#f87171" }}>
                    {bufferDays} days
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    {bufferDays < 3 ? "Critical — demand spike of any size hits customers directly" :
                     bufferDays < 7 ? "Thin — limited room to absorb variability" :
                     "Adequate — but monitor high-variability SKUs closely"}
                  </p>
                </div>

                {/* Risk breakdown */}
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Critical — stockout within 7 days",    count: criticalItems, color: "#f87171", pct: criticalPct },
                    { label: "Warning — stockout within 8–14 days",   count: warningItems,  color: "#f59e0b", pct: warningPct },
                    { label: "Monitor — 15–21 day risk",              count: monitorItems,  color: "#4d80ff", pct: atRiskPct - criticalPct - warningPct },
                  ].map(row => (
                    <div key={row.label} className="border border-[var(--border)] rounded-sm p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{row.label}</p>
                        <p className="text-sm font-bold" style={{ color: row.color, fontFamily: "var(--font-inter)" }}>{row.count} items</p>
                      </div>
                      <div className="w-full h-0.5 rounded-full bg-[var(--border)]">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: calculated ? `${Math.min(row.pct / atRiskPct * 100, 100)}%` : "0%", background: row.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-6" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Revenue at risk this week</p>
                      <p className="text-2xl font-bold text-red-400" style={{ fontFamily: "var(--font-inter)" }}>{fmt(revenueAtRisk)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Annual impact if pattern holds</p>
                      <p className="text-2xl font-bold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(annualImpact)}</p>
                    </div>
                  </div>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3.5 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    See Live Stockout Alerts in Your Network →
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
