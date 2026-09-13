"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Project } from "@/content/work";
import { ArrowUpRightIcon } from "@/components/icons";
import { Magnetic } from "@/components/ui/Magnetic";

/**
 * The work index as a horizontal rail: vertical scroll drives the panels
 * sideways. The horizontal tween must use ease "none" or scroll position and
 * panel position stop agreeing.
 *
 * Under reduced motion no ScrollTrigger is built and the same panels lay out
 * as a normal vertical stack -- the markup is identical either way.
 */
export function WorkRail({ projects }: { projects: readonly Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // GSAP decides which panel is centred; Framer Motion moves the marker between
  // index labels with a layout animation. Each library does the half it is good
  // at, and the handoff is this one piece of state.
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      // Only worth doing where there is horizontal room to travel.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Panels tilt slightly as they cross the centre of the frame.
        const panels = gsap.utils.toArray<HTMLElement>(".work-panel");

        const markers = panels.map((panel, index) =>
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: tween,
            start: "left center",
            end: "right center",
            onToggle: (self) => {
              if (self.isActive) setActive(index);
            },
          }),
        );

        const panelTweens = panels.map((panel) =>
          gsap.fromTo(
            panel.querySelector(".work-panel-inner"),
            { rotateY: 7, scale: 0.96 },
            {
              rotateY: -7,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          ),
        );

        return () => {
          markers.forEach((m) => m.kill());
          panelTweens.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
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
      id="work"
      aria-labelledby="work-title"
      className="relative overflow-hidden bg-ink py-24 motion-safe:md:py-0"
    >
      <div className="flex flex-col justify-center motion-safe:md:min-h-svh">
        <div className="shell flex items-baseline justify-between gap-6 pb-10 md:pb-14">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2
              id="work-title"
              className="display-md mt-5 font-display font-semibold text-ivory"
            >
              Four things I built.
            </h2>
          </div>
          <ol className="hidden shrink-0 items-center gap-1 md:flex" aria-hidden="true">
            {projects.map((project, index) => (
              <li key={project.slug} className="relative px-3 py-1">
                {active === index && (
                  <motion.span
                    layoutId="rail-marker"
                    className="absolute inset-0 rounded-full border border-ember"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                )}
                <span
                  className={`relative text-xs tracking-[0.2em] transition-colors ${
                    active === index ? "text-ivory" : "text-ivory-faint"
                  }`}
                >
                  {project.index}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-5 motion-safe:md:w-max motion-safe:md:flex-row motion-safe:md:gap-10 motion-safe:md:px-[max(2.5vw,2rem)]"
          style={{ perspective: 1400 }}
        >
          {projects.map((project) => (
            <article
              key={project.slug}
              className="work-panel motion-safe:md:w-[min(78vw,46rem)] motion-safe:md:shrink-0"
            >
              <div className="work-panel-inner group relative flex h-full flex-col overflow-hidden rounded-sm border border-ink-hair bg-ink-raised">
                {/* Per-project colour field: the only "image" each panel needs. */}
                <div
                  aria-hidden="true"
                  className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/8]"
                  style={{
                    background: `radial-gradient(120% 120% at 18% 12%, ${project.palette[0]} 0%, ${project.palette[1]} 38%, #0b0b0f 78%)`,
                  }}
                >
                  {project.cover && (
                    <Image
                      src={project.cover}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 46rem, 100vw"
                      className="object-cover object-top"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(8,8,10,0.52) 0%, rgba(8,8,10,0.62) 45%, rgba(8,8,10,0.95) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.35) 1px, transparent 1px)",
                      backgroundSize: "48px 48px",
                    }}
                  />
                  <span className="absolute bottom-4 left-5 font-display text-[14vw] font-semibold leading-none text-ink/30 md:text-[7rem]">
                    {project.index}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">
                      {project.title}
                    </h3>
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-ivory-faint">
                      {project.year}
                    </span>
                  </div>

                  <p className="max-w-xl leading-relaxed text-ivory-dim">{project.kicker}</p>

                  <ul className="flex flex-wrap gap-2">
                    {project.discipline.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-ink-hair px-3 py-1 text-xs uppercase tracking-[0.14em] text-ivory-faint"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center gap-6 pt-2">
                    <Magnetic strength={0.22}>
                      <Link
                        href={`/work/${project.slug}`}
                        className="inline-flex min-h-11 items-center gap-2 text-sm uppercase tracking-[0.18em] text-ivory transition-colors hover:text-ember"
                      >
                        Read the case study
                        <ArrowUpRightIcon width={16} height={16} />
                      </Link>
                    </Magnetic>
                    {project.href && (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex min-h-11 items-center gap-2 text-sm text-ivory-faint transition-colors hover:text-ivory"
                      >
                        Live site
                        <ArrowUpRightIcon width={14} height={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
