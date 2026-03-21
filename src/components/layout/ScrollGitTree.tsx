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
  scrollBranchColors,
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
};

function railX(i: number) {
  return EDGE_PAD + i * COLUMN_STEP;
}

function forkPathD(
  xPrev: number,
  yPrev: number,
  xCur: number,
  yCur: number,
): string {
  const dx = xCur - xPrev;
  const dy = yCur - yPrev;
  if (dx > 0 && dy > 1) {
    const r = Math.min(FORK_CORNER_R, dx * 0.48, dy * 0.48);
    if (r < 1.25) {
      return `M ${xPrev} ${yPrev} L ${xCur} ${yPrev} L ${xCur} ${yCur}`;
    }
    return `M ${xPrev} ${yPrev} L ${xCur - r} ${yPrev} A ${r} ${r} 0 0 1 ${xCur} ${yPrev + r} L ${xCur} ${yCur}`;
  }
  return `M ${xPrev} ${yPrev} L ${xCur} ${yPrev} L ${xCur} ${yCur}`;
}

/** Cumulative scroll windows [0–1] for stem → fork → parallel tails → … */
function buildPhaseRanges(tops: number[], H: number): { start: number; end: number }[] {
  const n = tops.length;
  if (n === 0 || H <= 0) return [];

  const raw: number[] = [];

  if (n === 1) {
    raw.push(Math.max(0.08, tops[0]! / H));
    raw.push(Math.max(0.08, (H - tops[0]!) / H));
  } else {
    raw.push(Math.max(0.08, tops[0]! / H));
    for (let k = 1; k < n; k++) {
      raw.push(0.055);
      if (k === 1) {
        raw.push(
          Math.max(
            0.1,
            Math.max(H - tops[0]!, H - tops[1]!) / H,
          ),
        );
      } else {
        raw.push(Math.max(0.08, (H - tops[k]!) / H));
      }
    }
  }

  const sum = raw.reduce((a, b) => a + b, 0);
  const ranges: { start: number; end: number }[] = [];
  let acc = 0;
  for (const w of raw) {
    const start = acc / sum;
    acc += w;
    const end = acc / sum;
    ranges.push({ start, end });
  }
  return ranges;
}

/** Vertical segments as paths — `pathLength` stroke drawing is inconsistent on `<line>` in some browsers. */
function PhaseVertical({
  scrollP,
  phaseStart,
  phaseEnd,
  x,
  y1,
  y2,
  stroke,
  strokeWidth,
  strokeLinecap,
  opacity,
}: {
  scrollP: MotionValue<number>;
  phaseStart: number;
  phaseEnd: number;
  x: number;
  y1: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: "round" | "butt" | "square";
  opacity: number;
}) {
  const reduce = useReducedMotion();
  const pathLen = useTransform(
    scrollP,
    [phaseStart, phaseEnd],
    [0, 1],
    { clamp: true },
  );
  const d = `M ${x} ${y1} L ${x} ${y2}`;

  if (reduce) {
    return (
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        opacity={opacity}
      />
    );
  }

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      opacity={opacity}
      vectorEffect="non-scaling-stroke"
      pathLength={pathLen}
      initial={false}
    />
  );
}

function PhasePath({
  scrollP,
  phaseStart,
  phaseEnd,
  d,
  stroke,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
  opacity,
}: {
  scrollP: MotionValue<number>;
  phaseStart: number;
  phaseEnd: number;
  d: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: "round" | "butt" | "square";
  strokeLinejoin: "round" | "miter" | "bevel";
  opacity: number;
}) {
  const reduce = useReducedMotion();
  const pathLen = useTransform(
    scrollP,
    [phaseStart, phaseEnd],
    [0, 1],
    { clamp: true },
  );

  if (reduce) {
    return (
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        opacity={opacity}
      />
    );
  }

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      opacity={opacity}
      vectorEffect="non-scaling-stroke"
      pathLength={pathLen}
      initial={false}
    />
  );
}

/**
 * Scroll story: main stem grows to first node → fork draws → both rails grow
 * down together → next fork → new rail grows (previous rails already complete).
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

  const phaseRanges = useMemo(() => buildPhaseRanges(tops, H), [tops, H]);

  const c = (i: number) => colors[i % colors.length]!;
  const lines: ReactNode[] = [];
  const forks: ReactNode[] = [];
  const nodes: ReactNode[] = [];

  if (n === 0 || trackW <= 0 || trackH <= 0) return null;

  let pi = 0;

  if (n === 1) {
    const y0 = tops[0]!;
    const x0 = railX(0);
    if (phaseRanges.length >= 2) {
      lines.push(
        <PhaseVertical
          key="stem-0"
          scrollP={scrollProgress}
          phaseStart={phaseRanges[0]!.start}
          phaseEnd={phaseRanges[0]!.end}
          x={x0}
          y1={0}
          y2={y0}
          stroke={c(0)}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          opacity={0.9}
        />,
      );
      lines.push(
        <PhaseVertical
          key="tail-0"
          scrollP={scrollProgress}
          phaseStart={phaseRanges[1]!.start}
          phaseEnd={phaseRanges[1]!.end}
          x={x0}
          y1={y0}
          y2={H}
          stroke={c(0)}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          opacity={0.88}
        />,
      );
    }
  } else {
    const x0 = railX(0);
    const y0 = tops[0]!;

    if (phaseRanges[pi]) {
      lines.push(
        <PhaseVertical
          key="stem-main"
          scrollP={scrollProgress}
          phaseStart={phaseRanges[pi]!.start}
          phaseEnd={phaseRanges[pi]!.end}
          x={x0}
          y1={0}
          y2={y0}
          stroke={c(0)}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          opacity={0.9}
        />,
      );
      pi++;
    }

    for (let k = 1; k < n; k++) {
      const forkR = phaseRanges[pi];
      const parR = phaseRanges[pi + 1];
      pi += 2;

      if (!forkR || !parR) break;

      const xPrev = railX(k - 1);
      const xCur = railX(k);
      const yPrev = tops[k - 1]!;
      const yCur = tops[k]!;

      forks.push(
        <PhasePath
          key={`fork-${k}`}
          scrollP={scrollProgress}
          phaseStart={forkR.start}
          phaseEnd={forkR.end}
          d={forkPathD(xPrev, yPrev, xCur, yCur)}
          stroke={c(k)}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.97}
        />,
      );

      if (k === 1) {
        lines.push(
          <PhaseVertical
            key="tail-0-joint"
            scrollP={scrollProgress}
            phaseStart={parR.start}
            phaseEnd={parR.end}
            x={railX(0)}
            y1={y0}
            y2={H}
            stroke={c(0)}
            strokeWidth={STROKE_W}
            strokeLinecap="round"
            opacity={0.88}
          />,
          <PhaseVertical
            key="tail-1-joint"
            scrollP={scrollProgress}
            phaseStart={parR.start}
            phaseEnd={parR.end}
            x={railX(1)}
            y1={tops[1]!}
            y2={H}
            stroke={c(1)}
            strokeWidth={STROKE_W}
            strokeLinecap="round"
            opacity={0.88}
          />,
        );
      } else {
        lines.push(
          <PhaseVertical
            key={`tail-${k}`}
            scrollP={scrollProgress}
            phaseStart={parR.start}
            phaseEnd={parR.end}
            x={xCur}
            y1={yCur}
            y2={H}
            stroke={c(k)}
            strokeWidth={STROKE_W}
            strokeLinecap="round"
            opacity={0.88}
          />,
        );
      }
    }
  }

  for (let i = 0; i < n; i++) {
    const x = railX(i);
    const y = tops[i]!;
    const isActive = activeIndex === i;

    nodes.push(
      <g key={`node-${i}`}>
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
          fill={isActive ? "#fafafa" : c(i)}
          stroke={c(i)}
          strokeWidth={isActive ? 2.5 : 1.35}
          opacity={isActive ? 1 : 0.95}
        />
      </g>,
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
      theme === "dark"
        ? [...scrollBranchColors].reverse()
        : scrollBranchColors,
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
      const r = el.getBoundingClientRect();
      const cy = r.top + window.scrollY + r.height / 2;
      return cy - scopeTopDoc;
    });

    if (tops.length === 0) return;

    const trunkBottom = th;

    startTransition(() => {
      setLayout({
        tops,
        trunkBottom,
        trackW: tw,
        trackH: th,
      });
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const t = window.setTimeout(measure, 160);
    const t2 = window.setTimeout(measure, 480);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
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
      className="pointer-events-none absolute left-0 top-0 z-30 hidden w-[var(--graph-rail-width)] overflow-visible lg:block"
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
