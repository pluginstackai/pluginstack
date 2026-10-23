import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPlugins, getPlugin, getPairedPack, site } from '../../../lib/data';
import { FREEBIE } from '../../../lib/email-copy';
import { pageMeta, summarize, categoryPath, breadcrumbLd, absUrl, WEBSITE_ID, plugins, type ListedPlugin } from '../../../lib/seo';
import CodeBlock from '../../../components/CodeBlock';
import JsonLd from '../../../components/JsonLd';
import PluginGrid from '../../../components/PluginGrid';
import YouTubeDemo from '../../../components/YouTubeDemo';
import PackPairing from '../../../components/PackPairing';
import EmailForm from '../../../components/EmailForm';
export const generateStaticParams = () => getPlugins().map(p => ({ slug: p.slug }));
export const dynamicParams = false;
const fmtDate = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPlugin((await params).slug) as ListedPlugin | undefined; if (!p) return {};
  return pageMeta({ title: `${p.name}: what it does & how to set it up`, description: summarize(p.what), path: `/plugins/${p.slug}/`, image: { url: `/og/${p.slug}.png`, alt: `${p.name} on ${site.name}: what it does and how to set it up` } });
}
export default async function PluginPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPlugin((await params).slug) as ListedPlugin | undefined; if (!p) notFound();
  const path = `/plugins/${p.slug}/`; const catPath = categoryPath(p.category);
  if (p.demo && !/^[A-Za-z0-9_-]{11}$/.test(p.demo.youtubeId)) throw new Error(`Invalid demo.youtubeId for ${p.slug}`);
  const related = plugins().filter(x => x.category === p.category && x.slug !== p.slug).slice(0, 6);
  const paired = getPairedPack(p.slug);
  const crumbs = [{ name: 'Home', path: '/' }, { name: p.category, path: catPath }, { name: p.name, path }];
  // Describes the third-party tool truthfully: no ratings, reviews or prices.
  const ld = { '@graph': [
    { '@type': 'WebPage', '@id': `${absUrl(path)}#webpage`, url: absUrl(path), name: `${p.name}: what it does & how to set it up`, description: summarize(p.what), inLanguage: 'en', isPartOf: { '@id': WEBSITE_ID }, about: { '@id': `${absUrl(path)}#software` }, ...(p.updated && { dateModified: p.updated }), breadcrumb: { '@id': `${absUrl(path)}#breadcrumb` } },
    { '@type': 'SoftwareApplication', '@id': `${absUrl(path)}#software`, name: p.name, description: p.what, url: p.url, applicationCategory: 'DeveloperApplication', keywords: p.tags.join(', ') },
    { '@id': `${absUrl(path)}#breadcrumb`, ...breadcrumbLd(crumbs) },
  ] };
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>;
  return (<article className="max-w-3xl mx-auto py-8 space-y-8 min-w-0">
    <JsonLd data={ld} />
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-400"><ol className="flex flex-wrap gap-1">
        <li><Link href="/" className="link">Home</Link> ›</li><li><Link href={catPath} className="link">{p.category}</Link> ›</li><li aria-current="page">{p.name}</li></ol></nav>
      <div className="text-sm text-coral-dark dark:text-coral mt-3">{p.category} · by {p.maker}</div>
      <h1 className="text-4xl font-bold mt-1">{p.name}</h1>
      <a href={p.url} target="_blank" rel="noopener" className="btn mt-4 inline-block">{p.name} official site ↗</a>
      {p.updated && <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">Last checked against the official docs: <time dateTime={p.updated}>{fmtDate(p.updated)}</time></p>}</div>
    <section className="card"><H>What it does</H><p className="text-slate-700 dark:text-slate-300">{p.what}</p></section>
    <section className="card"><H>Who it's for</H><p className="text-slate-700 dark:text-slate-300">{p.who}</p></section>
    <section className="card"><H>How to set it up</H><ol className="list-decimal pl-5 space-y-4 text-slate-700 dark:text-slate-300">{p.setup.map((s, i) => <li key={i} className="min-w-0"><p>{s.text}</p>{s.code && <div className="mt-2"><CodeBlock code={s.code} language={s.language} /></div>}</li>)}</ol>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">Check the <a className="link" href={p.url}>official {p.name} docs</a> for the latest steps.</p></section>
    {paired && <PackPairing pack={paired.pack} why={paired.why} toolName={p.name} />}
    <section className="card"><H>Example prompts</H><div className="space-y-3">{p.prompts.map((s, i) => <CodeBlock key={i} code={s} tone="prompt" />)}</div></section>
    {p.demo && <section className="card"><H>Demo</H>
      <YouTubeDemo id={p.demo.youtubeId} title={p.demo.title} channel={p.demo.channel} toolName={p.name} /></section>}
    <section aria-labelledby="join-list" className="card">
      <h2 id="join-list" className="text-lg font-semibold">{FREEBIE.toolHeadline}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">{FREEBIE.toolSubline}</p>
      <EmailForm list="newsletter" cta={FREEBIE.toolCta} microcopy={FREEBIE.toolMicro} /></section>
    {related.length > 0 && <section aria-labelledby="related"><h2 id="related" className="text-xl font-semibold mb-3">More {p.category}</h2>
      <PluginGrid items={related} heading="h3" showCategory={false} />
      <p className="mt-4 text-sm"><Link href={catPath} className="link">See all {p.category} on {site.name}</Link></p></section>}
  </article>);
}
