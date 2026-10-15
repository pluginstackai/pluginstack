'use client';
import { useRef, useState } from 'react';
export default function CodeBlock({ code, language = 'text', tone = 'code' }: { code: string; language?: string; tone?: 'code' | 'prompt' }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const ref = useRef<HTMLPreElement>(null);
  async function copy() {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(code);
      else {
        const ta = document.createElement('textarea'); ta.value = code; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
        const ok = document.execCommand('copy'); document.body.removeChild(ta); if (!ok) throw new Error('copy failed');
      }
      setState('copied');
    } catch {
      // Graceful fallback: select the text so the user can press Ctrl/Cmd+C
      const r = document.createRange(); if (ref.current) { r.selectNodeContents(ref.current); const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r); }
      setState('manual');
    }
    setTimeout(() => setState('idle'), 2000);
  }
  return (
    <div className="group relative min-w-0 max-w-full rounded-lg border border-navy-700 bg-navy-950">
      <div className="flex items-center justify-between border-b border-navy-700 px-3 py-1.5 text-[11px] uppercase tracking-wider text-slate-400">
        <span>{tone === 'prompt' ? 'prompt' : language}</span>
        <button type="button" onClick={copy} aria-label="Copy to clipboard"
          className="rounded-md border border-navy-700 px-2 py-0.5 normal-case tracking-normal text-slate-200 hover:border-coral hover:text-white">
          {state === 'copied' ? 'Copied!' : state === 'manual' ? 'Press Ctrl/⌘+C' : 'Copy'}
        </button>
      </div>
      <pre ref={ref} className={`overflow-x-auto p-3 text-[13px] leading-relaxed ${tone === 'prompt' ? 'whitespace-pre-wrap break-words text-emerald-300' : 'whitespace-pre text-sky-200'}`}><code>{code}</code></pre>
      <span aria-live="polite" className="sr-only">{state === 'copied' ? 'Copied to clipboard' : ''}</span>
    </div>);
}
