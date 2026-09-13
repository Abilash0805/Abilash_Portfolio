"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-store";

/**
 * Endless band of text. The base drift is constant; scroll velocity adds to it
 * and skews the type, so the band reacts to how hard you are scrolling.
 */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const strips = gsap.utils.toArray<HTMLElement>(".marquee-strip");
        const wrap = gsap.utils.wrap(-100, 0);

        const drift = gsap.to(strips, {
          xPercent: -100,
          repeat: -1,
          duration: 26,
          ease: "none",
          modifiers: { xPercent: (value) => `${wrap(parseFloat(value))}%` },
        });

        const skewTo = gsap.quickTo(strips, "skewX", { duration: 0.5, ease: "power3.out" });

        const onTick = () => {
          const v = scrollState.velocity;
          drift.timeScale(1 + Math.abs(v) * 6);
          skewTo(gsap.utils.clamp(-9, 9, v * 14));
        };
        gsap.ticker.add(onTick);

        return () => {
          gsap.ticker.remove(onTick);
          drift.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`flex w-full overflow-hidden whitespace-nowrap ${className ?? ""}`}
    >
      {[0, 1].map((copy) => (
        <div key={copy} className="marquee-strip flex shrink-0 items-center">
          {items.map((item, index) => (
            <span key={`${copy}-${index}`} className="flex items-center">
              <span className="px-8 font-display text-[9vw] font-semibold uppercase leading-none tracking-tight text-ivory md:text-[5.5vw]">
                {item}
              </span>
              <span className="size-2 rounded-full bg-ember" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
