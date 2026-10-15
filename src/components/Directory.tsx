'use client';
import { useState } from 'react';
import Link from 'next/link';
type P = { slug: string; name: string; category: string; what: string; tags: string[]; maker: string };
export default function Directory({ plugins }: { plugins: P[] }) {
  const cats = ['All', ...Array.from(new Set(plugins.map(p => p.category)))];
  const [cat, setCat] = useState('All'); const [q, setQ] = useState('');
  const list = plugins.filter(p => (cat === 'All' || p.category === cat) &&
    (p.name + p.what + p.tags.join(' ') + p.maker).toLowerCase().includes(q.toLowerCase()));
  return (<div>
    <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search plugins, MCP servers, tools…" className="input md:w-80" aria-label="Search" />
      <div className="flex flex-wrap gap-2">{cats.map(c => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
        className={`rounded-full px-3 py-1 text-sm border ${cat === c ? 'bg-coral border-coral text-navy font-semibold' : 'bg-white dark:bg-navy-900 border-navy/15 dark:border-navy-700 hover:border-coral-dark dark:hover:border-coral'}`}>{c}</button>)}</div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(p => (
      <Link key={p.slug} href={`/plugins/${p.slug}/`} className="card transition hover:-translate-y-0.5 hover:shadow-md hover:border-coral-dark dark:hover:border-coral">
        <div className="text-xs text-coral-dark dark:text-coral mb-1">{p.category} · {p.maker}</div>
        <h3 className="font-semibold text-lg text-navy dark:text-white">{p.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{p.what}</p>
      </Link>))}
      {!list.length && <p className="text-slate-600 dark:text-slate-400">No matches.</p>}</div>
  </div>);
}
