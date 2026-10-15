import { getPacks } from '../../lib/data';
export const metadata = { title: 'Prompt & Rules Packs', description: 'Ready-made Cursor rules and prompt packs for AI coding, $5–$20.', alternates: { canonical: '/packs/' } };
export default function Packs() {
  return (<div className="py-8"><h1 className="text-4xl font-bold">Prompt & Rules Packs</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-2 mb-8">Drop-in Cursor rules (.mdc / AGENTS.md) and prompt packs so your AI ships faster.</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{getPacks().map(k => (
      <div key={k.slug} className="card flex flex-col"><h2 className="font-semibold text-lg">{k.name}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{k.desc}</p>
        <ul className="text-sm text-slate-700 dark:text-slate-300 mt-3 list-disc pl-5 flex-1">{k.items.map(i => <li key={i}>{i}</li>)}</ul>
        <div className="flex items-center justify-between mt-5"><span className="text-2xl font-bold">${k.price}</span>
          {/* Placeholder: no payment link yet */}<button disabled title="Coming soon" className="btn text-sm cursor-not-allowed">Buy – coming soon</button></div>
      </div>))}</div></div>);
}
