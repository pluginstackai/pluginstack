import { getPlugins, getPlugin, site } from '../../../lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CodeBlock from '../../../components/CodeBlock';
export const generateStaticParams = () => getPlugins().map(p => ({ slug: p.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPlugin((await params).slug); if (!p) return {};
  return { title: `${p.name}: what it does & how to set it up`, description: p.what, alternates: { canonical: `/plugins/${p.slug}/` }, openGraph: { title: p.name, description: p.what, images: ['/og.png'] } };
}
export default async function PluginPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPlugin((await params).slug); if (!p) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: p.name, applicationCategory: 'DeveloperApplication', description: p.what, url: p.url, author: { '@type': 'Organization', name: p.maker }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>;
  return (<article className="max-w-3xl mx-auto py-8 space-y-8 min-w-0">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <div><div className="text-sm text-coral-dark dark:text-coral">{p.category} · by {p.maker}</div>
      <h1 className="text-4xl font-bold mt-1">{p.name}</h1>
      <a href={p.url} target="_blank" rel="noopener" className="btn mt-4 inline-block">Official site ↗</a></div>
    <section className="card"><H>What it does</H><p className="text-slate-700 dark:text-slate-300">{p.what}</p></section>
    <section className="card"><H>Who it's for</H><p className="text-slate-700 dark:text-slate-300">{p.who}</p></section>
    <section className="card"><H>How to set it up</H><ol className="list-decimal pl-5 space-y-4 text-slate-700 dark:text-slate-300">{p.setup.map((s, i) => <li key={i} className="min-w-0"><p>{s.text}</p>{s.code && <div className="mt-2"><CodeBlock code={s.code} language={s.language} /></div>}</li>)}</ol>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">Check the <a className="link" href={p.url}>official docs</a> for the latest steps.</p></section>
    <section className="card"><H>Example prompts</H><div className="space-y-3">{p.prompts.map((s, i) => <CodeBlock key={i} code={s} tone="prompt" />)}</div></section>
    <section className="card"><H>Demo</H>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-navy/10 dark:border-navy-700 bg-gradient-to-br from-cream to-cream-300 dark:from-navy-950 dark:to-navy-800 grid place-items-center">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#0F235022_1px,transparent_1px),linear-gradient(90deg,#0F235022_1px,transparent_1px)] dark:opacity-40 [background-size:32px_32px]" />
        <div className="relative text-center px-6">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-coral shadow-lg shadow-coral/30"><svg viewBox="0 0 24 24" className="h-7 w-7 fill-navy ml-1"><path d="M8 5v14l11-7z" /></svg></div>
          <p className="font-semibold text-lg text-navy dark:text-white">Demo coming soon</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A short walkthrough of {p.name} in action.</p>
        </div>
      </div></section>
  </article>);
}
