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

export default function ExpeditePaybackPage() {
  const [monthlyExpedite, setMonthlyExpedite] = useState(55);   // $K
  const [avoidablePct,    setAvoidablePct]    = useState(55);   // %
  const [revenue,         setRevenue]         = useState(85);   // $M
  const [leadDays,        setLeadDays]        = useState(10);   // days advance notice
  const [calculated,      setCalculated]      = useState(false);

  const annualExpedite      = monthlyExpedite * 12 * 1_000;
  const avoidableAnnual     = annualExpedite * (avoidablePct / 100);
  // Additional procurement efficiency: earlier visibility = better rates
  const procSavings         = revenue * 1_000_000 * 0.003 * (leadDays / 14);
  const totalAnnualSavings  = avoidableAnnual + procSavings;
  const paybackMonths       = Math.ceil(Math.max(annualExpedite / totalAnnualSavings, 0.5) * 12 / 12 * 1.5);
  // Show month-by-month cumulative savings for first 12 months
  const monthlySaving       = totalAnnualSavings / 12;
  const breakEvenMonth      = Math.ceil(annualExpedite * 0.08 / monthlySaving); // rough Aztela cost proxy = 8% of annual expedite

  const SLIDERS = [
    { label: "Monthly expedite freight spend",        val: monthlyExpedite, set: setMonthlyExpedite, min: 5,   max: 500,  step: 5,  disp: `$${monthlyExpedite}K` },
    { label: "% of expedite that is avoidable",       val: avoidablePct,    set: setAvoidablePct,    min: 20,  max: 85,   step: 5,  disp: `${avoidablePct}%` },
    { label: "Annual Revenue",                        val: revenue,         set: setRevenue,         min: 20,  max: 750,  step: 5,  disp: `$${revenue}M` },
    { label: "Advance notice Aztela provides (days)", val: leadDays,        set: setLeadDays,        min: 3,   max: 21,   step: 1,  disp: `${leadDays}d` },
  ];

  // Month-by-month savings for visual
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    cumSaving: monthlySaving * (i + 1),
    isBreakEven: i + 1 === breakEvenMonth,
  }));
  const maxSaving = monthlySaving * 12;

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
              How many months of avoided expedite before Aztela pays for itself?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Most of your expedite freight spend is a tax on late visibility. Calculate how much is avoidable — and how fast the savings stack up.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your expedite profile</h2>

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
                  Calculate Expedite Payback →
                </button>

                {/* Live savings timeline — always visible */}
                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
                      Monthly savings accumulation
                    </p>
                    <span className="text-[10px] text-[#4ade80] font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
                      {fmt(totalAnnualSavings)}/yr recoverable
                    </span>
                  </div>

                  <div className="flex items-end gap-1" style={{ height: 60 }}>
                    {months.map(m => (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-sm transition-all duration-300 relative"
                          style={{
                            height: `${(m.cumSaving / maxSaving) * 52}px`,
                            background: m.isBreakEven ? "#4ade80" : m.month <= breakEvenMonth ? "rgba(77,128,255,0.5)" : "rgba(74,222,128,0.4)",
                            border: m.isBreakEven ? "1px solid #4ade80" : "none",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    <span>Mo 1</span>
                    {breakEvenMonth <= 12 && (
                      <span style={{ color: "#4ade80" }}>Break-even mo {breakEvenMonth}</span>
                    )}
                    <span>Mo 12</span>
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Expedite payback analysis</h2>

                {/* Key metrics */}
                <div className="border border-[var(--border)] rounded-sm p-6 mb-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Annual expedite</p>
                      <p className="text-2xl font-bold text-red-400" style={{ fontFamily: "var(--font-inter)" }}>{fmt(annualExpedite)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Recoverable</p>
                      <p className="text-2xl font-bold text-[#f59e0b]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(avoidableAnnual)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Break-even</p>
                      <p className="text-2xl font-bold text-[#4ade80]" style={{ fontFamily: "var(--font-inter)" }}>{breakEvenMonth}mo</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "Annual expedite freight spend",                    value: annualExpedite,      sub: `${((annualExpedite / (revenue * 1_000_000)) * 100).toFixed(2)}% of revenue — a hidden P&L tax`,    color: "#f87171" },
                    { label: `Avoidable with ${leadDays}-day advance visibility`, value: avoidableAnnual,    sub: `${avoidablePct}% of expedite is a tax on late data, not logistics cost`,                            color: "#f59e0b" },
                    { label: "Procurement efficiency savings (better lead time)", value: procSavings,         sub: "better advance notice → standard rates instead of emergency premium",                               color: "#4d80ff" },
                    { label: "Total annual recoverable",                          value: totalAnnualSavings,  sub: `${((totalAnnualSavings / annualExpedite) * 100).toFixed(0)}% of current expedite spend recoverable`, color: "#4ade80" },
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
                    {avoidablePct}% of your expedite spend is a tax on late data.
                  </p>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela surfaces component shortage risk {leadDays}+ days ahead — enough time to source at standard rates instead of emergency premium. Most clients eliminate expedite freight as a line item within 6 months.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    See How Fast Aztela Pays for Itself →
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
