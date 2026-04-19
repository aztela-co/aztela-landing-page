"use client";

import { useState, useEffect } from "react";
import Counter from "./Counter";
import LogoTicker from "./LogoTicker";

const stats = [
  { stat: "50+",  label: "Operational clients" },
  { stat: "90",   label: "Days to first results" },
  { stat: "3x",   label: "Faster decision cycles" },
  { stat: "100%", label: "Supply chain focus" },
];

const segments = [
  { who: "Distributors",  problem: "stockout",        detail: "Inter-branch inventory blindness eliminated." },
  { who: "Wholesalers",   problem: "margin hit",      detail: "Supplier pricing lag caught before the invoice." },
  { who: "Manufacturers", problem: "line stoppage",   detail: "Component cascades intercepted before the floor." },
];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % segments.length);
        setVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const seg = segments[idx];

  return (
    <section className="relative min-h-svh px-6 overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: "rgba(18,18,22,0.78)", zIndex: 1 }} />
      <div className="hero-glow top-[-100px] left-[-100px]" style={{ position: "absolute", zIndex: 2 }} />
      <div className="hero-glow" style={{ position: "absolute", right: "-150px", bottom: "-150px", animationDelay: "3s", zIndex: 2 }} />

      <div className="max-w-6xl mx-auto w-full relative" style={{ zIndex: 3 }}>

        {/* Dynamic eyebrow */}
        <div className="flex items-center gap-3 mb-7 hero-word" style={{ animationDelay: "0.1s" }}>
          <span className="text-[var(--muted)] text-xs font-medium tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-inter)" }}>
            Operational Intelligence for
          </span>
          <span
            className="text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-sm transition-all duration-300"
            style={{
              fontFamily: "var(--font-inter)",
              background: "rgba(77,128,255,0.12)",
              color: "var(--coral)",
              border: "1px solid rgba(77,128,255,0.25)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-6px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            {seg.who}
          </span>
        </div>

        <h1
          className="text-4xl md:text-6xl leading-[1.08] font-semibold text-[var(--off-white)] mb-4 max-w-4xl"
          style={{ letterSpacing: "-0.025em", fontFamily: "var(--font-playfair)" }}
        >
          <span className="hero-word block" style={{ animationDelay: "0.2s" }}>
            The{" "}
            <span
              style={{
                color: "var(--coral)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.35s ease",
                display: "inline-block",
              }}
            >
              {seg.problem}
            </span>
            {" "}was visible
          </span>
          <span className="hero-word block" style={{ animationDelay: "0.3s" }}>
            in your system 3 weeks ago.
          </span>
          <span className="hero-word block text-[var(--coral)] mt-2" style={{ animationDelay: "0.45s" }}>
            You found out when the line stopped.
          </span>
        </h1>

        {/* Dynamic detail chip */}
        <div
          className="mb-5 hero-word"
          style={{
            animationDelay: "0.55s",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-sm"
            style={{
              fontFamily: "var(--font-inter)",
              background: "rgba(74,222,128,0.07)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.2)",
            }}
          >
            <span style={{ fontSize: 9 }}>●</span>
            {seg.detail}
          </span>
        </div>

        <p
          className="hero-word text-[var(--muted)] text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-12"
          style={{ animationDelay: "0.65s", fontFamily: "var(--font-inter)" }}
        >
          Aztela builds a live operational picture of your supply chain — connecting supplier delays, inventory, and work orders — so problems surface before they cost you money.
        </p>

        <div className="hero-word flex flex-col sm:flex-row gap-4" style={{ animationDelay: "0.9s" }}>
          <a
            href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-2px] rounded-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Book a Free Strategy Call
          </a>
          <a
            href="/solutions"
            className="inline-flex items-center justify-center px-8 py-4 border border-[var(--border)] text-[var(--off-white)] font-medium text-sm hover:border-[var(--coral)] transition-all hover:translate-y-[-2px] rounded-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            See Our Solutions →
          </a>
        </div>

        <LogoTicker />

        <div className="mt-20 pt-10 border-t border-[var(--border)] grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ stat, label }, i) => (
            <Counter key={label} value={stat} label={label} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
