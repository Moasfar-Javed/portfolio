import { motion, useReducedMotion } from "framer-motion";
import { testimonials } from "../../data/site";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function TestimonialsSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell
      id="testimonials"
      className="py-20 md:py-24"
      ariaLabel="Testimonials"
    >
      <Container>
        <SectionHeader
          eyebrow="Proof"
          title="Quiet social proof—tight quotes, real tone."
          description="Optional section, kept minimal so it feels credible instead of salesy."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, ease: easing, delay: i * 0.08 }}
              className="flex h-full flex-col justify-between rounded-2xl border border-border-strong bg-surface-1 p-7 shadow-soft"
            >
              <blockquote className="text-base leading-relaxed text-fg-muted">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 text-sm">
                <span className="font-medium text-fg">{t.name}</span>
                <span className="mt-1 block text-fg-subtle">{t.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}
