"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "alert" | "locating" | "transfer" | "resolved";

const BRANCHES = [
  { name: "Detroit",     stock: 2,   critical: true  },
  { name: "Cleveland",   stock: 847, critical: false },
  { name: "Pittsburgh",  stock: 391, critical: false },
  { name: "Columbus",    stock: 12,  critical: false },
];

export default function InventoryIntelligenceGraphic() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transfer, setTransfer] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const t = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const run = () => {
    clearAll(); setPhase("idle"); setTransfer(false);
    t(() => setPhase("alert"), 2000);
    t(() => setPhase("locating"), 3600);
    t(() => { setPhase("transfer"); setTransfer(true); }, 5400);
    t(() => setPhase("resolved"), 8000);
    t(() => run(), 11000);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; run(); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => { obs.disconnect(); clearAll(); };
  }, []);

  const statusLabel: Record<Phase, string> = {
    idle: "Monitoring", alert: "Critical stockout — Detroit", locating: "Locating network stock",
    transfer: "Transfer triggered", resolved: "Stockout prevented",
  };
  const statusColor: Record<Phase, string> = {
    idle: "#4d80ff", alert: "#ff6b6b", locating: "#ffb347", transfer: "#4d80ff", resolved: "#4ade80",
  };

  const getStock = (b: typeof BRANCHES[0]) => {
    if (phase === "resolved" && b.critical) return 400;
    if ((phase === "transfer" || phase === "resolved") && b.name === "Cleveland") return 847 - 400;
    return b.stock;
  };

  return (
    <div ref={ref} className="border border-[var(--border)] rounded-sm overflow-hidden" style={{ background: "rgba(18,18,22,0.7)" }}>
      <div className="border-b border-[var(--border)] px-5 py-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
          Inventory Intelligence · Live
        </span>
        <span className="flex items-center gap-1.5 text-[10px]" style={{ fontFamily: "var(--font-inter)", color: statusColor[phase] }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "currentColor" }} />
          {statusLabel[phase]}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-inter)" }}>
            Branch Network · SKU #HYD-4420 · Real-time
          </p>
          <div className="space-y-2">
            {BRANCHES.map(b => {
              const stock = getStock(b);
              const isCritical = b.critical && (phase === "alert" || phase === "locating");
              const isSource = b.name === "Cleveland" && (phase === "locating" || phase === "transfer");
              const isResolved = b.critical && phase === "resolved";
              const barPct = Math.min((stock / 900) * 100, 100);

              return (
                <div key={b.name} className="px-3 py-2.5 rounded-sm"
                  style={{
                    background: isCritical ? "rgba(255,107,107,0.08)" : isSource ? "rgba(77,128,255,0.08)" : isResolved ? "rgba(74,222,128,0.07)" : "rgba(77,128,255,0.04)",
                    border: `1px solid ${isCritical ? "rgba(255,107,107,0.25)" : isSource ? "rgba(77,128,255,0.3)" : isResolved ? "rgba(74,222,128,0.25)" : "rgba(77,128,255,0.1)"}`,
                    transition: "all 0.5s ease",
                  }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{b.name}</span>
                    <span className="text-[10px] font-semibold" style={{ fontFamily: "var(--font-inter)", color: isCritical ? "#ff6b6b" : isSource ? "#4d80ff" : isResolved ? "#4ade80" : "#4ade80" }}>
                      {isCritical ? "CRITICAL" : isSource ? "SOURCE →" : isResolved && b.critical ? "✓ Restocked" : `${stock} units`}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barPct}%`, background: isCritical ? "#ff6b6b" : isSource ? "#4d80ff" : isResolved && b.critical ? "#4ade80" : "#4d80ff" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {transfer && (
          <div className="px-3 py-2.5 rounded-sm" style={{ background: "rgba(77,128,255,0.08)", border: "1px solid rgba(77,128,255,0.25)" }}>
            <p className="text-[10px] text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>
              → Transfer triggered · Cleveland → Detroit · 400 units · ETA 4 hrs
            </p>
          </div>
        )}

        {phase === "resolved" && (
          <div className="px-4 py-3 rounded-sm text-center" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)" }}>
            <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#4ade80" }}>
              Stockout prevented · 23 min · Customer order filled · $0 expedite cost
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
