import { motion, useReducedMotion } from "framer-motion";
import { projects } from "../../data/site";
import { easing, staggerContainer } from "../../lib/motion";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

export function ProjectsSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="work" className="py-20 md:py-24" ariaLabel="Selected work">
      <Container>
        <SectionHeader
          eyebrow="Selected work"
          title="Case-shaped projects with room for narrative, visuals, and outcomes."
          description="This grid is intentionally editorial—hover for depth, tap through on mobile. Replace copy and add thumbnails when you have assets."
        />
        <motion.div
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-8%" }}
          className="grid gap-5 lg:grid-cols-12 lg:gap-6"
        >
          {projects.map((p, i) => {
            const span =
              i === 0 ? "lg:col-span-7" : i === 1 ? "lg:col-span-5" : "lg:col-span-12";
            return (
              <motion.article
                key={p.name}
                variants={
                  reduce
                    ? undefined
                    : {
                        hidden: { opacity: 0, y: 22 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.55, ease: easing, delay: i * 0.08 },
                        },
                      }
                }
                className={`group relative ${span}`}
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-border-strong bg-surface-1 shadow-soft transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-glow">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-accent/[0.05]" />
                  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/10 blur-3xl opacity-40 transition-opacity duration-500 group-hover:opacity-70" />

                  <div className="relative flex flex-col gap-6 p-7 md:flex-row md:items-start md:justify-between md:p-8">
                    <div className="max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
                          {p.role}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
                        <span className="text-xs text-fg-subtle">Featured build</span>
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-medium tracking-tight text-fg md:text-3xl">
                        {p.name}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
                        {p.summary}
                      </p>
                      <p className="mt-4 text-sm font-medium text-fg">{p.outcome}</p>
                    </div>
                    <ul className="flex flex-wrap gap-2 md:max-w-xs md:justify-end">
                      {p.tags.map((t) => (
                        <li key={t}>
                          <span className="inline-flex rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-fg-muted transition-colors duration-300 group-hover:border-accent/25 group-hover:text-fg">
                            {t}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </SectionShell>
  );
}
