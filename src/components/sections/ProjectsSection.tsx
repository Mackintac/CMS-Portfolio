"use client";
// src/components/sections/ProjectsSection.tsx
// ─── Projects — featured wide cards + standard grid ───────────────────────────

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

import {
  useReveal,
  fadeUp,
  staggerContainer,
  staggerItem,
} from "@/hooks/useReveal";
import { projects } from "@/lib/projects";
import type { Project } from "@/types";

// ─── Sorted data ─────────────────────────────────────────────────────────────
const sorted = [...projects].sort((a, b) => a.order - b.order);
const featured = sorted.filter((p) => p.featured);
const rest = sorted.filter((p) => !p.featured);

// ─── Cover image area ─────────────────────────────────────────────────────────

interface CoverProps {
  src: string;
  alt: string;
  /** Extra classes applied to the outer container */
  className?: string;
}

function ProjectCover({ src, alt, className = "" }: CoverProps) {
  const hasSrc = src.trim() !== "";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {hasSrc ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      ) : (
        /* Gradient placeholder when no screenshot exists yet */
        <div
          className="h-full w-full"
          style={{
            background: `linear-gradient(135deg, hsl(var(--glow-1) / 0.35), hsl(var(--glow-2) / 0.25), hsl(var(--glow-3) / 0.2))`,
          }}
        />
      )}
    </div>
  );
}

// ─── Tech chip ───────────────────────────────────────────────────────────────

function TechChip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
      {label}
    </span>
  );
}

// ─── Links row ───────────────────────────────────────────────────────────────

interface LinksRowProps {
  project: Project;
}

function LinksRow({ project }: LinksRowProps) {
  const { url, repo, hasCaseStudy, slug } = project;

  if (!url && !repo && !hasCaseStudy) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-4">
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          <ExternalLink size={14} />
          Live
        </a>
      )}
      {repo && (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          <Github size={14} />
          Code
        </a>
      )}
      {hasCaseStudy && (
        <Link
          href={`/projects/${slug}`}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          Case Study
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

// ─── Featured card (full-width, image-left layout on md+) ────────────────────

function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={staggerItem}
      className="glass rounded-xl border border-border transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 overflow-hidden"
    >
      <div className="md:grid md:grid-cols-5">
        {/* Cover — 3 cols */}
        <ProjectCover
          src={project.cover}
          alt={project.title}
          className="h-56 md:col-span-3 md:h-full min-h-[220px]"
        />

        {/* Content — 2 cols */}
        <div className="flex flex-col justify-center gap-3 p-6 md:col-span-2">
          <h3 className="font-display text-xl font-bold leading-snug">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground">{project.tagline}</p>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <TechChip key={t} label={t} />
            ))}
          </div>

          <LinksRow project={project} />
        </div>
      </div>
    </motion.article>
  );
}

// ─── Standard card (1/3 width on lg, 1/2 on md) ──────────────────────────────

function StandardCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={staggerItem}
      className="glass rounded-xl border border-border transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 overflow-hidden flex flex-col"
    >
      {/* Cover image */}
      <ProjectCover
        src={project.cover}
        alt={project.title}
        className="h-44 w-full"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground">{project.tagline}</p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <TechChip key={t} label={t} />
          ))}
        </div>

        {/* Push links to bottom */}
        <div className="mt-auto">
          <LinksRow project={project} />
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const headingReveal = useReveal({ threshold: 0.15 });
  const featuredReveal = useReveal({ threshold: 0.1 });
  const restReveal = useReveal({ threshold: 0.1 });

  return (
    <section id="projects" className="section-wrapper">

      {/* ── Section heading ── */}
      <motion.div
        ref={headingReveal.ref}
        initial="hidden"
        animate={headingReveal.controls}
        variants={staggerContainer}
        className="mb-12"
      >
        <motion.p variants={fadeUp} className="eyebrow mb-4">
          Work
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl font-bold tracking-tight md:text-5xl"
        >
          Things I&apos;ve Built.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl text-muted-foreground"
        >
          A mix of production apps, experiments, and this site itself.
        </motion.p>
      </motion.div>

      {/* ── Featured row ── */}
      {featured.length > 0 && (
        <motion.div
          ref={featuredReveal.ref}
          initial="hidden"
          animate={featuredReveal.controls}
          variants={staggerContainer}
          className="mb-10 flex flex-col gap-6"
        >
          {featured.map((project) => (
            <FeaturedCard key={project.slug} project={project} />
          ))}
        </motion.div>
      )}

      {/* ── Standard grid ── */}
      {rest.length > 0 && (
        <motion.div
          ref={restReveal.ref}
          initial="hidden"
          animate={restReveal.controls}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {rest.map((project) => (
            <StandardCard key={project.slug} project={project} />
          ))}
        </motion.div>
      )}

    </section>
  );
}
