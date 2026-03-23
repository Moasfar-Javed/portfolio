import { motion, useReducedMotion } from "framer-motion";
import { hero } from "../../data/site";
import { easing, staggerContainer } from "../../lib/motion";
import { Container } from "../ui/Container";
import { ButtonLink } from "../ui/ButtonLink";
import { SectionShell } from "./SectionShell";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell
      id="hero"
      className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
      ariaLabel="Introduction"
    >
      <div className="hero-backdrop-vanish pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.35] dark:opacity-[0.2]" />
        <div className="absolute inset-0 bg-noise opacity-60" />
        <div className="hero-readability-scrim absolute inset-0" aria-hidden />
      </div>
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-accent/15 blur-[100px] dark:bg-accent/12" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-accent/10 blur-[110px] dark:bg-accent/8" />

      <Container className="relative z-10">
        <motion.div
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "show"}
          className="max-w-3xl"
        >
          <motion.div
            variants={
              reduce
                ? undefined
                : {
                    hidden: { opacity: 0, y: 14 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: easing },
                    },
                  }
            }
            className="glass-card mb-8 inline-flex items-center gap-2 rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-fg-muted shadow-soft"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {hero.badge}
          </motion.div>

          <motion.h1
            variants={
              reduce
                ? undefined
                : {
                    hidden: { opacity: 0, y: 22 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.65, ease: easing, delay: 0.05 },
                    },
                  }
            }
            className="font-display text-balance text-4xl font-medium tracking-tight text-fg sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            variants={
              reduce
                ? undefined
                : {
                    hidden: { opacity: 0, y: 18 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: easing, delay: 0.12 },
                    },
                  }
            }
            className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl"
          >
            {hero.subhead}
          </motion.p>

          <motion.p
            variants={
              reduce
                ? undefined
                : {
                    hidden: { opacity: 0, y: 16 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: easing, delay: 0.18 },
                    },
                  }
            }
            className="mt-5 max-w-xl text-sm leading-relaxed text-fg-subtle sm:text-base"
          >
            {hero.body}
          </motion.p>

          <motion.div
            variants={
              reduce
                ? undefined
                : {
                    hidden: { opacity: 0, y: 16 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: easing, delay: 0.24 },
                    },
                  }
            }
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {hero.ctas.map((c, i) => (
              <ButtonLink
                key={c.label}
                href={c.href}
                variant={
                  c.variant === "primary"
                    ? "primary"
                    : c.variant === "secondary"
                      ? "secondary"
                      : "ghost"
                }
                external={"external" in c ? Boolean(c.external) : false}
                magnetic={c.variant === "primary"}
                className={i === 0 ? "min-w-[8.5rem]" : ""}
              >
                {c.label}
              </ButtonLink>
            ))}
          </motion.div>
        </motion.div>
      </Container>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--surface-0))",
          WebkitMaskImage: "linear-gradient(to right, #000 0%, transparent 60%)",
          maskImage: "linear-gradient(to right, #000 0%, transparent 60%)",
        }}
        aria-hidden
      />
    </SectionShell>
  );
}
