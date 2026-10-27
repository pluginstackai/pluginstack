import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { site } from '../../../lib/data';
import { GUIDES, getGuide, guidePath } from '../../../lib/guides';
import { pageMeta, breadcrumbLd, absUrl, WEBSITE_ID, ORG_ID, plugins } from '../../../lib/seo';
import GuideBody from '../../../components/GuideBody';
import JsonLd from '../../../components/JsonLd';
import PluginGrid from '../../../components/PluginGrid';
export const generateStaticParams = () => GUIDES.map(g => ({ slug: g.slug }));
export const dynamicParams = false;
const fmtDate = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuide((await params).slug); if (!g) return {};
  const meta = pageMeta({ title: g.title, description: g.description, path: guidePath(g.slug) });
  return { ...meta, openGraph: { ...meta.openGraph, type: 'article', publishedTime: g.published, modifiedTime: g.updated } };
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug); if (!g) notFound();
  const path = guidePath(g.slug); const url = absUrl(path);
  const all = plugins();
  const related = g.related.map(s => { const p = all.find(x => x.slug === s); if (!p) throw new Error(`Guide ${g.slug}: unknown related listing ${s}`); return p; });
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides/' }, { name: g.h1, path }];
  const ld = { '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: g.h1, description: g.description, url, mainEntityOfPage: url, inLanguage: 'en',
      datePublished: g.published, dateModified: g.updated, author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID }, isPartOf: { '@id': WEBSITE_ID },
      image: absUrl('/og.png') },
    { '@type': 'Organization', '@id': ORG_ID, name: site.name, url: `${site.url}/`, logo: { '@type': 'ImageObject', url: absUrl('/logo.png') } },
    { '@id': `${url}#breadcrumb`, ...breadcrumbLd(crumbs) },
  ] };
  const toc = g.blocks.filter((b): b is { h2: string; id: string } => 'h2' in b && !!b.id);
  return (<article className="max-w-3xl mx-auto py-8 min-w-0">
    <JsonLd data={ld} />
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-400"><ol className="flex flex-wrap gap-1">
      <li><Link href="/" className="link">Home</Link> ›</li><li><Link href="/guides/" className="link">Guides</Link> ›</li><li aria-current="page">{g.h1}</li></ol></nav>
    <div className="text-sm text-coral-dark dark:text-coral mt-3">{g.kind ?? 'Setup guide'}</div>
    <h1 className="text-4xl font-bold mt-1">{g.h1}</h1>
    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">{g.checkedLabel ?? 'Checked against the official docs'}: <time dateTime={g.updated}>{fmtDate(g.updated)}</time></p>
    <p className="text-lg text-slate-700 dark:text-slate-300 mt-5">{g.intro.split('`').map((t, i) => i % 2 ? <code key={i} className="rounded bg-navy/5 dark:bg-navy-800 px-1 py-0.5 text-[0.9em]">{t}</code> : t)}</p>
    {toc.length > 2 && <nav aria-labelledby="toc" className="card mt-6"><h2 id="toc" className="font-semibold mb-2">On this page</h2>
      <ol className="list-decimal pl-5 space-y-1 text-sm">{toc.map(t => <li key={t.id}><a href={`#${t.id}`} className="link">{t.h2}</a></li>)}</ol></nav>}
    <div className="mt-4"><GuideBody blocks={g.blocks} /></div>
    <section aria-labelledby="sources" className="mt-10 card">
      <h2 id="sources" className="font-semibold mb-2">Sources</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{g.sourcesNote ?? 'Commands and config above come from these official docs. Tools change often, so check them for the latest steps.'}</p>
      <ul className="list-disc pl-5 space-y-1 text-sm">{g.sources.map(s => <li key={s.url}><a href={s.url} className="link" target="_blank" rel="noopener">{s.label}</a></li>)}</ul>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">{site.name} is independent and not affiliated with or endorsed by the companies mentioned. Spotted something out of date? Email <a className="link" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.</p>
    </section>
    {related.length > 0 && <section aria-labelledby="related" className="mt-10"><h2 id="related" className="text-xl font-semibold mb-3">Tools in this guide</h2>
      <PluginGrid items={related} heading="h3" /></section>}
  </article>);
}
