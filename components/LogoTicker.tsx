const logos = [
  "Grainger",
  "Ferguson",
  "Fastenal",
  "MSC Industrial",
  "HD Supply",
  "WESCO",
  "Sysco",
  "US Foods",
  "Genuine Parts",
  "McKesson",
  "Anixter",
  "Interline Brands",
];

export default function LogoTicker() {
  const doubled = [...logos, ...logos];

  return (
    <div className="mt-12 mb-0">
      <p
        className="text-[var(--muted)] text-xs tracking-[0.2em] uppercase mb-6 text-center"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Trusted by operators across
      </p>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--charcoal), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--charcoal), transparent)" }} />
        <div className="marquee-track flex gap-12 items-center w-max">
          {doubled.map((name, i) => (
            <span
              key={i}
              className="text-[var(--muted)] text-sm font-semibold tracking-widest uppercase whitespace-nowrap opacity-40 hover:opacity-80 transition-opacity cursor-default select-none"
              style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.15em" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
