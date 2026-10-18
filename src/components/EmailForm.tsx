'use client';
import { useState } from 'react';
import Link from 'next/link';
import { NEWSLETTER } from '../lib/email-copy';
// Posts to /api/subscribe (newsletter, waitlist) or /api/sponsor. Hidden "website" field is a bot honeypot.
// Point-of-collection notice: what this form is for, who we are, and how to opt out.
const NOTICE = {
  newsletter: NEWSLETTER.notice,
  waitlist: "Joins the Get unstuck waitlist: we'll email you when the app rescue service opens. We only use your note to understand the problem. Not a newsletter signup.",
  sponsor: 'Sends your email and company to PluginStack so we can reply about sponsorship. Not a newsletter signup.',
} as const;
export default function EmailForm({ list, cta = 'Subscribe', extra }: { list: 'newsletter' | 'waitlist' | 'sponsor'; cta?: string; extra?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState('sending');
    const f = Object.fromEntries(new FormData(e.currentTarget) as any);
    try {
      const res = await fetch(list === 'sponsor' ? '/api/sponsor/' : '/api/subscribe/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, list }) });
      const d = await res.json().catch(() => ({}));
      setMsg(d.message || (res.ok ? 'Thanks!' : 'Something went wrong. Please try again.')); setState(res.ok && d.ok ? 'done' : 'error');
    } catch { setMsg('Network error. Please try again.'); setState('error'); }
  }
  if (state === 'done') return <p role="status" className="text-emerald-700 dark:text-emerald-400 text-sm">{msg}</p>;
  return (
    <form className="relative flex flex-col sm:flex-row sm:flex-wrap gap-2" onSubmit={submit}>
      <input required type="email" name="email" placeholder="you@example.com" className="input flex-1" aria-label="Email" />
      {extra && <input name="note" maxLength={500} placeholder={extra} className="input flex-1" aria-label={extra} />}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="btn disabled:opacity-60" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : cta}</button>
      {state === 'error' && <p role="alert" className="text-sm text-coral-dark dark:text-coral sm:basis-full">{msg}</p>}
      <p className="text-xs text-slate-600 dark:text-slate-400 sm:basis-full">{NOTICE[list]} <Link href="/privacy/" className="underline underline-offset-2">Privacy policy</Link>.</p>
    </form>);
}
