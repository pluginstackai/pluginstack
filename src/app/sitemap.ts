import type { MetadataRoute } from 'next';
import { site } from '../lib/data';
import { plugins, getCategories, latest, PAGE_UPDATED } from '../lib/seo';
export const dynamic = 'force-static';
// Public, indexable pages only (no /api/*). URLs match what pages serve with 200 (trailing slash).
export default function sitemap(): MetadataRoute.Sitemap {
  const all = plugins(); const d = (s?: string) => (s ? new Date(`${s}T00:00:00Z`) : undefined);
  return [
    { url: `${site.url}/`, lastModified: d(latest(all)) },
    ...getCategories().map(c => ({ url: `${site.url}${c.path}`, lastModified: d(c.updated) })),
    ...all.map(p => ({ url: `${site.url}/plugins/${p.slug}/`, lastModified: d(p.updated) })),
    ...Object.entries(PAGE_UPDATED).map(([path, date]) => ({ url: `${site.url}${path}`, lastModified: d(date) })),
  ];
}
