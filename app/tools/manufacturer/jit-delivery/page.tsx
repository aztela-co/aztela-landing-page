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

type WindowStatus = "on-time" | "at-risk" | "missed";

export default function JITDeliveryPage() {
  const [windows,       setWindows]       = useState(24);   // delivery windows per week
  const [supplierSlip,  setSupplierSlip]  = useState(18);   // % of components arrive late
  const [windowTol,     setWindowTol]     = useState(2);    // tolerance hours
  const [missedCost,    setMissedCost]    = useState(12);   // $K penalty per missed window
  const [lineStopCost,  setLineStopCost]  = useState(4500); // $/hr customer line stoppage
  const [avgStopHrs,    setAvgStopHrs]    = useState(3);    // hrs per missed window event
  const [calculated,    setCalculated]    = useState(false);

  // Risk model
  const atRiskPct     = Math.min(0.85, (supplierSlip / 100) * (1 + (1 / Math.max(windowTol, 0.5)) * 0.4));
  const missedPct     = atRiskPct * 0.55;
  const onTimePct     = 1 - atRiskPct;

  const weeklyAtRisk  = Math.round(windows * atRiskPct);
  const weeklyMissed  = Math.round(windows * missedPct);
  const weeklyOnTime  = Math.max(0, windows - weeklyAtRisk - weeklyMissed);

  const annualMissed  = weeklyMissed * 52;
  const penaltyCost   = annualMissed * missedCost * 1_000;
  const stopCost      = annualMissed * avgStopHrs * lineStopCost;
  const totalCost     = penaltyCost + stopCost;

  // With Aztela — 85% of at-risk windows caught and rescheduled before miss
  const savedWindows  = Math.round(weeklyAtRisk * 0.85);
  const residualMiss  = Math.max(0, weeklyMissed - Math.round(savedWindows * 0.6));
  const annualSaving  = (weeklyMissed - residualMiss) * 52 * (missedCost * 1_000 + avgStopHrs * lineStopCost);

  // Window timeline cards
  const windowCards = useMemo(() => {
    return Array.from({ length: Math.min(windows, 20) }, (_, i) => {
      const r = prng(i * 7 + 3);
      let status: WindowStatus;
      if (r < missedPct) status = "missed";
      else if (r < atRiskPct) status = "at-risk";
      else status = "on-time";
      const hour = 6 + (i % 10) * 1.5;
      const hh = Math.floor(hour);
      const mm = hour % 1 === 0.5 ? "30" : "00";
      return { id: i + 1, status, time: `${String(hh).padStart(2, "0")}:${mm}` };
    });
  }, [windows, missedPct, atRiskPct]);

  const statusStyle: Record<WindowStatus, { bg: string; border: string; color: string; dot: string }> = {
    "on-time":  { bg: "rgba(74,222,128,0.06)",  border: "rgba(74,222,128,0.25)",  color: "#4ade80", dot: "#4ade80" },
    "at-risk":  { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.35)",  color: "#f59e0b", dot: "#f59e0b" },
    "missed":   { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.35)", color: "#f87171", dot: "#f87171" },
  };

  const SLIDERS = [
    { label: "Delivery windows per week",              val: windows,      set: setWindows,      min: 4,   max: 120,   step: 2,   disp: String(windows) },
    { label: "% components arriving outside window",   val: supplierSlip, set: setSupplierSlip, min: 2,   max: 60,    step: 1,   disp: `${supplierSlip}%` },
    { label: "Delivery window tolerance (hours)",      val: windowTol,    set: setWindowTol,    min: 0.5, max: 12,    step: 0.5, disp: `${windowTol}h` },
    { label: "Missed window penalty ($K)",             val: missedCost,   set: setMissedCost,   min: 1,   max: 100,   step: 1,   disp: `$${missedCost}K` },
    { label: "Customer line stoppage cost ($/hr)",     val: lineStopCost, set: setLineStopCost, min: 500, max: 25000, step: 500, disp: `$${lineStopCost.toLocaleString()}` },
    { label: "Average stoppage duration (hrs)",        val: avgStopHrs,   set: setAvgStopHrs,   min: 0.5, max: 12,    step: 0.5, disp: `${avgStopHrs}h` },
  ];

  const riskColor = missedPct > 0.3 ? "#f87171" : missedPct > 0.15 ? "#f59e0b" : "#4ade80";
  const riskLabel = missedPct > 0.3 ? "Critical" : missedPct > 0.15 ? "Elevated" : "Managed";

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
              How many JIT delivery windows will you miss this week?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              A missed delivery window doesn't just mean a late shipment — it stops your customer's line. Calculate how many windows are at risk from supplier slip, and what each miss actually costs.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your delivery profile</h2>

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
                  Calculate Delivery Window Risk →
                </button>

                {/* Live window timeline */}
                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
                      This week&apos;s delivery windows
                    </p>
                    <span className="text-[10px] font-semibold" style={{ color: riskColor, fontFamily: "var(--font-inter)" }}>
                      {riskLabel}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {windowCards.map((w) => {
                      const s = statusStyle[w.status];
                      return (
                        <div key={w.id}
                          className="flex items-center justify-between px-3 py-2 rounded-sm transition-all duration-300"
                          style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                            <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>Window {String(w.id).padStart(2, "0")}</span>
                            <span className="text-[10px] text-[var(--muted)] opacity-60" style={{ fontFamily: "var(--font-inter)" }}>{w.time}</span>
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: s.color, fontFamily: "var(--font-inter)" }}>
                            {w.status === "on-time" ? "On track" : w.status === "at-risk" ? "At risk" : "Will miss"}
                          </span>
                        </div>
                      );
                    })}
                    {windows > 20 && (
                      <p className="text-[10px] text-[var(--muted)] text-center pt-1" style={{ fontFamily: "var(--font-inter)" }}>
                        +{windows - 20} more windows this week
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 text-[10px] text-[var(--muted)] mt-3 pt-3 border-t border-[var(--border)]" style={{ fontFamily: "var(--font-inter)" }}>
                    <span><span style={{ color: "#4ade80" }}>●</span> On track — {weeklyOnTime}</span>
                    <span><span style={{ color: "#f59e0b" }}>●</span> At risk — {weeklyAtRisk}</span>
                    <span><span style={{ color: "#f87171" }}>●</span> Will miss — {weeklyMissed}</span>
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Cost of missed windows</h2>

                {/* Before / after */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Without visibility",   missed: weeklyMissed,  annual: annualMissed,  cost: totalCost,             color: "#f87171", bad: true },
                    { label: "With Aztela alerting", missed: residualMiss,  annual: residualMiss * 52, cost: totalCost - annualSaving, color: "#4ade80", bad: false },
                  ].map(col => (
                    <div key={col.label} className="border border-[var(--border)] rounded-sm p-4"
                      style={{ borderColor: col.bad ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.3)", background: col.bad ? "rgba(248,113,113,0.04)" : "rgba(74,222,128,0.04)" }}>
                      <p className="text-[9px] font-semibold uppercase tracking-widest mb-3" style={{ color: col.color, fontFamily: "var(--font-inter)" }}>{col.label}</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>Missed/week</p>
                          <p className="text-xl font-bold" style={{ color: col.color, fontFamily: "var(--font-inter)" }}>{col.missed} windows</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>Annual cost</p>
                          <p className="text-sm font-bold" style={{ color: col.color, fontFamily: "var(--font-inter)" }}>{fmt(col.cost)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "Annual missed delivery windows",                value: annualMissed,  color: "#f87171",          isCount: true },
                    { label: "Penalty cost (missed SLA charges)",             value: penaltyCost,   color: "#f87171",          isCount: false },
                    { label: "Customer line stoppage cost",                   value: stopCost,      color: "#f87171",          isCount: false },
                    { label: "Total annual exposure",                         value: totalCost,     color: "var(--off-white)", isCount: false },
                    { label: "Value of advance window-risk alerting (Aztela)",value: annualSaving,  color: "#4ade80",          isCount: false },
                  ].map(row => (
                    <div key={row.label} className="border border-[var(--border)] rounded-sm p-4 flex justify-between items-center">
                      <p className="text-sm text-[var(--muted)] pr-4" style={{ fontFamily: "var(--font-inter)" }}>{row.label}</p>
                      <p className="text-sm font-bold shrink-0" style={{ color: row.color, fontFamily: "var(--font-inter)" }}>
                        {row.isCount ? `${row.value} events` : fmt(row.value)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-5" style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <p className="text-sm text-[var(--off-white)] mb-1 font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                    Aztela alerts you when a supplier shipment is at risk of missing a window — hours before it does.
                  </p>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Instead of finding out at the dock, your team gets ahead of it — reroute, reschedule, or notify the customer on your terms. Most clients cut missed windows by 80%+ within 90 days.
                  </p>
                  <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 bg-[var(--coral)] text-white font-medium text-sm hover:opacity-90 transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    See JIT Delivery Intelligence in Action →
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
