"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";

/**
 * The title card. Counts up, then lifts like a curtain.
 *
 * Two rules it never breaks: the scroll lock is released in a cleanup that runs
 * whatever happens, and under reduced motion the whole thing is skipped -- the
 * visitor lands directly on the page.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      const count = countRef.current;
      if (!root || !count) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const html = document.documentElement;
        html.style.overflow = "hidden";

        const release = () => {
          html.style.overflow = "";
          setDone(true);
          ScrollTrigger.refresh();
        };

        // Safety net: if the timeline is interrupted, scrolling still comes back.
        const failsafe = window.setTimeout(release, 5000);

        const counter = { value: 0 };
        const tl = gsap.timeline({
          onComplete: () => {
            window.clearTimeout(failsafe);
            release();
          },
        });

        tl.to(counter, {
          value: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            count.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        })
          .to(".preloader-line", { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
          .to(".preloader-word", {
            yPercent: -110,
            duration: 0.7,
            ease: "expo.inOut",
            stagger: 0.05,
          })
          .to(
            root,
            { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" },
            "-=0.35",
          );

        return () => {
          window.clearTimeout(failsafe);
          tl.kill();
          html.style.overflow = "";
        };
      });

      // Reduced motion: nothing to play, so there is nothing to wait for.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        setDone(true);
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[95] flex flex-col justify-between bg-ink px-6 py-6 sm:px-10 sm:py-10"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex items-start justify-between font-sans text-xs uppercase tracking-[0.28em] text-ivory-faint">
        <span className="line-mask">
          <span className="preloader-word block">{site.name}</span>
        </span>
        <span className="line-mask">
          <span className="preloader-word block">Portfolio</span>
        </span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <span className="line-mask">
          <span className="preloader-word block font-display text-[12vw] leading-none tracking-tighter text-ivory sm:text-[7vw]">
            <span ref={countRef}>000</span>
          </span>
        </span>
        <span className="line-mask hidden sm:block">
          <span className="preloader-word block max-w-xs text-right text-sm leading-snug text-ivory-dim">
            Developer · Designer · Builder · Student
          </span>
        </span>
      </div>

      <div className="mt-6 h-px w-full origin-left scale-x-0 bg-ember preloader-line" />
    </div>
  );
}
