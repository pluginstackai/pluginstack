/** @type {import('next').NextConfig} */
// No `output: 'export'`: Vercel runs /api/* as serverless functions; all pages remain statically generated.
export default {
  images: { unoptimized: true }, trailingSlash: true,
  // API routes (incl. the unsubscribe confirmation page) must never be indexed.
  async headers() { return [{ source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]; },
};
