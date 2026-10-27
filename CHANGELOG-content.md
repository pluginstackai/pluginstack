# Search content — 2026-10-27 (branch search-content, not deployed)
Search Console follow-up. The Cloudflare, OpenAI Agents SDK and OpenCode listings and the Claude Code guide already existed, so they were refreshed rather than created; the one new page is /guides/cursor-rules-vs-agents-md/.
- cloudflare-mcp: new title/description ("Cloudflare MCP server: URLs, setup & how to connect"), sections on what the servers are, which one to use (API server, docs, containers, Browser Run; older observability/bindings servers are deprecated per Cloudflare's README), building your own on Workers, a connect step for Claude Code and a note on the third-party mcp-remote adapter, plus a visible FAQ with FAQPage JSON-LD. Checked against github.com/cloudflare/mcp-server-cloudflare, github.com/cloudflare/mcp and developers.cloudflare.com/agents.
- /guides/best-mcp-servers-for-claude-code/: now ten servers (Cloudflare added), a "where to start" section, Context7 wording fixed (CLI + Skills or MCP mode), link to the new guide, extra sources.
- /guides/cursor-rules-vs-agents-md/ (new): .cursor/rules (.mdc), legacy .cursorrules, AGENTS.md, which tools read it (Claude Code only without a CLAUDE.md, v2.1.277+), when to use each, examples, FAQ, sources (Cursor docs/help, agents.md, Claude Code docs, a Cursor staff forum reply for .cursorrules behaviour).
- openai-agents-sdk, opencode: refreshed (JS/TS install, voice/Redis extras, MCP, difference from the `openai` package; OpenCode V1/V2 installs, /connect, /init + AGENTS.md, docs locations, repo now anomalyco/opencode) with FAQs. No `install` block: neither is an MCP server.
- cursor-rules (url now cursor.com/docs/rules), agents-md, claude-code, codex-cli, cursor-plugins: link to the new guide. Listings can now carry optional `seo`, `sections`, `faq` and `guides` fields (src/lib/data.ts, plugin page).
- Junk 404s from Search Console (/mcp, /sse, /path/to/*, /mcp-server-dev:*): no page contains an <a href> to them; they only occur as plain text/code. Added 301s from /mcp and /sse to /categories/mcp-servers/ in next.config.mjs. The /path/to/* and /mcp-server-dev:* URLs are left as 404.

# Traffic content — 2026-10-27 (branch traffic-content, not deployed)
Refreshed four reference-server listings (filesystem-mcp, fetch-mcp, memory-mcp, sequential-thinking-mcp) for MCP servers v2.0/v2.1: Node 24 requirement, security-fix releases, Windows config, last-checked dates (all 2026-10-27), each checked against the official READMEs, CHANGELOGs and GitHub release notes.
Added five guides (src/lib/guides-mcp.ts): /guides/mcp-reference-servers-v2-whats-changed/, /guides/fix-spawn-npx-enoent-windows-mcp/, /guides/fix-mcp-error-32000-connection-closed/, /guides/fix-claude-code-mcp-needs-authentication/ and /guides/add-mcp-server-to-codex-config-toml/. Each has a quick answer, exact steps, per-client notes and a Sources box with official docs or credible GitHub issues (cited as user reports, not official statements).
Added an optional `install` field on listings plus an "Install in your client" section (Claude Code, Claude Desktop for local servers, Cursor, VS Code, Codex) generated from one data block per server, and a sortable /mcp-server-requirements/ page. 19 MCP listings have it (8 local, 11 hosted); install values were copied from each server's official README or docs. Windsurf is not shown (format not verified). Not given an install block: github-mcp-server (clients need different auth setups: OAuth vs token header vs Docker), serena (installed with uv tool, not a one-line config), blender-mcp and unity-mcp (installers/packages, not MCP config), mcp-inspector and fastmcp (dev tools).

# Weekly content batch — 2026-10-21 (branch content-2026-10-21, not deployed)
Added 5 listings: claude-code-plugins (Anthropic's official Claude Code plugin marketplace), cursor-plugins (Cursor's official plugins + plugin spec), serena (Oraios AI coding-agent MCP server, v2.1.0), apify-mcp (Apify's official MCP server) and android-skills (Google's official Android Agent Skills). Each was checked on 2026-10-21 against its official repo/docs (exists, not archived, recent commits, LICENSE file, install steps from the README/docs). No star counts or usage stats are quoted. All five have pack: null in pairings.json (no pack genuinely fits). None of the five has a demo video (serena's official Oraios AI intro video was dropped on review because it predates Serena v2).
Added two guides: /guides/install-claude-code-plugins/ and /guides/how-to-create-agent-skills/. Every command, path and snippet was checked on 2026-10-21 against the official docs in each guide's Sources box (Claude Code plugins + skills docs, Cursor skills docs, Codex skills docs, agentskills.io spec, Android and Apify docs). One pack mention (Agent Builder pack, in the skills guide). /guides/ meta description now mentions plugins and Agent Skills.

# Guides section — 2026-10-20 (branch guides-1, not deployed)
Added /guides/ with two setup guides: /guides/add-mcp-server-to-cursor/ and /guides/best-mcp-servers-for-claude-code/. Content lives in src/lib/guides.ts (block data; internal links are checked at build). Every command, path and JSON snippet was checked on 2026-10-20 against the official docs listed in each guide's Sources box (Cursor docs + help, Claude Code MCP reference + quickstart, and each server's official README/docs). Pages have canonical URLs, Article + BreadcrumbList JSON-LD, sitemap entries, an llms.txt section and a "Guides" header link. Markdown copies: node scripts/guides-md.mjs <outDir>.

# Official demo videos — 2026-10-18
Added a click-to-load YouTube demo (youtube-nocookie.com, thumbnail from i.ytimg.com) to 17 listings: agent-skills, blender-mcp, chrome-devtools-mcp, claude-code, cloudflare-mcp, codex-cli, crewai, figma-mcp, firecrawl-mcp, github-mcp-server, goose, kilo-code, mastra, openai-agents-sdk, playwright-mcp, sentry-mcp, supabase-mcp. Every video is from the tool's official channel (confirmed from the vendor's site/README/GitHub org or official docs), oEmbed returned 200 with that channel as author on 2026-10-18, and it introduces or demos the listed tool. The other 26 listings have no qualifying video yet (LangGraph's official course-promo video was dropped on review). Full list and reasons: /workspace/drafts/demo-videos.md (not in the repo).

# Second audit of the 2026-10-17 additions — 2026-10-17
Re-checked all 29 entries from commit fa4e84b against their official repos/docs (archive status, latest commits/releases, LICENSE file, README install steps, npm/PyPI package names and install-script URLs). All repos are the canonical ones (old names such as block/goose, All-Hands-AI/OpenHands, jlowin/fastmcp, sst/opencode and ahujasid/blender-mcp redirect to the listed repos).
- trellis-2: REMOVED. No code commits since Jan 2026 (only CI/policy commits since) and no releases, so it doesn't meet the "actively maintained" bar used for the other entries (same reason Hunyuan3D was left out).
- opencode: install steps were ambiguous. opencode.ai/install and brew anomalyco/tap/opencode give OpenCode 1; opencode.ai/v2/install and npm @opencode/cli give OpenCode 2. Both are now labeled, with the migration note.
- vercel-ai-sdk: UI hooks are for React, Svelte and Vue (not Angular); noted that AI Gateway is a paid pay-as-you-go service with a limited free tier.
- bolt-diy: described as a community fork of Bolt.new (not "the" open-source Bolt); added the README's maintenance-mode note.
- blender-mcp: added the default anonymous telemetry and how to turn it off, the optional paid Premium generation, and the safe-mode flag.
- dyad: Linux builds exist; noted the optional paid Pro/Max plans.
- crewai, godot-ai: added default telemetry and opt-out; noted the optional paid CrewAI AMP; Godot AI marked as a community project, not affiliated with the Godot Foundation.
- pydantic-ai: needs Python 3.11+ (PyPI requires-python).
- chrome-devtools-mcp: noted the new official name "Chrome DevTools for agents" and the browser-data warning.
- agents-md: now stewarded by the Agentic AI Foundation (Linux Foundation).
- unity-mcp: maintained by Aura, which also sells a separate paid product; openhands: Agent Canvas is labeled beta, Cloud/Enterprise are paid.
- cloudflare-mcp: the recommended API server lives in cloudflare/mcp. brave-search-mcp: added place search. fetch-mcp: follows robots.txt. kilo-code: "no markup" attributed to Kilo. neon-mcp: added read-only mode. agent-skills: spec now at agentskills.io.
- No changes needed: codex-cli, exa-mcp, fastmcp, firecrawl-mcp, goose, langgraph, mastra, mcp-inspector, openai-agents-sdk, sequential-thinking-mcp.

# Content additions — 2026-10-17
Added 29 listings. Each was checked against its official repo/docs on 2026-10-17 (exists, not archived, commits in the last 6 months, license, install steps taken from the README/docs). No star counts or usage stats are quoted.
New categories: MCP Dev Tools, Agent Frameworks, Vibe Coding, Game Dev.
Considered and left out: Roo Code (repo archived), Roblox studio-rust-mcp-server (archived), Unreal MCP by chongdashu (no commits since Apr 2025), Gemini CLI (Google says it was replaced by Antigravity CLI for unpaid users and isn't optimized for the latest models), AWS Labs MCP servers (being superseded by the Agent Toolkit for AWS), Hunyuan3D-2/2.1 (no commits since Oct 2025).

# Content fact-check — 2026-10-15
Checked each plugin against its official README/docs.
- continue: REMOVED. continue.dev now says "Continue has joined Cursor" (acquired); product status is unclear.
- claude-code: URL moved to code.claude.com/docs/en/overview; install is now the native installer (curl/irm), with brew and npm (Node 22+) as alternatives; added the paid-plan requirement; it also runs in IDEs, a desktop app and on the web.
- cursor-rules: URL moved to cursor.com/docs/context/rules; rules are .mdc files (plain .md is ignored); /create-rule; the 4 rule types; AGENTS.md, User and Team rules.
- stripe-mcp: removed `npx @stripe/mcp --api-key` (not in docs); added `stripe agent setup` and remote mcp.stripe.com with OAuth; secret keys stop working Dec 2026 (use agent API keys); "test-mode" changed to "sandbox".
- context7: added `npx ctx7 setup` (Node 22.13+); the remote URL needs a Bearer API key; prompts now use the official examples.
- supabase-mcp: removed "fetch logs" (not in README); added the security-practices step, the local CLI endpoint, and the logs prompt was swapped out.
- sentry-mcp: added the Claude Code plugin install and the self-hosted stdio command; noted that AI search needs an LLM key; the unverified "release" prompt was replaced.
- notion-mcp: URL changed to the get-started page; added the mcp-remote fallback and the guests-can't-connect note.
- github-mcp-server: added Actions and security findings, the exact Docker command, and read-only mode; added an Actions-logs prompt.
- playwright-mcp: added Codex commands and verified flags (--headless, --isolated, --browser).
- filesystem-mcp: added edit/directory tools, Windows cmd /c, and MCP Roots.
- memory-mcp: added the Docker option and the README's example system prompt; called it "basic" memory, as the README does.
- cline: it now ships as VS Code, JetBrains, CLI and desktop app; added Plan/Act modes, auto-approve and local models.
- aider: updated the Python range and added the one-liner installer; removed the "auto-commits" claim (not on the fetched page).
- linear-mcp, figma-mcp: verified earlier; no changes.
