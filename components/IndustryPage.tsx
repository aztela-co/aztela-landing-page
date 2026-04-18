import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedSection from "./AnimatedSection";

interface Pain {
  urgency: string;
  title: string;
  body: string;
}

interface Solution {
  title: string;
  body: string;
  outcomes: string[];
}

interface Goal {
  title: string;
  body: string;
}

interface Props {
  badge: string;
  headline: string;
  subhead: string;
  whoTitle: string;
  whoBody: string;
  whoRoles: string[];
  pains: Pain[];
  goals: Goal[];
  solutions: Solution[];
  graphic: React.ReactNode;
}

export default function IndustryPage({
  badge, headline, subhead, whoTitle, whoBody, whoRoles,
  pains, goals, solutions, graphic,
}: Props) {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="relative px-6 py-24 md:py-32 grid-bg overflow-hidden">
          <div className="hero-glow" style={{ position: "absolute", top: -100, left: -100 }} />
          <div className="max-w-6xl mx-auto relative z-10">
            <AnimatedSection>
              <Link href="/" className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                ← Back to overview
              </Link>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-inter)" }}>
                {badge}
              </p>
              <h1
                className="text-4xl md:text-6xl font-semibold text-[var(--off-white)] mb-6 max-w-3xl leading-tight"
                style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.025em" }}
              >
                {headline}
              </h1>
              <p className="text-[var(--muted)] text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-10" style={{ fontFamily: "var(--font-inter)" }}>
                {subhead}
              </p>
              <a
                href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-2px] rounded-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Book a Free Strategy Call
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* Who this is for */}
        <section className="px-6 py-20 bg-[var(--charcoal-light)]">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                    Who this is for
                  </p>
                  <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                    {whoTitle}
                  </h2>
                  <p className="text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    {whoBody}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {whoRoles.map((role) => (
                    <div key={role} className="flex items-center gap-3 border border-[var(--border)] px-5 py-4 rounded-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--coral)] shrink-0" />
                      <span className="text-[var(--off-white)] text-sm" style={{ fontFamily: "var(--font-inter)" }}>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Urgent Problems */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                Urgent problems
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-14 max-w-xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                The exact issues costing you money right now
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-px bg-[var(--border)]">
              {pains.map(({ urgency, title, body }, i) => (
                <AnimatedSection key={title} delay={i * 80}>
                  <div className="bg-[var(--charcoal)] p-8 md:p-10 h-full group hover:bg-[var(--charcoal-mid)] transition-colors">
                    <span
                      className="inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-1 mb-5 rounded-sm"
                      style={{ fontFamily: "var(--font-inter)", background: "rgba(255,80,80,0.08)", color: "#ff6b6b", border: "1px solid rgba(255,80,80,0.2)" }}
                    >
                      {urgency}
                    </span>
                    <h3 className="text-xl font-semibold text-[var(--off-white)] mb-3 leading-snug group-hover:text-[var(--coral)] transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                      {title}
                    </h3>
                    <p className="text-[var(--muted)] text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{body}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Goals */}
        <section className="px-6 py-20 bg-[var(--charcoal-light)]">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                What you&apos;re trying to achieve
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-14 max-w-xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Your goals. Our obsession.
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6">
              {goals.map(({ title, body }, i) => (
                <AnimatedSection key={title} delay={i * 90}>
                  <div className="border border-[var(--border)] p-8 h-full hover:border-[var(--coral)] transition-all hover:translate-y-[-3px] duration-300 group">
                    <div className="w-8 h-px bg-[var(--coral)] mb-6 group-hover:w-16 transition-all duration-300" />
                    <h3 className="text-lg font-semibold text-[var(--off-white)] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h3>
                    <p className="text-[var(--muted)] text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{body}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions + Motion Graphic */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                How we fix it
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-14 max-w-xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Precision solutions. Outcomes you can measure.
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Solutions list */}
              <div className="space-y-6">
                {solutions.map(({ title, body, outcomes }, i) => (
                  <AnimatedSection key={title} delay={i * 80}>
                    <div className="border border-[var(--border)] p-7 group hover:border-[var(--coral)] transition-all duration-300">
                      <div className="w-8 h-px bg-[var(--coral)] mb-5 group-hover:w-16 transition-all duration-300" />
                      <h3 className="text-lg font-semibold text-[var(--off-white)] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h3>
                      <p className="text-[var(--muted)] text-sm leading-relaxed mb-4" style={{ fontFamily: "var(--font-inter)" }}>{body}</p>
                      <div className="flex flex-wrap gap-2">
                        {outcomes.map((o) => (
                          <span key={o} className="text-[11px] font-semibold px-2.5 py-1 rounded-sm"
                            style={{ fontFamily: "var(--font-inter)", background: "rgba(77,128,255,0.08)", color: "var(--coral)", border: "1px solid rgba(77,128,255,0.2)" }}>
                            {o}
                          </span>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {/* Motion graphic — sticky on desktop */}
              <div className="md:sticky md:top-24">
                <AnimatedSection>
                  {graphic}
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 bg-[var(--charcoal-light)] border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Ready to see what this looks like for your operation?
              </h2>
              <p className="text-[var(--muted)] mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
                30-minute call. We map your specific problems to specific solutions. No pitch deck.
              </p>
              <a
                href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center px-10 py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-2px] rounded-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Book a Free Strategy Call
              </a>
            </AnimatedSection>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
