"use client";

// src/components/layout/Footer.tsx

import Link from "next/link";
import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

const SOCIAL = [
  { label: "GitHub",   href: "https://github.com/Mackintac",                                  icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mackenzie-graungaard-robinson/", icon: Linkedin },
  { label: "Email",    href: "mailto:mackgr.dev@gmail.com",                               icon: Mail },
];

const LINKS = [
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills" },
  { label: "Contact",  href: "#contact" },
];

export function Footer() {
  const toggleCLI = useUIStore((s) => s.toggleCLI);

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-content px-6 py-12 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="font-display text-lg font-semibold tracking-tight">
              MGR<span className="text-accent">.</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Full-stack developer building fast, delightful web experiences.
            </p>
            {/* CLI hint */}
            <button
              onClick={toggleCLI}
              className={cn(
                "flex items-center gap-2 text-xs text-muted-foreground",
                "transition-colors hover:text-accent"
              )}
            >
              <Terminal size={12} />
              Press <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">~</kbd> to open terminal
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex gap-8">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Navigation
              </p>
              <ul className="space-y-2">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Connect
              </p>
              <ul className="space-y-2">
                {SOCIAL.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <s.icon size={13} />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Mack Graungaard-Robinson. All rights reserved.</p>
          <p className="font-mono">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
