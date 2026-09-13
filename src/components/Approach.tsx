"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { approach } from "@/content/site";

/**
 * Pinned chapter sequence. One of only two pinned sections on the page --
 * pinning fights native scroll, so it is spent where the narrative needs it.
 *
 * Without motion this degrades to a plain stacked list of the same three
 * chapters, in DOM order, fully readable.
 */
export function Approach() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      // Pinned only where there is height to spend on it. On phones the same
      // chapters simply stack and scroll -- pinning there fights the native
      // scroll far more than it adds.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const chapters = gsap.utils.toArray<HTMLElement>(".chapter");
        const rails = gsap.utils.toArray<HTMLElement>(".chapter-rail-fill");

        // Set the starting state here rather than inline, so a chapter is never
        // left invisible on a viewport where this timeline does not run.
        gsap.set(chapters.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${chapters.length * 90}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        chapters.forEach((chapter, index) => {
          if (index > 0) {
            // Cut, not dissolve: the outgoing chapter is fully gone before the
            // next one arrives. Overlapping two blocks of copy at 50% opacity
            // just produces a paragraph nobody can read.
            tl.to(
              chapters[index - 1],
              { autoAlpha: 0, yPercent: -6, ease: "power2.in", duration: 0.4 },
              index,
            ).fromTo(
              chapter,
              { autoAlpha: 0, yPercent: 6 },
              { autoAlpha: 1, yPercent: 0, ease: "power2.out", duration: 0.4 },
              index + 0.6,
            );
          }

          tl.fromTo(
            rails[index],
            { scaleX: 0 },
            { scaleX: 1, ease: "none", duration: 1 },
            index,
          );
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set(chapters, { clearProps: "opacity,visibility,transform" });
        };
      });

      // Narrow screens still get the rails filled, just on plain scroll.
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        const tween = gsap.from(".chapter-rail-fill", {
          scaleX: 0,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 70%", scrub: 1 },
        });
        gsap.set(".chapter-rail-fill", { scaleX: 1 });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="approach"
      aria-labelledby="approach-title"
      className="relative overflow-hidden bg-ink"
    >
      <div className="flex flex-col justify-center py-24 md:min-h-svh">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
          {/* Left column stays put while the chapters change beside it, so the
              section reads as one idea with three parts rather than three slides. */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="eyebrow">{approach.eyebrow}</p>
              <h2
                id="approach-title"
                className="display-md mt-6 font-display font-semibold text-ivory"
              >
                {approach.heading}
              </h2>
            </div>

            {/* Progress rails double as the chapter index. */}
            <ul className="flex gap-3" aria-hidden="true">
              {approach.chapters.map((chapter) => (
                <li key={chapter.index} className="h-px flex-1 bg-ink-hair">
                  <span className="chapter-rail-fill block h-full origin-left scale-x-0 bg-ember" />
                </li>
              ))}
            </ul>
          </div>

          {/* Chapters stack in one grid cell so they can cross-fade in place;
              in DOM order they still read top to bottom for assistive tech. */}
          {/* Below md the chapters are ordinary stacked blocks. From md up they
              share one grid cell so the timeline can cross-fade them in place. */}
          <div className="chapter-stack">
            {approach.chapters.map((chapter) => (
              <article
                key={chapter.index}
                data-reveal
                className="chapter"
              >
                <span
                  aria-hidden="true"
                  className="block font-display text-[5rem] font-semibold leading-none text-ember/40 sm:text-[7rem]"
                >
                  {chapter.index}
                </span>
                <h3 className="display-md mt-2 font-display font-semibold text-ivory">
                  {chapter.title}
                </h3>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory-dim sm:text-lg">
                  {chapter.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
