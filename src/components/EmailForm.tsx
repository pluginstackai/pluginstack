'use client';
import { useState } from 'react';
// Placeholder: stores signups in localStorage. Swap for a real provider (ConvertKit, Buttondown, Resend...) later.
export default function EmailForm({ list, cta = 'Subscribe', extra }: { list: string; cta?: string; extra?: string }) {
  const [done, setDone] = useState(false);
  return done ? <p className="text-emerald-700 dark:text-emerald-400 text-sm">You're on the list. Thanks!</p> : (
    <form className="flex flex-col sm:flex-row gap-2" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget);
      const k = 'ps_' + list; const arr = JSON.parse(localStorage.getItem(k) || '[]'); arr.push({ ...Object.fromEntries(f as any), at: new Date().toISOString() });
      localStorage.setItem(k, JSON.stringify(arr)); setDone(true); }}>
      <input required type="email" name="email" placeholder="you@example.com" className="input flex-1" aria-label="Email" />
      {extra && <input name="note" placeholder={extra} className="input flex-1" aria-label={extra} />}
      <button className="btn">{cta}</button>
    </form>);
}
