import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const TOOLS = [
  {
    id: "roi",
    label: "ROI Calculator",
    tag: "Quantify your exposure",
    desc: "Input your revenue, locations, and operational profile. Get a conservative estimate of what data gaps are costing you — broken down by specific cost category.",
    href: "/tools/roi",
    segments: ["Distributors", "Wholesalers", "Manufacturers"],
    color: "#4d80ff",
  },
  {
    id: "cascade",
    label: "Cascade Simulator",
    tag: "Trace impact before it hits",
    desc: "Your top supplier misses by 3 weeks. Input your operation and watch the cascade ripple through your work orders, delivery commitments, and margin — in real time.",
    href: "/tools/cascade",
    segments: ["Manufacturers", "Distributors"],
    color: "#f59e0b",
  },
];

export default function ToolsHubPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        <section className="px-6 py-16 md:py-24 grid-bg">
          <div className="max-w-4xl mx-auto text-center">
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
              Free tools built for ops leaders. No fluff — just numbers specific to your operation.
            </p>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {TOOLS.map(tool => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group border border-[var(--border)] rounded p-8 flex flex-col hover:border-[rgba(77,128,255,0.4)] transition-all duration-200 hover:bg-white/[0.015]"
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded"
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: tool.color,
                      background: `${tool.color}15`,
                      border: `1px solid ${tool.color}30`,
                    }}
                  >
                    {tool.tag}
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className="text-[var(--muted)] group-hover:text-[var(--coral)] transition-colors"
                  >
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <h2
                  className="text-xl font-semibold text-[var(--off-white)] mb-3 group-hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {tool.label}
                </h2>

                <p className="text-sm text-[var(--muted)] leading-relaxed mb-6 flex-1" style={{ fontFamily: "var(--font-inter)" }}>
                  {tool.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {tool.segments.map(s => (
                    <span
                      key={s}
                      className="text-[10px] text-[var(--muted)] px-2.5 py-1 rounded border border-[var(--border)]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
