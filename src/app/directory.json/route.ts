import { site } from '../../lib/data';
import { plugins, getCategories, categoryPath } from '../../lib/seo';
import { GUIDES, guidePath, type Guide } from '../../lib/guides';
import { clientSnippets } from '../../lib/install';

/**
 * Machine-readable copy of the public directory (listings, categories, guides), built at deploy time.
 * Read by the PluginStack MCP server (github.com/pluginstackai/pluginstack-mcp). Only public page content is included.
 * Bump DIRECTORY_SCHEMA when a field is removed or renamed (adding fields is fine).
 */
export const dynamic = 'force-static';
const DIRECTORY_SCHEMA = 1;

const abs = (t: string) => t.replace(/\]\((\/[^)]*)\)/g, (_, p) => `](${site.url}${p})`);

/** Same markdown shape as scripts/guides-md.mjs (site-only blocks like the signup card are skipped). */
function guideMarkdown(g: Guide): string {
  const md: string[] = [abs(g.intro), ''];
  for (const b of g.blocks) {
    if ('h2' in b) md.push(`## ${b.h2}`, '');
    else if ('h3' in b) md.push(`### ${b.h3}`, '');
    else if ('p' in b) md.push(abs(b.p), '');
    else if ('note' in b) md.push(`> ${abs(b.note)}`, '');
    else if ('ul' in b) md.push(...b.ul.map(t => `- ${abs(t)}`), '');
    else if ('ol' in b) md.push(...b.ol.map((t, i) => `${i + 1}. ${abs(t)}`), '');
    else if ('code' in b) md.push(...(b.caption ? [`_${b.caption}_`, ''] : []), '```' + b.lang, b.code, '```', '');
  }
  return md.join('\n').trim();
}

export function GET() {
  const all = plugins();
  const body = {
    schema: DIRECTORY_SCHEMA,
    generated: new Date().toISOString(),
    site: { name: site.name, url: site.url, tagline: site.tagline, contact: site.contactEmail },
    license: 'Listing text is PluginStack editorial content; link back to the pluginstackai.com page when you reuse it.',
    categories: getCategories().map(c => ({ name: c.name, slug: c.slug, url: `${site.url}${c.path}`, intro: c.intro, count: c.items.length, updated: c.updated ?? null })),
    tools: all.map(p => ({
      slug: p.slug, name: p.name, category: p.category, categoryUrl: `${site.url}${categoryPath(p.category)}`,
      tags: p.tags, maker: p.maker, sourceUrl: p.url, url: `${site.url}/plugins/${p.slug}/`, updated: p.updated ?? null,
      what: p.what, who: p.who, setup: p.setup, prompts: p.prompts,
      install: p.install ? { ...p.install, clients: clientSnippets(p.install) } : null,
      sections: p.sections ?? [], faq: p.faq ?? [],
      guides: (p.guides ?? []).map(slug => ({ slug, url: `${site.url}${guidePath(slug)}` })),
    })),
    guides: GUIDES.map(g => ({
      slug: g.slug, title: g.h1, seoTitle: g.title, description: g.description, kind: g.kind ?? 'Setup guide',
      url: `${site.url}${guidePath(g.slug)}`, published: g.published, updated: g.updated,
      markdown: guideMarkdown(g), sources: g.sources,
      related: g.related.map(slug => ({ slug, url: `${site.url}/plugins/${slug}/` })),
    })),
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
