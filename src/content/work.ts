/**
 * Work index + case studies.
 *
 * Each project carries a full case study: the challenge, the role, what was
 * built, the stack, the outcome, and the chapters that show the actual work.
 *
 * TODO(abilash): the `outcome.metrics` entries are the one place this file
 * guesses. Replace them with real numbers (visitors, clients, users, placements)
 * as soon as you have them — a real number beats a confident adjective.
 */

export type Chapter = {
  title: string;
  body: string;
  items?: readonly string[];
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  year: string;
  summary: string;
  discipline: readonly string[];
  href?: string;
  /** Two hues that drive the case study's gradient and the 3D scene tint. */
  palette: readonly [string, string];
  challenge: string;
  role: readonly string[];
  built: readonly string[];
  tools: readonly string[];
  outcome: { statement: string; metrics: readonly { value: string; label: string }[] };
  chapters: readonly Chapter[];
};

export const projects: readonly Project[] = [
  {
    slug: "orixen-digital",
    index: "01",
    title: "Orixen Digital",
    kicker: "A digital services brand I built from the ground up.",
    year: "2025",
    summary:
      "Founded a digital-services brand and built everything it needed to look credible on day one — identity, website, social presence, service structure and an outreach system.",
    discipline: ["Brand", "Web", "Business"],
    href: "https://orixendigital.vercel.app/",
    palette: ["#FF5C2B", "#FFB35C"],
    challenge:
      "Create a digital-services brand capable of presenting web development, design, content and technical services professionally — without the track record an established agency would lean on.",
    role: ["Founder", "Developer", "Designer"],
    built: [
      "Brand identity",
      "Website",
      "Social media presence",
      "Service structure",
      "Marketing creatives",
      "Outreach system",
    ],
    tools: ["HTML", "CSS", "JavaScript", "Vercel", "Figma", "Canva", "AI tools"],
    outcome: {
      statement:
        "A complete digital-services brand with its own identity, online presence and service offering — shipped, live, and able to take a client from first contact to delivery.",
      metrics: [
        { value: "6", label: "Service lines defined" },
        { value: "1", label: "Brand built end to end" },
        { value: "Live", label: "Deployed on Vercel" },
      ],
    },
    chapters: [
      {
        title: "Brand",
        body:
          "The identity had to read as a real company, not a student side project. I set a wordmark, a restrained palette and a type system tight enough that every creative after it stayed consistent without a style guide nobody would read.",
        items: ["Wordmark and logo system", "Palette and type scale", "Creative templates"],
      },
      {
        title: "Website",
        body:
          "A hand-built site rather than a template, so the service structure and the copy could be argued over rather than filled in. Deployed on Vercel so updates ship the moment they are written.",
        items: ["Hand-written HTML, CSS and JavaScript", "Service architecture", "Deployed on Vercel"],
      },
      {
        title: "Social media",
        body:
          "The brand needed somewhere to exist between client conversations. I built a repeatable creative system — post templates, tone, cadence — so publishing did not require a design decision every time.",
        items: ["Post template system", "Creative direction", "Publishing cadence"],
      },
      {
        title: "Client work",
        body:
          "Services span web development, design, content, QR menu solutions and automation concepts. Outreach runs on a structured system rather than hoping the right people find the site.",
        items: ["Digital services", "QR menu solutions", "Automation concepts", "Client outreach"],
      },
    ],
  },
  {
    slug: "studydesk",
    index: "02",
    title: "StudyDesk & Study Vault",
    kicker: "An educational productivity platform for students who are drowning in tabs.",
    year: "2025",
    summary:
      "A student dashboard with AI assistance, authentication and Firebase sync — built to pull a scattered study workflow into one place that actually holds state.",
    discipline: ["Product", "Web App", "AI"],
    palette: ["#3F5BC4", "#6FA8C8"],
    challenge:
      "Studying happens across a dozen tools that do not talk to each other — notes here, deadlines there, resources somewhere else. The challenge was a single surface that stays in sync across devices without becoming another thing to maintain.",
    role: ["Developer", "Product designer"],
    built: [
      "Student dashboard",
      "AI integration",
      "Authentication",
      "Firebase synchronization",
      "Web application",
      "Product and UI thinking",
    ],
    tools: ["JavaScript", "Firebase", "Authentication", "AI APIs", "Web app architecture"],
    outcome: {
      statement:
        "A working platform where a student's material, deadlines and AI assistance live behind one login and stay in sync wherever they open it.",
      metrics: [
        { value: "2", label: "Products in one system" },
        { value: "Real-time", label: "Cross-device sync" },
        { value: "Auth", label: "Per-student accounts" },
      ],
    },
    chapters: [
      {
        title: "The dashboard",
        body:
          "One surface for everything a study session needs. The layout is built around what a student opens first, not around the data model underneath it.",
        items: ["Session-first layout", "Deadline and resource views", "Responsive by default"],
      },
      {
        title: "Study Vault",
        body:
          "Storage that survives the semester. Material goes in once and is retrievable later, rather than living in a downloads folder nobody revisits.",
        items: ["Structured material storage", "Retrieval and organisation"],
      },
      {
        title: "AI integration",
        body:
          "AI assistance positioned as a study aid inside the workflow — available where the material already is, instead of a separate chat window to copy and paste into.",
        items: ["In-context assistance", "Study-oriented prompting"],
      },
      {
        title: "Accounts and sync",
        body:
          "Authentication and Firebase synchronisation so a student's work follows them between phone and laptop without an export step.",
        items: ["Authentication", "Firebase real-time sync", "Per-user data isolation"],
      },
    ],
  },
  {
    slug: "robotics",
    index: "03",
    title: "Robotics Projects",
    kicker: "Building and experimenting with embedded systems.",
    year: "2023 — 2025",
    summary:
      "Arduino, ESP32 and NodeMCU builds — sensor rigs, competition robots, and the debugging that happens when the code is right and the wiring is not.",
    discipline: ["Embedded", "Hardware", "Competition"],
    palette: ["#2E8B6B", "#86A83C"],
    challenge:
      "Software fails politely. Hardware does not — a loose ground line looks exactly like a logic bug. These builds are where I learned to isolate a problem across two domains at once, under a competition clock.",
    role: ["Builder", "Embedded developer"],
    built: [
      "Arduino builds",
      "ESP32 projects",
      "NodeMCU projects",
      "Sensor integration",
      "Robotics competition builds",
    ],
    tools: ["Arduino", "ESP32", "NodeMCU", "C/C++", "Sensors", "Serial debugging"],
    outcome: {
      statement:
        "A working understanding of the full path from sensor reading to actuator response — and the habit of testing the physical layer before blaming the code.",
      metrics: [
        { value: "3", label: "Microcontroller platforms" },
        { value: "Multiple", label: "Competition builds" },
        { value: "Sensors", label: "Input to actuator, end to end" },
      ],
    },
    chapters: [
      {
        title: "Platforms",
        body:
          "Arduino for tight, deterministic control. ESP32 and NodeMCU when the build needs to get on a network. Choosing between them is the first real design decision of any rig.",
        items: ["Arduino", "ESP32", "NodeMCU"],
      },
      {
        title: "Sensing",
        body:
          "Reading the physical world reliably — debouncing, calibration, and accepting that a sensor's datasheet describes its best day, not its average one.",
        items: ["Sensor integration", "Calibration", "Signal debouncing"],
      },
      {
        title: "Competition builds",
        body:
          "Robots built to a spec and a deadline, where the constraint is not what is possible but what can be made reliable before the round starts.",
        items: ["Competition rigs", "Build under time constraint", "Field debugging"],
      },
    ],
  },
  {
    slug: "creative",
    index: "04",
    title: "Creative Work",
    kicker: "A collection of branding, graphics and video projects.",
    year: "2022 — 2025",
    summary:
      "Logos, posters, social creatives, video edits and digital campaigns — the visual work that runs alongside everything else I build.",
    discipline: ["Brand", "Graphics", "Motion"],
    palette: ["#7A4FB5", "#C4568F"],
    challenge:
      "Most of my technical projects needed visual identity before they needed users. Rather than outsource it, the creative work became its own practice — and the reason my products do not look like unstyled demos.",
    role: ["Designer", "Editor"],
    built: [
      "Logos",
      "Posters",
      "Social media creatives",
      "Video edits",
      "Digital campaigns",
      "Visual identities",
    ],
    tools: ["Figma", "Canva", "Video editing", "Motion graphics", "AI tools"],
    outcome: {
      statement:
        "A body of visual work that gives every product I build an identity from day one, and a second discipline I can offer clients on its own.",
      metrics: [
        { value: "6", label: "Creative disciplines" },
        { value: "Multi-brand", label: "Identities delivered" },
        { value: "Video", label: "Edit and motion capability" },
      ],
    },
    chapters: [
      {
        title: "Identity",
        body:
          "Logos and visual identities — the smallest complete statement a brand can make. Most of these exist because a project of mine needed one.",
        items: ["Logos", "Visual identities", "Brand systems"],
      },
      {
        title: "Graphics",
        body:
          "Posters and social creatives built on templates tight enough to stay consistent across a campaign, loose enough to stay interesting.",
        items: ["Posters", "Social media creatives", "Campaign systems"],
      },
      {
        title: "Motion",
        body:
          "Video edits and digital campaigns. Motion is where a brand stops being a static logo and starts having a tempo.",
        items: ["Video edits", "Digital campaigns", "Motion graphics"],
      },
    ],
  },
] as const;

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
