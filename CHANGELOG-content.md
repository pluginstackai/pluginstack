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
