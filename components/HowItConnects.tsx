"use client";

import { useEffect, useRef, useState } from "react";

/* ── Step 1 widget: systems connecting one by one ── */
const SYSTEMS = [
  { name: "SAP / Oracle / NetSuite", type: "ERP" },
  { name: "WMS · Manhattan · 3PL Central", type: "Warehouse" },
  { name: "Supplier portals & PO feeds", type: "Suppliers" },
  { name: "MES · work orders · BOM data", type: "Floor" },
];

function ConnectWidget() {
  const [connected, setConnected] = useState(0);

  useEffect(() => {
    setConnected(0);
    const timers = SYSTEMS.map((_, i) =>
      setTimeout(() => setConnected(i + 1), 600 + i * 700)
    );
    const loop = setInterval(() => {
      setConnected(0);
      SYSTEMS.forEach((_, i) =>
        setTimeout(() => setConnected(i + 1), 600 + i * 700)
      );
    }, 6000);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  return (
    <div className="space-y-2">
      {SYSTEMS.map((s, i) => (
        <div
          key={s.name}
          className="flex items-center gap-3 border rounded-sm px-3 py-2.5 transition-all duration-500"
          style={{
            borderColor: i < connected ? "rgba(77,128,255,0.3)" : "var(--border)",
            background: i < connected ? "rgba(77,128,255,0.05)" : "transparent",
            opacity: i < connected ? 1 : 0.3,
            transform: i < connected ? "translateX(0)" : "translateX(-6px)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300"
            style={{ background: i < connected ? "#4ade80" : "var(--border)" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--off-white)] truncate" style={{ fontFamily: "var(--font-inter)" }}>{s.name}</p>
          </div>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-sm shrink-0 transition-all duration-300"
            style={{
              fontFamily: "var(--font-inter)",
              background: i < connected ? "rgba(74,222,128,0.1)" : "transparent",
              color: i < connected ? "#4ade80" : "var(--muted)",
              border: `1px solid ${i < connected ? "rgba(74,222,128,0.25)" : "transparent"}`,
            }}
          >
            {i < connected ? "✓ Connected" : s.type}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Step 2 widget: operation being modelled live ── */
const MODEL_ITEMS = [
  { label: "Chicago Warehouse", value: "847 units", type: "inventory" },
  { label: "Detroit Warehouse", value: "23 units", type: "inventory", warn: true },
  { label: "Work Order #4821", value: "Stage 3 / 5", type: "wip" },
  { label: "Supplier HV-442", value: "On time", type: "supplier" },
  { label: "Open quotes", value: "14 active", type: "pricing" },
  { label: "Delivery windows at risk", value: "3 this week", type: "floor", warn: true },
];

function ModelWidget() {
  const [visible, setVisible] = useState(0);
  const [pulse, setPulse] = useState<number | null>(null);

  useEffect(() => {
    setVisible(0);
    setPulse(null);
    const timers: ReturnType<typeof setTimeout>[] = [];
    MODEL_ITEMS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(i + 1), 300 + i * 450));
    });
    timers.push(setTimeout(() => setPulse(1), 3200));
    timers.push(setTimeout(() => setPulse(null), 4200));

    const loop = setInterval(() => {
      setVisible(0);
      setPulse(null);
      MODEL_ITEMS.forEach((_, i) => {
        timers.push(setTimeout(() => setVisible(i + 1), 300 + i * 450));
      });
      timers.push(setTimeout(() => setPulse(1), 3200));
      timers.push(setTimeout(() => setPulse(null), 4200));
    }, 7000);

    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {MODEL_ITEMS.map((m, i) => (
        <div
          key={m.label}
          className="border rounded-sm px-3 py-2.5 transition-all duration-500"
          style={{
            borderColor: pulse === i ? "rgba(255,179,71,0.4)" : m.warn && visible > i ? "rgba(255,107,107,0.25)" : "var(--border)",
            background: pulse === i ? "rgba(255,179,71,0.06)" : m.warn && visible > i ? "rgba(255,107,107,0.04)" : "transparent",
            opacity: visible > i ? 1 : 0,
            transform: visible > i ? "translateY(0)" : "translateY(6px)",
          }}
        >
          <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 9, marginBottom: 2 }}>{m.label}</p>
          <p style={{ fontFamily: "var(--font-inter)", color: m.warn ? "#ff6b6b" : "var(--off-white)", fontSize: 12, fontWeight: 600 }}>{m.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Step 3 widget: alerts firing ── */
type AlertPhase = "idle" | "detecting" | "tracing" | "action" | "resolved";

const ALERTS = [
  { time: "09:14", text: "Supplier delay detected — HV-442 +21 days", type: "warn" },
  { time: "09:14", text: "14 work orders affected · 8 deliveries at risk", type: "warn" },
  { time: "09:15", text: "Expedite from alt supplier recommended", type: "info" },
  { time: "09:47", text: "Cascade intercepted · 6 deliveries protected", type: "ok" },
];

function AlertWidget() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const timers = ALERTS.map((_, i) =>
      setTimeout(() => setVisible(i + 1), 500 + i * 1000)
    );
    const loop = setInterval(() => {
      setVisible(0);
      ALERTS.forEach((_, i) =>
        setTimeout(() => setVisible(i + 1), 500 + i * 1000)
      );
    }, 7500);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  const typeColor = { warn: "#ff6b6b", info: "var(--coral)", ok: "#4ade80" };
  const typeBg    = { warn: "rgba(255,107,107,0.07)", info: "rgba(77,128,255,0.07)", ok: "rgba(74,222,128,0.07)" };
  const typeBorder= { warn: "rgba(255,107,107,0.25)", info: "rgba(77,128,255,0.25)", ok: "rgba(74,222,128,0.25)" };

  return (
    <div className="space-y-2">
      {ALERTS.map((a, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-sm px-3 py-2.5 transition-all duration-500"
          style={{
            background: i < visible ? typeBg[a.type as keyof typeof typeBg] : "transparent",
            border: `1px solid ${i < visible ? typeBorder[a.type as keyof typeof typeBorder] : "var(--border)"}`,
            opacity: i < visible ? 1 : 0.2,
            transform: i < visible ? "translateX(0)" : "translateX(8px)",
          }}
        >
          <span style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 9, whiteSpace: "nowrap", paddingTop: 2 }}>{a.time}</span>
          <p style={{ fontFamily: "var(--font-inter)", color: typeColor[a.type as keyof typeof typeColor], fontSize: 11, lineHeight: 1.4 }}>{a.text}</p>
        </div>
      ))}
      {visible === 0 && (
        <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted)", fontSize: 11, textAlign: "center", paddingTop: 8 }}>
          Monitoring · waiting for signals...
        </p>
      )}
    </div>
  );
}

/* ── Main section ── */
const STEPS = [
  {
    n: "01",
    title: "Connect",
    body: "We plug into the systems you already run — ERP, WMS, supplier portals, and floor data. No new software for your team. No IT project. Live in 2–4 weeks.",
    widget: <ConnectWidget />,
  },
  {
    n: "02",
    title: "Model",
    body: "We build a live model of your specific operation — inventory positions, open work orders, supplier statuses, open quotes. Not generic dashboards. Your operation, exactly as it runs.",
    widget: <ModelWidget />,
  },
  {
    n: "03",
    title: "Alert",
    body: "We watch continuously and surface the moments that matter — before they cost you. You get a specific signal, a specific impact, and a specific recommended action. Not a report to explore.",
    widget: <AlertWidget />,
  },
];

export default function HowItConnects() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="px-6 py-24 md:py-32 bg-[var(--charcoal-light)]">
      <div className="max-w-6xl mx-auto">

        <div className="mb-16 reveal visible">
          <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
            How it works
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] max-w-xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            We model your operation.<br />
            <span className="text-[var(--coral)]">Not just your data.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--border)]">
          {STEPS.map(({ n, title, body, widget }, i) => (
            <div
              key={n}
              className="bg-[var(--charcoal-light)] p-8 flex flex-col gap-6 transition-all duration-700"
              style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 120}ms` }}
            >
              {/* Step number + title */}
              <div>
                <p style={{ fontFamily: "var(--font-playfair)", color: "var(--coral)", fontSize: 11, opacity: 0.5, marginBottom: 8, letterSpacing: "0.1em" }}>{n}</p>
                <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{body}</p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[var(--border)]" />

              {/* Live widget */}
              <div>{widget}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
