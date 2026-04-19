"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "alert" | "analyzing" | "impact" | "actions" | "resolved";

const SUPPLIERS = [
  { name: "Parker Hannifin", alert: false },
  { name: "Component HV-442", alert: true },
  { name: "Bosch Rexroth", alert: false },
];

const WORK_ORDERS = ["WO-114", "WO-118", "WO-121", "WO-124"];

export default function CascadeIntelligenceGraphic() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [actions, setActions] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const t = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const run = () => {
    clearAll(); setPhase("idle"); setActions([]);
    t(() => setPhase("alert"), 1800);
    t(() => setPhase("analyzing"), 3600);
    t(() => setPhase("impact"), 5400);
    t(() => setPhase("actions"), 7200);
    t(() => setActions(["Expedite from alt supplier — Grainger"]), 7500);
    t(() => setActions(a => [...a, "Reschedule WO-118 · WO-121 · WO-124"]), 8000);
    t(() => setActions(a => [...a, "3 customers notified proactively"]), 8500);
    t(() => { setPhase("resolved"); setActions([]); }, 10200);
    t(() => run(), 12800);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; run(); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => { obs.disconnect(); clearAll(); };
  }, []);

  const statusLabel: Record<Phase, string> = {
    idle: "Monitoring", alert: "Signal detected", analyzing: "Analyzing cascade",
    impact: "Impact mapped", actions: "Actions surfaced", resolved: "Cascade intercepted",
  };
  const statusColor: Record<Phase, string> = {
    idle: "#4d80ff", alert: "#ff6b6b", analyzing: "#4d80ff",
    impact: "#ffb347", actions: "#4ade80", resolved: "#4ade80",
  };

  return (
    <div ref={ref} className="border border-[var(--border)] rounded-sm overflow-hidden" style={{ background: "rgba(18,18,22,0.7)" }}>
      <div className="border-b border-[var(--border)] px-5 py-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
          Cascade Intelligence · Live
        </span>
        <span className="flex items-center gap-1.5 text-[10px]" style={{ fontFamily: "var(--font-inter)", color: statusColor[phase] }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "currentColor" }} />
          {statusLabel[phase]}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Supplier monitor */}
        <div>
          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-inter)" }}>Supplier PO Monitor</p>
          <div className="space-y-1.5">
            {SUPPLIERS.map(s => {
              const isActive = s.alert && phase !== "idle";
              const isResolved = s.alert && phase === "resolved";
              return (
                <div key={s.name} className="flex items-center justify-between px-3 py-2 rounded-sm"
                  style={{
                    background: isResolved ? "rgba(74,222,128,0.07)" : isActive ? "rgba(255,107,107,0.08)" : "rgba(77,128,255,0.05)",
                    border: `1px solid ${isResolved ? "rgba(74,222,128,0.25)" : isActive ? "rgba(255,107,107,0.25)" : "rgba(77,128,255,0.12)"}`,
                    transition: "all 0.5s ease",
                  }}>
                  <span className="text-xs text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{s.name}</span>
                  <span className="text-[10px] font-medium" style={{ fontFamily: "var(--font-inter)", color: isResolved ? "#4ade80" : isActive ? "#ff6b6b" : "#4ade80" }}>
                    {isResolved ? "✓ Resolved" : isActive ? "⚠ 3-week delay" : "On time"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Work orders */}
        {(phase === "impact" || phase === "actions" || phase === "resolved") && (
          <div>
            <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              Cascade Impact — {WORK_ORDERS.length} work orders affected
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {WORK_ORDERS.map(id => (
                <div key={id} className="flex items-center justify-between px-3 py-2 rounded-sm"
                  style={{
                    background: phase === "resolved" ? "rgba(74,222,128,0.07)" : "rgba(255,179,71,0.08)",
                    border: `1px solid ${phase === "resolved" ? "rgba(74,222,128,0.25)" : "rgba(255,179,71,0.25)"}`,
                    transition: "all 0.5s ease",
                  }}>
                  <span className="text-[10px] text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{id}</span>
                  <span className="text-[10px] font-medium" style={{ fontFamily: "var(--font-inter)", color: phase === "resolved" ? "#4ade80" : "#ffb347" }}>
                    {phase === "resolved" ? "✓ Safe" : "AT RISK"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="space-y-1.5">
            {actions.map(a => (
              <div key={a} className="flex items-center gap-2 px-3 py-2 rounded-sm"
                style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.25)" }}>
                <span style={{ color: "#4ade80", fontSize: 10 }}>→</span>
                <span className="text-[10px] text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{a}</span>
              </div>
            ))}
          </div>
        )}

        {/* Resolved */}
        {phase === "resolved" && (
          <div className="px-4 py-3 rounded-sm text-center" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)" }}>
            <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#4ade80" }}>
              Cascade intercepted · 47 min · Line never stopped
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
