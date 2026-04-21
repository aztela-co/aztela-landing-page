import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const SEGMENTS = [
  {
    label: "Distributors",
    color: "#4d80ff",
    tools: [
      {
        label: "Inventory Intelligence Scorecard",
        desc: "5 questions, 3 minutes. Score your operation across 5 dimensions and get a personalised diagnosis of where inventory gaps are costing you most.",
        href: "/tools/distributor/inventory-scorecard",
        tag: "Self-assessment",
      },
      {
        label: "Branch Stockout Predictor",
        desc: "Which branches will stockout in the next 14 days — and how much revenue is sitting in the gap.",
        href: "/tools/distributor/stockout-predictor",
        tag: "Inventory risk",
      },
      {
        label: "Dead Stock Capital Calculator",
        desc: "Quantify idle capital locked in slow and dead inventory — and what you could redeploy.",
        href: "/tools/distributor/dead-stock",
        tag: "Working capital",
      },
      {
        label: "Transfer vs. Reorder Calculator",
        desc: "Transfer from another branch or reorder from supplier? Get the exact cost comparison and recommendation.",
        href: "/tools/distributor/transfer-vs-reorder",
        tag: "Decision tool",
      },
    ],
  },
  {
    label: "Wholesalers",
    color: "#a78bfa",
    tools: [
      {
        label: "Stale Quote Margin Leak Calculator",
        desc: "Every day a quote sits open while costs move, margin shrinks. Calculate how much is already gone.",
        href: "/tools/wholesaler/stale-quote",
        tag: "Margin",
      },
      {
        label: "Supplier Concentration Risk Score",
        desc: "How exposed is your business to your top 3 suppliers — in revenue, margin, and pricing power.",
        href: "/tools/wholesaler/supplier-concentration",
        tag: "Supplier risk",
      },
      {
        label: "Price Change Impact Estimator",
        desc: "Supplier raised prices. See instantly what you can reprice, what you'll absorb, and the net margin hit.",
        href: "/tools/wholesaler/price-change-impact",
        tag: "Margin",
      },
    ],
  },
  {
    label: "Manufacturers",
    color: "#f59e0b",
    tools: [
      {
        label: "BOM Vulnerability Scanner",
        desc: "How many active work orders are one supplier away from stopping? Map your single-source exposure.",
        href: "/tools/manufacturer/bom-vulnerability",
        tag: "Production risk",
      },
      {
        label: "JIT Delivery Window Risk Calculator",
        desc: "How many delivery windows are at risk from supplier slip? Calculate the cost of a missed sequence.",
        href: "/tools/manufacturer/jit-delivery",
        tag: "Delivery risk",
      },
      {
        label: "Cascade Impact Simulator",
        desc: "Your top supplier misses by 3 weeks. Trace the full cascade through work orders, deliveries, and margin.",
        href: "/tools/cascade",
        tag: "Cascade risk",
      },
    ],
  },
];

export default function ToolsHubPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        <section className="px-6 py-16 md:py-24 grid-bg">
          <div className="max-w-5xl mx-auto text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ← Back to overview
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              Operational Intelligence Tools
            </p>
            <h1
              className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight"
              style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}
            >
              Know what your operation is hiding — before it costs you.
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Free calculators built for ops leaders. Specific to your segment, your numbers, your problems.
            </p>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* ROI Calculator — cross-segment, pinned at top */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded"
                  style={{ fontFamily: "var(--font-inter)", color: "var(--coral)", background: "rgba(77,128,255,0.1)", border: "1px solid rgba(77,128,255,0.25)" }}
                >
                  All Segments
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>
              <Link
                href="/tools/roi"
                className="group border border-[var(--border)] rounded p-6 flex items-center justify-between hover:border-[rgba(77,128,255,0.4)] transition-all duration-200 hover:bg-white/[0.015]"
              >
                <div>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 rounded mb-3 inline-block"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--coral)", background: "rgba(77,128,255,0.1)" }}
                  >
                    ROI
                  </span>
                  <h3 className="text-base font-semibold text-[var(--off-white)] mb-1 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                    Operational Intelligence ROI Calculator
                  </h3>
                  <p className="text-sm text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
                    Quantify what data gaps are costing your operation — across all three segments. Input your numbers, get a dollar figure.
                  </p>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-6 flex-shrink-0 text-[var(--muted)] group-hover:text-[var(--coral)] transition-colors">
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {SEGMENTS.map(seg => (
              <div key={seg.label}>
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded"
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: seg.color,
                      background: `${seg.color}15`,
                      border: `1px solid ${seg.color}30`,
                    }}
                  >
                    {seg.label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {seg.tools.map(tool => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group border border-[var(--border)] rounded p-6 flex flex-col hover:border-[rgba(77,128,255,0.4)] transition-all duration-200 hover:bg-white/[0.015]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 rounded"
                          style={{
                            fontFamily: "var(--font-inter)",
                            color: seg.color,
                            background: `${seg.color}15`,
                          }}
                        >
                          {tool.tag}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                          className="text-[var(--muted)] group-hover:text-[var(--coral)] transition-colors">
                          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h3
                        className="text-base font-semibold text-[var(--off-white)] mb-2 group-hover:text-white transition-colors leading-snug"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {tool.label}
                      </h3>
                      <p className="text-sm text-[var(--muted)] leading-relaxed flex-1" style={{ fontFamily: "var(--font-inter)" }}>
                        {tool.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
