import { getPlugins, site } from '../lib/data';
export const dynamic = 'force-static';
export default function sitemap() {
  return ['', 'packs/', 'get-unstuck/', 'sponsor/', 'privacy/', 'terms/', 'disclosures/', ...getPlugins().map(p => `plugins/${p.slug}/`)].map(p => ({ url: `${site.url}/${p}` }));
}
