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
            <SectionHeader
              eyebrow="Positioning"
              title={about.title}
            />
            <div className="space-y-5 text-base leading-relaxed text-fg-muted">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.06 * i}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <motion.ul
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: easing }}
          >
            {about.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 rounded-xl border border-border-strong bg-surface-1 px-4 py-3 text-sm text-fg shadow-soft"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="leading-snug text-fg-muted">{h}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </SectionShell>
  );
}
