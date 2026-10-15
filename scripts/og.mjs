// Generates public/og.png (1200x630) from site.config.json. Run: node scripts/og.mjs
import { chromium } from 'playwright';
import fs from 'fs';
const site = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));
const icon = fs.readFileSync('src/app/icon.svg', 'utf8');
const html = `<html><body style="margin:0;width:1200px;height:630px;background:linear-gradient(135deg,#FFF4E8 0%,#FBD3B0 100%);font-family:system-ui,sans-serif;color:#0F2350;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box;">
<div style="display:flex;align-items:center;gap:24px"><div style="width:96px;height:96px">${icon}</div><div style="font-size:84px;font-weight:800;letter-spacing:-2px">${site.name}</div></div>
<div style="font-size:40px;color:#24396B;margin-top:36px;max-width:950px;line-height:1.25">${site.tagline}</div>
<div style="font-size:28px;color:#C9402F;font-weight:600;margin-top:36px">MCP servers · Coding agents · Rules & prompts</div></body></html>`;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html); await p.screenshot({ path: 'public/og.png' }); await b.close();
