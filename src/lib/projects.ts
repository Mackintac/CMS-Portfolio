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
    repo: "https://github.com/Mackintac/job-tracker",
    tech: ["Next.js", "Clerk", "Prisma", "PostgreSQL", "Tailwind", "shadcn/ui"],
    featured: false,
    hidden: true,
    order: 1,
    hasCaseStudy: false,
  },
  {
    slug: "ai-api-tester",
    title: "AI-Powered Visual API Tester",
    tagline: "Postman-like API client with an AI co-pilot.",
    description:
      "A React + Vite tool for visually composing and testing API requests. " +
      "Integrated Claude to explain responses, suggest fixes, and auto-generate test cases.",
    cover: "/images/projects/ai-api-tester.png",
    repo: "https://github.com/Mackintac/ai-api-tester",
    tech: ["React", "TypeScript", "Vite", "Monaco Editor", "Anthropic API", "Zustand"],
    featured: false,
    hidden: true,
    order: 2,
    hasCaseStudy: false,
  },
  {
    slug: "barrie-slippi-leaderboard",
    title: "Barrie Slippi Leaderboard",
    tagline: "Regional ranked leaderboard for the Barrie Melee community.",
    description:
      "A live leaderboard for Barrie, Ontario's Super Smash Bros. Melee scene. " +
      "A cron job pulls player connect codes from a Google Sheet, fetches stats from the Slippi API, " +
      "and writes results to JSON. The React frontend displays live regional rankings.",
    cover: "/images/projects/barrie-slippi.png",
    url: "https://mackintac.github.io/BarrieSlippiLeaderboard/#/",
    repo: "https://github.com/Mackintac/BarrieSlippiLeaderboard",
    tech: ["React", "TypeScript", "Tailwind CSS", "Webpack", "Google Sheets API", "GitHub Pages"],
    featured: true,
    order: 2,
    hasCaseStudy: false,
  },
  {
    slug: "dice-duel",
    title: "Dice Roll Duel",
    tagline: "Real-time 1v1 ranked dice game with matchmaking and ELO.",
    description:
      "Two players queue up, get paired live, and battle in a best-of-3 match. " +
      "Features real-time matchmaking via Socket.io, an ELO ranking system, " +
      "leaderboards, player profiles, and auth via Google OAuth and email/password.",
    cover: "/images/projects/dice-duel.png",
    url: "https://dicerollduel.com",
    repo: "https://github.com/Mackintac/Dice-Roll-Duel-v2",
    tech: ["Next.js", "TypeScript", "Socket.io", "PostgreSQL", "Prisma", "NextAuth", "Tailwind CSS", "Docker"],
    featured: true,
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

export const visibleProjects = projects
  .filter((p) => !p.hidden)
  .sort((a, b) => a.order - b.order);

export const featuredProjects = visibleProjects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
