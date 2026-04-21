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
function fmtM(n: number) { return `$${(n / 1_000_000).toFixed(2)}M`; }

export default function DeadStockPage() {
  const [invValue,    setInvValue]    = useState(28);    // $M total inventory
  const [pct90,       setPct90]       = useState(14);    // % not moved 90 days
  const [pct180,      setPct180]      = useState(8);     // % not moved 180 days
  const [pct24mo,     setPct24mo]     = useState(4);     // % not moved 24+ months
  const [branches,    setBranches]    = useState(12);    // number of branches
  const [holdingRate, setHoldingRate] = useState(1.2);   // monthly holding cost %
  const [dutyFreight, setDutyFreight] = useState(18);    // import duty + freight as % of landed cost
  const [calculated,  setCalculated]  = useState(false);

  const totalInv     = invValue * 1_000_000;

  // Aging buckets
  const aging90      = totalInv * (pct90  / 100);
  const aging180     = totalInv * (pct180 / 100);
  const aging24mo    = totalInv * (pct24mo / 100);
  const activeInv    = Math.max(0, totalInv - aging90 - aging180 - aging24mo);

  // ── Output 1: Current Capital Drag (monthly) ──────────────────────────────
  // Monthly holding on all aging tiers (90d = 0.5 weight, 180d = 0.8, 24mo = 1.0)
  const monthlyHold  = (aging90 * 0.5 + aging180 * 0.8 + aging24mo) * (holdingRate / 100);
  // Depreciation: aging stock loses value — 0.5%/mo for 180d, 1%/mo for 24mo
  const monthlyDepr  = aging180 * 0.005 + aging24mo * 0.01;
  // Opportunity cost: capital not earning — apply 6% annual / 12
  const monthlyOpp   = (aging180 * 0.5 + aging24mo) * (0.06 / 12);
  // Duty/freight already sunk in dead stock (annualised portion, /12)
  const sunkDuty     = aging24mo * (dutyFreight / 100) * (0.08);
  const capitalDrag  = monthlyHold + monthlyDepr + monthlyOpp + sunkDuty;

  // ── Output 2: Cross-Branch Recovery Estimate ─────────────────────────────
  // Multi-branch networks: benchmark 35–55% of 90–180d aging is transfer-eligible
  // Increases with branch count (more chances for a branch to need it)
  const transferFactor = Math.min(0.55, 0.30 + (branches / 100) * 0.25);
  const transferLow    = Math.round((aging90 + aging180) * 0.35 / 1_000) * 1_000;
  const transferHigh   = Math.round((aging90 + aging180) * transferFactor / 1_000) * 1_000;
  // 24mo stock: not transfer-eligible — needs liquidation or write-off
  const liquidationVal = aging24mo * 0.35; // 35¢ on the dollar

  // ── Output 3: 90-Day Inaction Cost ───────────────────────────────────────
  // Aging velocity: each month ~8% of 90d stock graduates to 180d, ~5% of 180d to 24mo
  const newDead90days  = aging90 * 0.08 * 3;   // 90d → 180d in next 90 days
  const newDead180days = aging180 * 0.05 * 3;  // 180d → 24mo in next 90 days
  const inactionCost   = (newDead90days + newDead180days) * (holdingRate / 100) * 3
                        + newDead180days * 0.15; // write-down risk on newly dead

  // Inventory health bars
  const bars = [
    { label: "Active inventory",              value: activeInv,  pct: (activeInv / totalInv) * 100,  color: "#4ade80" },
    { label: "Slow-moving (90 days+)",        value: aging90,    pct: pct90,                          color: "#f59e0b" },
    { label: "At-risk (180 days+)",           value: aging180,   pct: pct180,                         color: "#fb923c" },
    { label: "Dead stock (24 months+)",       value: aging24mo,  pct: pct24mo,                        color: "#f87171" },
  ];

  const SLIDERS = [
    { label: "Total inventory value ($M)",            val: invValue,    set: setInvValue,    min: 2,   max: 300,  step: 1,   disp: `$${invValue}M` },
    { label: "% inventory not moved in 90 days",      val: pct90,       set: setPct90,       min: 0,   max: 50,   step: 1,   disp: `${pct90}%` },
    { label: "% inventory not moved in 180 days",     val: pct180,      set: setPct180,      min: 0,   max: 30,   step: 1,   disp: `${pct180}%` },
    { label: "% inventory not moved in 24+ months",   val: pct24mo,     set: setPct24mo,     min: 0,   max: 15,   step: 0.5, disp: `${pct24mo}%` },
    { label: "Number of branches / locations",        val: branches,    set: setBranches,    min: 2,   max: 150,  step: 1,   disp: String(branches) },
    { label: "Monthly holding cost %",                val: holdingRate, set: setHoldingRate, min: 0.5, max: 3,    step: 0.1, disp: `${holdingRate}%/mo` },
    { label: "Import duty + freight (% of landed)",   val: dutyFreight, set: setDutyFreight, min: 0,   max: 40,   step: 1,   disp: `${dutyFreight}%` },
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
              Dead Stock Exposure Calculator
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Three numbers most multi-branch distributors have never seen calculated simultaneously — monthly capital drag, cross-branch recovery potential, and the cost of doing nothing for 90 days.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              {/* Inputs */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your inventory profile</h2>

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
                  Calculate My Dead Stock Exposure →
                </button>

                {/* Live inventory health bars — always visible */}
                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                    Inventory health breakdown
                  </p>
                  {bars.map(bar => (
                    <div key={bar.label} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{bar.label}</span>
                        <div className="text-right">
                          <span className="text-xs font-bold" style={{ color: bar.color, fontFamily: "var(--font-inter)" }}>{fmt(bar.value)}</span>
                          <span className="text-[10px] text-[var(--muted)] ml-2" style={{ fontFamily: "var(--font-inter)" }}>{bar.pct.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${bar.pct}%`, background: bar.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Your three numbers</h2>

                {/* Number 1 — Capital Drag */}
                <div className="border border-[var(--border)] rounded-sm p-6 mb-4"
                  style={{ background: "rgba(248,113,113,0.04)", borderColor: "rgba(248,113,113,0.25)" }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: "#f87171", fontFamily: "var(--font-inter)" }}>
                    Number 1 — Current Capital Drag
                  </p>
                  <p className="text-4xl font-bold text-[var(--off-white)] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                    {fmt(capitalDrag)}<span className="text-lg text-[var(--muted)] font-normal"> / month</span>
                  </p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Your dead and aging stock is costing you {fmt(capitalDrag)} per month in holding costs, depreciation, and opportunity cost — capital that could be redeployed into fast-moving inventory. Annualised: <span style={{ color: "#f87171" }}>{fmt(capitalDrag * 12)}/yr</span>.
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                    {[
                      { label: "Holding cost",   value: monthlyHold },
                      { label: "Depreciation",   value: monthlyDepr },
                      { label: "Opportunity",    value: monthlyOpp  },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-[10px] text-[var(--muted)] mb-0.5" style={{ fontFamily: "var(--font-inter)" }}>{item.label}</p>
                        <p className="text-sm font-bold text-[#f87171]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(item.value)}/mo</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Number 2 — Cross-Branch Recovery */}
                <div className="border border-[var(--border)] rounded-sm p-6 mb-4"
                  style={{ background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.25)" }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: "#f59e0b", fontFamily: "var(--font-inter)" }}>
                    Number 2 — Cross-Branch Recovery Estimate
                  </p>
                  <p className="text-4xl font-bold text-[var(--off-white)] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                    {fmt(transferLow)} – {fmt(transferHigh)}
                  </p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                    Based on distributor benchmarks for {branches}-branch networks, an estimated {fmt(transferLow)}–{fmt(transferHigh)} of your aging inventory is likely <span style={{ color: "#f59e0b" }}>transfer-eligible</span> — stock sitting idle in one branch that another branch could sell today. Not dead. Just misplaced.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border)]">
                    <div>
                      <p className="text-[10px] text-[var(--muted)] mb-0.5" style={{ fontFamily: "var(--font-inter)" }}>Transfer-eligible (90–180d)</p>
                      <p className="text-sm font-bold text-[#f59e0b]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(transferLow)}–{fmt(transferHigh)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--muted)] mb-0.5" style={{ fontFamily: "var(--font-inter)" }}>Liquidation value (24mo+)</p>
                      <p className="text-sm font-bold text-[#f87171]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(liquidationVal)} at 35¢</p>
                    </div>
                  </div>
                </div>

                {/* Number 3 — 90-Day Inaction Cost */}
                <div className="border border-[var(--border)] rounded-sm p-6 mb-5"
                  style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: "#4d80ff", fontFamily: "var(--font-inter)" }}>
                    Number 3 — The 90-Day Inaction Cost
                  </p>
                  <p className="text-4xl font-bold text-[var(--off-white)] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                    {fmt(inactionCost)}
                  </p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    If current patterns continue unchanged for 90 days, an additional <span style={{ color: "#4d80ff" }}>{fmt(newDead90days + newDead180days)}</span> moves from at-risk into fully dead stock based on your aging velocity — adding {fmt(inactionCost)} in unrecoverable cost on top of your current drag.
                  </p>
                </div>

                {/* CTA */}
                <div className="border border-[var(--border)] rounded-sm p-6"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <p className="text-sm font-semibold text-[var(--off-white)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>
                    Get your exact numbers — not estimates — from your live data in 72 hours.
                  </p>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    These are benchmark-based estimates. Aztela connects to your ERP and WMS and produces the same three numbers from your actual inventory data — per SKU, per branch, per aging bucket. No commitment. No cost to see it.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3.5 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    Get My Exact Numbers From Live Data →
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
