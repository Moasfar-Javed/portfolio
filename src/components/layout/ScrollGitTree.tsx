import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  startTransition,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  graphTreeItems,
  scrollBranchColorsDark,
  scrollBranchColorsLight,
} from "../../data/site";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useLenisRef } from "../../hooks/useLenisRef";
import { useTheme } from "../../hooks/useTheme";

const GRAPH_SCOPE_ID = "graph-scope";

const EDGE_PAD = 10;
const COLUMN_STEP = 15;
const NODE_R = 4.5;
const STROKE_W = 2.25;
const FORK_CORNER_R = 5.5;

type Layout = {
  tops: number[];
  trunkBottom: number;
  trackW: number;
  trackH: number;
  viewportHeight: number;
};

function railX(i: number) {
  return EDGE_PAD + i * COLUMN_STEP;
}

/** Horizontal connector + arc only — no vertical drop. */
function forkPathD(xPrev: number, yPrev: number, xCur: number): string {
  const dx = xCur - xPrev;
  if (dx <= 0) return `M ${xPrev} ${yPrev}`;
  const r = Math.min(FORK_CORNER_R, dx * 0.48);
  if (r < 1.25) return `M ${xPrev} ${yPrev} L ${xCur} ${yPrev}`;
  return `M ${xPrev} ${yPrev} L ${xCur - r} ${yPrev} A ${r} ${r} 0 0 1 ${xCur} ${yPrev + r}`;
}

/** Horizontal fork connector, animated via pathLength over a short frontier range. */
function ForkPath({
  frontierY,
  triggerY,
  d,
  stroke,
  strokeWidth,
  opacity,
}: {
  frontierY: MotionValue<number>;
  triggerY: number;
  d: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}) {
  const reduce = useReducedMotion();
  const pathLen = useTransform(
    frontierY,
    [triggerY, triggerY + COLUMN_STEP],
    [0, 1],
    { clamp: true },
  );

  if (reduce) {
    return (
      <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />
    );
  }

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      vectorEffect="non-scaling-stroke"
      pathLength={pathLen}
      initial={false}
    />
  );
}

/**
 * Vertical line whose tip tracks a shared frontierY MotionValue.
 *
 * Instead of pathLength (which normalises 0→1 over each segment's own length,
 * causing short and long segments to animate at different pixel rates), we
 * animate y2 directly so every tip moves at the same pixels-per-scroll rate.
 */
function FrontierLine({
  frontierY,
  x,
  y1,
  y2,
  stroke,
  strokeWidth,
  strokeLinecap,
  opacity,
}: {
  frontierY: MotionValue<number>;
  x: number;
  y1: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: "round" | "butt" | "square";
  opacity: number;
}) {
  const reduce = useReducedMotion();
  // Clamp: only draw from y1 once frontier passes y1; stop at y2.
  const animY2 = useTransform(frontierY, (v) =>
    Math.min(Math.max(v, y1), y2),
  );

  if (reduce) {
    return (
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        opacity={opacity}
      />
    );
  }

  return (
    <motion.line
      x1={x}
      y1={y1}
      x2={x}
      y2={animY2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      opacity={opacity}
      vectorEffect="non-scaling-stroke"
    />
  );
}

const NODE_APPEAR_PAD = 24;

function FrontierNode({
  frontierY,
  x,
  y,
  color,
  isActive,
}: {
  frontierY: MotionValue<number>;
  x: number;
  y: number;
  color: string;
  isActive: boolean;
}) {
  const opacity = useTransform(frontierY, [y - NODE_APPEAR_PAD, y], [0, 1], {
    clamp: true,
  });

  return (
    <motion.g style={{ opacity }}>
      {isActive && (
        <circle
          cx={x}
          cy={y}
          r={NODE_R + 5}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
          opacity={0.4}
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={NODE_R}
        fill={isActive ? "#fafafa" : color}
        stroke={color}
        strokeWidth={isActive ? 2.5 : 1.35}
        opacity={isActive ? 1 : 0.78}
      />
    </motion.g>
  );
}

/**
 * Scroll story: a single frontierY MotionValue advances from 0 → H as the
 * user scrolls. Every vertical segment draws from its start y to wherever the
 * frontier currently sits, so all tips move at exactly the same pixel rate.
 * Fork paths trigger (via pathLength) the moment the frontier passes their
 * branch point.
 */
function MetroBranchSvg({
  layout,
  colors,
  activeIndex,
  scrollProgress,
}: {
  layout: Layout;
  colors: string[];
  activeIndex: number;
  scrollProgress: MotionValue<number>;
}) {
  const { tops, trunkBottom, trackW, trackH } = layout;
  const n = tops.length;
  const H = trunkBottom;

  // Single frontier value shared by all segments → identical pixel draw rate.
  const frontierY = useTransform(scrollProgress, [0, 1], [0, H], {
    clamp: true,
  });

  const c = (i: number) => colors[i % colors.length]!;
  const lines: ReactNode[] = [];
  const forks: ReactNode[] = [];
  const nodes: ReactNode[] = [];

  if (n === 0 || trackW <= 0 || trackH <= 0) return null;

  if (n === 1) {
    const y0 = tops[0]!;
    const x0 = railX(0);
    lines.push(
      <FrontierLine
        key="stem-0"
        frontierY={frontierY}
        x={x0}
        y1={0}
        y2={y0}
        stroke={c(0)}
        strokeWidth={STROKE_W}
        strokeLinecap="butt"
        opacity={0.68}
      />,
      <FrontierLine
        key="tail-0"
        frontierY={frontierY}
        x={x0}
        y1={y0}
        y2={H}
        stroke={c(0)}
        strokeWidth={STROKE_W}
        strokeLinecap="butt"
        opacity={0.62}
      />,
    );
  } else {
    const x0 = railX(0);
    const y0 = tops[0]!;

    // Main stem: grows from scope top to first node.
    lines.push(
      <FrontierLine
        key="stem-main"
        frontierY={frontierY}
        x={x0}
        y1={0}
        y2={y0}
        stroke={c(0)}
        strokeWidth={STROKE_W}
        strokeLinecap="butt"
        opacity={0.68}
      />,
    );

    for (let k = 1; k < n; k++) {
      const xPrev = railX(k - 1);
      const xCur = railX(k);
      const yPrev = tops[k - 1]!;
      const yCur = tops[k]!;

      // Horizontal connector snaps in quickly as the frontier hits yPrev.
      forks.push(
        <ForkPath
          key={`fork-${k}`}
          frontierY={frontierY}
          triggerY={yPrev}
          d={forkPathD(xPrev, yPrev, xCur)}
          stroke={c(k)}
          strokeWidth={STROKE_W}
          opacity={0.72}
        />,
      );

      // Vertical drop from arc endpoint to node — starts where the arc ends
      // so there's no overlap with the ForkPath at the junction.
      lines.push(
        <FrontierLine
          key={`connector-${k}`}
          frontierY={frontierY}
          x={xCur}
          y1={yPrev + FORK_CORNER_R}
          y2={yCur}
          stroke={c(k)}
          strokeWidth={STROKE_W}
          strokeLinecap="butt"
          opacity={0.72}
        />,
      );

      if (k === 1) {
        lines.push(
          <FrontierLine
            key="tail-0"
            frontierY={frontierY}
            x={railX(0)}
            y1={y0}
            y2={H}
            stroke={c(0)}
            strokeWidth={STROKE_W}
            strokeLinecap="butt"
            opacity={0.62}
          />,
          <FrontierLine
            key="tail-1"
            frontierY={frontierY}
            x={railX(1)}
            y1={yCur}
            y2={H}
            stroke={c(1)}
            strokeWidth={STROKE_W}
            strokeLinecap="butt"
            opacity={0.62}
          />,
        );
      } else {
        lines.push(
          <FrontierLine
            key={`tail-${k}`}
            frontierY={frontierY}
            x={xCur}
            y1={yCur}
            y2={H}
            stroke={c(k)}
            strokeWidth={STROKE_W}
            strokeLinecap="butt"
            opacity={0.62}
          />,
        );
      }
    }
  }

  for (let i = 0; i < n; i++) {
    const x = railX(i);
    const y = tops[i]!;

    nodes.push(
      <FrontierNode
        key={`node-${i}`}
        frontierY={frontierY}
        x={x}
        y={y}
        color={c(i)}
        isActive={activeIndex === i}
      />,
    );
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      width={trackW}
      height={trackH}
      viewBox={`0 0 ${trackW} ${trackH}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {lines}
      {forks}
      {nodes}
    </svg>
  );
}

export function ScrollGitTree({
  scopeRef,
}: {
  scopeRef: RefObject<HTMLDivElement | null>;
}) {
  const { theme } = useTheme();
  const branchColors = useMemo(
    () =>
      theme === "dark" ? scrollBranchColorsDark : scrollBranchColorsLight,
    [theme],
  );

  const { scrollYProgress } = useScroll({
    target: scopeRef,
    offset: ["start 0.92", "end 0.08"],
  });
  const graphDrawProgress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 28,
    mass: 0.12,
  });

  const graphIds = useMemo(
    () => graphTreeItems.map((item) => item.id),
    [],
  );
  const observerSectionIds = useMemo(
    () => ["hero", ...graphIds],
    [graphIds],
  );
  const activeId = useActiveSection(observerSectionIds);
  const activeIndex =
    activeId === "hero"
      ? -1
      : graphTreeItems.findIndex((item) => item.id === activeId);

  const lenisRef = useLenisRef();

  const [layout, setLayout] = useState<Layout | null>(null);

  const measure = useCallback(() => {
    const scope = document.getElementById(GRAPH_SCOPE_ID);
    const rail = document.getElementById("scroll-git-rail");
    if (!scope || !rail) return;

    const scopeRect = scope.getBoundingClientRect();
    const scopeTopDoc = scopeRect.top + window.scrollY;
    const tw = rail.clientWidth;
    const th = scope.offsetHeight;

    if (th <= 0 || tw <= 0) return;

    const tops = graphTreeItems.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      // Prefer the section's heading so the node aligns with the title.
      const heading = el.querySelector("h1, h2, h3");
      const target = heading ?? el;
      const r = target.getBoundingClientRect();
      const cy = r.top + window.scrollY + r.height / 2;
      return cy - scopeTopDoc;
    });

    if (tops.length === 0) return;

    startTransition(() => {
      setLayout({
        tops,
        trunkBottom: th,
        trackW: tw,
        trackH: th,
        viewportHeight: window.innerHeight,
      });
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const t = window.setTimeout(measure, 160);
    const t2 = window.setTimeout(measure, 480);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    const ro = new ResizeObserver(measure);
    const scope = document.getElementById(GRAPH_SCOPE_ID);
    if (scope) ro.observe(scope);
    for (const { id } of graphTreeItems) {
      const el = document.getElementById(id);
      if (el) ro.observe(el);
    }
    ro.observe(document.documentElement);

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      ro.disconnect();
    };
  }, [measure]);

  const scrollTo = useCallback(
    (href: string) => {
      if (!href.startsWith("#")) return;
      const el = document.querySelector(href);
      const lenis = lenisRef.current;
      if (el instanceof HTMLElement && lenis) {
        lenis.scrollTo(el, { offset: -76, duration: 1.05 });
      } else if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenisRef],
  );

  return (
    <div
      id="scroll-git-rail"
      className="pointer-events-none absolute left-0 top-0 z-30 isolate hidden w-[var(--graph-rail-width)] overflow-visible lg:block"
      style={{ height: "100%" }}
    >
      <div className="relative h-full w-full" aria-label="Section branches">
        {layout && layout.trackH > 0 ? (
          <MetroBranchSvg
            layout={layout}
            colors={branchColors}
            activeIndex={activeIndex}
            scrollProgress={graphDrawProgress}
          />
        ) : null}

        {graphTreeItems.map((item, i) => {
          const top = layout?.tops[i] ?? 0;
          const nx = railX(i);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.href)}
              className="pointer-events-auto absolute rounded-full border-0 bg-transparent p-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{
                left: nx - 14,
                top: top - 14,
                width: 28,
                height: 28,
              }}
              aria-label={`Go to ${item.label}`}
              aria-current={activeIndex === i ? "location" : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
