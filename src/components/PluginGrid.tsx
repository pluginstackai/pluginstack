import Link from 'next/link';
import type { ListedPlugin } from '../lib/seo';
/** Server-rendered list of plugin cards. `heading` sets the card title level so pages keep a correct heading order. */
export default function PluginGrid({ items, heading = 'h2', showCategory = true }: { items: ListedPlugin[]; heading?: 'h2' | 'h3'; showCategory?: boolean }) {
  const H = heading;
  return (<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(p => (
    <li key={p.slug} className="min-w-0"><Link href={`/plugins/${p.slug}/`} className="card block h-full transition hover:-translate-y-0.5 hover:shadow-md hover:border-coral-dark dark:hover:border-coral">
      <div className="text-xs text-coral-dark dark:text-coral mb-1">{showCategory ? `${p.category} · ` : ''}{p.maker}</div>
      <H className="font-semibold text-lg text-navy dark:text-white">{p.name}</H>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{p.what}</p>
    </Link></li>))}</ul>);
}
