import fs from "node:fs";
import path from "node:path";
import type { Project } from "@/content/work";

/**
 * Returns a project's cover path only if the file actually exists in /public.
 *
 * Case study art arrives later than case study copy, so `work.ts` can name a
 * cover before anyone has exported it. Checking here -- at build time, in a
 * server component -- means an unfilled slot degrades to the generated colour
 * field rather than shipping a broken image.
 */
export function coverFor(cover?: string): string | undefined {
  if (!cover) return undefined;
  const file = path.join(process.cwd(), "public", cover.replace(/^\//, ""));
  return fs.existsSync(file) ? cover : undefined;
}

/** Same check, applied across a list of projects. */
export function withCovers(list: readonly Project[]): Project[] {
  return list.map((project) => ({ ...project, cover: coverFor(project.cover) }));
}
