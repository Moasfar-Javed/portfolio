import { motion, useReducedMotion } from "framer-motion";
import { experience } from "../../data/site";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
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
          eyebrow="Experience"
          title="The journey behind the work"
          description="A timeline of the roles that shaped my approach to engineering and product development"
        />
        <ol className="relative before:absolute before:left-[0.3rem] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-border-strong md:before:left-[0.4rem]">
          {experience.map((item, i) => {
            const isLast = i === experience.length - 1;
            return (
              <li
                key={`${item.org}-${item.period}-${i}`}
                className="relative pl-9 md:pl-14"
              >
                <span className="absolute left-0 top-2.5 flex h-[0.7rem] w-[0.7rem] items-center justify-center rounded-full border border-border-strong bg-surface-1 md:left-[0.05rem]">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
                </span>
                <motion.div
                  className={`py-7 md:py-8 ${isLast ? "" : "border-b border-border-strong"}`}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.5, ease: easing, delay: i * 0.06 }}
                >
                  <div className="grid gap-4">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                      <h3 className="font-display text-xl font-medium tracking-tight text-fg">
                        {item.title}
                      </h3>
                      <span className="text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle sm:text-right">
                        {kindLabel[item.kind]}
                      </span>
                      <p className="text-sm text-fg-muted">{item.org}</p>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle sm:text-right">
                        {item.period || "Ongoing"}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-fg-muted md:text-base">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </Container>
    </SectionShell>
  );
}
