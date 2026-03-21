import { motion, useReducedMotion, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { useCallback, useRef } from "react";
import { useLenisRef } from "../../hooks/useLenisRef";

const base =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary: `${base} bg-fg text-surface-0 shadow-soft hover:bg-fg/90 dark:bg-fg dark:text-surface-0`,
  secondary: `${base} border border-border-strong bg-surface-1 text-fg hover:border-accent/40 hover:bg-surface-2`,
  ghost: `${base} text-fg-muted hover:text-fg hover:bg-surface-2/80`,
} as const;

export type ButtonVariant = keyof typeof variants;

export function ButtonLink({
  href,
  children,
  variant,
  external,
  className = "",
  magnetic = false,
}: {
  href: string;
  children: ReactNode;
  variant: ButtonVariant;
  external?: boolean;
  className?: string;
  magnetic?: boolean;
}) {
  const lenisRef = useLenisRef();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useSpring(0, { stiffness: 320, damping: 24, mass: 0.35 });
  const y = useSpring(0, { stiffness: 320, damping: 24, mass: 0.35 });

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const lenis = lenisRef.current;
      if (href.startsWith("#") && lenis) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el instanceof HTMLElement) {
          lenis.scrollTo(el, {
            offset: -80,
            duration: 1.15,
          });
        }
      }
    },
    [href, lenisRef],
  );

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!magnetic || reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.12);
    y.set(dy * 0.12);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `${variants[variant]} ${className}`.trim();

  if (magnetic && !reduce) {
    return (
      <motion.a
        ref={ref}
        href={href}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cls}
        style={{ x, y }}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.a>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      className={cls}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
