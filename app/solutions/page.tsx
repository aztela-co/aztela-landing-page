import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

export const metadata = {
  title: "Solutions — Aztela Operational Intelligence",
  description: "Cascade Intelligence, Inventory Intelligence, Margin Intelligence, Delivery Intelligence. Aztela solves the specific operational failures costing distributors, wholesalers, and manufacturers money.",
};

const solutions = [
  {
    id: "cascade",
    label: "For Manufacturers",
    color: "#4ade80",
    name: "Cascade Intelligence",
    tagline: "One supplier delay. We trace every work order it touches — in 47 minutes.",
    problem: "A component goes on backorder. Your MRP logs it. Nobody connects that delay to the 14 work orders waiting on that part — until the line stops, labor is already scheduled, and $80K in staged materials is sitting idle.",
    what: "The moment a supplier PO is updated, Aztela traces the impact across every open work order automatically. You get a prioritized view of which jobs are at risk, which deliveries will be affected, and what actions to take — before anything stops.",
    outcomes: [
      { metric: "47 min", label: "Supplier delay to planner alert — down from 4.3 days" },
      { metric: "Zero", label: "Unplanned line stoppages from component shortages" },
      { metric: "↓ 91%", label: "Expedite freight costs" },
      { metric: "$84K/mo", label: "Downtime cost eliminated" },
    ],
    forWho: ["VP of Operations", "Production Planner", "Plant Manager"],
  },
  {
    id: "inventory",
    label: "For Distributors",
    color: "#4d80ff",
    name: "Inventory Intelligence",
    tagline: "The stock exists. We show you where it is before the customer calls.",
    problem: "Your fastest movers run dry in 3 branches while the same SKUs sit fully stocked in 2 others. Orders get declined. Expedite costs pile up. The customer calls you before you know there's a problem.",
    what: "Aztela connects all branch systems into a live unified inventory view, with dynamic inter-branch transfer logic based on real-time velocity and stock positions. Reorder triggers account for what's available network-wide before placing supplier orders.",
    outcomes: [
      { metric: "$340K", label: "Annual revenue recovered from prevented stockouts" },
      { metric: "↓ 71%", label: "Inter-branch expedite freight costs" },
      { metric: "94%", label: "Customer fill rate — up from 81% in 90 days" },
      { metric: "23 days", label: "Time to first prevented stockout" },
    ],
    forWho: ["VP of Operations", "Branch Manager", "Director of Distribution"],
  },
  {
    id: "margin",
    label: "For Wholesalers",
    color: "#ffb347",
    name: "Margin Intelligence",
    tagline: "Supplier prices change. We catch it the same day — not 18 days later on the invoice.",
    problem: "Your team quotes and commits jobs based on costs that are already out of date. When invoices arrive, the gap gets absorbed silently — by the margin. No one has visibility into which open quotes are priced on stale cost data.",
    what: "Aztela monitors supplier price feeds across all portals and PO acknowledgements automatically. Same-day price staging with analyst review. A live margin dashboard showing real landed cost per SKU against every open quote.",
    outcomes: [
      { metric: "$47K/mo", label: "Margin leakage stopped in the first full month" },
      { metric: "Same day", label: "Supplier price changes reflected — down from 18 days" },
      { metric: "↓ 89%", label: "Invoice-vs-PO discrepancies" },
      { metric: "2.1pts", label: "Gross margin improvement sustained over 6 months" },
    ],
    forWho: ["COO", "Purchasing Director", "Pricing Analyst"],
  },
  {
    id: "delivery",
    label: "For All Segments",
    color: "#c084fc",
    name: "Delivery Intelligence",
    tagline: "Live capacity visibility so sales commits to dates the floor can actually keep.",
    problem: "There's no live view of capacity that sales can access before quoting. Promises are made on instinct, confirmed with a call to the floor, and broken when reality catches up. The customer relationship absorbs the hit — every month.",
    what: "A real-time view of line capacity, committed load, and open work orders that your sales team can access before quoting. Delivery promises are grounded in what the floor can actually deliver, with automatic risk flagging when capacity tightens.",
    outcomes: [
      { metric: "↑ 91%", label: "Quote accuracy against actual delivery" },
      { metric: "Eliminated", label: "Late deliveries from capacity oversell" },
      { metric: "↓ 70%", label: "Customer escalations from missed dates" },
      { metric: "Real-time", label: "Capacity visibility for sales before every quote" },
    ],
    forWho: ["VP of Sales", "VP of Operations", "COO"],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="px-6 py-20 md:py-28 grid-bg">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <Link href="/" className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                ← Back to overview
              </Link>
              <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-inter)" }}>
                What We Solve
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold text-[var(--off-white)] mb-6 max-w-3xl leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.025em" }}>
                Four failures. Each one costs you money every month.
              </h1>
              <p className="text-[var(--muted)] text-lg font-light max-w-2xl leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                We don't sell software categories. We eliminate specific operational failures — cascade blindness, inventory gaps, margin leakage, and delivery misses — with a live data layer built around your operation.
              </p>
            </AnimatedSection>

            {/* Quick nav */}
            <div className="flex flex-wrap gap-3 mt-12">
              {solutions.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-sm text-sm text-[var(--muted)] hover:text-[var(--off-white)] hover:border-[var(--coral)] transition-all"
                  style={{ fontFamily: "var(--font-inter)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        {solutions.map((s, idx) => (
          <section key={s.id} id={s.id} className={`px-6 py-20 md:py-28 ${idx % 2 === 1 ? "bg-[var(--charcoal-light)]" : ""}`}>
            <div className="max-w-6xl mx-auto">
              <AnimatedSection>

                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-sm tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter)", background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                    {s.label}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-semibold mb-3 leading-tight" style={{ fontFamily: "var(--font-playfair)", color: s.color }}>
                  {s.name}
                </h2>
                <p className="text-xl text-[var(--off-white)] font-light mb-10 max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
                  {s.tagline}
                </p>

                <div className="grid md:grid-cols-2 gap-12">

                  {/* Left */}
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)", color: s.color }}>
                        The Problem
                      </p>
                      <p className="text-[var(--muted)] leading-relaxed text-sm" style={{ fontFamily: "var(--font-inter)" }}>{s.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)", color: s.color }}>
                        What Aztela Does
                      </p>
                      <p className="text-[var(--muted)] leading-relaxed text-sm" style={{ fontFamily: "var(--font-inter)" }}>{s.what}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)", color: s.color }}>
                        Built For
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {s.forWho.map(r => (
                          <span key={r} className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] rounded-sm" style={{ fontFamily: "var(--font-inter)" }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: outcomes */}
                  <div>
                    <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-inter)", color: s.color }}>
                      Measured Outcomes
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {s.outcomes.map(o => (
                        <div key={o.label} className="border border-[var(--border)] p-5 rounded-sm hover:border-[var(--coral)] transition-colors">
                          <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-inter)", color: s.color }}>{o.metric}</p>
                          <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{o.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </AnimatedSection>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="px-6 py-20 bg-[var(--charcoal-light)] border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Which one is costing you the most?
              </h2>
              <p className="text-[var(--muted)] mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
                30 minutes. We map your specific operational gaps, put a dollar figure on each, and show you what fixing them looks like.
              </p>
              <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center px-10 py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-2px] rounded-sm"
                style={{ fontFamily: "var(--font-inter)" }}>
                Get Your Free Operations Assessment →
              </a>
            </AnimatedSection>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
