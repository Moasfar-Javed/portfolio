import { motion, useReducedMotion } from "framer-motion";
import { about } from "../../data/site";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function AboutSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="about" className="py-20 md:py-24" ariaLabel="About">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Positioning" title={about.title} />
            <div className="space-y-5 text-base leading-relaxed text-fg-muted">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.06 * i}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <ul className="border-t border-border-strong lg:mt-2">
            {about.highlights.map((h, i) => (
              <li key={h}>
                <motion.div
                  className="group flex items-baseline gap-4 border-b border-border-strong py-3.5"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.55, ease: easing, delay: 0.05 * i }}
                >
                  <span className="font-display text-xs font-medium tabular-nums tracking-[0.1em] text-fg-subtle transition-colors duration-300 group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-snug text-fg-muted transition-colors duration-300 group-hover:text-fg">
                    {h}
                  </span>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </SectionShell>
  );
}
