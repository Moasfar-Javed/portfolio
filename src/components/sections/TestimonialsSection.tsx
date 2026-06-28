import { motion, useReducedMotion } from "framer-motion";
import { testimonials } from "../../data/site";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function TestimonialsSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="testimonials" className="py-20 md:py-24" ariaLabel="Testimonials">
      <Container>
        <SectionHeader
          eyebrow="Proof"
          title="What it's like to work with me"
          description="A few words from founders and collaborators on how I communicate, solve problems, and help move products forward"
        />
        <div className="grid gap-12 md:grid-cols-2 md:gap-0">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className={`m-0 ${i === 0 ? "md:pr-14" : "md:border-l md:border-border-strong md:pl-14"}`}
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, ease: easing, delay: i * 0.08 }}
              >
                <span
                  className="block font-display text-5xl leading-none text-accent/40"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="mt-3 text-lg leading-relaxed text-fg md:text-xl">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 text-sm">
                  <span className="font-medium text-fg">{t.name}</span>
                  <span className="mt-1 block text-fg-subtle">{t.role}</span>
                </figcaption>
              </motion.div>
            </figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}
