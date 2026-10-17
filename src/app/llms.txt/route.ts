import { getPlugins, site } from '../../lib/data';
import { getCategories } from '../../lib/seo';
export const dynamic = 'force-static';
export function GET() {
  const body = `# ${site.name}\n\n> ${site.tagline}\n\n## Plugins\n` + getPlugins().map(p => `- [${p.name}](${site.url}/plugins/${p.slug}/): ${p.what}`).join('\n') +
    `\n\n## Categories\n` + getCategories().map(c => `- [${c.name}](${site.url}${c.path}): ${c.intro}`).join('\n') +
    `\n\n## Pages\n- [Packs](${site.url}/packs/): prompt and rules packs\n- [Get unstuck](${site.url}/get-unstuck/): app rescue waitlist\n- [Sponsor](${site.url}/sponsor/)\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
