import { ThemeProvider } from "./context/ThemeProvider";
import { LenisProvider } from "./context/LenisProvider";
import { ScrollProgress } from "./components/layout/ScrollProgress";
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
  return (
    <ThemeProvider>
      <LenisProvider>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ScrollProgress />
        <SiteHeader />
        <main id="main">
          <HeroSection />
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
        </main>
        <SiteFooter />
      </LenisProvider>
    </ThemeProvider>
  );
}
