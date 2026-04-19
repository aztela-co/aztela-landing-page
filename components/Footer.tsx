import Image from "next/image";
import Link from "next/link";

const solutions = [
  { label: "Cascade Intelligence",  href: "/solutions#supply-chain" },
  { label: "Inventory Intelligence", href: "/solutions#inventory" },
  { label: "Margin Intelligence",   href: "/solutions#margin" },
  { label: "Delivery Intelligence", href: "/solutions#delivery" },
];

const industries = [
  { label: "Distributors",   href: "/industries/distributors" },
  { label: "Wholesalers",    href: "/industries/wholesalers" },
  { label: "Manufacturers",  href: "/industries/manufacturers" },
];

const resources = [
  { label: "ROI Calculator", href: "/tools" },
  { label: "Case Studies",   href: "/case-studies" },
  { label: "Newsletter",     href: "/newsletter" },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">

        {/* Brand col — spans 2 on md */}
        <div className="col-span-2">
          <Image src="/aztela-logo.png" alt="Aztela" width={88} height={28} className="mb-4" />
          <p
            className="text-sm text-[var(--muted)] leading-relaxed mb-6 max-w-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Operational intelligence for distributors, wholesalers, and manufacturers — built on the data you already have.
          </p>
          <a
            href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-white transition-all hover:translate-y-[-1px]"
            style={{
              fontFamily: "var(--font-inter)",
              background: "var(--coral)",
              padding: "9px 20px",
              borderRadius: 4,
              boxShadow: "0 0 18px rgba(77,128,255,0.18)",
            }}
          >
            Get Free Assessment
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Solutions */}
        <div>
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-4 opacity-60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Solutions
          </p>
          <ul className="flex flex-col gap-2.5">
            {solutions.map(s => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="text-sm text-[var(--muted)] hover:text-[var(--off-white)] transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Industries */}
        <div>
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-4 opacity-60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Industries
          </p>
          <ul className="flex flex-col gap-2.5">
            {industries.map(i => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className="text-sm text-[var(--muted)] hover:text-[var(--off-white)] transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-4 opacity-60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Resources
          </p>
          <ul className="flex flex-col gap-2.5">
            {resources.map(r => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="text-sm text-[var(--muted)] hover:text-[var(--off-white)] transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ borderTop: "1px solid var(--border)" }}
        className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3"
      >
        <p
          className="text-xs text-[var(--muted)] opacity-60"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          © {new Date().getFullYear()} Aztela. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="mailto:ali@aztellmedia.com"
            className="text-xs text-[var(--muted)] hover:text-[var(--off-white)] transition-colors opacity-60 hover:opacity-100"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Contact
          </a>
          <span className="text-[var(--border)] text-xs">|</span>
          <a
            href="https://aztela.com"
            className="text-xs text-[var(--muted)] hover:text-[var(--off-white)] transition-colors opacity-60 hover:opacity-100"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            aztela.com
          </a>
        </div>
      </div>
    </footer>
  );
}
