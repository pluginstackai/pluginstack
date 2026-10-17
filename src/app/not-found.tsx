import Link from 'next/link';
import { getCategories } from '../lib/seo';
// Next.js adds <meta name="robots" content="noindex"> to 404 responses.
export const metadata = { title: 'Page not found' };
export default function NotFound() {
  return (<div className="max-w-2xl mx-auto py-16 text-center"><h1 className="text-4xl font-bold">Page not found</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-4">This page doesn't exist or was removed. <Link href="/" className="link">Browse all plugins</Link> or pick a category:</p>
    <ul className="flex flex-wrap justify-center gap-2 mt-6">{getCategories().map(c => <li key={c.slug}><Link href={c.path} className="inline-block rounded-full border border-navy/15 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-1 text-sm hover:border-coral-dark dark:hover:border-coral">{c.name}</Link></li>)}</ul></div>);
}
