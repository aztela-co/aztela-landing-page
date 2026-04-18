import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Image
          src="/aztela-logo.png"
          alt="Aztela"
          width={90}
          height={30}
        />
        <p className="text-[var(--muted)] text-sm font-[var(--font-inter)]">
          © {new Date().getFullYear()} Aztela. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-[var(--muted)] font-[var(--font-inter)]">
          <a href="https://cal.com/ali-z.s-yb9uld/data-strategy-assessment" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--off-white)] transition-colors">
            Contact
          </a>
          <a href="https://aztela.com" className="hover:text-[var(--off-white)] transition-colors">
            aztela.com
          </a>
        </div>
      </div>
    </footer>
  );
}
