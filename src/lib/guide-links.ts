/**
 * Internal links between listings (/plugins/<slug>/) and guides (/guides/<slug>/).
 *
 * Relevance is data-driven, not hand-picked per page:
 * - GUIDE_TOPICS gives every guide a role (setup / fix / explainer / learn) and topic tags.
 * - A listing gets tags from its own data: MCP server or not, install transport and launcher (npx/uvx),
 *   whether its remote server signs in with OAuth, reference-server tag, skills/rules/plugins tags,
 *   and which clients its setup steps name (Cursor, VS Code, Claude Desktop, Claude Code, Codex).
 * - A guide also counts as relevant when it already features the listing ("Tools in this guide") or,
 *   for MCP servers, uses it as a worked example in its body.
 * Listings show at most 3 guides (max 2 setup, 1 fix, 1 explainer); explicit `guides` in a listing's JSON
 * always come first. A listing with no match shows no block.
 */
import type { Plugin } from './data.ts';
import { GUIDES, type Guide } from './guides.ts';

export type GuideRole = 'setup' | 'fix' | 'explainer' | 'learn';
type GuideTopic = {
  role: GuideRole; tags: string[];
  /** An MCP-server listing only gets this guide when it has all of these tags (e.g. the npx fix only for npx servers). */
  requires?: string[];
  /** Hand-picked related guides (used instead of the computed ones). */
  relatedGuides?: string[];
};

/** One entry per guide. The build fails if a guide is missing here (see guideTopic). */
export const GUIDE_TOPICS: Record<string, GuideTopic> = {
  'add-mcp-server-to-cursor': { role: 'setup', tags: ['mcp', 'mcp:stdio', 'client:cursor'] },
  'add-mcp-server-to-vs-code': { role: 'setup', tags: ['mcp', 'mcp:stdio', 'client:vscode'] },
  // Claude Desktop's config file only runs local servers (remote ones go through connectors).
  'add-mcp-server-to-claude-desktop': { role: 'setup', tags: ['mcp', 'mcp:stdio', 'client:claude-desktop'], requires: ['mcp:stdio'] },
  'add-mcp-server-to-codex-config-toml': { role: 'setup', tags: ['mcp', 'mcp:stdio', 'client:codex'] },
  'best-mcp-servers-for-claude-code': { role: 'setup', tags: ['mcp', 'client:claude-code'] },
  // The guide says uvx/python servers don't need cmd /c, so it is npx-only.
  'fix-spawn-npx-enoent-windows-mcp': { role: 'fix', tags: ['mcp', 'mcp:stdio', 'mcp:npx'], requires: ['mcp:npx'] },
  'fix-mcp-error-32000-connection-closed': { role: 'fix', tags: ['mcp', 'mcp:stdio'], requires: ['mcp:stdio'] },
  'fix-claude-code-mcp-needs-authentication': { role: 'fix', tags: ['mcp', 'mcp:oauth', 'client:claude-code'], requires: ['mcp:oauth'] },
  'mcp-reference-servers-v2-whats-changed': { role: 'explainer', tags: ['mcp', 'mcp:stdio', 'mcp:reference-server'], requires: ['mcp:reference-server'] },
  'install-claude-code-plugins': { role: 'setup', tags: ['plugins', 'client:claude-code'] },
  'how-to-create-agent-skills': { role: 'setup', tags: ['skills', 'rules', 'client:claude-code', 'client:cursor', 'client:codex'] },
  'cursor-rules-vs-agents-md': { role: 'explainer', tags: ['rules', 'client:cursor', 'client:codex', 'client:claude-code'] },
  // One-server setup guides: no client tags, so they attach only to their own listing (via `related` / the listing's `guides`).
  'context7-mcp-setup': { role: 'setup', tags: ['mcp'], relatedGuides: ['add-mcp-server-to-cursor', 'add-mcp-server-to-vs-code', 'add-mcp-server-to-codex-config-toml', 'best-mcp-servers-for-claude-code'] },
  'cloudflare-mcp-server-setup': { role: 'setup', tags: ['mcp'], relatedGuides: ['best-mcp-servers-for-claude-code', 'fix-claude-code-mcp-needs-authentication', 'add-mcp-server-to-cursor', 'context7-mcp-setup'] },
  'filesystem-mcp-server-setup': { role: 'setup', tags: ['mcp'], relatedGuides: ['mcp-reference-servers-v2-whats-changed', 'add-mcp-server-to-claude-desktop', 'fix-mcp-error-32000-connection-closed', 'add-mcp-server-to-cursor'] },
  'apify-mcp-server-setup': { role: 'setup', tags: ['mcp'], relatedGuides: ['best-mcp-servers-for-claude-code', 'add-mcp-server-to-cursor', 'add-mcp-server-to-codex-config-toml', 'firecrawl-mcp-server-setup'] },
  'firecrawl-mcp-server-setup': { role: 'setup', tags: ['mcp'], relatedGuides: ['add-mcp-server-to-cursor', 'best-mcp-servers-for-claude-code', 'add-mcp-server-to-codex-config-toml', 'apify-mcp-server-setup'] },
  'memory-mcp-server-setup': { role: 'setup', tags: ['mcp'], relatedGuides: ['add-mcp-server-to-claude-desktop', 'best-mcp-servers-for-claude-code', 'fix-spawn-npx-enoent-windows-mcp', 'add-mcp-server-to-cursor'] },
  'exa-mcp-server-setup': { role: 'setup', tags: ['mcp'], relatedGuides: ['best-mcp-servers-for-claude-code', 'add-mcp-server-to-cursor', 'add-mcp-server-to-codex-config-toml', 'firecrawl-mcp-server-setup'] },
  'openai-agents-sdk-python-tutorial': { role: 'setup', tags: ['mcp'], relatedGuides: ['filesystem-mcp-server-setup', 'best-mcp-servers-for-claude-code', 'how-to-create-agent-skills'] },
  'free-ai-courses': { role: 'learn', tags: ['learn'], relatedGuides: ['best-mcp-servers-for-claude-code', 'add-mcp-server-to-cursor', 'how-to-create-agent-skills'] },
};

/** Listings that are themselves a client: they link to that client's guides. */
const CLIENT_LISTINGS: Record<string, string> = { 'claude-code': 'client:claude-code', 'codex-cli': 'client:codex', 'cursor-rules': 'client:cursor', 'cursor-plugins': 'client:cursor' };
const CLIENT_NAMES: [RegExp, string][] = [
  [/\bcursor\b/i, 'client:cursor'], [/\bvs ?code\b/i, 'client:vscode'], [/\bclaude desktop\b/i, 'client:claude-desktop'],
  [/\bclaude code\b|\bclaude mcp add\b/i, 'client:claude-code'], [/\bcodex\b/i, 'client:codex'],
];
/** Guides a listing must never link to, with the reason. */
const LISTING_EXCLUDE: Record<string, string[]> = {
  // The plugins guide features Serena only to say its maintainers ask you NOT to install it from the marketplace.
  serena: ['install-claude-code-plugins'],
};
/** Specific tags (one shared = strong signal). Broad ones like `mcp` or a client only matter alongside them. */
const SPECIFIC = new Set(['mcp:npx', 'mcp:oauth', 'mcp:reference-server', 'plugins', 'skills', 'rules']);

export function guideTopic(slug: string): GuideTopic {
  const t = GUIDE_TOPICS[slug];
  if (!t) throw new Error(`src/lib/guide-links.ts: add "${slug}" to GUIDE_TOPICS`);
  return t;
}

/** MCP servers (incl. Game Dev ones tagged `mcp`). MCP Dev Tools (Inspector, FastMCP) are for building servers, so they only get guides that feature them. */
const isMcpServer = (p: Plugin) => p.category === 'MCP Servers' || !!p.install || (p.tags.includes('mcp') && p.category !== 'MCP Dev Tools');
const bodyLinks = (g: Guide) => new Set([...JSON.stringify(g.blocks).matchAll(/\/plugins\/([a-z0-9-]+)\//g)].map(m => m[1]));

/** Tags derived from a listing's own data. */
export function listingTags(p: Plugin): Set<string> {
  const t = new Set<string>();
  const setup = p.setup.map(s => `${s.text}\n${s.code ?? ''}`).join('\n');
  if (isMcpServer(p)) {
    t.add('mcp');
    const cliAdd = setup.match(/\bclaude mcp add\b(?![^\n]*--transport (?:http|sse))[^\n]*?\s(npx|uvx|docker|[a-z][\w.-]*)\s+[@\w-]/);
    const stdio = p.install ? p.install.transport === 'stdio' : /"command"\s*:/.test(setup) || !!cliAdd;
    const cmd = p.install?.command ?? setup.match(/"command"\s*:\s*"([^"]+)"/)?.[1] ?? cliAdd?.[1] ?? '';
    if (stdio) t.add('mcp:stdio');
    if (stdio && cmd === 'npx') t.add('mcp:npx');
    if (p.install?.transport === 'http' && /oauth|sign-in|login/i.test(p.install.requires.auth)) t.add('mcp:oauth');
    if (p.tags.includes('reference-server')) t.add('mcp:reference-server');
    // Every verified install spec renders Cursor, VS Code, Claude Code and Codex snippets (Claude Desktop for stdio only).
    if (p.install) ['client:cursor', 'client:vscode', 'client:claude-code', 'client:codex', ...(stdio ? ['client:claude-desktop'] : [])].forEach(c => t.add(c));
    else CLIENT_NAMES.forEach(([re, c]) => re.test(setup) && t.add(c));
  }
  if (p.tags.some(x => x === 'skills' || x === 'agent-skills')) t.add('skills');
  if (p.tags.includes('rules')) t.add('rules');
  if (p.tags.includes('plugins')) t.add('plugins');
  if (CLIENT_LISTINGS[p.slug]) t.add(CLIENT_LISTINGS[p.slug]);
  return t;
}

function scoreListing(g: Guide, p: Plugin, tags: Set<string>): number {
  const topic = guideTopic(g.slug);
  if (topic.role === 'learn') return 0;
  const mcp = tags.has('mcp');
  if (LISTING_EXCLUDE[p.slug]?.includes(g.slug)) return 0;
  // A guide that features the listing ("Tools in this guide") is relevant even if the listing's data can't show the trait.
  if (mcp && !g.related.includes(p.slug) && topic.requires?.some(t => !tags.has(t))) return 0;
  const client = CLIENT_LISTINGS[p.slug];
  let s = 0;
  if (g.related.includes(p.slug)) s += 40;
  if (bodyLinks(g).has(p.slug)) s += 15;
  s += topic.tags.filter(x => SPECIFIC.has(x) && tags.has(x)).length * 40;
  // A client listing links to the guides written for that client.
  if (client && topic.tags.includes(client)) s += 35;
  // MCP server: setup guides for the clients it supports; a fix that matches how it runs.
  if (mcp && topic.tags.includes('mcp')) {
    if (topic.role === 'setup' && topic.tags.some(c => c.startsWith('client:') && tags.has(c))) s += 20 + (g.slug === 'add-mcp-server-to-cursor' ? 5 : 0);
    if (topic.role === 'fix' && topic.requires) s += 30;
  }
  return s;
}

const CAPS: Record<GuideRole, number> = { setup: 2, fix: 1, explainer: 1, learn: 0 };
const MIN_SCORE = 20;

/** 0-3 guides for a listing's "Set it up / Fixes" block. */
export function guidesForListing(p: Plugin): { guide: Guide; role: GuideRole }[] {
  const explicit = (p.guides ?? []).map(slug => { const g = GUIDES.find(x => x.slug === slug); if (!g) throw new Error(`${p.slug}: unknown guide "${slug}"`); return g; });
  const tags = listingTags(p);
  const scored = GUIDES.filter(g => !explicit.includes(g)).map(g => ({ g, s: scoreListing(g, p, tags) }))
    .filter(x => x.s >= MIN_SCORE).sort((a, b) => b.s - a.s || GUIDES.indexOf(a.g) - GUIDES.indexOf(b.g));
  const out = explicit.slice(0, 3);
  const used: Record<GuideRole, number> = { setup: 0, fix: 0, explainer: 0, learn: 0 };
  out.forEach(g => used[guideTopic(g.slug).role]++);
  for (const { g } of scored) {
    if (out.length >= 3) break;
    const role = guideTopic(g.slug).role;
    if (used[role] >= CAPS[role]) continue;
    used[role]++; out.push(g);
  }
  const order: GuideRole[] = ['setup', 'fix', 'explainer', 'learn'];
  return out.map(guide => ({ guide, role: guideTopic(guide.slug).role }))
    .sort((a, b) => (explicit.includes(a.guide) ? -1 : 0) - (explicit.includes(b.guide) ? -1 : 0) || order.indexOf(a.role) - order.indexOf(b.role));
}

/** 2-4 related guides for a guide page: shared specific tags, shared clients, shared listings and direct links. */
export function relatedGuides(g: Guide): Guide[] {
  const topic = guideTopic(g.slug);
  if (topic.relatedGuides) return topic.relatedGuides.map(s => { const x = GUIDES.find(y => y.slug === s); if (!x) throw new Error(`${g.slug}: unknown related guide "${s}"`); return x; });
  const text = JSON.stringify(g.blocks) + g.intro;
  const scored = GUIDES.filter(o => o !== g && guideTopic(o.slug).role !== 'learn').map(o => {
    const ot = guideTopic(o.slug);
    const shared = topic.tags.filter(t => ot.tags.includes(t));
    let s = shared.filter(t => SPECIFIC.has(t) || t === 'mcp:stdio').length * 3 + shared.filter(t => t.startsWith('client:')).length * 2 + (shared.includes('mcp') ? 1 : 0);
    s += g.related.filter(x => o.related.includes(x)).length * 0.5;
    if (text.includes(`/guides/${o.slug}/`)) s += 3;
    if ((JSON.stringify(o.blocks) + o.intro).includes(`/guides/${g.slug}/`)) s += 2;
    // Setup guides point to a fix, and fixes point back to setup, so readers can move between them.
    if (topic.role !== ot.role && shared.includes('mcp')) s += 1;
    return { o, s };
  }).filter(x => x.s >= 3).sort((a, b) => b.s - a.s || GUIDES.indexOf(a.o) - GUIDES.indexOf(b.o));
  return scored.slice(0, 4).map(x => x.o);
}
