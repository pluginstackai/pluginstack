import fs from 'fs';
import path from 'path';
import site from '../../site.config.json';
export { site };
export type SetupStep = { text: string; code?: string; language?: string };
/**
 * Verified "Install in your client" data for an MCP server (rendered by src/components/InstallInClient.tsx; snippets come from src/lib/install.ts).
 * stdio: command + args (+ env). http: url. Only add it when the values are checked against the server's official README/docs (`source`).
 */
export type InstallSpec = {
  name: string; transport: 'stdio' | 'http'; command?: string; args?: string[]; env?: Record<string, string>; url?: string;
  requires: { runtime: string; auth: string }; notes?: string[]; source: string; checked: string;
};
export type Plugin = { slug: string; name: string; category: string; tags: string[]; url: string; maker: string; what: string; who: string; setup: SetupStep[]; install?: InstallSpec; prompts: string[] };
/** gumroadUrl: Gumroad product link (e.g. https://<name>.gumroad.com/l/<id>). Empty = not on sale yet. */
export type Pack = { slug: string; name: string; price: number; gumroadUrl?: string; desc: string; items: string[] };
const dir = path.join(process.cwd(), 'content');
export function getPlugins(): Plugin[] {
  return fs.readdirSync(path.join(dir, 'plugins')).filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, 'plugins', f), 'utf8'))).sort((a, b) => a.name.localeCompare(b.name));
}
export const getPlugin = (slug: string) => getPlugins().find(p => p.slug === slug);
export const getPacks = (): Pack[] => JSON.parse(fs.readFileSync(path.join(dir, 'packs', 'packs.json'), 'utf8'));
/** "Pairs well with" mapping: content/packs/pairings.json. One pack (or none) per listing, reviewed by hand. */
export type Pairing = { pack: string | null; why?: string; reason?: string };
export function getPairedPack(slug: string): { pack: Pack; why: string } | null {
  const all: Record<string, Pairing> = JSON.parse(fs.readFileSync(path.join(dir, 'packs', 'pairings.json'), 'utf8')).pairings;
  const entry = all[slug];
  if (!entry) throw new Error(`content/packs/pairings.json has no entry for "${slug}" (use "pack": null for none)`);
  if (!entry.pack) return null;
  const pack = getPacks().find(k => k.slug === entry.pack);
  if (!pack) throw new Error(`pairings.json: unknown pack "${entry.pack}" for "${slug}"`);
  if (!entry.why?.trim()) throw new Error(`pairings.json: "${slug}" needs a "why" line`);
  // Not on sale yet (no Gumroad link): show nothing rather than a dead end.
  return pack.gumroadUrl?.trim() ? { pack, why: entry.why } : null;
}
