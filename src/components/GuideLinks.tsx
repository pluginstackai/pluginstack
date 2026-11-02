import Link from 'next/link';
import { guidePath, type Guide } from '../lib/guides';
import type { GuideRole } from '../lib/guide-links';
const LABEL: Record<GuideRole, string> = { setup: 'Setup', fix: 'Fix', explainer: 'Explainer', learn: 'Learn' };
/** Small card listing links to guides (listing "Set it up / Fixes" block and guide "Related guides" block). */
export default function GuideLinks({ id, title, intro, items }: { id: string; title: string; intro?: string; items: { guide: Guide; role: GuideRole }[] }) {
  return (<section aria-labelledby={id} className="card">
    <h2 id={id} className="text-xl font-semibold mb-1">{title}</h2>
    {intro && <p className="text-sm text-slate-600 dark:text-slate-400">{intro}</p>}
    <ul className="mt-3 space-y-3">{items.map(({ guide, role }) => <li key={guide.slug} className="min-w-0">
      <span className="mr-2 inline-block rounded-full border border-navy/10 px-2 py-0.5 text-xs font-medium text-coral-dark dark:border-navy-700 dark:text-coral">{LABEL[role]}<span className="sr-only">:</span></span>
      <Link href={guidePath(guide.slug)} className="link font-medium">{guide.h1}</Link>
    </li>)}</ul>
  </section>);
}
