import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:3000';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
async function shot(name, url, theme, opts = { viewport: { width: 1280, height: 800 } }) {
  const ctx = await b.newContext({ ...opts, colorScheme: 'light' });
  await ctx.addInitScript(t => localStorage.setItem('ps_theme', t), theme);
  const pg = await ctx.newPage(); await pg.goto(base + url, { waitUntil: 'networkidle' });
  await pg.screenshot({ path: `screenshots/${name}.png`, fullPage: true }); await ctx.close();
}
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
await shot('home-light', '/', 'light');
await shot('home-dark', '/', 'dark');
await shot('plugin-github-mcp-server-light', '/plugins/github-mcp-server/', 'light');
await shot('packs-light', '/packs/', 'light');
await shot('home-mobile-light', '/', 'light', mobile);
await b.close();
