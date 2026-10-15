import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '../lib/data';
import EmailForm from '../components/EmailForm';
import ThemeToggle from '../components/ThemeToggle';
export const metadata: Metadata = {
  metadataBase: new URL(site.url), title: { default: `${site.name} – AI plugins & MCP servers, explained`, template: `%s | ${site.name}` },
  description: site.tagline, openGraph: { siteName: site.name, type: 'website', images: [{ url: '/og.png', width: 1200, height: 630, alt: site.name }] }, twitter: { card: 'summary_large_image', images: ['/og.png'] }, alternates: { canonical: '/' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ps_theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()` }} /></head><body>
    <div className="bg-navy text-white text-center text-sm py-2 px-4 dark:bg-navy-800">
      <span className="opacity-80">Sponsor · </span><Link href={site.sponsor.href} className="font-semibold text-coral underline underline-offset-2 hover:text-coral-light">{site.sponsor.label}</Link><span className="hidden sm:inline"> — {site.sponsor.text}</span></div>
    <header className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-navy dark:text-white"><img src="/icon.svg" alt="" width={28} height={28} />{site.name}</Link>
      <nav className="flex items-center gap-4 sm:gap-5 text-sm font-medium text-slate-700 dark:text-slate-300 [&>a:hover]:text-coral-dark dark:[&>a:hover]:text-coral"><Link href="/">Plugins</Link><Link href="/packs/">Packs</Link><Link href="/get-unstuck/">Get unstuck</Link><Link href="/sponsor/">Sponsor</Link><ThemeToggle /></nav>
    </header>
    <main className="max-w-6xl mx-auto px-4 pb-16">{children}</main>
    <footer className="bg-white/60 dark:bg-navy-900/60 border-t border-navy/10 dark:border-navy-700"><div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-6">
      <div><h2 className="font-semibold">{site.newsletterTitle}</h2><p className="text-sm text-slate-600 dark:text-slate-400 mb-3">One short email. No spam.</p><EmailForm list="newsletter" /></div>
      <p className="text-sm text-slate-600 dark:text-slate-400 md:text-right">© {new Date().getFullYear()} {site.name}. Free directory. Not affiliated with listed tools.</p>
    </div></footer>
  </body></html>);
}
