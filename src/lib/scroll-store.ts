/**
 * A tiny mutable store shared between the GSAP/ScrollTrigger world (which runs
 * on the main thread in response to scroll) and the react-three-fiber render
 * loop (which runs every frame). Deliberately not React state: this updates on
 * every scroll frame and must never trigger a re-render.
 */
export const scrollState = {
  /** 0 -> 1 across the hero's scroll range. */
  heroProgress: 0,
  /** 0 -> 1 across the whole document. */
  pageProgress: 0,
  /** Signed scroll velocity, normalised to roughly -1..1. */
  velocity: 0,
  /** Pointer position in normalised device coordinates (-1..1). */
  pointerX: 0,
  pointerY: 0,
};

export type ScrollState = typeof scrollState;
