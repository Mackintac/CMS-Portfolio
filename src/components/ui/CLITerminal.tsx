"use client";

// src/components/ui/CLITerminal.tsx
// ─── Easter egg terminal — open with ~ or ` anywhere on the page ───────────────

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { parseCLIInput } from "@/lib/cli-commands";
import { cn } from "@/lib/utils";

const PROMPT = "visitor@portfolio:~$";

export function CLITerminal() {
  const { cliOpen, cliHistory, closeCLI, pushCLILine, clearCLI } = useUIStore();
  const [input, setInput] = useState("");
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [cliHistory]);

  // Focus input when terminal opens
  useEffect(() => {
    if (cliOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [cliOpen]);

  const handleSubmit = useCallback(() => {
    const raw = input.trim();
    if (!raw) return;

    // Echo the input
    pushCLILine({ type: "input", text: `${PROMPT} ${raw}` });

    // Save to arrow-key history
    setInputHistory((h) => [raw, ...h]);
    setHistoryIdx(-1);
    setInput("");

    // Parse and execute
    const { output, special } = parseCLIInput(raw);

    if (special === "clear") {
      clearCLI();
      return;
    }
    if (special === "exit") {
      output.forEach((line) => pushCLILine({ type: "output", text: line }));
      setTimeout(closeCLI, 400);
      return;
    }

    output.forEach((line) =>
      pushCLILine({
        type: line.includes("not found") || line.includes("No such") ? "error" : "output",
        text: line,
      })
    );
  }, [input, pushCLILine, clearCLI, closeCLI]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, inputHistory.length - 1);
      setHistoryIdx(next);
      setInput(inputHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? "" : (inputHistory[next] ?? ""));
    } else if (e.key === "Escape") {
      closeCLI();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      clearCLI();
    }
  };

  return (
    <AnimatePresence>
      {cliOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cli-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCLI}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
          />

          {/* Terminal window */}
          <motion.div
            key="cli-window"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-8 left-1/2 z-[9999] w-full max-w-2xl -translate-x-1/2 px-4"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                {/* Traffic lights */}
                <button
                  onClick={closeCLI}
                  className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500 hover:brightness-90"
                >
                  <X size={7} className="text-red-900 opacity-0 hover:opacity-100" />
                </button>
                <button className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-500 hover:brightness-90">
                  <Minus size={7} className="text-yellow-900 opacity-0 hover:opacity-100" />
                </button>
                <div className="h-3 w-3 rounded-full bg-green-500 opacity-60" />

                {/* Title */}
                <span className="flex-1 text-center font-mono text-xs text-muted-foreground">
                  portfolio — bash
                </span>

                {/* Hint */}
                <span className="font-mono text-[10px] text-muted-foreground opacity-50">
                  esc to close
                </span>
              </div>

              {/* Output area */}
              <div
                ref={scrollRef}
                className="h-72 overflow-y-auto px-4 py-3 font-mono text-sm"
              >
                {cliHistory.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "whitespace-pre-wrap leading-relaxed",
                      line.type === "input"
                        ? "text-accent"
                        : line.type === "error"
                          ? "text-red-400"
                          : "text-muted-foreground"
                    )}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <span className="shrink-0 font-mono text-sm text-accent">{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  className={cn(
                    "flex-1 bg-transparent font-mono text-sm text-foreground",
                    "outline-none placeholder:text-muted-foreground/40",
                    "caret-accent"
                  )}
                  placeholder="type 'help'"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
