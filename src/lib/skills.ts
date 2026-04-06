// src/lib/skills.ts
// ─── Skills data — drives the constellation visualisation ─────────────────────

import type { Skill } from "@/types";

export const skills: Skill[] = [
  // Frontend
  { name: "React",          category: "frontend",  level: 5 },
  { name: "TypeScript",     category: "frontend",  level: 5 },
  { name: "Next.js",        category: "frontend",  level: 5 },
  { name: "Tailwind CSS",   category: "frontend",  level: 4 },
  { name: "Framer Motion",  category: "frontend",  level: 4 },
  { name: "Three.js / R3F", category: "frontend",  level: 3 },
  { name: "Zustand",        category: "frontend",  level: 4 },

  // Backend
  { name: "Node.js",        category: "backend",   level: 4 },
  { name: "REST APIs",      category: "backend",   level: 5 },
  { name: "Prisma",         category: "backend",   level: 4 },
  { name: "tRPC",           category: "backend",   level: 3 },

  // Database
  { name: "PostgreSQL",     category: "database",  level: 4 },
  { name: "Redis",          category: "database",  level: 3 },

  // DevOps
  { name: "Vercel",         category: "devops",    level: 5 },
  { name: "Docker",         category: "devops",    level: 3 },
  { name: "GitHub Actions", category: "devops",    level: 3 },

  // AI
  { name: "Claude API",     category: "ai",        level: 4 },

  // Tooling
  { name: "Vite",           category: "tooling",   level: 4 },
  { name: "Monaco Editor",  category: "tooling",   level: 3 },
  { name: "Git",            category: "tooling",   level: 5 },
];

export const skillCategories: Record<Skill["category"], { label: string; color: string }> = {
  frontend:  { label: "Frontend",  color: "#7C3AED" },
  backend:   { label: "Backend",   color: "#2563EB" },
  database:  { label: "Database",  color: "#059669" },
  devops:    { label: "DevOps",    color: "#D97706" },
  ai:        { label: "AI / ML",   color: "#EC4899" },
  tooling:   { label: "Tooling",   color: "#64748B" },
};
