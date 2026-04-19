"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "alert" | "scanning" | "exposed" | "repriced" | "resolved";

const QUOTES = [
  { id: "Q-2241", customer: "Apex Industrial",  value: "$84K",  margin: "18.2%", stale: true  },
  { id: "Q-2244", customer: "Lake Erie Mfg",    value: "$31K",  margin: "16.8%", stale: true  },
  { id: "Q-2247", customer: "Biltmore Supply",   value: "$127K", margin: "21.1%", stale: false },
  { id: "Q-2251", customer: "Cascade Parts",     value: "$52K",  margin: "19.4%", stale: true  },
];

export default function MarginIntelligenceGraphic() {
  const [phase, setPhase] = useState<Phase>("idle");
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const t = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const run = () => {
    clearAll(); setPhase("idle");
    t(() => setPhase("alert"), 2000);
    t(() => setPhase("scanning"), 3400);
    t(() => setPhase("exposed"), 5000);
    t(() => setPhase("repriced"), 6800);
    t(() => setPhase("resolved"), 9200);
    t(() => run(), 12000);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; run(); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => { obs.disconnect(); clearAll(); };
  }, []);

  const statusLabel: Record<Phase, string> = {
    idle: "Monitoring 38 supplier feeds", alert: "Price change detected — SKF Bearings +3.2%",
    scanning: "Scanning open quotes for exposure", exposed: "3 quotes at risk · $12.4K margin",
    repriced: "Repricing in progress", resolved: "Margin protected",
  };
  const statusColor: Record<Phase, string> = {
    idle: "#4d80ff", alert: "#ff6b6b", scanning: "#ffb347",
    exposed: "#ff6b6b", repriced: "#4d80ff", resolved: "#4ade80",
  };

  const getQuoteColor = (q: typeof QUOTES[0]) => {
    if (!q.stale) return { bg: "rgba(77,128,255,0.05)", border: "rgba(77,128,255,0.1)", text: "#4d80ff", status: "Current" };
    if (phase === "idle" || phase === "alert" || phase === "scanning")
      return { bg: "rgba(77,128,255,0.05)", border: "rgba(77,128,255,0.1)", text: "var(--muted)", status: "Open" };
    if (phase === "exposed")
      return { bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.25)", text: "#ff6b6b", status: "STALE COST" };
    if (phase === "repriced")
      return { bg: "rgba(77,128,255,0.08)", border: "rgba(77,128,255,0.25)", text: "#4d80ff", status: "Repricing..." };
    return { bg: "rgba(74,222,128,0.07)", border: "rgba(74,222,128,0.25)", text: "#4ade80", status: "✓ Updated" };
  };

  return (
    <div ref={ref} className="border border-[var(--border)] rounded-sm overflow-hidden" style={{ background: "rgba(18,18,22,0.7)" }}>
      <div className="border-b border-[var(--border)] px-5 py-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
          Margin Intelligence · Live
        </span>
        <span className="flex items-center gap-1.5 text-[10px]" style={{ fontFamily: "var(--font-inter)", color: statusColor[phase] }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "currentColor" }} />
          {statusLabel[phase]}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Price change alert */}
        {phase !== "idle" && (
          <div className="px-3 py-2.5 rounded-sm" style={{ background: phase === "resolved" ? "rgba(74,222,128,0.07)" : "rgba(255,107,107,0.08)", border: `1px solid ${phase === "resolved" ? "rgba(74,222,128,0.25)" : "rgba(255,107,107,0.25)"}`, transition: "all 0.5s ease" }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>SKF Bearings — Price Update</span>
              <span className="text-[10px] font-semibold" style={{ fontFamily: "var(--font-inter)", color: phase === "resolved" ? "#4ade80" : "#ff6b6b" }}>
                {phase === "resolved" ? "✓ Applied" : "+3.2% · Detected today"}
              </span>
            </div>
          </div>
        )}

        {/* Open quotes */}
        <div>
          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-inter)" }}>Open Quotes · Cost Exposure</p>
          <div className="space-y-1.5">
            {QUOTES.map(q => {
              const c = getQuoteColor(q);
              return (
                <div key={q.id} className="flex items-center justify-between px-3 py-2 rounded-sm"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, transition: "all 0.5s ease" }}>
                  <div>
                    <span className="text-[10px] text-[var(--off-white)] block" style={{ fontFamily: "var(--font-inter)" }}>{q.customer}</span>
                    <span className="text-[9px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{q.id} · {q.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ fontFamily: "var(--font-inter)", color: c.text }}>{c.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {phase === "resolved" && (
          <div className="px-4 py-3 rounded-sm text-center" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)" }}>
            <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#4ade80" }}>
              $12.4K margin protected · Same-day repricing · 0 stale quotes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
