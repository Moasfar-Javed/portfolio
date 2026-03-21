import { createContext, type RefObject } from "react";
import type Lenis from "lenis";

export const LenisRefContext = createContext<RefObject<Lenis | null> | null>(
  null,
);
