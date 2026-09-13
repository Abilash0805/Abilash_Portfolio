"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Plugin registration happens once, at module scope, in a "use client" module.
 * Registering is side-effect free with respect to the DOM, so it is safe here;
 * every plugin *call* still happens inside useGSAP, i.e. client-side only.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Media query object used by every section to branch on motion preference. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";
