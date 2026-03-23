import type { CSSProperties } from "react";

const CHEVRON_COUNT = 3;

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M3 5 L16 16 L29 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function HeroSectionDivider() {
  return (
    <div className="relative flex justify-center py-6 md:py-8" aria-hidden>
      <div
        className="hero-chevron-stack pointer-events-none text-fg-muted/80 dark:text-fg-muted/75"
        style={{ "--hero-chevron-n": CHEVRON_COUNT } as CSSProperties}
      >
        {Array.from({ length: CHEVRON_COUNT }, (_, i) => (
          <div
            key={i}
            className="hero-chevron-row"
            style={{ "--hero-chevron-i": i } as CSSProperties}
          >
            <ChevronIcon className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
