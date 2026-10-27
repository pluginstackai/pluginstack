import Link from 'next/link';
import { pageMeta } from '../../lib/seo';
import { site } from '../../lib/data';
import CodeBlock from '../../components/CodeBlock';

export const metadata = pageMeta({
  title: 'Start here: AI coding tools and MCP servers, explained for beginners',
  description: 'New to AI coding? Plain-English explanations of Cursor, Claude Code, Codex, AI agents and MCP servers, plus a step-by-step first setup with one safe, free MCP server.',
  path: '/start-here/',
});

const terms: { id: string; term: string; body: React.ReactNode }[] = [
  { id: 'cursor', term: 'Cursor', body: <>A code editor (an app for writing code) with AI built in. It looks like VS Code, and you can chat with an AI that reads and edits your project for you. It has a free plan. <Link href="/guides/add-mcp-server-to-cursor/" className="link">Adding tools to Cursor</Link>.</> },
  { id: 'claude-code', term: 'Claude Code', body: <>Anthropic&apos;s AI coding helper. You type what you want in plain words and it reads your files, makes changes and runs commands. It started in the terminal and now also works inside VS Code and JetBrains, as a desktop app and on the web. It needs a paid Claude plan or an Anthropic Console account. <Link href="/plugins/claude-code/" className="link">Claude Code setup</Link>.</> },
  { id: 'codex', term: 'Codex', body: <>OpenAI&apos;s coding agent, which works a lot like Claude Code. It runs in your terminal, in editors like VS Code and Cursor, as a desktop app and in the cloud. You sign in with a paid ChatGPT plan or use an OpenAI API key. <Link href="/plugins/codex-cli/" className="link">Codex setup</Link>.</> },
  { id: 'agent', term: 'AI agent', body: <>An AI that doesn&apos;t just answer questions but takes steps to finish a task: it reads files, runs commands, checks the result and tries again. Cursor, Claude Code and Codex all have agents. You stay in charge: by default they ask permission before things like running commands, and you can change how much they ask.</> },
  { id: 'mcp', term: 'MCP server', body: <>MCP (Model Context Protocol) is a standard way to plug extra tools into an AI app. An MCP server is one of those plugins. One might let the AI read up-to-date docs, another open web pages, another talk to GitHub or your database. Some run on your computer and some are hosted online. The same server works in Cursor, Claude Code, Codex, VS Code and more. <Link href="/categories/mcp-servers/" className="link">Browse MCP servers</Link>.</> },
];

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => <h2 id={id} className="text-2xl font-semibold text-navy dark:text-white scroll-mt-6">{children}</h2>;

export default function Page() {
  return (<article className="max-w-3xl mx-auto py-8 space-y-8 min-w-0 text-slate-700 dark:text-slate-300">
    <div>
      <span className="text-xs uppercase tracking-widest text-coral-dark dark:text-coral">New here?</span>
      <h1 className="text-4xl font-bold mt-1 text-navy dark:text-white">Start here</h1>
      <p className="text-lg mt-4">New to AI coding tools? This page explains the words you&apos;ll see all over {site.name} in plain English, then walks you through your first setup in about 15 minutes. No experience needed.</p>
    </div>

    <section aria-labelledby="words" className="card space-y-4">
      <H2 id="words">The five words to know</H2>
      <dl className="space-y-4">{terms.map(t => (<div key={t.id} id={t.id}>
        <dt className="font-semibold text-navy dark:text-white">{t.term}</dt>
        <dd className="mt-1">{t.body}</dd></div>))}</dl>
      <p className="text-sm text-slate-600 dark:text-slate-400">Which one should you pick? If you&apos;ve never coded, start with <strong>Cursor</strong>: it&apos;s a normal-looking app with a free plan. If you&apos;re comfortable typing commands and already pay for Claude, try <strong>Claude Code</strong>.</p>
    </section>

    <section aria-labelledby="first-setup" className="space-y-5 min-w-0">
      <H2 id="first-setup">Your first setup, step by step</H2>
      <p>We&apos;ll install one AI coding tool, then add one simple, safe MCP server: <Link href="/plugins/context7/" className="link">Context7</Link>. It gives the AI up-to-date docs for popular code libraries, so it stops guessing at old answers. It&apos;s hosted by its maker, it only looks up public documentation, and you don&apos;t need an account or key to try it.</p>

      <div className="card space-y-3 min-w-0">
        <h3 className="text-lg font-semibold text-navy dark:text-white">Step 1: install Cursor or Claude Code</h3>
        <p><strong>Cursor:</strong> download it from <a href="https://cursor.com/download" className="link" target="_blank" rel="noopener">cursor.com/download</a>, install it like any app, sign in or create a free account, and open a folder (File → Open Folder). An empty new folder is fine for practice.</p>
        <p><strong>Claude Code:</strong> open a terminal and run the installer from Anthropic (Mac, Linux or WSL):</p>
        <CodeBlock code="curl -fsSL https://claude.ai/install.sh | bash" language="bash" />
        <p className="text-sm">On Windows, see the <Link href="/plugins/claude-code/" className="link">Claude Code listing</Link> for the PowerShell command. Then go into a project folder and type <code>claude</code>. It asks you to log in the first time.</p>
      </div>

      <div className="card space-y-3 min-w-0">
        <h3 className="text-lg font-semibold text-navy dark:text-white">Step 2: add your first MCP server (Context7)</h3>
        <p><strong>In Cursor:</strong> open the <Link href="/plugins/context7/" className="link">Context7 listing</Link> and click <strong>Add to Cursor</strong>. Cursor opens and asks you to confirm. Check the address is <code>https://mcp.context7.com/mcp</code>, then approve. Prefer to do it by hand? Create a file called <code>.cursor/mcp.json</code> in your project with this:</p>
        <CodeBlock code={JSON.stringify({ mcpServers: { context7: { url: 'https://mcp.context7.com/mcp' } } }, null, 2)} language="json" />
        <p><strong>In Claude Code:</strong> run this in your terminal:</p>
        <CodeBlock code="claude mcp add --transport http context7 https://mcp.context7.com/mcp" language="bash" />
      </div>

      <div className="card space-y-3 min-w-0">
        <h3 className="text-lg font-semibold text-navy dark:text-white">Step 3: check it worked, then try it</h3>
        <p><strong>Cursor:</strong> open <strong>Customize</strong> in the sidebar, then <strong>MCPs</strong>, and check Context7 is listed and switched on. <strong>Claude Code:</strong> type <code>/mcp</code> to see if it connected.</p>
        <p>Now ask the AI something like this:</p>
        <CodeBlock code="Using context7, show me how to make a simple page in the latest version of Next.js." tone="prompt" />
        <p className="text-sm">Stuck? See <Link href="/guides/fix-mcp-error-32000-connection-closed/" className="link">fixing MCP error -32000</Link> or <Link href="/guides/add-mcp-server-to-cursor/" className="link">the full Cursor MCP guide</Link>.</p>
      </div>

      <div className="card space-y-2">
        <h3 className="text-lg font-semibold text-navy dark:text-white">Another easy one: Fetch</h3>
        <p>The <Link href="/plugins/fetch-mcp/" className="link">Fetch MCP server</Link> lets the AI read a web page you give it. It runs on your computer and needs the free tool uv installed first. Its listing has the setup for every app.</p>
      </div>
    </section>

    <section aria-labelledby="safety" className="card space-y-2">
      <H2 id="safety">Three safety habits</H2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Only add MCP servers from makers you trust. Every server can run actions for the AI, so treat it like installing an app.</li>
        <li>Read the settings before you approve a one-click install, and never paste API keys into files you share or upload.</li>
        <li>Start with read-only tools (like docs and web pages) before giving an AI access to your email, database or GitHub.</li>
      </ul>
      <p className="text-sm">Want to see what each server needs before you install it? Check the <Link href="/mcp-server-requirements/" className="link">MCP server requirements table</Link>.</p>
    </section>

    <section aria-labelledby="next" className="card space-y-2">
      <H2 id="next">Where to go next</H2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li><Link href="/guides/best-mcp-servers-for-claude-code/" className="link">The best MCP servers for Claude Code</Link> (most work in Cursor too).</li>
        <li><Link href="/guides/cursor-rules-vs-agents-md/" className="link">Cursor rules vs AGENTS.md</Link>: give the AI standing instructions for your project.</li>
        <li><Link href="/guides/free-ai-courses/" className="link">The best free AI courses</Link>, if you&apos;d like to learn the basics properly.</li>
        <li><Link href="/guides/" className="link">All guides</Link> and the <Link href="/" className="link">full directory</Link>.</li>
      </ul>
      <p className="text-sm text-slate-600 dark:text-slate-400">Want ready-made rules and prompts? We also sell a few optional <Link href="/packs/" className="link">packs</Link>. Everything on this page works without them.</p>
    </section>
  </article>);
}
