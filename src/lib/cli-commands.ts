// src/lib/cli-commands.ts
// ─── CLI easter egg — command registry ────────────────────────────────────────
// Press ~ anywhere on the site to open the terminal.

import type { CLICommand } from "@/types";
import { projects } from "@/lib/projects";
import { skills } from "@/lib/skills";

const PROMPT = "visitor@portfolio:~$";

export const commands: Record<string, CLICommand> = {
  help: {
    name: "help",
    description: "List available commands",
    handler: () => [
      "Available commands:",
      "  help          — show this message",
      "  whoami        — about the developer",
      "  ls            — list sections",
      "  ls projects/  — list projects",
      "  cat about.md  — read about section",
      "  cat resume.md — view résumé highlights",
      "  open <slug>   — navigate to a project",
      "  skills        — list tech skills",
      "  git log       — commit history (fun)",
      "  clear         — clear terminal",
      "  exit          — close terminal",
    ],
  },

  whoami: {
    name: "whoami",
    description: "About the developer",
    handler: () => [
      "Your Name",
      "Full-Stack Developer — React · TypeScript · AI",
      "Location: Barrie, Ontario, Canada",
      "Open to: Senior Frontend / Full-Stack roles",
      "Contact: hello@yourportfolio.dev",
    ],
  },

  ls: {
    name: "ls",
    description: "List directory contents",
    handler: (args) => {
      if (args[0] === "projects/") {
        return [
          "projects/",
          ...projects.map((p) => `  ${p.slug}/`),
        ];
      }
      return [
        "hero/     about/    skills/",
        "projects/ stats/    blog/",
        "contact/",
      ];
    },
  },

  cat: {
    name: "cat",
    description: "Read a file",
    handler: (args) => {
      switch (args[0]) {
        case "about.md":
          return [
            "# About",
            "",
            "I'm a full-stack developer with a focus on React and TypeScript.",
            "I build fast, accessible, production-grade web apps and love",
            "integrating AI to make them smarter.",
            "",
            "Previously: [Your Previous Role]",
            "Currently: Open to opportunities",
          ];
        case "resume.md":
          return [
            "# Résumé highlights",
            "",
            "## Experience",
            "  [Your Role] at [Company] — [Year–Year]",
            "",
            "## Projects",
            ...projects.map((p) => `  • ${p.title} — ${p.tagline}`),
            "",
            "## Education",
            "  [Your Degree], [University] — [Year]",
            "",
            "Download full PDF: /resume.pdf",
          ];
        default:
          return [`cat: ${args[0] ?? "(no file)"}: No such file or directory`];
      }
    },
  },

  open: {
    name: "open",
    description: "Navigate to a project",
    handler: (args) => {
      const slug = args[0];
      const project = projects.find((p) => p.slug === slug);
      if (!project) {
        return [
          `open: ${slug ?? "(no slug)"}: project not found`,
          `Try: ${projects.map((p) => p.slug).join(", ")}`,
        ];
      }
      // Side-effect: navigate (handled in CLITerminal component)
      if (typeof window !== "undefined") {
        window.location.href = `/projects/${slug}`;
      }
      return [`Opening ${project.title}…`];
    },
  },

  skills: {
    name: "skills",
    description: "List tech skills",
    handler: () => {
      const byCategory = skills.reduce(
        (acc, s) => {
          acc[s.category] = acc[s.category] ?? [];
          acc[s.category].push(s.name);
          return acc;
        },
        {} as Record<string, string[]>
      );
      return Object.entries(byCategory).map(
        ([cat, names]) => `  ${cat.padEnd(10)} ${names.join(", ")}`
      );
    },
  },

  "git log": {
    name: "git log",
    description: "Commit history (fun)",
    handler: () => [
      "commit a1b2c3d — fix: finally centered that div",
      "commit e4f5g6h — feat: add AI chat (humans are optional now)",
      "commit i7j8k9l — feat: 3D hero (because CSS wasn't complex enough)",
      "commit m1n2o3p — chore: delete node_modules and cry",
      "commit q4r5s6t — init: here we go again",
    ],
  },

  clear: {
    name: "clear",
    description: "Clear terminal",
    // Handled specially in CLITerminal component
    handler: () => [],
  },

  exit: {
    name: "exit",
    description: "Close terminal",
    // Handled specially in CLITerminal component
    handler: () => ["Goodbye."],
  },
};

/** Parse raw input → command + args, handle unknown commands */
export function parseCLIInput(raw: string): { output: string[]; special?: "clear" | "exit" } {
  const trimmed = raw.trim();
  if (!trimmed) return { output: [] };

  // Match "git log" as a multi-word command first
  const fullKey = Object.keys(commands).find((k) => trimmed === k || trimmed.startsWith(k + " "));
  const [base, ...rest] = trimmed.split(" ");
  const key = fullKey ?? base;
  const args = fullKey ? trimmed.slice(key.length).trim().split(" ").filter(Boolean) : rest;

  if (key === "clear") return { output: [], special: "clear" };
  if (key === "exit") return { output: ["Goodbye."], special: "exit" };

  const cmd = commands[key];
  if (!cmd) {
    return {
      output: [
        `command not found: ${base}`,
        "Type 'help' for available commands.",
      ],
    };
  }

  const result = cmd.handler(args);
  return { output: Array.isArray(result) ? result : [result] };
}
