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

export default function SafetyStockROIPage() {
  const [components,    setComponents]    = useState(12);
  const [monthlySpend,  setMonthlySpend]  = useState(180);  // $K
  const [leadTime,      setLeadTime]      = useState(28);   // days
  const [variability,   setVariability]   = useState(22);   // %
  const [stoppageCost,  setStoppageCost]  = useState(4200); // $/hr
  const [stoppageHrs,   setStoppageHrs]   = useState(6);    // hrs
  const [calculated,    setCalculated]    = useState(false);

  const monthlySpendVal   = monthlySpend * 1_000;
  const dailySpend        = monthlySpendVal / 30;

  // Safety stock needed — based on lead time variability at 95% service level (z=1.65)
  const safetyStockDays   = leadTime * (variability / 100) * 1.65;
  const safetyStockValue  = dailySpend * safetyStockDays;
  const annualCarryCost   = safetyStockValue * 0.22; // 22% annual carrying rate

  // Stoppages without buffer
  const annualStoppages   = Math.round(components * (variability / 100) * 0.9);
  const annualStoppageCost = annualStoppages * stoppageHrs * stoppageCost;

  // ROI
  const netAnnualSaving   = annualStoppageCost - annualCarryCost;
  const roi               = annualCarryCost > 0 ? (netAnnualSaving / annualCarryCost) : 0;
  const paybackMonths     = annualStoppageCost > 0 ? Math.ceil((annualCarryCost / annualStoppageCost) * 12) : 12;

  const roiColor = roi >= 3 ? "#4ade80" : roi >= 1 ? "#f59e0b" : "#f87171";

  // Break-even visual — compare two bars
  const maxBar = Math.max(annualStoppageCost, annualCarryCost, 1);

  const SLIDERS = [
    { label: "Single-source components to protect",   val: components,   set: setComponents,   min: 1,   max: 50,    step: 1,   disp: String(components) },
    { label: "Monthly spend on these components ($K)", val: monthlySpend, set: setMonthlySpend, min: 10,  max: 2000,  step: 10,  disp: `$${monthlySpend}K` },
    { label: "Average supplier lead time (days)",      val: leadTime,     set: setLeadTime,     min: 5,   max: 90,    step: 1,   disp: `${leadTime}d` },
    { label: "Lead time variability",                  val: variability,  set: setVariability,  min: 5,   max: 50,    step: 1,   disp: `${variability}%` },
    { label: "Line stoppage cost per hour",            val: stoppageCost, set: setStoppageCost, min: 500, max: 12000, step: 100, disp: `$${stoppageCost.toLocaleString()}` },
    { label: "Average stoppage duration (hours)",      val: stoppageHrs,  set: setStoppageHrs,  min: 1,   max: 24,    step: 1,   disp: `${stoppageHrs}h` },
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
              Is carrying safety stock cheaper than the stoppages it prevents?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Most manufacturers know they should buffer critical components. Few have run the actual number. Calculate your break-even — carrying cost vs. stoppage risk.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your component profile</h2>

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
                  Calculate Safety Stock ROI →
                </button>

                {/* Live break-even bars */}
                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                    Carrying cost vs. stoppage risk
                  </p>
                  {[
                    { label: "Annual stoppage cost (no buffer)", value: annualStoppageCost, color: "#f87171" },
                    { label: "Annual carrying cost (with buffer)", value: annualCarryCost, color: "#4d80ff" },
                  ].map(bar => (
                    <div key={bar.label} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{bar.label}</span>
                        <span className="text-xs font-bold" style={{ color: bar.color, fontFamily: "var(--font-inter)" }}>{fmt(bar.value)}</span>
                      </div>
                      <div className="w-full h-3 rounded-sm bg-[var(--border)] overflow-hidden">
                        <div className="h-full rounded-sm transition-all duration-500"
                          style={{ width: `${(bar.value / maxBar) * 100}%`, background: bar.color }} />
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-[var(--muted)] mt-2" style={{ fontFamily: "var(--font-inter)" }}>
                    Buffer is worth it when the blue bar is shorter than the red bar.
                  </p>
                </div>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Safety stock ROI</h2>

                {/* ROI headline */}
                <div className="border border-[var(--border)] rounded-sm p-6 mb-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>ROI</p>
                      <p className="text-3xl font-bold" style={{ color: roiColor, fontFamily: "var(--font-inter)" }}>{roi.toFixed(1)}x</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Payback</p>
                      <p className="text-3xl font-bold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{paybackMonths}mo</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Net saving</p>
                      <p className="text-3xl font-bold text-[#4ade80]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(Math.max(netAnnualSaving, 0))}</p>
                    </div>
                  </div>

                  {/* Payback timeline */}
                  <p className="text-xs text-[var(--muted)] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Cumulative savings vs. carrying cost</p>
                  <div className="relative h-3 rounded-sm overflow-hidden bg-[var(--border)]">
                    <div className="absolute left-0 top-0 h-full rounded-sm transition-all duration-700"
                      style={{ width: `${Math.min((paybackMonths / 12) * 100, 100)}%`, background: "rgba(77,128,255,0.4)" }} />
                    <div className="absolute left-0 top-0 h-full rounded-sm transition-all duration-700"
                      style={{ width: `${Math.min((paybackMonths / 12) * 100 * 0.3, 100)}%`, background: "var(--coral)" }} />
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    Carrying cost recovered in {paybackMonths} month{paybackMonths !== 1 ? "s" : ""} — stoppages avoided every month after
                  </p>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "Safety stock value to hold",                  value: safetyStockValue,    color: "#4d80ff" },
                    { label: "Annual carrying cost of that buffer",          value: annualCarryCost,     color: "#4d80ff" },
                    { label: `Expected stoppages/yr without buffer — ${annualStoppages} events`, value: annualStoppageCost, color: "#f87171" },
                    { label: "Net annual saving (stoppages avoided − carry)", value: Math.max(netAnnualSaving, 0), color: "#4ade80" },
                  ].map(row => (
                    <div key={row.label} className="border border-[var(--border)] rounded-sm p-4 flex justify-between items-center">
                      <p className="text-sm text-[var(--muted)] pr-4" style={{ fontFamily: "var(--font-inter)" }}>{row.label}</p>
                      <p className="text-sm font-bold shrink-0" style={{ color: row.color, fontFamily: "var(--font-inter)" }}>{fmt(row.value)}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--off-white)] mb-1 font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela tells you exactly which components need a buffer — and by how much.
                  </p>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Live lead time monitoring surfaces variability per supplier before it hits your buffer — so you're not over-stocking everything, just the components that actually need it.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    Get a Free Component Risk Assessment →
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
