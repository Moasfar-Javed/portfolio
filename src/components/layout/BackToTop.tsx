import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useLenisRef } from "../../hooks/useLenisRef";
import { trackEvent } from "../../lib/analytics";
import { easing } from "../../lib/motion";

const SHOW_AFTER = 520;

export function BackToTop() {
  const lenisRef = useLenisRef();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = useCallback(() => {
    trackEvent("back_to_top_click");
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, {
        duration: reduce ? 0 : 1.2,
        immediate: Boolean(reduce),
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  }, [lenisRef, reduce]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none fixed bottom-6 right-5 z-40 md:bottom-8 md:right-8"
          initial={reduce ? false : { opacity: 0, y: 10, scale: 0.92 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.92 }}
          transition={{ duration: 0.35, ease: easing }}
        >
          <button
            type="button"
            onClick={goTop}
            aria-label="Back to top"
            className="glass-card pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-fg shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:border-accent/35 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.94] md:h-12 md:w-12"
          >
            <svg
              className="h-5 w-5 md:h-[1.35rem] md:w-[1.35rem]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
