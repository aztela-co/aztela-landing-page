"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

type CascadeStep = {
  label: string;
  value: string;
  sub: string;
  severity: "trigger" | "warning" | "critical";
};

const severityStyle = {
  trigger:  { bg: "rgba(77,128,255,0.08)",  border: "rgba(77,128,255,0.35)",  color: "#4d80ff" },
  warning:  { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.35)",  color: "#f59e0b" },
  critical: { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.35)", color: "#f87171" },
};

export default function CascadeSimulatorPage() {
  const [revenue,    setRevenue]    = useState(30);
  const [workOrders, setWorkOrders] = useState(80);
  const [singleSrc,  setSingleSrc]  = useState(30);
  const [mto,        setMto]        = useState(60);
  const [step,       setStep]       = useState(0);

  function simulate() {
    setStep(0);
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => setStep(i), i * 600);
    }
  }

  function reset() { setStep(0); }

  const monthlyRev         = (revenue * 1_000_000) / 12;
  const affectedComponents = Math.round(workOrders * (singleSrc / 100));
  const pausedOrders       = Math.round(affectedComponents * 0.65);
  const revenueAtRisk      = Math.round(monthlyRev * (pausedOrders / workOrders));
  const expediteCost       = Math.round(revenueAtRisk * 0.038);
  const deliveriesAtRisk   = Math.round(pausedOrders * (mto / 100));

  const steps: CascadeStep[] = [
    {
      label: "Trigger — Supplier 3 weeks late",
      value: "21 days",
      sub: "Key component supplier misses delivery window",
      severity: "trigger",
    },
    {
      label: "Components at risk",
      value: `${affectedComponents} component lines`,
      sub: `${singleSrc}% of your ${workOrders} active work orders depend on single-source parts`,
      severity: "warning",
    },
    {
      label: "Work orders paused",
      value: `${pausedOrders} work orders`,
      sub: "Labor staged, machinery ready — but can't run. Cost accumulates without output.",
      severity: "critical",
    },
    {
      label: "Revenue delayed",
      value: fmt(revenueAtRisk),
      sub: `${deliveriesAtRisk} delivery commitments at risk of missing customer dates`,
      severity: "critical",
    },
    {
      label: "Emergency response cost",
      value: fmt(expediteCost),
      sub: "Expedite freight, premium sourcing, and overtime to partially recover",
      severity: "critical",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="px-6 py-16 md:py-24 grid-bg">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ← Back to tools
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              Cascade Impact Simulator
            </p>
            <h1
              className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight"
              style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}
            >
              Your top supplier misses by 3 weeks. What breaks?
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Input your operation. Watch the cascade ripple through your work orders, delivery commitments, and margin in real time.
            </p>
          </div>
        </section>

        {/* Simulator */}
        <section className="px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              {/* Inputs */}
              <div className="space-y-6">
                {[
                  { label: "Annual Revenue",                          val: revenue,    set: (v: number) => { setRevenue(v);    reset(); }, min: 5,  max: 250, display: `$${revenue}M` },
                  { label: "Active work orders / month",              val: workOrders, set: (v: number) => { setWorkOrders(v); reset(); }, min: 10, max: 500, display: String(workOrders) },
                  { label: "% components from a single source",       val: singleSrc,  set: (v: number) => { setSingleSrc(v);  reset(); }, min: 5,  max: 90,  display: `${singleSrc}%` },
                  { label: "% production that is make-to-order (MTO)",val: mto,        set: (v: number) => { setMto(v);        reset(); }, min: 0,  max: 100, display: `${mto}%` },
                ].map(({ label, val, set, min, max, display }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{label}</label>
                      <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{display}</span>
                    </div>
                    <input type="range" min={min} max={max} value={val}
                      onChange={e => set(+e.target.value)}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, var(--coral) ${(val - min) / (max - min) * 100}%, var(--border) 0%)` }} />
                    <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                      <span>{min}</span><span>{max}</span>
                    </div>
                  </div>
                ))}

                <button
                  onClick={simulate}
                  className="w-full py-4 text-white font-medium text-sm rounded-sm transition-all hover:translate-y-[-1px]"
                  style={{ fontFamily: "var(--font-inter)", background: "var(--coral)" }}
                >
                  Run Cascade Simulation →
                </button>

                <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  Aztela's cascade logic traces exactly this ripple in real time — surfacing it before the supplier misses, not after.
                </p>
              </div>

              {/* Cascade visual */}
              <div>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                  {step === 0 ? "Hit simulate to trace the cascade" : step < 5 ? "Tracing impact..." : "Full cascade mapped"}
                </h2>

                <div className="relative">
                  {steps.map((s, i) => {
                    const style   = severityStyle[s.severity];
                    const visible = step > i;
                    return (
                      <div key={i} className="relative">
                        {i > 0 && (
                          <div className="flex justify-center my-1">
                            <div className="flex flex-col items-center gap-0.5">
                              {[0, 1, 2].map(d => (
                                <div key={d} className="w-px h-1.5 rounded-full transition-all duration-300"
                                  style={{ background: visible ? style.color : "var(--border)", opacity: visible ? 0.5 : 0.3 }} />
                              ))}
                              {visible && (
                                <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                                  <path d="M1 1l3 3 3-3" stroke={style.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>
                        )}
                        <div
                          className="rounded-sm p-4 transition-all duration-500"
                          style={{
                            opacity:    visible ? 1 : 0.15,
                            transform:  visible ? "translateY(0)" : "translateY(8px)",
                            background: visible ? style.bg : "transparent",
                            border:     `1px solid ${visible ? style.border : "var(--border)"}`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-widest mb-1"
                                style={{ fontFamily: "var(--font-inter)", color: style.color }}>{s.label}</p>
                              <p className="text-lg font-bold text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{s.value}</p>
                              <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{s.sub}</p>
                            </div>
                            {i > 0 && visible && (
                              <div className="w-2 h-2 rounded-full mt-1 shrink-0 animate-pulse" style={{ background: style.color }} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {step === 5 && (
                  <div className="mt-6 rounded-sm p-5 border"
                    style={{ background: "rgba(77,128,255,0.05)", borderColor: "rgba(77,128,255,0.25)" }}>
                    <p className="text-sm text-[var(--off-white)] font-medium mb-1" style={{ fontFamily: "var(--font-inter)" }}>
                      Aztela surfaces this cascade before the supplier misses.
                    </p>
                    <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                      Live BOM monitoring + supplier lead time correlation = alerts 7–14 days ahead of impact, not after it.
                    </p>
                    <a
                      href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment"
                      target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center py-3 text-white font-medium text-sm rounded-sm transition-all hover:translate-y-[-1px]"
                      style={{ fontFamily: "var(--font-inter)", background: "var(--coral)" }}
                    >
                      See It Running in Your Data →
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
