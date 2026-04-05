// src/app/projects/[slug]/page.tsx

import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { getAllCaseStudies, getCaseStudy } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getAllCaseStudies().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const doc = getCaseStudy(params.slug);
  if (!doc) return {};
  return { title: doc.frontmatter.title, description: doc.frontmatter.tagline };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const doc = getCaseStudy(params.slug);
  if (!doc) notFound();

  const { title, tagline, publishedAt, tech, liveUrl, repoUrl } = doc.frontmatter;

  return (
    <article className="mx-auto max-w-prose px-6 pb-24 pt-32 md:px-0">
      <Link
        href="/#projects"
        className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        All projects
      </Link>

      <header className="mb-12">
        <p className="eyebrow mb-4">Case study</p>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{tagline}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{formatDate(publishedAt)}</span>
          <span>·</span>
          <span>{doc.readingTime}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent">
              <ExternalLink size={14} /> Live demo
            </a>
          )}
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent">
              <Github size={14} /> Source code
            </a>
          )}
        </div>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={doc.content} />
      </div>
    </article>
  );
}
