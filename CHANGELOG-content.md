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
