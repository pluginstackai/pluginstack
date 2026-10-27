'use client';
import Link from 'next/link';
import { useState } from 'react';

export type ReqRow = { slug: string; name: string; type: 'Local' | 'Hosted'; runtime: string; auth: string; how: string; checked: string };
type Key = 'name' | 'type' | 'runtime' | 'auth' | 'checked';
const COLS: { key: Key; label: string }[] = [{ key: 'name', label: 'Server' }, { key: 'type', label: 'Runs' }, { key: 'runtime', label: 'Needs' }, { key: 'auth', label: 'Sign-in or keys' }, { key: 'checked', label: 'Last checked' }];

/** Plain table first (server-rendered, readable without JS); header buttons sort it once JS loads. */
export default function RequirementsTable({ rows }: { rows: ReqRow[] }) {
  const [key, setKey] = useState<Key>('name'); const [dir, setDir] = useState<1 | -1>(1);
  const sorted = [...rows].sort((a, b) => a[key].localeCompare(b[key], 'en', { numeric: true, sensitivity: 'base' }) * dir || a.name.localeCompare(b.name));
  const click = (k: Key) => { if (k === key) setDir(d => (d === 1 ? -1 : 1)); else { setKey(k); setDir(1); } };
  return (<div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-700">
    <table className="w-full text-sm text-left">
      <caption className="sr-only">MCP server requirements. Use the column headers to sort.</caption>
      <thead className="bg-slate-50 dark:bg-navy-900"><tr>{COLS.map(c => (
        <th key={c.key} scope="col" aria-sort={key === c.key ? (dir === 1 ? 'ascending' : 'descending') : 'none'} className="px-3 py-2 font-semibold whitespace-nowrap">
          <button type="button" onClick={() => click(c.key)} className="hover:text-coral-dark dark:hover:text-coral">{c.label}{key === c.key ? (dir === 1 ? ' ▲' : ' ▼') : ''}</button></th>))}</tr></thead>
      <tbody>{sorted.map(r => (
        <tr key={r.slug} className="border-t border-slate-200 dark:border-navy-700 align-top">
          <th scope="row" className="px-3 py-2 font-medium"><Link href={`/plugins/${r.slug}/`} className="link">{r.name}</Link><div className="font-mono text-xs font-normal text-slate-600 dark:text-slate-400 break-all">{r.how}</div></th>
          <td className="px-3 py-2 whitespace-nowrap">{r.type}</td><td className="px-3 py-2">{r.runtime}</td><td className="px-3 py-2">{r.auth}</td>
          <td className="px-3 py-2 whitespace-nowrap"><time dateTime={r.checked}>{r.checked}</time></td></tr>))}</tbody>
    </table></div>);
}
