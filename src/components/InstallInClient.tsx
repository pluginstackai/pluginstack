import Link from 'next/link';
import type { InstallSpec } from '../lib/data';
import { clientSnippets, usesNpx } from '../lib/install';
import CodeBlock from './CodeBlock';

const fmtDate = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** "Install in your client" section for MCP server listings. All snippets are generated from one verified InstallSpec. */
export default function InstallInClient({ spec, toolName }: { spec: InstallSpec; toolName: string }) {
  const snippets = clientSnippets(spec);
  return (<section className="card" aria-labelledby="install-in-client">
    <h2 id="install-in-client" className="text-xl font-semibold mb-1">Install {toolName} in your client</h2>
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
      {spec.transport === 'stdio' ? 'Runs on your computer.' : 'Hosted by the maker, so there is nothing to install locally.'} Needs: {spec.requires.runtime}. Sign-in or keys: {spec.requires.auth}.
    </p>
    <div className="space-y-2">{snippets.map((c, i) => (
      <details key={c.id} open={i === 0} className="rounded-lg border border-slate-200 dark:border-navy-700 px-3 py-2">
        <summary className="cursor-pointer font-medium">{c.label}</summary>
        <div className="mt-3 space-y-3 min-w-0">
          {c.where && <p className="text-sm text-slate-600 dark:text-slate-400">{c.where}</p>}
          {c.blocks.map((b, j) => (<div key={j} className="min-w-0">{b.caption && <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{b.caption}</p>}<CodeBlock code={b.code} language={b.language} /></div>))}
          {c.note && <p className="text-sm text-slate-700 dark:text-slate-300">{c.note}</p>}
        </div>
      </details>))}</div>
    <ul className="mt-4 list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
      {spec.notes?.map((n, i) => <li key={i}>{n}</li>)}
      {spec.transport === 'http' && <li>Claude Desktop is not shown: we have not verified a config-file entry for this hosted server. Check the maker's docs for how to add it there.</li>}
      {usesNpx(spec) && <li>On Windows, if you see <code>spawn npx ENOENT</code>, see <Link href="/guides/fix-spawn-npx-enoent-windows-mcp/" className="link">the Windows npx fix</Link>.</li>}
      {spec.transport === 'stdio' && <li>If the server shows as failed or disconnected, see <Link href="/guides/fix-mcp-error-32000-connection-closed/" className="link">fixing MCP error -32000</Link>.</li>}
      <li>Compare every server's runtime and sign-in needs in the <Link href="/mcp-server-requirements/" className="link">MCP server requirements table</Link>.</li>
    </ul>
    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">Checked <time dateTime={spec.checked}>{fmtDate(spec.checked)}</time> against <a className="link" href={spec.source} target="_blank" rel="noopener">the official docs</a>. Snippets use placeholders; keep real keys out of files you commit. Windsurf is not listed because we have not verified its format.</p>
  </section>);
}
