import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import { LenisProvider } from "./context/LenisProvider";
import { CustomCursor } from "./components/layout/CustomCursor";
import { initAnalytics, trackPageView, trackSectionView } from "./lib/analytics";

const SceneBackground = lazy(() =>
  import("./components/layout/SceneBackground").then((m) => ({
    default: m.SceneBackground,
  })),
);
import { ScrollGitTree } from "./components/layout/ScrollGitTree";
import { BackToTop } from "./components/layout/BackToTop";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { HeroSection } from "./components/sections/HeroSection";
import { ImpactSection } from "./components/sections/ImpactSection";
import { HeroSectionDivider } from "./components/sections/HeroSectionDivider";
import { SectionDivider } from "./components/sections/SectionDivider";
import { AboutSection } from "./components/sections/AboutSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { FreelanceSection } from "./components/sections/FreelanceSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { ContactSection } from "./components/sections/ContactSection";

export default function App() {
  useEffect(() => {
    void initAnalytics().then(() => {
      trackPageView(`${window.location.pathname}${window.location.search}`);
    });
  }, []);

  useEffect(() => {
    const seen = new Set<string>();
    const nodes = document.querySelectorAll<HTMLElement>("[data-analytics-section]");
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const sectionId = entry.target.getAttribute("data-analytics-section");
          if (!sectionId || seen.has(sectionId)) continue;
          seen.add(sectionId);
          trackSectionView(sectionId);
        }
      },
      { threshold: 0.45, rootMargin: "-10% 0px -20% 0px" },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider>
      <LenisProvider>
        <Suspense fallback={null}>
          <SceneBackground />
        </Suspense>
        <CustomCursor />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <BackToTop />
        <main id="main" className="relative z-10">
          <HeroSection />
          <div id="graph-scope" className="relative">
            <div
              className="post-hero-scrim-bridge pointer-events-none absolute inset-x-0 top-0 z-[1]"
              aria-hidden
            />
            <ScrollGitTree />
            <div className="relative z-10 min-w-0 lg:pl-[var(--graph-rail-width)]">
              <HeroSectionDivider />
              <ImpactSection />
              <SectionDivider />
              <AboutSection />
              <SectionDivider />
              <ProjectsSection />
              <SectionDivider />
              <ExperienceSection />
              <SectionDivider />
              <SkillsSection />
              <SectionDivider />
              <FreelanceSection />
              <SectionDivider />
              <TestimonialsSection />
              <SectionDivider />
              <ContactSection />
            </div>
          </div>
        </main>
        <SiteFooter />
      </LenisProvider>
    </ThemeProvider>
  );
}
