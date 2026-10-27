/**
 * MCP explainer and fix-it guides (/guides/<slug>/). Same data shape and rules as guides.ts: every command, error string and
 * config snippet must match the sources linked in `sources` (checked on `updated`). Imported into GUIDES in guides.ts.
 * Error strings are quoted only where they appear verbatim in an official doc, a tool's own output or a linked issue.
 */
import type { Guide } from './guides.ts';

/** Join lines into a code-block string (keeps the config snippets readable in source). */
const j = (...lines: string[]) => lines.join('\n');

const DATE = '2026-10-27';

/* ------------------------------------------------------------------------------------------------------------------ */

const referenceV2: Guide = {
  slug: 'mcp-reference-servers-v2-whats-changed',
  title: 'MCP reference servers v2.0 and v2.1: what changed and how to update',
  h1: 'MCP reference servers v2.0 and v2.1: what changed and what to do',
  description: 'The official MCP reference servers (Filesystem, Memory, Fetch, Sequential Thinking) moved to v2 in October 2026: Node 24 for the TypeScript ones, security fixes, how to update and what can break.',
  published: DATE, updated: DATE,
  intro: 'On 19 October 2026 the official `modelcontextprotocol/servers` repository shipped v2.0.0, and a security-focused v2.1.0 followed on 25 October (UTC). If you run the Filesystem, Memory, Sequential Thinking or Fetch server from a Claude, Cursor, VS Code or Codex config, this is what changed, whether it affects you, and how to update. Everything below comes from the official release notes, changelogs and package registries; sources are listed at the end.',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ul: [
      '**The TypeScript servers now declare Node.js 24 or newer.** Filesystem, Memory, Sequential Thinking and Everything all list `"node": ">=24"` in their package `engines`. Run `node --version`; if it is below 24, install Node 24 or newer before you restart your client.',
      '**Fetch is a Python package, so the Node change does not apply to it.** It is published on PyPI as `mcp-server-fetch` and needs Python 3.10 or newer.',
      '**v2.1.0 is a security release.** It fixes eight vulnerabilities across three servers. Move Filesystem to 2.0.1 (the first version with the fixes) and Fetch to 2026.10.24, or newer.',
      '**The setup commands in the READMEs did not change.** `npx -y @modelcontextprotocol/server-filesystem <folders>` and `uvx mcp-server-fetch` are still the launch commands, so an existing config usually keeps working once the runtime is current.',
    ] },
    { p: 'If a server stops starting after an update, the cause is almost always the runtime or a stale cached version. See "How to update" and "What can break" below, and our guide to [MCP error -32000 "Connection closed"](/guides/fix-mcp-error-32000-connection-closed/).' },

    { h2: 'What v2.0 and v2.1 are', id: 'what-changed' },
    { p: '**v2.0.0 (19 October 2026)** refactored every server in the repository so that it supports the "modern era" of the MCP specification (the 2026-07-28 revision) while still answering clients that speak the older 2025-era protocol. The TypeScript servers moved onto the v2 TypeScript SDK packages and the Python servers onto the Python SDK 2.x line.' },
    { p: '**v2.1.0 (tagged 25 October 2026, UTC)** is a security release: eight vulnerabilities fixed across Filesystem, Fetch and Everything (the Everything server is a test server for client developers, not something most people configure). The release notes link a GitHub security advisory for each one. We do not repeat the advisory details here; read the release notes if you need them.' },
    { p: 'The versions that were current on 27 October 2026, checked against the npm and PyPI registries:' },
    { ul: [
      '`@modelcontextprotocol/server-filesystem` **2.0.1** (npm, `engines.node` `>=24`)',
      '`@modelcontextprotocol/server-memory` **2.0.0** (npm, `>=24`)',
      '`@modelcontextprotocol/server-sequential-thinking` **2.0.0** (npm, `>=24`)',
      '`mcp-server-fetch` **2026.10.24** (PyPI, Python `>=3.10`, depends on `mcp>=2.3,<3`)',
    ] },
    { p: 'Git and Time, the other two Python servers, use the same date-style versions (2026.10.19 at the v2.0.0 release). Details for each server are on its listing: [Filesystem](/plugins/filesystem-mcp/), [Memory](/plugins/memory-mcp/), [Sequential Thinking](/plugins/sequential-thinking-mcp/) and [Fetch](/plugins/fetch-mcp/).' },

    { h2: 'Who this affects', id: 'who' },
    { ul: [
      '**Anyone launching a TypeScript reference server with `npx`**, which is how most Claude Desktop, Cursor, VS Code and Codex configs do it. You need Node 24 or newer on the machine that runs the client.',
      '**Filesystem server users on any platform**, because the security fixes landed in 2.0.1. The release notes list every earlier version as affected (1.0.0 through 2.0.0, and the date versions up to 2026.8.31). The v2.1.0 release notes call the Windows fix partial, so on Windows treat the allowed-folder list as something to review, not a guarantee.',
      '**Fetch server users**, for the 2026.10.24 security fixes. Fetch can reach any URL you let the model request, so keep it current.',
      '**People who pinned an old version** or installed a global copy. Nothing updates those automatically.',
      '**Developers who call the servers from their own client code**, because several behaviours changed (see "What can break").',
    ] },
    { p: 'It does not affect remote MCP servers run by other companies, such as the [Notion](/plugins/notion-mcp/) or [Linear](/plugins/linear-mcp/) ones, and it does not change servers from other publishers. Those have their own release notes and runtime requirements.' },

    { h2: 'How to update', id: 'update' },
    { h3: '1. Check your Node version' },
    { code: j('node --version', 'npm view @modelcontextprotocol/server-filesystem engines'), lang: 'bash', caption: 'Node 24 or newer, and the engines the package declares' },
    { p: 'If `node --version` prints something below v24, install a current Node (the official download page, or a version manager such as nvm or fnm) and restart your terminal and your AI client. A client launched from a desktop icon uses the Node that was on its PATH when it started, so quit and reopen it fully.' },
    { h3: '2. Get the new server version' },
    { p: 'With `npx -y <package>` in your config there is nothing to install: npx fetches the latest published version when it launches the server. Restart your client after upgrading Node, and the new version starts. If you want to be explicit, or you are jumping from an old date-style version, pin it:' },
    { code: j('npx -y @modelcontextprotocol/server-filesystem@2.0.1 /Users/you/projects'), lang: 'bash', caption: 'Pin Filesystem to the first security-fixed version (change the folder to yours)' },
    { p: 'In a client config the same pin goes in the `args` array, for example `"args": ["-y", "@modelcontextprotocol/server-filesystem@2.0.1", "/Users/you/projects"]`. If Cursor keeps launching an old copy, its docs suggest removing the server in Customize, running `npm cache clean --force`, then adding it again.' },
    { p: 'For Fetch, run it through `uvx` (or `pip`), and ask for the latest:' },
    { code: j('uvx mcp-server-fetch@latest', '# or, if you installed it with pip:', 'pip install -U mcp-server-fetch'), lang: 'bash' },
    { h3: '3. Restart your client and check' },
    { ul: [
      '**Claude Code:** run `claude mcp list` and look for `✔ Connected` next to the server.',
      '**Cursor:** open **Customize** then **MCPs** (the server should be listed with its toggle on).',
      '**VS Code:** run **MCP: List Servers** from the Command Palette and check the server is running.',
      '**Codex:** run `codex mcp list`, or type `/mcp` inside the Codex terminal UI.',
    ] },

    { h2: 'What can break', id: 'breaks' },
    { h3: 'Node older than 24' },
    { p: 'The maintainers declare Node 24 or newer, so treat anything older as unsupported. npm prints an `EBADENGINE` warning for it. In a quick test we ran on 27 October 2026, Node 20 and 22 still completed an MCP handshake with the new servers, so an old Node does not always fail outright. That is luck, not a promise: the declared requirement is 24, and a later release can use a Node 24 feature without notice. If a server will not start after the update, check this first.' },
    { h3: 'Changes that matter if you write or run your own client' },
    { p: 'These come from the v2.0.0 notes and the per-server changelogs. Most people using Claude, Cursor, VS Code or Codex never see them.' },
    { ul: [
      'A stdio message larger than 10 MiB now closes the connection.',
      'Calling a tool name the server does not have now returns a JSON-RPC `-32602` error instead of a tool result flagged `isError`.',
      'Error messages no longer start with an `MCP error <code>:` prefix, and validation errors now name the field first.',
      'Tool input schemas declare JSON Schema 2020-12 rather than draft-07.',
      'Tools no longer advertise `execution.taskSupport`.',
    ] },
    { h3: 'Filesystem: Roots are deprecated' },
    { p: 'On a connection that uses the 2026-07-28 protocol, the Filesystem server does not use MCP Roots (the `roots/list` mechanism). The allowed folders are exactly the ones you pass on the command line. A server started with no folders answers each tool call on such a connection with an error. Clients still on the 2025-era protocol keep the older Roots behaviour.' },
    { p: 'If you are jumping from an older date-versioned release, the Filesystem changelog for 1.0.0 also lists behaviour changes (for example, an update to roots that leaves no valid folder now revokes access, `edit_file` keeps CRLF line endings, and `write_file` overwrites in place). Read the changelog before upgrading a setup you rely on.' },
    { h3: 'The date-versus-semver trap on npm' },
    { p: 'The TypeScript servers were date-versioned (`2025.x` and `2026.x`) until they moved to semantic versions at 1.0.0. Package managers rank 2.0.1 below every 2025.x and 2026.x version, so they will not offer it as an upgrade. The release notes say that if you are on a date version you should install 2.0.1 explicitly, for example `npm install @modelcontextprotocol/server-filesystem@2.0.1`, or pin it as shown above.' },
    { h3: 'Windows launch problems are separate' },
    { p: 'If your server fails on Windows with `spawn npx ENOENT`, that is not a v2 problem; `npx` needs a `cmd /c` wrapper in some clients. See [Fix "spawn npx ENOENT" for MCP servers on Windows](/guides/fix-spawn-npx-enoent-windows-mcp/).' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Do I need to change my MCP config?' },
    { p: 'Usually not. The launch commands in the READMEs are the same. What you may need to change is the machine: Node 24 or newer for the TypeScript servers, and a restart.' },
    { h3: 'Is Fetch affected by the Node 24 requirement?' },
    { p: 'No. Fetch is a Python package launched with `uvx` or `python -m mcp_server_fetch`. It needs Python 3.10 or newer, and its own update is 2026.10.24.' },
    { h3: 'Which version should I run?' },
    { p: 'The latest published one: Filesystem 2.0.1 or newer, Memory and Sequential Thinking 2.0.0 or newer, Fetch 2026.10.24 or newer, as of 27 October 2026. Check the GitHub releases page for anything newer.' },
    { h3: 'Where do I add these servers to my client?' },
    { p: 'See [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/), [the best MCP servers for Claude Code](/guides/best-mcp-servers-for-claude-code/) and [how to add an MCP server to Codex with config.toml](/guides/add-mcp-server-to-codex-config-toml/).' },
  ],
  related: ['filesystem-mcp', 'fetch-mcp', 'memory-mcp', 'sequential-thinking-mcp', 'mcp-inspector'],
  sources: [
    { label: 'modelcontextprotocol/servers release v2.0.0', url: 'https://github.com/modelcontextprotocol/servers/releases/tag/v2.0.0' },
    { label: 'modelcontextprotocol/servers release v2.1.0 (security fixes)', url: 'https://github.com/modelcontextprotocol/servers/releases/tag/v2.1.0' },
    { label: 'Filesystem server README and changelog', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem' },
    { label: 'Memory server README and changelog', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory' },
    { label: 'Sequential Thinking server README and changelog', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking' },
    { label: 'Fetch server README and changelog', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch' },
    { label: 'npm: @modelcontextprotocol/server-filesystem (version and engines)', url: 'https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem' },
    { label: 'PyPI: mcp-server-fetch (version, Python and mcp requirements)', url: 'https://pypi.org/project/mcp-server-fetch/' },
    { label: 'Cursor docs: MCP', url: 'https://cursor.com/docs/mcp' },
  ],
};

/* ------------------------------------------------------------------------------------------------------------------ */

const windowsEnoent: Guide = {
  slug: 'fix-spawn-npx-enoent-windows-mcp',
  title: 'Fix "spawn npx ENOENT" for MCP servers on Windows (the cmd /c fix)',
  h1: 'Fix "spawn npx ENOENT" for MCP servers on Windows',
  description: 'MCP server fails on Windows with spawn npx ENOENT or Connection closed? Wrap npx in cmd /c. Exact config for Claude Code, Claude Desktop, Cursor, VS Code and Codex, plus other causes.',
  published: DATE, updated: DATE,
  intro: 'You add a local MCP server that starts with `npx`, it works on a Mac, and on Windows your AI client reports `spawn npx ENOENT` (or a vague "Connection closed" or "Failed to connect"). This is a well-known Windows quirk, and the usual fix is a three-word change to your config. This guide explains why it happens, gives the exact fix for each client, and lists the other causes to rule out.',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ol: [
      'In your MCP config, change `"command": "npx"` to `"command": "cmd"`.',
      'Put `"/c"` and `"npx"` at the start of `args`, before the rest of the arguments.',
      'Save, then fully quit and reopen your client (not just a new chat).',
    ] },
    { code: j('// before: fails on Windows in some clients', '{', '  "command": "npx",', '  "args": ["-y", "@modelcontextprotocol/server-memory"]', '}', '', '// after', '{', '  "command": "cmd",', '  "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]', '}'), lang: 'json', caption: 'Only the command and the first two args change' },
    { p: 'Not every client needs this. The official MCP quickstart for Claude Desktop uses plain `npx` on Windows, and if your server already connects you should leave it alone. Use the wrapper when you see the error.' },

    { freebie: true },

    { h2: 'Why it happens', id: 'why' },
    { p: '`ENOENT` means "no such file": the program that started your MCP server could not find the command you gave it. On Windows, `npx` is not a program (`npx.exe`) but a script launcher called `npx.cmd`. Many MCP clients start servers directly, with no shell in between, and a directly-started process cannot resolve `npx` to `npx.cmd`. Node\'s own documentation says that `.bat` and `.cmd` files are not executable on their own without a terminal and can only be run through `cmd.exe` (or by spawning with a shell).' },
    { p: 'You also cannot fix it by pointing at `npx.cmd`. Since the April 2024 Node.js security releases (CVE-2024-27980), starting a `.cmd` or `.bat` file without a shell fails with `EINVAL` on Node 18.20.2, 20.12.2 and later. So the reliable route is to start `cmd.exe` yourself, and let it run `npx`: `cmd /c npx ...`. `/c` tells `cmd` to run the rest as a command and exit.' },
    { p: 'The MCP server READMEs use this pattern for Windows. The official Filesystem server README, for instance, has a Windows config that starts with `"command": "cmd"` and `"/c", "npx"`. Users reported the same fix in Claude Code issue #3369, where a native-Windows setup showed `MCP error -32000: Connection closed` until the config was changed to `cmd /c`. A reply there said the `cmd` solutions fix it.' },

    { h2: 'The fix, per client', id: 'per-client' },
    { p: 'Every client uses the same idea: `command` is `cmd`, and `args` begins with `/c` and `npx`. Each argument stays a separate string. The server here is the official [Memory server](/plugins/memory-mcp/); swap in your own package and arguments.' },
    { h3: 'Claude Code' },
    { p: 'With the CLI, everything after `--` is the command. Keep each word separate (do not wrap the whole command in one pair of quotes) and keep the `--`:' },
    { code: 'claude mcp add memory -- cmd /c npx -y @modelcontextprotocol/server-memory', lang: 'bash', caption: 'Run in PowerShell or Command Prompt' },
    { p: 'To change an existing entry, remove it first (`claude mcp remove memory`) and add it again. Or add it from JSON, which keeps the arguments exactly as you write them:' },
    { code: 'claude mcp add-json memory \'{"type":"stdio","command":"cmd","args":["/c","npx","-y","@modelcontextprotocol/server-memory"]}\'', lang: 'bash', caption: 'Bash or Git Bash quoting. In PowerShell, escape the inner quotes or put the JSON in a .mcp.json file instead' },
    { p: 'In a project `.mcp.json` file at the repository root, use the same `command` and `args` shape under `mcpServers`. Check the result with `claude mcp get memory`, which prints the command Claude Code will run, and `claude mcp list`.' },
    { p: 'A note on versions: Claude Code\'s current MCP docs say that executables on your `PATH` such as `npx` or `uvx` work as-is, and do not mention `cmd /c`. Users on native Windows have reported otherwise in issues #3369, #9594 and #68221 (the last one traces it to the `EINVAL` behaviour above). Some Claude Code versions have printed a warning that a Windows `npx` server needs the `cmd /c` wrapper. If plain `npx` connects for you, you do not need the wrapper.' },
    { h3: 'Claude Desktop' },
    { p: 'Open the config from **Settings**, then **Developer**, then **Edit Config**. The file is `%APPDATA%\\Claude\\claude_desktop_config.json` on Windows.' },
    { code: j('{', '  "mcpServers": {', '    "memory": {', '      "command": "cmd",', '      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]', '    }', '  }', '}'), lang: 'json', caption: '%APPDATA%\\Claude\\claude_desktop_config.json' },
    { p: 'Save the file, then completely quit Claude Desktop and reopen it; the MCP docs say it must restart to load the new configuration.' },
    { h3: 'Cursor' },
    { p: 'Same shape in `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project). More in [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/), which also shows this wrapper in its troubleshooting section.' },
    { code: j('{', '  "mcpServers": {', '    "memory": {', '      "command": "cmd",', '      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]', '    }', '  }', '}'), lang: 'json', caption: '~/.cursor/mcp.json' },
    { h3: 'VS Code' },
    { p: 'VS Code uses a `servers` key (not `mcpServers`) in `.vscode/mcp.json` for a workspace, or in your user profile\'s `mcp.json`. Open either from the Command Palette with **MCP: Open Workspace Folder MCP Configuration** or **MCP: Open User Configuration**.' },
    { code: j('{', '  "servers": {', '    "memory": {', '      "type": "stdio",', '      "command": "cmd",', '      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]', '    }', '  }', '}'), lang: 'json', caption: '.vscode/mcp.json' },
    { h3: 'Codex' },
    { p: 'Update Codex first. A fix merged on 16 November 2025 (pull request #3828, "resolve Windows MCP server execution for script-based tools") makes Codex resolve script launchers such as `npx`, `pnpm` and `yarn` through the Windows `PATHEXT` list, so a recent Codex may need no wrapper at all. If you still get the error on a current build, use the same shape in `~/.codex/config.toml`:' },
    { code: j('[mcp_servers.memory]', 'command = "cmd"', 'args = ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]'), lang: 'text', caption: '~/.codex/config.toml (%USERPROFILE%\\.codex\\config.toml on Windows)' },
    { p: 'Older Codex versions behaved differently. A 2025 issue on Codex 0.23 (#2555) reports `cmd /c` timing out with "request timed out", and another (#3385) describes using the full path to `npx.cmd` together with a larger `startup_timeout_sec`. Those are user reports against old releases, so try updating before using them. Full config details are in [how to add an MCP server to Codex](/guides/add-mcp-server-to-codex-config-toml/).' },

    { h2: 'If it still fails: other causes', id: 'other-causes' },
    { h3: 'Node.js is not installed, or the client cannot see it' },
    { p: 'Open a new Command Prompt and run `where node` and `where npx`. If either prints nothing, install Node.js. If they work in your terminal but not in the client, the client was started before Node was on your PATH: quit it fully and reopen it, or sign out and back in.' },
    { h3: 'The server runs fine by hand' },
    { p: 'Run the full command yourself, for example `cmd /c npx -y @modelcontextprotocol/server-memory`. A working MCP server starts and then waits silently for input (press Ctrl+C to stop it). If it prints an error and returns to the prompt, fix that error first; the client is only reporting it. Official servers need Node 24 or newer from v2 onward (see [what changed in v2](/guides/mcp-reference-servers-v2-whats-changed/)).' },
    { h3: '`${APPDATA}` or npm folder errors (Claude Desktop)' },
    { p: 'The MCP docs describe an `ENOENT` where the server log mentions `${APPDATA}` in a path. The fix they give is to add the expanded value to the server\'s `env`, for example `"APPDATA": "C:\\\\Users\\\\you\\\\AppData\\\\Roaming\\\\"`, and to make sure npm is installed globally, so that `%APPDATA%\\npm` exists (`npm install -g npm` creates it).' },
    { h3: 'The command is not an `.cmd` script at all' },
    { p: 'The wrapper is for launchers that are `.cmd` or `.bat` scripts, such as `npx`, `npm`, `pnpm` and `yarn`. A real `.exe` such as `node.exe` does not need it. Use an absolute path for your own scripts, since a relative one resolves against whatever folder the client was started from.' },
    { h3: 'Backslashes in JSON' },
    { p: 'In JSON, a Windows path needs doubled backslashes, `C:\\\\Users\\\\you\\\\projects`, or forward slashes. A single backslash makes the file invalid or changes the path. In Codex\'s TOML file use single-quoted strings, `\'C:\\Users\\you\\projects\'`, which TOML treats literally.' },
    { p: 'Still seeing "Connection closed"? That message covers many causes; work through [Fix MCP error -32000 "Connection closed"](/guides/fix-mcp-error-32000-connection-closed/).' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Does this apply to WSL?' },
    { p: 'The cause is specific to launching `.cmd` scripts from native Windows. Inside WSL you run Linux versions of the tools, where `npx` is a normal executable. The issue above notes that the same setup worked in WSL2.' },
    { h3: 'Do I need `cmd /c` for `uvx` or Python servers?' },
    { p: 'Not for the same reason. `npx`, `npm`, `pnpm` and `yarn` are the `.cmd` launchers. A server started with `uvx` or `python` is a different command, so only wrap it if you see an equivalent error.' },
    { h3: 'Why not just use the full path to npx.cmd?' },
    { p: 'Since the CVE-2024-27980 hardening, Node refuses to start a `.cmd` file without a shell, and the failure is `EINVAL` rather than `ENOENT`. Going through `cmd /c` avoids the problem.' },
  ],
  related: ['filesystem-mcp', 'memory-mcp', 'sequential-thinking-mcp', 'claude-code', 'codex-cli', 'mcp-inspector'],
  sources: [
    { label: 'Node.js docs: child_process (spawning .bat and .cmd files on Windows)', url: 'https://nodejs.org/docs/latest-v24.x/api/child_process.html' },
    { label: 'Node.js April 2024 security releases (CVE-2024-27980)', url: 'https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2' },
    { label: 'Filesystem MCP server README (Windows config uses cmd /c)', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem' },
    { label: 'Model Context Protocol docs: Connect to local MCP servers (Windows troubleshooting)', url: 'https://modelcontextprotocol.io/docs/develop/connect-local-servers' },
    { label: 'Claude Code docs: Connect Claude Code to tools via MCP', url: 'https://code.claude.com/docs/en/mcp' },
    { label: 'Claude Code issue #3369: MCP fails on native Windows (user report)', url: 'https://github.com/anthropics/claude-code/issues/3369' },
    { label: 'Claude Code issue #9594: Windows npx servers and the cmd /c wrapper (user report)', url: 'https://github.com/anthropics/claude-code/issues/9594' },
    { label: 'Claude Code issue #68221: npx servers fail with spawn EINVAL (user report)', url: 'https://github.com/anthropics/claude-code/issues/68221' },
    { label: 'Codex pull request #3828: resolve Windows MCP server execution for script-based tools', url: 'https://github.com/openai/codex/pull/3828' },
    { label: 'Codex issue #2555: Windows MCP server "request timed out" (user report)', url: 'https://github.com/openai/codex/issues/2555' },
    { label: 'VS Code docs: Add and manage MCP servers', url: 'https://code.visualstudio.com/docs/agent-customization/mcp-servers' },
    { label: 'Cursor docs: MCP', url: 'https://cursor.com/docs/mcp' },
  ],
};

/* ------------------------------------------------------------------------------------------------------------------ */

const error32000: Guide = {
  slug: 'fix-mcp-error-32000-connection-closed',
  title: 'Fix MCP error -32000 "Connection closed" (causes and fixes)',
  h1: 'Fix MCP error -32000: "Connection closed"',
  description: 'MCP error -32000 "Connection closed" means your MCP server process exited or never started. How to find the real cause with a 60-second test, the common fixes, and where each client keeps its logs.',
  published: DATE, updated: DATE,
  intro: 'You add an MCP server, restart your client, and get `MCP error -32000: Connection closed`. The message is accurate but unhelpful: it only says that the connection to the server ended. The cause is almost always on the server side, usually in the first second after it launches. This guide shows how to find it fast.',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { p: '`-32000` is the code the MCP SDKs use for `ConnectionClosed`. For a local (stdio) server it means the server process exited, or its pipe closed, before the client finished talking to it. So the job is to find out why the server stopped:' },
    { ol: [
      'Copy the exact `command`, `args` and `env` from your config and run that command yourself in a terminal.',
      'Read what it prints. A healthy stdio server starts and then waits silently for input. If it prints an error and returns to the prompt, that error is your answer (wrong Node version, missing package, missing API key, bad path).',
      'Fix that, then restart the client fully. If you are on Windows and the command starts with `npx`, try the [`cmd /c` fix](/guides/fix-spawn-npx-enoent-windows-mcp/) first.',
    ] },
    { p: 'The rest of this page covers the usual causes, where to find each client\'s logs, and how to test a server without any client.' },

    { freebie: true },

    { h2: 'What the error means', id: 'meaning' },
    { p: 'MCP clients talk to a local server over its standard input and output. When the process behind that pipe ends, the SDK rejects every pending request with `MCP error -32000: Connection closed`. We reproduced it with the official TypeScript SDK: a server command that starts and then exits with an error code produces exactly that message. A command that does not exist at all produces a different one, a `spawn ... ENOENT` error, because the client could not even start the process.' },
    { p: 'The error comes from the client, not the server, so the same server can show it in Claude Code, Claude Desktop, Cursor, VS Code and Codex. What differs between clients is only where the useful detail is logged.' },

    { h2: 'Step 1: run the server by hand', id: 'run-by-hand' },
    { p: 'This is the same test the Claude Code docs recommend. Run the server\'s command exactly as written in your config, with the same environment variables:' },
    { code: j('# example: the official Memory server', 'npx -y @modelcontextprotocol/server-memory'), lang: 'bash' },
    { ul: [
      '**It starts and sits there:** the server itself works (press Ctrl+C to stop it). The problem is how the client launches it: the path, the environment, the working directory, or Windows `npx` (next section).',
      '**It prints an error and exits:** the message names what is missing, such as a Node.js version, a package, or an environment variable. That is the real cause.',
    ] },
    { p: 'Set any `env` values from your config in the same terminal first (for example `export API_KEY=...` on macOS and Linux, or `$env:API_KEY = "..."` in PowerShell).' },

    { h2: 'Step 2: the common causes', id: 'causes' },
    { h3: 'Windows and `npx`' },
    { p: 'On native Windows, a client that launches `npx` directly can fail to start it. One of the first reports of this exact `MCP error -32000: Connection closed` was Claude Code issue #3369 on native Windows. Wrap the command in `cmd /c`: see [Fix "spawn npx ENOENT" for MCP servers on Windows](/guides/fix-spawn-npx-enoent-windows-mcp/).' },
    { h3: 'The runtime is missing or too old' },
    { p: 'The server needs Node.js, Python or uv, and the client cannot find it or finds an old copy. Check `node --version` in the same environment the client uses. The official TypeScript reference servers declare Node 24 or newer from v2.0.0 (see [what changed in the MCP reference servers v2](/guides/mcp-reference-servers-v2-whats-changed/)), and a server that needs `uvx` needs uv installed. After installing a runtime, quit and reopen the client so it sees the new PATH.' },
    { h3: 'A required API key or setting is missing' },
    { p: 'Many servers exit immediately if a required environment variable is not set. Check the server\'s README for its variables, and set them in the config\'s `env` block, not only in your shell. Claude Code\'s troubleshooting notes that a server may miss variables that are not in its own config entry, because the client passes a limited environment to stdio servers.' },
    { h3: 'A wrong or relative path' },
    { p: 'Use absolute paths for local scripts and folders. Claude Code\'s docs say relative paths in `command` or `args` are a frequent cause of failed starts, because they resolve against the folder you launched the client from, not the config file\'s folder. Programs on your PATH, such as `npx` or `uvx`, are fine as they are.' },
    { h3: 'The command was added wrongly (Claude Code)' },
    { p: 'With `claude mcp add`, everything after the `--` separator is the server command. If you leave out the `--`, or quote the whole command as one string, Claude Code parses the pieces wrongly. Run `claude mcp get <name>` and check that the command shown is what you intended; if not, `claude mcp remove <name>` and add it again.' },
    { h3: 'The package cannot be downloaded' },
    { p: 'The first `npx -y` run downloads the package, which can fail on an offline machine, behind a proxy, or with a broken npm cache. Running the command by hand (Step 1) shows the npm error. A slow first download can instead end as a startup timeout; Claude Code\'s default is 30 seconds and can be raised with `MCP_TIMEOUT=60000 claude`, and Codex\'s default is 10 seconds, raised with `startup_timeout_sec` in `config.toml`.' },
    { h3: 'The server crashes on startup, or writes to stdout' },
    { p: 'If you wrote the server yourself, remember that a stdio server must never print logs to standard output: the MCP docs warn that it corrupts the JSON-RPC messages and breaks the server. Use stderr (`console.error` in Node, the `logging` module in Python). A plain crash on startup, such as an import error, also ends the connection.' },
    { pack: 'agent-builder-pack', toolName: 'MCP server builders', why: 'Only relevant if you are building your own server: the pack has scaffolding prompts for MCP servers in TypeScript and Python, Claude Code skills for MCP work and evals. You do not need it to fix an error with a server someone else made.' },

    { h2: 'Step 3: read the client\'s logs', id: 'logs' },
    { ul: [
      '**Claude Desktop:** logs are in `~/Library/Logs/Claude` on macOS and `%APPDATA%\\Claude\\logs` on Windows. `mcp.log` covers connections and failures, and `mcp-server-<name>.log` holds that server\'s stderr output.',
      '**Claude Code:** run `/mcp` to see which server failed. `claude mcp list` and `claude mcp get <name>` show failure details. For a server\'s stderr, run `claude --debug=mcp` and read the log under `~/.claude/debug/`.',
      '**Cursor:** open the Output panel (Cmd+Shift+U on Mac, Ctrl+Shift+U on Windows and Linux) and choose **MCP Logs**. See [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/).',
      '**VS Code:** run **MCP: List Servers** from the Command Palette, pick the server, and choose to show its output.',
      '**Codex:** run `codex mcp list` to check the entry, and type `/mcp` in the terminal UI to see active servers.',
    ] },

    { h2: 'Step 4: test the server without a client', id: 'inspector' },
    { p: 'The [MCP Inspector](/plugins/mcp-inspector/) runs your server and lets you list and call its tools in a browser, with the client taken out of the picture. If the server works there, the problem is your client config; if it fails there too, the server is the problem.' },
    { code: 'npx @modelcontextprotocol/inspector node build/index.js', lang: 'bash', caption: 'Inspector, then your server\'s command and arguments (this example launches a locally built Node server)' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Is -32000 always a local server problem?' },
    { p: 'The code means "connection closed", which can also happen with a remote server if the connection drops. The advice above is for local stdio servers, which is where this error shows up most. For a remote server that needs sign-in, see [Claude Code MCP "needs authentication"](/guides/fix-claude-code-mcp-needs-authentication/).' },
    { h3: 'It worked yesterday. What changed?' },
    { p: 'Usually the runtime or the package. With `npx -y` and no version, npx fetches the latest release on each launch, so a server update (or a Node update on your machine) can change behaviour. The official reference servers moved to v2 in October 2026; pinning a version with `package@version` is a quick way to test.' },
    { h3: 'Does a stdout log line cause this error?' },
    { p: 'The MCP docs say writing to stdout from a stdio server corrupts the protocol and breaks the server. We could not show that a stray stdout line by itself produces `-32000` in our own test, so treat it as a likely cause for a custom server and rely on Step 1 to confirm it.' },
  ],
  related: ['mcp-inspector', 'filesystem-mcp', 'memory-mcp', 'claude-code', 'codex-cli'],
  sources: [
    { label: 'MCP TypeScript SDK (ConnectionClosed error code -32000)', url: 'https://github.com/modelcontextprotocol/typescript-sdk' },
    { label: 'Model Context Protocol docs: Debugging', url: 'https://modelcontextprotocol.io/docs/tools/debugging' },
    { label: 'Model Context Protocol docs: Connect to local MCP servers (logs, troubleshooting)', url: 'https://modelcontextprotocol.io/docs/develop/connect-local-servers' },
    { label: 'Model Context Protocol docs: Build an MCP server (logging to stdout)', url: 'https://modelcontextprotocol.io/docs/develop/build-server' },
    { label: 'Claude Code docs: Connect Claude Code to tools via MCP', url: 'https://code.claude.com/docs/en/mcp' },
    { label: 'Claude Code docs: Debug your configuration', url: 'https://code.claude.com/docs/en/debug-your-config' },
    { label: 'Claude Code issue #3369: MCP fails on native Windows (user report)', url: 'https://github.com/anthropics/claude-code/issues/3369' },
    { label: 'OpenAI Codex docs: Configuration reference (startup_timeout_sec)', url: 'https://learn.chatgpt.com/docs/config-file/config-reference' },
    { label: 'VS Code docs: Add and manage MCP servers', url: 'https://code.visualstudio.com/docs/agent-customization/mcp-servers' },
    { label: 'Cursor docs: MCP', url: 'https://cursor.com/docs/mcp' },
  ],
};

/* ------------------------------------------------------------------------------------------------------------------ */

const claudeAuth: Guide = {
  slug: 'fix-claude-code-mcp-needs-authentication',
  title: 'Fix Claude Code MCP "needs authentication" (sign in with /mcp)',
  h1: 'Fix Claude Code MCP "needs authentication"',
  description: 'A remote MCP server shows "Needs authentication" in Claude Code? Sign in from /mcp or with claude mcp login, then fix expired tokens, headless sessions and servers that need a fixed callback port.',
  published: DATE, updated: DATE,
  intro: 'You added a remote MCP server to Claude Code and `claude mcp list` shows `! Needs authentication`, or a tool call fails and asks you to sign in again. That is not a broken install: Claude Code connected, the server answered 401 or 403, and it is waiting for you to log in. Here is how to finish the sign-in and what to check when it will not stick.',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ol: [
      'Start Claude Code and run `/mcp`.',
      'Select the server that needs authentication and follow the steps in the browser window that opens to log in and approve access.',
      'Run `claude mcp list` (or `/mcp` again) and check the server now shows `✔ Connected`.',
    ] },
    { p: 'Prefer the terminal, or working over SSH? Run `claude mcp login <name>` instead (add `--no-browser` to get a URL you can open on another machine and paste the redirect URL back). To sign out later, run `claude mcp logout <name>`.' },

    { h2: 'Why you see it', id: 'why' },
    { p: 'Claude Code marks a remote server as needing authentication when the server responds with `401 Unauthorized` or `403 Forbidden`, so you can complete the OAuth flow. OAuth in Claude Code applies to remote HTTP servers. A local stdio server does not use it; those take keys through environment variables (`claude mcp add --env KEY=value ...`), and a failing one is a different problem, covered in [Fix MCP error -32000](/guides/fix-mcp-error-32000-connection-closed/).' },
    { p: 'Claude Code stores the tokens it gets and refreshes them automatically. If a stored token is rejected, it refreshes and retries once before it flags the server again, so a flag that keeps returning usually means the refresh token was revoked or expired.' },

    { freebie: true },

    { h2: 'Add a server that needs sign-in, then authenticate', id: 'add-and-sign-in' },
    { p: 'The example from the Claude Code docs adds Sentry\'s remote server. See also the [Sentry MCP listing](/plugins/sentry-mcp/) and the [Notion](/plugins/notion-mcp/) and [Linear](/plugins/linear-mcp/) servers, which use the same flow.' },
    { code: j('claude mcp add --transport http sentry https://mcp.sentry.dev/mcp', 'claude', '# then inside Claude Code:', '/mcp'), lang: 'bash' },
    { p: 'If you already added the server, running `claude mcp add` again with the same name at the same scope fails with a message that the server already exists. Skip straight to `/mcp`.' },
    { p: 'More on adding servers to Claude Code is in [the best MCP servers for Claude Code](/guides/best-mcp-servers-for-claude-code/).' },

    { h2: 'If sign-in does not complete', id: 'troubleshooting' },
    { h3: 'The browser does not open, or the redirect fails' },
    { ul: [
      'If the browser does not open on its own, copy the URL Claude Code shows and open it manually.',
      'If the redirect shows a connection error after you approve access, copy the full callback URL from your browser\'s address bar and paste it into the URL prompt that Claude Code shows.',
      'Over SSH, or on Linux with no display, `claude mcp login <name>` detects there is no local browser and prints the URL instead. Open it on your own machine and paste the redirect URL back. It needs an interactive terminal for that paste step.',
    ] },
    { h3: '"MCP server needs you to sign in again"' },
    { p: 'The full message in the Claude Code docs is `MCP server "<name>" needs you to sign in again (run /mcp to re-authenticate)`. It means a sign-in expired or was revoked, or the token lacks a permission the tool needs. Run `/mcp`, select the server, and choose **Re-authenticate**. If the same error returns for one specific tool, the token may be missing a scope; Claude Code requests the scopes pinned in the server\'s config (`oauth.scopes`) when they are set, so add the missing scope there before signing in again.' },
    { h3: 'You use claude -p or the Agent SDK' },
    { p: 'Headless runs have no `/mcp` panel, so Claude Code cannot run the OAuth flow there. Sign in once from an interactive session (`/mcp`, or `claude mcp login <name>` in your shell), then start the run again.' },
    { h3: 'You set an Authorization header yourself' },
    { p: 'If the server entry has `headers.Authorization` (or a `headersHelper`) and the server rejects it, Claude Code reports the connection as failed rather than falling back to OAuth. Fix the token, or remove the header to use the OAuth flow. If the header comes from a `${VAR}`, check that the variable is set; Claude Code warns about unset ones in `claude mcp list` and `/mcp`.' },
    { h3: 'The server requires a pre-registered redirect URI or client' },
    { p: 'By default Claude Code uses a random free port for the OAuth callback. Servers that only accept a redirect URI of the form `http://localhost:PORT/callback` registered in advance need a fixed port, and some need a pre-registered client ID:' },
    { code: j('claude mcp add --transport http --callback-port 8080 my-server https://mcp.example.com/mcp', '', '# with a pre-registered OAuth client (the secret is prompted for, masked)', 'claude mcp add --transport http --client-id your-client-id --client-secret --callback-port 8080 my-server https://mcp.example.com/mcp'), lang: 'bash', caption: 'Replace the name, URL and ID with your server\'s' },
    { h3: 'The same server name is defined in two scopes' },
    { p: 'Claude Code stores OAuth sign-ins per endpoint. If one name points at different URLs in different scopes (for example a user-level and a project-level entry), signing in to one does not sign you in to the other, and `claude mcp list` warns about the conflict. Keep one definition and remove the rest with `claude mcp remove`.' },
    { h3: 'Google, Microsoft 365 and other Anthropic-hosted connectors' },
    { p: 'Some Anthropic-hosted connectors, such as Gmail, Google Calendar and Microsoft 365, do not support local OAuth from Claude Code, because the identity provider only accepts the redirect URL registered by claude.ai. If Claude Code says so, connect the service at claude.ai under **Customize**, then **Connectors**, and remove your own entry with `claude mcp remove <name>`; the connector then appears in Claude Code on its own.' },
    { h3: 'Start fresh' },
    { p: 'Choose **Clear authentication** from the server\'s menu in `/mcp`, or run `claude mcp logout <name>`, then authenticate again. If that still fails, `claude mcp remove <name>` and add the server again.' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Is "needs authentication" the same as "Failed to connect"?' },
    { p: 'No. `Failed to connect` means Claude Code could not reach or start the server, and `claude mcp get <name>` shows the HTTP status or error text. `Needs authentication` means it reached the server, and the server asked for credentials.' },
    { h3: 'Does a local server (npx, uvx) use /mcp to sign in?' },
    { p: 'No. OAuth sign-in is for remote HTTP servers. For a local server, put the API key in its environment with `--env` or the `env` block of `.mcp.json`.' },
    { h3: 'Can I do this for a team without everyone clicking through?' },
    { p: 'Each person signs in with their own account; tokens are stored per user. Teams can share the server definition through a project `.mcp.json` file, but not the credentials.' },
  ],
  related: ['claude-code', 'sentry-mcp', 'notion-mcp', 'linear-mcp', 'github-mcp-server'],
  sources: [
    { label: 'Claude Code docs: Authenticate with remote MCP servers', url: 'https://code.claude.com/docs/en/mcp' },
    { label: 'Claude Code docs: Error reference (MCP server needs you to sign in again)', url: 'https://code.claude.com/docs/en/errors' },
    { label: 'Claude Code docs: Debug your configuration (check MCP servers)', url: 'https://code.claude.com/docs/en/debug-your-config' },
  ],
};

/* ------------------------------------------------------------------------------------------------------------------ */

const codexToml: Guide = {
  slug: 'add-mcp-server-to-codex-config-toml',
  title: 'How to add an MCP server to Codex (config.toml and codex mcp add)',
  h1: 'How to add an MCP server to Codex',
  description: 'Add an MCP server to OpenAI Codex with codex mcp add or config.toml: file locations, stdio and remote examples, env vars, timeouts, OAuth login and fixes for common errors.',
  published: DATE, updated: DATE,
  intro: 'Codex (the CLI, the IDE extension and the desktop app) can use MCP servers to reach tools and data beyond your repository. You add one either with a single `codex mcp add` command or by editing `config.toml`, and all Codex surfaces share the same configuration. This guide covers both, with examples built from OpenAI\'s documentation.',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ol: [
      'Run `codex mcp add <name> -- <command> <args>`. For example `codex mcp add context7 -- npx -y @upstash/context7-mcp` (the example OpenAI\'s docs use).',
      'Run `codex mcp list` to confirm it is saved.',
      'Start `codex` and type `/mcp` to see the active servers.',
    ] },
    { p: 'The command writes a `[mcp_servers.<name>]` table into `~/.codex/config.toml`. You can edit that file directly for anything the command does not cover. The IDE extension and desktop app also have an **MCP servers** screen (in settings) that edits the same configuration.' },

    { freebie: true },

    { h2: 'Where the config lives', id: 'location' },
    { ul: [
      '**Global:** `~/.codex/config.toml` (on Windows, in `.codex` under your user folder).',
      '**Project:** `.codex/config.toml` in a project, which Codex reads for trusted projects only.',
    ] },
    { p: 'The ChatGPT desktop app, the Codex CLI and the IDE extension share this configuration, so you set a server up once. ChatGPT on the web does not read your local Codex files; it uses plugins instead.' },

    { h2: 'Option 1: codex mcp add', id: 'cli' },
    { code: 'codex mcp add <server-name> --env VAR1=VALUE1 --env VAR2=VALUE2 -- <stdio server-command>', lang: 'bash', caption: 'The general form from OpenAI\'s docs' },
    { p: 'Everything after `--` is the command that starts the server. Put `--env` options before it. A few real examples, using servers listed on PluginStack:' },
    { code: j('# Context7: current library docs (example from the OpenAI docs)', 'codex mcp add context7 -- npx -y @upstash/context7-mcp', '', '# Official Memory server', 'codex mcp add memory -- npx -y @modelcontextprotocol/server-memory', '', '# Official Filesystem server: the last argument is the folder it may access', 'codex mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/you/projects'), lang: 'bash' },
    { p: 'See [Context7](/plugins/context7/), [Memory](/plugins/memory-mcp/) and [Filesystem](/plugins/filesystem-mcp/). The official TypeScript servers need Node 24 or newer from v2 onward ([what changed](/guides/mcp-reference-servers-v2-whats-changed/)).' },
    { h3: 'Other commands' },
    { ul: [
      '`codex mcp list` shows the configured servers.',
      '`codex mcp --help` lists all MCP commands.',
      '`codex mcp login <server-name>` starts the OAuth login for a server that supports it.',
    ] },
    { h3: 'A remote (HTTP) server' },
    { p: 'For a hosted server, pass its address with `--url` instead of a command:' },
    { code: 'codex mcp add example --url https://mcp.example.com', lang: 'bash', caption: 'Then run: codex mcp login example (if the server uses OAuth)' },

    { h2: 'Option 2: edit config.toml', id: 'toml' },
    { p: 'Each server is a `[mcp_servers.<name>]` table. For a local (stdio) server, `command` is required; `args`, `env`, `env_vars` and `cwd` are optional:' },
    { code: j('[mcp_servers.filesystem]', 'command = "npx"', 'args = ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]', '', '[mcp_servers.context7]', 'command = "npx"', 'args = ["-y", "@upstash/context7-mcp"]', 'startup_timeout_sec = 20   # default is 10'), lang: 'text', caption: '~/.codex/config.toml' },
    { p: 'The table name (`filesystem`) is the label you choose. Save the file and restart Codex (in the IDE extension, use **Restart extension**).' },
    { h3: 'Environment variables and API keys' },
    { ul: [
      '`env` sets values for the server: `env = { API_KEY = "value" }`.',
      '`env_vars` lists variable names to allow and forward from your own environment, such as `env_vars = ["API_KEY"]`, so the secret does not have to sit in the file.',
    ] },
    { p: 'Prefer `env_vars` for real keys, and never commit a `config.toml` that contains one. A project-level `.codex/config.toml` is easy to commit by accident.' },
    { h3: 'A remote server in config.toml' },
    { code: j('[mcp_servers.example]', 'url = "https://mcp.example.com"', 'bearer_token_env_var = "EXAMPLE_TOKEN"   # token read from this variable, sent in Authorization'), lang: 'text' },
    { p: 'For HTTP servers, `url` is required. You can add a bearer token from an environment variable (`bearer_token_env_var`), static headers (`http_headers`), or headers read from variables (`env_http_headers`). With none of those, Codex tries stored OAuth credentials, so run `codex mcp login <name>` for servers that use OAuth.' },
    { h3: 'Useful options' },
    { ul: [
      '`startup_timeout_sec`: seconds to wait for the server to start. Default 10. Raise it if the first `npx` download is slow.',
      '`tool_timeout_sec`: seconds a tool call may run. Default 60.',
      '`enabled = false`: switch a server off without deleting its config.',
      '`required = true`: make Codex fail at startup if that server cannot initialise.',
      '`enabled_tools` and `disabled_tools`: allow or deny specific tool names.',
      '`default_tools_approval_mode`: how Codex asks before running the server\'s tools (`auto`, `prompt`, `writes` or `approve`).',
    ] },
    { p: 'OpenAI\'s configuration reference has the complete list of MCP options. Settings change between Codex releases, so check it for your version.' },

    { h2: 'Check that it works', id: 'check' },
    { ol: [
      'Run `codex mcp list`: the server should appear.',
      'Start `codex` and type `/mcp`: the server should be listed as active.',
      'Ask for something only that server can do, for example "Use the memory server to remember that I prefer tabs", and approve the tool call if asked.',
    ] },

    { h2: 'Common errors and fixes', id: 'errors' },
    { ul: [
      '**The server does not appear:** check the table is `[mcp_servers.<name>]` (plural `mcp_servers`) and that the TOML is valid. For a project file, the project must be trusted.',
      '**It times out on the first run:** the first `npx -y` run downloads the package. Raise `startup_timeout_sec`, or run the command once by hand so it is cached.',
      '**`spawn npx ENOENT`, or it fails only on Windows:** update Codex, then see [Fix "spawn npx ENOENT" on Windows](/guides/fix-spawn-npx-enoent-windows-mcp/).',
      '**The server exits at once:** run its command yourself in a terminal to see why. [Fix MCP error -32000](/guides/fix-mcp-error-32000-connection-closed/) walks through it.',
      '**An OAuth server stays unauthenticated:** run `codex mcp login <name>`; in the desktop app or IDE extension, use **Authenticate** in the MCP servers list.',
    ] },
    { p: 'Using Codex alongside other tools? The same servers can be added to [Cursor](/guides/add-mcp-server-to-cursor/) and [Claude Code](/guides/best-mcp-servers-for-claude-code/). More about the agent itself: [Codex CLI](/plugins/codex-cli/).' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Is the config the same for the CLI and the IDE extension?' },
    { p: 'Yes. OpenAI\'s docs say the desktop app, CLI and IDE extension share MCP configuration, so you can switch between them without redoing setup.' },
    { h3: 'Where do I put an API key?' },
    { p: 'Use `env_vars` to forward a variable from your shell, or `bearer_token_env_var` for remote servers, so the key stays out of the file. If you use `env` or `codex mcp add --env`, the value is saved in `config.toml`; keep that file private.' },
    { h3: 'How do I turn a server off without removing it?' },
    { p: 'Set `enabled = false` in its `[mcp_servers.<name>]` table.' },
  ],
  related: ['codex-cli', 'context7', 'filesystem-mcp', 'memory-mcp', 'mcp-inspector'],
  sources: [
    { label: 'OpenAI docs: Model Context Protocol (Codex)', url: 'https://learn.chatgpt.com/docs/extend/mcp' },
    { label: 'OpenAI docs: Configuration reference (mcp_servers options)', url: 'https://learn.chatgpt.com/docs/config-file/config-reference' },
    { label: 'Codex CLI repository', url: 'https://github.com/openai/codex' },
    { label: 'Context7 repository (Codex install command)', url: 'https://github.com/upstash/context7' },
  ],
};

export const MCP_GUIDES: Guide[] = [referenceV2, windowsEnoent, error32000, claudeAuth, codexToml];
