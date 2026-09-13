"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Magnetic pointer attraction, built on Framer Motion's motion values.
 *
 * This is the one thing a spring-based value graph does better than a timeline:
 * the target moves continuously with the pointer and the spring resolves it
 * every frame, with no tween to restart. GSAP owns the scroll timelines on this
 * site; Framer Motion owns interaction state like this.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 18, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // The inner content trails the outer shell slightly -- that lag is what makes
  // the pull read as weight rather than as a jump.
  const innerX = useTransform(springX, (value) => value * 0.45);
  const innerY = useTransform(springY, (value) => value * 0.45);

  // The element tree is identical whether or not motion is allowed -- only the
  // handlers are dropped. Branching on the tag here instead would change what
  // the client renders on its first pass and break hydration, since the server
  // has no media query to read.
  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={{ x: springX, y: springY }}
      onPointerMove={
        reduceMotion
          ? undefined
          : (event) => {
              const el = ref.current;
              if (!el || event.pointerType !== "mouse") return;
              const rect = el.getBoundingClientRect();
              x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
              y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
            }
      }
      onPointerLeave={
        reduceMotion
          ? undefined
          : () => {
              x.set(0);
              y.set(0);
            }
      }
    >
      <motion.span className="inline-block" style={{ x: innerX, y: innerY }}>
        {children}
      </motion.span>
    </motion.span>
  );
}
