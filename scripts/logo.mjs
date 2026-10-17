// Generates public/logo.png (512x512, used as the Organization logo in JSON-LD) from src/app/icon.svg. Run: node scripts/logo.mjs
import { chromium } from 'playwright';
import fs from 'fs';
const icon = fs.readFileSync('src/app/icon.svg', 'utf8').replace('<svg ', '<svg width="512" height="512" ');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 512, height: 512 } });
await p.setContent(`<html><body style="margin:0;background:transparent">${icon}</body></html>`);
await p.screenshot({ path: 'public/logo.png', omitBackground: true }); await b.close();
