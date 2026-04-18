import Counter from "./Counter";
import LogoTicker from "./LogoTicker";

const stats = [
  { stat: "50+",  label: "Operational clients" },
  { stat: "90",   label: "Days to first results" },
  { stat: "3x",   label: "Faster decision cycles" },
  { stat: "100%", label: "Supply chain focus" },
];

export default function Hero() {
  const words = ["Your", "Operations", "Move", "Fast."];

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
      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0" style={{ background: "rgba(18,18,22,0.78)", zIndex: 1 }} />
      {/* blue glow orb */}
      <div className="hero-glow top-[-100px] left-[-100px]" style={{ position: "absolute", zIndex: 2 }} />
      <div
        className="hero-glow"
        style={{ position: "absolute", right: "-150px", bottom: "-150px", animationDelay: "3s", zIndex: 2 }}
      />

      <div className="max-w-6xl mx-auto w-full relative" style={{ zIndex: 3 }}>
        <p
          className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-7 hero-word"
          style={{ animationDelay: "0.1s", fontFamily: "var(--font-inter)" }}
        >
          Data Analytics · Physical AI · Supply Chain
        </p>

        <h1
          className="text-4xl md:text-7xl leading-[1.08] font-semibold text-[var(--off-white)] mb-4 max-w-4xl"
          style={{ letterSpacing: "-0.025em", fontFamily: "var(--font-playfair)" }}
        >
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1 md:gap-x-3">
            {words.map((word, i) => (
              <span
                key={word}
                className="hero-word"
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                {word}
              </span>
            ))}
          </span>
          <span className="block mt-2 md:mt-3">
            <span
              className="hero-word text-[var(--coral)] inline-block"
              style={{ animationDelay: "0.6s" }}
            >
              Your Data Should Too.
            </span>
          </span>
        </h1>

        <p
          className="hero-word text-[var(--muted)] text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-12"
          style={{
            animationDelay: "0.75s",
            fontFamily: "var(--font-inter)",
          }}
        >
          Aztela resolves the urgent data pain points holding back distributors,
          wholesalers, and manufacturers — supply chain blind spots, inventory
          chaos, and planning built on gut feel.
        </p>

        <div
          className="hero-word flex flex-col sm:flex-row gap-4"
          style={{ animationDelay: "0.9s" }}
        >
          <a
            href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-2px] rounded-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Book a Free Strategy Call
          </a>
          <a
            href="#solutions"
            className="inline-flex items-center justify-center px-8 py-4 border border-[var(--border)] text-[var(--off-white)] font-medium text-sm hover:border-[var(--coral)] transition-all hover:translate-y-[-2px] rounded-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            See How We Work
          </a>
        </div>

        <LogoTicker />

        {/* Animated stats */}
        <div className="mt-20 pt-10 border-t border-[var(--border)] grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ stat, label }, i) => (
            <Counter key={label} value={stat} label={label} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
