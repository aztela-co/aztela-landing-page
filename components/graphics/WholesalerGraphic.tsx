"use client";

import { useEffect, useState } from "react";

const affectedQuotes = [
  { id: "Q-2241", customer: "BuildPro LLC", value: "$18,400", risk: "high" },
  { id: "Q-2238", customer: "Hartwell Supply", value: "$9,200", risk: "high" },
  { id: "Q-2235", customer: "Crestview Group", value: "$6,800", risk: "medium" },
  { id: "Q-2231", customer: "Apex Contractors", value: "$4,100", risk: "low" },
];

const skus = [
  { name: "SKF Bearing 6205", velocity: 94, trend: "up", tag: "HOT" },
  { name: "Parker Seal Kit", velocity: 61, trend: "up", tag: null },
  { name: "PVC Coupling 2\"", velocity: 18, trend: "down", tag: "SLOW" },
];

type Phase = "idle" | "alert" | "analyzing" | "impact" | "action" | "resolved";

export default function WholesalerGraphic() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [quotesRepriced, setQuotesRepriced] = useState(0);

  useEffect(() => {
    const seq: [Phase, number][] = [
      ["alert",     700],
      ["analyzing", 1700],
      ["impact",    2900],
      ["action",    4100],
      ["resolved",  6600],
      ["idle",      9200],
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    const fire = () => {
      seq.forEach(([p, d]) => {
        timers.push(setTimeout(() => {
          setPhase(p);
          if (p === "action") {
            setQuotesRepriced(0);
            let c = 0;
            const iv = setInterval(() => {
              c++;
              setQuotesRepriced(c);
              if (c >= affectedQuotes.length) clearInterval(iv);
            }, 500);
            timers.push(iv as unknown as ReturnType<typeof setTimeout>);
          }
          if (p === "idle") setQuotesRepriced(0);
        }, d));
      });
    };

    fire();
    const loop = setInterval(() => { setPhase("alert"); setQuotesRepriced(0); fire(); }, 12000);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  const show = (p: Phase) => {
    const order: Phase[] = ["idle","alert","analyzing","impact","action","resolved"];
    return order.indexOf(phase) >= order.indexOf(p);
  };

  const tagColor: Record<string, string> = { HOT: "var(--coral)", SLOW: "#ffb347" };

  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--charcoal-mid)] overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${phase === "idle" || phase === "resolved" ? "bg-green-400" : "bg-red-400 animate-pulse"}`} />
          <span style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:11 }}>Aztela · Margin Intelligence</span>
        </div>
        <span style={{ color:"var(--muted)", fontSize:10, opacity:0.5 }}>LIVE</span>
      </div>

      <div className="p-5 space-y-4">

        {/* SKU velocity — always shown */}
        <div className="space-y-2">
          <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9, textTransform:"uppercase", letterSpacing:"0.12em" }}>SKU Velocity</p>
          {skus.map((s) => (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontFamily:"var(--font-inter)", color:"var(--off-white)", fontSize:10 }}>{s.name}</span>
                <div className="flex items-center gap-1.5">
                  {s.tag && (
                    <span style={{ fontFamily:"var(--font-inter)", fontSize:9, fontWeight:700, color: tagColor[s.tag], background:`${tagColor[s.tag]}18`, border:`1px solid ${tagColor[s.tag]}30`, padding:"1px 5px", borderRadius:2 }}>
                      {s.tag}
                    </span>
                  )}
                  <span style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9 }}>{s.trend === "up" ? "↑" : "↓"} {s.velocity}/wk</span>
                </div>
              </div>
              <div className="w-full h-1 rounded-full" style={{ background:"var(--border)" }}>
                <div className="h-full rounded-full" style={{ width:`${s.velocity}%`, background: s.tag === "SLOW" ? "#ffb347" : "var(--coral)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Price alert */}
        {show("alert") && (
          <div className="rounded-sm p-4 transition-all duration-500"
            style={{ background:"rgba(255,107,107,0.07)", border:"1px solid rgba(255,107,107,0.3)", opacity: show("alert") ? 1 : 0, transform: show("alert") ? "translateY(0)" : "translateY(8px)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="animate-pulse" style={{ color:"#ff6b6b", fontSize:12 }}>⚠</span>
              <span style={{ fontFamily:"var(--font-inter)", color:"#ff6b6b", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em" }}>
                Supplier Price Increase Detected
              </span>
            </div>
            <p style={{ fontFamily:"var(--font-inter)", color:"var(--off-white)", fontSize:12, fontWeight:600, marginBottom:3 }}>SKF Bearings · +3.2% across 23 SKU lines</p>
            <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:10 }}>Effective immediately · detected from PO acknowledgement</p>
          </div>
        )}

        {/* Analyzing */}
        {show("analyzing") && (
          <div className="flex items-center gap-2 transition-all duration-300" style={{ opacity: show("analyzing") ? 1 : 0 }}>
            <div className="flex gap-0.5">
              {[0,1,2].map(i => (
                <div key={i} className="w-1 h-1 rounded-full bg-[var(--coral)]"
                  style={{ animation:`pulse 1s ease-in-out ${i*0.2}s infinite` }} />
              ))}
            </div>
            <span style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:11 }}>
              {show("impact") ? "Impact analysis complete" : "Scanning open quotes for margin exposure..."}
            </span>
          </div>
        )}

        {/* Impact summary */}
        {show("impact") && (
          <div className="grid grid-cols-3 gap-2 transition-all duration-500"
            style={{ opacity: show("impact") ? 1 : 0, transform: show("impact") ? "translateY(0)" : "translateY(8px)" }}>
            {[
              { n:"4", label:"quotes at risk", color:"#ff6b6b" },
              { n:"$38.5K", label:"revenue affected", color:"#ffb347" },
              { n:"$12.4K", label:"margin exposure", color:"#ff6b6b" },
            ].map(({ n, label, color }) => (
              <div key={label} className="border border-[var(--border)] rounded-sm p-3 text-center">
                <p style={{ fontFamily:"var(--font-inter)", color, fontSize:14, fontWeight:700, lineHeight:1 }}>{n}</p>
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9, marginTop:4 }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quote repricing */}
        {show("action") && (
          <div className="space-y-1.5 transition-all duration-400" style={{ opacity: show("action") ? 1 : 0 }}>
            <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9, textTransform:"uppercase", letterSpacing:"0.12em" }}>Quote Repricing</p>
            {affectedQuotes.map((q, i) => (
              <div key={q.id} className="flex items-center justify-between border border-[var(--border)] rounded-sm px-3 py-2 transition-all duration-300"
                style={{ opacity: i < quotesRepriced ? 1 : 0.3, background: i < quotesRepriced && phase === "resolved" ? "rgba(74,222,128,0.04)" : "transparent", borderColor: i < quotesRepriced && phase === "resolved" ? "rgba(74,222,128,0.25)" : "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily:"var(--font-inter)", color:"var(--coral)", fontSize:10, fontWeight:600 }}>{q.id}</span>
                  <span style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:10 }}>{q.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily:"var(--font-inter)", color:"var(--off-white)", fontSize:10 }}>{q.value}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-bold"
                    style={{ fontFamily:"var(--font-inter)", background: i < quotesRepriced ? (phase === "resolved" ? "rgba(74,222,128,0.12)" : "rgba(77,128,255,0.1)") : "rgba(255,107,107,0.1)", color: i < quotesRepriced ? (phase === "resolved" ? "#4ade80" : "var(--coral)") : "#ff6b6b", border:`1px solid ${i < quotesRepriced ? (phase === "resolved" ? "rgba(74,222,128,0.3)" : "rgba(77,128,255,0.25)") : "rgba(255,107,107,0.25)"}` }}>
                    {i < quotesRepriced ? (phase === "resolved" ? "✓ Updated" : "Repricing") : "At risk"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resolved */}
        {phase === "resolved" && (
          <div className="rounded-sm px-4 py-3 transition-all duration-500"
            style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.25)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily:"var(--font-inter)", color:"#4ade80", fontSize:11, fontWeight:600 }}>✓ Margin protected</p>
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:10 }}>$12,400 saved · 4 quotes updated · customers notified</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em" }}>Response time</p>
                <p style={{ fontFamily:"var(--font-inter)", color:"#4ade80", fontSize:14, fontWeight:700 }}>22 min</p>
                <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:9 }}>vs. 3 weeks undetected</p>
              </div>
            </div>
          </div>
        )}

        {phase === "idle" && (
          <div className="py-2 text-center">
            <p style={{ fontFamily:"var(--font-inter)", color:"var(--muted)", fontSize:11 }}>Monitoring · 40 supplier feeds · all quotes current</p>
          </div>
        )}

      </div>
    </div>
  );
}
