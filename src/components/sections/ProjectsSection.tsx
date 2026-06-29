import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "../../data/site";
import { trackEvent } from "../../lib/analytics";
import { GLASS_CARD_HOVER } from "../../lib/interactive";
import { easing, staggerContainer } from "../../lib/motion";
import { Container } from "../ui/Container";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { ProjectImageFrame } from "../ui/ProjectImageFrame";
import { TiltCard } from "../ui/TiltCard";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionShell } from "./SectionShell";

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

export function ProjectsSection() {
  const reduce = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  /** True when *we* pushed the ?project= entry, so closing can step back instead of stranding history. */
  const didPushRef = useRef(false);

  // Source of truth = the URL. Restores on deep-link/refresh and on browser Back/Forward.
  useEffect(() => {
    const applyFromUrl = () => {
      const slug = new URLSearchParams(window.location.search).get("work");
      const match = slug
        ? (projects.find((p) => p.slug === slug) ?? null)
        : null;
      if (!match) didPushRef.current = false;
      setSelectedProject(match);
    };
    applyFromUrl();
    window.addEventListener("popstate", applyFromUrl);
    return () => window.removeEventListener("popstate", applyFromUrl);
  }, []);

  const openProject = useCallback((project: Project) => {
    trackEvent("project_detail_open", {
      project_slug: project.slug,
      project_name: project.name,
    });
    const url = new URL(window.location.href);
    url.pathname = "/projects";
    url.searchParams.set("work", project.slug);
    window.history.pushState({ work: project.slug }, "", url);
    didPushRef.current = true;
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => {
    if (didPushRef.current) {
      // We added the history entry → go back so Back-button behaviour stays intuitive.
      didPushRef.current = false;
      window.history.back();
    } else {
      // Opened via deep link (no prior entry) → drop back to the root in place.
      const url = new URL(window.location.href);
      url.pathname = "/";
      url.searchParams.delete("work");
      window.history.replaceState(null, "", url);
      setSelectedProject(null);
    }
  }, []);

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
      </Container>

      <ProjectDetailModal project={selectedProject} onClose={closeProject} />
    </SectionShell>
  );
}
