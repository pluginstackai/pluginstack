import Link from 'next/link';
import type { Pack } from '../lib/data';
/** Small "From PluginStack" card for one of our own packs. Our product, not a sponsored placement (see /disclosures/). */
export default function PackPairing({ pack, why, toolName }: { pack: Pack; why: string; toolName: string }) {
  return (<aside aria-labelledby="our-pack" className="rounded-2xl border border-dashed border-coral/60 bg-coral/5 p-4 dark:border-coral/40 dark:bg-navy-900">
    <p className="text-xs font-semibold uppercase tracking-widest text-coral-dark dark:text-coral">From PluginStack · our own pack</p>
    <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 id="our-pack" className="font-semibold">Pairs well with {toolName}: {pack.name}</h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{why}</p>
      </div>
      <a href={pack.gumroadUrl} className="btn shrink-0 text-center text-sm">Get it for ${pack.price}<span className="sr-only"> on Gumroad</span></a>
    </div>
    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">Checkout on Gumroad. <Link href="/packs/" className="link">See all packs</Link> · <Link href="/disclosures/#our-products" className="link">Why we show this</Link></p>
  </aside>);
}
