import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import ManufacturerGraphic from "@/components/graphics/ManufacturerGraphic";
import Link from "next/link";

export const metadata = {
  title: "Aztela for OEMs & Make-to-Order Manufacturers — Stop the Cascade Before It Hits",
  description: "One component shortage cascades into 14 stalled work orders and 8 broken deliveries. Aztela intercepts it in 47 minutes. Your line never stops.",
};

const pains = [
  {
    urgency: "Line stopped. 14 work orders waiting. One missing part.",
    title: "A component went on backorder 3 weeks ago. You found out when the line stopped.",
    body: "Your MRP generated the PO. The supplier slipped the date. Nobody connected that delay to the 14 work orders waiting on that component — until the line stopped, labor was already scheduled, and $80K in staged materials was sitting idle. The shortage was visible in your own system. Nobody was watching.",
  },
  {
    urgency: "Engineering changed the BOM. Floor didn't find out.",
    title: "Your line ran a full shift on an outdated spec. $11K in scrap. Nobody caught it.",
    body: "Engineering updated the BOM. The change lived in the engineering system. Production kept running version 2.3 while version 2.4 was already approved. By the time a supervisor caught it, you had a shift of scrap, a rework queue, and a delivery you couldn't make. The fix took 10 minutes. The fallout took 3 days.",
  },
  {
    urgency: "Customer called you. You didn't call them.",
    title: "The order was two days late. You found out when the customer escalated.",
    body: "Work orders move through your floor invisibly. Delays form silently at one stage and compound across the next three. By the time it surfaces, the deadline is gone, the customer is already frustrated, and you have no good answer for what happened. There was no window to intervene — because there was no signal.",
  },
  {
    urgency: "Sales promised a date ops couldn't keep",
    title: "Your sales team quoted 3-week lead time. The line running that job was already booked 5 weeks out.",
    body: "There's no live capacity view that sales can access before committing. Promises get made on instinct, confirmed with a call to the floor, and broken when reality catches up. The customer relationship absorbs the hit. This happens on multiple quotes every month.",
  },
];

const cascadeSteps = [
  {
    day: "Day 1",
    old: "Supplier emails to say component HV-442 will be 3 weeks late.",
    new: "PO updated in system. Aztela detects the delay instantly.",
  },
  {
    day: "Day 1 → Hour 1",
    old: "Email forwarded to purchasing. Gets missed in inbox.",
    new: "Automatic cascade analysis: 14 WOs affected, 8 deliveries at risk, $340K exposure.",
  },
  {
    day: "Day 3",
    old: "Purchasing updates the PO. No one tells production planning.",
    new: "Planner alerted with specific work orders, dates, and recommended actions.",
  },
  {
    day: "Day 5",
    old: "Production planner notices jobs are stalling but doesn't know why.",
    new: "Expedite from alt supplier approved. 6 deliveries protected.",
  },
  {
    day: "Day 8",
    old: "Line stops. 14 work orders stuck. $80K in staged materials idle.",
    new: "3 customers proactively notified with revised dates before they ask.",
  },
  {
    day: "Day 9",
    old: "8 customers call about late deliveries. Expedite ordered at 3× cost.",
    new: "Line never stops.",
  },
];

const goals = [
  {
    title: "Know about component shortages before they reach the floor.",
    body: "When a supplier PO slips, you know within the hour which work orders are affected, which deliveries are at risk, and what your options are — before a single line stops.",
  },
  {
    title: "Engineering and production always on the same BOM.",
    body: "Changes propagate automatically with version control and cutover logic. Scrap and rework from version drift stop being a line item on your P&L.",
  },
  {
    title: "Commit to delivery dates you can actually keep.",
    body: "Live capacity visibility that sales can use before quoting. No more promises made on instinct that ops has to absorb.",
  },
];

const solutions = [
  {
    title: "Component Shortage Cascade Detection",
    body: "The moment a supplier PO is updated, Aztela traces the impact across every open work order automatically. You get a prioritized view of which jobs are at risk, which deliveries will be affected, and what actions to take — before anything stops.",
    outcomes: ["Detection time: days → 47 min", "Line stoppages from shortages: eliminated", "Expedite cost ↓ 60%"],
  },
  {
    title: "Live WIP Visibility",
    body: "Every work order tracked stage-by-stage in real time. Delays are flagged automatically before they compound. Supervisors see the signal while they still have time to act.",
    outcomes: ["WIP cycle time ↓ 38%", "On-time delivery ↑ 22%", "Customer escalations ↓ 70%"],
  },
  {
    title: "BOM Change Propagation Engine",
    body: "Engineering changes flow automatically to the production floor with version control and cutover logic. No manual handoffs. No stale specs. Scrap from BOM version mismatches drops to near zero.",
    outcomes: ["BOM-related scrap ↓ 80%", "Rework hours ↓ 65%", "Version incidents: eliminated"],
  },
  {
    title: "Live Capacity Intelligence",
    body: "A real-time view of line capacity and committed load that your sales team can access before quoting. Delivery promises are grounded in what the floor can actually deliver.",
    outcomes: ["Quote accuracy ↑ 91%", "Late delivery from oversell: eliminated", "Sales-ops conflict ↓ dramatically"],
  },
];

export default function ManufacturersPage() {
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
                Built for OEMs & Make-to-Order Manufacturers
              </p>
              <h1
                className="text-4xl md:text-6xl font-semibold text-[var(--off-white)] mb-6 max-w-4xl leading-tight"
                style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.025em" }}
              >
                One missing component.<br />
                <span className="text-[var(--coral)]">14 work orders stalled.</span><br />
                You find out when the line stops.
              </h1>
              <p className="text-[var(--muted)] text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-10" style={{ fontFamily: "var(--font-inter)" }}>
                Aztela intercepts the cascade before it hits your floor — connecting supplier delays to work order impact to delivery risk, automatically, in real time.
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
                    OEMs and MTO manufacturers where one bad component decision costs days.
                  </h2>
                  <p className="text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    You assemble complex products from dozens or hundreds of bought components. Your production plan is only as good as your supply chain visibility — and right now that visibility has a 3-day lag built into it. We remove the lag.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    "VP of Manufacturing / Plant Manager — accountable for on-time delivery and floor efficiency",
                    "Materials & Supply Chain Manager — owns component availability and supplier relationships",
                    "Production Planner — scheduling work orders against capacity and material readiness",
                    "COO / Operations Director — accountable for delivery performance and margin",
                  ].map((role) => (
                    <div key={role} className="flex items-start gap-3 border border-[var(--border)] px-5 py-4 rounded-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--coral)] shrink-0 mt-1.5" />
                      <span className="text-[var(--off-white)] text-sm" style={{ fontFamily: "var(--font-inter)" }}>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Urgent problems */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Urgent problems</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-14 max-w-xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                The exact issues costing you money right now
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-px bg-[var(--border)]">
              {pains.map(({ urgency, title, body }, i) => (
                <AnimatedSection key={title} delay={i * 80}>
                  <div className="bg-[var(--charcoal)] p-8 md:p-10 h-full group hover:bg-[var(--charcoal-mid)] transition-colors">
                    <span className="inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-1 mb-5 rounded-sm"
                      style={{ fontFamily: "var(--font-inter)", background: "rgba(255,80,80,0.08)", color: "#ff6b6b", border: "1px solid rgba(255,80,80,0.2)" }}>
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

        {/* THE CASCADE SECTION — How it works */}
        <section className="px-6 py-20 md:py-28 bg-[var(--charcoal-light)]">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                The cascade problem — solved
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-4 max-w-2xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                One supplier delay. Here's what happens in two worlds.
              </h2>
              <p className="text-[var(--muted)] mb-14 max-w-xl" style={{ fontFamily: "var(--font-inter)" }}>
                Component HV-442. Hydraulic Valve. Supplier pushes lead time +21 days.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-px bg-[var(--border)] mb-10">
              {/* Without Aztela */}
              <AnimatedSection>
                <div className="bg-[var(--charcoal)] p-8 h-full">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-sm font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>Without Aztela</p>
                  </div>
                  <div className="space-y-5">
                    {cascadeSteps.map(({ day, old }) => (
                      <div key={day} className="flex gap-4">
                        <span className="text-[10px] font-semibold text-red-400 w-16 shrink-0 pt-0.5" style={{ fontFamily: "var(--font-inter)" }}>{day}</span>
                        <p className="text-sm text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{old}</p>
                      </div>
                    ))}
                    <div className="mt-6 pt-5 border-t border-[var(--border)]">
                      <p className="text-sm font-semibold text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
                        Result: Line down 2 days. 8 customers missed. Expedite at 3× cost.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* With Aztela */}
              <AnimatedSection delay={120}>
                <div className="bg-[var(--charcoal)] p-8 h-full" style={{ borderLeft: "1px solid rgba(77,128,255,0.15)" }}>
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="text-sm font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>With Aztela</p>
                  </div>
                  <div className="space-y-5">
                    {cascadeSteps.map(({ day, new: next }) => (
                      <div key={day} className="flex gap-4">
                        <span className="text-[10px] font-semibold text-[var(--coral)] w-16 shrink-0 pt-0.5" style={{ fontFamily: "var(--font-inter)" }}>{day}</span>
                        <p className="text-sm text-[var(--off-white)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{next}</p>
                      </div>
                    ))}
                    <div className="mt-6 pt-5 border-t border-[rgba(77,128,255,0.2)]">
                      <p className="text-sm font-semibold text-green-400" style={{ fontFamily: "var(--font-inter)" }}>
                        Result: Line never stops. 6 deliveries protected. 3 customers notified proactively.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Goals */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>What you're trying to achieve</p>
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

        {/* Solutions + Live Graphic */}
        <section className="px-6 py-20 md:py-28 bg-[var(--charcoal-light)]">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>How we fix it</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-14 max-w-xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Precision solutions. Outcomes you can measure.
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-start">
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

              <div className="md:sticky md:top-24">
                <AnimatedSection>
                  <p className="text-[var(--muted)] text-xs mb-3 tracking-widest uppercase" style={{ fontFamily: "var(--font-inter)" }}>
                    Live demo — cascade intercepted
                  </p>
                  <ManufacturerGraphic />
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Also serve note */}
        <section className="px-6 py-14 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--muted)] text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-inter)" }}>
                Also serve
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { type: "Food & Beverage", hook: "Yield loss attribution, shelf-life-aware scheduling, and sub-4-hour recall traceability." },
                  { type: "Plastics / Injection Molders", hook: "Cycle time drift detection, shot-count tooling wear tracking, and shift-level scrap attribution." },
                  { type: "Contract Manufacturers", hook: "Multi-customer capacity visibility, shared component allocation, and automated customer status reporting." },
                ].map(({ type, hook }) => (
                  <div key={type} className="border border-[var(--border)] p-6 rounded-sm">
                    <p className="text-[var(--off-white)] text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-inter)" }}>{type}</p>
                    <p className="text-[var(--muted)] text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{hook}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 bg-[var(--charcoal-light)] border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Ready to stop finding out when the line stops?
              </h2>
              <p className="text-[var(--muted)] mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
                30-minute call. We map your specific cascade scenarios to specific solutions. No pitch deck.
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
