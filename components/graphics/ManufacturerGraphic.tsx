"use client";

import { useEffect, useState } from "react";

const affectedOrders = [
  { id: "#4821", customer: "Vantage Industrial", due: "Aug 12", risk: "high" },
  { id: "#4822", customer: "BuildCo Systems", due: "Aug 15", risk: "high" },
  { id: "#4823", customer: "Apex Manufacturing", due: "Aug 19", risk: "medium" },
  { id: "#4827", customer: "CoreTech Ltd", due: "Aug 22", risk: "low" },
];

const actions = [
  { label: "Expedite from Alt Supplier", cost: "+$2,400", saves: "6 deliveries protected", type: "approve" },
  { label: "Reschedule 4 low-priority WOs", cost: "no cost", saves: "frees line capacity", type: "auto" },
  { label: "Notify Vantage Industrial now", cost: "", saves: "5-day slip · proactive", type: "notify" },
];

type Phase = "idle" | "alert" | "analyzing" | "impact" | "actions" | "resolved";

export default function ManufacturerGraphic() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [actionsDone, setActionsDone] = useState(0);

  useEffect(() => {
    const seq: [Phase, number][] = [
      ["alert", 800],
      ["analyzing", 1800],
      ["impact", 3000],
      ["actions", 4400],
      ["resolved", 6800],
      ["idle", 9500],
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];
    let actionTimer: ReturnType<typeof setInterval> | null = null;

    seq.forEach(([p, delay]) => {
      timers.push(setTimeout(() => {
        setPhase(p);
        if (p === "actions") {
          setActionsDone(0);
          let count = 0;
          actionTimer = setInterval(() => {
            count++;
            setActionsDone(count);
            if (count >= actions.length && actionTimer) clearInterval(actionTimer);
          }, 600);
        }
        if (p === "idle") setActionsDone(0);
      }, delay));
    });

    const loop = setInterval(() => {
      setPhase("alert");
      setActionsDone(0);
      const innerSeq: [Phase, number][] = [
        ["analyzing", 1000],
        ["impact", 2200],
        ["actions", 3600],
        ["resolved", 6000],
        ["idle", 8700],
      ];
      innerSeq.forEach(([p, d]) => {
        timers.push(setTimeout(() => {
          setPhase(p);
          if (p === "actions") {
            setActionsDone(0);
            let c = 0;
            actionTimer = setInterval(() => {
              c++;
              setActionsDone(c);
              if (c >= actions.length && actionTimer) clearInterval(actionTimer);
            }, 600);
          }
        }, d));
      });
    }, 12000);

    return () => {
      timers.forEach(clearTimeout);
      if (actionTimer) clearInterval(actionTimer);
      clearInterval(loop);
    };
  }, []);

  const show = (p: Phase) => {
    const order: Phase[] = ["idle", "alert", "analyzing", "impact", "actions", "resolved"];
    return order.indexOf(phase) >= order.indexOf(p);
  };

  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--charcoal-mid)] overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${phase === "idle" ? "bg-green-400" : "bg-red-400 animate-pulse"}`} />
          <span style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 11 }}>
            Aztela · Cascade Detection
          </span>
        </div>
        <span style={{ color: "var(--muted)", fontSize: 10, opacity: 0.5 }}>LIVE</span>
      </div>

      <div className="p-5 space-y-4">

        {/* Idle state */}
        {phase === "idle" && (
          <div className="py-4 text-center" style={{ color: "var(--muted)", fontFamily: "var(--font-inter)", fontSize: 11 }}>
            <div className="w-2 h-2 rounded-full bg-green-400 mx-auto mb-3 animate-pulse" />
            All systems nominal · Monitoring 47 open work orders
          </div>
        )}

        {/* Alert */}
        {show("alert") && phase !== "idle" && (
          <div
            className="rounded-sm p-4 transition-all duration-500"
            style={{
              background: "rgba(255,107,107,0.08)",
              border: "1px solid rgba(255,107,107,0.35)",
              opacity: show("alert") ? 1 : 0,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="animate-pulse" style={{ color: "#ff6b6b", fontSize: 12 }}>⚠</span>
              <span style={{ fontFamily: "var(--font-inter)", color: "#ff6b6b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Supplier Delay Detected
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-inter)", color: "var(--off-white)", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Hydraulic Valve HV-442
            </p>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 10 }}>
                Midwest Hydraulics · Lead time +21 days
              </span>
              <span style={{ fontFamily: "var(--font-inter)", color: "#ff6b6b", fontSize: 10 }}>
                PO #8821 updated 4 min ago
              </span>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {show("analyzing") && phase !== "idle" && (
          <div
            className="flex items-center gap-3 transition-all duration-400"
            style={{ opacity: show("analyzing") ? 1 : 0 }}
          >
            <div className="flex gap-0.5">
              {[0,1,2].map(i => (
                <div key={i} className="w-1 h-1 rounded-full bg-[var(--coral)]"
                  style={{ animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <span style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 11 }}>
              {show("impact") ? "Impact analysis complete" : "Tracing cascade across 47 work orders..."}
            </span>
          </div>
        )}

        {/* Impact summary */}
        {show("impact") && phase !== "idle" && (
          <div
            className="grid grid-cols-3 gap-2 transition-all duration-500"
            style={{ opacity: show("impact") ? 1 : 0, transform: show("impact") ? "translateY(0)" : "translateY(8px)" }}
          >
            {[
              { n: "14", label: "WOs affected", color: "#ff6b6b" },
              { n: "8", label: "deliveries at risk", color: "#ffb347" },
              { n: "$340K", label: "revenue exposure", color: "#ff6b6b" },
            ].map(({ n, label, color }) => (
              <div key={label} className="border border-[var(--border)] rounded-sm p-3 text-center">
                <p style={{ fontFamily: "var(--font-inter)", color, fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{n}</p>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 9, marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Affected orders */}
        {show("impact") && phase !== "idle" && (
          <div className="space-y-1.5">
            {affectedOrders.map((o, i) => (
              <div
                key={o.id}
                className="flex items-center justify-between border border-[var(--border)] rounded-sm px-3 py-2 transition-all duration-300"
                style={{
                  opacity: show("impact") ? 1 : 0,
                  transitionDelay: `${i * 80}ms`,
                  background: o.risk === "high" ? "rgba(255,107,107,0.04)" : "transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "var(--font-inter)", color: "var(--coral)", fontSize: 10, fontWeight: 600 }}>{o.id}</span>
                  <span style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 10 }}>{o.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 10 }}>Due {o.due}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-bold" style={{
                    fontFamily: "var(--font-inter)",
                    background: o.risk === "high" ? "rgba(255,107,107,0.12)" : o.risk === "medium" ? "rgba(255,179,71,0.12)" : "rgba(77,128,255,0.1)",
                    color: o.risk === "high" ? "#ff6b6b" : o.risk === "medium" ? "#ffb347" : "var(--coral)",
                    border: `1px solid ${o.risk === "high" ? "rgba(255,107,107,0.3)" : o.risk === "medium" ? "rgba(255,179,71,0.3)" : "rgba(77,128,255,0.2)"}`,
                  }}>
                    {o.risk === "high" ? "AT RISK" : o.risk === "medium" ? "MONITOR" : "SAFE"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended actions */}
        {show("actions") && phase !== "idle" && (
          <div className="space-y-2">
            <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Recommended Actions
            </p>
            {actions.map((a, i) => (
              <div
                key={a.label}
                className="flex items-center justify-between border rounded-sm px-3 py-2.5 transition-all duration-400"
                style={{
                  opacity: i < actionsDone ? 1 : 0,
                  transform: i < actionsDone ? "translateY(0)" : "translateY(6px)",
                  transitionDelay: `${i * 100}ms`,
                  borderColor: i < actionsDone ? (phase === "resolved" ? "rgba(74,222,128,0.3)" : "rgba(77,128,255,0.3)") : "var(--border)",
                  background: i < actionsDone ? (phase === "resolved" ? "rgba(74,222,128,0.04)" : "rgba(77,128,255,0.04)") : "transparent",
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-inter)", color: "var(--off-white)", fontSize: 11 }}>{a.label}</p>
                  <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 10 }}>{a.saves}</p>
                </div>
                <div className="flex items-center gap-2">
                  {a.cost && <span style={{ fontFamily: "var(--font-inter)", color: "#ffb347", fontSize: 10 }}>{a.cost}</span>}
                  <span className="text-[9px] px-2 py-1 rounded-sm font-bold" style={{
                    fontFamily: "var(--font-inter)",
                    background: phase === "resolved" ? "rgba(74,222,128,0.12)" : "rgba(77,128,255,0.1)",
                    color: phase === "resolved" ? "#4ade80" : "var(--coral)",
                    border: `1px solid ${phase === "resolved" ? "rgba(74,222,128,0.3)" : "rgba(77,128,255,0.2)"}`,
                  }}>
                    {phase === "resolved" ? "✓ Done" : a.type === "approve" ? "Approve" : a.type === "auto" ? "Auto" : "Send"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resolved */}
        {phase === "resolved" && (
          <div className="border rounded-sm px-4 py-3 transition-all duration-500"
            style={{ borderColor: "rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.05)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: "var(--font-inter)", color: "#4ade80", fontSize: 11, fontWeight: 600 }}>
                  ✓ Cascade intercepted
                </p>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 10 }}>
                  6 deliveries protected · Line never stopped
                </p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Detection time</p>
                <p style={{ fontFamily: "var(--font-inter)", color: "#4ade80", fontSize: 13, fontWeight: 700 }}>47 min</p>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 9 }}>vs. days without Aztela</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
