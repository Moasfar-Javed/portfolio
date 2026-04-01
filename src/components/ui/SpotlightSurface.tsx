import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type SpotlightSurfaceProps = {
  children: ReactNode;
  className?: string;
  /** Classes on the inner stacking wrapper (e.g. flex layouts). */
  innerClassName?: string;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "innerClassName"
>;

/**
 * Muted card-wide glow + rim on hover; hotspot follows the pointer (spring) with a subtle organic wobble.
 */
export function SpotlightSurface({
  children,
  className = "",
  innerClassName = "",
  ...rest
}: SpotlightSurfaceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  const hoverActiveRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const xp = useMotionValue(50);
  const yp = useMotionValue(50);
  const springConfig = reduce
    ? { stiffness: 600, damping: 48, mass: 0.4 }
    : { stiffness: 200, damping: 26, mass: 0.35 };
  const xs = useSpring(xp, springConfig);
  const ys = useSpring(yp, springConfig);

  useMotionValueEvent(xs, "change", (v) => {
    if (hoverActiveRef.current && !reduce) return;
    rootRef.current?.style.setProperty("--spot-x", `${v}%`);
  });
  useMotionValueEvent(ys, "change", (v) => {
    if (hoverActiveRef.current && !reduce) return;
    rootRef.current?.style.setProperty("--spot-y", `${v}%`);
  });

  useEffect(() => {
    if (reduce || !hovered || coarsePointer) return;
    let id = 0;
    const step = () => {
      id = requestAnimationFrame(step);
      const el = rootRef.current;
      if (!el) return;
      const t = performance.now() * 0.001;
      const wx =
        Math.sin(t * 1.05) * 1.6 +
        Math.sin(t * 2.4 + 0.7) * 0.85 +
        Math.sin(t * 4.1) * 0.35;
      const wy =
        Math.cos(t * 0.88 + 0.4) * 1.35 +
        Math.sin(t * 1.75) * 0.75 +
        Math.cos(t * 3.2 + 1.1) * 0.3;
      const x = clamp(xs.get() + wx, 3, 97);
      const y = clamp(ys.get() + wy, 3, 97);
      el.style.setProperty("--spot-x", `${x}%`);
      el.style.setProperty("--spot-y", `${y}%`);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [reduce, hovered, coarsePointer, xs, ys]);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      xp.set(((clientX - r.left) / r.width) * 100);
      yp.set(((clientY - r.top) / r.height) * 100);
    },
    [xp, yp],
  );

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    update(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) update(t.clientX, t.clientY);
  };

  const reset = () => {
    xp.set(50);
    yp.set(50);
  };

  return (
    <div
      ref={rootRef}
      className={`spotlight-surface group ${className}`.trim()}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
        } as CSSProperties
      }
      onPointerEnter={() => {
        hoverActiveRef.current = true;
        setHovered(true);
      }}
      onPointerLeave={() => {
        hoverActiveRef.current = false;
        setHovered(false);
        reset();
      }}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      {...rest}
    >
      <div
        className="spotlight-surface__glow-base pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-[480ms] ease-out group-hover:opacity-[0.72]"
        aria-hidden
      />
      <div
        className="spotlight-surface__glow-spot pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-[480ms] ease-out group-hover:opacity-[0.68]"
        aria-hidden
      />
      <div
        className="spotlight-surface__glow-noise pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-[480ms] ease-out group-hover:opacity-[0.42] dark:mix-blend-overlay"
        aria-hidden
      />
      <div
        className="spotlight-surface__ring-base pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-[0.88]"
        aria-hidden
      />
      <div
        className="spotlight-surface__ring-spot pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-[0.72]"
        aria-hidden
      />
      <div
        className={`relative z-[1] h-full min-h-0 ${innerClassName}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}
