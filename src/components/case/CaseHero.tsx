"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { Project } from "@/content/work";

/**
 * Case study title card. The colour field behind the type is built from the
 * project's own palette and drifts on scroll -- parallax, but only where the
 * visitor has not asked for stillness.
 */
export function CaseHero({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline();
        tl.from(".case-line", {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
        }).from(
          ".case-meta",
          { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 },
          "-=0.7",
        );

        const drift = gsap.to(".case-field", {
          yPercent: 22,
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        return () => {
          tl.kill();
          drift.scrollTrigger?.kill();
          drift.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div aria-hidden="true" className="case-field absolute inset-0 -z-10">
        {project.cover && (
          <>
            <Image
              src={project.cover}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-top opacity-40"
            />
            {/* The page has to stay legible over whatever the screenshot is
                doing, so the image sits under a heavy scrim rather than
                dictating the contrast of the type above it. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.8) 55%, rgb(8,8,10) 100%)",
              }}
            />
          </>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(85% 70% at 20% 0%, ${project.palette[0]}55 0%, ${project.palette[1]}22 40%, transparent 72%)`,
          }}
        />
      </div>

      <div className="shell flex min-h-[86svh] flex-col justify-end pb-16 pt-40">
        <Link
          href="/#work"
          className="case-meta eyebrow mb-10 inline-flex w-fit items-center gap-2 hover:text-ivory"
        >
          ← All work
        </Link>

        <p className="case-meta eyebrow mb-6">
          {project.index} · {project.year}
        </p>

        <h1 className="display-xl font-display font-semibold uppercase leading-[0.85] text-ivory">
          {project.title.split(" ").map((word, index) => (
            <span key={`${word}-${index}`} className="line-mask">
              <span className="case-line block">{word}</span>
            </span>
          ))}
        </h1>

        <div className="case-meta mt-10 flex flex-col gap-6 border-t border-ink-hair pt-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-lg leading-relaxed text-ivory-dim">{project.summary}</p>
          <ul className="flex shrink-0 flex-wrap gap-2">
            {project.discipline.map((item) => (
              <li
                key={item}
                className="rounded-full border border-ink-hair px-3 py-1 text-xs uppercase tracking-[0.14em] text-ivory-faint"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
