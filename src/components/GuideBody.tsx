import Link from 'next/link';
import type { GuideBlock } from '../lib/guides';
import { getPlugin, getPacks } from '../lib/data';
import CodeBlock from './CodeBlock';
import EmailForm from './EmailForm';
import PackPairing from './PackPairing';
import { FREEBIE } from '../lib/email-copy';

/** Internal links must point at real pages; a typo in a guide fails the build instead of shipping a 404. */
const STATIC_PATHS = new Set(['/', '/packs/', '/guides/', '/mcp-server-requirements/', '/start-here/', '/badge/']);
function checkHref(href: string) {
  if (!href.startsWith('/')) return;
  const plugin = href.match(/^\/plugins\/([^/]+)\/$/);
  if (plugin && getPlugin(plugin[1])) return;
  if (/^\/(categories|guides)\/[a-z0-9-]+\/$/.test(href) || STATIC_PATHS.has(href)) return;
  throw new Error(`Guide links to unknown internal page: ${href}`);
}

/** Renders [label](href), `code` and **bold** inside guide text. */
export function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = []; const re = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0; let m: RegExpExecArray | null; let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      const href = m[2]; checkHref(href);
      parts.push(href.startsWith('/') ? <Link key={i++} href={href} className="link">{m[1]}</Link> : <a key={i++} href={href} className="link" target="_blank" rel="noopener">{m[1]}</a>);
    } else if (m[3]) parts.push(<code key={i++} className="rounded bg-navy/5 dark:bg-navy-800 px-1 py-0.5 text-[0.9em] break-words">{m[3]}</code>);
    else if (m[4]) parts.push(<strong key={i++} className="font-semibold text-navy dark:text-white">{m[4]}</strong>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export default function GuideBody({ blocks }: { blocks: GuideBlock[] }) {
  return (<div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">{blocks.map((b, i) => {
    if ('h2' in b) return <h2 key={i} id={b.id} className="text-2xl font-semibold text-navy dark:text-white pt-6 scroll-mt-6">{b.h2}</h2>;
    if ('h3' in b) return <h3 key={i} className="text-lg font-semibold text-navy dark:text-white pt-2">{b.h3}</h3>;
    if ('p' in b) return <p key={i}><Inline text={b.p} /></p>;
    if ('ul' in b) return <ul key={i} className="list-disc pl-5 space-y-1.5">{b.ul.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ul>;
    if ('ol' in b) return <ol key={i} className="list-decimal pl-5 space-y-1.5">{b.ol.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ol>;
    if ('code' in b) return <figure key={i} className="min-w-0">{b.caption && <figcaption className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-mono">{b.caption}</figcaption>}<CodeBlock code={b.code} language={b.lang} /></figure>;
    if ('freebie' in b) return (<section key={i} aria-labelledby="guide-freebie" className="card">
      <h2 id="guide-freebie" className="text-lg font-semibold">{FREEBIE.toolHeadline}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">{FREEBIE.homeSubline}</p>
      <EmailForm list="newsletter" cta={FREEBIE.toolCta} microcopy={FREEBIE.toolMicro} /></section>);
    if ('pack' in b) { const pack = getPacks().find(x => x.slug === b.pack); if (!pack) throw new Error(`Guide pack block: unknown pack ${b.pack}`); return <PackPairing key={i} pack={pack} why={b.why} toolName={b.toolName} />; }
    return <p key={i} className="card text-sm"><Inline text={b.note} /></p>;
  })}</div>);
}
