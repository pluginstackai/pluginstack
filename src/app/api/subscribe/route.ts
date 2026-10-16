import { addToSegment, sendEmail, hasKey, isEmail, rateLimited, clientIp, clean, json, UNAVAILABLE, BUSINESS_EMAIL } from '../../../lib/resend';
export const dynamic = 'force-dynamic';
const SEGMENTS = { newsletter: 'RESEND_AUDIENCE_NEWSLETTER', waitlist: 'RESEND_AUDIENCE_WAITLIST' } as const;

export async function POST(req: Request) {
  let data: any = {}; try { data = await req.json(); } catch { return json({ ok: false, message: 'Invalid request.' }, 400); }
  if (data.website) return json({ ok: true, message: "You're on the list. Thanks!" }); // honeypot: pretend success
  if (rateLimited(clientIp(req))) return json({ ok: false, message: 'Too many attempts. Please try again in a few minutes.' }, 429);
  const email = clean(data.email, 254).toLowerCase();
  if (!isEmail(email)) return json({ ok: false, message: 'Please enter a valid email address.' }, 400);
  const list = data.list === 'waitlist' ? 'waitlist' : 'newsletter';
  const segmentId = process.env[SEGMENTS[list]];
  if (!hasKey() || !segmentId) { console.error(`[subscribe] missing env: ${!hasKey() ? 'RESEND_API_KEY ' : ''}${!segmentId ? SEGMENTS[list] : ''}`); return json({ ok: false, message: UNAVAILABLE }, 503); }
  const r = await addToSegment(email, segmentId);
  if (!r.ok) { console.error('[subscribe] resend error', r.status, r.error); return json({ ok: false, message: UNAVAILABLE }, 502); }
  if (list === 'waitlist') {
    const note = clean(data.note);
    await sendEmail(BUSINESS_EMAIL, `[PluginStack] New Get-unstuck waitlist signup: ${email}`, `Email: ${email}\nWhat's broken: ${note || '(not given)'}`, email);
  }
  return json({ ok: true, message: list === 'waitlist' ? "You're on the waitlist. We'll be in touch!" : "You're subscribed. Thanks!" });
}
