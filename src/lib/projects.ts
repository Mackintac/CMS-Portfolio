// src/lib/projects.ts
// ─── Static project data — edit this to update your portfolio ─────────────────

import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "job-tracker",
    title: "Job Application Tracker",
    tagline: "Full-stack app to manage your entire job hunt.",
    description:
      "A Kanban-style job application tracker with authentication, a PostgreSQL database, " +
      "and real-time status updates. Built to solve my own problem during the job search.",
    cover: "/images/projects/job-tracker.png",
    url: "https://job-tracker.vercel.app",
    repo: "https://github.com/Mackintac/job-tracker",
    tech: ["Next.js", "Clerk", "Prisma", "PostgreSQL", "Tailwind", "shadcn/ui"],
    featured: true,
    order: 1,
    hasCaseStudy: true,
  },
  {
    slug: "ai-api-tester",
    title: "AI-Powered Visual API Tester",
    tagline: "Postman-like API client with an AI co-pilot.",
    description:
      "A React + Vite tool for visually composing and testing API requests. " +
      "Integrated Claude to explain responses, suggest fixes, and auto-generate test cases.",
    cover: "/images/projects/ai-api-tester.png",
    url: "https://ai-api-tester.vercel.app",
    repo: "https://github.com/Mackintac/ai-api-tester",
    tech: ["React", "TypeScript", "Vite", "Monaco Editor", "Anthropic API", "Zustand"],
    featured: true,
    order: 2,
    hasCaseStudy: true,
  },
  {
    slug: "dice-duel",
    title: "Dice Roll Duel",
    tagline: "Real-time multiplayer dice game.",
    description:
      "A fast-paced browser game where players roll dice in real time. " +
      "Focused on snappy interactions and delightful animations.",
    cover: "/images/projects/dice-duel.png",
    url: "https://dice-duel.vercel.app",
    repo: "https://github.com/Mackintac/dice-duel",
    tech: ["React", "TypeScript", "Framer Motion"],
    featured: false,
    order: 3,
    hasCaseStudy: false,
  },
  {
    slug: "portfolio",
    title: "This Portfolio",
    tagline: "The site you're looking at right now.",
    description:
      "Built to be a project in its own right — 3D hero with React Three Fiber, " +
      "CLI easter egg, MDX case studies, and GSAP scroll animations.",
    cover: "/images/projects/portfolio.png",
    repo: "https://github.com/Mackintac/portfolio",
    tech: ["Next.js", "TypeScript", "R3F", "GSAP", "Framer Motion", "Contentlayer"],
    featured: false,
    order: 4,
    hasCaseStudy: true,
  },
];

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
