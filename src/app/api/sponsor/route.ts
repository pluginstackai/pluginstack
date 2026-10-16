import { sendEmail, hasKey, isEmail, rateLimited, clientIp, clean, json, BUSINESS_EMAIL } from '../../../lib/resend';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  let data: any = {}; try { data = await req.json(); } catch { return json({ ok: false, message: 'Invalid request.' }, 400); }
  if (data.website) return json({ ok: true, message: "Thanks! We'll reply soon." });
  if (rateLimited(clientIp(req), 3)) return json({ ok: false, message: 'Too many attempts. Please try again in a few minutes.' }, 429);
  const email = clean(data.email, 254).toLowerCase();
  if (!isEmail(email)) return json({ ok: false, message: 'Please enter a valid email address.' }, 400);
  const fallback = `Couldn't send right now. Please email ${BUSINESS_EMAIL} directly.`;
  if (!hasKey()) { console.error('[sponsor] missing env RESEND_API_KEY'); return json({ ok: false, message: fallback }, 503); }
  const company = clean(data.note);
  const r = await sendEmail(BUSINESS_EMAIL, `[PluginStack] Sponsor lead: ${company || email}`, `Email: ${email}\nCompany / tool: ${company || '(not given)'}\nSubmitted: ${new Date().toISOString()}`, email);
  if (!r.ok) { console.error('[sponsor] resend error', r.status, r.error); return json({ ok: false, message: fallback }, 502); }
  return json({ ok: true, message: "Thanks! We'll reply soon." });
}
