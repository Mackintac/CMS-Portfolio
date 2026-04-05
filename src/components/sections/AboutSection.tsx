"use client";
// src/components/sections/AboutSection.tsx
// ─── About — bio + timeline + tech orbit animation ────────────────────────────

import Image from "next/image";
import { motion } from "framer-motion";
import { useReveal, fadeUp, staggerContainer, staggerItem } from "@/hooks/useReveal";
import { skillCategories } from "@/lib/skills";

// ─── Timeline data ────────────────────────────────────────────────────────────
const timeline = [
  {
    date: "2019",
    title: "Georgian College",
    subtitle: "Computer Programming — and picked up StarCraft 2 competitively",
  },
  {
    date: "2022–2024",
    title: "Freedom Softworks",
    subtitle: "Full-Stack Developer · Apr 2022 – Jul 2024",
  },
  {
    date: "Apr 2022",
    title: "Retired from Pro SC2",
    subtitle: "4 years competing as Mackintac (Zerg)",
  },
  {
    date: "Sept 2024",
    title: "Back to Georgian College",
    subtitle: "Returned to complete my diploma",
  },
  {
    date: "Dec 2025",
    title: "Graduated",
    subtitle: "Computer Programming Diploma",
  },
  {
    date: "2026",
    title: "Open to Opportunities",
    subtitle: "Building. Improving. Ready.",
  },
] as const;

// ─── Orbit rings ──────────────────────────────────────────────────────────────
type OrbitSkill = {
  name: string;
  category: keyof typeof skillCategories;
};

const orbitRings: {
  radius: number;
  duration: number;
  skills: OrbitSkill[];
}[] = [
  {
    radius: 80,
    duration: 20,
    skills: [
      { name: "React",      category: "frontend" },
      { name: "TypeScript", category: "frontend" },
    ],
  },
  {
    radius: 140,
    duration: 30,
    skills: [
      { name: "Next.js",      category: "frontend" },
      { name: "Node.js",      category: "backend" },
      { name: "PostgreSQL",   category: "database" },
      { name: "Tailwind CSS", category: "frontend" },
    ],
  },
  {
    radius: 200,
    duration: 45,
    skills: [
      { name: "Prisma",    category: "backend" },
      { name: "Git",       category: "tooling" },
      { name: "Vercel",    category: "devops" },
      { name: "Docker",    category: "devops" },
      { name: "REST APIs", category: "backend" },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimelineDot() {
  return (
    <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" />
  );
}

interface TimelineEntryProps {
  date: string;
  title: string;
  subtitle?: string;
}

function TimelineEntry({ date, title, subtitle }: TimelineEntryProps) {
  return (
    <motion.li variants={staggerItem} className="relative pl-6">
      <TimelineDot />
      <span className="block font-mono text-xs text-muted-foreground">{date}</span>
      <span className="block font-semibold text-foreground leading-snug">{title}</span>
      {subtitle && (
        <span className="block text-sm text-muted-foreground mt-0.5">{subtitle}</span>
      )}
    </motion.li>
  );
}

interface OrbitBadgeProps {
  name: string;
  category: keyof typeof skillCategories;
  angleDeg: number;
  radius: number;
  ringDuration: number;
}

function OrbitBadge({ name, category, angleDeg, radius, ringDuration }: OrbitBadgeProps) {
  const color = skillCategories[category].color;

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `rotate(${angleDeg}deg) translateX(${radius}px) rotate(-${angleDeg}deg)`,
        transformOrigin: "0 0",
      }}
    >
      {/* Counter-rotate so the badge stays upright as the ring spins */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: ringDuration, repeat: Infinity, ease: "linear" }}
        className="flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Coloured dot standing in for an icon */}
        <span
          className="h-4 w-4 rounded-full shadow-md"
          style={{ backgroundColor: color }}
        />
        {/* Pill label */}
        <span
          className="rounded-full border px-1.5 py-0.5 font-mono text-[9px] leading-none whitespace-nowrap"
          style={{ borderColor: color, color }}
        >
          {name}
        </span>
      </motion.div>
    </div>
  );
}

interface OrbitRingProps {
  radius: number;
  duration: number;
  skills: OrbitSkill[];
}

function OrbitRing({ radius, duration, skills }: OrbitRingProps) {
  const angleStep = 360 / skills.length;

  return (
    <>
      {/* Visible ring track */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full border border-border/30"
        style={{
          width: radius * 2,
          height: radius * 2,
          marginLeft: -radius,
          marginTop: -radius,
        }}
      />

      {/* Rotating group — contains all badges for this ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-0 w-0"
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {skills.map((skill, i) => (
          <OrbitBadge
            key={skill.name}
            name={skill.name}
            category={skill.category}
            angleDeg={angleStep * i}
            radius={radius}
            ringDuration={duration}
          />
        ))}
      </motion.div>
    </>
  );
}

function TechOrbit() {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 480, width: 480, maxWidth: "100%" }}>
      {/* Ring tracks + orbiting badges */}
      {orbitRings.map((ring) => (
        <OrbitRing
          key={ring.radius}
          radius={ring.radius}
          duration={ring.duration}
          skills={ring.skills}
        />
      ))}

      {/* Centre avatar */}
      <div className="relative z-10 rounded-full p-1 ring-4 ring-violet-500/40 shadow-[0_0_32px_8px_rgba(124,58,237,0.25)]">
        <div className="overflow-hidden rounded-full">
          <Image
            src="/avatar.jpg"
            alt="Mack"
            width={96}
            height={96}
            className="rounded-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AboutSection() {
  const leftReveal  = useReveal({ threshold: 0.15 });
  const rightReveal = useReveal({ threshold: 0.1 });

  return (
    <section id="about" className="section-wrapper">
      <div className="mx-auto grid max-w-content gap-16 lg:grid-cols-2 lg:gap-24 items-start">

        {/* ── Left column: bio + timeline ── */}
        <motion.div
          ref={leftReveal.ref}
          initial="hidden"
          animate={leftReveal.controls}
          variants={staggerContainer}
        >
          {/* Eyebrow */}
          <motion.p variants={fadeUp} className="eyebrow mb-4">
            About Me
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl font-bold tracking-tight md:text-5xl"
          >
            Developer by trade.{" "}
            <span className="gradient-text">Competitor by nature.</span>
          </motion.h2>

          {/* Bio paragraphs */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-muted-foreground leading-relaxed"
          >
            I&apos;m Mack — a full-stack software developer with a background you probably
            won&apos;t find on most resumes. Before writing production code I spent years as
            a professional StarCraft 2 player and streamer, competing as Zerg under the
            name Mackintac. The same obsession that drove thousands of hours of in-game
            optimization now drives how I build software. I don&apos;t stop until it&apos;s right.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-muted-foreground leading-relaxed"
          >
            I&apos;m addicted to improvement. Whether it&apos;s shaving milliseconds off a render,
            refining a component API, or levelling up a new skill — I bring the same
            competitive intensity to my work that I brought to the game.
          </motion.p>

          {/* Timeline */}
          <motion.ul
            variants={staggerContainer}
            className="mt-10 space-y-6 border-l border-border pl-0.5"
          >
            {timeline.map((entry) => (
              <TimelineEntry
                key={entry.title + entry.date}
                date={entry.date}
                title={entry.title}
                subtitle={entry.subtitle}
              />
            ))}
          </motion.ul>
        </motion.div>

        {/* ── Right column: tech orbit ── */}
        <motion.div
          ref={rightReveal.ref}
          initial="hidden"
          animate={rightReveal.controls}
          variants={fadeUp}
          className="flex items-center justify-center"
        >
          <TechOrbit />
        </motion.div>

      </div>
    </section>
  );
}
