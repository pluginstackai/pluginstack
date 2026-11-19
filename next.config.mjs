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
  async redirects() {
    /** Literal path: 301 both slash and no-slash forms so trailingSlash does not 308 first (one hop).
     *  Literal colons are escaped for path-to-regexp, and a %3A variant is added because Next matches the raw path. */
    const literal = (source, destination) => {
      const base = source.replace(/\/$/, '');
      const forms = [base, `${base}/`];
      const sources = [];
      for (const v of forms) {
        sources.push(v.replace(/:/g, '\\:'));
        if (v.includes(':')) sources.push(v.replace(/:/g, '%3A'));
      }
      return [...new Set(sources)].map((s) => ({ source: s, destination, statusCode: 301 }));
    };
    return [
      // Search Console 404s from code-snippet and slash-command text (usually not <a href>).
      // /mcp and /sse are example endpoint/command paths; send both slash forms in one hop.
      ...literal('/mcp', '/categories/mcp-servers/'),
      ...literal('/sse', '/categories/mcp-servers/'),
      // Claude Code slash command quoted in the Claude Code guide ("Building your own server?").
      ...literal('/mcp-server-dev:build-mcp-server', '/guides/best-mcp-servers-for-claude-code/'),
      // Placeholder paths from Memory and Filesystem MCP snippets. memory.jsonl has a file extension, so
      // Next may serve it without a trailing slash; we still list both forms. Destination for the folder
      // path is the setup guide (Search Console follow-up), not the listing.
      ...literal('/path/to/custom/memory.jsonl', '/plugins/memory-mcp/'),
      ...literal('/path/to/allowed/folder', '/guides/filesystem-mcp-server-setup/'),
      // Any other placeholder under /path/to/ (with or without a trailing slash).
      { source: '/path/to/:rest*', destination: '/guides/', statusCode: 301 },
      // /plugins/ has no index page (only /plugins/<slug>/); the homepage is the full directory listing.
      // Exact match only, so /plugins/<slug>/ is unaffected. Both slash forms, one hop.
      ...literal('/plugins', '/'),
      // Search Console 2026-11: more snippet/slash-command paths that 308'd then 404'd.
      // /plugin (not /plugins/<slug>/) would otherwise 308 to /plugin/ then 404. Destination is `/`
      // (the directory) rather than /plugins/, which itself 301s to `/`.
      ...literal('/plugin', '/'),
      ...literal('/speckit-bug-assess', '/plugins/spec-kit/'),
      // Other Spec Kit slash commands on the same listing (specify, plan, implement, …).
      { source: '/speckit-:cmd', destination: '/plugins/spec-kit/', statusCode: 301 },
      { source: '/speckit-:cmd/', destination: '/plugins/spec-kit/', statusCode: 301 },
      ...literal('/projects', '/guides/filesystem-mcp-server-setup/'),
      { source: '/projects/:rest*', destination: '/guides/filesystem-mcp-server-setup/', statusCode: 301 },
      ...literal('/reload-plugins', '/guides/install-claude-code-plugins/'),
      ...literal('/commit-commands:commit', '/guides/install-claude-code-plugins/'),
      ...literal('/sales:call-prep', '/plugins/knowledge-work-plugins/'),
      ...literal('/data:write-query', '/plugins/knowledge-work-plugins/'),
      ...literal('/Users/username/Downloads', '/guides/add-mcp-server-to-claude-desktop/'),
      ...literal('/Users/username/Desktop', '/guides/add-mcp-server-to-claude-desktop/'),
      { source: '/Users/:rest*', destination: '/guides/add-mcp-server-to-claude-desktop/', statusCode: 301 },
      ...literal('/config', '/guides/cursor-rules-vs-agents-md/'),
      // Windows MCP configs use "args": ["/c", "npx", ...].
      ...literal('/c', '/guides/fix-spawn-npx-enoent-windows-mcp/'),
      // Content batch 2026-11-11: official Docker paths in the Memory MCP guide and shadcn's /improve slash command.
      ...literal('/app/dist', '/guides/memory-mcp-server-setup/'),
      { source: '/app/dist/:rest*', destination: '/guides/memory-mcp-server-setup/', statusCode: 301 },
      ...literal('/data/memory.jsonl', '/guides/memory-mcp-server-setup/'),
      ...literal('/old/memory.jsonl', '/guides/memory-mcp-server-setup/'),
      ...literal('/volume', '/guides/memory-mcp-server-setup/'),
      { source: '/volume/:rest*', destination: '/guides/memory-mcp-server-setup/', statusCode: 301 },
      ...literal('/improve', '/plugins/shadcn-improve/'),
      // Content batch 2026-11-18: the Stitch Skills example prompt quotes the /src folder.
      ...literal('/src', '/plugins/stitch-skills/'),
      // Search Console 2026-11-19: snippet paths that still 404'd on the live site.
      // Firecrawl API endpoint names in the Firecrawl setup guide (same sentence also names crawl/agent/interact).
      ...literal('/scrape', '/guides/firecrawl-mcp-server-setup/'),
      ...literal('/map', '/guides/firecrawl-mcp-server-setup/'),
      ...literal('/search', '/guides/firecrawl-mcp-server-setup/'),
      ...literal('/crawl', '/guides/firecrawl-mcp-server-setup/'),
      ...literal('/agent', '/guides/firecrawl-mcp-server-setup/'),
      ...literal('/interact', '/guides/firecrawl-mcp-server-setup/'),
      // Firecrawl 401 troubleshooting quotes these URL path suffixes.
      ...literal('/v2/mcp-oauth', '/guides/firecrawl-mcp-server-setup/'),
      ...literal('/v2/mcp', '/guides/firecrawl-mcp-server-setup/'),
      // Cursor slash command in the rules guide and cursor-rules listing.
      ...literal('/create-rule', '/guides/cursor-rules-vs-agents-md/'),
      // Context7 OAuth path suffix and library ID examples in the Context7 setup guide.
      ...literal('/mcp/oauth', '/guides/context7-mcp-setup/'),
      ...literal('/owner/repo', '/guides/context7-mcp-setup/'),
      ...literal('/vercel/next.js', '/guides/context7-mcp-setup/'),
      ...literal('/vercel/next.js/v16.2.9', '/guides/context7-mcp-setup/'),
      { source: '/vercel/:rest*', destination: '/guides/context7-mcp-setup/', statusCode: 301 },
      // Example skill-command pattern in the Claude Code plugins guide.
      ...literal('/plugin-name:skill-name', '/guides/install-claude-code-plugins/'),
    ];
  },
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
