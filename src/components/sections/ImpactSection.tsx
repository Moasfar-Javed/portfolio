import { motion, useReducedMotion } from "framer-motion";
import { metrics } from "../../data/site";
import { easing, staggerContainer } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function ImpactSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="impact" className="py-20 md:py-24" ariaLabel="Highlights">
      <Container>
        <SectionHeader
          eyebrow="Impact"
          title="Numbers that reflect the work"
          description="From shipped products to client engagements, these highlight the range and consistency of my work as an engineer"
        />
        <motion.ul
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-12%" }}
          className="grid grid-cols-2 divide-x divide-y divide-border-strong border-t border-border-strong sm:grid-cols-4 sm:divide-y-0"
        >
          {metrics.map((m, i) => (
            <motion.li
              key={m.label}
              variants={
                reduce
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 16 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: easing,
                          delay: i * 0.06,
                        },
                      },
                    }
              }
              className="group px-1 py-7 sm:px-6 sm:py-8"
            >
              <p className="font-display text-4xl font-medium tracking-tight text-fg transition-colors duration-300 group-hover:text-accent sm:text-5xl">
                {m.value}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle">
                {m.label}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </SectionShell>
  );
}
