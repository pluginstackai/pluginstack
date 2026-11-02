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
    // More Search Console 404s from code-snippet text (plain text / script data, never <a href>):
    // `/mcp-server-dev:build-mcp-server` is a Claude Code slash command quoted in the Claude Code guide's "Building your own server?"
    // section. The colon must be escaped or path-to-regexp reads `:build` as a param. Slash form only (trailingSlash 308s first).
    { source: '/mcp-server-dev\\:build-mcp-server/', destination: '/guides/best-mcp-servers-for-claude-code/', statusCode: 301 },
    // Same URL with the colon percent-encoded (Next matches the raw path, so this needs its own rule).
    { source: '/mcp-server-dev%3Abuild-mcp-server/', destination: '/guides/best-mcp-servers-for-claude-code/', statusCode: 301 },
    // Placeholder paths from the Memory and Filesystem MCP config snippets. memory.jsonl has a file extension, so Next serves it
    // without a trailing slash (no 308 first); folder gets the usual 308 to its slash form.
    { source: '/path/to/custom/memory.jsonl', destination: '/plugins/memory-mcp/', statusCode: 301 },
    { source: '/path/to/allowed/folder/', destination: '/plugins/filesystem-mcp/', statusCode: 301 },
    // /plugins/ has no index page (only /plugins/<slug>/); the homepage is the full directory listing. Exact match only, so
    // /plugins/<slug>/ is unaffected. /plugins (no slash) gets Next's trailingSlash 308 to /plugins/ first, then this 301.
    { source: '/plugins/', destination: '/', statusCode: 301 },
    // Any other placeholder under /path/to/ (with or without a trailing slash).
    { source: '/path/to/:rest*', destination: '/guides/', statusCode: 301 },
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
