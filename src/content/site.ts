/**
 * Profile + navigation. Single source of truth — edit here, not in components.
 */

export const site = {
  name: "Abilash V",
  shortName: "Abilash",
  roles: ["Developer", "Designer", "Builder", "Student"],
  tagline: "I turn ideas into digital products, brands, and creative experiences.",
  // TODO(abilash): swap in your real contact details before publishing.
  email: "hello@abilash.dev",
  location: "India",
  socials: [
    { label: "GitHub", href: "https://github.com/Abilash0805", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
    { label: "Email", href: "mailto:hello@abilash.dev", icon: "mail" },
  ],
} as const;

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Approach", href: "/#approach" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const approach = {
  eyebrow: "Approach",
  heading: "Build it, then make it mean something.",
  chapters: [
    {
      index: "I",
      title: "Start with the problem",
      body:
        "Every project here began as something that annoyed me or someone I know. A brand with nowhere to send clients. A study workflow spread across six apps. I build the thing that removes the friction.",
    },
    {
      index: "II",
      title: "Design and engineering are one job",
      body:
        "I do not hand a mockup to someone else. The identity, the interface and the code that ships are the same decision made three times, so they stay in sync.",
    },
    {
      index: "III",
      title: "Ship, then sharpen",
      body:
        "A live thing teaches you more than a perfect plan. I get to a working version early, put it in front of real users, and iterate on what they actually do.",
    },
  ],
} as const;

export const about = {
  eyebrow: "About",
  heading: "Student by day, builder the rest of the time.",
  paragraphs: [
    "I'm Abilash — a developer and designer who founded a digital services brand, builds educational tools, wires up microcontrollers for robotics competitions, and edits the video in between.",
    "The through-line is that I like making complete things. Not just the code, and not just the visuals — the brand, the product, the way it gets in front of people.",
  ],
  facts: [
    { label: "Based in", value: "India" },
    { label: "Currently", value: "Student · Founder of Orixen Digital" },
    { label: "Working in", value: "Web · Brand · Embedded · Motion" },
    { label: "Open to", value: "Internships · Freelance · Collaboration" },
  ],
} as const;

export const contact = {
  eyebrow: "Contact",
  heading: "Got something worth building?",
  body:
    "I'm open to internships, freelance work and collaborations — product, brand, or both. Tell me what you're making.",
} as const;
