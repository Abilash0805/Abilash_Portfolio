"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-store";

type ScrollTo = (target: string | HTMLElement) => void;

const ScrollContext = createContext<ScrollTo | null>(null);

export function useSmoothScrollTo(): ScrollTo {
  const ctx = useContext(ScrollContext);
  return (
    ctx ??
    ((target) => {
      const el =
        typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      el?.scrollIntoView({ block: "start" });
    })
  );
}

/**
 * Lenis drives the scroll position; GSAP's ticker drives Lenis; ScrollTrigger
 * reads from it. Wiring all three to one clock is what stops pinned sections
 * from drifting a frame behind the content that scrolls past them.
 *
 * Under prefers-reduced-motion Lenis is not started at all -- native scrolling
 * is the accessible default, and ScrollTrigger works fine without it.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let tick: ((time: number) => void) | null = null;

    const start = () => {
      if (lenisRef.current) return;

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch devices have their own momentum; doubling it feels like ice.
        syncTouch: false,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      // GSAP's lag smoothing would desync Lenis after a dropped frame.
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      gsap.ticker.lagSmoothing(500, 33);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const sync = () => (reduceMotion.matches ? stop() : start());

    sync();
    reduceMotion.addEventListener("change", sync);

    // Page-level progress + velocity, read every frame by the 3D scene.
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollState.pageProgress = self.progress;
        scrollState.velocity = gsap.utils.clamp(-1, 1, self.getVelocity() / 3000);
      },
    });

    const onPointer = (event: PointerEvent) => {
      scrollState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Fonts change line-heights, which moves every trigger below them.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      reduceMotion.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onPointer);
      progress.kill();
      stop();
    };
  }, []);

  const scrollTo = useCallback<ScrollTo>((target) => {
    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el);
      return;
    }
    el.scrollIntoView({ block: "start" });
  }, []);

  return <ScrollContext.Provider value={scrollTo}>{children}</ScrollContext.Provider>;
}
