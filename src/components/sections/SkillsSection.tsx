import { motion, useReducedMotion } from "framer-motion";
import { skillGroups } from "../../data/site";
import { GLASS_CARD_HOVER, PILL_CHIP_HOVER } from "../../lib/interactive";
import { easing, staggerContainer } from "../../lib/motion";
import { Container } from "../ui/Container";
import { TiltCard } from "../ui/TiltCard";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function SkillsSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="stack" className="py-20 md:py-24" ariaLabel="Skills and stack">
      <Container>
        <SectionHeader
          eyebrow="Stack"
          title="Tools grouped the way I actually think about them."
          description="No inflated percentages—just honest clusters you can remix as your toolkit evolves."
        />
        <motion.div
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-10%" }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {skillGroups.map((g, gi) => (
            <motion.div
              key={g.title}
              variants={reduce ? undefined : { hidden: {}, show: {} }}
            >
              <TiltCard>
                <div
                  className={`glass-card overflow-hidden rounded-2xl border border-border-strong p-6 shadow-soft ${GLASS_CARD_HOVER}`}
                >
                  <motion.div
                    className="relative z-[1] h-full min-h-0"
                    variants={
                      reduce
                        ? undefined
                        : {
                            hidden: { opacity: 0, y: 18 },
                            show: {
                              opacity: 1,
                              y: 0,
                              transition: {
                                duration: 0.5,
                                ease: easing,
                                delay: gi * 0.05,
                              },
                            },
                          }
                    }
                  >
                    <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-fg-subtle">
                      {g.title}
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <li key={item}>
                          <span
                            className={`glass-pill inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-medium text-fg-muted ${PILL_CHIP_HOVER}`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </SectionShell>
  );
}
