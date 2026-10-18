/** @type {import('next').NextConfig} */
// No `output: 'export'`: Vercel runs /api/* as serverless functions; all pages remain statically generated.
const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];
export default {
  images: { unoptimized: true }, trailingSlash: true,
  // API routes (incl. the unsubscribe confirmation page) must never be indexed.
  // Safe site-wide security headers (no CSP, so the Gumroad overlay and inline theme script keep working).
  async headers() { return [
    { source: '/:path*', headers: SECURITY_HEADERS },
    { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ]; },
};
