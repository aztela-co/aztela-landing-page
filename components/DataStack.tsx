"use client";

import { useEffect, useRef, useState } from "react";

const LAYERS = [
  {
    level: "01",
    name: "Your Existing Systems",
    desc: "We connect to what you already run. No rip-and-replace.",
    color: "var(--muted)",
    accent: "rgba(110,117,128,0.15)",
    border: "var(--border)",
    items: ["ERP — SAP · Oracle · NetSuite", "WMS · 3PL · Warehouse systems", "MRP · Work orders · BOM data", "Supplier portals · PO feeds"],
  },
  {
    level: "02",
    name: "Aztela Operational Model",
    desc: "Proprietary live model connecting your data into a single operational picture.",
    color: "#4d80ff",
    accent: "rgba(77,128,255,0.07)",
    border: "rgba(77,128,255,0.25)",
    items: ["Live data integration", "Cascade logic & impact tracing", "Demand & inventory modeling", "Supplier risk correlation"],
  },
  {
    level: "03",
    name: "Operational Intelligence",
    desc: "What you act on — before problems reach the floor.",
    color: "#4ade80",
    accent: "rgba(74,222,128,0.07)",
    border: "rgba(74,222,128,0.25)",
    items: ["Real-time cascade alerts", "Recommended actions surfaced", "Live margin & inventory dashboards", "Delivery risk flagging"],
  },
];

export default function DataStack() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        LAYERS.forEach((_, i) => {
          setTimeout(() => setVisible(v => Math.max(v, i + 1)), i * 320);
        });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              How We're Built
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              We don't replace your systems.<br />
              <span className="text-[var(--coral)]">We model what's happening inside them.</span>
            </h2>
            <p className="text-[var(--muted)] leading-relaxed mb-8" style={{ fontFamily: "var(--font-inter)" }}>
              Aztela sits on top of your existing ERP, WMS, and supplier data — connecting it into a live operational model. No migrations. No new systems. First results in 30 days.
            </p>
            <div className="space-y-3">
              {["Connect in days, not months", "No data migration or replacement", "Proprietary cascade & margin logic", "Works alongside your existing team"].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <span style={{ color: "#4ade80", fontSize: 11 }}>✓</span>
                  <span className="text-sm text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stacking layers */}
          <div ref={ref} className="relative flex flex-col gap-0" style={{ perspective: "1000px" }}>
            {LAYERS.map((layer, i) => (
              <div
                key={layer.name}
                style={{
                  opacity: visible > i ? 1 : 0,
                  transform: visible > i ? "translateY(0) rotateX(0deg)" : "translateY(24px) rotateX(4deg)",
                  transition: `opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`,
                  borderTop: i > 0 ? "none" : `1px solid ${layer.border}`,
                  borderLeft: `1px solid ${layer.border}`,
                  borderRight: `1px solid ${layer.border}`,
                  borderBottom: `1px solid ${layer.border}`,
                  background: layer.accent,
                  position: "relative",
                  zIndex: i + 1,
                }}
              >
                {/* Layer connector line */}
                {i < LAYERS.length - 1 && (
                  <div style={{
                    position: "absolute", bottom: -1, left: "50%",
                    width: 1, height: 1,
                    background: "var(--border)",
                    zIndex: 0,
                  }} />
                )}

                <div className="px-6 py-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[9px] font-semibold tracking-[0.15em] uppercase mr-3" style={{ fontFamily: "var(--font-inter)", color: layer.color }}>
                        Layer {layer.level}
                      </span>
                      <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: layer.color }}>
                        {layer.name}
                      </span>
                    </div>
                    <div className="w-5 h-px mt-3 shrink-0" style={{ background: layer.color }} />
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    {layer.desc}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {layer.items.map(item => (
                      <div key={item} className="flex items-center gap-1.5">
                        <span style={{ color: layer.color, fontSize: 8 }}>◆</span>
                        <span className="text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom label */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              <span className="text-[9px] text-[var(--muted)] uppercase tracking-widest px-2" style={{ fontFamily: "var(--font-inter)" }}>
                No rip-and-replace
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
