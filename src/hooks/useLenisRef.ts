import { useContext, type RefObject } from "react";
import type Lenis from "lenis";
import { LenisRefContext } from "../context/lenis-context";

export function useLenisRef(): RefObject<Lenis | null> {
  const ctx = useContext(LenisRefContext);
  if (!ctx) throw new Error("useLenisRef must be used within LenisProvider");
  return ctx;
}
