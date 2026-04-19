"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "alerting" | "cascading" | "analyzing" | "intercepting" | "resolved";

const NODES = [
  { id: "sup-a", label: "Supplier A",      sub: "Steel Components",   x: 7,  y: 18 },
  { id: "sup-b", label: "Supplier B",      sub: "Component HV-442",   x: 7,  y: 50 },
  { id: "sup-c", label: "Supplier C",      sub: "Hydraulic Parts",    x: 7,  y: 82 },
  { id: "comp",  label: "Components",      sub: "Live inventory",      x: 30, y: 50 },
  { id: "wo",    label: "Work Orders",     sub: "14 active",           x: 54, y: 26 },
  { id: "branch",label: "Branch Network",  sub: "8 locations",         x: 54, y: 74 },
  { id: "prod",  label: "Production",      sub: "Lines 1 & 2",         x: 76, y: 50 },
  { id: "cust-a",label: "Customer A",      sub: "Priority",            x: 95, y: 20 },
  { id: "cust-b",label: "Customer B",      sub: "Net-30",              x: 95, y: 50 },
  { id: "cust-c",label: "Customer C",      sub: "Net-60",              x: 95, y: 80 },
];

const EDGES = [
  { from: "sup-a", to: "comp",   cascade: false },
  { from: "sup-b", to: "comp",   cascade: true  },
  { from: "sup-c", to: "comp",   cascade: false },
  { from: "comp",  to: "wo",     cascade: true  },
  { from: "comp",  to: "branch", cascade: false },
  { from: "wo",    to: "prod",   cascade: true  },
  { from: "branch",to: "prod",   cascade: false },
  { from: "prod",  to: "cust-a", cascade: true  },
  { from: "prod",  to: "cust-b", cascade: true  },
  { from: "prod",  to: "cust-c", cascade: false },
];

const CASCADE_NODES = new Set(["sup-b", "comp", "wo", "prod", "cust-a", "cust-b"]);
const INTERCEPT_NODES = new Set(["comp", "wo", "prod"]);

const PHASE_DURATIONS: Record<Phase, number> = {
  idle:         2800,
  alerting:     2200,
  cascading:    2800,
  analyzing:    2000,
  intercepting: 3200,
  resolved:     2800,
};

const PHASE_ORDER: Phase[] = ["idle", "alerting", "cascading", "analyzing", "intercepting", "resolved"];

const STATUS: Record<Phase, { text: string; color: string }> = {
  idle:         { text: "Monitoring 847 operational signals across your network", color: "#4d80ff" },
  alerting:     { text: "⚠ Supplier delay detected — Component HV-442 · 3 weeks late", color: "#ff6b6b" },
  cascading:    { text: "Cascade analysis running — 14 work orders affected · 8 deliveries at risk · $340K exposure", color: "#ffb347" },
  analyzing:    { text: "Aztela tracing full impact across operational network...", color: "#4d80ff" },
  intercepting: { text: "Actions surfaced — Expedite alt supplier · Reschedule 6 WOs · Notify 3 customers", color: "#4ade80" },
  resolved:     { text: "✓ Cascade intercepted · 47 min · Line never stopped · 0 customer escalations", color: "#4ade80" },
};

function nodeColor(id: string, phase: Phase): { bg: string; border: string; glow: string; text: string } {
  const isAlert = id === "sup-b";
  const isCascade = CASCADE_NODES.has(id) && !isAlert;
  const isIntercept = INTERCEPT_NODES.has(id);

  if (phase === "idle" || phase === "resolved") {
    const c = phase === "resolved" && CASCADE_NODES.has(id) ? "#4ade80" : "#4d80ff";
    return { bg: `${c}12`, border: `${c}30`, glow: "none", text: c };
  }
  if (phase === "alerting" && isAlert) {
    return { bg: "rgba(255,107,107,0.15)", border: "rgba(255,107,107,0.6)", glow: "0 0 20px rgba(255,107,107,0.4)", text: "#ff6b6b" };
  }
  if (phase === "cascading" && CASCADE_NODES.has(id)) {
    const c = isAlert ? "#ff6b6b" : "#ffb347";
    return { bg: `${c}15`, border: `${c}50`, glow: `0 0 14px ${c}35`, text: c };
  }
  if ((phase === "analyzing" || phase === "intercepting") && isIntercept) {
    const c = phase === "intercepting" ? "#4ade80" : "#4d80ff";
    return { bg: `${c}12`, border: `${c}50`, glow: `0 0 16px ${c}30`, text: c };
  }
  return { bg: "rgba(77,128,255,0.08)", border: "rgba(77,128,255,0.2)", glow: "none", text: "var(--muted)" };
}

function edgeColor(edge: typeof EDGES[0], phase: Phase): { stroke: string; dash: string; width: number } {
  if (phase === "cascading" && edge.cascade) return { stroke: "#ff6b6b", dash: "5 3", width: 1.5 };
  if (phase === "intercepting" && edge.cascade) return { stroke: "#4ade80", dash: "4 3", width: 1.5 };
  if (phase === "resolved" && edge.cascade) return { stroke: "#4ade80", dash: "none", width: 1 };
  return { stroke: "rgba(77,128,255,0.18)", dash: "none", width: 1 };
}

function getPos(id: string) {
  return NODES.find(n => n.id === id)!;
}

export default function OperationalNetwork() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(false);
  const [actionTags, setActionTags] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let phaseIdx = 0;

    const advance = () => {
      const current = PHASE_ORDER[phaseIdx % PHASE_ORDER.length];
      setPhase(current);
      setActionTags([]);
      if (current === "intercepting") {
        setTimeout(() => setActionTags(["Expedite alt supplier"]), 400);
        setTimeout(() => setActionTags(a => [...a, "Reschedule WO-118"]), 900);
        setTimeout(() => setActionTags(a => [...a, "Notify 3 customers"]), 1400);
      }
      phaseIdx++;
      timerRef.current = setTimeout(advance, PHASE_DURATIONS[current]);
    };

    advance();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible]);

  const status = STATUS[phase];

  return (
    <section className="px-6 py-24 md:py-32" style={{ background: "var(--charcoal)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
            Live Operational Intelligence
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight max-w-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
            Your operation is a live network.<br />
            <span className="text-[var(--coral)]">We make the invisible visible.</span>
          </h2>
          <p className="text-[var(--muted)] text-lg font-light max-w-xl" style={{ fontFamily: "var(--font-inter)" }}>
            Aztela builds a unified model of your entire supply chain — suppliers, inventory, work orders, production, and customers — and watches it in real time. When something slips, we trace the full cascade before it costs you money.
          </p>
        </div>

        {/* Network */}
        <div ref={ref} className="relative border border-[var(--border)] rounded-sm overflow-hidden"
          style={{ background: "rgba(18,18,22,0.6)" }}>

          {/* Status bar */}
          <div className="border-b border-[var(--border)] px-6 py-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: status.color }} />
            <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: status.color, transition: "color 0.4s ease" }}>
              {status.text}
            </span>
          </div>

          {/* Graph area */}
          <div className="relative" style={{ height: 360 }}>

            {/* SVG edges */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
              {EDGES.map(e => {
                const from = getPos(e.from);
                const to = getPos(e.to);
                const style = edgeColor(e, phase);
                return (
                  <line key={`${e.from}-${e.to}`}
                    x1={`${from.x}%`} y1={`${from.y}%`}
                    x2={`${to.x}%`} y2={`${to.y}%`}
                    stroke={style.stroke}
                    strokeWidth={style.width}
                    strokeDasharray={style.dash}
                    style={{ transition: "stroke 0.6s ease, stroke-width 0.4s ease" }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {NODES.map(n => {
              const c = nodeColor(n.id, phase);
              return (
                <div key={n.id} className="absolute flex flex-col items-center"
                  style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)", zIndex: 2 }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                    style={{
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      boxShadow: c.glow,
                      transition: "all 0.5s ease",
                    }}>
                    <span style={{ fontSize: 16, opacity: 0.85 }}>
                      {n.id.startsWith("sup") ? "⬡" : n.id === "comp" ? "◈" : n.id === "wo" ? "≡" : n.id === "branch" ? "⊞" : n.id === "prod" ? "⚙" : "◎"}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight" style={{ fontFamily: "var(--font-inter)", color: c.text, transition: "color 0.5s ease", whiteSpace: "nowrap" }}>
                    {n.label}
                  </span>
                  <span className="text-[9px] text-center" style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {n.sub}
                  </span>

                  {/* Alert badge */}
                  {phase === "alerting" && n.id === "sup-b" && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-sm text-[9px] font-semibold whitespace-nowrap animate-bounce"
                      style={{ fontFamily: "var(--font-inter)", background: "rgba(255,107,107,0.15)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.4)" }}>
                      3-week delay
                    </div>
                  )}

                  {/* Cascade badge */}
                  {phase === "cascading" && n.id === "wo" && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-sm text-[9px] font-semibold whitespace-nowrap"
                      style={{ fontFamily: "var(--font-inter)", background: "rgba(255,179,71,0.15)", color: "#ffb347", border: "1px solid rgba(255,179,71,0.4)" }}>
                      14 WOs at risk
                    </div>
                  )}

                  {/* Resolved badge */}
                  {phase === "resolved" && CASCADE_NODES.has(n.id) && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <span style={{ color: "#4ade80", fontSize: 11 }}>✓</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Aztela intercept overlay */}
            {phase === "intercepting" && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10 }}>
                <div className="px-4 py-2 rounded-sm text-xs font-semibold"
                  style={{ fontFamily: "var(--font-inter)", background: "rgba(77,128,255,0.15)", color: "#4d80ff", border: "1px solid rgba(77,128,255,0.4)" }}>
                  Aztela · Cascade Intercepted
                </div>
                <div className="flex flex-col gap-1.5 items-center">
                  {actionTags.map(tag => (
                    <div key={tag} className="px-3 py-1 rounded-sm text-[10px] font-medium"
                      style={{ fontFamily: "var(--font-inter)", background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
                      → {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolved overlay */}
            {phase === "resolved" && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="px-5 py-2 rounded-sm text-xs font-semibold"
                  style={{ fontFamily: "var(--font-inter)", background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
                  ✓ Cascade intercepted · 47 min · Line never stopped
                </div>
              </div>
            )}
          </div>

          {/* Bottom metrics */}
          <div className="border-t border-[var(--border)] px-6 py-4 grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { label: "Suppliers monitored", val: "38" },
              { label: "SKUs tracked", val: "14,200" },
              { label: "Work orders live", val: "847" },
              { label: "Avg detection time", val: "47 min" },
              { label: "Stoppages prevented", val: "Zero" },
              { label: "Signal latency", val: "<2 min" },
            ].map(m => (
              <div key={m.label}>
                <p className="text-xs font-bold text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{m.val}</p>
                <p className="text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
