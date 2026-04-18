"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const personas = [
  {
    role: "VP of Operations / COO",
    desc: "You're accountable for delivery performance, working capital, and margin. You don't have time to dig — you need the signal, not the noise.",
    gets: ["Weekly operational risk signals specific to your segment", "Benchmarks that tell you if your numbers are normal or lagging", "Case studies framed around P&L impact, not technology"],
  },
  {
    role: "Plant Manager / Director of Manufacturing",
    desc: "You run a production environment where one bad day can cost six figures. You want to know what other operations leaders are doing to prevent it.",
    gets: ["Real WIP, BOM, and scheduling scenarios with specific resolutions", "OEE benchmarks by industry segment and company size", "Early signals to watch for in your own operation"],
  },
  {
    role: "Supply Chain / Purchasing Director",
    desc: "You manage supplier relationships, component risk, and inventory positioning. You want intelligence that helps you stay ahead of disruptions.",
    gets: ["Supplier disruption patterns and how to detect them early", "Inventory positioning frameworks that work at mid-market scale", "Procurement intelligence — what operators are watching right now"],
  },
  {
    role: "Director of Distribution / Wholesale Ops",
    desc: "You're managing inventory across locations, customers, and suppliers with margin pressure from every direction. You want practical frameworks, not theory.",
    gets: ["Inter-branch inventory and demand intelligence insights", "Margin protection frameworks for wholesale operations", "Real scenarios from distributors and wholesalers with specific outcomes"],
  },
];

const issues = [
  { n: "01", title: "The Cascade Problem", preview: "How a $14 component shortage becomes a $84K/month production problem — and what the signal looked like 3 weeks before the line stopped." },
  { n: "02", title: "The Pricing Lag", preview: "A regional wholesaler was losing $47K/month in margin. The cause wasn't their pricing strategy. It was an 18-day data lag. Here's the anatomy of that failure." },
  { n: "03", title: "Dead Stock Math", preview: "Why 15-30% of your inventory is probably working against you — and the specific reorder logic that fixes it without a new ERP." },
];

export default function NewsletterPage() {
  const [email, setEmail]     = useState("");
  const [role,  setRole]      = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="px-6 py-20 md:py-28 grid-bg">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
              ← Back to overview
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-inter)" }}>
              The Operations Brief
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold text-[var(--off-white)] mb-6 leading-tight" style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.025em" }}>
              Operational intelligence.<br />
              <span className="text-[var(--coral)]">Weekly. Specific. No fluff.</span>
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              One real operational scenario per week — broken down for operations leaders at distributors, wholesalers, and manufacturers. What went wrong, what the signal looked like, and how it was fixed.
            </p>
          </div>
        </section>

        {/* Who it's for */}
        <section className="px-6 py-20 bg-[var(--charcoal-light)]">
          <div className="max-w-6xl mx-auto">
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Who reads this</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--off-white)] mb-12 max-w-xl leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Written for operators. Not analysts.
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {personas.map((p) => (
                <div key={p.role} className="border border-[var(--border)] p-7 hover:border-[var(--coral)] transition-all duration-300 group">
                  <div className="w-8 h-px bg-[var(--coral)] mb-5 group-hover:w-16 transition-all duration-300" />
                  <h3 className="text-lg font-semibold text-[var(--off-white)] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{p.role}</h3>
                  <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{p.desc}</p>
                  <ul className="space-y-2">
                    {p.gets.map((g) => (
                      <li key={g} className="flex items-start gap-2 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                        <span className="text-[var(--coral)] mt-0.5 shrink-0">→</span>
                        <span className="text-[var(--muted)]">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample issues */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Recent issues</p>
            <h2 className="text-3xl font-semibold text-[var(--off-white)] mb-12" style={{ fontFamily: "var(--font-playfair)" }}>What you'll actually read</h2>
            <div className="space-y-px bg-[var(--border)]">
              {issues.map((iss) => (
                <div key={iss.n} className="bg-[var(--charcoal)] p-7 md:p-10 group hover:bg-[var(--charcoal-mid)] transition-colors">
                  <div className="flex items-start gap-6 md:gap-10">
                    <span style={{ fontFamily: "var(--font-playfair)", color: "var(--coral)", fontSize: 11, opacity: 0.5, letterSpacing: "0.1em", paddingTop: 4, whiteSpace: "nowrap" }}>{iss.n}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2 group-hover:text-[var(--coral)] transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>{iss.title}</h3>
                      <p className="text-[var(--muted)] text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{iss.preview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section className="px-6 py-20 bg-[var(--charcoal-light)]">
          <div className="max-w-xl mx-auto">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}>
                  <span style={{ color: "#4ade80", fontSize: 20 }}>✓</span>
                </div>
                <h2 className="text-2xl font-semibold text-[var(--off-white)] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>You're in.</h2>
                <p className="text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
                  First issue lands next week. We'll make sure it's relevant to your role.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>Subscribe</p>
                <h2 className="text-3xl font-semibold text-[var(--off-white)] mb-3 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  Join 400+ operations leaders.
                </h2>
                <p className="text-[var(--muted)] mb-8" style={{ fontFamily: "var(--font-inter)" }}>
                  Weekly. Specific. Unsubscribe any time. We don't share your email.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-2 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>Work email</label>
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 text-sm border border-[var(--border)] rounded-sm bg-transparent text-[var(--off-white)] placeholder-[var(--muted)] focus:border-[var(--coral)] focus:outline-none transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-2 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>Your role</label>
                    <select
                      required value={role} onChange={e => setRole(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-[var(--border)] rounded-sm bg-[var(--charcoal-light)] text-[var(--off-white)] focus:border-[var(--coral)] focus:outline-none transition-colors appearance-none cursor-pointer"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      <option value="" disabled>Select your role</option>
                      <option>VP of Operations / COO</option>
                      <option>Plant Manager / Director of Manufacturing</option>
                      <option>Supply Chain / Purchasing Director</option>
                      <option>Director of Distribution / Wholesale Ops</option>
                      <option>Founder / Owner-Operator</option>
                      <option>Other Operations Leader</option>
                    </select>
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-1px] rounded-sm disabled:opacity-60"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {loading ? "Subscribing..." : "Subscribe to The Operations Brief →"}
                  </button>
                  <p className="text-xs text-[var(--muted)] text-center" style={{ fontFamily: "var(--font-inter)" }}>
                    Weekly. Unsubscribe any time.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
