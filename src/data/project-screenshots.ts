import type { ProjectScreenshot } from "./site";

export type ScreenshotEntry = {
  file: string;
  description?: string;
};

/** Map ordered asset filenames to full screenshot objects for a project folder. */
export function projectScreenshots(
  slug: string,
  entries: ScreenshotEntry[],
): ProjectScreenshot[] {
  return entries.map(({ file, description = "" }) => ({
    src: `/assets/projects/${slug}/${file}`,
    description,
  }));
}
