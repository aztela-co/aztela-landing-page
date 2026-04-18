import AnimatedSection from "./AnimatedSection";

const trustItems = [
  "30-min call, no pitch deck",
  "You keep the analysis regardless",
  "First results in 30 days",
];

export default function CTABanner() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="relative border border-[var(--border)] p-12 md:p-20 text-center overflow-hidden hover:border-[var(--coral)] transition-colors duration-500">
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at center, rgba(77,128,255,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-6" style={{ fontFamily: "var(--font-inter)" }}>
              Free Operations Assessment
            </p>

            <h2 className="text-4xl md:text-6xl font-semibold text-[var(--off-white)] mb-5 leading-tight max-w-3xl mx-auto" style={{ fontFamily: "var(--font-playfair)" }}>
              See exactly where your operation is losing money — in 30 minutes.
            </h2>

            <p className="text-[var(--muted)] text-lg font-light mb-3 max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              We map your top 3 operational data gaps, put a dollar figure on each, and show you precisely what fixing them looks like.
            </p>

            <p className="text-[var(--muted)] text-sm mb-10 max-w-lg mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              You leave with a clear picture of your exposure — whether you work with us or not. No pitch deck. No obligation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-2px] rounded-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Book Your Free Assessment →
              </a>
              <a
                href="/tools"
                className="inline-flex items-center justify-center px-10 py-4 border border-[var(--border)] text-[var(--off-white)] font-medium text-sm hover:border-[var(--coral)] transition-all hover:translate-y-[-2px] rounded-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Calculate Your ROI First
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {trustItems.map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span style={{ color: "#4ade80", fontSize: 12 }}>✓</span>
                  <span className="text-xs text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
