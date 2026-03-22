import { motion, useReducedMotion } from "framer-motion";
import { contact, siteMeta } from "../../data/site";
import { LINK_HOVER } from "../../lib/interactive";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();

  return (
    <footer className="relative z-20 border-t border-border bg-surface-1 py-16">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-lg font-medium tracking-tight text-fg">
              {siteMeta.name}
            </p>
            <p className="mt-2 max-w-sm text-sm text-fg-muted">
              Full-stack engineering with a mobile-first lens. Built with React,
              TypeScript, Tailwind, and motion—swap in your story when ready.
            </p>
          </div>
          <motion.ul
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: easing }}
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
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-8 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {siteMeta.name}. All rights reserved.</span>
          <span className="uppercase tracking-[0.2em]">Craft · Ship · Refine</span>
        </div>
      </Container>
    </footer>
  );
}
