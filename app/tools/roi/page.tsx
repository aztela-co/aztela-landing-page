"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

type Segment = "distributor" | "wholesaler" | "manufacturer";

const SEGMENT_LABELS: Record<Segment, string> = {
  distributor: "Distributor",
  wholesaler: "Wholesaler",
  manufacturer: "Manufacturer",
};

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

function calcDistributor(revenue: number, locations: number, skus: number) {
  const stockoutLoss  = revenue * 0.028;
  const expediteCost  = revenue * 0.006;
  const deadStockCost = revenue * 0.018;
  const reconTime     = locations * 52 * 3 * 75;
  return [
    { label: "Revenue lost to stockouts & inter-branch blindness", value: stockoutLoss,  pct: "2.8% of revenue" },
    { label: "Expedited freight on avoidable shortages",           value: expediteCost,  pct: "0.6% of revenue" },
    { label: "Working capital tied up in dead stock",              value: deadStockCost, pct: "1.8% of revenue" },
    { label: "Staff time reconciling inventory data",              value: reconTime,     pct: `${locations} locations × 3 hrs/week` },
  ];
}

function calcWholesaler(revenue: number, suppliers: number, quotes: number) {
  const marginLeakage = revenue * 0.018;
  const deadStock     = revenue * 0.022;
  const pricingLag    = revenue * 0.009;
  const reconTime     = suppliers * 12 * 2.5 * 85;
  return [
    { label: "Margin eroded by supplier pricing lag",             value: marginLeakage, pct: "1.8% of revenue" },
    { label: "Capital tied up in dead & slow-moving stock",       value: deadStock,     pct: "2.2% of revenue" },
    { label: "Margin lost on quotes priced on stale cost data",   value: pricingLag,    pct: "0.9% of revenue" },
    { label: "Supplier reconciliation & pricing admin",           value: reconTime,     pct: `${suppliers} suppliers × 2.5 hrs/month` },
  ];
}

function calcManufacturer(revenue: number, lines: number, stoppages: number, workOrders: number) {
  const stoppageCost   = stoppages * 12 * 6 * 4200;
  const assemblyStarve = workOrders * 12 * 0.08 * 2400;
  const expediteCost   = revenue * 0.012;
  const lateDelivery   = revenue * 0.006;
  return [
    { label: "Line stoppages from component shortages",                        value: stoppageCost,   pct: `${stoppages}/mo × 6 hrs avg × $4,200/hr` },
    { label: "Assembly starvation — labor staged for jobs that can't run",     value: assemblyStarve, pct: `~8% of ${workOrders} work orders/mo stalled on component delays` },
    { label: "Expedite freight on avoidable shortages",                        value: expediteCost,   pct: "1.2% of revenue" },
    { label: "Late delivery penalties & customer relationship cost",           value: lateDelivery,   pct: "0.6% of revenue" },
  ];
}

export default function ROICalculatorPage() {
  const [segment,    setSegment]    = useState<Segment>("distributor");
  const [revenue,    setRevenue]    = useState(25);
  const [field2,     setField2]     = useState(6);
  const [field3,     setField3]     = useState(50);
  const [field4,     setField4]     = useState(100);
  const [calculated, setCalculated] = useState(false);

  const revenueVal = revenue * 1_000_000;

  const rows =
    segment === "distributor" ? calcDistributor(revenueVal, field2, field3) :
    segment === "wholesaler"  ? calcWholesaler(revenueVal, field2, field3) :
    calcManufacturer(revenueVal, field2, field3, field4);

  const total       = rows.reduce((s, r) => s + r.value, 0);
  const conservative = total * 0.35;

  const field2Label: Record<Segment, string> = {
    distributor: "Number of locations / branches",
    wholesaler:  "Number of active suppliers",
    manufacturer: "Number of production lines",
  };
  const field3Label: Record<Segment, string> = {
    distributor: "Active SKU count (approx)",
    wholesaler:  "Open quotes at any time",
    manufacturer: "Monthly line stoppages from component shortages",
  };
  const field3Max: Record<Segment, number> = { distributor: 50000, wholesaler: 500, manufacturer: 15 };

  function switchSegment(s: Segment) {
    setSegment(s);
    setCalculated(false);
    if (s === "manufacturer") { setField3(3); setField4(100); }
    else { setField3(50); }
  }

  const f3Pct =
    segment === "manufacturer" ? (field3 - 1) / 14 * 100 :
    segment === "wholesaler"   ? (field3 - 1) / 499 * 100 :
    (field3 - 1) / 19999 * 100;

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="px-6 py-16 md:py-24 grid-bg">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-[var(--muted)] text-xs mb-8 hover:text-[var(--off-white)] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ← Back to tools
            </Link>
            <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              Operational ROI Calculator
            </p>
            <h1
              className="text-3xl md:text-5xl font-semibold text-[var(--off-white)] mb-5 leading-tight"
              style={{ fontFamily: "var(--font-playfair)", letterSpacing: "-0.02em" }}
            >
              See what operational data gaps are costing you — right now.
            </h1>
            <p className="text-[var(--muted)] text-lg font-light max-w-xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
              Input your numbers. Get a conservative estimate of what better operational intelligence would recover — broken down by specific cost category.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">

            {/* Segment selector */}
            <div className="flex gap-1 p-1 border border-[var(--border)] rounded-sm w-fit mb-10">
              {(["distributor", "wholesaler", "manufacturer"] as Segment[]).map(s => (
                <button
                  key={s}
                  onClick={() => switchSegment(s)}
                  className={`px-6 py-2.5 text-sm font-medium transition-all rounded-sm ${segment === s ? "bg-[var(--coral)] text-white" : "text-[var(--muted)] hover:text-[var(--off-white)]"}`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {SEGMENT_LABELS[s]}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-start">

              {/* Inputs */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--off-white)]" style={{ fontFamily: "var(--font-playfair)" }}>Your numbers</h2>

                {/* Revenue */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>Annual Revenue</label>
                    <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>${revenue}M</span>
                  </div>
                  <input type="range" min={5} max={250} value={revenue}
                    onChange={e => { setRevenue(+e.target.value); setCalculated(false); }}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, var(--coral) ${(revenue - 5) / 245 * 100}%, var(--border) 0%)` }} />
                  <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    <span>$5M</span><span>$250M</span>
                  </div>
                </div>

                {/* Field 2 */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{field2Label[segment]}</label>
                    <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{field2}</span>
                  </div>
                  <input type="range" min={1} max={segment === "manufacturer" ? 20 : 100} value={field2}
                    onChange={e => { setField2(+e.target.value); setCalculated(false); }}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, var(--coral) ${(field2 - 1) / (segment === "manufacturer" ? 19 : 99) * 100}%, var(--border) 0%)` }} />
                  <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    <span>1</span><span>{segment === "manufacturer" ? 20 : 100}</span>
                  </div>
                </div>

                {/* Field 3 */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{field3Label[segment]}</label>
                    <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>
                      {field3.toLocaleString()}
                    </span>
                  </div>
                  <input type="range" min={1}
                    max={segment === "manufacturer" ? 15 : segment === "wholesaler" ? 500 : 20000}
                    value={field3}
                    onChange={e => { setField3(+e.target.value); setCalculated(false); }}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, var(--coral) ${f3Pct}%, var(--border) 0%)` }} />
                  <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    {segment === "manufacturer" ? <><span>1</span><span>15</span></> :
                     segment === "wholesaler"   ? <><span>1</span><span>500</span></> :
                                                  <><span>1K</span><span>20K</span></>}
                  </div>
                </div>

                {/* Field 4 — manufacturer only */}
                {segment === "manufacturer" && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>Active work orders per month</label>
                      <span className="text-sm font-semibold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{field4}</span>
                    </div>
                    <input type="range" min={10} max={500} value={field4}
                      onChange={e => { setField4(+e.target.value); setCalculated(false); }}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, var(--coral) ${(field4 - 10) / 490 * 100}%, var(--border) 0%)` }} />
                    <div className="flex justify-between text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                      <span>10</span><span>500</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setCalculated(true)}
                  className="w-full py-4 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all hover:translate-y-[-1px] rounded-sm"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Calculate My Operational Cost →
                </button>

                <p className="text-xs text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  Based on industry benchmarks from Palantir, Gartner, and our own client data. Conservative estimates — actual results typically higher.
                </p>
              </div>

              {/* Results */}
              <div className={`transition-all duration-500 ${calculated ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4 pointer-events-none"}`}>
                <h2 className="text-xl font-semibold text-[var(--off-white)] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                  Estimated annual cost of data gaps
                </h2>

                <div className="space-y-3 mb-6">
                  {rows.map((r, i) => (
                    <div key={i} className="border border-[var(--border)] p-4 rounded-sm hover:border-[var(--coral)] transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className="text-sm text-[var(--off-white)]" style={{ fontFamily: "var(--font-inter)" }}>{r.label}</p>
                        <p className="text-sm font-bold text-red-400 shrink-0" style={{ fontFamily: "var(--font-inter)" }}>{fmt(r.value)}</p>
                      </div>
                      <div className="w-full h-0.5 rounded-full bg-[var(--border)]">
                        <div className="h-full rounded-full bg-red-400 transition-all duration-700"
                          style={{ width: calculated ? `${(r.value / total) * 100}%` : "0%" }} />
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-1" style={{ fontFamily: "var(--font-inter)" }}>{r.pct}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-[var(--border)] rounded-sm p-6"
                  style={{ background: "rgba(77,128,255,0.04)", borderColor: "rgba(77,128,255,0.25)" }}>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Total identified exposure</p>
                      <p className="text-2xl font-bold text-red-400" style={{ fontFamily: "var(--font-inter)" }}>{fmt(total)}/yr</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Conservative recoverable (35%)</p>
                      <p className="text-2xl font-bold text-[var(--coral)]" style={{ fontFamily: "var(--font-inter)" }}>{fmt(conservative)}/yr</p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-5 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    Most clients recover 35–60% of identified exposure within the first 6 months. This estimate uses the conservative 35% floor.
                  </p>
                  <a
                    href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3.5 bg-[var(--coral)] text-white font-medium text-sm hover:bg-[var(--coral-light)] transition-all rounded-sm"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Get Your Free Assessment — We'll Verify These Numbers →
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
