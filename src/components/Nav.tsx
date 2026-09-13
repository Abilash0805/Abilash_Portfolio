"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/content/site";
import { projects } from "@/content/work";
import { Magnetic } from "@/components/ui/Magnetic";

/**
 * Division of labour, deliberately:
 *  - GSAP drives the scroll-reactive header (a continuous response to scroll).
 *  - Framer Motion drives the menu, because mount/unmount of a component that
 *    is conditionally rendered is exactly what AnimatePresence exists for --
 *    GSAP would need the node kept in the tree to animate it out.
 */

const sheet: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], staggerChildren: 0.06, delayChildren: 0.25 },
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], when: "afterChildren" },
  },
};

const sheetItem: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  exit: { y: "110%", transition: { duration: 0.3 } },
};

export function Nav() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  // Hide going down, return coming up.
  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let last = window.scrollY;
        const onScroll = () => {
          if (open) return;
          const y = window.scrollY;
          gsap.to(header, {
            yPercent: y > last && y > 160 ? -130 : 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true,
          });
          last = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
          window.removeEventListener("scroll", onScroll);
          gsap.set(header, { yPercent: 0 });
        };
      });

      return () => mm.revert();
    },
    { scope: headerRef, dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const html = document.documentElement;
    html.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-[80] mix-blend-difference">
        <div className="shell flex h-20 items-center justify-between">
          <Link
            href="/"
            className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ivory"
          >
            {site.shortName}
            <span className="text-ember">.</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <Magnetic key={item.href} strength={0.28}>
                <Link
                  href={item.href}
                  className="group relative block py-2 text-sm text-ivory transition-opacity hover:opacity-80"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-ivory transition-[width] duration-300 group-hover:w-full" />
                </Link>
              </Magnetic>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-overlay"
            className="flex min-h-11 items-center gap-3 text-sm uppercase tracking-[0.2em] text-ivory md:hidden"
          >
            Menu
            <span className="flex flex-col gap-1">
              <span className="block h-px w-6 bg-ivory" />
              <span className="block h-px w-6 bg-ivory" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-overlay"
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            variants={sheet}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit={reduceMotion ? { opacity: 0 } : "exit"}
            className="fixed inset-0 z-[85] flex flex-col justify-between bg-ink px-6 py-6 sm:px-10 sm:py-8"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow">Menu</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center gap-3 text-sm uppercase tracking-[0.2em] text-ivory"
              >
                Close
                <span className="relative block size-4">
                  <span className="absolute inset-x-0 top-1/2 block h-px rotate-45 bg-ivory" />
                  <span className="absolute inset-x-0 top-1/2 block h-px -rotate-45 bg-ivory" />
                </span>
              </button>
            </div>

            <nav aria-label="Menu">
              <ul className="flex flex-col gap-1">
                {nav.map((item) => (
                  <li key={item.href} className="line-mask">
                    <motion.span variants={reduceMotion ? undefined : sheetItem} className="block">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block font-display display-lg font-semibold text-ivory transition-colors hover:text-ember"
                      >
                        {item.label}
                      </Link>
                    </motion.span>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hairline pt-5">
              <p className="eyebrow mb-3">Selected work</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/work/${project.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm text-ivory-dim transition-colors hover:text-ivory"
                    >
                      <span className="text-ivory-faint">{project.index}</span> {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
