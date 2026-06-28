import { motion, useReducedMotion } from "framer-motion";
import { skillGroups } from "../../data/site";
import { easing, staggerContainer } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function SkillsSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="stack" className="py-20 md:py-24" ariaLabel="Skills and stack">
      <Container>
        <SectionHeader
          eyebrow="Stack"
          title="The tools I use to ship real products"
          description="A practical snapshot of the technologies I use across frontend, backend, cloud and delivery"
        />
        <motion.dl
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-10%" }}
          className="border-t border-border-strong"
        >
          {skillGroups.map((g, gi) => (
            <motion.div
              key={g.title}
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
                          delay: gi * 0.05,
                        },
                      },
                    }
              }
              className="grid gap-3 border-b border-border-strong py-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-10 sm:py-7"
            >
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle sm:pt-0.5">
                {g.title}
              </dt>
              <dd className="m-0">
                <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-fg-muted transition-colors duration-300 hover:text-fg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </Container>
    </SectionShell>
  );
}
