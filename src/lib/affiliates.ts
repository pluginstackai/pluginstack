import { getPlugins } from './data';
import { GUIDES, guidePath } from './guides';

export type AffiliatePage = { href: string; label: string };

/**
 * Affiliate programs we're in, derived from the `affiliate` field on listings so /disclosures/ can't drift from the pages.
 * Every listing with an affiliate link must name its program; we fail the build if a link isn't https.
 * Guide pages that render an `{ affiliate: '<listing-slug>' }` block are listed next to that listing.
 */
export function affiliatePrograms(): { program: string; slug: string; name: string; pages: AffiliatePage[] }[] {
  return getPlugins().filter(p => p.affiliate).map(p => {
    const a = p.affiliate!;
    if (!/^https:\/\//.test(a.url)) throw new Error(`${p.slug}: affiliate.url must be https`);
    if (!a.program?.trim() || !a.cta?.trim()) throw new Error(`${p.slug}: affiliate needs program and cta`);
    const pages: AffiliatePage[] = [{ href: `/plugins/${p.slug}/`, label: `${p.name} page` }];
    for (const g of GUIDES) {
      if (g.blocks.some(b => 'affiliate' in b && b.affiliate === p.slug)) {
        pages.push({ href: guidePath(g.slug), label: `${g.h1} guide` });
      }
    }
    return { program: a.program, slug: p.slug, name: p.name, pages };
  }).sort((x, y) => x.program.localeCompare(y.program));
}
