"use client";
// src/components/sections/SkillsSection.tsx
// ─── Skills — interactive constellation visualisation ─────────────────────────

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useReveal, fadeUp, staggerContainer, staggerItem } from "@/hooks/useReveal";
import { skills, skillCategories } from "@/lib/skills";
import type { SkillCategory } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const SVG_W = 800;
const SVG_H = 500;
const CX = SVG_W / 2;
const CY = SVG_H / 2;

/** Pixels — edges are drawn between same-category nodes closer than this */
const EDGE_THRESHOLD = 180;

// ─── Deterministic layout ─────────────────────────────────────────────────────

/** Simple seeded pseudo-random (mulberry32) — keeps positions stable on SSR */
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface NodePosition {
  x: number;
  y: number;
  r: number;
  skill: (typeof skills)[number];
}

function buildLayout(): NodePosition[] {
  const categoryKeys = Object.keys(skillCategories) as SkillCategory[];
  // Each category occupies an arc sector. We spread the full 360° across categories
  // with a slight padding so adjacent sectors don't bleed into each other.
  const sectorAngle = (Math.PI * 2) / categoryKeys.length;
  const rng = seededRng(42);

  const positions: NodePosition[] = [];

  categoryKeys.forEach((cat, catIdx) => {
    const catSkills = skills.filter((s) => s.category === cat);
    const sectorStart = catIdx * sectorAngle - Math.PI / 2; // top-of-circle origin

    catSkills.forEach((skill, i) => {
      const count = catSkills.length;
      // Spread nodes evenly inside the sector, with a small rng nudge
      const angleFraction = count === 1 ? 0.5 : i / (count - 1);
      const angle =
        sectorStart +
        sectorAngle * 0.15 +
        angleFraction * sectorAngle * 0.7 +
        (rng() - 0.5) * (sectorAngle * 0.08);

      // Vary radius per node so they don't sit on a single ring
      const baseRadius = 185;
      const radiusVariance = 30;
      const radius = baseRadius + (rng() - 0.5) * radiusVariance;

      // Occasionally pull a node slightly inward or outward for organic feel
      const jitter = (rng() - 0.5) * 18;
      const r = radius + jitter;

      positions.push({
        x: CX + Math.cos(angle) * r,
        y: CY + Math.sin(angle) * r,
        r: nodeRadius(skill.level),
        skill,
      });
    });
  });

  return positions;
}

function nodeRadius(level: number): number {
  if (level >= 5) return 10;
  if (level >= 4) return 8;
  if (level >= 3) return 6;
  return 5;
}

/** Pre-compute layout once at module level so it's stable across renders */
const NODES = buildLayout();

// ─── Edge computation ─────────────────────────────────────────────────────────

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

function buildEdges(): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const a = NODES[i];
      const b = NODES[j];
      if (a.skill.category !== b.skill.category) continue;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= EDGE_THRESHOLD) {
        edges.push({
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          color: skillCategories[a.skill.category].color,
        });
      }
    }
  }
  return edges;
}

const EDGES = buildEdges();

// ─── Tooltip state ────────────────────────────────────────────────────────────

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  name: string;
  level: number;
  color: string;
}

const TOOLTIP_HIDDEN: TooltipState = {
  visible: false,
  x: 0,
  y: 0,
  name: "",
  level: 0,
  color: "",
};

// ─── Tooltip component ────────────────────────────────────────────────────────

function SkillTooltip({ tooltip }: { tooltip: TooltipState }) {
  if (!tooltip.visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-20 rounded-lg border border-border bg-background/90 px-3 py-2 shadow-lg backdrop-blur-sm"
      style={{
        left: tooltip.x + 14,
        top: tooltip.y - 14,
        transform: "translateY(-50%)",
      }}
    >
      <p className="text-xs font-semibold text-foreground whitespace-nowrap">{tooltip.name}</p>
      <div className="mt-1 flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor:
                i < tooltip.level ? tooltip.color : "transparent",
              border: `1.5px solid ${tooltip.color}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Constellation SVG ────────────────────────────────────────────────────────

interface ConstellationProps {
  activeCategory: SkillCategory | null;
}

function Constellation({ activeCategory }: ConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(TOOLTIP_HIDDEN);

  const handleNodeEnter = useCallback(
    (node: NodePosition, e: React.MouseEvent<SVGCircleElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        name: node.skill.name,
        level: node.skill.level,
        color: skillCategories[node.skill.category].color,
      });
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGCircleElement>, node: NodePosition) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setTooltip((prev) => ({
        ...prev,
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        name: node.skill.name,
        level: node.skill.level,
        color: skillCategories[node.skill.category].color,
      }));
    },
    [],
  );

  const handleNodeLeave = useCallback(() => {
    setTooltip(TOOLTIP_HIDDEN);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Skills constellation"
        role="img"
      >
        <defs>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        <g aria-hidden="true">
          {EDGES.map((edge, idx) => {
            const edgeCat = NODES.find(
              (n) => n.x === edge.x1 && n.y === edge.y1,
            )?.skill.category;
            const dimmed =
              activeCategory !== null && edgeCat !== activeCategory;
            return (
              <line
                key={idx}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke={edge.color}
                strokeWidth={1}
                strokeOpacity={dimmed ? 0.03 : 0.12}
                style={{ transition: "stroke-opacity 0.3s ease" }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {NODES.map((node, idx) => {
            const color = skillCategories[node.skill.category].color;
            const isActive =
              activeCategory === null ||
              node.skill.category === activeCategory;
            return (
              <circle
                key={idx}
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={color}
                opacity={isActive ? 1 : 0.15}
                style={{
                  transition: "opacity 0.3s ease, filter 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => handleNodeEnter(node, e)}
                onMouseMove={(e) => handleMouseMove(e, node)}
                onMouseLeave={handleNodeLeave}
                className="hover:[filter:url(#node-glow)]"
                aria-label={`${node.skill.name} — level ${node.skill.level}`}
              />
            );
          })}
        </g>
      </svg>

      <SkillTooltip tooltip={tooltip} />
    </div>
  );
}

// ─── Category legend ──────────────────────────────────────────────────────────

interface LegendProps {
  activeCategory: SkillCategory | null;
  onSelect: (cat: SkillCategory | null) => void;
}

function CategoryLegend({ activeCategory, onSelect }: LegendProps) {
  const categoryKeys = Object.keys(skillCategories) as SkillCategory[];

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {/* "All" badge */}
      <button
        onClick={() => onSelect(null)}
        className={[
          "glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
          activeCategory === null
            ? "ring-2 ring-foreground/40 bg-foreground/10"
            : "opacity-70 hover:opacity-100",
        ].join(" ")}
        aria-pressed={activeCategory === null}
      >
        <span className="h-2 w-2 rounded-full bg-foreground/60" />
        All
      </button>

      {categoryKeys.map((cat) => {
        const { label, color } = skillCategories[cat];
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(isActive ? null : cat)}
            className={[
              "glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              isActive
                ? "ring-2 opacity-100"
                : "opacity-60 hover:opacity-90",
            ].join(" ")}
            style={
              isActive ? { outlineColor: color } : undefined
            }
            aria-pressed={isActive}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(null);

  const headingReveal = useReveal({ threshold: 0.15 });
  const vizReveal = useReveal({ threshold: 0.1, delay: 150 });

  return (
    <section id="skills" className="section-wrapper">
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
            Expertise
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl font-bold tracking-tight md:text-5xl"
          >
            My Stack<span className="gradient-text">.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-md text-muted-foreground"
          >
            Technologies I work with day to day.
          </motion.p>
        </motion.div>

        {/* ── Constellation + legend ── */}
        <motion.div
          ref={vizReveal.ref}
          initial="hidden"
          animate={vizReveal.controls}
          variants={staggerContainer}
        >
          <motion.div
            variants={staggerItem}
            className="overflow-hidden rounded-xl border border-border bg-muted/20"
          >
            <Constellation activeCategory={activeCategory} />
          </motion.div>

          <motion.div variants={staggerItem}>
            <CategoryLegend
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
