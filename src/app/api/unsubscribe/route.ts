import { verifyToken } from '../../../lib/unsubscribe';
import { setUnsubscribed, hasKey } from '../../../lib/resend';
import { site } from '../../../lib/data';
export const dynamic = 'force-dynamic';

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const page = (title: string, body: string, status = 200) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)} | ${site.name}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:60px auto;padding:0 20px;color:#0F2350;line-height:1.6">
<p style="font-weight:700;font-size:20px">Plugin<span style="color:#F26B5B">Stack</span></p><h1 style="font-size:24px">${esc(title)}</h1>${body}
<p style="margin-top:32px;font-size:14px"><a href="${site.url}/" style="color:#F26B5B">Back to ${site.name}</a> · <a href="${site.url}/privacy/" style="color:#F26B5B">Privacy</a></p></body></html>`,
  { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });

// GET: confirmation page (no change on GET, so link scanners can't unsubscribe people by accident).
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  const email = verifyToken(token);
  if (!email) return page('Invalid unsubscribe link', `<p>This link is invalid or incomplete. Email <a href="mailto:${site.contactEmail}">${site.contactEmail}</a> and we'll remove you by hand.</p>`, 400);
  return page('Unsubscribe from PluginStack emails?', `<p>This will stop PluginStack emails to <b>${esc(email)}</b>.</p>
<form method="post" action="/api/unsubscribe/?token=${encodeURIComponent(token!)}"><button type="submit" style="background:#F26B5B;color:#fff;border:0;border-radius:6px;padding:10px 18px;font-size:16px;font-weight:700;cursor:pointer">Unsubscribe</button></form>`);
}

// POST: performs the unsubscribe. Handles the confirmation form and RFC 8058 one-click (List-Unsubscribe=One-Click).
export async function POST(req: Request) {
  const url = new URL(req.url);
  let token = url.searchParams.get('token');
  if (!token) { try { const f = await req.formData(); token = (f.get('token') as string) || null; } catch {} }
  const email = verifyToken(token);
  const oneClick = !(req.headers.get('accept') || '').includes('text/html');
  if (!email) return oneClick ? Response.json({ ok: false, error: 'invalid_token' }, { status: 400 }) : page('Invalid unsubscribe link', '<p>This link is invalid.</p>', 400);
  if (!hasKey()) { console.error('[unsubscribe] missing RESEND_API_KEY'); return oneClick ? Response.json({ ok: false }, { status: 503 }) : page('Something went wrong', `<p>Please email <a href="mailto:${site.contactEmail}">${site.contactEmail}</a> and we'll remove you.</p>`, 503); }
  const r = await setUnsubscribed(email);
  if (!r.ok) { console.error('[unsubscribe] resend error', r.status, r.error); return oneClick ? Response.json({ ok: false }, { status: 502 }) : page('Something went wrong', `<p>Please try again, or email <a href="mailto:${site.contactEmail}">${site.contactEmail}</a> and we'll remove you.</p>`, 502); }
  return oneClick ? Response.json({ ok: true }) : page("You're unsubscribed", `<p><b>${esc(email)}</b> won't get any more PluginStack emails. Changed your mind? You can sign up again on the site anytime.</p>`);
}
