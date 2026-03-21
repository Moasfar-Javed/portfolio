import { motion, useReducedMotion } from "framer-motion";
import { easing } from "../../lib/motion";

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="mb-12 max-w-2xl lg:mb-16">
      <motion.p
        className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-fg-subtle"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.45, ease: easing }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="font-display text-balance text-3xl font-medium tracking-tight text-fg sm:text-4xl"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.55, ease: easing, delay: 0.05 }}
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          className="mt-4 text-base leading-relaxed text-fg-muted"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.5, ease: easing, delay: 0.1 }}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
