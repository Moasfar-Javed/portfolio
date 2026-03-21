import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";
import { LenisRefContext } from "./lenis-context";

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      touchMultiplier: 1.15,
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
  }, []);

  return (
    <LenisRefContext.Provider value={lenisRef}>{children}</LenisRefContext.Provider>
  );
}
