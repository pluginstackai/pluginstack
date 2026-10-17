import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { site } from '../../../lib/data';
import { getCategories, getCategory, pageMeta, breadcrumbLd, absUrl, summarize, WEBSITE_ID } from '../../../lib/seo';
import JsonLd from '../../../components/JsonLd';
import PluginGrid from '../../../components/PluginGrid';
export const generateStaticParams = () => getCategories().map(c => ({ slug: c.slug }));
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCategory((await params).slug); if (!c) return {};
  return pageMeta({ title: `${c.name}: ${c.items.length} tools explained`, description: summarize(`${c.intro} Plain-English guides with setup steps and example prompts.`), path: c.path });
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug); if (!c) notFound();
  const others = getCategories().filter(x => x.slug !== c.slug);
  const ld = { '@graph': [
    { '@type': 'CollectionPage', '@id': `${absUrl(c.path)}#webpage`, url: absUrl(c.path), name: c.name, description: c.intro, inLanguage: 'en', isPartOf: { '@id': WEBSITE_ID }, breadcrumb: { '@id': `${absUrl(c.path)}#breadcrumb` },
      mainEntity: { '@type': 'ItemList', numberOfItems: c.items.length, itemListElement: c.items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absUrl(`/plugins/${p.slug}/`), name: p.name })) } },
    { '@id': `${absUrl(c.path)}#breadcrumb`, ...breadcrumbLd([{ name: 'Home', path: '/' }, { name: c.name, path: c.path }]) },
  ] };
  return (<div className="py-8">
    <JsonLd data={ld} />
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-400"><ol className="flex flex-wrap gap-1"><li><Link href="/" className="link">Home</Link> ›</li><li aria-current="page">{c.name}</li></ol></nav>
    <h1 className="text-4xl font-bold mt-3">{c.name}</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-2 mb-8 max-w-2xl">{c.intro} Each page explains what the tool does, who it's for and how to set it up, checked against the official docs.</p>
    <PluginGrid items={c.items} showCategory={false} />
    <nav aria-labelledby="other-cats" className="mt-12"><h2 id="other-cats" className="text-xl font-semibold mb-3">Other categories on {site.name}</h2>
      <ul className="flex flex-wrap gap-2">{others.map(o => <li key={o.slug}><Link href={o.path} className="inline-block rounded-full border border-navy/15 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-1 text-sm hover:border-coral-dark dark:hover:border-coral">{o.name} ({o.items.length})</Link></li>)}</ul></nav>
  </div>);
}
