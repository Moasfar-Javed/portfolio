import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { portfolioProjects, projects, type Project } from "../../data/site";
import { useLenisRef } from "../../hooks/useLenisRef";
import { trackEvent } from "../../lib/analytics";
import {
  deepLinkIntroDelay,
  setSuppressPathSync,
  wait,
} from "../../lib/deep-link";
import { GLASS_CARD_HOVER } from "../../lib/interactive";
import { easing, staggerContainer } from "../../lib/motion";
import { Container } from "../ui/Container";
import { PortfolioPanel } from "../ui/PortfolioPanel";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { ProjectImageFrame } from "../ui/ProjectImageFrame";
import { TiltCard } from "../ui/TiltCard";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

function ViewMoreWorkCta({ onClick }: { onClick: () => void }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Image 1 ≈ button near bottom of viewport; image 2 ≈ button mid-frame above Experience.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.88", "start 0.48"],
  });

  // Outline draws first; fill follows slightly behind so it reads as stroke → fill.
  const borderDraw = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const fillOpacity = useTransform(scrollYProgress, [0.35, 1], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.35], [0.55, 1]);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const sync = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ w: width, h: height });
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // True pill path in pixel space — avoids preserveAspectRatio stretch breaking pathLength.
  const inset = 0.75;
  const r = Math.max(0, size.h / 2 - inset);
  const pillPath =
    size.w > 0 && size.h > 0
      ? [
          `M ${inset + r} ${inset}`,
          `H ${size.w - inset - r}`,
          `A ${r} ${r} 0 0 1 ${size.w - inset - r} ${size.h - inset}`,
          `H ${inset + r}`,
          `A ${r} ${r} 0 0 1 ${inset + r} ${inset}`,
          "Z",
        ].join(" ")
      : "";

  return (
    <div ref={wrapRef} className="flex justify-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        className="group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-surface-1 shadow-soft"
          style={{ opacity: reduce ? 1 : fillOpacity }}
        />
        {pillPath ? (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-visible text-border-strong"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            fill="none"
          >
            <motion.path
              d={pillPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{ pathLength: reduce ? 1 : borderDraw }}
            />
          </svg>
        ) : null}
        <motion.span
          className="relative z-10 inline-flex items-center gap-2 text-fg-muted transition-colors duration-300 group-hover:text-fg"
          style={reduce ? undefined : { opacity: labelOpacity }}
        >
          View more work
          <span
            aria-hidden
            className="text-accent transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </motion.span>
      </button>
    </div>
  );
}

function ProjectCardContent({ p }: { p: Project }) {
  return (
    <>
      <div className="max-w-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
            {p.role}
          </span>
          <span
            className="h-1 w-1 rounded-full bg-border-strong"
            aria-hidden
          />
          <span className="text-xs text-fg-subtle">Featured</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-medium tracking-tight text-fg md:text-3xl">
          {p.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
          {p.summary}
        </p>
        <p className="mt-4 text-sm font-medium text-fg">{p.outcome}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t}>
              <span
                className="glass-pill inline-flex rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-muted"
              >
                {t}
              </span>
            </li>
          ))}
        </ul>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-accent transition-colors duration-300 group-hover:text-fg">
          View project
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </>
  );
}

function ProjectHeroImage({
  project,
  className = "",
  aspectRatio = "16 / 10",
  fill = false,
}: {
  project: Project;
  className?: string;
  aspectRatio?: string;
  fill?: boolean;
}) {
  return (
    <ProjectImageFrame
      src={project.heroImage.src}
      alt=""
      primaryColor={project.primaryColor}
      aspectRatio={aspectRatio}
      fill={fill}
      className={`shrink-0 ${className}`}
      padded
    />
  );
}

function isPortfolioPath(pathname: string) {
  return pathname.replace(/\/+$/, "") === "/portfolio";
}

export function ProjectsSection() {
  const reduce = useReducedMotion();
  const lenisRef = useLenisRef();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  /** True when *we* pushed the history entry, so closing can step back instead of stranding history. */
  const didPushProjectRef = useRef(false);
  const didPushPortfolioRef = useRef(false);

  // Source of truth = the URL. Restores on browser Back/Forward immediately;
  // first-load deep links wait so the site can paint, then navigate with motion.
  useEffect(() => {
    const applyFromUrl = () => {
      const url = new URL(window.location.href);
      const slug = url.searchParams.get("work");
      const match = slug
        ? (portfolioProjects.find((p) => p.slug === slug) ?? null)
        : null;
      const portfolio = isPortfolioPath(url.pathname);

      if (!match) didPushProjectRef.current = false;
      if (!portfolio && !match) didPushPortfolioRef.current = false;

      setSelectedProject(match);
      if (portfolio) {
        setPortfolioOpen(true);
      } else if (!match) {
        setPortfolioOpen(false);
      }
    };

    window.addEventListener("popstate", applyFromUrl);

    const url = new URL(window.location.href);
    const slug = url.searchParams.get("work");
    const match = slug
      ? (portfolioProjects.find((p) => p.slug === slug) ?? null)
      : null;
    const portfolio = isPortfolioPath(url.pathname);

    if (!portfolio && !match) {
      return () => window.removeEventListener("popstate", applyFromUrl);
    }

    let cancelled = false;
    setSuppressPathSync(true);

    const run = async () => {
      await wait(deepLinkIntroDelay(Boolean(reduce)));
      if (cancelled) return;

      const projectsEl = document.getElementById("projects");
      const scrollDuration = reduce ? 0 : 1.2;
      if (projectsEl) {
        const lenis = lenisRef.current;
        if (lenis) lenis.scrollTo(projectsEl, { offset: -76, duration: scrollDuration });
        else {
          projectsEl.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start",
          });
        }
        await wait(scrollDuration * 1000 + 100);
      }
      if (cancelled) return;

      if (portfolio) setPortfolioOpen(true);
      if (match) setSelectedProject(match);
      setSuppressPathSync(false);
    };

    void run();
    return () => {
      cancelled = true;
      setSuppressPathSync(false);
      window.removeEventListener("popstate", applyFromUrl);
    };
  }, [lenisRef, reduce]);

  const openPortfolio = useCallback(() => {
    if (portfolioOpen && !selectedProject) return;
    trackEvent("portfolio_open");
    const url = new URL(window.location.href);
    url.pathname = "/portfolio";
    url.searchParams.delete("work");
    window.history.pushState({ portfolio: true }, "", url);
    didPushPortfolioRef.current = true;
    setPortfolioOpen(true);
  }, [portfolioOpen, selectedProject]);

  const closePortfolio = useCallback(() => {
    if (selectedProject) return;
    if (didPushPortfolioRef.current) {
      didPushPortfolioRef.current = false;
      window.history.back();
    } else {
      const url = new URL(window.location.href);
      url.pathname = "/projects";
      url.searchParams.delete("work");
      window.history.replaceState(null, "", url);
      setPortfolioOpen(false);
    }
  }, [selectedProject]);

  const openProject = useCallback((project: Project) => {
    trackEvent("project_detail_open", {
      project_slug: project.slug,
      project_name: project.name,
    });
    const url = new URL(window.location.href);
    url.pathname = "/projects";
    url.searchParams.set("work", project.slug);
    window.history.pushState({ work: project.slug }, "", url);
    didPushProjectRef.current = true;
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => {
    if (didPushProjectRef.current) {
      // We added the history entry → go back so Back-button behaviour stays intuitive.
      // If opened from /portfolio, this restores the portfolio pane.
      didPushProjectRef.current = false;
      window.history.back();
    } else {
      // Opened via deep link (no prior entry) → drop back to section or portfolio.
      const url = new URL(window.location.href);
      if (portfolioOpen || didPushPortfolioRef.current) {
        url.pathname = "/portfolio";
        url.searchParams.delete("work");
        window.history.replaceState({ portfolio: true }, "", url);
        setSelectedProject(null);
      } else {
        url.pathname = "/";
        url.searchParams.delete("work");
        window.history.replaceState(null, "", url);
        setSelectedProject(null);
      }
    }
  }, [portfolioOpen]);

  return (
    <SectionShell
      id="projects"
      className="py-20 md:py-24"
      ariaLabel="Selected work"
    >
      <Container>
        <SectionHeader
          eyebrow="Featured work"
          title="Selected work, built for real outcomes"
          description="A curated set of projects across mobile, web and backend. Highlighting product thinking, technical range and hands-on execution"
        />
        <motion.div
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-8%" }}
          className="grid gap-5 lg:grid-cols-12 lg:gap-6"
        >
          {projects.map((p, i) => {
            const isCompact = i === 4 || i === 5;
            const span = isCompact ? "lg:col-span-6" : "lg:col-span-12";

            return (
              <motion.article
                key={p.slug}
                variants={reduce ? undefined : { hidden: {}, show: {} }}
                className={`relative ${span}`}
              >
                <TiltCard className="h-full">
                  <button
                    type="button"
                    onClick={() => openProject(p)}
                    className={`group glass-card block h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-border-strong text-left shadow-soft ${GLASS_CARD_HOVER}`}
                    aria-label={`View details for ${p.name}`}
                  >
                    <motion.div
                      className={
                        isCompact
                          ? "relative z-[1] flex h-full min-h-0 flex-col"
                          : "relative z-[1] grid h-full min-h-0 md:grid-cols-[minmax(0,1fr)_minmax(280px,42%)]"
                      }
                      variants={
                        reduce
                          ? undefined
                          : {
                              hidden: { opacity: 0, y: 22 },
                              show: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                  duration: 0.55,
                                  ease: easing,
                                  delay: i * 0.08,
                                },
                              },
                            }
                      }
                    >
                      {isCompact ? (
                        <>
                          <ProjectHeroImage
                            project={p}
                            className="w-full border-b border-border"
                          />
                          <div className="flex min-h-0 flex-1 flex-col gap-6 p-7 md:p-8">
                            <ProjectCardContent p={p} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="order-2 p-7 md:order-1 md:p-8">
                            <ProjectCardContent p={p} />
                          </div>
                          <ProjectHeroImage
                            project={p}
                            fill
                            className="order-1 min-h-[220px] w-full border-b border-border md:order-2 md:min-h-[280px] md:border-b-0 md:border-l"
                          />
                        </>
                      )}
                    </motion.div>
                  </button>
                </TiltCard>
              </motion.article>
            );
          })}
        </motion.div>

        <div className="mt-10 flex justify-center md:mt-12">
          <ViewMoreWorkCta onClick={openPortfolio} />
        </div>
      </Container>

      <PortfolioPanel
        open={portfolioOpen}
        onClose={closePortfolio}
        onSelectProject={openProject}
        retainScrollLock={Boolean(selectedProject)}
      />
      <ProjectDetailModal
        project={selectedProject}
        onClose={closeProject}
        leaveScrollLocked={portfolioOpen}
      />
    </SectionShell>
  );
}
