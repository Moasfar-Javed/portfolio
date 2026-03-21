import { motion, useReducedMotion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-accent/80"
      style={{ scaleX: scrollYProgress }}
      aria-hidden
    />
  );
}
