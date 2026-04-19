"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "alert" | "analyzing" | "flagged" | "protected" | "resolved";

const QUOTES = [
  { id: "Q-0881", customer: "Midland Fabrication", lead: "3 weeks", risk: true  },
  { id: "Q-0884", customer: "Great Lakes Steel",   lead: "2 weeks", risk: false },
  { id: "Q-0887", customer: "Alliance Components",  lead: "4 weeks", risk: true  },
];

const LINES = [
  { name: "Line 1", load: 94, capacity: 100, unit: "%" },
  { name: "Line 2", load: 71, capacity: 100, unit: "%" },
];

export default function DeliveryIntelligenceGraphic() {
  const [phase, setPhase] = useState<Phase>("idle");
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const t = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const run = () => {
    clearAll(); setPhase("idle");
    t(() => setPhase("alert"), 2000);
    t(() => setPhase("analyzing"), 3600);
    t(() => setPhase("flagged"), 5200);
    t(() => setPhase("protected"), 7000);
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
    idle: "Monitoring live capacity", alert: "Capacity threshold reached — Line 1 at 94%",
    analyzing: "Checking quotes against capacity", flagged: "2 quotes exceed available capacity",
    protected: "Sales team alerted before commit", resolved: "Delivery commitment protected",
  };
  const statusColor: Record<Phase, string> = {
    idle: "#4d80ff", alert: "#ffb347", analyzing: "#4d80ff",
    flagged: "#ff6b6b", protected: "#4d80ff", resolved: "#4ade80",
  };

  const getQuoteStatus = (q: typeof QUOTES[0]) => {
    if (!q.risk) return { color: "#4ade80", label: "✓ Safe" };
    if (phase === "idle" || phase === "alert" || phase === "analyzing") return { color: "var(--muted)", label: "Pending" };
    if (phase === "flagged") return { color: "#ff6b6b", label: "⚠ Capacity risk" };
    if (phase === "protected") return { color: "#4d80ff", label: "→ Rescheduled" };
    return { color: "#4ade80", label: "✓ Confirmed" };
  };

  return (
    <div ref={ref} className="border border-[var(--border)] rounded-sm overflow-hidden" style={{ background: "rgba(18,18,22,0.7)" }}>
      <div className="border-b border-[var(--border)] px-5 py-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
          Delivery Intelligence · Live
        </span>
        <span className="flex items-center gap-1.5 text-[10px]" style={{ fontFamily: "var(--font-inter)", color: statusColor[phase] }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "currentColor" }} />
          {statusLabel[phase]}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Capacity bars */}
        <div>
          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-inter)" }}>Live Capacity — This Week</p>
          {LINES.map(l => {
            const isOver = l.load > 88;
            return (
              <div key={l.name} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{l.name}</span>
                  <span className="text-[10px] font-semibold" style={{ fontFamily: "var(--font-inter)", color: isOver && phase !== "idle" ? "#ffb347" : "#4d80ff" }}>{l.load}% loaded</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${l.load}%`, background: isOver && phase !== "idle" ? "#ffb347" : "#4d80ff" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quotes */}
        <div>
          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-inter)" }}>Pending Quotes · Capacity Check</p>
          <div className="space-y-1.5">
            {QUOTES.map(q => {
              const s = getQuoteStatus(q);
              return (
                <div key={q.id} className="flex items-center justify-between px-3 py-2 rounded-sm"
                  style={{ background: "rgba(77,128,255,0.05)", border: "1px solid rgba(77,128,255,0.1)", transition: "all 0.5s ease" }}>
                  <div>
                    <span className="text-[10px] text-[var(--off-white)] block" style={{ fontFamily: "var(--font-inter)" }}>{q.customer}</span>
                    <span className="text-[9px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{q.id} · {q.lead} requested</span>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ fontFamily: "var(--font-inter)", color: s.color, transition: "color 0.4s ease" }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {phase === "resolved" && (
          <div className="px-4 py-3 rounded-sm text-center" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)" }}>
            <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#4ade80" }}>
              2 delivery risks eliminated · Dates committed based on real capacity
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
