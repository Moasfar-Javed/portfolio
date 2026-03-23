export type NavItem = { id: string; label: string; href: string };

export const siteMeta = {
  name: "Moasfar Javed",
  shortTitle: "Moasfar J.",
  tagline: "Full Stack Software Engineer",
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
  badge: "Open to senior roles and freelance opportunities",
  headline: "Product-minded engineer building web and mobile experiences",
  subhead: "A polished experience from idea to launch",
  body: "Partnering up with teams and clients to ship software end-to-end and taking process ownership: from interaction design and app architecture to APIs, data models and production operations",
  ctas: [
    {
      label: "Connect",
      href: "#contact",
      variant: "primary" as const,
    },
    {
      label: "Upwork",
      href: "https://www.upwork.com/freelancers/~01fa3ea99074e483b6?mp_source=share",
      variant: "secondary" as const,
      external: true,
    },
    { label: "View work", href: "#work", variant: "ghost" as const },
  ],
};

export const metrics = [
  { value: "2023", label: "Building since" },
  { value: "15+", label: "Systems shipped" },
  { value: "10+", label: "Satisfied clients" },
  { value: "100%", label: "Job success rate" },
];

export const about = {
  title: "Full-stack execution with a strong product mindset",
  paragraphs: [
    "I'm a full stack engineer with a focus on mobile development. I build systems that bring value to the business and the user, staying equally comfortable in backend services, web platforms and cloud infrastructure.",
    "Since engineering is a passion of mine, I enjoy working across different environments. My experience spans startup products, freelance client builds and large cross-functional teams. I've shipped consumer apps, real-time systems, admin platforms, 3D scanning workflows, fintech features and cloud-backed solutions. I am always looking for new challenges and opportunities to grow.",
  ],
  highlights: [
    "Flutter & native-adjacent mobile",
    "APIs, services and cloud infrastructure",
    "Design systems & UI craft",
    "Shipping in agile + async teams",
    "Code reviews and knowledge sharing",
    "Team management and mentorship",
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
    name: "Albi",
    summary:
      "Restoration job management software transforming industry workflows and equipping field technicians with cutting-edge tech",
    role: "Full-Stack Engineer",
    outcome:
      "Helped accelerate mobile launch and built advanced features including floor plan sketching, LiDAR-powered 3D room scanning and check deposit workflows",
    tags: [
      "Flutter",
      "Swift",
      "Kotlin",
      "LiDAR",
      ".NET",
      "MS SQL",
      "Product Engineering",
      "Code Quality",
    ],
  },
  {
    name: "Real",
    summary:
      "Feature-rich dating app for iOS and Android with subscriptions, secure messaging, verification and admin tooling",
    role: "Full-stack engineer",
    outcome:
      "Delivered and deployed the mobile app, AWS-based backend, ML-assisted verification pipeline and internal CRM/moderation suite",
    tags: [
      "Flutter",
      "Node.js",
      "AWS",
      "Lambdas",
      "OAuth",
      "ML",
      "Scalable Live Messaging",
    ],
  },
  {
    name: "PlanetJ",
    summary:
      "High concurrency video game betting and live-streaming platform built for real-time interaction and secure transactions",
    role: "Technical lead",
    outcome:
      "Architected a live streaming and betting system with crypto wallet and Unity game build integration. Managed a team of developers and communicated with stakeholders",
    tags: [
      "React",
      ".NET",
      "PostgreSQL",
      "AWS",
      "WebSockets",
      "IVS Broadcast",
      "Blockchain",
      "Crypto",
    ],
  },
  {
    name: "TrainerJOE",
    summary:
      "Multi-platform fitness coaching ecosystem with web, presentation tooling, admin systems and cloud-hosted backend services.",
    role: "Full-stack engineer",
    outcome:
      "Built workout presentation tools, admin analytics and a customizable training instruction presentation platform",
    tags: [
      "React",
      "Flutter Web",
      ".NET",
      "MS SQL",
      "AWS",
      "Data Sync",
      "Performance Budgets",
    ],
  },
  {
    name: "Prints on Pendants",
    summary:
      "Cross-platform app for securely capturing and storing images, handwriting and fingerprints for custom jewelry workflows.",
    role: "Full-stack engineer",
    outcome:
      "Built the mobile app, ML-backed scanning pipeline and AWS microservices for secure biometric data processing.",
    tags: ["Flutter", "Node.js", "Model", "ML"],
  },
  {
    name: "WARRIOR Adventures",
    summary:
      "Team-based adventure platform featuring live location, navigation, real-time gameplay and coordinated backend.",
    role: "Mobile engineer",
    outcome:
      "Developed the Flutter app and Node.js backend services for live tracking, leaderboards and team coordination.",
    tags: ["Flutter", "Node.js", "Real-time", "Maps", "Mobile"],
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
    period: "Sep 2025 — Present",
    title: "Full Stack Mobile Engineer",
    org: "Albiware LLC",
    kind: "full-time",
    description:
      "Build and scale product features across mobile, backend, and web systems. Contributed to mobile launch velocity, advanced room tooling, LiDAR-based 3D scanning, check deposit workflows, backend architecture, testing, documentation and developer mentorship",
  },
  {
    period: "Jul 2024 — Jun 2025",
    title: "Flutter Developer",
    org: "Tech Hub",
    kind: "full-time",
    description:
      "Led end-to-end development of Rezerve from architecture to production, integrated external services and APIs, and maintained multiple legacy applications while shipping new features",
  },
  {
    period: "Sep 2023 — Jul 2024",
    title: "Junior Flutter Developer",
    org: "Tech Hub",
    kind: "full-time",
    description:
      "Delivered production-ready mobile apps including Primecar, Cookease and Silver Coin while collaborating closely with design, QA and stakeholders on large-scale app development",
  },
  {
    period: "Jul 2023 — Sep 2023",
    title: "Flutter Intern",
    org: "Tech Hub",
    kind: "contract",
    description:
      "Improved Flutter app stability and performance by resolving bugs, supporting maintenance work and helping scale codebases for better user experience and reliability",
  },
  {
    period: "",
    title: "Independent Freelance Engineer",
    org: "Upwork & Direct Clients",
    kind: "freelance",
    description:
      "Partner with startups and international clients to design, build and launch mobile apps, admin systems, cloud backends, real-time platforms and MVPs across industries including fitness, gaming, ecommerce, health and consumer products",
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Mobile",
    items: [
      "Flutter",
      "Swift",
      "Kotlin",
      "Local DB",
      "Push Notifications",
      "Camera",
      "Bluetooth",
      "SQLite",
    ],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      ".NET",
      "REST APIs",
      "WebSockets",
      "Authentication",
      "Data Sync",
      "Performance Budgets",
    ],
  },
  {
    title: "Data & infra",
    items: [
      "Cloudflare",
      "Docker",
      "MS Azure",
      "AWS",
      "Lambda",
      "Queues",
      "PostgreSQL",
      "MS SQL",
      "Fire/Supa base",
    ],
  },
  {
    title: "Tools & delivery",
    items: ["GitHub", "Gitlab", "Bitbucket", "Jira", "CI/CD", "AI Code Gen"],
  },
];

export const freelance = {
  title: "Freelance engineering for ambitious product teams",
  body: "I've partnered with founders, agencies and product leads on systems. Expect crisp communication, proactive ownership and code you can hand off without regret.",
  cta: {
    label: "View Upwork profile",
    href: "https://www.upwork.com/freelancers/~01fa3ea99074e483b6?mp_source=share",
  },
  bullets: [
    "End-to-end MVPs and production app delivery",
    "Mobile, backend and admin development",
    "Scalable systems and handoff-ready code",
  ],
};

export const testimonials = [
  {
    quote:
      "I can't recommend Moasfar enough. I required some software built and was able to provide a detailed scope which was quickly disseminated and understood without any further clarity needed.",
    name: "Dan Wolfe",
    role: "Founder, CBC",
  },
  {
    quote:
      "I really enjoyed working with Moasfar. He's a great person friendly, professional and an excellent problem solver. He played an essential role on my team and was a big part of getting the product to where it is today.",
    name: "Jill McFadden",
    role: "Founder, Real Dating",
  },
];

export const contact = {
  title: "Let's build something meaningful",
  subtitle:
    "Tell me about the product, the constraints and the timeline. I'll respond with a clear plan, not a generic pitch",
  email: "contact@moasfar.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Moasfar-Javed" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/moasfar-javed/" },
    {
      label: "PDF Resume",
      href: "https://drive.google.com/file/d/16nTja22B5EdeLdA04x8uV83q4PWj0dZd/view?usp=sharing",
    },
  ],
};
