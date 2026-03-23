import type { ReactNode } from "react";

export function SectionShell({
  id,
  children,
  className = "",
  ariaLabel,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      id={id}
      data-analytics-section={id}
      aria-label={ariaLabel}
      className={`scroll-mt-24 md:scroll-mt-28 ${className}`.trim()}
    >
      {children}
    </section>
  );
}
