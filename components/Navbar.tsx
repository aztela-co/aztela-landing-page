"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const industries = [
  { label: "Distributors", href: "/industries/distributors" },
  { label: "Wholesalers", href: "/industries/wholesalers" },
  { label: "Manufacturers", href: "/industries/manufacturers" },
];

const resources = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "ROI Calculator", href: "/tools" },
  { label: "Newsletter", href: "/newsletter" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--charcoal)]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Image src="/aztela-logo.png" alt="Aztela" width={82} height={26} priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--muted)]" style={{ fontFamily: "var(--font-inter)" }}>
          <a href="/#problems" className="hover:text-[var(--off-white)] transition-colors">Problems</a>
          <a href="/#solutions" className="hover:text-[var(--off-white)] transition-colors">Solutions</a>

          {/* Industries dropdown */}
          <div className="relative" onMouseEnter={() => setIndustriesOpen(true)} onMouseLeave={() => setIndustriesOpen(false)}>
            <button className="flex items-center gap-1 hover:text-[var(--off-white)] transition-colors">
              Industries
              <svg className={`w-3 h-3 transition-transform duration-200 ${industriesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {industriesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 border border-[var(--border)] bg-[var(--charcoal-light)] rounded-sm overflow-hidden shadow-xl">
                {industries.map((ind) => (
                  <Link
                    key={ind.href}
                    href={ind.href}
                    className="block px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--off-white)] hover:bg-[var(--charcoal-mid)] transition-colors border-b border-[var(--border)] last:border-0"
                    onClick={() => setIndustriesOpen(false)}
                  >
                    {ind.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Resources dropdown */}
          <div className="relative" onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
            <button className="flex items-center gap-1 hover:text-[var(--off-white)] transition-colors">
              Resources
              <svg className={`w-3 h-3 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {resourcesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 border border-[var(--border)] bg-[var(--charcoal-light)] rounded-sm overflow-hidden shadow-xl">
                {resources.map((r) => (
                  <Link key={r.href} href={r.href}
                    className="block px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--off-white)] hover:bg-[var(--charcoal-mid)] transition-colors border-b border-[var(--border)] last:border-0"
                    onClick={() => setResourcesOpen(false)}>
                    {r.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href="/#who" className="hover:text-[var(--off-white)] transition-colors">Who We Serve</a>
        </nav>

        <a
          href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer"
          className="hidden md:inline-flex items-center px-5 py-2 rounded-sm bg-[var(--coral)] text-white text-sm font-medium hover:bg-[var(--coral-light)] transition-colors"
        >
          Book a Call
        </a>

        <button className="md:hidden text-[var(--off-white)]" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span className="block w-5 h-px bg-current mb-1" />
          <span className="block w-5 h-px bg-current mb-1" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--charcoal-light)] border-t border-[var(--border)] px-6 py-4 flex flex-col gap-4 text-sm">
          <a href="/#problems" onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--off-white)]">Problems</a>
          <a href="/#solutions" onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--off-white)]">Solutions</a>
          <p className="text-[var(--muted)] text-xs uppercase tracking-widest mt-1">Industries</p>
          {industries.map((ind) => (
            <Link key={ind.href} href={ind.href} onClick={() => setOpen(false)} className="pl-3 text-[var(--muted)] hover:text-[var(--off-white)]">
              {ind.label}
            </Link>
          ))}
          <p className="text-[var(--muted)] text-xs uppercase tracking-widest mt-1">Resources</p>
          {resources.map((r) => (
            <Link key={r.href} href={r.href} onClick={() => setOpen(false)} className="pl-3 text-[var(--muted)] hover:text-[var(--off-white)]">
              {r.label}
            </Link>
          ))}
          <a href="/#who" onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--off-white)]">Who We Serve</a>
          <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer" className="text-[var(--coral)]">Book a Call</a>
        </div>
      )}
    </header>
  );
}
