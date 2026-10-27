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
  // Search Console reported /mcp and /sse as 404s: they are example paths in our code snippets (Claude Code's /mcp command,
  // "/sse vs /mcp endpoint" text), not pages. 301 (not Next's 308 `permanent`) them to the MCP servers hub.
  async redirects() { return [
    // trailingSlash: true makes Next 308 /mcp -> /mcp/ first, so the 301 rule must match the slash form.
    { source: '/mcp/', destination: '/categories/mcp-servers/', statusCode: 301 },
    { source: '/sse/', destination: '/categories/mcp-servers/', statusCode: 301 },
  ]; },
  async headers() { return [
    { source: '/:path*', headers: SECURITY_HEADERS },
    { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    // Public machine-readable directory (read by the PluginStack MCP server): any origin may fetch it; don't index it.
    { source: '/directory.json', headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Cache-Control', value: 'public, max-age=3600' },
      { key: 'X-Robots-Tag', value: 'noindex' },
    ] },
  ]; },
};
