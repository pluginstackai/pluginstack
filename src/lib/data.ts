import fs from 'fs';
import path from 'path';
import site from '../../site.config.json';
export { site };
export type SetupStep = { text: string; code?: string; language?: string };
export type Plugin = { slug: string; name: string; category: string; tags: string[]; url: string; maker: string; what: string; who: string; setup: SetupStep[]; prompts: string[] };
/** gumroadUrl: Gumroad product link (e.g. https://<name>.gumroad.com/l/<id>). Empty = not on sale yet. */
export type Pack = { slug: string; name: string; price: number; gumroadUrl?: string; desc: string; items: string[] };
const dir = path.join(process.cwd(), 'content');
export function getPlugins(): Plugin[] {
  return fs.readdirSync(path.join(dir, 'plugins')).filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, 'plugins', f), 'utf8'))).sort((a, b) => a.name.localeCompare(b.name));
}
export const getPlugin = (slug: string) => getPlugins().find(p => p.slug === slug);
export const getPacks = (): Pack[] => JSON.parse(fs.readFileSync(path.join(dir, 'packs', 'packs.json'), 'utf8'));
