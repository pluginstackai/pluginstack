import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import { site } from '../lib/data';
import { DEFAULT_OG, TWITTER } from '../lib/seo';
import EmailForm from '../components/EmailForm';
import { NEWSLETTER } from '../lib/email-copy';
import ThemeToggle from '../components/ThemeToggle';
// Site-wide defaults. Every page sets its own title, description, canonical and Open Graph/Twitter tags (see lib/seo.ts pageMeta);
// no canonical here, so pages that don't set one (e.g. 404) don't inherit the home page's.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: AI plugins & MCP servers, explained`, template: `%s | ${site.name}` },
  description: site.tagline,
  applicationName: site.name,
  openGraph: { siteName: site.name, type: 'website', locale: 'en_US', images: [DEFAULT_OG] },
  twitter: { card: 'summary_large_image', site: TWITTER, images: [DEFAULT_OG.url] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ps_theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()` }} /></head><body>
    <div className="bg-navy text-white text-center text-sm py-2 px-4 dark:bg-navy-800">
      {/* Paid slot (site.config sponsor.paid=true) must show a visible "Sponsored" label; otherwise it's a house ad. */}
      <span className="opacity-80">{site.sponsor.paid ? 'Sponsored · ' : 'Ad space · '}</span><Link href={site.sponsor.href} className="font-semibold text-coral underline underline-offset-2 hover:text-coral-light">{site.sponsor.label}</Link><span className="hidden sm:inline"> — {site.sponsor.text}</span></div>
    <header className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-navy dark:text-white"><img src="/icon.svg" alt="" width={28} height={28} />{site.name}</Link>
      <nav className="flex items-center gap-4 sm:gap-5 text-sm font-medium text-slate-700 dark:text-slate-300 [&>a:hover]:text-coral-dark dark:[&>a:hover]:text-coral"><Link href="/start-here/">Start here</Link><Link href="/">Plugins</Link><Link href="/guides/">Guides</Link><Link href="/packs/">Packs</Link><Link href="/get-unstuck/">Get unstuck</Link><Link href="/sponsor/">Sponsor</Link><ThemeToggle /></nav>
    </header>
    <main className="max-w-6xl mx-auto px-4 pb-16">{children}</main>
    <footer className="bg-white/60 dark:bg-navy-900/60 border-t border-navy/10 dark:border-navy-700"><div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-6">
      <div><h2 className="font-semibold">{site.newsletterTitle}</h2><p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{NEWSLETTER.footer}</p><EmailForm list="newsletter" /></div>
      <div className="text-sm text-slate-600 dark:text-slate-400 md:text-right space-y-2">
        <nav aria-label="Legal" className="flex gap-4 md:justify-end font-medium"><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link><Link href="/disclosures/">Disclosures</Link></nav>
        <p>© {new Date().getFullYear()} {site.name}. Free directory. {site.name} is independent and not affiliated with or endorsed by the listed companies; trademarks belong to their owners.</p>
        <p>Contact: <a href={`mailto:${site.contactEmail}`} className="underline underline-offset-2">{site.contactEmail}</a></p></div>
    </div></footer>
    {/* Cloudflare Web Analytics (cookieless, no personal tracking); site www.pluginstackai.com, public token. */}
    <Script src="https://static.cloudflareinsights.com/beacon.min.js" strategy="afterInteractive" data-cf-beacon='{"token": "ed80b4b805fb4ebb8c22ad1cc0fd32b3"}' />
  </body></html>);
}
