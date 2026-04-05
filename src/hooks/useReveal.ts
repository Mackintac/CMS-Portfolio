// src/hooks/useReveal.ts
// ─── Intersection Observer hook for scroll-triggered reveal animations ─────────

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useAnimation, type AnimationControls } from "framer-motion";

interface UseRevealOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

interface UseRevealReturn {
  ref: (node?: Element | null) => void;
  controls: AnimationControls;
  inView: boolean;
}

export function useReveal({
  threshold = 0.15,
  triggerOnce = true,
  delay = 0,
}: UseRevealOptions = {}): UseRevealReturn {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold, triggerOnce });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => controls.start("visible"), delay);
      return () => clearTimeout(timer);
    } else if (!triggerOnce) {
      controls.start("hidden");
    }
  }, [inView, controls, delay, triggerOnce]);

  return { ref, controls, inView };
}

// ─── Shared Framer Motion variants ────────────────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
