"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { Project } from "@/content/work";

/**
 * The actual work, in sequence. Each chapter's number pins alongside its copy
 * on wide screens, so the chapter you are reading is always labelled.
 */
export function CaseChapters({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>(".case-chapter");

        const tweens = rows.map((row) =>
          gsap.from(row.querySelectorAll(".case-chapter-part"), {
            y: 34,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: row, start: "top 82%", once: true },
          }),
        );

        return () => {
          tweens.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="chapters-title"
      className="border-t border-ink-hair bg-ink"
    >
      <div className="shell py-24 sm:py-32">
        <p className="eyebrow">The work</p>
        <h2
          id="chapters-title"
          className="display-md mt-6 font-display font-semibold text-ivory"
        >
          {project.chapters.map((c) => c.title).join(" → ")}
        </h2>

        <ol className="mt-16 flex flex-col">
          {project.chapters.map((chapter, index) => (
            <li
              key={chapter.title}
              data-reveal
              className="case-chapter grid gap-6 border-t border-ink-hair py-12 lg:grid-cols-[8rem_1fr_1fr] lg:gap-14"
            >
              <span className="case-chapter-part font-display text-sm uppercase tracking-[0.2em] text-ivory-faint">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="case-chapter-part display-md font-display font-semibold text-ivory lg:text-[2.25rem]">
                {chapter.title}
              </h3>

              <div className="case-chapter-part">
                <p className="text-lg leading-relaxed text-ivory-dim">{chapter.body}</p>
                {chapter.items && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {chapter.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-ink-raised px-3 py-1.5 text-sm text-ivory-faint"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
