import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";

/**
 * Wraps any card with a subtle 3-D tilt (spring physics) and a soft accent glow on hover.
 *
 * Uses a plain <div> as the outermost element so framer-motion variant propagation
 * (stagger, whileInView, etc.) is never interrupted by an intermediate motion element.
 */
export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const rotX = useSpring(0, { stiffness: 200, damping: 26, mass: 0.35 });
  const rotY = useSpring(0, { stiffness: 200, damping: 26, mass: 0.35 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    rotY.set(cx * 8);
    rotX.set(-cy * 5);
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        rotX.set(0);
        rotY.set(0);
        setHovered(false);
      }}
    >
      <motion.div
        className="h-full rounded-2xl"
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 1000,
          boxShadow: hovered
            ? "0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent)"
            : "0 0 0 1px transparent",
          transition: "box-shadow 0.3s ease-out",
        }}
      >
        {/* Glow: accent border ring + radial top bloom */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)",
          }}
          aria-hidden
        />
        {children}
      </motion.div>
    </div>
  );
}
