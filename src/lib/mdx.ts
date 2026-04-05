// src/lib/mdx.ts
// ─── MDX content layer — replaces Contentlayer ────────────────────────────────
// Uses gray-matter for frontmatter + next-mdx-remote for rendering.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CaseStudyFrontmatter {
  title: string;
  tagline: string;
  publishedAt: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  cover?: string;
}

export interface PostFrontmatter {
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  draft?: boolean;
}

export interface MDXDoc<T> {
  slug: string;
  frontmatter: T;
  content: string;       // raw MDX string — pass to MDXRemote
  readingTime: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getSlugs(subdir: string): string[] {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

function readDoc<T>(subdir: string, slug: string): MDXDoc<T> {
  const filePath = path.join(CONTENT_DIR, subdir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    frontmatter: data as T,
    content,
    readingTime: readingTime(content).text,
  };
}

// ─── Case Studies ─────────────────────────────────────────────────────────────
export function getAllCaseStudies(): MDXDoc<CaseStudyFrontmatter>[] {
  return getSlugs("projects")
    .map((slug) => readDoc<CaseStudyFrontmatter>("projects", slug))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );
}

export function getCaseStudy(slug: string): MDXDoc<CaseStudyFrontmatter> | null {
  try {
    return readDoc<CaseStudyFrontmatter>("projects", slug);
  } catch {
    return null;
  }
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export function getAllPosts(): MDXDoc<PostFrontmatter>[] {
  return getSlugs("blog")
    .map((slug) => readDoc<PostFrontmatter>("blog", slug))
    .filter((p) => process.env.NODE_ENV === "development" || !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );
}

export function getPost(slug: string): MDXDoc<PostFrontmatter> | null {
  try {
    return readDoc<PostFrontmatter>("blog", slug);
  } catch {
    return null;
  }
}
