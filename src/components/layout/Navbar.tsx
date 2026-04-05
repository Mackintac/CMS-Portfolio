"use client";

// src/components/layout/Navbar.tsx

import Link from "next/link";
import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Terminal } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about",    label: "About" },
  { href: "#skills",   label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#blog",     label: "Blog" },
  { href: "#contact",  label: "Contact" },
];

export function Navbar() {
  const { navScrolled, setNavScrolled, toggleCLI } = useUIStore();
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setNavScrolled(y > 60));
    return unsub;
  }, [scrollY, setNavScrolled]);

  // Global ~ key listener to open CLI
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "~" || e.key === "`") {
        e.preventDefault();
        toggleCLI();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleCLI]);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        navScrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
        {/* Logo / name */}
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          YN<span className="text-accent">.</span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* CLI toggle — always visible */}
          <button
            onClick={toggleCLI}
            title="Open terminal (~)"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border border-border",
              "text-muted-foreground transition-all hover:border-accent hover:text-accent"
            )}
          >
            <Terminal size={14} />
          </button>

          {/* Hire me CTA */}
          <Link
            href="#contact"
            className={cn(
              "hidden rounded-md border border-accent px-4 py-1.5 text-sm font-medium",
              "text-accent transition-all hover:bg-accent hover:text-accent-foreground",
              "md:inline-flex"
            )}
          >
            Hire me
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
