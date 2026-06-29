import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently in view.
 *
 * Picks the last section whose top has crossed an activation line near the top
 * of the viewport. This is height-agnostic: a very tall section (e.g. a long
 * projects grid) stays active for its whole span, where an intersection-ratio
 * approach would lose to shorter neighbours.
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const compute = () => {
      const line = window.innerHeight * 0.4;
      let current = elements[0]!.id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id;
      }
      setActiveId(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [sectionIds]);

  return activeId;
}
