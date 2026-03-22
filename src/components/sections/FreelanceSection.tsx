import { motion, useReducedMotion } from "framer-motion";
import { freelance } from "../../data/site";
import { GLASS_CARD_HOVER, INSET_PANEL_HOVER, ROW_HOVER } from "../../lib/interactive";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SpotlightSurface } from "../ui/SpotlightSurface";
import { ButtonLink } from "../ui/ButtonLink";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function FreelanceSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell
      id="freelance"
      className="py-20 md:py-24"
      ariaLabel="Freelance and clients"
    >
      <Container>
        <SpotlightSurface
          className={`glass-card overflow-hidden rounded-3xl border border-border-strong p-8 shadow-soft md:p-12 lg:p-14 ${GLASS_CARD_HOVER}`}
          innerClassName="grid gap-12 md:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="relative min-w-0">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-accent/12 blur-3xl dark:bg-accent/10" />
            <SectionHeader
              eyebrow="Clients"
              title={freelance.title}
              description={freelance.body}
            />
            <motion.ul
              className="mt-8 space-y-3 text-sm text-fg-muted"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easing, delay: 0.08 }}
            >
              {freelance.bullets.map((b, i) => (
                <Reveal key={b} delay={0.05 * i}>
                  <li className={`flex gap-3 ${ROW_HOVER}`}>
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                </Reveal>
              ))}
            </motion.ul>
          </div>
          <SpotlightSurface
            className={`glass-card-muted overflow-hidden rounded-2xl border border-dashed border-border-strong ${INSET_PANEL_HOVER}`}
            innerClassName="flex flex-col justify-between gap-8 p-8"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-fg-subtle">
                Upwork
              </p>
              <p className="mt-4 font-display text-2xl font-medium tracking-tight text-fg">
                Long-term partners, not one-off tickets.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                Public profile placeholder—swap the URL when you are ready to route
                real traffic.
              </p>
            </div>
            <ButtonLink
              href={freelance.cta.href}
              variant="primary"
              external
              className="self-start"
              magnetic
            >
              {freelance.cta.label}
              <ArrowIcon />
            </ButtonLink>
          </SpotlightSurface>
        </SpotlightSurface>
      </Container>
    </SectionShell>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
