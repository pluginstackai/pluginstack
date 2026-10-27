// Export guides (src/lib/guides.ts) to markdown for review: node scripts/guides-md.mjs [outDir]
// Needs Node 22.18+ (built-in TypeScript type stripping).
import fs from 'fs';
import path from 'path';
import { GUIDES } from '../src/lib/guides.ts';
const site = JSON.parse(fs.readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
const out = process.argv[2] || 'guides-md';
fs.mkdirSync(out, { recursive: true });
const abs = t => t.replace(/\]\((\/[^)]*)\)/g, (_, p) => `](${site.url}${p})`);
for (const g of GUIDES) {
  const md = [`---`, `title: "${g.title}"`, `description: "${g.description}"`, `url: ${site.url}/guides/${g.slug}/`, `published: ${g.published}`, `updated: ${g.updated}`, `---`, '', `# ${g.h1}`, '', abs(g.intro), ''];
  for (const b of g.blocks) {
    if ('h2' in b) md.push(`## ${b.h2}`, '');
    else if ('h3' in b) md.push(`### ${b.h3}`, '');
    else if ('p' in b) md.push(abs(b.p), '');
    else if ('note' in b) md.push(`> ${abs(b.note)}`, '');
    else if ('ul' in b) md.push(...b.ul.map(t => `- ${abs(t)}`), '');
    else if ('ol' in b) md.push(...b.ol.map((t, i) => `${i + 1}. ${abs(t)}`), '');
    else if ('code' in b) md.push(...(b.caption ? [`_${b.caption}_`, ''] : []), '```' + b.lang, b.code, '```', '');
  }
  md.push('## Sources', '', ...g.sources.map(s => `- [${s.label}](${s.url})`), '', ...(g.related.length ? ['## Tools in this guide', '', ...g.related.map(s => `- ${site.url}/plugins/${s}/`), ''] : []));
  fs.writeFileSync(path.join(out, `${g.slug}.md`), md.join('\n'));
  console.log('wrote', path.join(out, `${g.slug}.md`));
}
