import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project, ProjectScreenshot } from "../../data/site";
import { easing } from "../../lib/motion";
import { useLenisRef } from "../../hooks/useLenisRef";
import { ProjectImageFrame } from "./ProjectImageFrame";
import { ProjectScreenshotLightbox } from "./ProjectScreenshotLightbox";

type ProjectDetailModalProps = {
  project: Project | null;
  onClose: () => void;
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

function ScreenshotGallery({
  shots,
  primaryColor,
  portalRoot,
  lightboxIndex,
  onOpenLightbox,
  onCloseLightbox,
  onNavigateLightbox,
}: {
  shots: ProjectScreenshot[];
  primaryColor: string;
  portalRoot: HTMLElement;
  lightboxIndex: number | null;
  onOpenLightbox: (index: number) => void;
  onCloseLightbox: () => void;
  onNavigateLightbox: (index: number) => void;
}) {
  if (!shots.length) return null;

  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
        Gallery
      </h3>
      <div className="mt-4 overflow-hidden rounded-xl border border-border-strong">
        <ul className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
          {shots.map((shot, index) => (
            <li
              key={shot.src}
              className={`bg-surface-1 ${
                shots.length % 2 === 1 && index === shots.length - 1
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <button
                type="button"
                onClick={() => onOpenLightbox(index)}
                className="group flex h-full w-full cursor-pointer flex-col text-left transition-colors duration-200 hover:bg-surface-2/40"
                aria-label={`Open screenshot ${index + 1} of ${shots.length}${shot.description ? `: ${shot.description}` : ""}`}
              >
                <div className="relative w-full shrink-0">
                  <ProjectImageFrame
                    src={shot.src}
                    alt={shot.description}
                    primaryColor={primaryColor}
                    aspectRatio="16 / 10"
                    padding="compact"
                    className="w-full"
                  />
                  <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-border-strong bg-surface-1/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-accent opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                    Open
                  </span>
                </div>
                {shot.description ? (
                  <span className="line-clamp-1 border-t border-border px-3 py-2 text-[11px] leading-snug text-fg-subtle">
                    {shot.description}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ProjectScreenshotLightbox
        shots={shots}
        primaryColor={primaryColor}
        activeIndex={lightboxIndex}
        portalRoot={portalRoot}
        onClose={onCloseLightbox}
        onNavigate={onNavigateLightbox}
      />
    </div>
  );
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenisRef = useLenisRef();
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    setLightboxIndex(null);
  }, [project?.slug]);

  useEffect(() => {
    if (!project) return;

    closeRef.current?.focus();
    lenisRef.current?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxIndex === null) onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      lenisRef.current?.start();
    };
  }, [project, onClose, lenisRef, lightboxIndex]);

  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {project ? (
        <div className="fixed inset-0 z-[100]" role="presentation">
          <motion.button
            type="button"
            className="absolute inset-0 bg-surface-0/70 backdrop-blur-sm dark:bg-surface-0/80 md:bg-surface-0/60"
            aria-label="Close project details"
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
            aria-describedby={descId}
            data-lenis-prevent
            className="glass-card fixed inset-0 z-[1] flex h-dvh max-h-dvh flex-col overflow-hidden border-border-strong bg-surface-1 shadow-soft md:inset-y-0 md:left-auto md:h-dvh md:w-full md:max-w-[min(64rem,58vw)] md:border-l"
            variants={reduce ? undefined : paneVariants}
            initial={reduce ? false : "hidden"}
            animate="show"
            exit="exit"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 md:px-8 md:py-5">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
                  {project.role}
                </p>
                <h2
                  id={titleId}
                  className="mt-2 font-display text-2xl font-medium tracking-tight text-fg md:mt-3 md:text-3xl"
                >
                  {project.name}
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
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
            >
              <ProjectImageFrame
                src={project.heroImage.src}
                alt={project.heroImage.description}
                primaryColor={project.primaryColor}
                aspectRatio="21 / 9"
                className="border-b border-border"
                padded
              />

              <div id={descId} className="space-y-8 px-5 py-6 sm:px-6 md:px-8">
                <div className="space-y-4">
                  {project.description.split("\n\n").map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="text-sm leading-relaxed text-fg-muted md:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                  <p className="text-sm font-medium text-fg md:text-base">
                    {project.outcome}
                  </p>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <li key={t}>
                      <span
                        className="glass-pill inline-flex rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-muted"
                      >
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>

                {portalRoot ? (
                  <ScreenshotGallery
                    shots={project.screenshots}
                    primaryColor={project.primaryColor}
                    portalRoot={portalRoot}
                    lightboxIndex={lightboxIndex}
                    onOpenLightbox={setLightboxIndex}
                    onCloseLightbox={() => setLightboxIndex(null)}
                    onNavigateLightbox={setLightboxIndex}
                  />
                ) : null}
              </div>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>,
    portalRoot,
  );
}
