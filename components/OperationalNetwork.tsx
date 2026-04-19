"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ReactFlow, Handle, Position, useNodesState, useEdgesState, Background, BackgroundVariant, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type Phase = "idle" | "alerting" | "cascading" | "analyzing" | "intercepting" | "resolved";

const PHASE_ORDER: Phase[] = ["idle", "alerting", "cascading", "analyzing", "intercepting", "resolved"];
const PHASE_MS: Record<Phase, number> = {
  idle: 2800, alerting: 2200, cascading: 2600, analyzing: 2000, intercepting: 3400, resolved: 2600,
};

const STATUS: Record<Phase, { text: string; color: string }> = {
  idle:         { text: "Monitoring 847 operational signals across your network", color: "#4d80ff" },
  alerting:     { text: "⚠  Supplier delay detected — Component HV-442 · 3 weeks late", color: "#ff6b6b" },
  cascading:    { text: "Cascade analysis — 14 work orders affected · 8 deliveries at risk · $340K exposure", color: "#ffb347" },
  analyzing:    { text: "Aztela tracing full impact across operational model...", color: "#4d80ff" },
  intercepting: { text: "Actions surfaced — Expedite alt supplier · Reschedule 6 WOs · Notify 3 customers proactively", color: "#4ade80" },
  resolved:     { text: "✓  Cascade intercepted · 47 min · Line never stopped · 0 customer escalations", color: "#4ade80" },
};

const CASCADE_IDS = new Set(["sup-b", "comp", "wo", "prod", "cust-a", "cust-b"]);
const INTERCEPT_IDS = new Set(["comp", "wo", "prod"]);

const ACTIONS = [
  "Expedite from alt supplier — Grainger",
  "Reschedule WO-118 · WO-121 · WO-124",
  "3 customers notified proactively",
];

const NODE_DEFS = [
  { id: "sup-a", label: "Supplier A",     sub: "Steel Components",  icon: "⬡", pos: { x: 20,  y: 80  } },
  { id: "sup-b", label: "Supplier B",     sub: "Component HV-442",  icon: "⬡", pos: { x: 20,  y: 200 } },
  { id: "sup-c", label: "Supplier C",     sub: "Hydraulic Parts",   icon: "⬡", pos: { x: 20,  y: 320 } },
  { id: "comp",  label: "Components",     sub: "Live inventory",     icon: "◈", pos: { x: 240, y: 200 } },
  { id: "wo",    label: "Work Orders",    sub: "14 active",          icon: "≡", pos: { x: 460, y: 90  } },
  { id: "branch",label: "Branch Network", sub: "8 locations",        icon: "⊞", pos: { x: 460, y: 310 } },
  { id: "prod",  label: "Production",     sub: "Lines 1 & 2",        icon: "⚙", pos: { x: 670, y: 200 } },
  { id: "cust-a",label: "Customer A",     sub: "Priority",           icon: "◎", pos: { x: 880, y: 80  } },
  { id: "cust-b",label: "Customer B",     sub: "Net-30",             icon: "◎", pos: { x: 880, y: 200 } },
  { id: "cust-c",label: "Customer C",     sub: "Net-60",             icon: "◎", pos: { x: 880, y: 320 } },
];

const EDGE_DEFS = [
  { id: "e1", source: "sup-a", target: "comp",   cascade: false },
  { id: "e2", source: "sup-b", target: "comp",   cascade: true  },
  { id: "e3", source: "sup-c", target: "comp",   cascade: false },
  { id: "e4", source: "comp",  target: "wo",     cascade: true  },
  { id: "e5", source: "comp",  target: "branch", cascade: false },
  { id: "e6", source: "wo",    target: "prod",   cascade: true  },
  { id: "e7", source: "branch",target: "prod",   cascade: false },
  { id: "e8", source: "prod",  target: "cust-a", cascade: true  },
  { id: "e9", source: "prod",  target: "cust-b", cascade: true  },
  { id: "e10",source: "prod",  target: "cust-c", cascade: false },
];

function nodeStyle(id: string, phase: Phase) {
  const isAlert = id === "sup-b";
  const isCascade = CASCADE_IDS.has(id) && !isAlert;
  const isIntercept = INTERCEPT_IDS.has(id);
  const isResolved = phase === "resolved";

  if (isResolved) {
    const c = CASCADE_IDS.has(id) ? "#4ade80" : "#4d80ff";
    return { bg: `${c}12`, border: `1px solid ${c}28`, glow: "none", tc: c };
  }
  if (phase === "alerting" && isAlert)
    return { bg: "rgba(255,107,107,0.14)", border: "1px solid rgba(255,107,107,0.55)", glow: "0 0 22px rgba(255,107,107,0.35)", tc: "#ff6b6b" };
  if (phase === "cascading" && CASCADE_IDS.has(id)) {
    const c = isAlert ? "#ff6b6b" : "#ffb347";
    return { bg: `${c}14`, border: `1px solid ${c}50`, glow: `0 0 16px ${c}30`, tc: c };
  }
  if ((phase === "analyzing" || phase === "intercepting") && isIntercept) {
    const c = phase === "intercepting" ? "#4ade80" : "#4d80ff";
    return { bg: `${c}12`, border: `1px solid ${c}45`, glow: `0 0 18px ${c}28`, tc: c };
  }
  return { bg: "rgba(77,128,255,0.08)", border: "1px solid rgba(77,128,255,0.18)", glow: "none", tc: "rgba(200,210,230,0.6)" };
}

function badge(id: string, phase: Phase): { text: string; color: string; bg: string } | null {
  if (phase === "alerting" && id === "sup-b") return { text: "3-week delay", color: "#ff6b6b", bg: "rgba(255,107,107,0.12)" };
  if (phase === "cascading" && id === "wo") return { text: "14 WOs at risk", color: "#ffb347", bg: "rgba(255,179,71,0.12)" };
  if (phase === "resolved" && id === "prod") return { text: "✓ Protected", color: "#4ade80", bg: "rgba(74,222,128,0.1)" };
  return null;
}

// Custom node
function OpNode({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    label: string; sub: string; icon: string;
    bg: string; border: string; glow: string; tc: string;
    badge: { text: string; color: string; bg: string } | null;
  };
  const handleStyle = { background: "transparent", border: "none", width: 6, height: 6 };
  return (
    <div style={{
      width: 90, padding: "8px 8px 7px", borderRadius: 6,
      background: d.bg, border: d.border, boxShadow: d.glow,
      transition: "all 0.55s ease", textAlign: "center", position: "relative",
      backdropFilter: "blur(4px)",
    }}>
      <Handle type="target" position={Position.Left}   style={handleStyle} />
      <Handle type="target" position={Position.Top}    style={handleStyle} />
      <Handle type="source" position={Position.Right}  style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      {d.badge && (
        <div style={{
          position: "absolute", top: -24, left: "50%", transform: "translateX(-50%)",
          background: d.badge.bg, border: `1px solid ${d.badge.color}40`,
          color: d.badge.color, fontSize: 9, padding: "2px 7px", borderRadius: 3,
          whiteSpace: "nowrap", fontFamily: "var(--font-inter)", fontWeight: 600, letterSpacing: "0.04em",
        }}>{d.badge.text}</div>
      )}
      <div style={{ fontSize: 14, marginBottom: 4, color: d.tc, transition: "color 0.55s ease" }}>{d.icon as string}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: d.tc, fontFamily: "var(--font-inter)", transition: "color 0.55s ease", lineHeight: 1.2 }}>{d.label as string}</div>
      <div style={{ fontSize: 8.5, color: "rgba(180,190,210,0.4)", fontFamily: "var(--font-inter)", marginTop: 2 }}>{d.sub as string}</div>
    </div>
  );
}

const nodeTypes = { op: OpNode };

function buildNodes(phase: Phase): Node[] {
  return NODE_DEFS.map(n => {
    const s = nodeStyle(n.id, phase);
    return {
      id: n.id, type: "op", position: n.pos, draggable: false, selectable: false, focusable: false,
      data: { label: n.label, sub: n.sub, icon: n.icon, ...s, badge: badge(n.id, phase) },
    };
  });
}

function buildEdges(phase: Phase): Edge[] {
  return EDGE_DEFS.map(e => {
    const isCascading = e.cascade && phase === "cascading";
    const isIntercepting = e.cascade && (phase === "intercepting" || phase === "resolved");
    return {
      id: e.id, source: e.source, target: e.target,
      type: "smoothstep",
      animated: isCascading || isIntercepting || phase === "idle",
      style: {
        stroke: isCascading ? "#ff6b6b" : isIntercepting ? "#4ade80" : "rgba(77,128,255,0.22)",
        strokeWidth: isCascading || isIntercepting ? 1.5 : 1,
        strokeDasharray: isCascading ? "6 3" : "none",
        transition: "stroke 0.6s ease",
      },
    };
  });
}

export default function OperationalNetwork() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(false);
  const [actionTags, setActionTags] = useState<string[]>([]);
  const [nodes, setNodes] = useNodesState(buildNodes("idle"));
  const [edges, setEdges] = useEdgesState(buildEdges("idle"));
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const t = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const run = useCallback(() => {
    clearAll(); setActionTags([]);
    let idx = 0;
    const advance = () => {
      const p = PHASE_ORDER[idx % PHASE_ORDER.length];
      setPhase(p);
      setNodes(buildNodes(p));
      setEdges(buildEdges(p));
      setActionTags([]);
      if (p === "intercepting") {
        ACTIONS.forEach((a, i) => { t(() => setActionTags(prev => [...prev, a]), i * 550); });
      }
      idx++;
      timers.current.push(setTimeout(advance, PHASE_MS[p]));
    };
    advance();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => { if (visible) run(); return () => clearAll(); }, [visible]);

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

        <div ref={ref} className="border border-[var(--border)] rounded-sm overflow-hidden" style={{ background: "rgba(10,11,16,0.85)" }}>

          {/* Status bar */}
          <div className="border-b border-[var(--border)] px-6 py-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: status.color, transition: "background 0.4s ease" }} />
            <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: status.color, transition: "color 0.4s ease" }}>
              {status.text}
            </span>
          </div>

          {/* React Flow graph */}
          <div style={{ height: 440, position: "relative" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.18 }}
              panOnDrag={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              proOptions={{ hideAttribution: true }}
              style={{ background: "transparent" }}
            >
              <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(77,128,255,0.06)" />
            </ReactFlow>

            {/* Intercept overlay */}
            {phase === "intercepting" && actionTags.length > 0 && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10, pointerEvents: "none" }}>
                <div className="px-4 py-1.5 rounded-sm text-xs font-semibold"
                  style={{ fontFamily: "var(--font-inter)", background: "rgba(10,11,16,0.92)", color: "#4d80ff", border: "1px solid rgba(77,128,255,0.4)", backdropFilter: "blur(8px)" }}>
                  Aztela · Cascade Intercepted
                </div>
                {actionTags.map(tag => (
                  <div key={tag} className="px-3 py-1 rounded-sm text-[10px] font-medium"
                    style={{ fontFamily: "var(--font-inter)", background: "rgba(10,11,16,0.88)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", backdropFilter: "blur(8px)" }}>
                    → {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Resolved overlay */}
            {phase === "resolved" && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2" style={{ zIndex: 10, pointerEvents: "none" }}>
                <div className="px-5 py-2 rounded-sm text-xs font-semibold"
                  style={{ fontFamily: "var(--font-inter)", background: "rgba(10,11,16,0.88)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.35)", backdropFilter: "blur(8px)" }}>
                  ✓ Cascade intercepted · 47 min · Line never stopped
                </div>
              </div>
            )}
          </div>

          {/* Bottom metrics */}
          <div className="border-t border-[var(--border)] px-6 py-4 grid grid-cols-3 md:grid-cols-6 gap-6">
            {[
              { val: "38",     label: "Suppliers monitored" },
              { val: "14,200", label: "SKUs tracked" },
              { val: "847",    label: "Work orders live" },
              { val: "47 min", label: "Avg detection time" },
              { val: "Zero",   label: "Stoppages prevented" },
              { val: "<2 min", label: "Signal latency" },
            ].map(m => (
              <div key={m.label}>
                <p className="text-sm font-bold text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{m.val}</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
