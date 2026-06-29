import { motion, useReducedMotion } from "framer-motion";
import { freelance } from "../../data/site";
import { GLASS_CARD_HOVER, ROW_HOVER } from "../../lib/interactive";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SpotlightSurface } from "../ui/SpotlightSurface";
import { ButtonLink } from "../ui/ButtonLink";
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
                <motion.li
                  key={b}
                  className={`flex gap-3 ${ROW_HOVER}`}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.55, ease: easing, delay: 0.05 * i }}
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span className="leading-relaxed">{b}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <div className="flex flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-dashed border-border-strong bg-surface-1 p-8 transition-[background-color,border-color] duration-500 ease-out group-hover:border-border group-hover:bg-fg dark:bg-surface-2/70 dark:group-hover:border-border-strong dark:group-hover:bg-fg">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-fg-subtle transition-colors duration-500 group-hover:text-surface-0/55">
                Upwork
              </p>
              <p className="mt-4 font-display text-2xl font-medium tracking-tight text-fg transition-colors duration-500 group-hover:text-surface-0">
                A profile shaped by delivery, not just promise
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted transition-colors duration-500 group-hover:text-surface-0/78">
                A look at the work that has made me a top rated engineer with a
                100% job success rate
              </p>
            </div>
            <ButtonLink
              href={freelance.cta.href}
              variant="primary"
              external
              className="self-start transition-colors duration-500 group-hover:border-transparent group-hover:bg-surface-0 group-hover:text-fg group-hover:hover:bg-surface-0/92 dark:group-hover:bg-surface-0 dark:group-hover:text-fg dark:group-hover:hover:bg-surface-0/88"
              magnetic
            >
              {freelance.cta.label}
              <ArrowIcon />
            </ButtonLink>
          </div>
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
