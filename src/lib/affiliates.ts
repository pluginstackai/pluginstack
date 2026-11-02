import { getPlugins } from './data';

/**
 * Affiliate programs we're in, derived from the `affiliate` field on listings so /disclosures/ can't drift from the pages.
 * Every listing with an affiliate link must name its program; we fail the build if a link isn't https.
 */
export function affiliatePrograms(): { program: string; slug: string; name: string }[] {
  return getPlugins().filter(p => p.affiliate).map(p => {
    const a = p.affiliate!;
    if (!/^https:\/\//.test(a.url)) throw new Error(`${p.slug}: affiliate.url must be https`);
    if (!a.program?.trim() || !a.cta?.trim()) throw new Error(`${p.slug}: affiliate needs program and cta`);
    return { program: a.program, slug: p.slug, name: p.name };
  }).sort((x, y) => x.program.localeCompare(y.program));
}
