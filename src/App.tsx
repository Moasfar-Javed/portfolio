import { lazy, Suspense, useRef } from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import { LenisProvider } from "./context/LenisProvider";
import { CustomCursor } from "./components/layout/CustomCursor";

const SceneBackground = lazy(() =>
  import("./components/layout/SceneBackground").then((m) => ({
    default: m.SceneBackground,
  })),
);
import { ScrollGitTree } from "./components/layout/ScrollGitTree";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { HeroSection } from "./components/sections/HeroSection";
import { ImpactSection } from "./components/sections/ImpactSection";
import { SectionDivider } from "./components/sections/SectionDivider";
import { AboutSection } from "./components/sections/AboutSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { FreelanceSection } from "./components/sections/FreelanceSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { ContactSection } from "./components/sections/ContactSection";

export default function App() {
  const graphScopeRef = useRef<HTMLDivElement>(null);

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
        <main id="main" className="relative z-10">
          <HeroSection />
          <div id="graph-scope" ref={graphScopeRef} className="relative">
            <ScrollGitTree scopeRef={graphScopeRef} />
            <div className="relative z-10 min-w-0 lg:pl-[var(--graph-rail-width)]">
              <SectionDivider />
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
