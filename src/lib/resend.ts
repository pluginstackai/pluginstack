// Server-only helpers for Resend (https://resend.com/docs/api-reference). Uses Segments (formerly Audiences).
import site from '../../site.config.json';
const API = 'https://api.resend.com';
/** Kill switch for ALL marketing email to subscribers (welcome emails, newsletters, offers).
 *  Paused until a physical mailing address is set (CAN-SPAM). To re-enable: set "mailingAddress"
 *  and "emailSendingEnabled": true in site.config.json, then deploy. Signups are still collected. */
export const EMAIL_SENDING_ENABLED = (site as any).emailSendingEnabled === true;
export const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'pluginstackai@gmail.com';
export const FROM = process.env.RESEND_FROM || 'PluginStack <news@pluginstackai.com>';
const key = () => process.env.RESEND_API_KEY;

async function call(path: string, init: RequestInit = {}) {
  const res = await fetch(API + path, { ...init, headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json', ...(init.headers || {}) }, cache: 'no-store' });
  let body: any = null; try { body = await res.json(); } catch {}
  return { ok: res.ok, status: res.status, body };
}
/** Create contact (ignored if it already exists), then add to the segment. */
export async function addToSegment(email: string, segmentId: string) {
  const c = await call('/contacts', { method: 'POST', body: JSON.stringify({ email, unsubscribed: false, segments: [{ id: segmentId }] }) });
  if (c.ok) return { ok: true };
  if (c.status === 401 || c.status === 403) return { ok: false, status: c.status, error: c.body?.name || 'unauthorized' };
  const s = await call(`/contacts/${encodeURIComponent(email)}/segments/${segmentId}`, { method: 'POST' });
  return s.ok ? { ok: true } : { ok: false, status: s.status, error: s.body?.name || s.body?.message || 'segment_add_failed' };
}
export async function sendEmail(to: string, subject: string, text: string, replyTo?: string, html?: string, headers?: Record<string, string>) {
  const r = await call('/emails', { method: 'POST', body: JSON.stringify({ from: FROM, to: [to], subject, text, ...(html ? { html } : {}), ...(replyTo ? { reply_to: replyTo } : {}), ...(headers ? { headers } : {}) }) });
  return r.ok ? { ok: true, id: r.body?.id } : { ok: false, status: r.status, error: r.body?.name || r.body?.message };
}
/** Use for any email to subscribers. No-op (nothing sent) while EMAIL_SENDING_ENABLED is false. */
export async function sendMarketingEmail(...args: Parameters<typeof sendEmail>) {
  if (!EMAIL_SENDING_ENABLED) return { ok: true, skipped: true, status: undefined, error: undefined };
  return sendEmail(...args);
}
/** Mark a contact unsubscribed (global contact flag, applies to all segments/broadcasts). */
export async function setUnsubscribed(email: string) {
  const r = await call(`/contacts/${encodeURIComponent(email)}`, { method: 'PATCH', body: JSON.stringify({ unsubscribed: true }) });
  if (r.ok || r.status !== 404) return r.ok ? { ok: true } : { ok: false, status: r.status, error: r.body?.name || r.body?.message };
  // Fallback: legacy audience-scoped contact path.
  const aud = process.env.RESEND_AUDIENCE_NEWSLETTER || '892fe45f-4dd8-430b-90dd-a6223d352d0d';
  const a = await call(`/audiences/${aud}/contacts/${encodeURIComponent(email)}`, { method: 'PATCH', body: JSON.stringify({ unsubscribed: true }) });
  return a.ok || a.status === 404 ? { ok: true } : { ok: false, status: a.status, error: a.body?.name || a.body?.message };
}
export const hasKey = () => !!key();

// --- validation, honeypot, rate limiting (best-effort, per serverless instance) ---
export const isEmail = (e: unknown): e is string => typeof e === 'string' && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now(); const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(ip, arr); if (hits.size > 5000) hits.clear(); return arr.length > max;
}
// cf-connecting-ip: Cloudflare Workers; x-forwarded-for / x-real-ip: Vercel and other proxies.
export const clientIp = (req: Request) => req.headers.get('cf-connecting-ip')?.trim() || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
export const clean = (s: unknown, n = 500) => (typeof s === 'string' ? s.replace(/[\r\n]+/g, ' ').trim().slice(0, n) : '');
export const json = (body: object, status = 200) => Response.json(body, { status });
export const UNAVAILABLE = "Signups are briefly unavailable — please try again soon, or email pluginstackai@gmail.com.";
