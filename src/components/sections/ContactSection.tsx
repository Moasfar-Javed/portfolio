import { motion, useReducedMotion } from "framer-motion";
import portrait from "../../assets/pic.png";
import { contact, siteMeta } from "../../data/site";
import { GLASS_CARD_HOVER, LINK_HOVER } from "../../lib/interactive";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SpotlightSurface } from "../ui/SpotlightSurface";
import { ButtonLink } from "../ui/ButtonLink";
import { SectionShell } from "./SectionShell";

export function ContactSection() {
  const reduce = useReducedMotion();
  const mailHref = `mailto:${contact.email}`;

  return (
    <SectionShell id="contact" className="py-24 md:py-32" ariaLabel="Contact">
      <Container>
        <SpotlightSurface
          className={`glass-card overflow-hidden rounded-3xl border border-border-strong px-8 py-14 shadow-glow md:px-14 md:py-16 ${GLASS_CARD_HOVER}`}
          innerClassName="relative"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.2]" />
          <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-accent/15 blur-[100px] dark:bg-accent/12" />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <motion.div
              className="mx-auto mb-8 flex justify-center"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: easing }}
            >
              <div className="h-32 w-32 overflow-hidden rounded-full border border-border-strong bg-[#3B4046] shadow-soft ring-1 ring-border sm:h-40 sm:w-40">
                <img
                  src={portrait}
                  alt={`${siteMeta.name}, portrait`}
                  className="h-full w-full object-cover object-center"
                  width={160}
                  height={160}
                  decoding="async"
                />
              </div>
            </motion.div>
            <motion.p
              className="text-xs font-medium uppercase tracking-[0.24em] text-fg-subtle"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: easing, delay: 0.04 }}
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
                href={
                  contact.socials.find((s) => s.label === "Upwork")?.href ?? "#"
                }
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
                    className={LINK_HOVER}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </motion.ul>
            <a
              href={mailHref}
              className={`mt-8 inline-block text-xs text-fg-subtle ${LINK_HOVER}`}
            >
              {contact.email}
            </a>
          </div>
        </SpotlightSurface>
      </Container>
    </SectionShell>
  );
}
