/**
 * Setup guides (/guides/<slug>/). Content is plain data so it can be rendered on the site and exported to markdown
 * (scripts/guides-md.mjs). Inline text supports [label](href), `code` and **bold**.
 * Every command, path and config snippet must match the official docs linked in `sources` (checked on `updated`).
 */
export type GuideBlock =
  | { h2: string; id?: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { code: string; lang: 'bash' | 'json' | 'powershell' | 'text'; caption?: string }
  | { note: string };
export type Guide = {
  slug: string; title: string; h1: string; description: string; published: string; updated: string;
  intro: string; blocks: GuideBlock[]; related: string[]; sources: { label: string; url: string }[];
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
  description: 'Nine official MCP servers worth adding to Claude Code, from GitHub and Context7 to Playwright and Sentry, with the exact claude mcp add command for each.',
  published: '2026-10-20', updated: '2026-10-20',
  intro: 'Claude Code can already read, edit and run code in your project. MCP servers connect it to the things it can\'t see on its own: your GitHub issues, current library docs, a real browser, production errors, your tickets and your database. Below are nine official servers worth considering, the exact command to add each one, and how to fix the usual setup problems.',
  blocks: [
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
    { p: 'Context7 pulls version-specific documentation and code examples into the conversation, which helps with libraries that changed after the model was trained. The quickest setup signs you in and configures Claude Code for you (needs Node.js 22.13+):' },
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

    { h3: 'Also worth a look' },
    { ul: [
      'Web search and scraping: [Exa](/plugins/exa-mcp/), [Firecrawl](/plugins/firecrawl-mcp/) and [Brave Search](/plugins/brave-search-mcp/).',
      'Payments and infrastructure: [Stripe MCP](/plugins/stripe-mcp/) and [Cloudflare MCP](/plugins/cloudflare-mcp/). These can change real accounts, so review every action.',
    ] },

    { h2: 'Servers you can usually skip', id: 'skip' },
    { p: 'Claude Code already reads and edits files in your project and loads project instructions from `CLAUDE.md`. That makes general-purpose [Filesystem](/plugins/filesystem-mcp/) and [Memory](/plugins/memory-mcp/) servers mostly redundant in Claude Code. They\'re more useful when you want the same setup across several MCP apps, or access to folders outside the project.' },

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
  related: ['claude-code', 'github-mcp-server', 'context7', 'playwright-mcp', 'sentry-mcp', 'supabase-mcp'],
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
    { label: 'Figma docs: Remote MCP server installation', url: 'https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/' },
  ],
};

export const GUIDES: Guide[] = [cursor, claude];
export const guidePath = (slug: string) => `/guides/${slug}/`;
export const getGuide = (slug: string) => GUIDES.find(g => g.slug === slug);
