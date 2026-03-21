import { motion, useReducedMotion } from "framer-motion";
import { contact } from "../../data/site";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { ButtonLink } from "../ui/ButtonLink";
import { SectionShell } from "./SectionShell";

export function ContactSection() {
  const reduce = useReducedMotion();
  const mailHref = `mailto:${contact.email}`;

  return (
    <SectionShell id="contact" className="py-24 md:py-32" ariaLabel="Contact">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface-1 px-8 py-14 shadow-glow md:px-14 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.2]" />
          <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-accent/15 blur-[100px] dark:bg-accent/12" />
          <div className="relative mx-auto max-w-2xl text-center">
            <motion.p
              className="text-xs font-medium uppercase tracking-[0.24em] text-fg-subtle"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: easing }}
            >
              Contact
            </motion.p>
            <motion.h2
              className="mt-4 font-display text-balance text-3xl font-medium tracking-tight text-fg sm:text-4xl"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: easing, delay: 0.05 }}
            >
              {contact.title}
            </motion.h2>
            <motion.p
              className="mt-5 text-base leading-relaxed text-fg-muted"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easing, delay: 0.1 }}
            >
              {contact.subtitle}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easing, delay: 0.14 }}
            >
              <ButtonLink href={mailHref} variant="primary" magnetic>
                Email me
              </ButtonLink>
              <ButtonLink
                href={contact.socials.find((s) => s.label === "Upwork")?.href ?? "#"}
                variant="secondary"
                external
              >
                Upwork profile
              </ButtonLink>
            </motion.div>
            <motion.ul
              className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-fg-muted"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={reduce ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: easing, delay: 0.2 }}
            >
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="transition-colors hover:text-fg"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </motion.ul>
            <p className="mt-8 text-xs text-fg-subtle">{contact.email}</p>
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}
