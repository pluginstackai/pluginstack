import { getPlugins, site } from '../lib/data';
import Directory from '../components/Directory';
import EmailForm from '../components/EmailForm';
export default function Home() {
  const plugins = getPlugins();
  const ld = { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, description: site.tagline };
  return (<>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <section className="-mx-4 mb-10 rounded-b-3xl bg-gradient-to-b from-cream to-cream-300 px-4 py-12 md:py-20 text-center dark:from-navy-950 dark:to-navy-800">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-navy dark:text-white">AI plugins worth <span className="text-coral-dark dark:text-coral">actually using</span></h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{site.tagline} For people into AI agents, tech, gaming and vibe coding. Free, forever.</p>
      <div className="max-w-md mx-auto mt-8"><EmailForm list="newsletter" cta="Get weekly picks" /></div>
    </section>
    <Directory plugins={plugins} />
  </>);
}
