/**
 * Single source of truth for everything the portfolio renders.
 * Edit this file to update the site — no component changes needed.
 *
 * NOTE: the values below are placeholders scaffolded to give the layout
 * real shape. Replace them with Abilash's actual details.
 */

export const site = {
  name: "Abilash",
  role: "Full-Stack Engineer",
  tagline:
    "I design and build fast, accessible web products — from the data model to the last 8px of polish.",
  location: "India",
  email: "hello@example.com",
  resumeUrl: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/Abilash0805", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
    { label: "Email", href: "mailto:hello@example.com", icon: "mail" },
  ],
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export const about = {
  heading: "About",
  paragraphs: [
    "I'm a full-stack engineer who cares about the seams — the loading state, the empty state, the keyboard path through a form. Most of my work sits between a TypeScript frontend and the services behind it.",
    "Lately I've been building interface systems: design tokens, motion that carries meaning rather than decoration, and component libraries a team can actually extend without a rewrite.",
  ],
  stats: [
    { value: "3+", label: "Years building for the web" },
    { value: "20+", label: "Projects shipped" },
    { value: "100%", label: "Keyboard navigable" },
  ],
} as const;

export const skills = [
  {
    group: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion", "GSAP"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST", "GraphQL"],
  },
  {
    group: "Tooling",
    items: ["Git", "Docker", "Vitest", "Playwright", "CI/CD", "Vercel"],
  },
  {
    group: "Craft",
    items: ["Design systems", "Accessibility (WCAG)", "Performance budgets", "Motion design"],
  },
] as const;

export const projects = [
  {
    title: "Atlas Dashboard",
    year: "2025",
    summary:
      "An analytics console for a logistics team: virtualized tables over 50k rows, saved views, and a query builder that stays usable on a phone.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Recharts"],
    href: "#",
    repo: "#",
  },
  {
    title: "Ledger",
    year: "2024",
    summary:
      "A double-entry bookkeeping API with an audit trail you can actually read. Transactions are immutable; corrections are reversals, never edits.",
    stack: ["Node.js", "Prisma", "PostgreSQL", "Docker"],
    href: "#",
    repo: "#",
  },
  {
    title: "Motion Kit",
    year: "2024",
    summary:
      "A small animation primitives library — reveal, stagger, parallax — that degrades to nothing under prefers-reduced-motion instead of just running faster.",
    stack: ["React", "Framer Motion", "Lenis"],
    href: "#",
    repo: "#",
  },
  {
    title: "Fieldnote",
    year: "2023",
    summary:
      "Offline-first note capture for site inspections. Conflict resolution is last-write-wins per field, not per document, so two people can edit one form.",
    stack: ["React", "IndexedDB", "Service Workers"],
    href: "#",
    repo: "#",
  },
] as const;

export const experience = [
  {
    role: "Full-Stack Engineer",
    company: "Placeholder Co.",
    period: "2024 — Present",
    points: [
      "Led the migration of a legacy dashboard to Next.js App Router, cutting time-to-interactive roughly in half.",
      "Built the shared component library and design tokens now used across three internal products.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Placeholder Studio",
    period: "2022 — 2024",
    points: [
      "Shipped marketing and product surfaces for client teams, each with a Lighthouse budget enforced in CI.",
      "Introduced accessibility review to the definition of done; cleared a backlog of WCAG AA failures.",
    ],
  },
] as const;

export const contact = {
  heading: "Let's build something",
  body:
    "I'm open to full-time roles and selective freelance work. The fastest way to reach me is email — I read everything and reply within a day or two.",
} as const;
