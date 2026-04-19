"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const solutionsNav = [
  { label: "Cascade Intelligence",   sub: "Manufacturers",  href: "/solutions#supply-chain" },
  { label: "Inventory Intelligence",  sub: "Distributors",   href: "/solutions#inventory" },
  { label: "Margin Intelligence",     sub: "Wholesalers",    href: "/solutions#margin" },
  { label: "Delivery Intelligence",   sub: "All segments",   href: "/solutions#delivery" },
];

const industriesNav = [
  { label: "Distributors",   href: "/industries/distributors" },
  { label: "Wholesalers",    href: "/industries/wholesalers" },
  { label: "Manufacturers",  href: "/industries/manufacturers" },
];

const toolsNav = [
  { label: "ROI Calculator",      sub: "Quantify exposure",       href: "/tools/roi" },
  { label: "Cascade Simulator",   sub: "Trace impact before it hits", href: "/tools/cascade" },
];

const resourcesNav = [
  { label: "Case Studies",   href: "/case-studies" },
  { label: "Newsletter",     href: "/newsletter" },
];

type DropdownItem = { label: string; sub?: string; href: string };

function Dropdown({ label, items, footer }: {
  label: string;
  items: DropdownItem[];
  footer?: { label: string; href: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--off-white)] transition-colors duration-150"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {label}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 12 12"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2.5 border border-[var(--border)] rounded overflow-hidden shadow-2xl transition-all duration-200 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
        style={{
          background: "rgba(16,17,24,0.98)",
          backdropFilter: "blur(20px)",
          minWidth: 210,
        }}
      >
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.04] transition-colors group"
            style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
          >
            <span
              className="text-sm text-[var(--muted)] group-hover:text-[var(--off-white)] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.label}
            </span>
            {item.sub && (
              <span
                className="text-[10px] text-[var(--muted)] ml-4 opacity-50 shrink-0"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.sub}
              </span>
            )}
          </Link>
        ))}
        {footer && (
          <Link
            href={footer.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 px-4 py-2.5 text-xs font-medium text-[var(--coral)] hover:bg-white/[0.04] transition-colors"
            style={{ fontFamily: "var(--font-inter)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {footer.label} →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(14,15,20,0.90)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/aztela-logo.png" alt="Aztela" width={86} height={27} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="/#problems"
            className="text-sm text-[var(--muted)] hover:text-[var(--off-white)] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Problems
          </a>
          <Dropdown label="Solutions" items={solutionsNav} footer={{ label: "All Solutions", href: "/solutions" }} />
          <Dropdown label="Industries" items={industriesNav} />
          <Dropdown label="Tools" items={toolsNav} footer={{ label: "All Tools", href: "/tools" }} />
          <a
            href="/#who"
            className="text-sm text-[var(--muted)] hover:text-[var(--off-white)] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Who We Serve
          </a>
          <Dropdown label="Resources" items={resourcesNav} />
        </nav>

        {/* CTA */}
        <a
          href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-white transition-all duration-150 hover:translate-y-[-1px] hover:shadow-[0_0_28px_rgba(77,128,255,0.35)]"
          style={{
            fontFamily: "var(--font-inter)",
            background: "var(--coral)",
            padding: "8px 18px",
            borderRadius: 4,
            boxShadow: "0 0 18px rgba(77,128,255,0.18)",
          }}
        >
          Get Free Assessment
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-5 bg-[var(--off-white)] transition-all duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-px w-5 bg-[var(--off-white)] transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-[var(--off-white)] transition-all duration-300 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-screen" : "max-h-0"}`}
        style={{
          borderTop: open ? "1px solid rgba(255,255,255,0.06)" : "none",
          background: "rgba(14,15,20,0.98)",
        }}
      >
        <div className="px-6 py-5 flex flex-col gap-1 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
          <a href="/#problems" onClick={() => setOpen(false)} className="py-2.5 text-[var(--muted)] hover:text-[var(--off-white)] transition-colors">
            Problems
          </a>

          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest pt-3 pb-1 opacity-50">Solutions</p>
          {solutionsNav.map(s => (
            <Link key={s.href} href={s.href} onClick={() => setOpen(false)}
              className="py-2 pl-3 text-[var(--muted)] hover:text-[var(--off-white)] transition-colors flex items-center justify-between">
              <span>{s.label}</span>
              <span className="text-[10px] opacity-50">{s.sub}</span>
            </Link>
          ))}

          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest pt-3 pb-1 opacity-50">Industries</p>
          {industriesNav.map(ind => (
            <Link key={ind.href} href={ind.href} onClick={() => setOpen(false)}
              className="py-2 pl-3 text-[var(--muted)] hover:text-[var(--off-white)] transition-colors">
              {ind.label}
            </Link>
          ))}

          <a href="/#who" onClick={() => setOpen(false)} className="py-2.5 text-[var(--muted)] hover:text-[var(--off-white)] transition-colors">
            Who We Serve
          </a>

          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest pt-3 pb-1 opacity-50">Tools</p>
          {toolsNav.map(t => (
            <Link key={t.href} href={t.href} onClick={() => setOpen(false)}
              className="py-2 pl-3 text-[var(--muted)] hover:text-[var(--off-white)] transition-colors flex items-center justify-between">
              <span>{t.label}</span>
              <span className="text-[10px] opacity-50">{t.sub}</span>
            </Link>
          ))}

          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest pt-3 pb-1 opacity-50">Resources</p>
          {resourcesNav.map(r => (
            <Link key={r.href} href={r.href} onClick={() => setOpen(false)}
              className="py-2 pl-3 text-[var(--muted)] hover:text-[var(--off-white)] transition-colors">
              {r.label}
            </Link>
          ))}

          <a
            href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 py-3 text-center text-white font-medium rounded"
            style={{ background: "var(--coral)" }}
          >
            Get Free Assessment →
          </a>
        </div>
      </div>
    </header>
  );
}
