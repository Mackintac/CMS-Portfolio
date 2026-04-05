"use client";
// src/components/sections/ContactSection.tsx
// ─── Contact — social links + contact form ────────────────────────────────────

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Download, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useReveal, fadeUp, staggerContainer, staggerItem } from "@/hooks/useReveal";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = "idle" | "sending" | "success" | "error";

interface SocialLink {
  icon: React.ElementType;
  label: string;
  display: string;
  href: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const socialLinks: SocialLink[] = [
  {
    icon: Mail,
    label: "Email",
    display: "mackgr.dev@gmail.com",
    href: "mailto:mackgr.dev@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    display: "github.com/Mackintac",
    href: "https://github.com/Mackintac",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    display: "mackenzie-graungaard-robinson",
    href: "https://www.linkedin.com/in/mackenzie-graungaard-robinson/",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SocialLinkRow({ icon: Icon, label, display, href }: SocialLink) {
  return (
    <motion.a
      variants={staggerItem}
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
      className="group flex items-center gap-4 rounded-lg px-3 py-3 -mx-3 transition-colors hover:bg-accent/10"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent">
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-muted-foreground">{label}</span>
        <span className="block truncate text-sm font-medium text-foreground group-hover:text-accent transition-colors">
          {display}
        </span>
      </span>
      <ArrowUpRight
        size={16}
        className="shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
      />
    </motion.a>
  );
}

function SuccessMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Mail size={26} />
      </div>
      <p className="text-lg font-semibold text-foreground">Message sent!</p>
      <p className="text-sm text-muted-foreground">I&apos;ll get back to you soon.</p>
    </div>
  );
}

function ErrorBanner() {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      Something went wrong. Please try again or email me directly.
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isSending = formState === "sending";

  const inputClass =
    "w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "text-sm font-medium text-foreground mb-1.5 block";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSending) return;

    setFormState("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") {
    return <SuccessMessage />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {formState === "error" && <ErrorBanner />}

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          disabled={isSending}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          disabled={isSending}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          disabled={isSending}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your project or role…"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isSending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground transition-opacity disabled:opacity-70"
      >
        {isSending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ContactSection() {
  const leftReveal = useReveal({ threshold: 0.15 });
  const formReveal = useReveal({ threshold: 0.1, delay: 150 });

  return (
    <section id="contact" className="section-wrapper">
      <div className="mx-auto grid max-w-content gap-16 md:grid-cols-2 md:gap-20 items-start">

        {/* ── Left column: heading + social links + resume ── */}
        <motion.div
          ref={leftReveal.ref}
          initial="hidden"
          animate={leftReveal.controls}
          variants={staggerContainer}
        >
          {/* Eyebrow */}
          <motion.p variants={fadeUp} className="eyebrow mb-4">
            Get in touch
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl font-bold tracking-tight md:text-5xl"
          >
            Let&apos;s Work Together.
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="mt-4 text-muted-foreground leading-relaxed"
          >
            Open to full-stack and frontend roles. Feel free to reach out.
          </motion.p>

          {/* Social links */}
          <motion.div
            variants={staggerContainer}
            className="mt-10 flex flex-col gap-1"
          >
            {socialLinks.map((link) => (
              <SocialLinkRow key={link.label} {...link} />
            ))}
          </motion.div>

          {/* Resume download */}
          <motion.div variants={fadeUp} className="mt-8">
            <Link
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <Download size={16} />
              Download Resume
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Right column: contact form ── */}
        <motion.div
          ref={formReveal.ref}
          initial="hidden"
          animate={formReveal.controls}
          variants={fadeUp}
        >
          <div className="glass rounded-xl p-6 md:p-8">
            <ContactForm />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
