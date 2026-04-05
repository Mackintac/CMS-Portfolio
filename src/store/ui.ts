// src/store/ui.ts
// ─── Global UI state — CLI terminal, AI chat, nav ─────────────────────────────

import { create } from "zustand";

interface UIStore {
  // CLI terminal
  cliOpen: boolean;
  cliHistory: Array<{ type: "input" | "output" | "error"; text: string }>;
  toggleCLI: () => void;
  closeCLI: () => void;
  pushCLILine: (line: UIStore["cliHistory"][0]) => void;
  clearCLI: () => void;

  // AI chat widget
  chatOpen: boolean;
  toggleChat: () => void;
  closeChat: () => void;

  // Navbar
  navScrolled: boolean;
  setNavScrolled: (v: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // ── CLI ──────────────────────────────────────────────────────────────────
  cliOpen: false,
  cliHistory: [
    {
      type: "output",
      text: "Welcome to my portfolio terminal. Type 'help' to see available commands.",
    },
  ],
  toggleCLI: () => set((s) => ({ cliOpen: !s.cliOpen })),
  closeCLI: () => set({ cliOpen: false }),
  pushCLILine: (line) =>
    set((s) => ({ cliHistory: [...s.cliHistory, line] })),
  clearCLI: () =>
    set({
      cliHistory: [
        { type: "output", text: "Terminal cleared." },
      ],
    }),

  // ── AI Chat ──────────────────────────────────────────────────────────────
  chatOpen: false,
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  closeChat: () => set({ chatOpen: false }),

  // ── Navbar ───────────────────────────────────────────────────────────────
  navScrolled: false,
  setNavScrolled: (v) => set({ navScrolled: v }),
}));
