"use client";

import { useEffect, useState } from "react";

const branches = [
  { id: "A", name: "Chicago", stock: 847, cap: 1000 },
  { id: "B", name: "Detroit", stock: 23, cap: 1000 },
  { id: "C", name: "Cleveland", stock: 412, cap: 1000 },
  { id: "D", name: "Columbus", stock: 156, cap: 1000 },
];

type Phase = "idle" | "alert" | "analyzing" | "impact" | "action" | "resolved";

export default function DistributorGraphic() {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const seq: [Phase, number][] = [
      ["alert",     900],
      ["analyzing", 1900],
      ["impact",    3100],
      ["action",    4300],
      ["resolved",  5800],
      ["idle",      8500],
    ];

    const fire = (offset = 0) => {
      return seq.map(([p, d]) =>
        setTimeout(() => setPhase(p), d + offset)
      );
    };

    const timers = fire();
    const loop = setInterval(() => {
      setPhase("alert");
      fire(0).forEach((t) => timers.push(t));
    }, 11000);

    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  const show = (p: Phase) => {
    const order: Phase[] = ["idle","alert","analyzing","impact","action","resolved"];
    return order.indexOf(phase) >= order.indexOf(p);
  };

  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--charcoal-mid)] overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${phase === "idle" || phase === "resolved" ? "bg-green-400" : "bg-red-400 animate-pulse"}`} />
          <span style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:11 }}>Aztela · Inventory Network</span>
        </div>
        <span style={{ color:"var(--muted)", fontSize:10, opacity:0.5 }}>4 branches · LIVE</span>
      </div>

      <div className="p-5 space-y-4">

        {/* Branch grid — always visible */}
        <div className="grid grid-cols-2 gap-2">
          {branches.map((b) => {
            const pct = Math.round((b.stock / b.cap) * 100);
            const isCritical = b.id === "B";
            const color = isCritical && show("alert") ? "#ff6b6b" : "var(--coral)";
            return (
              <div key={b.id} className="border border-[var(--border)] rounded-sm p-3 relative transition-all duration-500"
                style={{ borderColor: isCritical && show("alert") ? "rgba(255,107,107,0.35)" : "var(--border)", background: isCritical && show("alert") ? "rgba(255,107,107,0.04)" : "transparent" }}>
                {isCritical && show("alert") && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-sm animate-pulse"
                    style={{ background:"rgba(255,107,107,0.15)", color:"#ff6b6b", border:"1px solid rgba(255,107,107,0.3)", fontFamily:"var(--font-inter)" }}>
                    CRITICAL
                  </span>
                )}
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9, marginBottom:4 }}>{b.name}</p>
                <p style={{ fontFamily:"var(--font-inter)", color, fontSize:17, fontWeight:700, lineHeight:1 }}>
                  {b.stock.toLocaleString()}
                  <span style={{ color:"var(--muted)", fontSize:9, fontWeight:400, marginLeft:3 }}>units</span>
                </p>
                <div className="w-full h-1 rounded-full mt-2" style={{ background:"var(--border)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width:`${pct}%`, background: color }} />
                </div>
                {isCritical && show("alert") && (
                  <p style={{ fontFamily:"var(--font-inter)", color:"#ff6b6b", fontSize:9, marginTop:4 }}>Stockout in ~5.4 hrs</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Customer order incoming */}
        {show("analyzing") && (
          <div className="border border-[var(--border)] rounded-sm px-4 py-3 transition-all duration-400"
            style={{ opacity: show("analyzing") ? 1 : 0, transform: show("analyzing") ? "translateY(0)" : "translateY(6px)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>
                  {show("impact") ? "Inbound Order" : "Analyzing fulfillment options..."}
                </p>
                {show("impact") && (
                  <p style={{ fontFamily:"var(--font-inter)", color:"var(--off-white)", fontSize:12 }}>
                    Vantage Industrial — <strong>180 units</strong> needed by 09:00
                  </p>
                )}
              </div>
              {show("impact") && (
                <span style={{ fontFamily:"var(--font-inter)", color:"#ffb347", fontSize:10, background:"rgba(255,179,71,0.1)", border:"1px solid rgba(255,179,71,0.25)", padding:"2px 8px", borderRadius:2 }}>
                  Detroit can't fill it
                </span>
              )}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {show("action") && (
          <div className="rounded-sm p-4 transition-all duration-500 space-y-3"
            style={{ background:"rgba(77,128,255,0.05)", border:"1px solid rgba(77,128,255,0.25)", opacity: show("action") ? 1 : 0, transform: show("action") ? "translateY(0)" : "translateY(8px)" }}>
            <p style={{ fontFamily:"var(--font-inter)", color:"var(--coral)", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>
              ↻ Aztela Recommendation
            </p>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--off-white)", fontSize:12 }}>
                  Transfer <strong>200 units</strong> Chicago → Detroit
                </p>
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:10, marginTop:3 }}>
                  ETA 4.2 hrs · arrives before stockout · order fulfilled on time
                </p>
              </div>
              <span className="shrink-0 text-[10px] px-2.5 py-1 rounded-sm font-bold transition-all duration-500"
                style={{ fontFamily:"var(--font-inter)", background: phase === "resolved" ? "rgba(74,222,128,0.12)" : "rgba(77,128,255,0.12)", color: phase === "resolved" ? "#4ade80" : "var(--coral)", border:`1px solid ${phase === "resolved" ? "rgba(74,222,128,0.3)" : "rgba(77,128,255,0.25)"}` }}>
                {phase === "resolved" ? "✓ Triggered" : "Auto-trigger"}
              </span>
            </div>
          </div>
        )}

        {/* Resolved */}
        {phase === "resolved" && (
          <div className="rounded-sm px-4 py-3 transition-all duration-500"
            style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.25)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily:"var(--font-inter)", color:"#4ade80", fontSize:11, fontWeight:600 }}>✓ Stockout prevented</p>
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:10 }}>Order fulfilled · no expedite · customer unaware there was ever a risk</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em" }}>Response time</p>
                <p style={{ fontFamily:"var(--font-inter)", color:"#4ade80", fontSize:14, fontWeight:700 }}>38 min</p>
              </div>
            </div>
          </div>
        )}

        {/* Idle */}
        {phase === "idle" && (
          <div className="py-2 text-center">
            <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:11 }}>Monitoring · all branches nominal</p>
          </div>
        )}

      </div>
    </div>
  );
}
