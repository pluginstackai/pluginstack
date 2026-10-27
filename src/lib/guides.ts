/**
 * Setup guides (/guides/<slug>/). Content is plain data so it can be rendered on the site and exported to markdown
 * (scripts/guides-md.mjs). Inline text supports [label](href), `code` and **bold**.
 * Every command, path and config snippet must match the official docs linked in `sources` (checked on `updated`).
 */
import { MCP_GUIDES } from './guides-mcp.ts';
import { freeAiCourses } from './guides-learn.ts';

export type GuideBlock =
  | { h2: string; id?: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { code: string; lang: 'bash' | 'json' | 'powershell' | 'text'; caption?: string }
  | { note: string }
  /** Free MCP Starter Checklist signup card (same EmailForm + FREEBIE copy as the homepage and tool pages). */
  | { freebie: true }
  /** "From PluginStack" pack callout (PackPairing, same component as tool pages). `pack` = slug in content/packs/packs.json. */
  | { pack: string; toolName: string; why: string };
export type Guide = {
  slug: string; title: string; h1: string; description: string; published: string; updated: string;
  intro: string; blocks: GuideBlock[]; related: string[]; sources: { label: string; url: string }[];
  /** Small label above the title and on the guides index (default "Setup guide"). */
  kind?: string;
  /** Text before the date at the top (default "Checked against the official docs"). */
  checkedLabel?: string;
  /** Intro line in the Sources box (default says commands and config come from these docs). */
  sourcesNote?: string;
};

const cursor: Guide = {
  slug: 'add-mcp-server-to-cursor',
  title: 'How to add an MCP server to Cursor (mcp.json, examples & fixes)',
  h1: 'How to add an MCP server to Cursor',
  description: 'Add an MCP server to Cursor via one click or mcp.json: file locations, local and remote config examples, API keys with ${env:}, and fixes for common errors.',
  published: '2026-10-20', updated: '2026-10-20',
  intro: 'MCP (Model Context Protocol) servers give Cursor\'s Agent extra tools, such as reading GitHub issues, driving a browser or looking up current library docs. There are two ways to add one: one click from Cursor\'s Customize panel, or a few lines in an `mcp.json` file. This guide covers both, with copy-paste configs and fixes for the errors people hit most.',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ol: [
      'Create `~/.cursor/mcp.json` (all your projects) or `.cursor/mcp.json` in your project folder (that project only).',
      'Add the server under an `mcpServers` key: a `command` for a local server, or a `url` for a remote one (examples below).',
      'Save the file and restart Cursor.',
      'Open **Customize** in the sidebar, then **MCPs**, and check the server is listed and switched on.',
    ] },
    { p: 'Prefer not to edit JSON? Use the one-click install first and come back to `mcp.json` for anything it doesn\'t list.' },

    { freebie: true },

    { h2: 'Option 1: one-click install from Customize', id: 'one-click' },
    { ol: [
      'Open **Customize** in Cursor\'s sidebar and click **MCPs**.',
      'Browse or search for the server you want.',
      'Click **Add to Cursor** next to it.',
      'Follow the sign-in (OAuth) prompts if the server asks for them.',
    ] },
    { p: 'These entries come from the Cursor Marketplace. Cursor also points to [cursor.directory](https://cursor.directory) for community plugins and MCP servers; community servers aren\'t reviewed by Cursor, so check who publishes them before installing.' },

    { h2: 'Option 2: add a server with mcp.json', id: 'mcp-json' },
    { h3: 'Where the file goes' },
    { ul: [
      '**Global** (just you, every project): `~/.cursor/mcp.json` in your home folder.',
      '**Project** (this project, can be shared with your team through git): `.cursor/mcp.json` in the project root.',
    ] },
    { p: 'Cursor merges both files. If the same server name appears in both, the project file wins.' },

    { h3: 'A local (stdio) server' },
    { p: 'A local server is a program Cursor starts on your machine. You give it a `command` and optional `args` and `env`. This adds [Playwright MCP](/plugins/playwright-mcp/), which lets the Agent open and control a browser (it needs Node.js 18 or newer):' },
    { code: '{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    }\n  }\n}', lang: 'json', caption: '~/.cursor/mcp.json' },
    { p: 'The key (`playwright` here) is just a label you choose. The `command` has to be on your system PATH or be a full path to the program.' },

    { h3: 'A remote server (URL)' },
    { p: 'A remote server is hosted by the provider and reached over HTTP. Cursor supports Streamable HTTP and SSE endpoints with a `url`. This adds the [Notion MCP server](/plugins/notion-mcp/). After saving, enable it in **Customize** and complete Notion\'s OAuth sign-in to connect your workspace:' },
    { code: '{\n  "mcpServers": {\n    "notion": {\n      "url": "https://mcp.notion.com/mcp"\n    }\n  }\n}', lang: 'json' },

    { h3: 'A remote server that needs a token' },
    { p: 'Some servers take an API key or token in a header instead of OAuth. The [GitHub MCP Server](/plugins/github-mcp-server/)\'s Cursor guide uses a GitHub personal access token as a Bearer header. Rather than pasting the token into the file, read it from an environment variable with `${env:NAME}`:' },
    { code: '{\n  "mcpServers": {\n    "github": {\n      "url": "https://api.githubcopilot.com/mcp/",\n      "headers": {\n        "Authorization": "Bearer ${env:GITHUB_PAT}"\n      }\n    }\n  }\n}', lang: 'json' },
    { p: 'Set `GITHUB_PAT` in your shell profile (for example `export GITHUB_PAT=...` in `~/.zshrc`), then restart Cursor so it picks up the variable. Give the token only the repositories and permissions you want the Agent to have.' },

    { h3: 'Several servers in one file' },
    { p: 'Each server is one entry inside the same `mcpServers` object. Separate entries with a comma, and don\'t leave a comma after the last one:' },
    { code: '{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    },\n    "notion": {\n      "url": "https://mcp.notion.com/mcp"\n    }\n  }\n}', lang: 'json' },

    { h2: 'Keep API keys out of mcp.json', id: 'secrets' },
    { p: 'A project `.cursor/mcp.json` is meant to be committed, so never put real keys in it. Cursor resolves these variables in `command`, `args`, `env`, `url` and `headers`:' },
    { ul: [
      '`${env:NAME}`: an environment variable.',
      '`${userHome}`: your home folder.',
      '`${workspaceFolder}`: the project root (the folder that contains `.cursor/mcp.json`).',
      '`${workspaceFolderBasename}`: the project folder\'s name.',
      '`${pathSeparator}` or `${/}`: the OS path separator.',
    ] },
    { p: 'Local (stdio) servers can also load variables from a file with `envFile`, for example `"envFile": "${workspaceFolder}/.env"`. Remote servers don\'t support `envFile`, so use `${env:NAME}` for them. Keep `.env` in `.gitignore`.' },
    { code: '{\n  "mcpServers": {\n    "my-local-server": {\n      "command": "npx",\n      "args": ["-y", "some-mcp-server"],\n      "envFile": "${workspaceFolder}/.env"\n    }\n  }\n}', lang: 'json' },

    { h2: 'Check that it works', id: 'check' },
    { ol: [
      'Open **Customize → MCPs**. The server should be listed with its toggle on.',
      'In the Agent chat, ask for something only that server can do, for example "Use playwright to open https://example.com and tell me the page title".',
      'Approve the tool call. Cursor asks for approval before running MCP tools unless your approval settings (Cursor Settings → Agents → Approvals & Execution) let them run; click the arrow next to the tool name to see the arguments it will send.',
    ] },

    { pack: 'agent-builder-pack', toolName: 'Cursor', why: 'This guide is about connecting servers other people built. If you want to build your own MCP server, the pack has Cursor and Claude Code rules, 2 Claude Code skills, 10 scaffolding prompts for TypeScript or Python, and 12 eval prompt templates. You don\'t need it just to add servers.' },

    { h2: 'Common errors and fixes', id: 'errors' },
    { h3: 'The server doesn\'t show up' },
    { ul: [
      'Check the path and name: the file must be `mcp.json` inside a `.cursor` folder, either in your home folder or in the project root.',
      'Check the JSON. A trailing comma, a missing quote or a missing closing brace makes the file invalid. Paste it into any JSON validator.',
      'Restart Cursor after editing the file.',
    ] },
    { h3: 'Read the MCP logs' },
    { p: 'Open the Output panel (**Cmd+Shift+U** on Mac, **Ctrl+Shift+U** on Windows/Linux) and pick **MCP Logs** from the dropdown. It shows connection errors, authentication problems and server crashes, which usually name the fix.' },
    { h3: '"command not found" or the server exits immediately' },
    { ul: [
      'Most local servers start with `npx` or `uvx`, so install Node.js (for `npx`) or uv (for `uvx`) first, then restart Cursor.',
      'If Cursor still can\'t find it, use the full path to the program in `command` (run `which npx` on macOS/Linux or `where npx` on Windows to get it).',
      'Run the same command in a terminal (for example `npx @playwright/mcp@latest`). If it errors there, the message tells you what\'s missing. If it starts and waits silently, the server works and the problem is in the config.',
      'On Windows, some servers\' READMEs (such as the official Filesystem server) launch `npx` through `cmd /c`: set `"command": "cmd"` and put `"/c", "npx"` at the start of `args`.',
    ] },
    { h3: 'The server can\'t see my API key' },
    { p: 'If the server relies on variables set in your shell profile, make sure Cursor can see them and restart Cursor after changing the profile. For local servers, putting the key in `env` or an `envFile` avoids the problem.' },
    { h3: 'Authentication fails on a remote server' },
    { ul: [
      'For token servers, check the header format (`Authorization: Bearer <token>`), that the token hasn\'t expired, and that it has the permissions the tool needs.',
      'For OAuth servers, remove the server in **Customize → MCPs** and add it again to restart the sign-in.',
    ] },
    { h3: 'A Docker-based server won\'t start' },
    { p: 'Servers that run with `"command": "docker"` (such as the local version of the GitHub MCP Server) need Docker Desktop installed and running before Cursor starts them.' },
    { h3: 'An npm-based server is stuck on an old version' },
    { p: 'Cursor\'s docs suggest removing the server in Customize, running `npm cache clean --force`, then adding it again.' },
    { h3: 'Too many tools' },
    { p: 'Every server adds tools the Agent has to choose from. Switch off servers you\'re not using with their toggle in **Customize → MCPs**; disabled servers don\'t load or appear in chat, and you keep their config.' },

    { h2: 'Stay safe with MCP servers', id: 'safety' },
    { ul: [
      'Install servers from the company or project that makes them. Our listings link to each official repo or docs page.',
      'Use the narrowest key you can: read-only modes, restricted tokens, a single project or repository.',
      'Read tool calls before approving them, especially ones that write, delete or spend money.',
      'Be careful with servers that read outside content (web pages, issues, emails): that text can carry prompt-injection instructions.',
    ] },

    { h2: 'Good servers to try first', id: 'try' },
    { ul: [
      '[Context7](/plugins/context7/): current, version-specific library docs in the chat.',
      '[GitHub MCP Server](/plugins/github-mcp-server/): issues, pull requests and Actions runs.',
      '[Playwright MCP](/plugins/playwright-mcp/) or [Chrome DevTools MCP](/plugins/chrome-devtools-mcp/): let the Agent open and check your app in a real browser.',
      '[Figma MCP Server](/plugins/figma-mcp/): design context from a Figma frame link.',
      '[Linear MCP](/plugins/linear-mcp/) or [Notion MCP](/plugins/notion-mcp/): tickets and specs.',
      '[Supabase MCP Server](/plugins/supabase-mcp/) or [Neon MCP Server](/plugins/neon-mcp/): your database (start in read-only mode).',
    ] },
    { p: 'See every server we list in [MCP Servers](/categories/mcp-servers/). Each page has setup steps checked against the official docs.' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Should I use the global or the project mcp.json?' },
    { p: 'Use `~/.cursor/mcp.json` for personal tools you want everywhere, and `.cursor/mcp.json` for tools a project\'s team should share. Keep keys out of the project file with `${env:NAME}`.' },
    { h3: 'Which transports does Cursor support?' },
    { p: 'stdio (a local command Cursor starts), SSE and Streamable HTTP (both by URL). If a provider offers both a `/sse` and an `/mcp` endpoint, use the one its docs recommend for Cursor.' },
    { h3: 'Can I turn a server off without deleting it?' },
    { p: 'Yes. Use the toggle next to it in **Customize → MCPs**.' },
    { h3: 'Using Claude Code too?' },
    { p: 'Claude Code reads the same kind of `mcpServers` entries but stores them differently. See [the best MCP servers for Claude Code](/guides/best-mcp-servers-for-claude-code/) for the `claude mcp add` commands.' },
  ],
  related: ['context7', 'github-mcp-server', 'playwright-mcp', 'figma-mcp', 'notion-mcp', 'cursor-rules'],
  sources: [
    { label: 'Cursor docs: Model Context Protocol (MCP)', url: 'https://cursor.com/docs/context/mcp' },
    { label: 'Cursor help: MCP integrations', url: 'https://cursor.com/help/customization/mcp' },
    { label: 'GitHub MCP Server: install in Cursor', url: 'https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md' },
    { label: 'Playwright MCP README', url: 'https://github.com/microsoft/playwright-mcp' },
    { label: 'Notion docs: Get started with MCP', url: 'https://developers.notion.com/docs/get-started-with-mcp' },
    { label: 'Filesystem MCP server README (Windows config)', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem' },
  ],
};

const claude: Guide = {
  slug: 'best-mcp-servers-for-claude-code',
  title: 'Best MCP servers for Claude Code (with install commands)',
  h1: 'The best MCP servers for Claude Code',
  description: 'Ten official MCP servers worth adding to Claude Code, from GitHub and Context7 to Playwright, Sentry and Cloudflare, with the exact claude mcp add command for each.',
  published: '2026-10-20', updated: '2026-10-27',
  intro: 'Claude Code can already read, edit and run code in your project. MCP servers connect it to the things it can\'t see on its own: your GitHub issues, current library docs, a real browser, production errors, your tickets and your database. Below are ten official servers worth considering, the exact command to add each one, and how to fix the usual setup problems.',
  blocks: [
    { h2: 'Short answer: where to start', id: 'start-here' },
    { ul: [
      '**Almost everyone:** [GitHub](/plugins/github-mcp-server/) for issues and PRs, and [Context7](/plugins/context7/) for current library docs.',
      '**Front-end work:** [Playwright](/plugins/playwright-mcp/) or [Chrome DevTools](/plugins/chrome-devtools-mcp/) so Claude can see the running page.',
      '**Team tools:** [Sentry](/plugins/sentry-mcp/), [Linear](/plugins/linear-mcp/) and [Notion](/plugins/notion-mcp/) if your team already uses them.',
      '**Data and infrastructure:** [Supabase](/plugins/supabase-mcp/) (or [Neon](/plugins/neon-mcp/)) and [Cloudflare](/plugins/cloudflare-mcp/), scoped to read-only or one project while you test.',
    ] },
    { p: 'Add two or three, not all ten. The reasons are under "How we picked".' },

    { h2: 'How we picked', id: 'how-we-picked' },
    { ul: [
      '**Official**: published by the company behind the service (or by Microsoft and Google for the browser tools), so it tracks the real API.',
      '**Fills a gap**: it gives Claude Code something it can\'t already do with its built-in tools.',
      '**Can be scoped down**: OAuth sign-in, read-only modes or narrow tokens, so you don\'t have to hand over full access.',
    ] },
    { p: 'This isn\'t a ranking, and no one paid to be included. Pick the few that match how you work. Each connected server takes some of Claude\'s context window, because its tool names and server instructions load into every session, so fewer well-chosen servers beat many.' },

    { h2: 'Adding any MCP server to Claude Code', id: 'add' },
    { p: 'Run these in your terminal, not inside a `claude` session. A remote (hosted) server takes `--transport http` and a URL:' },
    { code: 'claude mcp add --transport http <name> <url>', lang: 'bash' },
    { p: 'A local server takes the command that starts it after `--`. Everything after `--` goes to the server untouched, so flags like `-y` aren\'t read as Claude Code options:' },
    { code: 'claude mcp add <name> -- npx -y <package>', lang: 'bash' },
    { p: 'Then check and manage your servers:' },
    { code: 'claude mcp list          # every server and its status\nclaude mcp get <name>    # details for one server\nclaude mcp remove <name> # remove it', lang: 'bash' },
    { p: 'Inside a session, `/mcp` shows status and handles OAuth sign-in for servers that need it.' },
    { h3: 'Pick a scope' },
    { ul: [
      '`--scope local` (default): just you, this project. Stored in `~/.claude.json`.',
      '`--scope user`: just you, every project. Also in `~/.claude.json`.',
      '`--scope project`: shared with everyone who clones the repo, through a `.mcp.json` file in the project root.',
    ] },

    { h2: 'The servers', id: 'servers' },

    { h3: '1. GitHub MCP Server: issues, PRs and Actions' },
    { p: 'GitHub\'s official server lets Claude read repositories, triage issues, review pull requests and check why a GitHub Actions run failed. The hosted server takes a personal access token as a header. Create a fine-grained token with access to only the repositories you want Claude to work with:' },
    { code: 'claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \\\n  --header "Authorization: Bearer YOUR_GITHUB_PAT"', lang: 'bash' },
    { p: 'For read-only tools, GitHub\'s remote-server docs give `https://api.githubcopilot.com/mcp/readonly` as the URL. `claude mcp add` doesn\'t check the token when it saves, so run `/mcp` afterwards: a bad token shows an ✘ and an HTTP 401. More: [GitHub MCP Server on PluginStack](/plugins/github-mcp-server/).' },

    { h3: '2. Context7: current library docs' },
    { p: 'Context7 pulls version-specific documentation and code examples into the conversation, which helps with libraries that changed after the model was trained. The quickest setup is Context7\'s `ctx7` command, which signs you in, then lets you choose CLI + Skills or MCP mode; `--claude` targets Claude Code (needs Node.js 22.13 or newer):' },
    { code: 'npx ctx7 setup --claude', lang: 'bash' },
    { p: 'Or add the hosted server by hand. An API key is optional but recommended for higher rate limits (free keys at context7.com/dashboard):' },
    { code: 'claude mcp add --scope user --header "Authorization: Bearer YOUR_API_KEY" \\\n  --transport http context7 https://mcp.context7.com/mcp', lang: 'bash' },
    { p: 'Add "use context7" to a prompt, or a line in `CLAUDE.md` telling Claude to use it for library questions. More: [Context7](/plugins/context7/).' },

    { h3: '3. Playwright MCP: drive a real browser' },
    { p: 'Microsoft\'s Playwright server lets Claude open pages, click, fill forms and read the result, which is handy for checking that a UI change actually works. It needs Node.js 18 or newer:' },
    { code: 'claude mcp add playwright -- npx -y @playwright/mcp@latest', lang: 'bash' },
    { p: 'The first `claude mcp list` can show "Failed to connect" while `npx` downloads the package; run it again after a moment. Microsoft notes that for coding agents its Playwright CLI with skills can be more token-efficient than the MCP server. More: [Playwright MCP](/plugins/playwright-mcp/).' },

    { h3: '4. Chrome DevTools MCP: debug and profile in Chrome' },
    { p: 'Google\'s Chrome DevTools server lets Claude control and inspect a live Chrome browser: performance traces, network requests and console messages. It needs a current Node.js LTS and Chrome:' },
    { code: 'claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest', lang: 'bash' },
    { p: 'Google collects usage statistics by default; add `--no-usage-statistics` to the server\'s arguments to opt out. Performance tools may send trace URLs to the CrUX API unless you pass `--no-performance-crux`. More: [Chrome DevTools MCP](/plugins/chrome-devtools-mcp/).' },

    { h3: '5. Sentry MCP: production errors' },
    { p: 'Sentry\'s hosted server is built for coding agents: it lets Claude look up Sentry issues, errors and traces and help you debug them:' },
    { code: 'claude mcp add --transport http sentry https://mcp.sentry.dev/mcp', lang: 'bash' },
    { p: 'Then run `/mcp`, select `sentry` and choose **Authenticate** to sign in through your browser. Sentry also offers a Claude Code plugin (`claude plugin marketplace add getsentry/sentry-mcp`, then `claude plugin install sentry-mcp@sentry-mcp`). More: [Sentry MCP](/plugins/sentry-mcp/).' },

    { h3: '6. Linear MCP: tickets and projects' },
    { p: 'Linear\'s official server lets Claude find, create and update issues, projects and comments:' },
    { code: 'claude mcp add --transport http linear-server https://mcp.linear.app/mcp', lang: 'bash' },
    { p: 'Run `/mcp` to sign in. For read-only access, Linear offers `https://mcp.linear.app/mcp/readonly`. More: [Linear MCP](/plugins/linear-mcp/).' },

    { h3: '7. Notion MCP: specs and docs' },
    { p: 'Notion\'s hosted server lets Claude search, read, create and update the pages and databases you can access, so specs and notes don\'t have to be pasted in:' },
    { code: 'claude mcp add --transport http notion https://mcp.notion.com/mcp', lang: 'bash' },
    { p: 'Run `/mcp` to complete the OAuth sign-in. Workspace members can connect; guests can\'t. More: [Notion MCP](/plugins/notion-mcp/).' },

    { h3: '8. Supabase MCP (or Neon): your database' },
    { p: 'Supabase\'s server lets Claude manage tables, fetch project config and query data. Supabase asks you to read its MCP security best practices first, because connecting an LLM to a database carries real risk. Scoping the server to one project in read-only mode is a sensible start:' },
    { code: 'claude mcp add --scope project --transport http supabase \\\n  "https://mcp.supabase.com/mcp?project_ref=<your-project-ref>&read_only=true"', lang: 'bash' },
    { p: 'Run `/mcp` to sign in to Supabase. On Neon instead? `npx neon@latest init` signs you in and configures Neon\'s server for Claude Code, and `https://mcp.neon.tech/mcp?readonly=true` limits it to reads. More: [Supabase MCP Server](/plugins/supabase-mcp/), [Neon MCP Server](/plugins/neon-mcp/).' },

    { h3: '9. Figma MCP Server: designs to code' },
    { p: 'Figma\'s hosted server brings design context from your Figma files into Claude Code, so the code it writes can match your designs:' },
    { code: 'claude mcp add --transport http figma https://mcp.figma.com/mcp', lang: 'bash' },
    { p: 'Sign in through Figma\'s OAuth flow, then paste a link to a frame or layer into your prompt. More: [Figma MCP Server](/plugins/figma-mcp/).' },

    { h3: '10. Cloudflare MCP server: your Cloudflare account' },
    { p: 'Cloudflare\'s recommended server covers the whole Cloudflare API through a few code-mode tools, so Claude can inspect and change zones, Workers, DNS and more. Cloudflare also runs separate hosted servers for docs, Browser Run and containers. Cloudflare\'s own README now marks its older observability and bindings servers as deprecated in favour of this one:' },
    { code: 'claude mcp add --transport http cloudflare-api https://mcp.cloudflare.com/mcp', lang: 'bash' },
    { p: 'Run `/mcp` to sign in with Cloudflare OAuth and choose the permissions to grant. For CI, send a scoped API token as a Bearer header instead. It can change real settings, so review each action. More: [Cloudflare MCP servers](/plugins/cloudflare-mcp/).' },

    { h3: 'Also worth a look' },
    { ul: [
      'Web search and scraping: [Exa](/plugins/exa-mcp/), [Firecrawl](/plugins/firecrawl-mcp/) and [Brave Search](/plugins/brave-search-mcp/).',
      'Payments: [Stripe MCP](/plugins/stripe-mcp/). It can change a real account, so review every action.',
    ] },

    { h2: 'Servers you can usually skip', id: 'skip' },
    { p: 'Claude Code already reads and edits files in your project and loads project instructions from `CLAUDE.md` (or from `AGENTS.md` when there is no `CLAUDE.md`, on recent versions; see [Cursor rules vs AGENTS.md](/guides/cursor-rules-vs-agents-md/)). That makes general-purpose [Filesystem](/plugins/filesystem-mcp/) and [Memory](/plugins/memory-mcp/) servers mostly redundant in Claude Code. They\'re more useful when you want the same setup across several MCP apps, or access to folders outside the project.' },

    { h2: 'Share servers with your team', id: 'share' },
    { p: 'Add a server with `--scope project` (or write the entry by hand) and commit the resulting `.mcp.json`. Teammates get a prompt to approve each project server the first time Claude Code sees it. Keep secrets out of the file with environment variables: `.mcp.json` expands `${VAR}` and `${VAR:-default}`.' },
    { code: '{\n  "mcpServers": {\n    "github": {\n      "type": "http",\n      "url": "https://api.githubcopilot.com/mcp/",\n      "headers": {\n        "Authorization": "Bearer ${GITHUB_PAT}"\n      }\n    },\n    "playwright": {\n      "type": "stdio",\n      "command": "npx",\n      "args": ["-y", "@playwright/mcp@latest"]\n    }\n  }\n}', lang: 'json', caption: '.mcp.json' },
    { p: 'Remote entries need a `"type"` (`"http"`, `"sse"` or `"ws"`). An entry with a `url` but no `type` is read as a stdio server and skipped with an error.' },
    { p: 'If a remote server gets an empty token and answers 401, check the variable name. In remote `url` and `headers` values, Claude Code deliberately reads some well-known credential variables as empty, such as `ANTHROPIC_API_KEY` or `NPM_TOKEN`, so they can\'t leak to a third-party server. Use a name of your own, like `GITHUB_PAT` above.' },

    { h2: 'Common errors and fixes', id: 'errors' },
    { h3: '/mcp says "No MCP servers configured"' },
    { ul: [
      'You added the server from a different folder. Local-scope servers belong to the project you ran `claude mcp add` in. Re-add it here, or use `--scope user`.',
      'You edited the wrong file. Claude Code reads `~/.claude.json` and `<project>/.mcp.json`, not paths like `~/.claude/mcp.json`.',
      'An entry in `.mcp.json` is malformed. Run `claude mcp list` and look for the parse warning that names the field.',
    ] },
    { h3: '"Failed to connect" or "Connection error"' },
    { ul: [
      'Run `claude mcp get <name>`: on recent versions it shows the HTTP status and the server\'s error text.',
      'For a remote server, test the URL with `curl -I <url>` (`curl.exe` in PowerShell). A 404 or 405 still means it\'s reachable, since many MCP endpoints only answer POST; a 401 or 403 means you need to sign in or fix your token.',
      'For a local server, run its command directly (for example `npx -y @playwright/mcp@latest`). If it errors, the message names what\'s missing. If it starts and waits, check that you put `--` before the command when adding it.',
    ] },
    { h3: 'Timed out at startup' },
    { p: 'The first run of an `npx` server can be slow while it downloads. Raise the startup timeout (in milliseconds):' },
    { code: 'MCP_TIMEOUT=60000 claude', lang: 'bash' },
    { h3: '"already exists"' },
    { p: 'A server with that name already exists in that scope. Remove it with `claude mcp remove <name>` (add `--scope` if it exists in more than one) or pick another name.' },
    { h3: 'Connected, but no tools' },
    { p: 'The server is usually missing a required environment variable such as an API key. Pass it with `--env KEY=value` (before `--`) or in the entry\'s `env` field.' },
    { h3: 'Edits to .mcp.json don\'t take effect' },
    { p: 'Claude Code reads `.mcp.json` when a session starts, so exit and restart. If you rejected the server earlier, reset your choices with `claude mcp reset-project-choices`.' },
    { h3: 'OAuth sign-in fails' },
    { p: 'Run `/mcp`, select the server and choose **Authenticate** again. If the browser doesn\'t open, copy the URL from the terminal into your browser.' },

    { h2: 'Building your own server?', id: 'build' },
    { p: 'Anthropic\'s `mcp-server-dev` plugin can scaffold one: run `/plugin install mcp-server-dev@claude-plugins-official` inside Claude Code, then `/mcp-server-dev:build-mcp-server`. Test it with the [MCP Inspector](/plugins/mcp-inspector/), or start from a framework like [FastMCP](/plugins/fastmcp/). If you want ready-made prompts for this, our own (paid) [Agent Builder Rules + Prompts](/packs/) pack includes MCP server scaffolding prompts and rules for Claude Code and Cursor.' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'How many MCP servers should I add?' },
    { p: 'Only the ones you\'ll use. Each server\'s tool names and instructions take up context in every session. Turn one off in the `/mcp` panel to keep its config without loading it, and remove the ones you\'ve stopped using.' },
    { h3: 'Can I reuse servers I set up in Claude Desktop or claude.ai?' },
    { p: 'Yes. `claude mcp add-from-claude-desktop` imports Claude Desktop servers (macOS and WSL). Connectors you added at claude.ai show up automatically when you sign in to Claude Code with that claude.ai account.' },
    { h3: 'Using Cursor too?' },
    { p: 'Most of these servers work in Cursor as well. See [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/).' },
  ],
  related: ['claude-code', 'github-mcp-server', 'context7', 'playwright-mcp', 'sentry-mcp', 'supabase-mcp', 'cloudflare-mcp'],
  sources: [
    { label: 'Claude Code docs: Connect Claude Code to tools via MCP', url: 'https://code.claude.com/docs/en/mcp' },
    { label: 'Claude Code docs: Connect to MCP servers (quickstart and troubleshooting)', url: 'https://code.claude.com/docs/en/mcp-quickstart' },
    { label: 'GitHub MCP Server README and remote-server docs', url: 'https://github.com/github/github-mcp-server' },
    { label: 'Context7: MCP clients', url: 'https://context7.com/docs/resources/all-clients' },
    { label: 'Playwright MCP README', url: 'https://github.com/microsoft/playwright-mcp' },
    { label: 'Chrome DevTools MCP: client configurations', url: 'https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/client-configurations.md' },
    { label: 'Sentry MCP README', url: 'https://github.com/getsentry/sentry-mcp' },
    { label: 'Linear docs: MCP server', url: 'https://linear.app/docs/mcp' },
    { label: 'Notion docs: Get started with MCP', url: 'https://developers.notion.com/docs/get-started-with-mcp' },
    { label: 'Supabase MCP README', url: 'https://github.com/supabase-community/supabase-mcp' },
    { label: 'Neon MCP Server README', url: 'https://github.com/neondatabase/mcp-server-neon' },
    { label: 'Cloudflare MCP server repo (servers, URLs, deprecations)', url: 'https://github.com/cloudflare/mcp-server-cloudflare' },
    { label: 'Cloudflare API MCP server README', url: 'https://github.com/cloudflare/mcp' },
    { label: 'Figma docs: Remote MCP server installation', url: 'https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/' },
  ],
};

const plugins: Guide = {
  slug: "install-claude-code-plugins",
  title: "How to install Claude Code plugins (marketplaces, scopes & fixes)",
  h1: "How to install Claude Code plugins",
  description: "Install Claude Code plugins from the official marketplace or any GitHub repo: /plugin commands, install scopes, updates, safety checks and fixes for common errors.",
  published: "2026-10-21", updated: "2026-10-21",
  intro: "Claude Code plugins bundle skills, subagents, hooks and MCP servers so you can add a whole workflow or integration in one step. This guide covers installing from Anthropic's official marketplace and from other repositories, choosing a scope, keeping plugins updated, checking what a plugin can do before you trust it, and fixing the errors people hit most.",
  blocks: [

    { h2: "Quick answer", id: "quick-answer" },
    { ol: [
      "Open a terminal in your project and start Claude Code with `claude`.",
      "Run `/plugin` to browse the **Discover** tab, or open one plugin's details directly with `/plugin install <name>@claude-plugins-official`.",
      "Read what the plugin will install, then choose a scope: you (every project), everyone on this repository, or you in this repository only.",
      "Type `/` and look for the plugin's skills, which appear as `/plugin-name:skill-name`.",
    ] },
    { p: "`/plugin` only works inside a Claude Code terminal session. To install from a script or a plain shell, use `claude plugin install` instead (see below)." },

    { h2: "What a plugin is (and when you need one)", id: "what" },
    { p: "A plugin is a folder of components that Claude Code installs and loads as one unit: **skills** (SKILL.md instructions), **agents** (subagents Claude can delegate to), **hooks** (commands that run at points such as after every edit) and **MCP or LSP servers**. Plugins come from a **marketplace**, which is just a catalog: a repository with a `.claude-plugin/marketplace.json` file listing plugins and where to fetch each one." },
    { p: "You don't need a plugin for a single skill or a single MCP server. A skill saved in `~/.claude/skills/` already works in every project (see [how to create an Agent Skill](/guides/how-to-create-agent-skills/)), and one MCP server is a single `claude mcp add` command (see [the best MCP servers for Claude Code](/guides/best-mcp-servers-for-claude-code/)). Plugins are worth it when you want several pieces packaged together, with updates from the marketplace." },

    { h2: "Install from the official marketplace", id: "official" },
    { p: "Claude Code adds Anthropic's official marketplace, `claude-plugins-official`, the first time you start an interactive terminal session. It lists plugins Anthropic maintains plus plugins from partners and other authors. This example installs `commit-commands`, which adds commands for committing, pushing and opening pull requests:" },
    { code: "/plugin install commit-commands@claude-plugins-official", lang: "text", caption: "Inside a Claude Code session" },
    { ol: [
      "The command opens the plugin's details instead of installing straight away.",
      "Check **Will install**: the commands, agents, skills, hooks and MCP and LSP servers the plugin adds. For plugins in the official marketplace, a **Context cost** estimate shows what it adds to every message and what its skills add once loaded.",
      "Pick a scope (next section). Claude Code installs the plugin and any plugins it depends on.",
      "If the summary says `Plugin is now active.`, you're done. If it says `Run /reload-plugins to apply.`, Claude Code runs that reload for you when the panel closes.",
    ] },
    { p: "Then type `/` and look for `/commit-commands:commit`. The **Installed** tab in `/plugin` and `claude plugin list` in your shell also list the plugin with its scope." },
    { h3: "Pick a scope" },
    { ul: [
      "**User** (Install for you): every project on this machine. Saved in `~/.claude/settings.json`.",
      "**Project** (Install for all collaborators on this repository): saved in `.claude/settings.json`, which you commit. That turns the plugin on for teammates but doesn't download it for them, so each person runs `claude plugin install <plugin>@<marketplace> --scope project` once.",
      "**Local** (Install for you, in this repo only): saved in `.claude/settings.local.json`.",
    ] },
    { p: "If the same plugin is set at several scopes, local beats project and project beats user." },

    { h2: "Install from your shell, the desktop app or VS Code", id: "surfaces" },
    { p: "From a shell or setup script, without starting a session (user scope unless you pass `--scope`):" },
    { code: "claude plugin install commit-commands@claude-plugins-official\nclaude plugin install commit-commands@claude-plugins-official --scope project", lang: "bash" },
    { p: "On a machine where nobody has opened an interactive Claude Code session yet, the official marketplace isn't registered, so add it first with `claude plugin marketplace add anthropics/claude-plugins-official`. Shell installs load the next time you start Claude Code, or after `/reload-plugins` in an open session." },
    { ul: [
      "**Desktop app** (local or SSH session in the Code tab): click **+** next to the prompt box, choose **Add plugins**, select the plugin and a scope.",
      "**VS Code extension**: type `/plugins` to open **Manage plugins** and click **Install** on the Plugins tab. If the list is empty, add `anthropics/claude-plugins-official` on the Marketplaces tab first.",
      "**Cloud sessions** (including claude.ai/code) have no plugin browser and don't load the plugins installed on your machine.",
    ] },
    { p: "The terminal, the desktop app's local sessions and the VS Code extension share the same settings files, so a user-scope plugin installed in one shows up in the other two." },

    { h2: "Install from other marketplaces", id: "other-marketplaces" },
    { p: "Many plugins live in their authors' own marketplaces, usually a GitHub repository. Add the marketplace once, then install by `plugin@marketplace-name`:" },
    { code: "/plugin marketplace add <owner>/<repo>\n/plugin install <plugin>@<marketplace-name>", lang: "text" },
    { p: "Claude Code prints the marketplace name when it adds it. Two real examples from our directory:" },
    { code: "/plugin marketplace add android/skills\n/plugin install android-skills@android-skills", lang: "text", caption: "Android Skills (Google)" },
    { code: "/plugin marketplace add apify/apify-claude-code-plugin\n/plugin install apify@apify", lang: "text", caption: "Apify MCP Server + skills" },
    { p: "Anthropic also runs two other general marketplaces you add yourself: the community marketplace (`/plugin marketplace add anthropics/claude-plugins-community`, install with `@claude-community`) and a small demo marketplace in `anthropics/claude-code` (named `claude-code-plugins`). Older tutorials often add the demo one; most of its plugins, such as `code-review` and `commit-commands`, are also in the official marketplace, so install them from there to avoid duplicates." },
    { p: "`/plugin marketplace add` also accepts a full git URL, a local folder or an `https://` URL to a `marketplace.json`. Recent versions can add and install in one step with `--marketplace`, for example `/plugin install deploy-helper --marketplace your-org/plugins` (Claude Code v2.1.275 or later in a session, v2.1.292 or later for `claude plugin install`)." },

    { h2: "Plugins worth trying first", id: "try" },
    { p: "This isn't a ranking and nobody paid to be listed. Each name below is in the official marketplace, so install it with `/plugin install <name>@claude-plugins-official`." },
    { ul: [
      "**From Anthropic**: `commit-commands` (commit, push, open a PR), `code-review` (multi-agent review of a pull request), `feature-dev` (a guided feature workflow with exploration, architecture and review agents) and `security-guidance` (security review of the code Claude writes).",
      "**Code intelligence**: language-server plugins such as `typescript-lsp` and `pyright-lsp` let Claude see type errors after its edits and navigate by symbol. Install the language server itself first; for TypeScript that's `npm install -g typescript-language-server typescript`.",
      "**Services you already use**: the official marketplace includes plugins named `context7`, `github`, `playwright`, `sentry`, `supabase`, `linear`, `notion` and `figma`. Our listings explain each tool: [Context7](/plugins/context7/), [GitHub MCP Server](/plugins/github-mcp-server/), [Playwright MCP](/plugins/playwright-mcp/), [Sentry MCP](/plugins/sentry-mcp/), [Supabase MCP](/plugins/supabase-mcp/).",
      "**Skills**: `skill-creator` helps you write, improve and test your own skills.",
    ] },
    { p: "[Serena](/plugins/serena/) also appears in the official marketplace, but its maintainers ask users to install it with uv instead because marketplace entries can carry outdated commands. When a tool's own docs give a different install path, follow the tool's docs." },
    { p: "Each enabled plugin adds the names and descriptions of its skills, agents and commands to Claude's context on every turn, and its MCP servers run alongside each session. Install the few you'll use. To see what an installed plugin costs, run `claude plugin details <name>` and read the `Always-on` line; the **Installed** tab groups plugins you haven't used recently under **Not used recently**." },

    { h2: "Check a plugin before you trust it", id: "safety" },
    { p: "A plugin runs with your user permissions. Its hooks, MCP servers and language servers run outside Claude Code's sandbox, and its skills become instructions Claude follows. Anthropic's install screen says it plainly: Anthropic doesn't control what MCP servers, files or other software plugins include." },
    { ul: [
      "Run `claude plugin marketplace list` to see where each marketplace came from.",
      "In the plugin's details pane, choose **Open homepage** or **View on GitHub** and read `hooks/hooks.json` (what each hook runs), `.mcp.json` (each server's command or URL) and anything in `bin/`.",
      "Prefer plugins from the company behind the service. Names such as `claude-plugins-official` are reserved: Claude Code only accepts them from `github.com/anthropics/` repositories, so a third-party catalog can't pose as Anthropic's.",
      "Remember that updates can change what you reviewed. Auto-update is on by default for the official marketplace and off for third-party ones.",
    ] },

    { h2: "Update, disable or remove plugins", id: "manage" },
    { p: "Run `/plugin` and press Tab to reach **Installed**. Select a plugin to disable, update or uninstall it, or press Space to toggle it. From your shell:" },
    { code: "claude plugin list\nclaude plugin disable <plugin>@<marketplace>\nclaude plugin enable <plugin>@<marketplace>\nclaude plugin update <plugin>@<marketplace>\nclaude plugin uninstall <plugin>@<marketplace> --scope project", lang: "bash" },
    { p: "Updated plugins load in your next session, or after `/reload-plugins`. Removing a marketplace (`claude plugin marketplace remove <name>`) also uninstalls every plugin you installed from it." },

    { h2: "Common errors and fixes", id: "errors" },
    { h3: "\"zsh: no such file or directory: /plugin\"" },
    { p: "You typed `/plugin` at the shell prompt. Run `claude` first and type it at the Claude Code prompt, or use `claude plugin install <plugin>@<marketplace>` in the shell." },
    { h3: "\"/plugin isn't available in this environment\"" },
    { p: "`/plugin` needs a terminal session. It doesn't run with `claude -p`, the Agent SDK, the desktop app's Code tab or claude.ai/code, and in the VS Code panel only `/plugin` or `/plugins` on its own opens **Manage plugins**. Use that surface's own install steps above, or a terminal." },
    { h3: "Marketplace \"claude-plugins-official\" not found" },
    { p: "The official marketplace isn't registered yet, which happens if you've only used the VS Code extension, a policy blocks it, or `CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL` is set. Add it and retry:" },
    { code: "/plugin marketplace add anthropics/claude-plugins-official", lang: "text" },
    { p: "The same fix applies when the **Discover** tab is empty or `claude plugin marketplace list` says `No marketplaces configured`." },
    { h3: "Plugin \"<name>\" not found in any marketplace" },
    { p: "You left off `@marketplace`, so Claude Code only searched catalogs it already had. Name the marketplace (`/plugin install <name>@<marketplace>`), which refreshes it first, or copy the exact name from the **Discover** tab. If the plugin lives in a third-party marketplace, add that marketplace first." },
    { h3: "\"not found in marketplace\" with a refresh hint" },
    { p: "Your local copy of the catalog is out of date. Refresh it, then install again:" },
    { code: "/plugin marketplace update <marketplace>", lang: "text" },
    { h3: "Installed, but its skills don't show up" },
    { ul: [
      "Check **Installed** in `/plugin` (or `claude plugin list`) and make sure it's enabled.",
      "Open the **Errors** tab in `/plugin`; each entry says what failed.",
      "If you installed it during this session, run `/reload-plugins`.",
      "Open the plugin's details: a plugin that lists no skills has none to show when you type `/`.",
    ] },
    { h3: "\"This reload changes MCP tools … Run /reload-plugins --force to apply\"" },
    { p: "Adding or removing a plugin's MCP server would invalidate the prompt cache, so Claude Code waits. Run `/reload-plugins --force` to apply it now (your next message re-reads the whole conversation), or start a new session." },

    { h2: "FAQ", id: "faq" },
    { h3: "What's the difference between a plugin and an MCP server?" },
    { p: "An MCP server gives Claude tools. A plugin is a package that can include MCP servers along with skills, subagents and hooks. Many plugins in the official marketplace, such as `github` or `sentry`, package a service's MCP server for you." },
    { h3: "Do plugins work on claude.ai or in the desktop app?" },
    { p: "The desktop app's local and SSH sessions do (use **+ → Add plugins**). Cloud sessions, including claude.ai/code, don't load plugins from your machine. claude.ai and Cowork have their own plugin support with a different set of components." },
    { h3: "Using Cursor too?" },
    { p: "Cursor has its own plugin format and marketplace, installed from **Customize**. See [Cursor Plugins](/plugins/cursor-plugins/), and [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/) for single servers." },
  ],
  related: ["claude-code-plugins", "claude-code", "android-skills", "apify-mcp", "serena", "cursor-plugins"],
  sources: [
    { label: "Claude Code docs: Install and manage plugins", url: "https://code.claude.com/docs/en/plugins/install" },
    { label: "Claude Code docs: Anthropic's marketplaces", url: "https://code.claude.com/docs/en/plugins/anthropic-marketplaces" },
    { label: "Claude Code docs: Plugins overview", url: "https://code.claude.com/docs/en/plugins/overview" },
    { label: "Claude Code docs: Plugin security and trust", url: "https://code.claude.com/docs/en/plugins/security" },
    { label: "Claude Code docs: Troubleshoot plugins", url: "https://code.claude.com/docs/en/plugins/troubleshooting" },
    { label: "Claude Code docs: Plugin commands reference", url: "https://code.claude.com/docs/en/plugins/cli-reference" },
    { label: "Claude Code docs: Code intelligence plugins", url: "https://code.claude.com/docs/en/plugins/code-intelligence" },
    { label: "anthropics/claude-plugins-official (marketplace.json and README)", url: "https://github.com/anthropics/claude-plugins-official" },
    { label: "Android Skills README (plugin install)", url: "https://github.com/android/skills" },
    { label: "Apify docs: Install the Apify plugin in your AI agent", url: "https://docs.apify.com/agents/plugins" },
    { label: "Serena README (installation)", url: "https://github.com/oraios/serena" },
  ],
};

const skills: Guide = {
  slug: "how-to-create-agent-skills",
  title: "How to create an Agent Skill (SKILL.md) for Claude Code, Cursor and Codex",
  h1: "How to create an Agent Skill (SKILL.md)",
  description: "Write a SKILL.md that works in Claude Code, Cursor and Codex: where the folder goes, the frontmatter rules, a copy-paste example, and fixes when a skill won't trigger.",
  published: "2026-10-21", updated: "2026-10-21",
  intro: "An Agent Skill is a folder with a `SKILL.md` file that teaches a coding agent how to do one job, such as reviewing changes before a commit or following your deploy steps. Skills follow an open standard, so the same file works in Claude Code, Cursor and Codex. Only the folder locations and a few optional settings differ. This guide walks through a working example and the differences that trip people up.",
  blocks: [

    { h2: "Quick answer", id: "quick-answer" },
    { ol: [
      "Make a folder named after the skill, in lowercase with hyphens, for example `review-changes`, inside your tool's skills folder: `.claude/skills/` for Claude Code, `.agents/skills/` for Codex. Cursor reads either.",
      "Add a `SKILL.md` that starts with YAML frontmatter containing `name` (the same as the folder name) and `description` (what it does and when to use it), followed by the instructions.",
      "Ask for something that matches the description and the agent loads the skill on its own, or run it directly: `/review-changes` in Claude Code and Cursor, `$review-changes` in Codex.",
    ] },

    { h2: "How skills work", id: "how" },
    { p: "Agents load skills in stages. At the start of a session they only see each skill's `name` and `description`. When a request matches a description, the agent reads the full `SKILL.md`, and it opens extra files in the skill folder only if the instructions point to them. That's why you can install many skills without filling the context window, and why the `description` decides whether a skill ever gets used." },
    { p: "Skills are different from always-on instructions. Files such as `CLAUDE.md`, [AGENTS.md](/plugins/agents-md/) and [Cursor rules](/plugins/cursor-rules/) apply to every session. A skill only loads when it's relevant or when you call it. They're also different from MCP servers: a skill is instructions (plus optional scripts), while an [MCP server](/guides/add-mcp-server-to-cursor/) gives the agent new tools." },

    { h2: "Where the skill folder goes", id: "locations" },
    { ul: [
      "**Claude Code**: `.claude/skills/<name>/SKILL.md` in the project (commit it to share with your team) or `~/.claude/skills/<name>/SKILL.md` for all your projects. In a monorepo it also loads `.claude/skills/` from parent folders up to the repository root.",
      "**Cursor**: `.agents/skills/` or `.cursor/skills/` in the project, `~/.agents/skills/` or `~/.cursor/skills/` for all projects. For compatibility it also reads `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/` and `~/.codex/skills/`.",
      "**Codex**: `.agents/skills/` in the folder you start Codex in and every parent folder up to the repository root, plus `~/.agents/skills/` (written as `$HOME/.agents/skills` in OpenAI's docs) for all projects.",
    ] },
    { h3: "One skill for all three tools" },
    { p: "If you only use Claude Code and Cursor, `.claude/skills/` is enough, since Cursor reads it too. If you also use Codex, keep the real folder in `.agents/skills/` (read by Cursor and Codex) and link it into `.claude/skills/` for Claude Code, which follows symlinked skill folders. On macOS or Linux, from the project root:" },
    { code: "mkdir -p .agents/skills/review-changes .claude/skills\nln -s ../../.agents/skills/review-changes .claude/skills/review-changes", lang: "bash" },

    { h2: "Write the SKILL.md", id: "write" },
    { p: "This skill reviews uncommitted changes before a commit. It uses only the fields all three tools understand. Save it as `SKILL.md` inside the `review-changes` folder:" },
    { code: "---\nname: review-changes\ndescription: Reviews uncommitted git changes and flags risky edits, missing tests and leftover debug code. Use when the user asks what changed, wants a review before committing, or asks for a commit message.\n---\n\n# Review changes\n\n1. Run git status and git diff HEAD to see what changed.\n2. Summarize the changes in two or three bullet points.\n3. List risks: missing error handling, hardcoded secrets or URLs, deleted or skipped tests, debug logging left in.\n4. Suggest a one-line commit message in the imperative mood.\n\nIf there are no uncommitted changes, say so and stop.", lang: "text", caption: ".agents/skills/review-changes/SKILL.md" },
    { h3: "Frontmatter rules" },
    { ul: [
      "The opening `---` has to be the very first line of the file, or the frontmatter is read as plain text.",
      "`name`: up to 64 characters, lowercase letters, numbers and hyphens only, no hyphen at the start or end, no double hyphens, and the same as the folder name. Claude Code treats `name` as optional (it falls back to the folder name), but Cursor and Codex require it, so always set it.",
      "`description`: up to 1,024 characters under the open standard. Say what the skill does **and** when to use it, with the words people actually type. Put the main use case first: Claude Code cuts long descriptions in its skill list and Codex shortens descriptions when many skills are installed.",
    ] },
    { h3: "Keep the body short" },
    { p: "Write direct, numbered steps with clear inputs and outputs. The open standard suggests keeping `SKILL.md` under 500 lines and moving detail into the skill folder:" },
    { code: "review-changes/\n├── SKILL.md\n├── references/   # longer docs the agent reads only when needed\n├── scripts/      # code the agent can run\n└── assets/       # templates, schemas, example files", lang: "text" },
    { p: "Point to those files with paths relative to the skill folder, for example \"See references/checklist.md for the full checklist\", and keep references one level deep." },

    { h2: "Optional settings that differ by tool", id: "options" },
    { ul: [
      "**Manual-only skills** (for steps with side effects, like deploying): add `disable-model-invocation: true` to the frontmatter in Claude Code and Cursor, and the agent won't load the skill on its own. In Codex, add an `agents/openai.yaml` file to the skill with `allow_implicit_invocation: false` under `policy`.",
      "**Only for certain files**: Claude Code and Cursor accept `paths` with glob patterns such as `\"**/*.tsx\"`, so the skill only comes up when the agent works on matching files.",
      "**Pre-approved tools**: `allowed-tools` is an experimental field in the open standard. In Claude Code it lets the skill use the listed tools without asking, for the turn that invokes it.",
      "**Claude Code extras**: `context: fork` runs the skill in a subagent, `argument-hint` and `$ARGUMENTS` pass arguments, and dynamic context injection runs a shell command and inlines its output before Claude reads the skill.",
    ] },
    { p: "For a skill you plan to share across tools, stick to `name` and `description` (plus the standard's optional `license`, `compatibility` and `metadata`) and put everything else in the instructions." },

    { h2: "Use and test the skill", id: "use" },
    { ul: [
      "**Claude Code**: ask \"What did I change?\" or run `/review-changes`. Edits to existing skill folders are picked up during the session; if you create a new top-level skills folder mid-session, run `/reload-skills`. Ask \"What skills are available?\" to confirm it loaded.",
      "**Cursor**: ask in Agent chat, or type `/` and pick the skill. Discovered skills are listed under **Customize → Skills**.",
      "**Codex**: ask in the CLI or IDE extension, run `/skills`, or type `$review-changes`. Codex picks up changes automatically; restart it if the skill doesn't appear.",
    ] },
    { p: "Test it with a few differently worded requests. If it fires when it shouldn't, make the description narrower; if it never fires, add the words people actually say." },

    { h2: "Let the agent draft it", id: "creators" },
    { p: "Each tool has a built-in helper that interviews you and writes the folder:" },
    { ul: [
      "**Claude Code**: install Anthropic's skill-creator plugin with `/plugin install skill-creator@claude-plugins-official`; it can also run evals on a skill. See [how to install Claude Code plugins](/guides/install-claude-code-plugins/).",
      "**Cursor**: type `/create-skill` in Agent chat. `/migrate-to-skills` converts eligible rules and slash commands into skills.",
      "**Codex**: run `$skill-creator`.",
    ] },
    { p: "Read what it writes before relying on it, especially any scripts." },

    { h2: "Share skills with your team", id: "share" },
    { ul: [
      "**In one repository**: commit the project skills folder. Everyone who opens the repo gets the skill.",
      "**Across repositories**: package skills in a plugin. Claude Code installs plugins from marketplaces ([Claude Code Plugins](/plugins/claude-code-plugins/)), Cursor imports skills from GitHub only through plugins ([Cursor Plugins](/plugins/cursor-plugins/)), and OpenAI recommends plugins for distributing Codex skills.",
    ] },

    { h2: "Ready-made skills to learn from", id: "examples" },
    { ul: [
      "[Agent Skills (Anthropic)](/plugins/agent-skills/): Anthropic's public repository of example and document skills, plus a skill template.",
      "[Android Skills](/plugins/android-skills/): Google's official skills for Android tasks such as Compose migration and AGP upgrades, installable as plugins for Claude Code and Codex.",
    ] },
    { p: "Building MCP servers? Our own (paid) [Agent Builder Rules + Prompts](/packs/) pack includes two Claude Code skills for MCP server work and evals." },

    { h2: "Common problems and fixes", id: "errors" },
    { h3: "The skill never triggers" },
    { ul: [
      "Rewrite the `description` with the keywords people would use, and lead with the main use case.",
      "Run it directly (`/name` or `$name`). If that works, the problem is the description; if it doesn't, the skill isn't loading.",
      "Check the folder: `SKILL.md` must be spelled exactly like that, inside a folder whose name matches `name`, in one of the locations above.",
    ] },
    { h3: "The frontmatter is ignored" },
    { p: "In Claude Code, broken YAML makes the skill load with empty metadata: `/name` still works but Claude can't match the description. Start with `claude --debug` to see the parse error, or check the whole folder with `claude plugin validate .claude/skills` (Claude Code v2.1.233 or later). The open standard's `skills-ref validate ./my-skill` checks the frontmatter and naming rules for any tool." },
    { h3: "The skill triggers too often" },
    { p: "Make the description more specific, or make the skill manual-only with the settings under Optional settings above." },
    { h3: "A Codex skill is missing" },
    { p: "Restart Codex, and check `~/.codex/config.toml` for a `[[skills.config]]` entry that sets `enabled = false` for that skill's path." },

    { h2: "FAQ", id: "faq" },
    { h3: "Do my old Claude Code custom commands still work?" },
    { p: "Yes. Files in `.claude/commands/` still work and create the same `/name` commands. Skills add a folder for supporting files and control over whether Claude can load them on its own." },
    { h3: "Skill, rule or AGENTS.md?" },
    { p: "Use `AGENTS.md`, `CLAUDE.md` or an always-on rule for facts every session needs (stack, conventions, test command). Use a skill for a specific procedure that only matters sometimes, so it doesn't take up context the rest of the time." },
    { h3: "Can a skill run scripts?" },
    { p: "Yes. Put them in `scripts/` and tell the agent when to run them. They run with the agent's normal permissions, so review scripts in skills you didn't write." },
  ],
  related: ["agent-skills", "android-skills", "claude-code", "codex-cli", "cursor-rules", "agents-md"],
  sources: [
    { label: "Claude Code docs: Extend Claude with skills", url: "https://code.claude.com/docs/en/skills" },
    { label: "Cursor docs: Agent Skills", url: "https://cursor.com/docs/skills" },
    { label: "OpenAI docs: Build skills (ChatGPT and Codex)", url: "https://learn.chatgpt.com/docs/build-skills" },
    { label: "Agent Skills specification", url: "https://agentskills.io/specification" },
    { label: "Claude Code docs: Install and manage plugins", url: "https://code.claude.com/docs/en/plugins/install" },
    { label: "Android skills overview (Android Developers)", url: "https://developer.android.com/tools/agents/android-skills" },
  ],
};


const rules: Guide = {
  slug: 'cursor-rules-vs-agents-md',
  title: 'Cursor rules vs AGENTS.md: which to use (and .cursorrules)',
  h1: 'Cursor rules vs AGENTS.md',
  description: 'Cursor rules (.cursor/rules .mdc), the legacy .cursorrules file and AGENTS.md compared: what each does, which tools read it, when to use each, with examples.',
  published: '2026-10-27', updated: '2026-10-27',
  intro: 'Cursor gives you three ways to hand your coding agent standing instructions: project rules in `.cursor/rules`, an `AGENTS.md` file, and the older `.cursorrules` file. They overlap, and they work differently. This guide explains each one, which tools read it, and which to pick, with copy-paste examples checked against Cursor\'s docs and the agents.md site.',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ul: [
      '**Use `AGENTS.md`** for plain, always-relevant project instructions (setup, test and lint commands, code style). It is an open format that many coding agents read, and Cursor reads it in your project root and in subfolders.',
      '**Use `.cursor/rules/*.mdc`** when you need Cursor to apply an instruction only sometimes: for certain file patterns, when the agent judges it relevant, or only when you @-mention it.',
      '**Don\'t start with `.cursorrules`.** Cursor calls it legacy and says it will be deprecated. If you have one, migrate it.',
      '**Using several agents?** Put the shared basics in `AGENTS.md` and keep Cursor-specific, file-scoped rules in `.cursor/rules`.',
    ] },

    { h2: 'The three options at a glance', id: 'compare' },
    { ul: [
      '**Project rules**: `.mdc` files in `.cursor/rules/`. Cursor-only. YAML frontmatter controls when each rule loads. Supports folders and globs.',
      '**AGENTS.md**: one markdown file with no required fields or frontmatter. Cross-tool. Nested files in subfolders apply to that part of the repo.',
      '**.cursorrules**: a single file in the project root. Legacy. Always-on behaviour only, with no scoping.',
    ] },
    { p: 'Cursor also has **User Rules** (your personal preferences across projects, set in Customize) and **Team Rules** (managed from the dashboard on Team and Enterprise plans). Cursor applies them in this order when guidance conflicts: Team Rules, then Project Rules, then User Rules.' },

    { h2: 'Cursor project rules (.cursor/rules)', id: 'cursor-rules' },
    { p: 'Project rules live in `.cursor/rules` as `.mdc` files and are meant to be committed to git. The extension matters: Cursor\'s docs say a plain `.md` file in that folder is ignored because it has no frontmatter. Folders inside `.cursor/rules` are fine.' },
    { code: '.cursor/rules/\n  react-patterns.mdc      # recognized\n  api-guidelines.md       # ignored (wrong extension)\n  frontend/\n    components.mdc        # recognized', lang: 'text', caption: 'Rule files' },
    { p: 'Three frontmatter fields decide when a rule is included:' },
    { ul: [
      '`alwaysApply: true`: included in every chat session. Globs and description are ignored.',
      '`globs` set and `alwaysApply: false`: attached automatically when a matching file is in context (**Apply to Specific Files**).',
      '`description` set, no globs, `alwaysApply: false`: the agent reads the description and pulls the rule in when relevant (**Apply Intelligently**).',
      'None of them: the rule is only used when you @-mention it in chat (**Apply Manually**).',
    ] },
    { p: 'A rule that applies only to React components:' },
    { code: '---\nglobs: src/components/**/*.tsx\nalwaysApply: false\n---\n\n- Use named exports, not default exports\n- Co-locate styles in a module CSS file next to the component\n- Keep components under 200 lines', lang: 'text', caption: '.cursor/rules/components.mdc' },
    { p: 'A rule the agent can choose to load, plus a file reference. Cursor\'s docs note that `@template.ts` tells the agent where to look; the file is read when needed, not pasted into the prompt:' },
    { code: '---\ndescription: RPC service conventions and patterns for the backend\nalwaysApply: false\n---\n\n- Define each service in its own file under `src/services/`\n- Validate inputs at the service boundary\n- Read `@service-template.ts` before creating a new service', lang: 'text', caption: '.cursor/rules/services.mdc' },
    { p: 'Create one by typing `/create-rule` in Agent chat, or open **Customize**, go to **Rules** and click **Add Rule**. Cursor\'s tips: keep each rule under 500 lines, split big ones into smaller composable rules, point to example files instead of copying code, and add a rule only after you see the agent make the same mistake more than once. Rules don\'t affect Cursor Tab or other AI features.' },

    { h2: 'AGENTS.md', id: 'agents-md' },
    { p: '[AGENTS.md](/plugins/agents-md/) is an open format described at agents.md as "a README for agents". It is plain markdown with no required fields: headings are up to you. The agents.md site is stewarded by the Agentic AI Foundation under the Linux Foundation. A typical file:' },
    { code: '# AGENTS.md\n\n## Setup commands\n- Install deps: `pnpm install`\n- Start dev server: `pnpm dev`\n- Run tests: `pnpm test`\n\n## Code style\n- TypeScript strict mode\n- Single quotes, no semicolons', lang: 'text', caption: 'AGENTS.md' },
    { h3: 'How Cursor treats it' },
    { p: 'Cursor supports `AGENTS.md` in the project root and in subdirectories. Nested files are combined with their parents, and the more specific one wins when instructions conflict. Cursor describes it as a simple alternative to `.cursor/rules` for straightforward cases: no metadata, no globs, no rule types.' },
    { code: 'project/\n  AGENTS.md              # global instructions\n  frontend/\n    AGENTS.md            # frontend-specific\n  backend/\n    AGENTS.md            # backend-specific', lang: 'text', caption: 'Nested AGENTS.md' },
    { h3: 'Which tools read AGENTS.md' },
    { p: 'The agents.md site lists these among supported tools: Codex, Jules, Factory, Aider, goose, OpenCode, Zed, Warp, VS Code, Devin, Junie, Amp, Cursor, RooCode, Gemini CLI, Kilo Code, Windsurf, Augment Code and GitHub Copilot\'s coding agent. Two are worth knowing about:' },
    { ul: [
      '**Claude Code** reads `AGENTS.md` too, but only when your project has no `CLAUDE.md` (or `CLAUDE.local.md`) in the working directory or above it, and it needs Claude Code v2.1.277 or later. If you have both, it reads `CLAUDE.md` only, unless you change the **Project instructions** setting in `/config`.',
      '**Aider and Gemini CLI** need a one-line setting pointing at `AGENTS.md`; the agents.md FAQ shows each one.',
    ] },
    { p: 'See [Codex CLI](/plugins/codex-cli/), [OpenCode](/plugins/opencode/) and [Claude Code](/plugins/claude-code/) for those tools.' },
    { h3: 'Conflicts' },
    { p: 'Per agents.md, the closest `AGENTS.md` to the file being edited wins, and explicit instructions you type in chat override everything.' },

    { h2: '.cursorrules (legacy)', id: 'cursorrules' },
    { p: 'The `.cursorrules` file in your project root is the original format. Cursor\'s help center calls it legacy and says it will be deprecated. In March 2026 a Cursor team member said on the forum that it should still work for now, but that `.cursor/rules` is the actively supported format, and that when both exist the `.mdc` rules take precedence where they overlap. Treat it as something to move off, not build on.' },
    { h3: 'Migrate it' },
    { ol: [
      'Create a new rule: open the command palette and run **New Cursor Rule** (or use `/create-rule`).',
      'Copy the contents of `.cursorrules` into the new rule.',
      'Set the rule type to **Always Apply**, which matches the old behaviour.',
      'Delete `.cursorrules` from your project root.',
    ] },
    { p: 'If the instructions aren\'t Cursor-specific, you could put them in `AGENTS.md` instead and skip the rule file.' },

    { h2: 'When to use which', id: 'when' },
    { ul: [
      '**One small project, only Cursor:** either works. `AGENTS.md` is faster to write; a single always-apply rule is equivalent.',
      '**Team uses Cursor plus Claude Code, Codex or another agent:** `AGENTS.md` for the shared facts, so nobody maintains duplicate files.',
      '**Different conventions for different file types** (React components versus SQL migrations): `.cursor/rules` with globs. `AGENTS.md` has no way to scope by file pattern, other than nesting by folder.',
      '**A long reference the agent should only load when relevant:** an Apply Intelligently rule with a good description.',
      '**A checklist you want to trigger by hand** (release steps, migration template): an Apply Manually rule you @-mention.',
      '**Personal preferences** such as reply style: User Rules, not the repo.',
    ] },
    { h3: 'Using both' },
    { p: 'Cursor loads both, so a common setup is a short `AGENTS.md` for commands and conventions plus a few scoped `.mdc` rules. Avoid saying the same thing in both places: if the two disagree you\'re leaving the agent to guess. To keep a single source of truth for Claude Code as well, Anthropic\'s docs suggest a `CLAUDE.md` that imports `AGENTS.md`:' },
    { code: '@AGENTS.md\n\n## Claude Code\n\nUse plan mode for changes under `src/billing/`.', lang: 'text', caption: 'CLAUDE.md' },
    { p: 'A symlink (`ln -s AGENTS.md CLAUDE.md`) also works if you need no Claude-specific content, but Anthropic notes the import is safer on Windows.' },

    { h2: 'What to put in either one', id: 'what-to-write' },
    { ul: [
      'Exact commands: install, build, test, lint, and how to run a single test.',
      'Conventions the agent can\'t infer from the code, such as naming and folder layout.',
      'Hard rules: files that are generated, directories not to touch, checks to run before finishing.',
      'Pointers to canonical example files rather than copied code.',
    ] },
    { p: 'Cursor\'s docs advise against pasting whole style guides (use a linter), documenting every common command, and covering rare edge cases. Instructions are guidance for the model, not enforcement: for hard security limits, use permissions and review rather than a rules file.' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Does Cursor read AGENTS.md?' },
    { p: 'Yes. Cursor supports `AGENTS.md` in the project root and in subdirectories.' },
    { h3: 'Should I replace .cursor/rules with AGENTS.md?' },
    { p: 'Only if you don\'t need scoping. Rules can attach by glob, by description or by @-mention; `AGENTS.md` is always plain instructions.' },
    { h3: 'Can I use .md files in .cursor/rules?' },
    { p: 'No. Cursor\'s docs say project rules must use the `.mdc` extension and a plain `.md` file there is ignored. If you prefer plain markdown, use `AGENTS.md`.' },
    { h3: 'Why isn\'t my rule applying?' },
    { p: 'Check the rule type. For Apply Intelligently, make sure a description is set. For Apply to Specific Files, make sure the glob matches the files in context.' },
    { h3: 'Do rules apply to Cursor Tab?' },
    { p: 'No. Cursor says rules don\'t impact Cursor Tab or other AI features.' },
    { h3: 'Setting up MCP servers too?' },
    { p: 'MCP servers are configured separately in `mcp.json`. See [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/).' },
  ],
  related: ['cursor-rules', 'agents-md', 'cursor-plugins', 'codex-cli', 'claude-code', 'opencode'],
  sources: [
    { label: 'Cursor docs: Rules', url: 'https://cursor.com/docs/rules' },
    { label: 'Cursor help: Rules (including migrating from .cursorrules)', url: 'https://cursor.com/help/customization/rules' },
    { label: 'Cursor forum: .cursorrules is legacy, use .cursor/rules (staff reply, March 2026)', url: 'https://forum.cursor.com/t/project-rule-in-cursorrules-not-applied-in-agent-chat-works-in-cursor-rules/154309' },
    { label: 'agents.md: the AGENTS.md format, FAQ and supported tools', url: 'https://agents.md/' },
    { label: 'agentsmd/agents.md on GitHub', url: 'https://github.com/agentsmd/agents.md' },
    { label: 'Claude Code docs: How Claude remembers your project (CLAUDE.md and AGENTS.md)', url: 'https://code.claude.com/docs/en/memory' },
  ],
};

export const GUIDES: Guide[] = [cursor, claude, rules, plugins, skills, ...MCP_GUIDES, freeAiCourses];
export const guidePath = (slug: string) => `/guides/${slug}/`;
export const getGuide = (slug: string) => GUIDES.find(g => g.slug === slug);
