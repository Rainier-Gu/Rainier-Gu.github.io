import fs from 'fs';
import path from 'path';

const SAFE_SLUG = /^[^<>:"/\\|?*\u0000-\u001F]+$/u;

export function decodeRouteSlug(slug: string) {
  if (!slug || slug.length > 540) return null;

  try {
    return decodeURIComponent(slug);
  } catch {
    return null;
  }
}

export function resolveMarkdownPath(directory: string, slug: string) {
  if (
    !slug ||
    slug === '.' ||
    slug === '..' ||
    slug.length > 180 ||
    !SAFE_SLUG.test(slug) ||
    path.basename(slug) !== slug
  ) {
    return null;
  }

  const baseDirectory = path.resolve(directory);
  const candidate = path.resolve(baseDirectory, `${slug}.md`);
  if (!candidate.startsWith(`${baseDirectory}${path.sep}`)) return null;
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) return null;

  return candidate;
}
