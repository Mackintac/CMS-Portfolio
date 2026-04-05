# Portfolio Project — Claude Code Handoff

> Share this file with Claude Code at the start of your session.
> Prompt: "Read HANDOFF.md and then let's continue building my portfolio site."

---

## What this project is

A personal portfolio site for a full-stack React/TypeScript developer.
It is intentionally ambitious — built to function as a **fourth portfolio project** in its own right,
not just a static page. The site showcases three other projects and demonstrates visual craft,
motion design, and architectural thinking.

---

## The three portfolio projects being showcased

| Project | Stack | Notes |
|---|---|---|
| Job Application Tracker | Next.js 14, Clerk auth, Prisma, PostgreSQL, Tailwind, shadcn/ui, Vercel | Kanban-style job hunt manager |
| AI-Powered Visual API Tester | React + Vite, Monaco Editor, Anthropic API, Zustand | Postman-like tool with Claude co-pilot |
| Dice Roll Duel | React, TypeScript, Framer Motion | Real-time multiplayer dice game |

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Already used in Job Tracker; RSC, ISR, file-based routing |
| Language | TypeScript (strict) | Consistent across all projects |
| Styling | Tailwind CSS + shadcn/ui | Consistent with Job Tracker |
| Animation | Framer Motion + GSAP + ScrollTrigger | Framer for components, GSAP for scroll sequences |
| 3D | React Three Fiber + Three.js | Hero particle field |
| MDX | next-mdx-remote v5 + gray-matter | Case studies and blog — Next 14 compatible |
| State | Zustand | CLI terminal and AI chat widget state |
| Email | Resend | Contact form |
| Deployment | Vercel | ISR, edge functions |
| AI | Anthropic Claude API | AI chat widget answers visitor questions |

> **Important:** `contentlayer` / `next-contentlayer` were intentionally excluded —
> they only support Next 12/13. We use `src/lib/mdx.ts` instead.

---

## Scaffold already built

The following files exist and are **complete** (not stubs):

```
src/
├── app/
│   ├── (site)/page.tsx              # Homepage — assembles all sections
│   ├── layout.tsx                   # Root layout, fonts, ThemeProvider, global overlays
│   ├── globals.css                  # Design tokens, CSS vars, Tailwind base
│   ├── projects/[slug]/page.tsx     # MDX case study renderer (next-mdx-remote/rsc)
│   └── api/
│       ├── chat/route.ts            # Claude API — AI chat widget backend
│       ├── contact/route.ts         # Resend — contact form email
│       └── github/route.ts          # GitHub public stats (1hr ISR cache)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx               # Fixed nav, transparent→solid on scroll, ~ key → CLI
│   │   ├── Footer.tsx               # Social links, nav, CLI hint
│   │   └── ThemeProvider.tsx        # next-themes wrapper
│   ├── ui/
│   │   ├── CLITerminal.tsx          # ★ Full CLI easter egg (press ~ anywhere)
│   │   └── AIChat.tsx               # ★ Floating AI chat widget (Claude-powered)
│   ├── sections/                    # All stubs — need implementing (see below)
│   └── 3d/                          # Empty — Three.js components go here
├── lib/
│   ├── mdx.ts                       # MDX file reader (replaces Contentlayer)
│   ├── projects.ts                  # Static project data array
│   ├── skills.ts                    # Skills data for constellation
│   ├── cli-commands.ts              # CLI command registry (help, ls, cat, open, etc.)
│   └── utils.ts                     # cn(), formatDate(), clamp(), mapRange(), slugify()
├── store/
│   └── ui.ts                        # Zustand: cliOpen, chatOpen, navScrolled + actions
├── hooks/
│   └── useReveal.ts                 # IntersectionObserver + Framer Motion reveal hook
├── types/
│   └── index.ts                     # Project, Post, Skill, GitHubStats, CLICommand types
└── content/
    ├── projects/
    │   └── job-tracker.mdx          # Example case study (use as template)
    └── blog/                         # Empty — add .mdx files here
```

**Config files:**
- `package.json` — all deps pinned, no contentlayer
- `next.config.js` — clean, no wrappers
- `tailwind.config.ts` — custom tokens: `font-display`, `gradient-text`, `glass`, `section-wrapper`
- `tsconfig.json` — path aliases: `@/*`, `@/components/*`, `@/lib/*`, etc.
- `.env.example` — documents all required env vars

---

## Environment variables needed

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://yourportfolio.dev
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
GITHUB_TOKEN=github_pat_...   # optional, avoids rate limits
```

---

## Design system

**Colours (CSS vars):**
- `--background` / `--foreground` — adaptive light/dark
- `--muted` / `--muted-foreground` — surfaces and secondary text
- `--accent` / `--accent-foreground` — violet-600, used for CTAs and highlights
- `--glow-1/2/3` — violet, blue, cyan — used in gradients and Three.js scene

**Fonts:**
- `font-sans` → Geist Sans (`var(--font-geist-sans)`)
- `font-mono` → Geist Mono (`var(--font-geist-mono)`)
- `font-display` → Cal Sans or Geist Sans — used for hero headings

**Tailwind utility classes (defined in globals.css):**
- `.section-wrapper` — consistent section padding + max-width + centering
- `.eyebrow` — small mono uppercase label above headings
- `.gradient-text` — violet→blue→cyan gradient clip text
- `.glass` — frosted glass card (bg/60 + backdrop-blur)
- `.grain::after` — subtle noise texture overlay (used on hero)

**Dark mode:** default. Implemented via `next-themes` with `class` strategy.

---

## What still needs building (priority order)

### 1. Hero section — `src/components/sections/HeroSection.tsx`
Currently a placeholder with a gradient backdrop.

**Target:** Full-viewport section with a React Three Fiber particle field that reacts to mouse movement. The particle mesh should spell out or form around the developer's name, or be an abstract network graph. Custom cursor (`src/components/ui/CustomCursor.tsx`) should also be added.

**R3F component location:** `src/components/3d/ParticleField.tsx`

Key details:
- Canvas should be `position: absolute, inset: 0` behind the text content
- Use `@react-three/fiber` `Canvas` + `@react-three/drei` helpers
- Mouse position → uniform passed to shader or `useFrame` lerp
- Text content (name, tagline, CTAs) sits above canvas as normal DOM, already written

---

### 2. Projects section — `src/components/sections/ProjectsSection.tsx`
Showcase cards for all four projects.

**Target:** Animated card grid. Featured projects (Job Tracker, AI Tester) get larger cards. Each card shows: cover image, title, tagline, tech chips, live/repo links. On hover: subtle lift + border glow. Click → case study page.

Data source: `import { projects } from "@/lib/projects"` — already populated.

---

### 3. About section — `src/components/sections/AboutSection.tsx`
**Target:** Two-column layout. Left: bio paragraph + a timeline of key career moments. Right: a rotating "tech orbit" — concentric rings of skill icons orbiting a centre avatar. Scroll-triggered reveal using `useReveal` hook from `src/hooks/useReveal.ts`.

---

### 4. Skills section — `src/components/sections/SkillsSection.tsx`
**Target:** Interactive skills constellation. Nodes sized by proficiency level (1–5), coloured by category, connected by faint edges. Hover a node → tooltip with skill name + level. Can use D3-force or a simple canvas/SVG layout.

Data source: `import { skills, skillCategories } from "@/lib/skills"` — already populated.

---

### 5. Stats section — `src/components/sections/StatsSection.tsx`
**Target:** Animated stat cards fetched from `/api/github`. Show: public repos, total stars, top languages (bar or ring chart). Numbers count up on scroll-into-view.

---

### 6. Contact section — `src/components/sections/ContactSection.tsx`
**Target:** Clean form (name, email, message) that POSTs to `/api/contact`. Success/error states. Plus resume download button linking to `/resume.pdf`.

---

### 7. Blog section — `src/components/sections/BlogSection.tsx`
**Target:** Latest 3 posts from `src/content/blog/`. If no posts exist yet, show a "coming soon" placeholder gracefully. Data via `getAllPosts()` from `src/lib/mdx.ts`.

---

## Key architectural notes for Claude Code

- **No `contentlayer` imports anywhere.** Use `getAllCaseStudies()` / `getCaseStudy()` / `getAllPosts()` / `getPost()` from `src/lib/mdx.ts`.
- **Server vs client components:** sections that use Framer Motion or hooks need `"use client"`. API data fetching (GitHub stats) can stay server components.
- **`useReveal` hook** is ready to use for scroll-triggered Framer Motion animations. Import `{ useReveal, fadeUp, staggerContainer, staggerItem }` from `src/hooks/useReveal.ts`.
- **Zustand store** (`src/store/ui.ts`) manages CLI and chat open state. Don't create local state for these.
- **GSAP** should be registered with ScrollTrigger in a `useEffect` inside a `"use client"` component. Use `gsap.registerPlugin(ScrollTrigger)`.
- **Three.js / R3F** components go in `src/components/3d/`. Always wrap in a `Suspense` boundary in the parent section.

---

## CLI easter egg — fully working

Press `~` or `` ` `` anywhere on the page. Commands: `help`, `whoami`, `ls`, `ls projects/`, `cat about.md`, `cat resume.md`, `open <slug>`, `skills`, `git log`, `clear`, `exit`.

To add commands: edit `src/lib/cli-commands.ts` → add entry to the `commands` object.

---

## AI chat widget — fully working

Floating button (bottom-right). Opens a chat powered by `/api/chat/route.ts` which calls Claude. The system prompt in that file has a `<context>` block — **fill in your real name, background, and experience there**.

Model used: `claude-opus-4-5`. Max tokens: 512 per response. Last 10 messages sent for context.

---

## Suggested first prompt for Claude Code

```
Read HANDOFF.md. Then let's build the HeroSection — I want a React Three Fiber 
particle field as the background with mouse-reactive particles. The text content 
(name, tagline, CTAs) already exists in HeroSection.tsx as a placeholder. 
Add the 3D canvas behind it and create src/components/3d/ParticleField.tsx.
```
