import { ImageResponse } from 'next/og';
import { getPlugin, getPlugins, site } from '../../../lib/data';
const size = { width: 1200, height: 630 };
export const dynamic = 'force-static';
export const dynamicParams = false;
// Served at /og/<slug>.png (a file-like path, so the trailingSlash redirect doesn't apply).
export const generateStaticParams = () => getPlugins().map(p => ({ file: `${p.slug}.png` }));
// Text-only card (no third-party logos): listing name, category and maker on the site's colors.
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const p = getPlugin((await params).file.replace(/\.png$/, ''));
  const name = p?.name ?? site.name;
  return new ImageResponse(
    (<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 90px', background: 'linear-gradient(135deg,#FFF4E8 0%,#FBD3B0 100%)', color: '#0F2350' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 800 }}>
        <div style={{ display: 'flex', width: 64, height: 64, borderRadius: 14, background: '#0F2350', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
          <svg width="44" height="44" viewBox="0 0 64 64"><path d="M36 8 16 36h14l-4 20 22-30H34z" fill="#F26B5B" /></svg></div>{site.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 30, color: '#C9402F', fontWeight: 700 }}>{p ? `${p.category} · by ${p.maker}` : ''}</div>
        <div style={{ fontSize: name.length > 28 ? 72 : 88, fontWeight: 800, lineHeight: 1.05, marginTop: 12 }}>{name}</div>
      </div>
      <div style={{ fontSize: 30, color: '#24396B' }}>What it does, who it's for and how to set it up</div>
    </div>), size);
}
