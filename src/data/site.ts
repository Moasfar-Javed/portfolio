import { projectScreenshots } from "./project-screenshots";

export type NavItem = { id: string; label: string; href: string };

export const siteMeta = {
  name: "Moasfar Javed",
  shortTitle: "Moasfar J.",
  tagline: "Full Stack Engineer",
};

export const navItems: NavItem[] = [
  { id: "hero", label: "Intro", href: "#hero" },
  { id: "impact", label: "Impact", href: "#impact" },
  { id: "about", label: "About", href: "#about" },
  { id: "projects", label: "Work", href: "#projects" },
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
    { label: "View work", href: "#projects", variant: "ghost" as const },
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
  /** Visible caption in the gallery and lightbox; also used as image alt text. */
  description: string;
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
      "Developed and scaled high-impact features across mobile, backend, and web systems to drive the core Albi product ecosystem. Spearheaded the development push to successfully launch the mobile application shortly after joining the team.\n\nEngineered a suite of complex tools, including an interactive room sketching interface, a LiDAR-powered 3D room scanning module and check scanning and deposit workflow to streamline financial operations for users. Collaborated directly with Product and Customer Support teams to translate user feedback and pain points into technical improvements.\n\nArchitected and maintained scalable backend services while ensuring production stability through rigorous testing and documentation. Actively mentor other developers and new hires, providing technical guidance on best practices to accelerate their onboarding and professional growth.",
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
      description: "Albi restoration job management platform",
    },
    screenshots: projectScreenshots("albi", [
      {
        file: "phone1.png",
        description: "Home with persistent clock-in timer",
      },
      { file: "phone2.png", description: "Project status dashboard" },
      {
        file: "phone3.png",
        description: "Scheduler with events and multiple views",
      },
      { file: "phone4.png", description: "LiDAR-powered 3D room scanning" },
      {
        file: "phone5.png",
        description: "Comprehensive floor plan sketch editor",
      },
      {
        file: "phone6.png",
        description: "Equipment/inventory barcode scanning and management",
      },
      {
        file: "phone7.png",
        description: "Custom camera implementation for job documentation",
      },
      {
        file: "phone8.png",
        description: "Job documents' library",
      },
      {
        file: "phone9.png",
        description: "Onsite payment request",
      },
      {
        file: "phone10.png",
        description: "Check scanning and deposit processing",
      },
    ]),
  },
  {
    slug: "real",
    name: "Real",
    primaryColor: "#093A40",
    summary:
      "Feature-rich dating app for iOS and Android with subscriptions, secure messaging, verification and admin tooling",
    description:
      "Developed and launched a feature-rich dating app on iOS and Android, integrating subscription management and multi-provider OAuth. Built a privacy-first architecture with encrypted user content and signed data packets to ensure regulatory compliance and user data integrity.\n\nAutomated the user verification pipeline by implementing AWS ML for facial recognition and document processing. Orchestrated an AWS-based backend using queues and Lambdas to handle real-time messaging and heavy media processing.\n\nDesigned a proprietary CRM and moderation suite to streamline content approval and platform analytics.",
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
      description: "Real dating app on iOS and Android",
    },
    screenshots: projectScreenshots("real", [
      {
        file: "phone1.png",
        description: "Splash screen",
      },
      {
        file: "phone2.png",
        description: "Login screen",
      },
      {
        file: "phone3.png",
        description: "Discovery screen with personalized suggestions",
      },
      {
        file: "phone4.png",
        description: 'Payment gated "liked by"',
      },
      {
        file: "phone5.png",
        description: "Real-time chat with notifications",
      },
      {
        file: "phone6.png",
        description:
          "Profile screen with settings, preferences and report options",
      },
      {
        file: "phone7.png",
        description: "Request data compliance",
      },
      {
        file: "admin1.png",
        description: "Admin: User management",
      },
      {
        file: "admin2.png",
        description:
          "Admin: User details, verification requests and moderation",
      },
      {
        file: "admin3.png",
        description: "Admin: Developer details and server metrics",
      },
      {
        file: "admin4.png",
        description: "Admin: Content management",
      },
      {
        file: "admin5.png",
        description: "Admin: Broadcasting an announcement",
      },
    ]),
  },
  {
    slug: "planetj",
    name: "PlanetJ",
    primaryColor: "#FD8803",
    summary:
      "High concurrency video game betting and live-streaming platform built for real-time interaction and secure transactions",
    description:
      "Architected and deployed a high-concurrency platform using React, .NET and PostgreSQL, hosted on AWS to support real-time betting and live streaming. Integrated AWS IVS for low-latency video streaming and implemented WebSockets and Webhooks to handle real-time game states, odds updates and transaction notifications.\n\nDeveloped secure crypto wallet integrations for betting and spearheaded the development of a React-based gaming portal that seamlessly wraps and communicates with Unity builds.\n\nActed as the primary technical liaison, coordinating between the design, QA and Unity game development teams while managing direct client communication to align technical delivery with business roadmaps.",
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
      description: "PlanetJ live streaming and betting platform",
    },
    screenshots: projectScreenshots("planetj", [
      { file: "game1.png", description: "Unity game build in web app" },
      { file: "game2.png", description: "Live leaderboard and game stats" },
      {
        file: "web1.png",
        description: "Modern login page with social login options",
      },
      {
        file: "web2.png",
        description: "Home page with live games and AI chat",
      },
      {
        file: "web3.png",
        description: "Game page with live stream, betting and odds updates",
      },
      { file: "admin1.png", description: "Admin panel with system overview" },
    ]),
  },
  {
    slug: "trainerjoe",
    name: "TrainerJOE",
    primaryColor: "#02897B",
    summary:
      "Multi-platform fitness coaching ecosystem with web, presentation tooling, admin systems and cloud-hosted backend services.",
    description:
      "Engineered a comprehensive fitness ecosystem comprising a React landing page and web app, a specialized Flutter for Web presentation engine and a .NET/MS SQL backend.\n\nDeveloped a full-featured Presentation Mode with real-time controls for workout sequencing, pause/resume functionality, rest delays and automated slide transitions. Implemented a granular workout constructor allowing instructors to customize branding, timings, exercise video integration and slide-specific configurations.\n\nBuilt an extensive admin dashboard featuring a video library management system and integrated performance analytics to track instructor and presentation usage. Managed the end-to-end deployment and hosting of the entire microservices-based architecture on AWS.",
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
      description: "TrainerJOE fitness coaching platform",
    },
    screenshots: projectScreenshots("trainerjoe", [
      { file: "web1.png", description: "Login page with social options" },
      {
        file: "web2.png",
        description: "Exercise library with video integration",
      },
      {
        file: "web3.png",
        description:
          "Workout builder with personalized branding, controls and durations",
      },
      { file: "web4.png", description: "Theme customization" },
      {
        file: "web5.png",
        description: "Full customizable workout presentation view",
      },
      { file: "web6.png", description: "Workout presentation's controls" },
      { file: "web7.png", description: "Workout presentation - rest screen" },
      { file: "admin1.png", description: "Admin: Exercise library management" },
      {
        file: "admin2.png",
        description: "Admin: Analytics and product metrics",
      },
    ]),
  },
  {
    slug: "prints-on-pendants",
    name: "Prints on Pendants",
    primaryColor: "#111111",
    summary:
      "Cross-platform app for securely capturing and storing images, handwriting and fingerprints for custom jewelry workflows.",
    description:
      "Developed a mobile application for iOS and Android that allows users to securely store and manage images, handwriting and fingerprints. Built a custom ML microservice for automated document scanning and high-fidelity fingerprint feature extraction from raw images.\n\nEngineered a Node.js backend using AWS microservices, SQS queues and compute resources for scalable data processing. Designed a secure storage system for biometric data used in the custom physical jewelry manufacturing process.",
    role: "Full-stack engineer",
    outcome:
      "Built the mobile app, ML-backed scanning pipeline and AWS microservices for secure biometric data processing.",
    tags: ["Flutter", "Node.js", "Model", "ML"],
    heroImage: {
      src: "/assets/projects/prints-on-pendants/hero.png",
      description: "Prints on Pendants custom jewelry capture app",
    },
    screenshots: projectScreenshots("prints-on-pendants", [
      {
        file: "phone1.png",
        description: "Splash screen",
      },
      { file: "phone2.png", description: "Registration screen" },
      { file: "phone3.png", description: "Home screen with core options" },
      { file: "phone4.png", description: "Fingerprints capture - hand-wise" },
      {
        file: "phone5.png",
        description: "Custom camera implementation for fingerprint capture",
      },
      {
        file: "phone6.png",
        description:
          "ML processing flow for feature extraction with live results",
      },
      {
        file: "phone7.png",
        description: "Handwriting capture and feature extraction",
      },
    ]),
  },
  {
    slug: "warrior-adventures",
    name: "WARRIOR Adventures",
    primaryColor: "#3F6AC9",
    summary:
      "Team-based adventure platform featuring live location, navigation, real-time gameplay and coordinated backend.",
    description:
      "Designed and developed the mobile application for iOS and Android using Flutter. Implemented live location tracking, navigation and interactive challenges for team-based gameplay.\n\nBuilt Node.js backend services to manage real-time leaderboards, team coordination and game logic.",
    role: "Mobile engineer",
    outcome:
      "Developed the Flutter app and Node.js backend services for live tracking, leaderboards and team coordination.",
    tags: ["Flutter", "Node.js", "Real-time", "Maps", "Mobile"],
    heroImage: {
      src: "/assets/projects/warrior-adventures/hero.png",
      description: "WARRIOR Adventures team adventure platform",
    },
    screenshots: projectScreenshots("warrior-adventures", [
      {
        file: "phone1.png",
        description: "Splash screen",
      },
      {
        file: "phone2.png",
        description: "Idle map showing quests",
      },
      {
        file: "phone3.png",
        description: "Map state when quests started - routing to quests",
      },
      {
        file: "phone4.png",
        description: "Quest completion and points summary",
      },
      {
        file: "phone5.png",
        description: "Live leaderboard screen",
      },
      {
        file: "admin1.png",
        description: "Admin: Quest and challenges management",
      },
      {
        file: "admin2.png",
        description: "Admin: Adding a new challenge to a quest",
      },
    ]),
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
