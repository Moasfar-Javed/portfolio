import { motion, useReducedMotion } from "framer-motion";
import { testimonials } from "../../data/site";
import { GLASS_CARD_HOVER } from "../../lib/interactive";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { TiltCard } from "../ui/TiltCard";
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
            <figure key={t.name} className="m-0 h-full">
              <TiltCard className="h-full">
                <div
                  className={`glass-card h-full overflow-hidden rounded-2xl border border-border-strong p-7 shadow-soft ${GLASS_CARD_HOVER}`}
                >
                  <motion.div
                    className="relative z-[1] flex h-full min-h-0 flex-col justify-between"
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.5, ease: easing, delay: i * 0.08 }}
                  >
                    <blockquote className="text-base leading-relaxed text-fg-muted">
                      "{t.quote}"
                    </blockquote>
                    <figcaption className="mt-8 text-sm">
                      <span className="font-medium text-fg">{t.name}</span>
                      <span className="mt-1 block text-fg-subtle">{t.role}</span>
                    </figcaption>
                  </motion.div>
                </div>
              </TiltCard>
            </figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}
