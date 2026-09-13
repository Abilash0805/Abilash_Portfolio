"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { site } from "@/content/site";
import { ArrowDownIcon, socialIcons, type SocialIconName } from "@/components/icons";
import { useSmoothScrollTo } from "@/components/SmoothScroll";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const scrollTo = useSmoothScrollTo();

  const MotionSection = reduceMotion ? "div" : motion.div;
  const animation = reduceMotion
    ? {}
    : { variants: container, initial: "hidden", animate: "visible" };
  const childAnimation = reduceMotion ? {} : { variants: item };

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Decorative background wash -- purely presentational. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--accent-soft) 0%, transparent 70%)",
        }}
      />

      <MotionSection
        {...animation}
        className="mx-auto w-full max-w-6xl px-5 pt-28 pb-20 sm:px-8"
      >
        <motion.p
          {...childAnimation}
          className="font-mono text-xs uppercase tracking-[0.22em] text-accent"
        >
          {site.role} &middot; {site.location}
        </motion.p>

        <motion.h1
          {...childAnimation}
          id="hero-title"
          className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Hi, I&rsquo;m {site.name}. I build the web&rsquo;s
          <span className="text-accent"> quieter details</span>.
        </motion.h1>

        <motion.p
          {...childAnimation}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-muted"
        >
          {site.tagline}
        </motion.p>

        <motion.div {...childAnimation} className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo("#work")}
            className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
          >
            View my work
          </button>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-12 items-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
          >
            Email me
          </a>
        </motion.div>

        <motion.ul {...childAnimation} className="mt-12 flex items-center gap-2">
          {site.socials.map((social) => {
            const Icon = socialIcons[social.icon as SocialIconName];
            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="grid size-11 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon />
                </a>
              </li>
            );
          })}
        </motion.ul>
      </MotionSection>

      <button
        type="button"
        onClick={() => scrollTo("#about")}
        className="absolute inset-x-0 bottom-6 mx-auto grid size-11 place-items-center rounded-full text-muted transition-colors hover:text-foreground"
        aria-label="Scroll to About"
      >
        {reduceMotion ? (
          <ArrowDownIcon />
        ) : (
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDownIcon />
          </motion.span>
        )}
      </button>
    </section>
  );
}
