"use client";
// src/components/sections/StatsSection.tsx
// ─── GitHub Activity — stat cards + language breakdown bar ────────────────────

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { GitFork, Star, Users, Code2 } from "lucide-react";
import { useReveal, fadeUp, staggerContainer, staggerItem } from "@/hooks/useReveal";
import type { GitHubStats } from "@/types";

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200, active = false): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || target === 0) {
      setCount(target);
      return;
    }

    // Reset on each activation
    setCount(0);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [active, target, duration]);

  return count;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  isString?: boolean;
  active: boolean;
}

function StatCard({ icon, value, label, isString = false, active }: StatCardProps) {
  const numericTarget = isString ? 0 : (value as number);
  const counted = useCountUp(numericTarget, 1200, active);

  return (
    <motion.div
      variants={staggerItem}
      className="glass rounded-xl border border-border p-6 flex flex-col items-center gap-3 text-center"
    >
      <span className="text-accent">{icon}</span>
      <span className="font-display text-4xl font-bold tracking-tight text-foreground">
        {isString ? value : counted}
      </span>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </motion.div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="glass rounded-xl border border-border p-6 flex flex-col items-center gap-3">
      <div className="h-5 w-5 animate-pulse rounded bg-muted" />
      <div className="h-10 w-20 animate-pulse rounded bg-muted" />
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
    </div>
  );
}

// ─── Language bar ─────────────────────────────────────────────────────────────

interface LanguageBarProps {
  languages: GitHubStats["topLanguages"];
}

function LanguageBar({ languages }: LanguageBarProps) {
  return (
    <div>
      {/* Stacked bar */}
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-border">
        {languages.map((lang) => (
          <div
            key={lang.name}
            title={`${lang.name}: ${lang.percentage}%`}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }}
            className="transition-all duration-700 ease-out"
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-sm text-foreground font-medium">{lang.name}</span>
            <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function StatsSection() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const headingReveal = useReveal({ threshold: 0.15 });
  const cardsReveal = useReveal({ threshold: 0.1, delay: 100 });
  const barReveal = useReveal({ threshold: 0.1, delay: 300 });

  useEffect(() => {
    fetch("/api/github")
      .then((res) => {
        if (!res.ok) throw new Error("Non-OK response");
        return res.json() as Promise<GitHubStats>;
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const topLanguageName = stats?.topLanguages[0]?.name ?? "—";

  return (
    <section id="stats" className="section-wrapper">
      <div className="mx-auto max-w-content">

        {/* ── Heading block ── */}
        <motion.div
          ref={headingReveal.ref}
          initial="hidden"
          animate={headingReveal.controls}
          variants={staggerContainer}
          className="mb-12 text-center"
        >
          <motion.p variants={fadeUp} className="eyebrow mb-4">
            By the numbers
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl font-bold tracking-tight md:text-5xl"
          >
            GitHub Activity<span className="gradient-text">.</span>
          </motion.h2>
        </motion.div>

        {/* ── Error state ── */}
        {error && (
          <p className="text-center text-sm text-muted-foreground">
            Could not load GitHub stats.
          </p>
        )}

        {/* ── Stat cards ── */}
        {!error && (
          <>
            <motion.div
              ref={cardsReveal.ref}
              initial="hidden"
              animate={cardsReveal.controls}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  <StatCard
                    icon={<GitFork size={20} />}
                    value={stats?.publicRepos ?? 0}
                    label="Public Repos"
                    active={cardsReveal.inView}
                  />
                  <StatCard
                    icon={<Star size={20} />}
                    value={stats?.totalStars ?? 0}
                    label="Total Stars"
                    active={cardsReveal.inView}
                  />
                  <StatCard
                    icon={<Users size={20} />}
                    value={stats?.followers ?? 0}
                    label="Followers"
                    active={cardsReveal.inView}
                  />
                  <StatCard
                    icon={<Code2 size={20} />}
                    value={topLanguageName}
                    label="Top Language"
                    isString
                    active={cardsReveal.inView}
                  />
                </>
              )}
            </motion.div>

            {/* ── Language breakdown bar ── */}
            {!loading && stats && stats.topLanguages.length > 0 && (
              <motion.div
                ref={barReveal.ref}
                initial="hidden"
                animate={barReveal.controls}
                variants={fadeUp}
                className="mt-10 glass rounded-xl border border-border p-6"
              >
                <p className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Language Breakdown
                </p>
                <LanguageBar languages={stats.topLanguages} />
              </motion.div>
            )}

            {/* ── Language bar skeleton ── */}
            {loading && (
              <div className="mt-10 glass rounded-xl border border-border p-6 space-y-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                <div className="flex gap-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="h-4 w-20 animate-pulse rounded bg-muted" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
