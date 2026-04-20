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

export default function PriceChangeImpactPage() {
  const [openQuotes,   setOpenQuotes]   = useState(220);
  const [avgOrderVal,  setAvgOrderVal]  = useState(38);
  const [priceIncrease,setPriceIncrease]= useState(5);
  const [fixedPct,     setFixedPct]     = useState(35);
  const [margin,       setMargin]       = useState(17);
  const [calculated,   setCalculated]   = useState(false);

  const totalOpenValue     = openQuotes * avgOrderVal * 1_000;
  const fixedCommitted     = totalOpenValue * (fixedPct / 100);
  const repriceableValue   = totalOpenValue * (1 - fixedPct / 100);

  const marginBefore       = totalOpenValue * (margin / 100);
  const costIncreaseOnFixed = fixedCommitted * (priceIncrease / 100);
  const marginAfter        = marginBefore - costIncreaseOnFixed;
  const effectiveMarginAfter = (marginAfter / totalOpenValue) * 100;

  const recoveredByRepricing = repriceableValue * (priceIncrease / 100);
  const netMarginImpact     = costIncreaseOnFixed; // absorbed

  const severity     = costIncreaseOnFixed > totalOpenValue * 0.05 ? "Critical" : costIncreaseOnFixed > totalOpenValue * 0.02 ? "Elevated" : "Manageable";
  const sevColor     = severity === "Critical" ? "#f87171" : severity === "Elevated" ? "#f59e0b" : "#4ade80";

  const SLIDERS = [
    { label: "Number of open quotes",              val: openQuotes,    set: setOpenQuotes,    min: 20,  max: 1000, step: 10,  display: String(openQuotes) },
    { label: "Average order value ($K)",           val: avgOrderVal,   set: setAvgOrderVal,   min: 5,   max: 500,  step: 5,   display: `$${avgOrderVal}K` },
    { label: "Supplier price increase",            val: priceIncrease, set: setPriceIncrease, min: 1,   max: 20,  step: 0.5, display: `${priceIncrease}%` },
    { label: "% of quotes already price-committed",val: fixedPct,      set: setFixedPct,      min: 0,   max: 100, step: 5,   display: `${fixedPct}%` },
    { label: "Current gross margin",               val: margin,        set: setMargin,        min: 5,   max: 50,  step: 1,   display: `${margin}%` },
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
              Your supplier just raised prices. How much margin did you just lose?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Input your open pipeline. See instantly what you can reprice, what you'll absorb, and exactly how much margin you've already given away.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your open pipeline</h2>
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
                  Calculate Price Impact →
                </button>
                <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  Splits your pipeline into what can be repriced vs. what's already committed — so you see the real P&L impact, not just the headline.
                </p>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Price impact breakdown</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded"
                    style={{ fontFamily: "var(--font-inter)", color: sevColor, background: `${sevColor}18`, border: `1px solid ${sevColor}40` }}>
                    {severity}
                  </span>
                </div>

                {/* Pipeline split */}
                <div className="border border-[var(--border)] rounded-sm p-5 mb-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs text-[var(--muted)] mb-3" style={{ fontFamily: "var(--font-inter)" }}>Open pipeline split</p>
                  <div className="flex h-3 rounded-full overflow-hidden mb-2">
                    <div className="h-full transition-all duration-700" style={{ width: calculated ? `${fixedPct}%` : "0%", background: "#f87171" }} />
                    <div className="h-full transition-all duration-700" style={{ width: calculated ? `${100 - fixedPct}%` : "0%", background: "#4ade80" }} />
                  </div>
                  <div className="flex justify-between text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
                    <span><span style={{ color: "#f87171" }}>■</span> Fixed price {fmt(fixedCommitted)}</span>
                    <span><span style={{ color: "#4ade80" }}>■</span> Can reprice {fmt(repriceableValue)}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "Margin absorbed on fixed-price commits",   value: costIncreaseOnFixed,  sub: `${((costIncreaseOnFixed / marginBefore) * 100).toFixed(0)}% of gross margin on this pipeline`, color: "#f87171" },
                    { label: "Margin recovered by repricing open quotes",value: recoveredByRepricing, sub: `${(100 - fixedPct)}% of pipeline still actionable`,                                            color: "#4ade80" },
                    { label: "Net margin impact you cannot escape",       value: netMarginImpact,      sub: `effective margin drops ${(margin - effectiveMarginAfter).toFixed(1)} pts to ${effectiveMarginAfter.toFixed(1)}%`, color: "#f87171" },
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

                {/* Margin before/after */}
                <div className="border border-[var(--border)] rounded-sm p-5 mb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs text-[var(--muted)] mb-3" style={{ fontFamily: "var(--font-inter)" }}>Effective margin on this pipeline</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--muted)] opacity-60 mb-1" style={{ fontFamily: "var(--font-inter)" }}>Before increase</p>
                      <p className="text-2xl font-bold text-[#4ade80]" style={{ fontFamily: "var(--font-inter)" }}>{margin}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] opacity-60 mb-1" style={{ fontFamily: "var(--font-inter)" }}>After increase</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-inter)", color: effectiveMarginAfter < margin * 0.9 ? "#f87171" : "#f59e0b" }}>
                        {effectiveMarginAfter.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela flags which open quotes need immediate repricing the moment a supplier price change is detected — before you close a single order at the wrong margin.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    Protect Your Open Margin — Free Assessment →
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
