import Link from 'next/link';
import Script from 'next/script';
import { getPacks } from '../../lib/data';
export const metadata = { title: 'Prompt & Rules Packs', description: 'Ready-made Cursor rules and prompt packs for AI coding, $5–$20.', alternates: { canonical: '/packs/' } };
const terms = '/terms/#packs';
export default function Packs() {
  const packs = getPacks();
  const onSale = packs.some(k => k.gumroadUrl?.trim());
  return (<div className="py-8">
    {/* Gumroad overlay checkout: gumroad.js turns a.gumroad-button links into an on-site checkout. Only loaded once at least one pack has a gumroadUrl. */}
    {onSale && <Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />}
    <h1 className="text-4xl font-bold">Prompt & Rules Packs</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-2 mb-8">Drop-in Cursor rules (.mdc / AGENTS.md) and prompt packs so your AI ships faster.</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{packs.map(k => {
      const url = k.gumroadUrl?.trim();
      return (<div key={k.slug} className="card flex flex-col"><h2 className="font-semibold text-lg">{k.name}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{k.desc}</p>
        <ul className="text-sm text-slate-700 dark:text-slate-300 mt-3 list-disc pl-5 flex-1">{k.items.map(i => <li key={i}>{i}</li>)}</ul>
        <div className="flex items-center justify-between mt-5"><span className="text-2xl font-bold">${k.price}</span>
          {url
            ? <a href={url} className="gumroad-button btn text-sm" data-gumroad-overlay-checkout="true">Buy for ${k.price}</a>
            : <button type="button" disabled aria-disabled="true" className="btn text-sm opacity-60 cursor-not-allowed">Coming soon</button>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">Personal &amp; commercial use, no resale. <Link href={terms} className="link">License &amp; refunds</Link></p>
      </div>);
    })}</div>
    <p className="text-sm text-slate-600 dark:text-slate-400 mt-6">Checkout is handled securely by Gumroad. By buying you agree to our <Link href={terms} className="link">pack license and refund terms</Link>.</p>
  </div>);
}
