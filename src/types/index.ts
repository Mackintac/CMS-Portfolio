// src/types/index.ts
// ─── Shared types across the portfolio ────────────────────────────────────────

// ─── Projects ────────────────────────────────────────────────────────────────
export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /** Hero image / screenshot shown on the card */
  cover: string;
  /** Live demo URL */
  url?: string;
  /** GitHub repo URL */
  repo?: string;
  /** Tech badge labels */
  tech: string[];
  /** Featured projects appear first and get a larger card */
  featured: boolean;
  /** Used for sorting */
  order: number;
  /** MDX case study exists */
  hasCaseStudy: boolean;
  /** Hide from the projects section (e.g. work in progress) */
  hidden?: boolean;
}

// ─── Blog ────────────────────────────────────────────────────────────────────
export interface Post {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  draft?: boolean;
}

// ─── Skills ──────────────────────────────────────────────────────────────────
export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "ai"
  | "tooling";

export interface Skill {
  name: string;
  category: SkillCategory;
  /** 1–5 proficiency used to scale the constellation node */
  level: number;
  icon?: string;
}

// ─── GitHub Stats ────────────────────────────────────────────────────────────
export interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  totalCommitsThisYear: number;
  topLanguages: Array<{ name: string; percentage: number; color: string }>;
}

// ─── Contact Form ────────────────────────────────────────────────────────────
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

// ─── CLI Commands ─────────────────────────────────────────────────────────────
export interface CLICommand {
  name: string;
  description: string;
  handler: (args: string[]) => string | string[];
}
