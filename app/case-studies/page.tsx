import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

export const metadata = {
  title: "Case Studies — Aztela Operational Intelligence",
  description: "Real operational outcomes. Stockouts prevented, margin recovered, line stoppages eliminated. See how Aztela fixes the specific problems costing distributors, wholesalers, and manufacturers money.",
};

const cases = [
  {
    id: "mid-atlantic-distributor",
    segment: "Distribution",
    company: "Mid-Atlantic Industrial Distributor",
    size: "$52M revenue · 8 branches · 14,000 SKUs",
    headline: "Stockouts were costing them $340K a year. They thought it was a buying problem. It was a visibility problem.",
    situation: "An 8-branch industrial distributor in the Mid-Atlantic had a persistent stockout problem on their top 200 SKUs. They'd tried adjusting PAR levels twice in the past year. Nothing stuck. Every month, their fastest movers ran dry in 3–4 branches while the same SKUs sat fully stocked in others.",
    urgentPain: "The real problem surfaced when we mapped their inventory data: $340K in annual revenue was being lost not to genuine stockouts, but to inter-branch blindness. Stock existed. Nobody knew where. Orders got declined, customers got frustrated, and expedite costs piled up.",
    painPoints: [
      "Branch managers were making replenishment decisions from 48-hour-old ERP data",
      "No automated trigger to identify when a low-stock branch had a high-stock neighbor",
      "Expedited freight costs averaging $28K/month on SKUs that existed elsewhere in the network",
      "Customer fill rate at 81% — 11 points below their target",
    ],
    solution: "We connected all 8 branch systems into a live unified inventory view, built dynamic inter-branch transfer logic based on real-time velocity and stock positions, and created automated reorder triggers that account for what's available network-wide before placing supplier orders.",
    outcomes: [
      { metric: "$340K", label: "annual revenue recovered from prevented stockouts" },
      { metric: "↓ 71%", label: "reduction in inter-branch expedite freight costs" },
      { metric: "94%", label: "customer fill rate — up from 81% in 90 days" },
      { metric: "23 days", label: "time from connect to first prevented stockout" },
    ],
    quote: "We had the inventory. We just couldn't see it. Within the first month, we stopped declining orders we should have been able to fill.",
    quoteRole: "VP of Operations",
    color: "#4d80ff",
  },
  {
    id: "regional-wholesaler",
    segment: "Wholesale Distribution",
    company: "Regional Industrial Wholesaler",
    size: "$31M revenue · 3,200 active SKUs · 38 suppliers",
    headline: "They were losing $47K a month in margin and calling it a pricing problem. It was a timing problem.",
    situation: "A Cleveland-based industrial wholesaler had been watching gross margins compress for 6 consecutive quarters. They'd raised prices twice. Margins kept sliding. When we audited the root cause, the answer wasn't pricing strategy — it was a 3-week lag between supplier price changes and system updates.",
    urgentPain: "In any given month, their team was quoting and committing jobs based on costs that were already out of date. When invoices arrived, the gap was absorbed silently — by the margin. Nobody had visibility into which open quotes were priced on stale cost data.",
    painPoints: [
      "Supplier price changes manually updated by one pricing analyst — average 18-day lag",
      "14 active open quotes at any time priced on outdated cost data",
      "Invoice reconciliation taking 3 days/month and still missing discrepancies",
      "No visibility into which SKU lines were margin-positive vs. margin-negative",
    ],
    solution: "We built automated supplier price feed monitoring across 38 supplier portals and PO acknowledgements, created same-day price staging with analyst review workflow, and deployed a live margin dashboard showing real landed cost per SKU against current open quotes.",
    outcomes: [
      { metric: "$47K/mo", label: "margin leakage stopped in the first full month" },
      { metric: "Same day", label: "supplier price changes reflected in the system — down from 18 days" },
      { metric: "↓ 89%", label: "reduction in invoice-vs-PO discrepancies" },
      { metric: "2.1pts", label: "gross margin improvement sustained over 6 months" },
    ],
    quote: "We thought we had a pricing problem for two years. It was a data timing problem. The fix was faster than I expected and the margin impact showed up in week three.",
    quoteRole: "COO",
    color: "#ffb347",
  },
  {
    id: "oem-manufacturer",
    segment: "OEM Manufacturing",
    company: "Custom Hydraulic Equipment Manufacturer",
    size: "$28M revenue · 2 production lines · 180 active work orders",
    headline: "Three line stoppages a month. Each one avoidable. Each one caused by the same thing: a shortage nobody saw coming.",
    situation: "A mid-size OEM manufacturer producing custom hydraulic assemblies was experiencing 2–3 unplanned line stoppages every month. Each stoppage averaged 6 hours. At $4,200/hour in fully-loaded production cost, that was $63,000–$94,000 in monthly downtime — before factoring in expedite costs and late delivery penalties.",
    urgentPain: "Every stoppage traced back to the same root cause: a component shortage that was visible in the PO system days or weeks before it hit the floor, but never connected to the work orders waiting on that component. The information existed. The link didn't.",
    painPoints: [
      "MRP system generated POs but didn't dynamically link supplier delays to WIP impact",
      "Average 4.3 days between a supplier slip and the production planner finding out",
      "Labor scheduled and materials staged for jobs that couldn't run — wasted cost every week",
      "8 customer delivery commitments missed in the 6 months before deployment",
    ],
    solution: "We deployed cascade detection connecting supplier PO updates to open work order requirements in real time. When a component delivery slips, every affected work order is identified within the hour, delivery commitments are risk-flagged, and recommended actions (expedite, reschedule, substitute) are surfaced before anything reaches the floor.",
    outcomes: [
      { metric: "Zero", label: "unplanned line stoppages from component shortages in 90 days post-deployment" },
      { metric: "↓ 91%", label: "reduction in expedite freight costs" },
      { metric: "47 min", label: "average time from supplier delay to planner alert — down from 4.3 days" },
      { metric: "$84K", label: "monthly downtime cost eliminated" },
    ],
    quote: "The first time Aztela flagged a supplier slip and we were able to act on it before the line stopped, my production manager said 'this is the first time we've been ahead of a shortage instead of chasing one.'",
    quoteRole: "Plant Manager",
    color: "#4ade80",
  },
];

export default function CaseStudiesPage() {
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
                Customer Stories
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold text-[var(--off-white)] mb-6 max-w-3xl leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.025em" }}>
                Real operations. Real problems. Specific outcomes.
              </h1>
              <p className="text-[var(--muted)] text-lg font-light max-w-2xl leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                We don't publish vanity metrics. Every case study below names the exact problem, explains why it was happening, and shows the specific dollar outcome.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Case study cards index */}
        <section className="px-6 py-8 bg-[var(--charcoal-light)] border-y border-[var(--border)]">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-4">
            {cases.map((c) => (
              <a key={c.id} href={`#${c.id}`}
                className="flex items-center gap-2 border border-[var(--border)] px-4 py-2 rounded-sm text-sm text-[var(--muted)] hover:text-[var(--off-white)] hover:border-[var(--coral)] transition-all"
                style={{ fontFamily: "var(--font-inter)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                {c.segment}
              </a>
            ))}
          </div>
        </section>

        {/* Individual case studies */}
        {cases.map((c, idx) => (
          <section key={c.id} id={c.id} className={`px-6 py-20 md:py-28 ${idx % 2 === 1 ? "bg-[var(--charcoal-light)]" : ""}`}>
            <div className="max-w-6xl mx-auto">
              <AnimatedSection>

                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-sm tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter)", background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}>
                    {c.segment}
                  </span>
                  <span className="text-[var(--muted)] text-xs" style={{ fontFamily: "var(--font-inter)" }}>{c.size}</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-semibold text-[var(--off-white)] mb-10 max-w-3xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  {c.headline}
                </h2>

                <div className="grid md:grid-cols-2 gap-12 mb-12">
                  {/* Left: narrative */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)" }}>The Situation</p>
                      <p className="text-[var(--muted)] leading-relaxed text-sm" style={{ fontFamily: "var(--font-inter)" }}>{c.situation}</p>
                    </div>
                    <div>
                      <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)" }}>The Real Problem</p>
                      <p className="text-[var(--muted)] leading-relaxed text-sm" style={{ fontFamily: "var(--font-inter)" }}>{c.urgentPain}</p>
                    </div>
                    <div>
                      <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)" }}>Specific Pain Points</p>
                      <ul className="space-y-2">
                        {c.painPoints.map((p) => (
                          <li key={p} className="flex items-start gap-3 text-sm text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
                            <span className="text-red-400 mt-0.5 shrink-0">—</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-inter)" }}>What We Did</p>
                      <p className="text-[var(--muted)] leading-relaxed text-sm" style={{ fontFamily: "var(--font-inter)" }}>{c.solution}</p>
                    </div>
                  </div>

                  {/* Right: outcomes + quote */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Business Outcomes</p>
                      <div className="grid grid-cols-2 gap-3">
                        {c.outcomes.map((o) => (
                          <div key={o.label} className="border border-[var(--border)] p-5 rounded-sm hover:border-[var(--coral)] transition-colors">
                            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-inter)", color: c.color }}>{o.metric}</p>
                            <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{o.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-2 pl-6 py-2" style={{ borderColor: c.color }}>
                      <p className="text-[var(--off-white)] text-sm leading-relaxed italic mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                        &ldquo;{c.quote}&rdquo;
                      </p>
                      <p className="text-[var(--muted)] text-xs" style={{ fontFamily: "var(--font-inter)" }}>— {c.quoteRole}, {c.company}</p>
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
                What would your version of this look like?
              </h2>
              <p className="text-[var(--muted)] mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
                30 minutes. We map your specific operational gaps, put a dollar figure on each, and show you exactly what fixing them looks like.
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
