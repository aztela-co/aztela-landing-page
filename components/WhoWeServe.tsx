import AnimatedSection from "./AnimatedSection";

const segments = [
  {
    title: "Distributors",
    description:
      "Multi-location, high SKU-count operations where inventory accuracy and order fill rates are mission critical.",
    tags: ["Inventory Accuracy", "Order Fill Rate", "Supplier Lead Times"],
  },
  {
    title: "Wholesalers",
    description:
      "High-volume businesses that need tight demand forecasting and pricing intelligence to protect margins.",
    tags: ["Demand Forecasting", "Margin Analysis", "Procurement Data"],
  },
  {
    title: "Manufacturers",
    description:
      "Production planning, raw material visibility, and shop floor data that connects to commercial outcomes.",
    tags: ["Production Planning", "Material Requirements", "Yield Analytics"],
  },
];

export default function WhoWeServe() {
  return (
    <section id="who" className="px-6 py-24 md:py-32 bg-[var(--charcoal-light)]">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-[var(--coral)] text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
            Who we serve
          </p>
          <h2
            className="text-4xl md:text-5xl font-semibold text-[var(--off-white)] mb-16 max-w-xl leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Built for high-operational-data organizations
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--border)]">
          {segments.map(({ title, description, tags }, i) => (
            <AnimatedSection key={title} delay={i * 100}>
              <div className="bg-[var(--charcoal-light)] p-8 md:p-10 h-full group hover:bg-[var(--charcoal-mid)] transition-colors">
                <h3
                  className="text-2xl font-semibold text-[var(--off-white)] mb-4 group-hover:text-[var(--coral)] transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {title}
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-6" style={{ fontFamily: "var(--font-inter)" }}>
                  {description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 border border-[var(--border)] text-[var(--muted)] group-hover:border-[var(--coral)] group-hover:text-[var(--off-white)] transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
