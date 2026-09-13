"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScrollTo = (target: string | HTMLElement) => void;

const SmoothScrollContext = createContext<ScrollTo | null>(null);

/**
 * Returns a scroll-to function that routes through Lenis when it is running
 * and falls back to the native API when it is not (reduced motion, SSR).
 */
export function useSmoothScrollTo(): ScrollTo {
  const ctx = useContext(SmoothScrollContext);
  return (
    ctx ??
    ((target) => {
      const el =
        typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      el?.scrollIntoView({ block: "start" });
    })
  );
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;

    const start = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({
        duration: 1.05,
        // Gentle exponential ease-out: fast handoff, no floaty tail.
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        // Touch devices already have native momentum -- don't double it up.
        syncTouch: false,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      setReady(true);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      setReady(true);
    };

    const sync = () => (reduceMotion.matches ? stop() : start());

    sync();
    reduceMotion.addEventListener("change", sync);

    return () => {
      reduceMotion.removeEventListener("change", sync);
      stop();
    };
  }, []);

  const scrollTo = useCallback<ScrollTo>((target) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target);
      return;
    }
    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    // Native fallback (reduced motion): honours scroll-margin-top just like Lenis.
    el?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <SmoothScrollContext.Provider value={scrollTo}>{children}</SmoothScrollContext.Provider>
  );
}
