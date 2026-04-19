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

export default function StaleQuotePage() {
  const [openQuotes,    setOpenQuotes]    = useState(120);
  const [avgQuoteVal,   setAvgQuoteVal]   = useState(28);
  const [avgAge,        setAvgAge]        = useState(18);
  const [priceMovement, setPriceMovement] = useState(2.4);
  const [repricePct,    setRepricePct]    = useState(40);
  const [margin,        setMargin]        = useState(18);
  const [calculated,    setCalculated]    = useState(false);

  const totalQuoteValue    = openQuotes * avgQuoteVal * 1_000;
  const dailyPriceMove     = (priceMovement / 100) / 30;
  const totalErosion       = totalQuoteValue * dailyPriceMove * avgAge;
  const recoverableErosion = totalErosion * (repricePct / 100);
  const absorbedLoss       = totalErosion * (1 - repricePct / 100);
  const marginBeforeErosion = totalQuoteValue * (margin / 100);
  const effectiveMargin    = ((marginBeforeErosion - absorbedLoss) / totalQuoteValue) * 100;
  const annualizedErosion  = totalErosion * (365 / Math.max(avgAge, 1)) * 0.3;

  const severity = absorbedLoss > totalQuoteValue * 0.04 ? "Critical" : absorbedLoss > totalQuoteValue * 0.02 ? "Elevated" : "Manageable";
  const severityColor = severity === "Critical" ? "#f87171" : severity === "Elevated" ? "#f59e0b" : "#4ade80";

  const SLIDERS = [
    { label: "Open quotes right now",              val: openQuotes,    set: setOpenQuotes,    min: 5,   max: 500,  step: 5,   display: String(openQuotes) },
    { label: "Average quote value ($K)",           val: avgQuoteVal,   set: setAvgQuoteVal,   min: 1,   max: 500,  step: 1,   display: `$${avgQuoteVal}K` },
    { label: "Average quote age (days)",           val: avgAge,        set: setAvgAge,        min: 1,   max: 60,   step: 1,   display: `${avgAge} days` },
    { label: "Supplier price movement / month",    val: priceMovement, set: setPriceMovement, min: 0.5, max: 8,    step: 0.1, display: `${priceMovement}%` },
    { label: "% of quotes you can still reprice",  val: repricePct,    set: setRepricePct,    min: 0,   max: 100,  step: 5,   display: `${repricePct}%` },
    { label: "Target margin on these quotes",      val: margin,        set: setMargin,        min: 5,   max: 50,   step: 1,   display: `${margin}%` },
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
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Wholesaler Tool</p>
            <h1 className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}>
              How much margin have you already given away on open quotes?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Every day a quote sits open while supplier costs move, your margin shrinks. Calculate how much is already gone — and how much you can still recover.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your quoting pipeline</h2>
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
                  Calculate Margin Leak →
                </button>
                <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  Based on supplier price movement compounding against open quote age. Conservative — assumes linear price movement.
                </p>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your margin leak</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded"
                    style={{ fontFamily: "var(--font-inter)", color: severityColor, background: `${severityColor}18`, border: `1px solid ${severityColor}40` }}>
                    {severity}
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "Total open quote value",           value: totalQuoteValue,    color: "var(--off-white)" },
                    { label: "Margin already eroded by cost drift", value: totalErosion,    color: "#f87171" },
                    { label: "Recoverable by repricing now",     value: recoverableErosion, color: "#f59e0b" },
                    { label: "Margin you'll absorb (can't reprice)", value: absorbedLoss,   color: "#f87171" },
                  ].map(row => (
                    <div key={row.label} className="border border-[var(--border)] rounded-sm p-4 flex justify-between items-center">
                      <p className="text-sm text-[var(--muted)] pr-4" style={{ fontFamily: "var(--font-inter)" }}>{row.label}</p>
                      <p className="text-sm font-bold shrink-0" style={{ color: row.color, fontFamily: "var(--font-inter)" }}>{fmt(row.value)}</p>
                    </div>
                  ))}
                </div>

                {/* Effective margin comparison */}
                <div className="border border-[var(--border)] rounded-sm p-5 mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs text-[var(--muted)] mb-3" style={{ fontFamily: "var(--font-inter)" }}>Effective margin on close</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--muted)] opacity-60 mb-1" style={{ fontFamily: "var(--font-inter)" }}>Target</p>
                      <p className="text-2xl font-bold text-[#4ade80]" style={{ fontFamily: "var(--font-inter)" }}>{margin}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] opacity-60 mb-1" style={{ fontFamily: "var(--font-inter)" }}>Effective today</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-inter)", color: effectiveMargin < margin * 0.85 ? "#f87171" : "#f59e0b" }}>
                        {effectiveMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--border)] rounded-sm p-6" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--off-white)] mb-1 font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                    Annualized margin leak: {fmt(annualizedErosion)}
                  </p>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela flags stale quotes the moment supplier costs move — so you reprice before closing, not after.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3.5 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    Stop the Margin Leak — Get a Free Assessment →
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
