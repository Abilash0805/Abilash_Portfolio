"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

type Common = {
  children: ReactNode;
  className?: string;
  /** Play on scroll into view (default) or immediately on mount. */
  trigger?: "scroll" | "mount";
  delay?: number;
};

/**
 * Character-level reveal for short display headlines.
 *
 * Reserved for headlines under ~8 words: SplitText creates one element per
 * character, so a paragraph would balloon the DOM. Longer copy uses MaskLines.
 * SplitText's default aria handling labels the parent and hides the shards, so
 * screen readers still read one continuous string; revert() restores the
 * original text nodes on unmount.
 */
export function SplitChars({
  children,
  className,
  as = "h2",
  trigger = "scroll",
  delay = 0,
}: Common & { as?: ElementType }) {
  const ref = useRef<HTMLDivElement>(null);
  // The tag is caller-supplied, so TS cannot know its prop shape. Narrowing to
  // one intrinsic element keeps the ref and className typed; at runtime React
  // still renders whichever tag was passed in.
  const Tag = as as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, { type: "chars,lines", mask: "lines" });

        const tween = gsap.from(split.chars, {
          yPercent: 115,
          rotateX: -55,
          opacity: 0,
          duration: 0.85,
          delay,
          ease: "expo.out",
          stagger: 0.016,
          ...(trigger === "scroll"
            ? {
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              }
            : {}),
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [trigger, delay] },
  );

  return (
    <Tag ref={ref} data-reveal className={className} style={{ perspective: 800 }}>
      {children}
    </Tag>
  );
}

/**
 * Line-level mask reveal. Each line slides up from behind its own clip, which
 * is what makes body copy feel typeset rather than faded in.
 */
export function MaskLines({
  children,
  className,
  as = "p",
  trigger = "scroll",
  delay = 0,
  stagger = 0.08,
}: Common & { as?: ElementType; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, { type: "lines", mask: "lines" });

        const tween = gsap.from(split.lines, {
          yPercent: 105,
          opacity: 0,
          duration: 0.95,
          delay,
          ease: "expo.out",
          stagger,
          ...(trigger === "scroll"
            ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } }
            : {}),
        });

        // Splitting rewrites the box; anything below it just moved.
        ScrollTrigger.refresh();

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [trigger, delay, stagger] },
  );

  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}

/**
 * Generic "fade and rise" for anything that is not text -- cards, rules, rows.
 * Children are staggered when there is more than one.
 */
export function Rise({
  children,
  className,
  stagger = 0.07,
  y = 28,
  start = "top 85%",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = el.children.length > 1 ? Array.from(el.children) : el;
        const tween = gsap.from(targets, {
          y,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [stagger, y, start] },
  );

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
