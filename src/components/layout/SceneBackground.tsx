import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "../../hooks/useTheme";

function WireMesh({
  primary,
  secondary,
  paused,
}: {
  primary: string;
  secondary: string;
  paused: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (paused || !group.current) return;
    group.current.rotation.y += delta * 0.07;
    group.current.rotation.x += delta * 0.025;
  });

  return (
    <group ref={group}>
      <Float speed={0.65} rotationIntensity={0.12} floatIntensity={0.35}>
        <mesh>
          <torusGeometry args={[2.35, 0.05, 24, 160]} />
          <meshBasicMaterial
            color={primary}
            wireframe
            transparent
            opacity={0.14}
          />
        </mesh>
      </Float>

      <mesh rotation={[0.9, 0.35, 0.2]} position={[1.35, -0.35, -0.45]}>
        <icosahedronGeometry args={[0.78, 0]} />
        <meshBasicMaterial
          color={secondary}
          wireframe
          transparent
          opacity={0.09}
        />
      </mesh>

      <mesh rotation={[-0.25, -0.55, 0.15]} position={[-1.5, 0.45, 0.15]}>
        <torusKnotGeometry args={[0.42, 0.12, 96, 12]} />
        <meshBasicMaterial
          color={primary}
          wireframe
          transparent
          opacity={0.07}
        />
      </mesh>

      <mesh rotation={[0.15, 0, 0.4]} position={[0.2, 1.1, -0.8]}>
        <boxGeometry args={[1.6, 0.04, 0.04]} />
        <meshBasicMaterial
          color={secondary}
          transparent
          opacity={0.05}
        />
      </mesh>
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
  const isDark = theme === "dark";
  const primary = isDark ? "#6ba3ff" : "#3d6ad4";
  const secondary = isDark ? "#8a8fb8" : "#64748b";

  if (reduce || !fine) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-surface-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--glow),transparent)] opacity-70 dark:opacity-100" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-surface-0" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,var(--glow),transparent)] opacity-50 dark:opacity-[0.85]" />
      <Canvas
        className="!absolute inset-0 h-full w-full"
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.6]}
      >
        <WireMesh
          key={theme}
          primary={primary}
          secondary={secondary}
          paused={false}
        />
      </Canvas>
    </div>
  );
}
