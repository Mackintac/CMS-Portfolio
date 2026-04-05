// src/app/(site)/page.tsx
// ─── Home — assembles all sections in order ───────────────────────────────────

import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      {/* 1 — Full-viewport 3D hero */}
      <HeroSection />

      {/* 2 — Who I am + timeline */}
      <AboutSection />

      {/* 3 — Skills constellation */}
      <SkillsSection />

      {/* 4 — Project showcase cards */}
      <ProjectsSection />

      {/* 5 — Live GitHub stats */}
      <StatsSection />

      {/* 6 — Contact + resume */}
      <ContactSection />
    </>
  );
}
