import { motion, useReducedMotion } from "framer-motion";
import { experience } from "../../data/site";
import { GLASS_CARD_HOVER } from "../../lib/interactive";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SpotlightSurface } from "../ui/SpotlightSurface";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

const kindLabel: Record<(typeof experience)[number]["kind"], string> = {
  "full-time": "Full-time",
  contract: "Contract",
  freelance: "Freelance",
};

export function ExperienceSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="journey" className="py-20 md:py-24" ariaLabel="Experience">
      <Container>
        <SectionHeader
          eyebrow="Journey"
          title="A timeline that reads like a story—not a wall of bullets."
          description="Blend full-time, contract, and freelance chapters. The rhythm stays light; the signal stays high."
        />
        <ol className="relative space-y-10 before:absolute before:left-[0.55rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border-strong md:before:left-3">
          {experience.map((item, i) => (
            <motion.li
              key={`${item.org}-${item.period}-${i}`}
              className="relative pl-10 md:pl-14"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.5, ease: easing, delay: i * 0.06 }}
            >
              <span className="absolute left-0 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border-strong bg-surface-1 shadow-soft md:left-1">
                <span className="h-2 w-2 rounded-full bg-accent/80" />
              </span>
              <SpotlightSurface
                className={`glass-card overflow-hidden rounded-2xl border border-border-strong p-6 shadow-soft md:p-7 ${GLASS_CARD_HOVER}`}
                innerClassName="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                    <span>{kindLabel[item.kind]}</span>
                    <span className="text-border-strong">·</span>
                    <span>{item.period}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">{item.org}</p>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-fg-muted md:text-right md:text-base">
                  {item.description}
                </p>
              </SpotlightSurface>
            </motion.li>
          ))}
        </ol>
      </Container>
    </SectionShell>
  );
}
