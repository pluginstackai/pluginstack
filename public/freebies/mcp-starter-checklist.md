# MCP Starter Setup Checklist

**From [PluginStack](https://pluginstackai.com)** — a free one-page checklist. Independent directory; not affiliated with Anthropic, Cursor, or any tool maker.

Use this before you call an MCP server “done.” It tells you **what to verify**. It does **not** include paid pack files (no CLAUDE.md template, skills, or scaffolding prompt packs).

---

## 1. Pick stdio vs HTTP

- **stdio** — best for local agents (Claude Code, Cursor) talking to a process on your machine.
- **HTTP / SSE** — better when the server runs elsewhere or multiple clients share it.
- Write down which you chose and why (one sentence). Wrong transport = mysterious “not connecting” bugs.

## 2. Keep tools task-shaped

- Prefer a **few** tools with clear names over a grab-bag of low-level helpers.
- Each tool name should answer: *what job does this do for the agent?*
- If two tools overlap, merge or delete one before you ship.

## 3. Never log on stdout

- MCP stdio uses **stdout** for protocol messages.
- Logging, `print`, or debug dumps on stdout **corrupt the stream**.
- Send logs to **stderr** (or a file). Confirm nothing accidental hits stdout.

## 4. Validate env / auth before `tools/list`

- Required env vars and API keys fail **loud and early**, not after the agent is mid-task.
- Cold-start the server once with a missing key on purpose — you should get a clear error.
- Document the exact env names the user must set.

## 5. Smoke-test with MCP Inspector

- Run [MCP Inspector](https://modelcontextprotocol.io) (or your equivalent).
- Confirm **`tools/list`** returns your tools with the names you expect.
- Run **one** real **`tools/call`** with a safe payload. Fix failures here, not in the agent chat.

## 6. Wire into Claude Code and Cursor (absolute paths)

**Claude Code** (example shape — check current docs):

```bash
claude mcp add <name> -- <command> <absolute-path-to-server>
```

**Cursor** — project or user `.cursor/mcp.json` with an **absolute** path to the command/args (relative paths break when the IDE cwd differs).

- Restart the client after config changes.
- Confirm the server shows as connected in the client’s MCP UI.

## 7. Definition of done

You’re done when **all** of these are true:

1. Inspector: `tools/list` green + one successful `tools/call`
2. Claude Code **or** Cursor can see the server and call one tool once
3. No protocol noise on stdout; secrets stay in env, not in repo

---

## Want the agent to do more of this for you?

PluginStack’s paid **Agent Builder Rules + Prompts ($15)** adds drop-in CLAUDE.md, Claude Code skills, and MCP scaffolding prompts so your agent builds servers the right way — not a pile of half-working tools.

→ [Get Agent Builder — $15](https://pluginstackai.gumroad.com/l/yrxliv) · [See all packs](https://pluginstackai.com/packs/) · [Why we show our own products](https://pluginstackai.com/disclosures/#our-products)

---

*Checklist only. Personal use free. Not for resale as a competing pack. © PluginStack*
