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

export type ProjectScreenshot = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  role: string;
  outcome: string;
  tags: string[];
  /** Brand color shown behind images when aspect ratio does not fill the frame */
  primaryColor: string;
  heroImage: ProjectScreenshot;
  screenshots: ProjectScreenshot[];
};

export const projects: Project[] = [
  {
    slug: "albi",
    name: "Albi",
    primaryColor: "#2563eb",
    summary:
      "Restoration job management software transforming industry workflows and equipping field technicians with cutting-edge tech",
    description:
      "Albi is restoration job management software used by contractors and field technicians to run jobs end-to-end—from intake and documentation through billing and closeout. I work across the mobile apps and backend, shipping features that replace paper-heavy workflows with reliable, offline-capable tooling in the field.\n\nOn mobile I helped accelerate launch velocity and owned advanced capabilities including interactive floor plan sketching, LiDAR-powered 3D room scanning for accurate scope capture, and check deposit workflows tied into backend services. On the server side I contributed to API design, data modeling in MS SQL, and code quality practices including testing, documentation and mentorship for the wider engineering team.",
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
    heroImage: {
      src: "/assets/projects/albi/hero.png",
      alt: "Albi restoration job management platform",
    },
    screenshots: [
      ...Array.from({ length: 10 }, (_, i) => ({
        src: `/assets/projects/albi/phone${i + 1}.png`,
        alt: `Albi mobile app screenshot ${i + 1}`,
      })),
    ],
  },
  {
    slug: "real",
    name: "Real",
    primaryColor: "#093A40",
    summary:
      "Feature-rich dating app for iOS and Android with subscriptions, secure messaging, verification and admin tooling",
    description:
      "Real is a feature-rich dating platform for iOS and Android built around trust, safety and a polished consumer experience. The product spans native mobile clients, a scalable AWS backend, real-time messaging, subscription billing and internal tooling for moderation and support.\n\nI delivered and deployed the full stack: Flutter mobile apps, Node.js and Lambda services, OAuth flows, and an ML-assisted verification pipeline to reduce fraud and improve match quality. I also built the internal CRM and moderation suite that lets the operations team review profiles, handle reports and keep the community healthy at scale.",
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
    heroImage: {
      src: "/assets/projects/real/hero.png",
      alt: "Real dating app on iOS and Android",
    },
    screenshots: [
      ...Array.from({ length: 7 }, (_, i) => ({
        src: `/assets/projects/real/phone${i + 1}.png`,
        alt: `Real mobile app screenshot ${i + 1}`,
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        src: `/assets/projects/real/admin${i + 1}.png`,
        alt: `Real admin dashboard screenshot ${i + 1}`,
      })),
    ],
  },
  {
    slug: "planetj",
    name: "PlanetJ",
    primaryColor: "#FD8803",
    summary:
      "High concurrency video game betting and live-streaming platform built for real-time interaction and secure transactions",
    description:
      "PlanetJ is a high-concurrency platform where viewers watch live gameplay, place bets in real time and interact through WebSockets-backed experiences. The system integrates Unity game builds, crypto wallet flows and IVS live broadcast infrastructure on AWS.\n\nAs technical lead I architected the streaming and betting pipeline, designed PostgreSQL schemas for transactional integrity under load, and managed a team of developers while keeping stakeholders aligned on milestones. The React front end and .NET services were tuned for low-latency updates, secure wallet operations and reliable session handling during peak events.",
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
    heroImage: {
      src: "/assets/projects/planetj/hero.png",
      alt: "PlanetJ live streaming and betting platform",
    },
    screenshots: [
      ...Array.from({ length: 2 }, (_, i) => ({
        src: `/assets/projects/planetj/game${i + 1}.png`,
        alt: `PlanetJ live game screenshot ${i + 1}`,
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        src: `/assets/projects/planetj/web${i + 1}.png`,
        alt: `PlanetJ web platform screenshot ${i + 1}`,
      })),
      {
        src: "/assets/projects/planetj/admin1.png",
        alt: "PlanetJ admin dashboard screenshot",
      },
    ],
  },
  {
    slug: "trainerjoe",
    name: "TrainerJOE",
    primaryColor: "#02897B",
    summary:
      "Multi-platform fitness coaching ecosystem with web, presentation tooling, admin systems and cloud-hosted backend services.",
    description:
      "TrainerJOE is a multi-platform fitness coaching ecosystem spanning web apps, presentation tooling for trainers, admin analytics and cloud-hosted backend services. Coaches use it to build programs, run sessions and track client progress; admins rely on dashboards for operations and content management.\n\nI built workout presentation tools that trainers use live with clients, admin analytics for business insights, and a customizable training instruction presentation platform on React and Flutter Web. Backend work on .NET and MS SQL focused on data sync, performance budgets and reliable AWS deployments.",
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
    heroImage: {
      src: "/assets/projects/trainerjoe/hero.png",
      alt: "TrainerJOE fitness coaching platform",
    },
    screenshots: [
      ...Array.from({ length: 7 }, (_, i) => ({
        src: `/assets/projects/trainerjoe/web${i + 1}.png`,
        alt: `TrainerJOE web platform screenshot ${i + 1}`,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        src: `/assets/projects/trainerjoe/admin${i + 1}.png`,
        alt: `TrainerJOE admin dashboard screenshot ${i + 1}`,
      })),
    ],
  },
  {
    slug: "prints-on-pendants",
    name: "Prints on Pendants",
    primaryColor: "#111111",
    summary:
      "Cross-platform app for securely capturing and storing images, handwriting and fingerprints for custom jewelry workflows.",
    description:
      "Prints on Pendants is a cross-platform app for jewelers and customers to securely capture images, handwriting samples and fingerprints that are engraved into custom jewelry. Privacy and accuracy are central—the app guides users through capture, validates quality with ML, and stores sensitive biometric data behind strict access controls.\n\nI built the Flutter mobile experience, an ML-backed scanning pipeline for reliable captures, and AWS microservices that process, store and route orders without exposing raw biometric data unnecessarily. The workflow connects mobile capture to fulfillment systems so each piece ships with the customer's exact imprint.",
    role: "Full-stack engineer",
    outcome:
      "Built the mobile app, ML-backed scanning pipeline and AWS microservices for secure biometric data processing.",
    tags: ["Flutter", "Node.js", "Model", "ML"],
    heroImage: {
      src: "/assets/projects/prints-on-pendants/hero.png",
      alt: "Prints on Pendants custom jewelry capture app",
    },
    screenshots: [
      ...Array.from({ length: 7 }, (_, i) => ({
        src: `/assets/projects/prints-on-pendants/phone${i + 1}.png`,
        alt: `Prints on Pendants mobile app screenshot ${i + 1}`,
      })),
    ],
  },
  {
    slug: "warrior-adventures",
    name: "WARRIOR Adventures",
    primaryColor: "#3F6AC9",
    summary:
      "Team-based adventure platform featuring live location, navigation, real-time gameplay and coordinated backend.",
    description:
      "WARRIOR Adventures is a team-based outdoor adventure platform where groups compete through live location tracking, navigation challenges and real-time gameplay mechanics. Players see teammates on the map, complete checkpoints and climb leaderboards while the backend coordinates game state across devices.\n\nI developed the Flutter app with maps, geolocation and offline-tolerant UX, plus Node.js services for live tracking, leaderboards and team coordination. WebSockets and efficient sync keep gameplay responsive even when connectivity fluctuates on the trail.",
    role: "Mobile engineer",
    outcome:
      "Developed the Flutter app and Node.js backend services for live tracking, leaderboards and team coordination.",
    tags: ["Flutter", "Node.js", "Real-time", "Maps", "Mobile"],
    heroImage: {
      src: "/assets/projects/warrior-adventures/hero.png",
      alt: "WARRIOR Adventures team adventure platform",
    },
    screenshots: [
      ...Array.from({ length: 5 }, (_, i) => ({
        src: `/assets/projects/warrior-adventures/phone${i + 1}.png`,
        alt: `WARRIOR Adventures mobile app screenshot ${i + 1}`,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        src: `/assets/projects/warrior-adventures/admin${i + 1}.png`,
        alt: `WARRIOR Adventures admin dashboard screenshot ${i + 1}`,
      })),
    ],
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

export type ContactSocialLink = {
  label: string;
  href: string;
  /** Same-origin file; browsers offer a download with this filename */
  download?: string;
};

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
      href: "/assets/moasfars-cv.pdf",
      download: "Moasfar-Javed-CV.pdf",
    },
  ] satisfies ContactSocialLink[],
};
