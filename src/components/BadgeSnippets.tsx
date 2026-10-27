import Link from 'next/link';
import { BADGE_ALT, BADGE_PATH, badgeHtml, badgeMarkdown } from '../lib/badge';
import CodeBlock from './CodeBlock';

/** Small, optional "Hand-checked on PluginStack" badge section for a listing page. */
export default function BadgeSnippets({ slug, toolName }: { slug: string; toolName: string }) {
  return (<section aria-labelledby="badge" className="card">
    <h2 id="badge" className="text-lg font-semibold">Made {toolName}? Add the badge</h2>
    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">If you like, show that {toolName} is listed and hand-checked here. It&apos;s optional: listings are free and we never ask for a link back.</p>
    <img src={BADGE_PATH} alt={BADGE_ALT} width={226} height={28} className="mt-3" />
    <details className="mt-3 rounded-lg border border-slate-200 dark:border-navy-700 px-3 py-2">
      <summary className="cursor-pointer text-sm font-medium">Get the Markdown or HTML</summary>
      <div className="mt-3 space-y-3 min-w-0">
        <p className="text-xs text-slate-600 dark:text-slate-400">Markdown (for a GitHub README)</p>
        <CodeBlock code={badgeMarkdown(slug)} language="markdown" />
        <p className="text-xs text-slate-600 dark:text-slate-400">HTML (for a website)</p>
        <CodeBlock code={badgeHtml(slug)} language="html" />
      </div>
    </details>
    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3"><Link href="/badge/" className="link">About the badge</Link></p>
  </section>);
}
