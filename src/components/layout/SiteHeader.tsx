import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { navItems, siteMeta } from "../../data/site";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useLenisRef } from "../../hooks/useLenisRef";
import { useTheme } from "../../hooks/useTheme";
import { easing } from "../../lib/motion";
import { Container } from "../ui/Container";

const sectionIds = navItems.map((n) => n.id);

export function SiteHeader() {
  const activeId = useActiveSection(sectionIds);
  const lenisRef = useLenisRef();
  const { theme, toggleTheme } = useTheme();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollTo = useCallback(
    (href: string) => {
      if (!href.startsWith("#")) return;
      const el = document.querySelector(href);
      const lenis = lenisRef.current;
      if (el instanceof HTMLElement && lenis) {
        lenis.scrollTo(el, { offset: -76, duration: 1.1 });
      } else if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setOpen(false);
    },
    [lenisRef],
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled
            ? "border-b border-border bg-surface-0/80 shadow-soft backdrop-blur-xl dark:bg-surface-0/75"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <a
            href="#hero"
            className="group flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#hero");
            }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong bg-surface-1 text-xs font-semibold tracking-tight text-fg shadow-soft">
              AC
            </span>
            <span className="hidden flex-col sm:flex">
              <span className="text-sm font-medium tracking-tight text-fg">
                {siteMeta.shortTitle}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
                {siteMeta.tagline}
              </span>
            </span>
          </a>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const active = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "text-fg"
                      : "text-fg-muted hover:text-fg"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.href);
                  }}
                >
                  {active && !reduce ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-border-strong bg-surface-1 shadow-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : active ? (
                    <span className="absolute inset-0 -z-10 rounded-full border border-border-strong bg-surface-1 shadow-soft" />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-surface-1 text-fg shadow-soft transition-colors hover:border-accent/35 hover:bg-surface-2"
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <ThemeToggleGlyph theme={theme} reduceMotion={Boolean(reduce)} />
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-surface-1 text-fg shadow-soft transition-colors hover:border-accent/35 hover:bg-surface-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">Menu</span>
              <div className="flex w-5 flex-col gap-1">
                <motion.span
                  animate={{
                    rotate: open ? 45 : 0,
                    y: open ? 6 : 0,
                  }}
                  className="h-0.5 w-full origin-center rounded-full bg-fg"
                  transition={{ duration: 0.25, ease: easing }}
                />
                <motion.span
                  animate={{ opacity: open ? 0 : 1 }}
                  className="h-0.5 w-full rounded-full bg-fg"
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  animate={{
                    rotate: open ? -45 : 0,
                    y: open ? -6 : 0,
                  }}
                  className="h-0.5 w-full origin-center rounded-full bg-fg"
                  transition={{ duration: 0.25, ease: easing }}
                />
              </div>
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-surface-0/70 backdrop-blur-md dark:bg-black/60"
              aria-label="Close menu overlay"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-surface-1 px-6 pb-10 pt-24 shadow-soft"
              aria-label="Mobile primary"
            >
              <ul className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, ease: easing }}
                  >
                    <a
                      href={item.href}
                      className={`block rounded-xl px-4 py-3 text-base ${
                        activeId === item.id
                          ? "bg-surface-2 text-fg"
                          : "text-fg-muted hover:bg-surface-2/70 hover:text-fg"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(item.href);
                      }}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/** Shown in header: sun when dark (switch to light), moon when light (switch to dark). */
function ThemeToggleGlyph({
  theme,
  reduceMotion,
}: {
  theme: "light" | "dark";
  reduceMotion: boolean;
}) {
  const t = reduceMotion ? { duration: 0 } : { duration: 0.32, ease: easing };

  /* Match mobile menu: w-5 column + h-0.5 (2px) bars → stroke ≈ 2.35 in 24px viewBox at 20px size */
  const sw = 2.35;

  return (
    <span className="relative flex h-5 w-5 items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="to-light"
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.45, rotate: -100 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.55, rotate: 80 }}
            transition={t}
          >
            <svg
              className="h-full w-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3.65" />
              <path d="M12 2v1.65M12 20.35V22M4.22 4.22l1.24 1.24M18.54 18.54l1.24 1.24M2 12h1.65M20.35 12H22M4.22 19.78l1.24-1.24M18.54 5.46l1.24-1.24" />
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key="to-dark"
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.45, rotate: 100 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.55, rotate: -80 }}
            transition={t}
          >
            <svg
              className="h-full w-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              <circle cx="17.25" cy="7.35" r="0.72" fill="currentColor" stroke="none" />
              <circle cx="19.35" cy="10.15" r="0.55" fill="currentColor" stroke="none" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
