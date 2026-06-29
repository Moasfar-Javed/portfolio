import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useTheme } from "../../hooks/useTheme";

const wf = {
  transparent: true,
  wireframe: true,
} as const;

const STAGE_COUNT = 5;

/** Uniform scale for all scroll stages (world units). */
const SCENE_SCALE = 1.58;

/** Stage-0 terminal sits screen-right at load so it clears hero copy. */
const PCB_WORLD_OFFSET: [number, number, number] = [1.52, 0, 0.34];

/** Normalized weights peaking at t = 0, 0.25, …, 1 — order: terminal → phone → browser → 1U → database. */
function scrollStageWeights(t: number, count: number): number[] {
  if (count <= 1) return [1];
  const raw = Array.from({ length: count }, (_, k) => {
    const u = (count - 1) * THREE.MathUtils.clamp(t, 0, 1);
    const d = Math.abs(u - k);
    return Math.max(0, 1 - d);
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  const norm = sum > 1e-8 ? raw.map((x) => x / sum) : raw;
  const smoothed = norm.map((x) => x * x * (3 - 2 * x));
  const s2 = smoothed.reduce((a, b) => a + b, 0);
  return s2 > 1e-8 ? smoothed.map((x) => x / s2) : smoothed;
}

function applyStageMorph(group: THREE.Group | null, weight: number) {
  if (!group) return;
  const w = THREE.MathUtils.clamp(weight, 0, 1);
  group.visible = w > 0.003;
  const s = 0.76 + 0.24 * Math.pow(w, 0.9);
  group.scale.setScalar(s);
  group.traverse((obj) => {
    const base = (obj.userData as { baseOpacity?: number }).baseOpacity;
    if (base == null) return;
    const mat = (obj as THREE.Mesh).material;
    if (!mat) return;
    const mats = Array.isArray(mat) ? mat : [mat];
    for (const m of mats) {
      if ("opacity" in m && "transparent" in m) {
        const mm = m as THREE.MeshBasicMaterial & { opacity: number };
        mm.transparent = true;
        mm.opacity = base * w;
      }
    }
  });
}

/** Drei `Line` / Line2 materials are not meshes — fade them separately from `userData.baseOpacity` meshes. */
function fadeLineMaterials(
  group: THREE.Group | null,
  weight: number,
  baseOpacity: number,
) {
  if (!group) return;
  const wt = THREE.MathUtils.clamp(weight, 0, 1);
  group.traverse((obj) => {
    if ((obj.userData as { baseOpacity?: number }).baseOpacity != null) return;
    const mat = (obj as THREE.Object3D & { material?: THREE.Material | THREE.Material[] })
      .material;
    if (!mat) return;
    const mats = Array.isArray(mat) ? mat : [mat];
    for (const m of mats) {
      if (m && "opacity" in m) {
        const mm = m as THREE.Material & { opacity: number; transparent: boolean };
        mm.transparent = true;
        mm.opacity = baseOpacity * wt;
      }
    }
  });
}

function ScrollMorphScene({
  scrollYProgress,
  primary,
  secondary,
}: {
  scrollYProgress: MotionValue<number>;
  primary: string;
  secondary: string;
}) {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const browser = useRef<THREE.Group>(null);
  const server = useRef<THREE.Group>(null);
  const database = useRef<THREE.Group>(null);
  const terminal = useRef<THREE.Group>(null);

  const terminalScreenTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const tw = 768;
    const th = 512;
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#06080c";
    ctx.fillRect(0, 0, tw, th);
    ctx.fillStyle = primary;
    ctx.font =
      '500 38px ui-monospace, SFMono-Regular, "Cascadia Code", Menlo, monospace';
    ctx.textBaseline = "top";
    ctx.fillText("$ hello world", 44, 96);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [primary]);

  useEffect(() => {
    return () => {
      terminalScreenTexture?.dispose();
    };
  }, [terminalScreenTexture]);

  const camTargets = useMemo(
    () => [
      /** Hero: lower Y than legacy PCB shot so the terminal reads more head-on, less “looking down”. */
      new THREE.Vector3(2.58, 1.38, 5.32),
      /** Slightly left / in vs hero so 0→1 gets camera travel as well as look-at pan. */
      new THREE.Vector3(2.38, 1.5, 5.12),
      /** Head-on browser with a touch of height + depth for a clear arc from phone. */
      new THREE.Vector3(0.02, 0.24, 6.42),
      /** Rack shot from front-right. */
      new THREE.Vector3(3.38, 1.88, 4.38),
      /** Lower, closer for schema read. */
      new THREE.Vector3(3.72, 1.08, 3.58),
    ],
    [],
  );

  const lookTargets = useMemo(
    () => [
      new THREE.Vector3(
        PCB_WORLD_OFFSET[0],
        0.04,
        PCB_WORLD_OFFSET[2] + 0.02,
      ),
      /** Spread look points so each blend pans the frame (hero was strong because look moved a lot). */
      new THREE.Vector3(0.12, 0.11, 0.04),
      new THREE.Vector3(-0.1, -0.02, 0.05),
      new THREE.Vector3(0.14, 0.04, -0.05),
      new THREE.Vector3(-0.07, -0.26, 0.07),
    ],
    [],
  );

  const camAcc = useRef(new THREE.Vector3());
  const lookAcc = useRef(new THREE.Vector3());
  const camSm = useRef(new THREE.Vector3());
  const lookSm = useRef(new THREE.Vector3());
  const camInit = useRef(false);

  useFrame((_, delta) => {
    const t = scrollYProgress.get();
    const wMorph = scrollStageWeights(t, STAGE_COUNT);
    /** Camera reaches the frontal “middle” framing sooner than morph weights (hero → centered). */
    const wCam = scrollStageWeights(Math.min(1, t * 1.72), STAGE_COUNT);

    camAcc.current.set(0, 0, 0);
    lookAcc.current.set(0, 0, 0);
    for (let i = 0; i < STAGE_COUNT; i++) {
      camAcc.current.addScaledVector(camTargets[i]!, wCam[i]!);
      lookAcc.current.addScaledVector(lookTargets[i]!, wCam[i]!);
    }

    /** Light orbit on top of keyframes: subtle pan + parallax on every segment (like the hero handoff). */
    const orbit = t * Math.PI * 2 * 1.12;
    const amp = 0.12;
    camAcc.current.x += Math.sin(orbit) * amp;
    camAcc.current.y += Math.sin(orbit * 0.52 + 0.9) * amp * 0.42;
    camAcc.current.z += Math.cos(orbit * 0.48 + 0.35) * amp * 0.28;
    lookAcc.current.x += Math.sin(orbit + 1.05) * amp * 0.62;
    lookAcc.current.y += Math.sin(orbit * 0.55 + 0.25) * amp * 0.48;
    lookAcc.current.z += Math.cos(orbit * 0.5 + 0.7) * amp * 0.35;

    if (!camInit.current) {
      camSm.current.copy(camAcc.current);
      lookSm.current.copy(lookAcc.current);
      camInit.current = true;
    }
    const k = 1 - Math.exp(-delta * 4.2);
    camSm.current.lerp(camAcc.current, k);
    lookSm.current.lerp(lookAcc.current, k);
    camera.position.copy(camSm.current);
    camera.lookAt(lookSm.current);

    applyStageMorph(terminal.current, wMorph[0]!);
    applyStageMorph(phone.current, wMorph[1]!);
    applyStageMorph(browser.current, wMorph[2]!);
    applyStageMorph(server.current, wMorph[3]!);
    applyStageMorph(database.current, wMorph[4]!);

    fadeLineMaterials(database.current, wMorph[4]!, 0.11);

    if (root.current) {
      const drift = performance.now() * 0.00032;
      root.current.rotation.y =
        t * 0.56 +
        Math.sin(drift) * 0.045 +
        0.05 * Math.sin(t * Math.PI * 4.2);
      root.current.rotation.x = t * 0.095 + 0.032 * Math.cos(t * Math.PI * 3.1);
      root.current.rotation.z = Math.sin(drift * 0.85) * 0.022;
    }
  });

  return (
    <group ref={root} scale={SCENE_SCALE}>
      {/* 0 — terminal + hello world */}
      <group ref={terminal} position={PCB_WORLD_OFFSET}>
        <mesh userData={{ baseOpacity: 0.11 }} position={[0, 0, 0]}>
          <boxGeometry args={[1.68, 1.14, 0.085]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.11} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.12 }} position={[0, 0.485, 0.046]}>
          <boxGeometry args={[1.64, 0.13, 0.055]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.12} />
        </mesh>
        {[-0.62, -0.48, -0.34].map((x, i) => (
          <mesh key={i} userData={{ baseOpacity: 0.13 }} position={[x, 0.485, 0.074]}>
            <sphereGeometry args={[0.036, 10, 10]} />
            <meshBasicMaterial color={primary} {...wf} opacity={0.13} />
          </mesh>
        ))}
        <mesh userData={{ baseOpacity: 0.08 }} position={[0, -0.055, 0.052]}>
          <boxGeometry args={[1.4, 0.86, 0.018]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.08} />
        </mesh>
        {terminalScreenTexture ? (
          <mesh userData={{ baseOpacity: 0.52 }} position={[0, -0.055, 0.065]}>
            <planeGeometry args={[1.3, 0.8]} />
            <meshBasicMaterial
              map={terminalScreenTexture}
              color="#ffffff"
              transparent
              toneMapped={false}
              opacity={0.52}
            />
          </mesh>
        ) : null}
      </group>

      {/* 1 — handset */}
      <group ref={phone}>
        <mesh userData={{ baseOpacity: 0.13 }} position={[0, 0, 0]}>
          <boxGeometry args={[0.62, 1.22, 0.075]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.13} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.09 }} position={[0, 0, 0.055]}>
          <boxGeometry args={[0.52, 1.02, 0.018]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.09} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.11 }} position={[0, 0.52, 0.06]}>
          <boxGeometry args={[0.14, 0.045, 0.025]} />
          <meshBasicMaterial color={primary} transparent opacity={0.11} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.06 }} position={[0.22, -0.48, 0.05]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.06} />
        </mesh>
      </group>

      {/* 2 — browser chrome */}
      <group ref={browser}>
        <mesh userData={{ baseOpacity: 0.11 }} position={[0, 0, 0]}>
          <boxGeometry args={[1.75, 1.15, 0.055]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.11} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.12 }} position={[0, 0.515, 0.03]}>
          <boxGeometry args={[1.72, 0.11, 0.06]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.12} />
        </mesh>
        {[-0.62, -0.42, -0.22].map((x, i) => (
          <mesh key={i} userData={{ baseOpacity: 0.14 }} position={[x, 0.52, 0.065]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial color={primary} {...wf} opacity={0.14} />
          </mesh>
        ))}
        <mesh userData={{ baseOpacity: 0.08 }} position={[0.15, 0.38, 0.04]}>
          <boxGeometry args={[1.15, 0.055, 0.025]} />
          <meshBasicMaterial color={secondary} transparent opacity={0.08} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.07 }} position={[0, -0.08, 0.035]}>
          <planeGeometry args={[1.58, 0.82, 12, 6]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.07} />
        </mesh>
      </group>

      {/* 3 — 1U pizza-box: flat chassis, front bays, port strip, rack ears */}
      <group ref={server}>
        <mesh userData={{ baseOpacity: 0.1 }} position={[0, 0, 0]}>
          <boxGeometry args={[1.74, 0.34, 1.02]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.1} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.068 }} position={[0, 0, 0.513]}>
          <planeGeometry args={[1.52, 0.26, 10, 4]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.068} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.085 }} position={[0, 0.07, 0.518]}>
          <boxGeometry args={[1.38, 0.095, 0.028]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.085} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.085 }} position={[0, -0.05, 0.518]}>
          <boxGeometry args={[1.38, 0.095, 0.028]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.085} />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh
            key={i}
            userData={{ baseOpacity: 0.11 }}
            position={[-0.64 + i * 0.16, -0.12, 0.525]}
          >
            <boxGeometry args={[0.055, 0.045, 0.032]} />
            <meshBasicMaterial color={secondary} transparent opacity={0.11} />
          </mesh>
        ))}
        <mesh userData={{ baseOpacity: 0.075 }} position={[-0.91, 0, 0]}>
          <boxGeometry args={[0.055, 0.36, 0.98]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.075} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.075 }} position={[0.91, 0, 0]}>
          <boxGeometry args={[0.055, 0.36, 0.98]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.075} />
        </mesh>
      </group>

      {/* 4 — schema plane + entity nodes + relation edges */}
      <group ref={database}>
        <mesh
          userData={{ baseOpacity: 0.065 }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.52, 0]}
        >
          <planeGeometry args={[2.1, 1.45, 12, 9]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.065} />
        </mesh>
        {[
          [-0.68, 0.06, 0.38],
          [0.58, 0.14, 0.22],
          [0.12, -0.18, -0.12],
          [-0.42, 0.28, -0.18],
          [0.62, -0.12, -0.28],
        ].map((pos, i) => (
          <mesh
            key={i}
            userData={{ baseOpacity: 0.12 }}
            position={pos as [number, number, number]}
          >
            <boxGeometry args={[0.26, 0.22, 0.26]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? primary : secondary}
              {...wf}
              opacity={0.12}
            />
          </mesh>
        ))}
        {(
          [
            [
              [-0.68, 0.06, 0.38],
              [0.58, 0.14, 0.22],
            ],
            [
              [0.58, 0.14, 0.22],
              [0.12, -0.18, -0.12],
            ],
            [
              [-0.68, 0.06, 0.38],
              [0.12, -0.18, -0.12],
            ],
            [
              [-0.42, 0.28, -0.18],
              [-0.68, 0.06, 0.38],
            ],
            [
              [-0.42, 0.28, -0.18],
              [0.62, -0.12, -0.28],
            ],
            [
              [0.58, 0.14, 0.22],
              [0.62, -0.12, -0.28],
            ],
          ] as const
        ).map((seg, i) => (
          <Line
            key={i}
            points={[seg[0], seg[1]]}
            color={primary}
            lineWidth={1}
            transparent
            opacity={0.11}
            dashed
            dashSize={0.08}
            gapSize={0.06}
          />
        ))}
      </group>
    </group>
  );
}

function useFinePointer() {
  const [fine, setFine] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

export function SceneBackground() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const narrow = useMediaQuery("(max-width: 767px)");
  const coarse = useMediaQuery("(pointer: coarse)");
  const lightWebGl = narrow || coarse;
  const { scrollYProgress } = useScroll();
  const isDark = theme === "dark";
  const primary = isDark ? "#6ba3ff" : "#3d6ad4";
  const secondary = isDark ? "#8a8fb8" : "#64748b";

  /** Stop driving the render loop when the tab is backgrounded — no point spending GPU/CPU on an unseen canvas. */
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  useEffect(() => {
    const sync = () => setFrameloop(document.hidden ? "never" : "always");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  if (reduce || !fine) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-surface-0"
        aria-hidden
      >
        <div className="scene-stack-fade absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--glow),transparent)] opacity-70 dark:opacity-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-surface-0" aria-hidden>
      <div className="scene-stack-fade absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,var(--glow),transparent)] opacity-50 dark:opacity-[0.85]" />
        <Canvas
          className="!absolute inset-0 h-full w-full"
          frameloop={frameloop}
          camera={{ position: [2.58, 1.38, 5.32], fov: 42 }}
          gl={{
            alpha: true,
            antialias: !lightWebGl,
            powerPreference: lightWebGl ? "low-power" : "high-performance",
            stencil: false,
            depth: true,
          }}
          dpr={lightWebGl ? [1, 1.25] : [1, 1.6]}
        >
          <ScrollMorphScene
            key={theme}
            scrollYProgress={scrollYProgress}
            primary={primary}
            secondary={secondary}
          />
        </Canvas>
      </div>
    </div>
  );
}
