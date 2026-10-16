import EmailForm from '../../components/EmailForm';
import { site } from '../../lib/data';
export const metadata = { title: 'Sponsor', description: `Sponsor ${site.name} and reach builders into AI agents and vibe coding.`, alternates: { canonical: '/sponsor/' } };
export default function Page() {
  return (<div className="max-w-2xl mx-auto py-12"><h1 className="text-4xl font-bold">Sponsor {site.name}</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-4">Put your tool in front of developers, vibe coders and agent builders.</p>
    <div className="grid sm:grid-cols-2 gap-4 mt-8"><div className="card"><h2 className="font-semibold">Top banner</h2><p className="text-sm text-slate-600 dark:text-slate-400">Site-wide slot at the top of every page.</p></div>
      <div className="card"><h2 className="font-semibold">Newsletter feature</h2><p className="text-sm text-slate-600 dark:text-slate-400">Featured spot in the weekly email.</p></div></div>
    <h2 className="font-semibold mt-10 mb-3">Interested? Leave your email</h2><EmailForm list="sponsor" cta="Contact me" extra="Company / tool" /></div>);
}
