// src/app/api/github/route.ts
// ─── GitHub stats — fetched server-side, cached for 1 hour ───────────────────

import { NextResponse } from "next/server";
import type { GitHubStats } from "@/types";

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "Mackintac";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // optional but avoids rate limits

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

export const revalidate = 3600; // Cache for 1 hour (ISR)

export async function GET() {
  try {
    // ── User profile ────────────────────────────────────────────────────────
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
    const user = await userRes.json();

    // ── Repos — collect stars ───────────────────────────────────────────────
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers }
    );
    const repos: Array<{ stargazers_count: number; language: string | null; size: number }> =
      await reposRes.json();

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

    // ── Language breakdown ──────────────────────────────────────────────────
    const langCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] ?? 0) + (repo.size ?? 1);
      }
    }
    const totalSize = Object.values(langCounts).reduce((a, b) => a + b, 0);
    const LANG_COLORS: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      CSS: "#563d7c",
      HTML: "#e34c26",
      Rust: "#dea584",
    };
    const topLanguages = Object.entries(langCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, size]) => ({
        name,
        percentage: Math.round((size / totalSize) * 100),
        color: LANG_COLORS[name] ?? "#64748b",
      }));

    const stats: GitHubStats = {
      username: GITHUB_USERNAME,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      totalStars,
      totalCommitsThisYear: 0, // Requires GraphQL — placeholder; wire up if needed
      topLanguages,
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error("[api/github] error:", err);
    return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 });
  }
}
