import type { Metadata } from 'next';
import { getPlugins, site, type Plugin } from './data';

/** Plugin plus the optional `updated` (YYYY-MM-DD, last checked against official docs). */
/** Official demo video on YouTube, embedded click-to-load via youtube-nocookie.com. See content/SCHEMA.md for the rules. */
export type DemoVideo = { youtubeId: string; title: string; channel: string; channelUrl: string };
/** demo: optional official YouTube demo. Listings without one render no demo section. */
export type ListedPlugin = Plugin & { updated?: string; demo?: DemoVideo };
export const plugins = (): ListedPlugin[] => getPlugins();

export const absUrl = (path: string) => new URL(path, site.url).toString();
export const TWITTER = '@PluginStackAI';
export const DEFAULT_OG = { url: '/og.png', width: 1200, height: 630, alt: `${site.name}: AI plugins, MCP servers and agent tools, explained` };

/** Cut text to a meta-description length at a sentence or word boundary. */
export function summarize(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const dot = cut.lastIndexOf('. ');
  if (dot > max * 0.55) return cut.slice(0, dot + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '') + '…';
}

/** Page metadata with canonical, Open Graph and Twitter tags. `path` must be the served path (trailing slash). */
export function pageMeta({ title, description, path, absoluteTitle, image }: { title: string; description: string; path: string; absoluteTitle?: boolean; image?: { url: string; alt: string } }): Metadata {
  const img = image ? { ...image, width: 1200, height: 630 } : DEFAULT_OG;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, type: 'website', locale: 'en_US', images: [img] },
    twitter: { card: 'summary_large_image', site: TWITTER, title, description, images: [{ url: img.url, alt: img.alt }] },
  };
}

const CATEGORY_INFO: Record<string, string> = {
  'MCP Servers': 'Model Context Protocol (MCP) servers that connect AI agents to apps, data and the web, from GitHub and Stripe to web search and browsers.',
  'MCP Dev Tools': 'Frameworks and tools for building, testing and debugging your own MCP servers.',
  'Coding Agents': 'AI agents that read, edit and run code for you in the terminal, a desktop app or the browser.',
  'Editor Extensions': 'AI coding agents that run inside VS Code, JetBrains IDEs and other editors.',
  'Agent Frameworks': 'Libraries and SDKs for building your own AI agents and multi-agent workflows in Python or TypeScript.',
  'Vibe Coding': 'AI app builders that turn a prompt into a working web or desktop app.',
  'Game Dev': 'AI tools and MCP bridges for game engines and 3D software such as Unity, Godot and Blender.',
  'Rules & Prompts': 'Instruction files, rules and skills that tell AI agents how to work in your project.',
};
export const categorySlug = (name: string) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const categoryPath = (name: string) => `/categories/${categorySlug(name)}/`;
export function getCategories() {
  const all = plugins(); const names = Array.from(new Set(all.map(p => p.category))).sort((a, b) => a.localeCompare(b));
  return names.map(name => {
    const items = all.filter(p => p.category === name);
    return { name, slug: categorySlug(name), path: categoryPath(name), intro: CATEGORY_INFO[name] ?? `AI tools in the ${name} category.`, items, updated: latest(items) };
  });
}
export const getCategory = (slug: string) => getCategories().find(c => c.slug === slug);
export const latest = (items: ListedPlugin[]) => items.map(p => p.updated).filter(Boolean).sort().pop();

/** Last significant content change for static pages (update when you change a page's content). */
export const PAGE_UPDATED: Record<string, string> = {
  '/packs/': '2026-10-19', '/get-unstuck/': '2026-10-16', '/sponsor/': '2026-10-18',
  '/privacy/': '2026-10-19', '/terms/': '2026-10-19', '/disclosures/': '2026-10-16',
};

export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;
export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absUrl(it.path) })),
});
/** Serialize JSON-LD safely for a <script> tag. */
export const ldJson = (data: object) => JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c');
