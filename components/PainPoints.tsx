"use client";

import { useState, useEffect, useCallback } from "react";
import AnimatedSection from "./AnimatedSection";

const segments = [
  {
    id: "distributors",
    label: "Distributors",
    pains: [
      {
        urgency: "Revenue walking out the door",
        title: "You turned away orders last quarter. The stock was in a different branch.",
        body: "A customer calls, your system says zero. You decline the order or expedite at cost. Three days later someone finds 400 units sitting in another location. That's not a data problem — that's lost revenue and a damaged relationship.",
      },
      {
        urgency: "Supplier blindsided you. Again.",
        title: "You found out about the delay when your customer called to complain.",
        body: "Your supplier slipped two weeks on a critical line. You had no warning. By the time it hit your inbox, the customer had already escalated. You ate the expedite fee, the chargeback, and the conversation about switching suppliers.",
      },
      {
        urgency: "Stocked out on your busiest month",
        title: "You ran out of your top 3 movers during peak season. Again.",
        body: "Your reorder triggers haven't been touched in months. Demand shifted. The system didn't. You stocked out on the SKUs that carry your margin while overstock on slow movers sat untouched. This happens every cycle.",
      },
      {
        urgency: "$400K+ in working capital tied up wrong",
        title: "Half your warehouse is inventory you can't move. The other half keeps running dry.",
        body: "Dead stock accumulates while fast movers stockout. Every inventory dollar tied up in the wrong product is a dollar not available for the right one. The imbalance compounds every quarter and nobody has a clear plan to fix it.",
      },
    ],
  },
  {
    id: "wholesalers",
    label: "Wholesalers",
    pains: [
      {
        urgency: "Margin gone before you noticed",
        title: "You quoted a job at margin. The invoice wiped it out. Again.",
        body: "Supplier raised prices. It took three weeks to hit your system. In that window you quoted, won, and committed to a job priced on the old cost. By the time the invoice arrived, the profit was already spent. This is a quarterly event.",
      },
      {
        urgency: "$2M renewal on a supplier who's failing you",
        title: "You gave a major supplier a renewal last month. They've missed lead times 6 of the last 8 orders.",
        body: "You don't have the consolidated performance data to push back. Each buyer tracks their own suppliers their own way. So in the room, you have a relationship and a feeling — they have the contract. You needed the numbers.",
      },
      {
        urgency: "Best SKUs stocking out, $2M of dead stock idle",
        title: "Your fastest movers keep running dry while slow inventory collects dust.",
        body: "Buying decisions are driven by relationships and habit, not velocity data. Capital is locked in product lines that haven't moved in 9 months. Meanwhile your top revenue drivers stockout and customers learn to call competitors first.",
      },
      {
        urgency: "Pricing margins eroding every quarter",
        title: "You don't know your real landed cost until 6 weeks after the PO.",
        body: "Freight, duties, surcharges — all reconciled after the fact. You're setting prices on incomplete cost data, then absorbing the difference when the real numbers arrive. It's structural margin leakage that compounds every single quarter.",
      },
    ],
  },
  {
    id: "manufacturers",
    label: "Manufacturers",
    pains: [
      {
        urgency: "$11K in scrap. Nobody caught it.",
        title: "Your line ran 4 hours on the wrong spec last Tuesday.",
        body: "Engineering updated the BOM. The floor kept running the old version. By the time someone caught it, you had a shift's worth of scrap, a rework queue, and a delivery you couldn't make. The engineering change took 10 minutes. The fallout took 3 days.",
      },
      {
        urgency: "Supplier slipped 11 days. Your line stopped 3.",
        title: "You found out your component was late when the line ran dry — not 11 days earlier when it was obvious.",
        body: "The data was there. The supplier's shipping confirmation, their historical slip rate, the lead time trend. Nobody was watching it. So the shortage hit your production floor instead of your inbox — and you expedited at a premium to recover what advance notice would have prevented entirely.",
      },
      {
        urgency: "6+ hrs of downtime from a location failure",
        title: "You shut down a line last month looking for materials that were 50 feet away.",
        body: "The components were in a different bay. Nobody knew. The line sat for hours while people physically walked the floor. That's not a warehouse problem — that's a visibility problem that costs you real production hours every single month.",
      },
      {
        urgency: "Customer found out before you did",
        title: "An order was late. You found out when the customer called — not your system.",
        body: "There's no real-time WIP tracking. Orders move through the floor invisibly. Delays compound silently until they become missed deadlines. By the time it surfaces, the customer is already frustrated and you're already behind — with no good explanation.",
      },
    ],
  },
];

export default function PainPoints() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % segments.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(advance, 5000);
    return () => clearInterval(id);
  }, [paused, advance]);

  const seg = segments[active];

  return (
    <section id="problems" className="px-6 py-24 md:py-32 bg-[var(--charcoal-light)]">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
            Sound familiar?
          </p>
          <h2
            className="text-4xl md:text-5xl font-semibold text-[var(--off-white)] mb-10 max-w-xl leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The problems keeping your operations team up at night
          </h2>

          {/* Segment tabs */}
          <div className="flex gap-1 mb-12 border border-[var(--border)] p-1 rounded-sm w-fit">
            {segments.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActive(i); setPaused(true); }}
                className={`px-5 py-2 text-sm font-medium transition-all rounded-sm ${
                  active === i
                    ? "bg-[var(--coral)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--off-white)]"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div key={seg.id} className="grid md:grid-cols-2 gap-px bg-[var(--border)] pain-grid-enter">
          {seg.pains.map(({ urgency, title, body }, i) => (
            <div
              key={title}
              className="bg-[var(--charcoal-light)] p-8 md:p-10 h-full group hover:bg-[var(--charcoal-mid)] transition-colors"
            >
              <span
                className="inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-1 mb-5 rounded-sm"
                style={{
                  fontFamily: "var(--font-inter)",
                  background: "rgba(255,80,80,0.08)",
                  color: "#ff6b6b",
                  border: "1px solid rgba(255,80,80,0.2)",
                }}
              >
                {urgency}
              </span>
              <h3
                className="text-xl font-semibold text-[var(--off-white)] mb-3 leading-snug group-hover:text-[var(--coral)] transition-colors"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Progress indicators */}
        <div className="flex gap-2 mt-6">
          {segments.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setPaused(true); }}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-[var(--coral)]" : "w-4 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
