/** Coordinates first-load deep links so the page can paint before navigating. */

let suppressPathSync = false;

export function setSuppressPathSync(value: boolean) {
  suppressPathSync = value;
}

export function shouldSuppressPathSync() {
  return suppressPathSync;
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Pause so the hero can paint before we scroll / open overlays. */
export function deepLinkIntroDelay(reduceMotion: boolean) {
  return reduceMotion ? 0 : 520;
}
