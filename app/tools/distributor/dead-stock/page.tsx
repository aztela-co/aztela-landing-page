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

export default function DeadStockPage() {
  const [invValue,   setInvValue]   = useState(8);
  const [pct30,      setPct30]      = useState(18);
  const [pct60,      setPct60]      = useState(10);
  const [pct90,      setPct90]      = useState(6);
  const [carryRate,  setCarryRate]  = useState(22);
  const [calculated, setCalculated] = useState(false);

  const totalInv   = invValue * 1_000_000;
  const slow30     = totalInv * (pct30 / 100);
  const slow60     = totalInv * (pct60 / 100);
  const dead90     = totalInv * (pct90 / 100);
  const healthyInv = totalInv - slow30 - slow60 - dead90;

  const carryingCost     = (slow60 * 0.5 + dead90) * (carryRate / 100);
  const recoveryAt40c    = dead90 * 0.4;
  const redeployableCapital = dead90 + slow60 * 0.5;
  const opportunityCost  = redeployableCapital * 0.06; // 6% could be earning if deployed

  const SLIDERS = [
    { label: "Total inventory value",          val: invValue,  set: setInvValue,  min: 0.5, max: 50,  step: 0.5, display: `$${invValue}M` },
    { label: "Inventory 30–60 days no movement", val: pct30,  set: setPct30,     min: 0,   max: 40,  step: 1,   display: `${pct30}%` },
    { label: "Inventory 60–90 days no movement", val: pct60,  set: setPct60,     min: 0,   max: 30,  step: 1,   display: `${pct60}%` },
    { label: "Inventory 90+ days no movement",   val: pct90,  set: setPct90,     min: 0,   max: 20,  step: 1,   display: `${pct90}%` },
    { label: "Annual inventory carrying cost",   val: carryRate, set: setCarryRate, min: 10, max: 35, step: 1,  display: `${carryRate}%` },
  ];

  const bars = [
    { label: "Active inventory",          value: healthyInv, color: "#4ade80" },
    { label: "Slow-moving (30–60 days)",  value: slow30,     color: "#f59e0b" },
    { label: "At-risk (60–90 days)",      value: slow60,     color: "#fb923c" },
    { label: "Dead stock (90+ days)",     value: dead90,     color: "#f87171" },
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
              How much capital is sitting idle in your inventory?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Dead and slow-moving stock isn't just a write-off risk — it's working capital you can't deploy. Calculate yours.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your inventory profile</h2>
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
                  Calculate Dead Stock Exposure →
                </button>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Inventory health breakdown</h2>

                {/* Visual bars */}
                <div className="border border-[var(--border)] rounded-sm p-5 mb-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                  {bars.map(bar => (
                    <div key={bar.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{bar.label}</span>
                        <span className="text-xs font-semibold" style={{ color: bar.color, fontFamily: "var(--font-inter)" }}>{fmt(bar.value)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--border)]">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: calculated ? `${(bar.value / totalInv) * 100}%` : "0%", background: bar.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key numbers */}
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Annual carrying cost of dead & at-risk stock", value: carryingCost, color: "#f87171" },
                    { label: "Recoverable if liquidated at 40¢ on the dollar", value: recoveryAt40c, color: "#f59e0b" },
                    { label: "Capital you could redeploy to active demand", value: redeployableCapital, color: "#4ade80" },
                    { label: "Opportunity cost (6% if redeployed)",          value: opportunityCost, color: "#4d80ff" },
                  ].map(row => (
                    <div key={row.label} className="border border-[var(--border)] rounded-sm p-4 flex justify-between items-center">
                      <p className="text-sm text-[var(--muted)] pr-4" style={{ fontFamily: "var(--font-inter)" }}>{row.label}</p>
                      <p className="text-sm font-bold shrink-0" style={{ color: row.color, fontFamily: "var(--font-inter)" }}>{fmt(row.value)}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-6" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--off-white)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela flags slow-moving stock in real time — before it becomes dead stock. Most clients recover 20–35% of idle capital within 6 months.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3.5 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    Get a Free Dead Stock Audit →
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
