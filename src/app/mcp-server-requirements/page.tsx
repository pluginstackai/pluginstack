import Link from 'next/link';
import { site } from '../../lib/data';
import { plugins, pageMeta, breadcrumbLd, absUrl, WEBSITE_ID } from '../../lib/seo';
import JsonLd from '../../components/JsonLd';
import RequirementsTable, { type ReqRow } from '../../components/RequirementsTable';

const PATH = '/mcp-server-requirements/';
const TITLE = 'MCP server requirements: runtime, sign-in and keys';
const DESC = 'A sortable table of what each listed MCP server needs to run (Node.js, uv or nothing for hosted servers) and how it signs in, checked against each maker\'s official docs.';
export const metadata = pageMeta({ title: TITLE, description: DESC, path: PATH });

export default function Requirements() {
  const rows: ReqRow[] = plugins().filter(p => p.install).map(p => { const i = p.install!; return {
    slug: p.slug, name: p.name, type: i.transport === 'stdio' ? 'Local' : 'Hosted', runtime: i.requires.runtime, auth: i.requires.auth,
    how: i.transport === 'stdio' ? [i.command, ...(i.args ?? [])].join(' ') : i.url!, checked: i.checked }; });
  const updated = rows.map(r => r.checked).sort().pop();
  const url = absUrl(PATH);
  const ld = { '@graph': [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: TITLE, description: DESC, inLanguage: 'en', isPartOf: { '@id': WEBSITE_ID }, ...(updated && { dateModified: updated }), breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@id': `${url}#breadcrumb`, ...breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'MCP server requirements', path: PATH }]) },
  ] };
  return (<div className="py-8 max-w-5xl mx-auto min-w-0">
    <JsonLd data={ld} />
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-400"><ol className="flex flex-wrap gap-1"><li><Link href="/" className="link">Home</Link> ›</li><li aria-current="page">MCP server requirements</li></ol></nav>
    <h1 className="text-4xl font-bold mt-3">MCP server requirements</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6 max-w-2xl">What each of these MCP servers needs before it will run, and how it signs in. "Local" servers run on your computer; "Hosted" servers are run by the maker, so there is nothing to install. Click a column header to sort. Every row links to the listing, which has install snippets for Claude Code, Claude Desktop, Cursor, VS Code and Codex.</p>
    <RequirementsTable rows={rows} />
    <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">Values come from each server's official README or docs (linked from its listing) and were checked on {updated}. Servers are only listed here once their install details are verified. The reference servers need Node.js 24 or later since version 2.0; see <Link href="/guides/mcp-reference-servers-v2-whats-changed/" className="link">what changed in the MCP reference servers v2</Link>. Browse the full <Link href="/" className="link">{site.name} directory</Link>.</p>
  </div>);
}
