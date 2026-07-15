import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import {
  contact,
  portfolioProjects,
  siteMeta,
  type Project,
} from "../../data/site";
import { trackExternalLinkClick } from "../../lib/analytics";
import { useLenisRef } from "../../hooks/useLenisRef";
import { easing } from "../../lib/motion";
import { ProjectImageFrame } from "./ProjectImageFrame";

type PortfolioPanelProps = {
  open: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  /** Keep scroll lock when a nested project detail is open on top. */
  retainScrollLock?: boolean;
};

const paneVariants = {
  hidden: { x: "100%" },
  show: {
    x: 0,
    transition: { duration: 0.42, ease: easing },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.32, ease: easing },
  },
};

function PortfolioContactTile() {
  const mailSubject = encodeURIComponent(
    `Project inquiry from ${siteMeta.shortTitle} portfolio`,
  );
  const mailBody = encodeURIComponent(
    "Hi Moasfar,\n\nI would like to discuss a project with you.\n\nProject details:\n- \n\nTimeline:\n- \n\nBudget:\n- \n\nBest,\n",
  );
  const mailHref = `mailto:${contact.email}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <li className="bg-surface-1">
      <a
        href={mailHref}
        onClick={() =>
          trackExternalLinkClick("Email", mailHref, "portfolio_contact_tile")
        }
        className="group flex h-full w-full cursor-pointer flex-col text-left transition-colors duration-200 hover:bg-surface-2/40"
      >
        <span
          className="relative flex aspect-[16/10] w-full shrink-0 items-center justify-center overflow-hidden border-b border-border"
          style={{
            background:
              "radial-gradient(circle at 30% 35%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 55%), radial-gradient(circle at 78% 70%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 50%), var(--surface-2)",
          }}
        >
          <span className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <span className="relative rounded-full border border-border-strong bg-surface-1/85 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-accent backdrop-blur-sm">
            Next project
          </span>
        </span>
        <span className="flex flex-1 flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 md:px-8">
          <span>
            <span className="block text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
              Contact
            </span>
            <span className="mt-2 block font-display text-xl font-medium tracking-tight text-fg md:text-2xl">
              Have something in mind?
            </span>
          </span>
          <span className="block text-sm leading-relaxed text-fg-muted">
            {contact.subtitle}
          </span>
          <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-accent transition-colors duration-300 group-hover:text-fg">
            Email me
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </span>
      </a>
    </li>
  );
}

export function PortfolioPanel({
  open,
  onClose,
  onSelectProject,
  retainScrollLock = false,
}: PortfolioPanelProps) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenisRef();
  // Eager body portal — waiting on an effect blanks one frame when opening.
  const portalRoot = typeof document !== "undefined" ? document.body : null;

  // Lock page scroll for the lifetime of the panel — same contract as ProjectDetailModal.
  // Do not depend on retainScrollLock here; nesting another sheet must not unlock Lenis.
  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    scrollRef.current?.scrollTo({ top: 0 });
    lenisRef.current?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      lenisRef.current?.start();
    };
  }, [open, lenisRef]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Let the nested project detail own Escape while it's open.
      if (e.key === "Escape" && !retainScrollLock) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, retainScrollLock]);

  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100]" role="presentation">
          <motion.button
            type="button"
            className={`absolute inset-0 bg-surface-0/70 dark:bg-surface-0/80 md:bg-surface-0/60 ${
              retainScrollLock ? "" : "backdrop-blur-sm"
            }`}
            aria-label="Close portfolio"
            onClick={onClose}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: easing }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            className={`fixed inset-0 z-[1] flex h-dvh max-h-dvh flex-col overflow-hidden border-border-strong bg-surface-1 shadow-soft md:inset-y-0 md:left-auto md:h-dvh md:w-full md:max-w-[min(64rem,58vw)] md:border-l ${
              retainScrollLock ? "" : "glass-card"
            }`}
            variants={reduce ? undefined : paneVariants}
            initial={reduce ? false : "hidden"}
            animate="show"
            exit="exit"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 md:px-8 md:py-5">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
                  Portfolio
                </p>
                <h2
                  id={titleId}
                  className="mt-2 font-display text-2xl font-medium tracking-tight text-fg md:mt-3 md:text-3xl"
                >
                  All work
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="glass-pill shrink-0 rounded-full border border-border-strong px-3 py-2 text-sm font-medium text-fg-muted transition-colors duration-300 hover:border-accent/50 hover:text-fg"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
            >
              <ul className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
                {portfolioProjects.map((project) => (
                  <li key={project.slug} className="bg-surface-1">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="group flex h-full w-full cursor-pointer flex-col text-left transition-colors duration-200 hover:bg-surface-2/40"
                      aria-label={`View details for ${project.name}`}
                    >
                      <span className="relative block w-full shrink-0 overflow-hidden border-b border-border">
                        <ProjectImageFrame
                          src={project.heroImage.src}
                          alt=""
                          primaryColor={project.primaryColor}
                          aspectRatio="16 / 10"
                          className="w-full"
                          padded
                        />
                        <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-border-strong bg-surface-1/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-accent opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                          Open
                        </span>
                      </span>
                      <span className="flex flex-1 flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 md:px-8">
                        <span>
                          <span className="block text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
                            {project.role}
                          </span>
                          <span className="mt-2 block font-display text-xl font-medium tracking-tight text-fg md:text-2xl">
                            {project.name}
                          </span>
                        </span>
                        <span className="block text-sm leading-relaxed text-fg-muted">
                          {project.summary}
                        </span>
                        <span className="mt-auto flex flex-wrap gap-2">
                          {project.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="glass-pill inline-flex rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
                {portfolioProjects.length % 2 === 1 ? (
                  <PortfolioContactTile />
                ) : null}
              </ul>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>,
    portalRoot,
  );
}
