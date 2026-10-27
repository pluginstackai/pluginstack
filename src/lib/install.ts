import type { InstallSpec } from './data';

/**
 * Per-client install snippets generated from one verified InstallSpec (see content/SCHEMA.md).
 * Client formats (checked 2026-10-27):
 * - Claude Code: `claude mcp add` (https://code.claude.com/docs/en/mcp)
 * - Claude Desktop: claude_desktop_config.json, `mcpServers`, local (stdio) servers (https://modelcontextprotocol.io/docs/develop/connect-local-servers)
 * - Cursor: .cursor/mcp.json or ~/.cursor/mcp.json, `mcpServers` (https://cursor.com/docs/mcp)
 * - VS Code: .vscode/mcp.json, `servers` (https://code.visualstudio.com/docs/agent-customization/mcp-servers)
 * - Codex: `codex mcp add` or [mcp_servers.<name>] in ~/.codex/config.toml (https://learn.chatgpt.com/docs/extend/mcp)
 * Windsurf is left out on purpose: its format has not been verified.
 */
export type SnippetBlock = { code: string; language: 'bash' | 'json' | 'toml'; caption?: string };
export type ClientSnippet = { id: string; label: string; where?: string; blocks: SnippetBlock[]; note?: string };

const q = (a: string) => (/^[A-Za-z0-9_@%+=:,./-]+$/.test(a) ? a : `'${a.replace(/'/g, `'\\''`)}'`);
const jsonOf = (o: unknown) => JSON.stringify(o, null, 2);
const tomlStr = (s: string) => JSON.stringify(s);

export function clientSnippets(spec: InstallSpec): ClientSnippet[] {
  const { name, transport } = spec; const out: ClientSnippet[] = [];
  const env = spec.env && Object.keys(spec.env).length ? spec.env : undefined;
  const stdio = transport === 'stdio';
  if (stdio && (!spec.command || !spec.args)) throw new Error(`install for ${name}: stdio needs command and args`);
  if (!stdio && !spec.url) throw new Error(`install for ${name}: http needs url`);
  const cmd = stdio ? [spec.command!, ...spec.args!].map(q).join(' ') : '';
  const envFlags = env ? Object.entries(env).map(([k, v]) => `--env ${k}=${q(v)} `).join('') : '';

  out.push({ id: 'claude-code', label: 'Claude Code', where: 'Run in a terminal',
    blocks: [{ language: 'bash', code: stdio ? `claude mcp add ${envFlags}--transport stdio ${name} -- ${cmd}` : `claude mcp add --transport http ${name} ${spec.url}` }],
    note: stdio ? 'Everything after -- is the server command. Run /mcp inside Claude Code to check it connected.' : 'Run /mcp inside Claude Code to check it connected and to sign in if the server asks.' });

  if (stdio) out.push({ id: 'claude-desktop', label: 'Claude Desktop', where: 'Settings → Developer → Edit Config (claude_desktop_config.json)',
    blocks: [{ language: 'json', code: jsonOf({ mcpServers: { [name]: { command: spec.command, args: spec.args, ...(env && { env }) } } }) }],
    note: 'Fully quit and reopen Claude Desktop after saving.' });

  out.push({ id: 'cursor', label: 'Cursor', where: '.cursor/mcp.json in a project, or ~/.cursor/mcp.json for all projects',
    blocks: [{ language: 'json', code: jsonOf({ mcpServers: { [name]: stdio ? { command: spec.command, args: spec.args, ...(env && { env }) } : { url: spec.url } } }) }] });

  out.push({ id: 'vscode', label: 'VS Code', where: '.vscode/mcp.json (note the top-level "servers" key)',
    blocks: [{ language: 'json', code: jsonOf({ servers: { [name]: stdio ? { type: 'stdio', command: spec.command, args: spec.args, ...(env && { env }) } : { type: 'http', url: spec.url } } }) }] });

  const toml = stdio
    ? [`[mcp_servers.${name}]`, `command = ${tomlStr(spec.command!)}`, `args = [${spec.args!.map(tomlStr).join(', ')}]`, ...(env ? ['', `[mcp_servers.${name}.env]`, ...Object.entries(env).map(([k, v]) => `${k} = ${tomlStr(v)}`)] : [])].join('\n')
    : [`[mcp_servers.${name}]`, `url = ${tomlStr(spec.url!)}`].join('\n');
  out.push({ id: 'codex', label: 'Codex', where: 'Run in a terminal, or edit ~/.codex/config.toml',
    blocks: [
      { language: 'bash', caption: 'CLI', code: stdio ? `codex mcp add ${name} ${env ? Object.entries(env).map(([k, v]) => `--env ${k}=${q(v)} `).join('') : ''}-- ${cmd}` : `codex mcp add ${name} --url ${spec.url}` },
      { language: 'toml', caption: 'Or in ~/.codex/config.toml', code: toml },
    ],
    note: stdio ? undefined : 'If the server uses OAuth, run codex mcp login ' + name + ' to sign in.' });
  return out;
}

/** True when the command launches npx (Windows users may need the cmd /c wrapper; see the Windows guide). */
export const usesNpx = (spec: InstallSpec) => spec.transport === 'stdio' && spec.command === 'npx';

/**
 * One-click install links (checked 2026-10-27).
 * - Cursor: cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64_ENCODED_CONFIG
 *   where the config is the JSON for one server (the value under mcpServers.<name>), base64-encoded.
 *   https://cursor.com/docs/context/mcp/install-links
 * - VS Code: vscode:mcp/install?<URL-encoded JSON of { name, ...server config }>
 *   https://code.visualstudio.com/api/extension-guides/ai/mcp (Create an MCP installation URL)
 * Links are only built when the spec has no placeholders, so the button installs exactly what the snippet shows.
 */
const PLACEHOLDER = /YOUR_|\/path\/to\/|<[^>]+>/;

/** True when any value in the spec is a placeholder the user has to replace (API keys, folder paths). */
export function hasPlaceholders(spec: InstallSpec): boolean {
  const values = [spec.url ?? '', spec.command ?? '', ...(spec.args ?? []), ...Object.values(spec.env ?? {})];
  return values.some((v) => PLACEHOLDER.test(v));
}

const validSpec = (spec: InstallSpec) =>
  /^[A-Za-z0-9_-]+$/.test(spec.name) &&
  (spec.transport === 'stdio' ? !!spec.command && Array.isArray(spec.args) : /^https:\/\//.test(spec.url ?? '')) &&
  !hasPlaceholders(spec);

/** Cursor's MCP install deeplink, or null if the spec is not safe to one-click install. */
export function cursorInstallUrl(spec: InstallSpec): string | null {
  if (!validSpec(spec)) return null;
  const env = spec.env && Object.keys(spec.env).length ? spec.env : undefined;
  const config = spec.transport === 'stdio' ? { command: spec.command, args: spec.args, ...(env && { env }) } : { url: spec.url };
  const b64 = Buffer.from(JSON.stringify(config), 'utf8').toString('base64');
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(spec.name)}&config=${encodeURIComponent(b64)}`;
}

/** VS Code's MCP install URL, or null if the spec is not safe to one-click install. */
export function vscodeInstallUrl(spec: InstallSpec): string | null {
  if (!validSpec(spec)) return null;
  const env = spec.env && Object.keys(spec.env).length ? spec.env : undefined;
  const obj = spec.transport === 'stdio'
    ? { name: spec.name, type: 'stdio', command: spec.command, args: spec.args, ...(env && { env }) }
    : { name: spec.name, type: 'http', url: spec.url };
  return `vscode:mcp/install?${encodeURIComponent(JSON.stringify(obj))}`;
}
