import Lenis from "lenis";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LenisRefContext } from "./lenis-context";

function readLenisShouldRun() {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /** Native scroll on touch-primary devices avoids Lenis’ perpetual RAF + smoother finger scrolling. */
  return !coarse && !reduceMotion;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisActive, setLenisActive] = useState(readLenisShouldRun);

  useEffect(() => {
    const coarseMq = window.matchMedia("(pointer: coarse)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setLenisActive(readLenisShouldRun());
    sync();
    coarseMq.addEventListener("change", sync);
    reduceMq.addEventListener("change", sync);
    return () => {
      coarseMq.removeEventListener("change", sync);
      reduceMq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!lenisActive) {
      lenisRef.current = null;
      return;
    }

    const instance = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: 1,
      lerp: 0.085,
    });
    lenisRef.current = instance;
    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [lenisActive]);

  return (
    <LenisRefContext.Provider value={lenisRef}>{children}</LenisRefContext.Provider>
  );
}
