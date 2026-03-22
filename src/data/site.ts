export type NavItem = { id: string; label: string; href: string };

export const siteMeta = {
  name: "Moasfar J.",
  shortTitle: "Moasfar J.",
  tagline: "Full-stack · Flutter-forward",
};

export const navItems: NavItem[] = [
  { id: "hero", label: "Intro", href: "#hero" },
  { id: "impact", label: "Impact", href: "#impact" },
  { id: "about", label: "About", href: "#about" },
  { id: "work", label: "Work", href: "#work" },
  { id: "journey", label: "Journey", href: "#journey" },
  { id: "stack", label: "Stack", href: "#stack" },
  { id: "freelance", label: "Clients", href: "#freelance" },
  { id: "contact", label: "Contact", href: "#contact" },
];

/** Full page order for the side git-scroll rail (includes sections not in main nav). */
export const scrollTreeItems: NavItem[] = [
  ...navItems.slice(0, -1),
  { id: "testimonials", label: "Proof", href: "#testimonials" },
  navItems[navItems.length - 1]!,
];

/** Sections drawn on the left git graph (starts below hero). */
export const graphTreeItems: NavItem[] = scrollTreeItems.filter(
  (item) => item.id !== "hero",
);

/**
 * Git-rail branch strokes: two ramps tuned to each theme’s surfaces (see `index.css`
 * `--surface-*`). Light = pale blue-gray (high luminance, close to `#fafafa` / cards)
 * so the rail whispers against the page. Dark mode ramp unchanged below. Wide steps
 * so branches stay distinguishable.
 */
export const scrollBranchColorsLight: string[] = [
  "#a5afbe",
  "#acb5c4",
  "#b3bbca",
  "#bac1d0",
  "#c1c7d6",
  "#c8cddc",
  "#cfd3e2",
  "#d6d9e8",
  "#dde0ee",
];

export const scrollBranchColorsDark: string[] = [
  "#7d92ab",
  "#70859e",
  "#637891",
  "#566b84",
  "#495e77",
  "#3c516a",
  "#2f445d",
  "#243650",
  "#192843",
];

export const hero = {
  badge: "Available for freelance · Open to senior roles",
  headline: "Product-minded engineer building mobile-first experiences.",
  subhead:
    "Full-stack developer with a mobile tilt—Flutter, resilient backends, and interfaces that feel inevitable.",
  body: "I partner with teams and clients to ship polished software end-to-end: from interaction design and app architecture to APIs, data models, and production operations.",
  ctas: [
    { label: "View work", href: "#work", variant: "primary" as const },
    { label: "Contact", href: "#contact", variant: "secondary" as const },
    {
      label: "Upwork",
      href: "https://www.upwork.com/freelancers/~placeholder",
      variant: "ghost" as const,
      external: true,
    },
  ],
};

export const metrics = [
  { value: "8+", label: "Years shipping software" },
  { value: "24", label: "Products & apps delivered" },
  { value: "12", label: "Freelance engagements" },
  { value: "99.2%", label: "Uptime on flagship systems" },
];

export const about = {
  title: "Engineering with product intuition",
  paragraphs: [
    "I’m a full-stack developer who spends meaningful time in mobile—especially Flutter—where performance, gestures, and platform fidelity matter. I care as much about how software feels as how it scales.",
    "On the backend, I design APIs and services that stay boring under load: clear contracts, observability, and pragmatic data modeling. I’ve led features across greenfield builds, legacy modernization, and client engagements.",
  ],
  highlights: [
    "Flutter & native-adjacent mobile",
    "APIs, services, and cloud infra",
    "Design systems & UI craft",
    "Shipping in agile + async teams",
  ],
};

export type Project = {
  name: string;
  summary: string;
  role: string;
  outcome: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    name: "Northline Commerce",
    summary:
      "Composable retail stack with a Flutter client and event-driven services.",
    role: "Lead engineer",
    outcome: "Cut checkout latency 38% and unified catalog across channels.",
    tags: ["Flutter", "Go", "PostgreSQL", "Kafka"],
  },
  {
    name: "Pulse Health Companion",
    summary:
      "HIPAA-aware companion app with offline-first sync and clinician dashboards.",
    role: "Full-stack contractor",
    outcome: "Shipped MVP in 11 weeks with 4.8★ pilot cohort rating.",
    tags: ["Flutter", "Node", "Redis", "AWS"],
  },
  {
    name: "Atlas Field Ops",
    summary:
      "Operations platform for distributed teams—mobile capture, web command center.",
    role: "Product engineer",
    outcome: "Replaced three tools; ~120h/month saved in reporting workflows.",
    tags: ["React", "Dart", "gRPC", "Terraform"],
  },
];

export type ExperienceItem = {
  period: string;
  title: string;
  org: string;
  kind: "full-time" | "contract" | "freelance";
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    period: "2023 — Present",
    title: "Senior Product Engineer",
    org: "Lumen Apps Studio",
    kind: "full-time",
    description:
      "Own mobile surfaces in Flutter, partner on API design, and mentor on performance budgets and release hygiene.",
  },
  {
    period: "2021 — 2023",
    title: "Full-stack Engineer (Contract)",
    org: "Northline Labs",
    kind: "contract",
    description:
      "Built retailer-facing SDKs, hardened payment flows, and introduced tracing across critical services.",
  },
  {
    period: "2019 — Present",
    title: "Independent Consultant",
    org: "Freelance / Upwork",
    kind: "freelance",
    description:
      "Embedded with startups and product teams—discovery workshops, scoped MVPs, and long-term retainers.",
  },
  {
    period: "2017 — 2021",
    title: "Mobile & Backend Engineer",
    org: "Riverstack",
    kind: "full-time",
    description:
      "Shipped consumer apps end-to-end; established CI/CD, feature flags, and crash analytics baselines.",
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Mobile",
    items: [
      "Flutter",
      "Dart",
      "iOS awareness",
      "Android tooling",
      "App Store flow",
    ],
  },
  {
    title: "Frontend",
    items: ["React", "TypeScript", "Next.js", "Design tokens", "Motion & a11y"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Go", "REST & gRPC", "AuthN/Z", "Background jobs"],
  },
  {
    title: "Data & infra",
    items: ["PostgreSQL", "Redis", "Docker", "AWS & GCP basics", "Terraform"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub Actions", "Figma", "Linear", "Observability stacks"],
  },
];

export const freelance = {
  title: "Trusted on Upwork and direct engagements",
  body: "I’ve partnered with founders, agencies, and product leads on scoped builds and ongoing retainers. Expect crisp communication, proactive ownership, and code you can hand off without regret.",
  cta: {
    label: "View Upwork profile",
    href: "https://www.upwork.com/freelancers/~placeholder",
  },
  bullets: [
    "Fixed-scope MVPs and phased roadmaps",
    "Code reviews, audits, and performance passes",
    "Documentation that survives the handoff",
  ],
};

export const testimonials = [
  {
    quote:
      "Shipped faster than our internal team thought possible—without sacrificing polish. Communication was surgical.",
    name: "Elena M.",
    role: "Product lead, B2B SaaS",
  },
  {
    quote:
      "The rare engineer who sketches the UX implication before writing the endpoint. Our Flutter app finally feels native.",
    name: "Jordan K.",
    role: "Founder, health startup",
  },
];

export const contact = {
  title: "Let’s build something refined.",
  subtitle:
    "Tell me about the product, the constraints, and the timeline. I’ll respond with a clear plan—not a generic pitch.",
  email: "hello@yourdomain.com",
  socials: [
    { label: "GitHub", href: "https://github.com/placeholder" },
    { label: "LinkedIn", href: "https://linkedin.com/in/placeholder" },
    {
      label: "Upwork",
      href: "https://www.upwork.com/freelancers/~placeholder",
    },
  ],
};
