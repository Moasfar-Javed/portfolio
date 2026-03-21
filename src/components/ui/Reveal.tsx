import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easing } from "../../lib/motion";

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, ease: easing, delay }}
    >
      {children}
    </motion.div>
  );
}
