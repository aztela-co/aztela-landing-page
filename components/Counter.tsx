"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  label: string;
  delay?: number;
}

function parseNumber(val: string): { prefix: string; num: number; suffix: string } {
  const match = val.match(/^([<>+]?\s*)?(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { prefix: "", num: 0, suffix: val };
  return { prefix: match[1] ?? "", num: parseFloat(match[2]), suffix: match[3] ?? "" };
}

export default function Counter({ value, label, delay = 0 }: Props) {
  const { prefix, num, suffix } = parseNumber(value);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          timeoutId = setTimeout(() => {
            const duration = 1400;
            const steps = 50;
            const interval = duration / steps;
            let step = 0;
            intervalId = setInterval(() => {
              step++;
              const progress = step / steps;
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.round(eased * num));
              if (step >= steps && intervalId) clearInterval(intervalId);
            }, interval);
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [num, delay]);

  return (
    <div ref={ref} className="reveal">
      <p
        className="text-3xl md:text-4xl text-[var(--off-white)] font-semibold"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {prefix}{display}{suffix}
      </p>
      <p className="text-[var(--muted)] text-sm mt-1" style={{ fontFamily: "var(--font-inter)" }}>
        {label}
      </p>
    </div>
  );
}
