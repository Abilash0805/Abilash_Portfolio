"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import { scrollState } from "@/lib/scroll-store";
import { useSmoothScrollTo } from "@/components/providers/SmoothScroll";
import { Magnetic } from "@/components/ui/Magnetic";

// WebGL never runs on the server, and its bundle should not sit in the
// critical path either.
const Scene = dynamic(() => import("@/components/three/Scene").then((m) => m.Scene), {
  ssr: false,
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTo = useSmoothScrollTo();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Feed the 3D scene regardless of motion preference -- with reduced
      // motion the Canvas never mounts, so this simply goes unread.
      const progress = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollState.heroProgress = self.progress;
        },
      });

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Entrance, timed to land as the preloader curtain lifts.
        gsap.from(".hero-line", {
          yPercent: 115,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08,
          delay: 2.15,
        });
        gsap.from(".hero-meta", {
          y: 24,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          delay: 2.5,
        });

        // The type recedes as the object takes the frame.
        tl.to(".hero-type", { yPercent: -18, opacity: 0, ease: "none" }, 0)
          .to(".hero-cue", { opacity: 0, duration: 0.2, ease: "none" }, 0)
          .to(".hero-vignette", { opacity: 1, ease: "none" }, 0);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => {
        progress.kill();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="top" className="relative h-svh motion-safe:h-[180svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-between overflow-hidden">
        {/* CSS composition that stands in for the WebGL layer when there is no
            GPU, or when the visitor asked for reduced motion. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(52% 42% at 50% 46%, rgba(255,92,43,0.22) 0%, rgba(110,127,243,0.10) 42%, transparent 72%)",
          }}
        />

        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Scene />
        </div>

        <div
          aria-hidden="true"
          className="hero-vignette pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 50%, transparent 30%, rgba(8,8,10,0.85) 100%)",
          }}
        />

        <div className="shell hero-type relative flex flex-1 flex-col justify-end pb-[7vh] pt-28">
          <p className="hero-meta eyebrow mb-6 sm:mb-8">
            {site.roles.join(" · ")}
          </p>

          <h1 className="display-xl font-display font-semibold uppercase leading-[0.85] text-ivory">
            <span className="line-mask">
              <span className="hero-line block">
                Abilash <span className="text-ember">V</span>
              </span>
            </span>
          </h1>

          <div className="hero-meta mt-8 flex flex-col gap-6 border-t border-ink-hair pt-6 sm:mt-12 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-base leading-relaxed text-ivory-dim sm:text-lg">
              {site.tagline}
            </p>

            <Magnetic strength={0.3}>
              <button
                type="button"
                onClick={() => scrollTo("#work")}
                className="group flex min-h-12 shrink-0 items-center gap-4 text-sm uppercase tracking-[0.2em] text-ivory"
              >
                Selected work
                <span className="relative block h-px w-14 bg-ivory-faint">
                  <span className="absolute inset-y-0 left-0 w-0 bg-ember transition-[width] duration-500 group-hover:w-full" />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="hero-cue shell pb-6">
          <div className="flex items-center justify-between text-[0.6875rem] uppercase tracking-[0.28em] text-ivory-faint">
            <span>Scroll</span>
            <span>{site.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
