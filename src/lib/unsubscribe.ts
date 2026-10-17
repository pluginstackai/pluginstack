// Signed unsubscribe tokens. Token = base64url(email) + "." + base64url(HMAC-SHA256(email)).
// Secret: UNSUBSCRIBE_SECRET if set, otherwise derived from RESEND_API_KEY (so no extra Vercel env var is required).
import { createHmac, createHash, timingSafeEqual } from 'crypto';
import { site } from './data';

function secret() {
  const s = process.env.UNSUBSCRIBE_SECRET;
  if (s) return s;
  const k = process.env.RESEND_API_KEY;
  if (!k) throw new Error('No UNSUBSCRIBE_SECRET or RESEND_API_KEY');
  return createHash('sha256').update('pluginstack-unsubscribe-v1:' + k).digest('hex');
}
const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url');
const sig = (email: string) => createHmac('sha256', secret()).update(email.toLowerCase()).digest();

export const makeToken = (email: string) => `${b64(email.toLowerCase())}.${b64(sig(email))}`;
export function verifyToken(token: string | null | undefined): string | null {
  if (!token || typeof token !== 'string') return null;
  const [e, s] = token.split('.');
  if (!e || !s) return null;
  let email: string; let given: Buffer;
  try { email = Buffer.from(e, 'base64url').toString('utf8'); given = Buffer.from(s, 'base64url'); } catch { return null; }
  const want = sig(email);
  return given.length === want.length && timingSafeEqual(given, want) ? email : null;
}
// Trailing slash matches next.config trailingSlash, so one-click POSTs aren't redirected.
export const unsubscribeUrl = (email: string) => `${site.url}/api/unsubscribe/?token=${encodeURIComponent(makeToken(email))}`;
