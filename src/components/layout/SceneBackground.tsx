import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "../../hooks/useTheme";

const wf = {
  transparent: true,
  wireframe: true,
} as const;

const STAGE_COUNT = 5;

/** Uniform scale for all scroll stages (world units). */
const SCENE_SCALE = 1.58;

/** Normalized weights peaking at t = 0, 0.25, …, 1 — order: PCB → phone → browser → server → database. */
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
  const pcb = useRef<THREE.Group>(null);

  const bus = useMemo(
    () =>
      [
        { to: [1.55, 0.45, -0.42] as const },
        { to: [-1.48, 0.15, 0.38] as const },
        { to: [0.42, 1.28, -0.22] as const },
        { to: [-0.28, -0.92, 0.28] as const },
      ] as const,
    [],
  );

  const codeLineLengths = useMemo(() => [1.35, 0.82, 1.05, 0.68, 1.12], []);

  const camTargets = useMemo(
    () => [
      new THREE.Vector3(2.35, 3.25, 4.85),
      new THREE.Vector3(2.65, 1.55, 5.2),
      new THREE.Vector3(0.05, 0.15, 6.35),
      new THREE.Vector3(3.45, 1.85, 4.35),
      new THREE.Vector3(3.85, 0.95, 3.65),
    ],
    [],
  );

  const lookTargets = useMemo(
    () => [
      new THREE.Vector3(0, -0.12, 0),
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.08, 0),
      new THREE.Vector3(0, -0.28, 0),
    ],
    [],
  );

  const camAcc = useRef(new THREE.Vector3());
  const lookAcc = useRef(new THREE.Vector3());
  const camSm = useRef(new THREE.Vector3());
  const lookSm = useRef(new THREE.Vector3());
  const camInit = useRef(false);

  const hub: [number, number, number] = [0, 0.22, 0];

  useFrame((_, delta) => {
    const t = scrollYProgress.get();
    const w = scrollStageWeights(t, STAGE_COUNT);

    camAcc.current.set(0, 0, 0);
    lookAcc.current.set(0, 0, 0);
    for (let i = 0; i < STAGE_COUNT; i++) {
      camAcc.current.addScaledVector(camTargets[i]!, w[i]!);
      lookAcc.current.addScaledVector(lookTargets[i]!, w[i]!);
    }

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

    applyStageMorph(pcb.current, w[0]!);
    applyStageMorph(phone.current, w[1]!);
    applyStageMorph(browser.current, w[2]!);
    applyStageMorph(server.current, w[3]!);
    applyStageMorph(database.current, w[4]!);

    fadeLineMaterials(pcb.current, w[0]!, 0.14);
    fadeLineMaterials(database.current, w[4]!, 0.11);

    if (root.current) {
      root.current.rotation.y = t * 0.52 + Math.sin(performance.now() * 0.00035) * 0.04;
      root.current.rotation.x = t * 0.08;
    }
  });

  return (
    <group ref={root} scale={SCENE_SCALE}>
      {/* 0 — board + package + bus */}
      <group ref={pcb}>
        <group>
          <mesh
            userData={{ baseOpacity: 0.07 }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.62, 0]}
          >
            <planeGeometry args={[3.4, 3.4, 14, 14]} />
            <meshBasicMaterial color={primary} {...wf} opacity={0.07} />
          </mesh>
          <mesh userData={{ baseOpacity: 0.13 }} position={[0, -0.08, 0]}>
            <boxGeometry args={[1.05, 0.14, 1.05]} />
            <meshBasicMaterial color={primary} {...wf} opacity={0.13} />
          </mesh>
          <mesh userData={{ baseOpacity: 0.15 }} position={[0, 0.02, 0]}>
            <boxGeometry args={[0.42, 0.08, 0.42]} />
            <meshBasicMaterial color={secondary} {...wf} opacity={0.15} />
          </mesh>
          {[-0.38, 0, 0.38].flatMap((x) =>
            [-0.38, 0, 0.38].map((z) => (
              <mesh key={`${x}-${z}`} userData={{ baseOpacity: 0.09 }} position={[x, -0.14, z]}>
                <boxGeometry args={[0.06, 0.1, 0.06]} />
                <meshBasicMaterial color={secondary} {...wf} opacity={0.09} />
              </mesh>
            )),
          )}
          {codeLineLengths.map((len, i) => (
            <mesh
              key={i}
              userData={{ baseOpacity: 0.06 }}
              position={[-1.72, 0.35 - i * 0.11, 0.55]}
              rotation={[0, -0.35, 0]}
            >
              <boxGeometry args={[len, 0.035, 0.035]} />
              <meshBasicMaterial color={secondary} transparent opacity={0.06} />
            </mesh>
          ))}
          <group position={[-1.05, 0.2, 0.75]} rotation={[0, 0.4, 0]}>
            <mesh userData={{ baseOpacity: 0.1 }} position={[0, 0.14, 0]} rotation={[0, 0, 0.55]}>
              <boxGeometry args={[0.04, 0.32, 0.04]} />
              <meshBasicMaterial color={primary} {...wf} opacity={0.1} />
            </mesh>
            <mesh userData={{ baseOpacity: 0.1 }} position={[0, -0.14, 0]} rotation={[0, 0, -0.55]}>
              <boxGeometry args={[0.04, 0.32, 0.04]} />
              <meshBasicMaterial color={primary} {...wf} opacity={0.1} />
            </mesh>
          </group>
          <group position={[1.05, 0.2, 0.75]} rotation={[0, -0.4, 0]}>
            <mesh userData={{ baseOpacity: 0.1 }} position={[0, 0.14, 0]} rotation={[0, 0, -0.55]}>
              <boxGeometry args={[0.04, 0.32, 0.04]} />
              <meshBasicMaterial color={primary} {...wf} opacity={0.1} />
            </mesh>
            <mesh userData={{ baseOpacity: 0.1 }} position={[0, -0.14, 0]} rotation={[0, 0, 0.55]}>
              <boxGeometry args={[0.04, 0.32, 0.04]} />
              <meshBasicMaterial color={primary} {...wf} opacity={0.1} />
            </mesh>
          </group>
        </group>

        {bus.map(({ to }, i) => (
          <group key={i}>
            <Line
              points={[hub, to]}
              color={primary}
              lineWidth={1}
              transparent
              opacity={0.14}
              dashed
              dashSize={0.12}
              gapSize={0.08}
            />
            <mesh userData={{ baseOpacity: 0.11 }} position={to}>
              <boxGeometry args={[0.22, 0.22, 0.22]} />
              <meshBasicMaterial color={secondary} {...wf} opacity={0.11} />
            </mesh>
          </group>
        ))}
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

      {/* 3 — blade chassis (vertical blades + I/O + rails) */}
      <group ref={server}>
        <mesh userData={{ baseOpacity: 0.1 }} position={[0, 0, 0]}>
          <boxGeometry args={[1.68, 1.88, 0.48]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.1} />
        </mesh>
        {[-0.54, -0.36, -0.18, 0, 0.18, 0.36, 0.54].map((x) => (
          <mesh key={x} userData={{ baseOpacity: 0.085 }} position={[x, 0.04, -0.035]}>
            <boxGeometry args={[0.028, 1.58, 0.36]} />
            <meshBasicMaterial color={secondary} {...wf} opacity={0.085} />
          </mesh>
        ))}
        <mesh userData={{ baseOpacity: 0.065 }} position={[0, 0, 0.255]}>
          <planeGeometry args={[1.38, 1.62, 10, 12]} />
          <meshBasicMaterial color={primary} {...wf} opacity={0.065} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.09 }} position={[0, 0.98, 0.02]}>
          <boxGeometry args={[1.55, 0.12, 0.42]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.09} />
        </mesh>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh
            key={i}
            userData={{ baseOpacity: 0.1 }}
            position={[-0.68 + i * 0.152, -0.86, 0.248]}
          >
            <boxGeometry args={[0.055, 0.035, 0.025]} />
            <meshBasicMaterial color={primary} transparent opacity={0.1} />
          </mesh>
        ))}
        <mesh userData={{ baseOpacity: 0.07 }} position={[-0.83, 0, 0]}>
          <boxGeometry args={[0.04, 1.7, 0.42]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.07} />
        </mesh>
        <mesh userData={{ baseOpacity: 0.07 }} position={[0.83, 0, 0]}>
          <boxGeometry args={[0.04, 1.7, 0.42]} />
          <meshBasicMaterial color={secondary} {...wf} opacity={0.07} />
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
  const { scrollYProgress } = useScroll();
  const isDark = theme === "dark";
  const primary = isDark ? "#6ba3ff" : "#3d6ad4";
  const secondary = isDark ? "#8a8fb8" : "#64748b";

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
          camera={{ position: [2.35, 3.25, 4.85], fov: 42 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.6]}
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
