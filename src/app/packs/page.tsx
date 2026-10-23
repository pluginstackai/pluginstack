import Link from 'next/link';
import Script from 'next/script';
import { getPacks } from '../../lib/data';
export const metadata = { title: 'Prompt & Rules Packs', description: 'Ready-made Cursor rules and prompt packs for AI coding, $5–$20.', alternates: { canonical: '/packs/' } };
const terms = '/terms/#packs';
const BUNDLE_URL = 'https://pluginstackai.gumroad.com/l/wgrelj';
export default function Packs() {
  const packs = getPacks();
  const onSale = packs.some(k => k.gumroadUrl?.trim()) || Boolean(BUNDLE_URL);
  return (<div className="py-8">
    {/* Gumroad overlay checkout: gumroad.js turns a.gumroad-button links into an on-site checkout. Only loaded once at least one pack has a gumroadUrl. */}
    {onSale && <Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />}
    <h1 className="text-4xl font-bold">Prompt & Rules Packs</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-2 mb-8">Drop-in Cursor rules (.mdc / AGENTS.md) and prompt packs so your AI ships faster.</p>
    <section aria-labelledby="bundle-hero" className="mb-8 rounded-2xl border border-coral/40 bg-coral/5 p-5 dark:border-coral/30 dark:bg-navy-900">
      <h2 id="bundle-hero" className="text-2xl font-bold">Get every pack for $20</h2>
      <p className="mt-2 text-slate-700 dark:text-slate-300">Agent Builder, Next.js rules, Vibe Coder prompts, and Indie Game Dev — $41 if bought alone. One download, personal &amp; commercial use (no resale).</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <a href={BUNDLE_URL} className="gumroad-button btn text-sm text-center" data-gumroad-overlay-checkout="true">Buy the Everything Bundle — $20</a>
        <a href="#packs-grid" className="text-sm link">Or pick a single pack below ↓</a>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Checkout on Gumroad. <Link href={terms} className="link">License &amp; refunds</Link> · <Link href="/disclosures/#our-products" className="link">Why we show this</Link></p>
    </section>
    <div id="packs-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{packs.map(k => {
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
    <p className="text-sm text-slate-600 dark:text-slate-400 mt-6">Checkout is handled securely by Gumroad. All sales are final (instant digital downloads), but if a file is broken or doesn't match its description, we'll fix it or make it right. By buying you agree to our <Link href={terms} className="link">pack license and refund terms</Link>.</p>
  </div>);
}
