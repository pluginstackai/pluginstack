/**
 * Client setup guides for VS Code and Claude Desktop (/guides/<slug>/). Same data shape and rules as guides.ts: every
 * command, path, setting and config snippet must match the sources linked in `sources` (checked on `updated`).
 * Imported into GUIDES in guides.ts.
 */
import type { Guide } from './guides.ts';

/** Join lines into a code-block string (keeps the config snippets readable in source). */
const j = (...lines: string[]) => lines.join('\n');

const DATE = '2026-10-28';

/* ------------------------------------------------------------------------------------------------------------------ */

const vscode: Guide = {
  slug: 'add-mcp-server-to-vs-code',
  title: 'How to add an MCP server to VS Code (mcp.json, .mcp.json and fixes)',
  h1: 'How to add an MCP server to VS Code',
  description: 'Add an MCP server to VS Code with MCP: Add Server, the @mcp gallery or a config file: which file to use (servers vs mcpServers), stdio and HTTP examples, API keys, and fixes.',
  published: DATE, updated: DATE,
  intro: 'VS Code\'s agents can call tools from MCP (Model Context Protocol) servers, for example to drive a browser, read current library docs or query GitHub. The setup changed in 2026: VS Code now has two config formats in different files, and the one you pick decides which features you get. This guide shows the quickest way to add a server, which file it ends up in, and what to check when the agent can\'t see it. It is based on Microsoft\'s VS Code documentation (checked 28 October 2026).',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ol: [
      'Open the Command Palette (**Ctrl+Shift+P**, or **Cmd+Shift+P** on macOS) and run **MCP: Add Server**.',
      'Pick **HTTP** if the publisher gave you a URL, or **Command (stdio)** if they gave you a command such as `npx -y @playwright/mcp@latest`.',
      'Give it an ID you haven\'t used yet, such as `playwright`.',
      'Choose where to save it: **Global** then **Copilot Global** for just you, or a workspace file to share it with your team.',
      'Accept the trust or sign-in prompts you understand, then ask the agent to use the server and expand the tool call to confirm it really ran.',
    ] },
    { p: 'Microsoft\'s docs stress the last step: a saved config is not proof the agent can use the server. The connection works when a tool from that server is called and returns real output.' },

    { freebie: true },

    { h2: 'Which config file is which', id: 'files' },
    { p: 'This is where most confusion comes from. VS Code reads two formats, and they use different top-level keys:' },
    { ul: [
      '**Portable (Copilot) format**, top-level `mcpServers`: `~/.copilot/mcp-config.json` for your user (or `$COPILOT_HOME/mcp-config.json` if you set `COPILOT_HOME`), or `.mcp.json` at the root of a workspace for a team. Copilot agent sessions read these directly. This is the same `mcpServers` shape Cursor and Claude Desktop use.',
      '**VS Code format**, top-level `servers`: `.vscode/mcp.json` in a workspace, or the `mcp.json` in your VS Code user profile. The guided flow now labels these destinations deprecated, but they are still the only place for VS Code input prompts (`${input:...}`), `envFile`, per-server sandboxing and development mode.',
    ] },
    { p: 'Copying a block between the two formats without renaming the key is the classic mistake: a `mcpServers` block inside `.vscode/mcp.json`, or `servers` inside `.mcp.json`, is not what VS Code expects. Servers in the VS Code format are forwarded to Copilot sessions, except ones that need interactive input such as `${input:...}` variables.' },

    { h2: 'Option 1: MCP: Add Server', id: 'add-server' },
    { p: 'The guided flow in the quick answer writes the file for you. Two extras are worth knowing:' },
    { ul: [
      '**From a package name:** choose **NPM Package**, **Pip Package** or **Docker Image** and enter a name like `@playwright/mcp`. VS Code uses a model to generate the config, so review the command and arguments it proposes before allowing it. These options only appear where model-assisted setup is supported.',
      '**From another app:** **Add from another application...** in the same picker finds servers you already configured elsewhere.',
    ] },
    { p: 'You can also start from Chat: **Open Customizations**, then **MCP Servers**, then **Add Server**.' },

    { h2: 'Option 2: the MCP server gallery', id: 'gallery' },
    { ol: [
      'Open the Extensions view (**Ctrl+Shift+X** or **Cmd+Shift+X**) and search for `@mcp`.',
      'Select a server and read its publisher, capabilities and requirements.',
      'Click **Install** for yourself, or right-click and choose **Install in Workspace** to share its config with the project.',
    ] },
    { p: 'The gallery is in preview, and an organization can restrict which servers are allowed. If you don\'t see it, use **MCP: Add Server** with the publisher\'s URL or command.' },

    { h2: 'Option 3: write the config yourself', id: 'config' },
    { h3: 'Portable format (.mcp.json or ~/.copilot/mcp-config.json)' },
    { p: 'A local server started with a command, here the [Playwright MCP server](/plugins/playwright-mcp/) (it needs Node.js 18 or newer):' },
    { code: j('{', '  "mcpServers": {', '    "playwright": {', '      "command": "npx",', '      "args": ["-y", "@playwright/mcp@latest"]', '    }', '  }', '}'), lang: 'json', caption: '.mcp.json (workspace root) or ~/.copilot/mcp-config.json' },
    { p: 'A remote server only needs its URL. This is the [Context7](/plugins/context7/) endpoint from Microsoft\'s example; check the publisher\'s docs for sign-in and limits:' },
    { code: j('{', '  "mcpServers": {', '    "context7": {', '      "type": "http",', '      "url": "https://mcp.context7.com/mcp"', '    }', '  }', '}'), lang: 'json' },
    { h3: 'VS Code format (.vscode/mcp.json)' },
    { p: 'Same Playwright server, but note the `servers` key and the explicit `"type": "stdio"`:' },
    { code: j('{', '  "servers": {', '    "playwright": {', '      "type": "stdio",', '      "command": "npx",', '      "args": ["-y", "@playwright/mcp@latest"]', '    }', '  }', '}'), lang: 'json', caption: '.vscode/mcp.json' },
    { p: 'For HTTP servers, VS Code tries Streamable HTTP first and falls back to SSE. Run **MCP: Open Workspace Folder MCP Configuration** or **MCP: Open User Configuration** to open these files.' },
    { h3: 'From the command line' },
    { code: 'code --add-mcp \'{"name":"playwright","type":"stdio","command":"npx","args":["-y","@playwright/mcp@latest"]}\'', lang: 'bash', caption: 'Adds the server to your VS Code user profile (VS Code format)' },

    { h2: 'API keys and environment variables', id: 'secrets' },
    { p: 'The two formats handle secrets differently:' },
    { ul: [
      '**Portable format:** reference variables from the environment as `${NAME}`, or `${NAME:-default}` for a non-secret default. Use the braced form; VS Code\'s client treats a bare `$NAME` as literal text. It works in `command`, `args` and `env` for stdio servers and in header values for HTTP servers. `envFile` and input prompts are not supported here.',
      '**VS Code format:** reference variables as `${env:NAME}`, load a file with `envFile`, or declare an `inputs` entry so VS Code asks for the key the first time and stores it securely.',
    ] },
    { p: 'An input prompt, using the [Brave Search](/plugins/brave-search-mcp/) server\'s package and variable name:' },
    { code: j('{', '  "inputs": [', '    {', '      "type": "promptString",', '      "id": "brave-key",', '      "description": "Brave Search API key",', '      "password": true', '    }', '  ],', '  "servers": {', '    "brave-search": {', '      "type": "stdio",', '      "command": "npx",', '      "args": ["-y", "@brave/brave-search-mcp-server", "--transport", "stdio"],', '      "env": { "BRAVE_API_KEY": "${input:brave-key}" }', '    }', '  }', '}'), lang: 'json', caption: '.vscode/mcp.json' },
    { note: 'A server that needs a `${input:...}` value is not forwarded to Copilot sessions. If it must work there, set the key as an environment variable and use the portable format, or use OAuth if the server supports it. Never commit a file that contains a real key.' },

    { h2: 'Reuse servers from Claude Desktop or Cursor', id: 'discovery' },
    { p: 'The `chat.mcp.discovery.enabled` setting lets VS Code pick up servers configured in other apps: Claude Desktop (`claude_desktop_config.json`), Cursor (`~/.cursor/mcp.json` and a workspace `.cursor/mcp.json`), Windsurf and GitHub Copilot CLI. Copilot CLI discovery is on by default; the others are off until you enable them. Setting up Claude Desktop too? See [how to add an MCP server to Claude Desktop](/guides/add-mcp-server-to-claude-desktop/).' },

    { h2: 'Start, stop and check a server', id: 'manage' },
    { ul: [
      'Run **MCP: List Servers**, pick the server, and choose **Start**, **Stop**, **Restart** or **Show Output**.',
      'Or use **Chat: Open Customizations** then **MCP Servers**: each server has an on/off toggle and a **...** menu with the same actions.',
      '**Disable** is not the same as **Stop**: a disabled server doesn\'t start at all and its tools are unavailable until you turn it back on. Disabling only changes your own setup, not a shared config file.',
      'Run **MCP: Reset Cached Tools** if a server\'s tools changed but VS Code still shows the old list.',
    ] },
    { p: 'To test, give the agent a harmless request that names the server, such as "Use the Playwright MCP server to open https://example.com and report the page title. Do not change files." Then expand the tool call in the chat and confirm it came from your server.' },

    { h2: 'Troubleshooting', id: 'troubleshooting' },
    { ul: [
      '**The server doesn\'t appear:** check you edited the right file for the harness you are using, and that the top-level key matches the file (`servers` in `.vscode/mcp.json`, `mcpServers` in `.mcp.json` and `mcp-config.json`).',
      '**A stdio server won\'t start:** open **Show Output** for the server. Usually the command isn\'t on `PATH` or the runtime is missing or too old. Run the same command in a terminal to see the real error. On Windows, see [Fix "spawn npx ENOENT"](/guides/fix-spawn-npx-enoent-windows-mcp/); for a server that starts and then exits, see [MCP error -32000](/guides/fix-mcp-error-32000-connection-closed/).',
      '**Workspace servers never start:** `.vscode/mcp.json` and `.mcp.json` follow Workspace Trust, so they don\'t run in Restricted Mode. Review the config before you trust a repository; stdio servers run code on your machine.',
      '**A Docker server exits straight away:** don\'t use `-d`. The container must stay in the foreground so VS Code can talk to it over stdio.',
      '**An HTTP server won\'t connect or sign in:** check the URL and your network, then follow the publisher\'s sign-in steps. In a company, an administrator may limit which MCP servers are allowed, and local config can\'t override that.',
      '**The server runs but the agent never calls it:** check it is enabled and its tools are selected for the session, then name the server explicitly in your prompt.',
      '**It works locally but not in a dev container or over SSH:** user-profile stdio servers run on your local machine. Configure the server in the remote environment (**MCP: Open Remote User Configuration**) and install its runtime there.',
    ] },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Should I use .vscode/mcp.json or .mcp.json?' },
    { p: 'For a new setup, Microsoft\'s guided flow points you to the portable files (`~/.copilot/mcp-config.json` for yourself, `.mcp.json` for a team). Keep `.vscode/mcp.json` when you need input prompts, `envFile`, sandboxing or development mode, which only the VS Code format supports.' },
    { h3: 'Can I sandbox a server?' },
    { p: 'On macOS and Linux, yes: in the VS Code format, set `"sandboxEnabled": true` on a stdio server and add a `sandbox` object with allowed write paths and network domains. It is not available on Windows. Tool calls from a sandboxed server are auto-approved, so set the rules carefully.' },
    { h3: 'Is it the same setup as Cursor?' },
    { p: 'The portable format uses the same `mcpServers` shape as Cursor\'s `mcp.json`, but the file locations differ. See [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/).' },
  ],
  related: ['playwright-mcp', 'context7', 'github-mcp-server', 'brave-search-mcp', 'mcp-inspector'],
  sources: [
    { label: 'VS Code docs: Add MCP servers in VS Code', url: 'https://code.visualstudio.com/docs/agent-customization/mcp-servers' },
    { label: 'VS Code docs: MCP configuration reference', url: 'https://code.visualstudio.com/docs/agents/reference/mcp-configuration' },
    { label: 'VS Code docs: Manage and troubleshoot MCP servers', url: 'https://code.visualstudio.com/docs/agents/run/manage-mcp-servers' },
    { label: 'Playwright MCP repository (requirements)', url: 'https://github.com/microsoft/playwright-mcp' },
    { label: 'Brave Search MCP server repository', url: 'https://github.com/brave/brave-search-mcp-server' },
  ],
};

/* ------------------------------------------------------------------------------------------------------------------ */

const claudeDesktop: Guide = {
  slug: 'add-mcp-server-to-claude-desktop',
  title: 'How to add an MCP server to Claude Desktop (claude_desktop_config.json, extensions, connectors)',
  h1: 'How to add an MCP server to Claude Desktop',
  description: 'Three ways to add an MCP server to Claude Desktop: desktop extensions, claude_desktop_config.json and custom connectors. File paths, a working example, logs and fixes.',
  published: DATE, updated: DATE,
  intro: 'Claude Desktop can use MCP (Model Context Protocol) servers in three ways, and picking the right one saves most of the trouble: one-click **desktop extensions**, local servers you list in **claude_desktop_config.json**, and remote servers added as **custom connectors**. This guide explains when to use each, with the exact paths, a working config and the log files to read when a server will not connect. It is based on Anthropic\'s help center and the official MCP documentation (checked 28 October 2026).',
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ul: [
      '**The server is in Anthropic\'s directory:** go to **Settings > Desktop app**, click **Manage** next to Extensions, then **Browse extensions** and **Install**. No JSON and no Node.js install needed.',
      '**You have a command to run locally** (such as `npx -y @modelcontextprotocol/server-filesystem ...`): add it under `mcpServers` in `claude_desktop_config.json`, save, then quit Claude Desktop completely and reopen it.',
      '**You have an https URL for a hosted server:** add it as a custom connector under **Customize > Connectors**, **+ Add**, **Add custom connector**. Don\'t put it in the config file.',
    ] },
    { p: 'To check what is connected, click the **+** button at the bottom of the chat box and open **Connectors**. Each connected server is listed with its tools.' },

    { freebie: true },

    { h2: 'Option 1: desktop extensions', id: 'extensions' },
    { p: 'Desktop extensions are local MCP servers packaged as `.mcpb` files that install like browser extensions. Claude Desktop ships its own Node.js runtime for them, so you don\'t need Node installed, and fields marked sensitive (such as API keys) are stored in your operating system\'s keychain.' },
    { ol: [
      'Open **Settings > Desktop app** and click **Manage** next to Extensions (in the older settings layout: **Settings > Extensions**).',
      'Click **Browse extensions**, pick an Anthropic-reviewed extension and click **Install**.',
      'Fill in any settings it asks for, such as an API key or a folder.',
    ] },
    { p: 'To install an `.mcpb` file someone sent you: on the same page open **Advanced settings**, find the **Extension Developer** section and click **Install Extension...**. Only install files from people you trust. On Team and Enterprise plans an owner can restrict which extensions are allowed.' },

    { h2: 'Option 2: claude_desktop_config.json', id: 'config' },
    { p: 'For any local server that is not packaged as an extension, list it in the config file. Open it from the Claude menu in your system menu bar (not the settings inside the chat window): **Settings...**, then the **Developer** tab, then **Edit Config**. That creates the file if it doesn\'t exist. You can also open it directly:' },
    { ul: [
      '**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`',
      '**Windows:** `%APPDATA%\\Claude\\claude_desktop_config.json`',
      '**Linux:** `~/.config/Claude/claude_desktop_config.json` (or under `$XDG_CONFIG_HOME/Claude/` if that is set; this location is from VS Code\'s documentation, which reads the same file)',
    ] },
    { p: 'This example adds the official [Filesystem server](/plugins/filesystem-mcp/) with access to two folders. Replace `username` with your own and keep the paths absolute:' },
    { code: j('{', '  "mcpServers": {', '    "filesystem": {', '      "command": "npx",', '      "args": [', '        "-y",', '        "@modelcontextprotocol/server-filesystem",', '        "/Users/username/Desktop",', '        "/Users/username/Downloads"', '      ]', '    }', '  }', '}'), lang: 'json', caption: 'macOS' },
    { code: j('{', '  "mcpServers": {', '    "filesystem": {', '      "command": "npx",', '      "args": [', '        "-y",', '        "@modelcontextprotocol/server-filesystem",', '        "C:\\\\Users\\\\username\\\\Desktop",', '        "C:\\\\Users\\\\username\\\\Downloads"', '      ]', '    }', '  }', '}'), lang: 'json', caption: 'Windows (backslashes doubled inside JSON strings)' },
    { p: 'Then quit Claude Desktop fully (not just close the window) and start it again. Servers in this file need their runtime on your machine. From v2 the official TypeScript reference servers, Filesystem included, need Node.js 24 or newer ([what changed](/guides/mcp-reference-servers-v2-whats-changed/)).' },
    { h3: 'Adding more servers and API keys' },
    { p: 'Each server is another entry inside `mcpServers`. Put keys in an `env` object. This uses the [Brave Search](/plugins/brave-search-mcp/) server\'s package and variable name:' },
    { code: j('{', '  "mcpServers": {', '    "filesystem": {', '      "command": "npx",', '      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/Desktop"]', '    },', '    "brave-search": {', '      "command": "npx",', '      "args": ["-y", "@brave/brave-search-mcp-server", "--transport", "stdio"],', '      "env": { "BRAVE_API_KEY": "YOUR_API_KEY_HERE" }', '    }', '  }', '}'), lang: 'json' },
    { p: 'The key sits in the file as plain text, so keep it private. If the server is also available as a desktop extension, that is the safer way to store a key.' },

    { h2: 'Option 3: remote servers as custom connectors', id: 'connectors' },
    { p: 'Hosted servers with an https URL are added to your Claude account rather than to the config file. On Pro and Max: **Customize > Connectors**, **+ Add**, **Add custom connector**, enter a name and the server URL, review the detected sign-in settings, and click **Add**. On Team and Enterprise, an owner adds the connector under **Organization settings > Connectors** first, then each member clicks **Connect**. Free plans can have one custom connector.' },
    { p: 'Two things surprise people. First, Claude connects to a custom connector from Anthropic\'s cloud, not from your computer, so a server on localhost, a VPN or a private network won\'t work unless it is reachable from Anthropic\'s IP ranges. Second, the reverse also holds: servers in `claude_desktop_config.json` run on your machine and aren\'t available in Cowork or on claude.ai. Turn connectors on or off per chat from the **+** button, then **Connectors**.' },

    { h2: 'Check that it works', id: 'check' },
    { ol: [
      'Click **+** at the bottom of the chat box and open **Connectors**. Your server should be listed; open it to see its tools.',
      'Ask for something only that server can do, for example "List the files on my Desktop" for the Filesystem server.',
      'Claude asks before it runs a tool. Read what it wants to do before you approve, and only choose **Allow always** for tools you trust.',
    ] },
    { p: 'Connection status and logs for local servers are also on the Extensions page under **Local MCP servers** (in the older layout, **Settings > Developer**).' },

    { h2: 'Read the logs', id: 'logs' },
    { ul: [
      '**macOS:** `~/Library/Logs/Claude`',
      '**Windows:** `%APPDATA%\\Claude\\logs`',
      '`mcp.log` has general connection messages and failures. `mcp-server-<name>.log` has everything that server printed to stderr, which often includes normal logging, not only errors.',
    ] },
    { code: 'tail -n 20 -f ~/Library/Logs/Claude/mcp*.log', lang: 'bash', caption: 'macOS: show recent MCP logs and follow new lines' },
    { code: 'type "%APPDATA%\\Claude\\logs\\mcp*.log"', lang: 'text', caption: 'Windows (Command Prompt): show recent MCP logs' },

    { h2: 'Troubleshooting', id: 'troubleshooting' },
    { ul: [
      '**The server doesn\'t show up:** quit and reopen Claude Desktop completely, then check the file is valid JSON (a missing comma or an unescaped Windows backslash breaks the whole file) and that every path is absolute.',
      '**It shows up but fails to connect:** run the same command in a terminal, for example `npx -y @modelcontextprotocol/server-filesystem /Users/username/Desktop`, and read the error. Then check `mcp-server-<name>.log`. A server that starts and exits at once is covered in [MCP error -32000 "Connection closed"](/guides/fix-mcp-error-32000-connection-closed/).',
      '**Windows: ENOENT error** with `${APPDATA}` in the log: the MCP docs suggest adding `"APPDATA": "C:\\\\Users\\\\<you>\\\\AppData\\\\Roaming\\\\"` to the server\'s `env`, and making sure npm is installed globally (`%APPDATA%\\npm` should exist; if not, run `npm install -g npm`). More fixes in [Fix "spawn npx ENOENT" on Windows](/guides/fix-spawn-npx-enoent-windows-mcp/).',
      '**An extension is installed but its tools are missing:** restart Claude Desktop, then open the extension\'s settings and fill in any required fields, such as the API key or folder.',
      '**A remote URL in the config file does nothing:** add hosted servers as custom connectors (Option 3) instead.',
      '**Research doesn\'t use your server:** Anthropic notes that advanced Research can\'t call tools from local MCP servers.',
    ] },

    { pack: 'agent-builder-pack', toolName: 'Claude Desktop', why: 'Only relevant if you want to build your own MCP server rather than add existing ones: the pack has scaffolding prompts for MCP servers in TypeScript and Python, Claude Code skills for MCP work and eval prompts. You don\'t need it to follow this guide.' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Can Claude Code use the servers I set up in Claude Desktop?' },
    { p: 'Yes. `claude mcp add-from-claude-desktop` imports them (on macOS and WSL). See [the best MCP servers for Claude Code](/guides/best-mcp-servers-for-claude-code/).' },
    { h3: 'Can VS Code use them?' },
    { p: 'Yes, if you turn on Claude Desktop as a discovery source in the `chat.mcp.discovery.enabled` setting. See [how to add an MCP server to VS Code](/guides/add-mcp-server-to-vs-code/).' },
    { h3: 'Extension or config file: which should I use?' },
    { p: 'Use an extension when one exists: it installs with a click, brings its own Node.js and keeps keys in your keychain. Use the config file for servers that aren\'t packaged as extensions or when you need a specific command or version.' },
  ],
  related: ['filesystem-mcp', 'brave-search-mcp', 'memory-mcp', 'fetch-mcp', 'mcp-inspector'],
  sources: [
    { label: 'MCP docs: Connect to local MCP servers', url: 'https://modelcontextprotocol.io/docs/develop/connect-local-servers' },
    { label: 'MCP docs: Connect to remote MCP servers', url: 'https://modelcontextprotocol.io/docs/develop/connect-remote-servers' },
    { label: 'Claude Help Center: Getting started with local MCP servers on Claude Desktop', url: 'https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop' },
    { label: 'Claude Help Center: Get started with custom connectors using remote MCP', url: 'https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp' },
    { label: 'VS Code docs: MCP configuration reference (Claude Desktop config locations)', url: 'https://code.visualstudio.com/docs/agents/reference/mcp-configuration' },
    { label: 'Claude Code docs: MCP (add-from-claude-desktop)', url: 'https://code.claude.com/docs/en/mcp' },
  ],
};

export const CLIENT_GUIDES: Guide[] = [vscode, claudeDesktop];
