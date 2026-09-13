"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Trailing ring + dot. Only mounts on fine-pointer devices with motion
 * allowed; everywhere else the native cursor is left completely alone.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([ring, dot], { autoAlpha: 0, xPercent: -50, yPercent: -50 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

    let shown = false;
    const onMove = (event: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 });
      }
      ringX(event.clientX);
      ringY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
    };

    // Grow over anything interactive. Delegated, so it covers nodes that
    // mount later (case study links, the mobile sheet) without re-binding.
    const interactive = "a, button, [data-cursor]";
    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(interactive);
      if (!target) return;
      gsap.to(ring, { scale: 2.4, borderColor: "var(--ember)", duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };
    const onOut = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(interactive);
      if (!target) return;
      gsap.to(ring, { scale: 1, borderColor: "var(--ivory-faint)", duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };
    const onLeave = () => gsap.to([ring, dot], { autoAlpha: 0, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeave);
    };
  });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 size-8 rounded-full border border-ivory-faint opacity-0"
      />
      <div ref={dotRef} className="fixed left-0 top-0 size-1.5 rounded-full bg-ember opacity-0" />
    </div>
  );
}
