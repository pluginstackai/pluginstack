import Link from 'next/link';
import type { AffiliateSpec } from '../lib/data';

/**
 * A labeled affiliate link with the disclosure right next to it (FTC: clear, close to the link, before the click).
 * rel="sponsored nofollow" marks it as a paid link for search engines, as promised on /disclosures/.
 */
export default function AffiliateLink({ spec }: { spec: AffiliateSpec }) {
  return (<div className="mt-3 text-sm">
    <p className="text-slate-700 dark:text-slate-300">
      <a href={spec.url} target="_blank" rel="sponsored nofollow noopener" className="link font-semibold">{spec.cta} ↗</a>{' '}
      <b>(affiliate link)</b>
    </p>
    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">If you sign up or buy through this link, we may earn a commission from {spec.program}, at no extra cost to you. It doesn&apos;t change what we say about the tool. <Link href="/disclosures/#affiliate-links" className="link">Disclosures</Link></p>
  </div>);
}
