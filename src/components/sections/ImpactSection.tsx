import { motion, useReducedMotion } from "framer-motion";
import { metrics } from "../../data/site";
import { GLASS_CARD_HOVER } from "../../lib/interactive";
import { easing, staggerContainer } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SpotlightSurface } from "../ui/SpotlightSurface";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function ImpactSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="impact" className="py-20 md:py-24" ariaLabel="Highlights">
      <Container>
        <SectionHeader
          eyebrow="Impact"
          title="Numbers that frame the work—placeholders for now, direction forever."
          description="Swap metrics as you calibrate your story. The layout stays composed and scannable."
        />
        <motion.ul
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-12%" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
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
                        transition: { duration: 0.5, ease: easing, delay: i * 0.06 },
                      },
                    }
              }
            >
              <SpotlightSurface
                className={`glass-card h-full overflow-hidden rounded-2xl border border-border-strong p-6 shadow-soft ${GLASS_CARD_HOVER}`}
              >
                <p className="font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl">
                  {m.value}
                </p>
                <p className="mt-3 text-sm leading-snug text-fg-muted">{m.label}</p>
              </SpotlightSurface>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </SectionShell>
  );
}
