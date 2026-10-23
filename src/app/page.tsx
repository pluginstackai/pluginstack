import { FREEBIE } from '../lib/email-copy';
import Link from 'next/link';
import { getPlugins, site } from '../lib/data';
import { getCategories, pageMeta, absUrl, ORG_ID, WEBSITE_ID } from '../lib/seo';
import Directory from '../components/Directory';
import EmailForm from '../components/EmailForm';
import JsonLd from '../components/JsonLd';
export const metadata = pageMeta({
  title: `${site.name}: AI plugins, MCP servers & agent tools, explained`, absoluteTitle: true, path: '/',
  description: 'A free directory of AI plugins, MCP servers, coding agents and agent frameworks, with plain-English explanations, setup steps and example prompts.',
});
export default function Home() {
  const plugins = getPlugins(); const cats = getCategories();
  const ld = { '@graph': [
    { '@type': 'Organization', '@id': ORG_ID, name: site.name, url: `${site.url}/`, logo: { '@type': 'ImageObject', url: absUrl('/logo.png'), width: 512, height: 512 }, email: site.contactEmail, sameAs: ['https://x.com/PluginStackAI'] },
    { '@type': 'WebSite', '@id': WEBSITE_ID, name: site.name, url: `${site.url}/`, description: site.tagline, inLanguage: 'en', publisher: { '@id': ORG_ID } },
  ] };
  return (<>
    <JsonLd data={ld} />
    <section className="-mx-4 mb-10 rounded-b-3xl bg-gradient-to-b from-cream to-cream-300 px-4 py-12 md:py-20 text-center dark:from-navy-950 dark:to-navy-800">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-navy dark:text-white">AI plugins worth <span className="text-coral-dark dark:text-coral">actually using</span></h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{site.tagline} For people into AI agents, tech, gaming and vibe coding. Free, forever.</p>
      <div className="max-w-md mx-auto mt-8 text-left sm:text-center">
        <h2 className="text-lg font-semibold text-navy dark:text-white">{FREEBIE.homeHeadline}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">{FREEBIE.homeSubline}</p>
        <EmailForm list="newsletter" cta={FREEBIE.homeCta} microcopy={FREEBIE.homeMicro} />
      </div>
    </section>
    <Directory plugins={plugins} />
    <nav aria-labelledby="browse-cats" className="mt-12">
      <h2 id="browse-cats" className="text-xl font-semibold mb-3">Browse by category</h2>
      <ul className="flex flex-wrap gap-2">{cats.map(c => <li key={c.slug}><Link href={c.path} className="inline-block rounded-full border border-navy/15 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-1 text-sm hover:border-coral-dark dark:hover:border-coral">{c.name} ({c.items.length})</Link></li>)}</ul>
    </nav>
  </>);
}
