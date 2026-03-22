import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

type CursorVariant = "default" | "pointer" | "text";

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

function resolveVariant(el: Element | null): CursorVariant {
  if (!el || !(el instanceof HTMLElement)) return "default";
  const attr = el.closest("[data-cursor]")?.getAttribute("data-cursor");
  if (attr === "text") return "text";
  const interactive = el.closest(
    "a, button, [role='button'], input, textarea, select, summary, label[for]",
  );
  return interactive ? "pointer" : "default";
}

export function CustomCursor() {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 320, damping: 32, mass: 0.35 });
  const sy = useSpring(my, { stiffness: 320, damping: 32, mass: 0.35 });
  const ox = useSpring(mx, { stiffness: 420, damping: 38, mass: 0.2 });
  const oy = useSpring(my, { stiffness: 420, damping: 38, mass: 0.2 });

  useEffect(() => {
    if (!fine || reduce) {
      document.documentElement.classList.remove("custom-cursor-active");
      return () => document.documentElement.classList.remove("custom-cursor-active");
    }

    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
      const under = document.elementFromPoint(e.clientX, e.clientY);
      setVariant(resolveVariant(under));
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.body.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [fine, reduce, mx, my]);

  if (!fine || reduce) return null;

  const ringScale = variant === "pointer" ? 1.65 : variant === "text" ? 1.15 : 1;
  const dotScale = variant === "pointer" ? 0.35 : variant === "text" ? 0.15 : 1;
  const ringOpacity = visible ? 1 : 0;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: ringScale,
          opacity: ringOpacity,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        <div
          className="h-9 w-9 rounded-full border border-white/90"
          style={{ opacity: 0.85 }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[91]"
        style={{ x: ox, y: oy, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: dotScale,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      >
        {variant === "text" ? (
          <div className="h-0.5 w-5 rounded-full bg-accent shadow-[0_0_12px_var(--glow)]" />
        ) : (
          <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_var(--glow)]" />
        )}
      </motion.div>
    </>
  );
}
