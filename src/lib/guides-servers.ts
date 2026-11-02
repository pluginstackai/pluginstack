/**
 * Setup guides for one named MCP server each (/guides/<slug>/), aimed at "how do I set up X" searches.
 * Same data shape and rules as guides.ts: every command, URL and config snippet must match the sources linked in `sources`
 * (checked on `updated`). Imported into GUIDES in guides.ts.
 */
import type { Guide } from './guides.ts';

/** Join lines into a code-block string (keeps the config snippets readable in source). */
const j = (...lines: string[]) => lines.join('\n');

const DATE = '2026-11-02';

/* ------------------------------------------------------------------------------------------------------------------ */

const context7: Guide = {
  slug: 'context7-mcp-setup',
  title: 'How to set up Context7 MCP (Claude Code, Cursor, VS Code, Codex)',
  h1: 'How to set up Context7 MCP in Claude Code, Cursor, VS Code and Codex',
  description: 'Set up Context7 MCP for up-to-date library docs: the ctx7 setup command, the remote URL with an API key or OAuth, running it locally, and fixes for common errors.',
  published: DATE,
  updated: DATE,
  intro: "Context7 gives a coding agent current, version-specific documentation and code examples for the libraries you use, so it stops guessing at APIs that changed after the model was trained. This guide covers the one-command setup, adding the hosted server by hand in each client, running it locally, and what to check when it doesn't work. It's based on Context7's README, its docs site and the `@upstash/context7-mcp` and `ctx7` packages on npm (checked 2 November 2026).",
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ul: [
      '**Fastest:** run `npx ctx7 setup` (needs Node.js 22.13 or newer). It signs you in, creates an API key and configures your agent.',
      '**By hand:** add the remote server `https://mcp.context7.com/mcp` to your client. Send an API key as `Authorization: Bearer YOUR_API_KEY` for higher rate limits. It also works without one, with lower limits.',
      '**Locally:** run `npx -y @upstash/context7-mcp` as a stdio server. It still fetches docs from Context7\'s service, so it isn\'t offline.',
      '**Then:** add "use context7" to a prompt, or a rule telling the agent to use it for library questions.',
    ] },
    { freebie: true },

    { h2: 'What Context7 MCP is', id: 'what-is-context7' },
    { p: 'Context7 is a documentation service from Upstash. Its MCP server gives your agent two tools:' },
    { ul: [
      '`resolve-library-id` turns a library name such as "next.js" into a Context7 ID such as `/vercel/next.js`.',
      '`query-docs` fetches documentation and code examples for that ID, matched to your question.',
    ] },
    { p: 'IDs can include a version, such as `/vercel/next.js/v16.2.9`. Context7 can also run without MCP, as a CLI plus an agent skill. `ctx7 setup` offers both modes. This guide covers MCP mode, because that is what most clients and the searches for "context7 mcp" are about.' },

    { h2: 'Get an API key (optional)', id: 'api-key' },
    { p: 'The hosted server answers without a key, at low rate limits. For regular use, create a free key at context7.com/dashboard. Keys start with `ctx7sk`. Keep the key out of files you commit: the examples below use a placeholder or read it from an environment variable.' },
    { p: 'If your client supports OAuth for remote servers, you can sign in instead of using a key. Point it at `https://mcp.context7.com/mcp/oauth` rather than `/mcp`. OAuth works only with the remote server.' },

    { h2: 'Option 1: npx ctx7 setup', id: 'ctx7-setup' },
    { p: 'The `ctx7` CLI signs you in through your browser, generates an API key and writes the config for the agent you choose:' },
    { code: j('npx ctx7 setup            # asks which agent and which mode', 'npx ctx7 setup --claude   # Claude Code', 'npx ctx7 setup --cursor   # Cursor', 'npx ctx7 setup --opencode # OpenCode'), lang: 'bash' },
    { ul: [
      '`--mcp` or `--cli` picks the mode without asking. In CLI + Skills mode, `--codex` and `--antigravity` are also available.',
      '`--project` writes the config for the current project instead of globally.',
      '`--api-key YOUR_API_KEY` uses an existing key. `--oauth` uses OAuth instead of a key (MCP mode only).',
      '`--yes` skips the prompts.',
    ] },
    { p: 'To undo it, run `npx ctx7 remove`. If you see a Node.js version error, update Node or use Option 2, which doesn\'t need `ctx7`.' },

    { h2: 'Option 2: add the remote server by hand', id: 'remote' },
    { h3: 'Claude Code', id: 'claude-code' },
    { code: j('claude mcp add --scope user --header "Authorization: Bearer YOUR_API_KEY" \\', '  --transport http context7 https://mcp.context7.com/mcp'), lang: 'bash' },
    { p: 'Keep `--header` before `--transport` or put it after the URL. `--header` accepts several values, so if it comes right before the server name, Claude Code reads the name as a header and stops with "missing required argument \'name\'". Leave out the header to use the server without a key. Run `claude mcp list` or `/mcp` to check it shows as connected. More on Claude Code: [the best MCP servers for Claude Code](/guides/best-mcp-servers-for-claude-code/).' },
    { h3: 'Cursor', id: 'cursor' },
    { p: 'Add this to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project). The `${env:...}` syntax reads the key from an environment variable, so the file holds no secret:' },
    { code: j('{', '  "mcpServers": {', '    "context7": {', '      "url": "https://mcp.context7.com/mcp",', '      "headers": {', '        "Authorization": "Bearer ${env:CONTEXT7_API_KEY}"', '      }', '    }', '  }', '}'), lang: 'json', caption: '~/.cursor/mcp.json' },
    { p: 'Check it under **Customize → MCPs**. More: [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/).' },
    { h3: 'VS Code (GitHub Copilot)', id: 'vscode' },
    { p: 'Context7 publishes a VS Code extension (`Upstash.context7-mcp`) that registers the server for you. Set your key in the `context7.apiKey` setting. To configure it by hand instead, add it to `.vscode/mcp.json`. VS Code uses `servers` rather than `mcpServers`:' },
    { code: j('{', '  "servers": {', '    "context7": {', '      "type": "http",', '      "url": "https://mcp.context7.com/mcp",', '      "headers": {', '        "Authorization": "Bearer ${env:CONTEXT7_API_KEY}"', '      }', '    }', '  }', '}'), lang: 'json', caption: '.vscode/mcp.json' },
    { p: 'More, including the user-level config and input prompts for keys: [how to add an MCP server to VS Code](/guides/add-mcp-server-to-vs-code/).' },
    { h3: 'Codex', id: 'codex' },
    { p: 'Codex can read the key from an environment variable and send it as a Bearer token:' },
    { code: 'codex mcp add context7 --url https://mcp.context7.com/mcp --bearer-token-env-var CONTEXT7_API_KEY', lang: 'bash' },
    { p: 'That writes this to `~/.codex/config.toml`, which you can also edit directly:' },
    { code: j('[mcp_servers.context7]', 'url = "https://mcp.context7.com/mcp"', 'bearer_token_env_var = "CONTEXT7_API_KEY"'), lang: 'text', caption: '~/.codex/config.toml' },
    { p: '`codex mcp list` should show the server with "Bearer token" under Auth. Context7 also ships a Codex plugin that signs in with OAuth: run `codex plugin marketplace add upstash/context7`, then `codex plugin add context7@context7-marketplace`, and start a new thread. More: [how to add an MCP server to Codex](/guides/add-mcp-server-to-codex-config-toml/).' },
    { h3: 'Claude Desktop and other clients', id: 'other-clients' },
    { p: 'In Claude Desktop, add `https://mcp.context7.com/mcp` as a custom connector. The steps are in [how to add an MCP server to Claude Desktop](/guides/add-mcp-server-to-claude-desktop/). Context7\'s docs list configs for many more clients, including OpenCode, Windsurf and Antigravity. The URL is the same everywhere; only the file and key names change.' },

    { h2: 'Option 3: run Context7 MCP locally', id: 'local' },
    { p: 'You can run the server on your own machine as a stdio process with `npx`. It needs Node.js 20 or newer. In Claude Code:' },
    { code: 'claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY', lang: 'bash' },
    { p: 'In a JSON config (Cursor, Claude Desktop and others), it looks like this. The `CONTEXT7_API_KEY` environment variable works in place of `--api-key`. If you set both, `--api-key` wins:' },
    { code: j('{', '  "mcpServers": {', '    "context7": {', '      "command": "npx",', '      "args": ["-y", "@upstash/context7-mcp"],', '      "env": { "CONTEXT7_API_KEY": "YOUR_API_KEY" }', '    }', '  }', '}'), lang: 'json' },
    { p: 'In Codex, local servers start more slowly, so give them extra time:' },
    { code: j('[mcp_servers.context7]', 'command = "npx"', 'args = ["-y", "@upstash/context7-mcp"]', 'env_vars = ["CONTEXT7_API_KEY"]', 'startup_timeout_sec = 20'), lang: 'text', caption: '~/.codex/config.toml' },
    { p: 'The package can also serve over HTTP with `--transport http` (default port 3000, change it with `--port`). In that mode it expects `Authorization: Bearer YOUR_API_KEY` on every request by default. The local server still calls Context7\'s API for the docs. Running it locally changes where the MCP process runs, not where the documentation comes from. Use the remote server unless your client only supports stdio or you want to pin the package version.' },
    { note: 'On Windows, if the client can\'t start `npx`, see [fixing spawn npx ENOENT](/guides/fix-spawn-npx-enoent-windows-mcp/). The usual fix is `"command": "cmd"` with `"args": ["/c", "npx", "-y", "@upstash/context7-mcp"]`.' },

    { h2: 'Use it in prompts', id: 'prompts' },
    { ul: [
      'Add **use context7** to a prompt, for example: "Set up Next.js middleware that checks a JWT. use context7".',
      'If you know the library, name its ID to skip the lookup: "use library /supabase/supabase".',
      'Mention the version you use, such as "Next.js 16", so the agent fetches docs for that version.',
    ] },
    { p: 'To skip typing it every time, add a rule. Context7 suggests: "Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask." Put it in `CLAUDE.md`, `AGENTS.md` or a Cursor rule. See [Cursor rules vs AGENTS.md](/guides/cursor-rules-vs-agents-md/) for where each file goes.' },

    { h2: 'Check that it works', id: 'test' },
    { p: 'Context7 has a health endpoint:' },
    { code: j('curl https://mcp.context7.com/ping', '# {"status":"ok","message":"pong"}'), lang: 'bash' },
    { p: 'To see the tools without any client, list them with the [MCP Inspector](/plugins/mcp-inspector/) CLI. The output should include `resolve-library-id` and `query-docs`:' },
    { code: 'npx -y @modelcontextprotocol/inspector --cli https://mcp.context7.com/mcp --transport http --method tools/list', lang: 'bash' },
    { p: 'If the Inspector lists the tools but your client doesn\'t, the problem is in the client config, not Context7.' },

    { h2: 'Context7 API without MCP', id: 'api' },
    { p: 'Context7 also has a REST API at `https://context7.com/api` for searching libraries and fetching docs from your own scripts. It takes the same `ctx7sk` key as a Bearer token. If you only want docs in the terminal, the `ctx7` CLI does the same lookups without MCP, for example `npx ctx7 library react "How to clean up useEffect"`. Context7\'s API guide lists the endpoints and rate limits.' },

    { h2: 'Troubleshooting', id: 'troubleshooting' },
    { ul: [
      '**Rate limit errors:** add an API key. Anonymous use has low limits.',
      '**401 Unauthorized:** check that the key starts with `ctx7sk` and that the header is exactly `Authorization: Bearer <key>`. A missing "Bearer " is the usual mistake. A client can show the server as connected even with a wrong key (Claude Code did with a placeholder key when we checked), so test with a real prompt.',
      '**"Library not found":** use the ID from `resolve-library-id`, in the form `/owner/repo`, or ask with the library\'s common name.',
      '**`ERR_MODULE_NOT_FOUND` with the local server:** Context7\'s troubleshooting docs suggest running it with `bunx` instead of `npx`.',
      '**Timeouts starting the local server:** in Codex, raise `startup_timeout_sec` to 40. Behind a corporate proxy, set `HTTPS_PROXY` in the server\'s `env`. If it keeps closing, see [MCP error -32000: connection closed](/guides/fix-mcp-error-32000-connection-closed/).',
      '**No tools after editing a config:** restart Cursor or VS Code. In Claude Code, run `claude mcp list`; if it still fails, remove the server with `claude mcp remove context7` and add it again.',
    ] },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Is Context7 free?' },
    { p: 'You can use it without a key, and there is a free API key with higher limits. Context7 also sells paid plans with higher limits. Check context7.com for current limits, which change.' },
    { h3: 'Do I need an API key?' },
    { p: 'No, but you\'ll hit rate limits sooner without one. OAuth through `/mcp/oauth` is an alternative in clients that support it.' },
    { h3: 'Should I use the remote or local server?' },
    { p: 'Remote is simpler: there\'s nothing to install and no Node.js version to manage. Use local if your client only supports stdio. Both need an internet connection.' },
    { h3: 'MCP or CLI + Skills?' },
    { p: 'MCP mode works in any MCP client. CLI + Skills mode adds no MCP tools to your context and suits agents that support [skills](/guides/how-to-create-agent-skills/). `ctx7 setup` offers both.' },
  ],
  related: ['context7'],
  sources: [
    { label: 'Context7 README (GitHub)', url: 'https://github.com/upstash/context7' },
    { label: 'Context7 docs: all clients', url: 'https://context7.com/docs/resources/all-clients' },
    { label: 'Context7 docs: troubleshooting', url: 'https://context7.com/docs/resources/troubleshooting' },
    { label: '@upstash/context7-mcp on npm', url: 'https://www.npmjs.com/package/@upstash/context7-mcp' },
    { label: 'ctx7 on npm', url: 'https://www.npmjs.com/package/ctx7' },
    { label: 'Context7 API guide', url: 'https://context7.com/docs/api-guide' },
  ],
};

/* ------------------------------------------------------------------------------------------------------------------ */

const cloudflare: Guide = {
  slug: 'cloudflare-mcp-server-setup',
  title: 'How to connect the Cloudflare MCP server (Claude Code, Cursor, VS Code, Codex)',
  h1: 'How to connect the Cloudflare MCP server',
  description: 'Connect Cloudflare\'s MCP server to Claude Code, Cursor, VS Code or Codex: which URL to use, OAuth vs API tokens, MCP server portals, and fixes for 401, 403 and 410 errors.',
  published: DATE,
  updated: DATE,
  intro: "Cloudflare runs its own remote MCP servers, so you don't install anything: you add a URL to your client and sign in. This guide covers which of Cloudflare's servers to use, the exact setup in each client, when to use an API token instead of OAuth, how MCP server portals fit in, and the errors people hit. It's based on Cloudflare's developer docs and the `cloudflare/mcp` and `cloudflare/mcp-server-cloudflare` READMEs (checked 2 November 2026).",
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ul: [
      '**URL:** `https://mcp.cloudflare.com/mcp`. This server covers the whole Cloudflare API.',
      '**Sign-in:** OAuth. Your client opens Cloudflare in the browser and you choose which permissions to grant. For CI, send a Cloudflare API token as a Bearer header instead.',
      '**Docs only:** `https://docs.mcp.cloudflare.com/mcp` searches Cloudflare\'s documentation and needs no sign-in.',
      '**Old `/sse` URLs** now return 410 Gone. Replace them with the `/mcp` URL.',
    ] },
    { freebie: true },

    { h2: 'Which Cloudflare MCP server to use', id: 'which-server' },
    { p: 'The API server at `mcp.cloudflare.com/mcp` uses what Cloudflare calls Code Mode. Instead of one tool per API endpoint, it exposes a few tools: `search` to find endpoints, `execute` to run code against the API, `docs` and `whoami`. That covers about 2,500 endpoints in roughly a thousand tokens of tool definitions. Cloudflare recommends it for most account work: Workers, DNS, KV, R2, zones and so on.' },
    { p: 'Cloudflare also runs product servers at `<name>.mcp.cloudflare.com/mcp`:' },
    { ul: [
      '`docs`: searches the Cloudflare docs. No sign-in needed.',
      '`browser`: Browser Run, which fetches pages, takes screenshots and converts pages to markdown.',
      '`containers`: a sandbox container for running code.',
      'Others for Cloudflare One (`dex`, `casb`) and the Cloudflare blog.',
    ] },
    { p: 'Cloudflare\'s README marks several older servers as deprecated in favour of the API server, including observability, bindings, builds, logs, GraphQL, Radar and AI Gateway. If a tutorial tells you to add one of those, use `mcp.cloudflare.com/mcp` instead. The full list of servers and what each does is on [the Cloudflare MCP listing](/plugins/cloudflare-mcp/).' },

    { h2: 'Connect it to your client', id: 'connect' },
    { h3: 'Claude Code', id: 'claude-code' },
    { code: 'claude mcp add --transport http cloudflare-api https://mcp.cloudflare.com/mcp', lang: 'bash' },
    { p: '`claude mcp list` will show "Needs authentication" at first. That is expected. Run `/mcp` inside Claude Code, pick `cloudflare-api` and sign in in the browser. If it stays stuck, see [fixing "needs authentication" in Claude Code](/guides/fix-claude-code-mcp-needs-authentication/).' },
    { h3: 'Cursor', id: 'cursor' },
    { code: j('{', '  "mcpServers": {', '    "cloudflare-api": {', '      "url": "https://mcp.cloudflare.com/mcp"', '    }', '  }', '}'), lang: 'json', caption: '~/.cursor/mcp.json' },
    { p: 'Open **Customize → MCPs**. Cursor offers to sign in when the server needs OAuth. More: [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/).' },
    { h3: 'VS Code (GitHub Copilot)', id: 'vscode' },
    { code: j('{', '  "servers": {', '    "cloudflare-api": {', '      "type": "http",', '      "url": "https://mcp.cloudflare.com/mcp"', '    }', '  }', '}'), lang: 'json', caption: '.vscode/mcp.json' },
    { p: 'When the server starts, VS Code asks you to sign in to Cloudflare. Accept the prompt and finish the sign-in in the browser. More: [how to add an MCP server to VS Code](/guides/add-mcp-server-to-vs-code/).' },
    { h3: 'Codex', id: 'codex' },
    { code: j('codex mcp add cloudflare-api --url https://mcp.cloudflare.com/mcp', 'codex mcp login cloudflare-api   # if the sign-in did not start on its own'), lang: 'bash' },
    { p: 'Codex may start the browser sign-in straight away when you add the server. `codex mcp list` shows "Not logged in" until you finish it. More: [how to add an MCP server to Codex](/guides/add-mcp-server-to-codex-config-toml/).' },
    { h3: 'Claude Desktop and claude.ai', id: 'claude-desktop' },
    { p: 'Add `https://mcp.cloudflare.com/mcp` as a custom connector and sign in when asked. Don\'t put the URL in `claude_desktop_config.json`, which is for local servers. Steps: [how to add an MCP server to Claude Desktop](/guides/add-mcp-server-to-claude-desktop/).' },
    { h3: 'Clients that only support local (stdio) servers', id: 'mcp-remote' },
    { p: 'Use the community `mcp-remote` package as a bridge. It runs locally, connects to the remote URL and handles the OAuth sign-in:' },
    { code: j('{', '  "mcpServers": {', '    "cloudflare-api": {', '      "command": "npx",', '      "args": ["-y", "mcp-remote", "https://mcp.cloudflare.com/mcp"]', '    }', '  }', '}'), lang: 'json' },
    { p: 'Only use it when your client can\'t connect to remote servers directly. Every client above can.' },

    { h2: 'OAuth or an API token?', id: 'auth' },
    { p: 'Cloudflare recommends **OAuth** for people. You choose permissions on Cloudflare\'s consent screen, and nothing secret is stored in your config file. If you later ask for something your grant doesn\'t cover, the server asks you to sign in again with the extra permission. In Claude this shows as a 403 `insufficient_scope` challenge; Codex and ChatGPT show it in the tool result.' },
    { p: 'Use an **API token** for CI and scripts, where no one can click through a browser sign-in. Create one in the Cloudflare dashboard with only the permissions the job needs. Both user tokens and account tokens work. Account tokens also need the **Account Resources : Read** permission so the server can find the account ID. Tokens with Client IP Address Filtering aren\'t supported.' },
    { p: 'Send the token as a Bearer header. Keep it in an environment variable, not in the file:' },
    { code: j('# Claude Code: the shell fills in the variable now, so the token is saved in ~/.claude.json', 'claude mcp add --transport http cloudflare-api https://mcp.cloudflare.com/mcp \\', '  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"', '', '# Codex: reads the variable each time it connects', 'codex mcp add cloudflare-api --url https://mcp.cloudflare.com/mcp --bearer-token-env-var CLOUDFLARE_API_TOKEN'), lang: 'bash' },
    { code: j('{', '  "mcpServers": {', '    "cloudflare-api": {', '      "url": "https://mcp.cloudflare.com/mcp",', '      "headers": { "Authorization": "Bearer ${env:CLOUDFLARE_API_TOKEN}" }', '    }', '  }', '}'), lang: 'json', caption: 'Cursor: ~/.cursor/mcp.json (VS Code accepts the same ${env:...} form in .vscode/mcp.json)' },
    { note: 'Once a client sends an `Authorization` header, it won\'t also try OAuth. A bad token fails with HTTP 401. Claude Code reports it as "Server rejected the configured Authorization header (HTTP 401)" and notes that OAuth fallback is disabled. Remove the header to go back to signing in.' },

    { h2: 'Optional: one tool per endpoint', id: 'codemode-false' },
    { p: 'Adding `?codemode=false` to the URL (`https://mcp.cloudflare.com/mcp?codemode=false`) registers a separate tool for every API endpoint. Cloudflare puts that at about 244,000 tokens of tool definitions, which is more than many models\' whole context. Stick with the default unless your client needs plain tools.' },

    { h2: 'MCP server portals (teams)', id: 'portals' },
    { p: 'An MCP server portal is a Cloudflare One (Zero Trust) feature that puts several remote MCP servers behind one URL, with Cloudflare Access deciding who can use which servers and tools. It suits teams that want one approved endpoint instead of every developer adding servers on their own. You need a domain on Cloudflare and an identity provider set up in Zero Trust.' },
    { ol: [
      'In the Cloudflare One dashboard, go to **Zero Trust → Access controls → MCP Portals**.',
      'On the **MCP servers** tab, add each server with a name and its HTTP URL (for example `https://docs.mcp.cloudflare.com/mcp`), attach Access policies, then save and connect. The status changes to Ready once Cloudflare can reach it.',
      'Add a portal: give it a name and a custom domain on one of your zones, choose its servers and the tools and prompts to expose, and attach Access policies.',
      'Point clients at `https://<subdomain>.<your-domain>/mcp`. Users sign in through Access the first time they connect.',
    ] },
    { p: 'Limits to know: portals only work with remote HTTP servers, not stdio-only ones. A portal holds up to 80 servers. Some Access features, such as independent MFA and purpose justification, aren\'t enforced through a portal. A portal policy also doesn\'t stop someone who has a server\'s direct URL, so lock down the servers themselves too. For automation, Access service tokens let a machine connect without a browser sign-in.' },

    { h2: 'Check that it works', id: 'test' },
    { p: 'Ask the agent "Which Cloudflare account am I connected to?", which should call `whoami`. Then try something read-only, such as "List my Workers". To test the connection outside any client, list the docs server\'s tools with the [MCP Inspector](/plugins/mcp-inspector/) CLI:' },
    { code: 'npx -y @modelcontextprotocol/inspector --cli https://docs.mcp.cloudflare.com/mcp --transport http --method tools/list', lang: 'bash' },
    { p: 'The output should include `search_cloudflare_documentation`. The API server returns 401 to the Inspector until you sign in, which is expected.' },
    { note: 'The API server can change real settings: DNS records, Workers, firewall rules. Start with read-only requests, grant only the permissions you need, and read each `execute` call before you approve it.' },

    { h2: 'Troubleshooting', id: 'troubleshooting' },
    { ul: [
      '**410 Gone:** you\'re using an old `/sse` URL. Cloudflare retired SSE. Change the URL to end in `/mcp`.',
      '**401 Unauthorized:** you haven\'t signed in yet, or the token is wrong. Finish the OAuth sign-in (`/mcp` in Claude Code, `codex mcp login` in Codex), or check the token and the `Bearer ` prefix.',
      '**403 or "insufficient scope":** your grant doesn\'t include what you asked for. Accept the re-authorization prompt, or add the permission to your API token.',
      '**The server can\'t find your account:** an account token is missing **Account Resources : Read**. Add it, or use a user token.',
      '**A token that works in curl fails here:** it may have Client IP Address Filtering, which the server doesn\'t support.',
      '**"Claude\'s response was interrupted":** usually the context filled up. Results are capped at about 6,000 tokens and marked `--- TRUNCATED ---`, so ask a narrower question, such as one zone instead of all of them.',
      '**A feature returns an error on a free account:** some products need a paid Workers plan.',
    ] },

    { h2: 'Related: Cloudflare skills and building your own server', id: 'related' },
    { p: 'Cloudflare also publishes agent skills for its platform. In Claude Code, add them with `/plugin marketplace add cloudflare/skills`, or install them with `npx skills add https://github.com/cloudflare/skills` (see [how to create agent skills](/guides/how-to-create-agent-skills/)). To build and host your own MCP server on Workers, the [Cloudflare MCP listing](/plugins/cloudflare-mcp/) has the starter template command.' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Do I need a paid Cloudflare plan?' },
    { p: 'You need a Cloudflare account. Anything you create or run through the server is billed like any other use of your account, and Cloudflare\'s README notes that some features need a paid Workers plan.' },
    { h3: 'What is the difference between cloudflare/mcp and cloudflare/mcp-server-cloudflare?' },
    { p: '`cloudflare/mcp` is the repository for the Code Mode API server at `mcp.cloudflare.com/mcp`. `cloudflare/mcp-server-cloudflare` holds the product servers, such as docs, Browser Run and containers, plus the deprecated ones.' },
    { h3: 'Can I run the Cloudflare MCP server locally?' },
    { p: 'You don\'t need to. The servers are hosted, and clients connect over HTTP. If your client only runs local servers, use `mcp-remote` as shown above.' },
    { h3: 'Does it work with ChatGPT?' },
    { p: 'Cloudflare\'s docs mention ChatGPT alongside Claude and Codex. Any client that can connect to a remote MCP server with OAuth can use it.' },
  ],
  related: ['cloudflare-mcp'],
  sources: [
    { label: 'Cloudflare docs: Cloudflare\'s own MCP servers', url: 'https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/' },
    { label: 'cloudflare/mcp README (API server)', url: 'https://github.com/cloudflare/mcp' },
    { label: 'cloudflare/mcp-server-cloudflare README', url: 'https://github.com/cloudflare/mcp-server-cloudflare' },
    { label: 'Cloudflare One docs: MCP server portals', url: 'https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/' },
    { label: 'mcp-remote README', url: 'https://github.com/geelen/mcp-remote' },
  ],
};

export const SERVER_GUIDES: Guide[] = [context7, cloudflare];
