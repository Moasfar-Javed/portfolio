/** Glass panels: subtle lift; accent rim/glow comes from `SpotlightSurface` + cursor. */
export const GLASS_CARD_HOVER =
  "transition-[box-shadow] duration-500 ease-out hover:shadow-soft";

/** Tags / chips: respond to pointer or parent `group` hover */
export const PILL_CHIP_HOVER =
  "transition-[border-color,color] duration-300 hover:border-accent/25 hover:text-fg group-hover:border-accent/25 group-hover:text-fg";

/** Muted inset panels (dashed card, etc.) */
export const INSET_PANEL_HOVER =
  "transition-[border-color,box-shadow] duration-500 ease-out hover:border-accent/30 hover:shadow-soft";

/** Non-link rows (bullet lists) — same “lift” language as secondary buttons */
export const ROW_HOVER =
  "rounded-xl px-3 py-2 -mx-2 transition-colors duration-300 hover:bg-surface-2/65 dark:hover:bg-surface-2/40";

/** Text links aligned with ghost / nav affordance */
export const LINK_HOVER =
  "rounded-lg px-2 py-1 -mx-2 transition-colors duration-300 hover:bg-surface-2/70 hover:text-fg";
