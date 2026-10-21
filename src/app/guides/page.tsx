import Link from 'next/link';
import { site } from '../../lib/data';
import { GUIDES, guidePath } from '../../lib/guides';
import { pageMeta, breadcrumbLd, absUrl, WEBSITE_ID } from '../../lib/seo';
import JsonLd from '../../components/JsonLd';
export const metadata = pageMeta({ title: 'Setup guides for MCP servers and AI coding tools', description: `Step-by-step guides to setting up MCP servers in Cursor and Claude Code, with real config, exact commands and fixes for common errors.`, path: '/guides/' });
export default function Guides() {
  const url = absUrl('/guides/');
  const ld = { '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: 'Guides', inLanguage: 'en', isPartOf: { '@id': WEBSITE_ID }, breadcrumb: { '@id': `${url}#breadcrumb` },
      mainEntity: { '@type': 'ItemList', numberOfItems: GUIDES.length, itemListElement: GUIDES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: absUrl(guidePath(g.slug)), name: g.h1 })) } },
    { '@id': `${url}#breadcrumb`, ...breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides/' }]) },
  ] };
  return (<div className="py-8">
    <JsonLd data={ld} />
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-400"><ol className="flex flex-wrap gap-1"><li><Link href="/" className="link">Home</Link> ›</li><li aria-current="page">Guides</li></ol></nav>
    <h1 className="text-4xl font-bold mt-3">Guides</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-2 mb-8 max-w-2xl">Step-by-step setup guides for MCP servers and AI coding tools. Every command and config snippet is checked against the official docs, and each guide links to its sources.</p>
    <ul className="grid gap-4 sm:grid-cols-2">{GUIDES.map(g => (
      <li key={g.slug} className="min-w-0"><Link href={guidePath(g.slug)} className="card block h-full transition hover:-translate-y-0.5 hover:shadow-md hover:border-coral-dark dark:hover:border-coral">
        <div className="text-xs text-coral-dark dark:text-coral mb-1">Setup guide</div>
        <h2 className="font-semibold text-lg text-navy dark:text-white">{g.h1}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{g.description}</p>
      </Link></li>))}</ul>
    <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">Looking for a specific tool? Browse the <Link href="/" className="link">{site.name} directory</Link>.</p>
  </div>);
}
