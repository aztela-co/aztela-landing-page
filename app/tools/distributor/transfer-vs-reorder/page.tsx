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

export default function TransferVsReorderPage() {
  const [units,          setUnits]          = useState(200);
  const [unitValue,      setUnitValue]       = useState(85);
  const [transferFreight,setTransferFreight] = useState(420);
  const [transferDays,   setTransferDays]    = useState(2);
  const [reorderFreight, setReorderFreight]  = useState(180);
  const [supplierDays,   setSupplierDays]    = useState(10);
  const [holdingCostPct, setHoldingCostPct]  = useState(22);
  const [calculated,     setCalculated]      = useState(false);

  const dailyHoldRate  = holdingCostPct / 100 / 365;
  const stockValue     = units * unitValue;

  const transferHolding  = stockValue * dailyHoldRate * transferDays;
  const transferTotal    = transferFreight + transferHolding;

  const reorderHolding   = stockValue * dailyHoldRate * supplierDays;
  const stockoutDays     = supplierDays - transferDays;
  const stockoutCost     = stockoutDays > 0 ? stockValue * 0.018 * stockoutDays : 0;
  const reorderTotal     = reorderFreight + reorderHolding + stockoutCost;

  const savings          = reorderTotal - transferTotal;
  const transferWins     = savings > 0;
  const winnerColor      = transferWins ? "#4ade80" : "#f59e0b";

  const SLIDERS = [
    { label: "Units needed",                   val: units,          set: setUnits,          min: 10,   max: 2000, step: 10,   display: units.toLocaleString() },
    { label: "Unit value ($)",                 val: unitValue,      set: setUnitValue,      min: 5,    max: 2000, step: 5,    display: `$${unitValue}` },
    { label: "Transfer freight cost ($)",      val: transferFreight,set: setTransferFreight,min: 50,   max: 5000, step: 50,   display: `$${transferFreight}` },
    { label: "Transfer lead time (days)",      val: transferDays,   set: setTransferDays,   min: 1,    max: 14,   step: 1,    display: `${transferDays}d` },
    { label: "Reorder freight cost ($)",       val: reorderFreight, set: setReorderFreight, min: 50,   max: 3000, step: 50,   display: `$${reorderFreight}` },
    { label: "Supplier lead time (days)",      val: supplierDays,   set: setSupplierDays,   min: 1,    max: 45,   step: 1,    display: `${supplierDays}d` },
    { label: "Annual inventory carrying cost", val: holdingCostPct, set: setHoldingCostPct, min: 10,   max: 35,   step: 1,    display: `${holdingCostPct}%` },
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
              Transfer from another branch — or reorder from supplier?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              The right answer depends on freight cost, lead time, holding cost, and stockout risk. Calculate the exact break-even.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your scenario</h2>
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
                  Calculate Best Option →
                </button>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Decision breakdown</h2>

                {/* Recommendation */}
                <div className="rounded-sm p-5 mb-5 border" style={{
                  background: `${winnerColor}10`,
                  borderColor: `${winnerColor}40`,
                }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color: winnerColor, fontFamily: "var(--font-inter)" }}>
                    Recommendation
                  </p>
                  <p className="text-xl font-bold text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>
                    {transferWins ? "Transfer from branch" : "Reorder from supplier"}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    Saves {fmt(Math.abs(savings))} vs. the alternative
                  </p>
                </div>

                {/* Side-by-side */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    {
                      label: "Transfer",
                      total: transferTotal,
                      rows: [
                        { l: "Freight cost", v: transferFreight },
                        { l: `Holding (${transferDays}d)`, v: transferHolding },
                      ],
                      wins: transferWins,
                    },
                    {
                      label: "Reorder",
                      total: reorderTotal,
                      rows: [
                        { l: "Freight cost", v: reorderFreight },
                        { l: `Holding (${supplierDays}d)`, v: reorderHolding },
                        { l: "Stockout risk cost", v: stockoutCost },
                      ],
                      wins: !transferWins,
                    },
                  ].map(opt => (
                    <div key={opt.label} className="border border-[var(--border)] rounded-sm p-4"
                      style={{ borderColor: opt.wins ? "rgba(77,128,255,0.35)" : "var(--border)", background: opt.wins ? "rgba(77,128,255,0.04)" : "transparent" }}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
                        {opt.label} {opt.wins && "✓"}
                      </p>
                      {opt.rows.map(r => (
                        <div key={r.l} className="flex justify-between mb-1.5">
                          <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{r.l}</span>
                          <span className="text-xs text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(r.v)}</span>
                        </div>
                      ))}
                      <div className="border-t border-[var(--border)] pt-2 mt-2 flex justify-between">
                        <span className="text-xs font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>Total</span>
                        <span className="text-sm font-bold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(opt.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela surfaces this decision automatically — live branch inventory, freight costs, and lead times compared in real time so your team never guesses.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    See Live Branch Intelligence →
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
