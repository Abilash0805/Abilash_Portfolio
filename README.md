# Abilash V — Portfolio

A cinematic, scroll-driven portfolio. Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Framer Motion · Lenis · react-three-fiber.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Editing the content

**You should not need to touch a component to update the site.**

| What | Where |
|---|---|
| Name, roles, tagline, email, socials, nav | `src/content/site.ts` |
| Approach chapters, About copy, Contact copy | `src/content/site.ts` |
| Projects and full case studies | `src/content/work.ts` |

Case study pages are generated from `work.ts` — add an entry and `/work/<slug>` appears, with the project automatically in the work rail, the menu, and the next-project link.

### Before you publish

Two things in `src/content/` are placeholders:

- `site.email` — currently `hello@abilash.dev`.
- `outcome.metrics` on each project — these describe the work honestly but are not measured numbers. Replace them with real ones (visitors, clients, users, competition placements) as you get them. A real number beats a confident adjective.

## How the motion is built

Four libraries, each doing the thing it is actually best at rather than overlapping:

- **Lenis** — smooth scroll. Driven by GSAP's ticker with `lagSmoothing(0)`, so Lenis, ScrollTrigger and every pinned section share one clock and never drift a frame apart. Wired up in `src/components/providers/SmoothScroll.tsx`.
- **GSAP + ScrollTrigger** — everything driven *by scroll position*: the pinned Approach chapters, the horizontal work rail (`containerAnimation`, with `ease: "none"` as that pattern requires), the hero scrub, SplitText headline reveals, the preloader.
- **Framer Motion** — everything driven *by component state*: `AnimatePresence` for the menu sheet (GSAP would need the node kept mounted to animate it out), motion values and springs for the magnetic pointer pull, and a `layoutId` marker that GSAP hands the active panel index to in `WorkRail.tsx`.
- **react-three-fiber** — the hero form. A custom vertex-displacement shader over two octaves of simplex noise, with normals recomputed from the displaced surface and a fresnel rim measured against the *geometric* normal. (Measured against the displaced normal, every lump reads as a silhouette edge and the rim light floods the whole object.)

Design decisions were checked against the [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) design-system rules — the "Scroll-Triggered Storytelling" pattern, the one-to-two-pins-per-page limit, and its pre-delivery accessibility checklist.

## Reduced motion is a different layout, not a faster one

Under `prefers-reduced-motion: reduce` the site does not play shortened animations. It renders a different, complete layout:

- No WebGL canvas mounts at all; the hero falls back to its CSS composition.
- The work rail stacks vertically instead of becoming an unreachable horizontal row.
- The Approach chapters become three stacked blocks instead of sharing one grid cell.
- The hero drops the extra scrub height that only exists to drive the scrub.
- Lenis is not started; native scrolling handles it.

The same applies below `768px`, where pinning fights native scroll more than it earns.

Also in place: skip link as the first tab stop, visible focus rings, 44px+ targets, `Escape` closes the menu and the scroll lock always releases, and a palette where the smallest text tone clears 4.5:1 on the background.
