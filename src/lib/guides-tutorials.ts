/**
 * Tutorial-style guides added in the 2026-11-04 content batch (/guides/<slug>/).
 * Same data shape and rules as guides.ts: every command, URL and code snippet must match the sources linked in `sources`
 * (checked on `updated`). Imported into GUIDES in guides.ts.
 */
import type { Guide } from './guides.ts';

/** Join lines into a code-block string (keeps the snippets readable in source). */
const j = (...lines: string[]) => lines.join('\n');

const DATE = '2026-11-04';

/* ------------------------------------------------------------------------------------------------------------------ */

const agentsSdk: Guide = {
  slug: 'openai-agents-sdk-python-tutorial',
  title: 'OpenAI Agents SDK tutorial (Python): first agent, tools, handoffs, MCP',
  h1: 'OpenAI Agents SDK tutorial for Python',
  description: 'Build your first agent with the OpenAI Agents SDK in Python: install, API key, Runner, function tools, handoffs, structured output, sessions, MCP servers and tracing.',
  published: DATE,
  updated: DATE,
  kind: 'Tutorial',
  intro: "The OpenAI Agents SDK (`openai-agents` on PyPI) is OpenAI's open-source Python framework for building agents: a model with instructions, tools it can call, and the option to hand a conversation to another agent. This tutorial goes from an empty folder to an agent that uses your own Python functions, routes questions between specialists, remembers earlier turns and calls an MCP server. Every snippet follows the SDK's official docs, and the imports were checked against `openai-agents` 0.24.0 (the current release on 4 November 2026).",
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ol: [
      'Use Python 3.10 or newer. Make a virtual environment and run `pip install openai-agents`.',
      'Set `OPENAI_API_KEY` in your environment.',
      'Create an `Agent(name=..., instructions=...)` and run it with `Runner.run(agent, "your question")` inside `asyncio.run(...)`, or `Runner.run_sync(...)` in a plain script.',
      'Read the answer from `result.final_output`.',
    ] },
    { freebie: true },

    { h2: '1. Install the SDK', id: 'install' },
    { p: 'The package needs Python 3.10 or newer. Make a project folder with its own virtual environment so the SDK and its dependencies stay out of your system Python:' },
    { code: j('mkdir my_project', 'cd my_project', 'python -m venv .venv', 'source .venv/bin/activate   # Windows: .venv\\Scripts\\activate', 'pip install openai-agents'), lang: 'bash' },
    { p: 'If you use uv, `uv init` and then `uv add openai-agents` does the same thing. The package is called `openai-agents`, but you import it as `agents`. Don\'t install the `agents` package from PyPI by mistake: that is a different project (TensorFlow Agents).' },

    { h2: '2. Set your API key', id: 'api-key' },
    { p: 'The SDK reads your key from the `OPENAI_API_KEY` environment variable. Create a key in the OpenAI dashboard, then set it in the terminal you run the script from:' },
    { code: 'export OPENAI_API_KEY=sk-...', lang: 'bash', caption: 'macOS / Linux' },
    { code: '$env:OPENAI_API_KEY = "sk-..."', lang: 'powershell', caption: 'Windows PowerShell' },
    { p: 'That only lasts for the current terminal session. Keep the key out of your code and out of git. One option is a `.env` file that you load yourself and list in `.gitignore`.' },

    { h2: '3. Your first agent', id: 'first-agent' },
    { p: 'An agent is a model plus instructions. `Runner` runs the loop: it calls the model, runs any tools the model asks for, and stops when the model gives a final answer. Save this as `main.py`:' },
    { code: j('import asyncio', 'from agents import Agent, Runner', '', 'agent = Agent(', '    name="History Tutor",', '    instructions="You answer history questions clearly and concisely.",', ')', '', 'async def main():', '    result = await Runner.run(agent, "When did the Roman Empire fall?")', '    print(result.final_output)', '', 'if __name__ == "__main__":', '    asyncio.run(main())'), lang: 'python', caption: 'main.py' },
    { code: 'python main.py', lang: 'bash' },
    { p: 'No `model` is set here, so the SDK uses its default model. To choose one, pass `model="..."` to `Agent`, or set `OPENAI_DEFAULT_MODEL` for every agent that doesn\'t name one. The models page in the SDK docs lists the current default.' },
    { h3: 'run, run_sync or run_streamed?' },
    { ul: [
      '`await Runner.run(...)` is async. Use it in async code, web servers and anything that runs several agents at once.',
      '`Runner.run_sync(...)` wraps the same thing for plain scripts. It won\'t work inside an event loop that is already running, such as a Jupyter notebook. Use `await Runner.run(...)` there.',
      '`Runner.run_streamed(...)` returns straight away and gives you events as they happen, so you can print text as it is written.',
    ] },
    { code: j('from openai.types.responses import ResponseTextDeltaEvent', '', 'result = Runner.run_streamed(agent, input="Tell me three facts about Rome.")', 'async for event in result.stream_events():', '    if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):', '        print(event.data.delta, end="", flush=True)'), lang: 'python', caption: 'Streaming text as it arrives (inside an async function)' },

    { h2: '4. Give the agent tools', id: 'tools' },
    { p: 'A function tool is an ordinary Python function the model can decide to call. The SDK builds the tool\'s schema from the function name, the type hints and the docstring, so write the docstring for the model: say what the tool does and when to use it.' },
    { code: j('import asyncio', 'from agents import Agent, Runner', 'from agents.decorators import tool', '', '@tool', 'def get_order_status(order_id: str) -> str:', '    """Look up the shipping status of an order by its ID."""', '    # Replace this with a real database or API call.', '    return f"Order {order_id} shipped yesterday."', '', 'agent = Agent(', '    name="Support Agent",', '    instructions="Help customers with their orders. Use the tools to look things up.",', '    tools=[get_order_status],', ')', '', 'async def main():', '    result = await Runner.run(agent, "Where is order 1042?")', '    print(result.final_output)', '', 'asyncio.run(main())'), lang: 'python' },
    { p: 'The quickstart imports `tool` from `agents.decorators`. In 0.24.0, `tool` is an alias for `function_tool`, so code that uses `from agents import function_tool` and `@function_tool` works the same way.' },
    { p: 'The SDK also has hosted tools that run on OpenAI\'s side, such as `WebSearchTool()` and `FileSearchTool(...)`, which you add to `tools` the same way. The docs list them as built-in tools for OpenAI\'s Responses models.' },
    { note: 'A tool can do anything your Python code can do. If it deletes, sends or pays for something, check the inputs inside the function and think about requiring a human approval step. The SDK\'s human-in-the-loop guide shows how to pause a run for approval.' },

    { h2: '5. Hand off between agents', id: 'handoffs' },
    { p: 'A handoff lets one agent pass the conversation to another that is better suited to it. Give each specialist a `handoff_description` so the routing agent knows when to use it:' },
    { code: j('from agents import Agent, Runner', '', 'history_tutor = Agent(', '    name="History Tutor",', '    handoff_description="Specialist agent for historical questions",', '    instructions="You answer history questions clearly and concisely.",', ')', '', 'math_tutor = Agent(', '    name="Math Tutor",', '    handoff_description="Specialist agent for math questions",', '    instructions="You explain math step by step.",', ')', '', 'triage_agent = Agent(', '    name="Triage Agent",', '    instructions="Route each homework question to the right specialist.",', '    handoffs=[history_tutor, math_tutor],', ')', '', 'result = Runner.run_sync(triage_agent, "What is 15% of 80?")', 'print(result.last_agent.name)   # which agent answered', 'print(result.final_output)'), lang: 'python' },
    { p: 'After a handoff, the specialist owns the rest of the conversation. If you want a manager agent that stays in charge and calls specialists like functions, use agents as tools instead:' },
    { code: j('manager = Agent(', '    name="Manager",', '    instructions="Answer the question. Use the tutors when you need them.",', '    tools=[', '        history_tutor.as_tool(tool_name="history_tutor", tool_description="Answers history questions"),', '        math_tutor.as_tool(tool_name="math_tutor", tool_description="Solves math problems"),', '    ],', ')'), lang: 'python' },

    { h2: '6. Get structured output', id: 'structured-output' },
    { p: 'Set `output_type` to a Pydantic model and `final_output` becomes an instance of it rather than plain text. That is much easier to use in code than parsing a sentence:' },
    { code: j('from pydantic import BaseModel', 'from agents import Agent, Runner', '', 'class Ticket(BaseModel):', '    category: str', '    urgent: bool', '    summary: str', '', 'classifier = Agent(', '    name="Ticket Classifier",', '    instructions="Classify the support message.",', '    output_type=Ticket,', ')', '', 'result = Runner.run_sync(classifier, "My card was charged twice and I need it fixed today.")', 'ticket = result.final_output   # a Ticket object', 'print(ticket.category, ticket.urgent)'), lang: 'python' },

    { h2: '7. Remember earlier turns', id: 'sessions' },
    { p: 'Each `Runner.run` call starts fresh unless you pass the history back in. The simplest way is a session, which stores the conversation and adds it to the next run for you:' },
    { code: j('from agents import Agent, Runner, SQLiteSession', '', 'agent = Agent(name="Assistant", instructions="Reply very concisely.")', 'session = SQLiteSession("conversation_123")   # in memory', '# session = SQLiteSession("user_123", "conversations.db")   # saved to a file', '', 'result = Runner.run_sync(agent, "What city is the Golden Gate Bridge in?", session=session)', 'print(result.final_output)', '', 'result = Runner.run_sync(agent, "What state is it in?", session=session)', 'print(result.final_output)   # knows "it" means the bridge'), lang: 'python' },
    { p: 'Use one session ID per conversation (per user, per chat thread). Without a database file the history is lost when the program exits. If you want to manage history yourself, pass `result.to_input_list()` plus the new message into the next run. You can also let OpenAI keep the state with `previous_response_id` or `conversation_id`. The SDK\'s running-agents guide compares the options.' },

    { h2: '8. Connect an MCP server', id: 'mcp' },
    { p: 'MCP (Model Context Protocol) servers give an agent ready-made tools. The SDK can start a local server and expose its tools to the agent. This example uses the official [Filesystem MCP server](/plugins/filesystem-mcp/), limited to one folder. It needs Node.js 24 or newer for `npx`:' },
    { code: j('import asyncio', 'from pathlib import Path', 'from agents import Agent, Runner', 'from agents.mcp import MCPServerStdio', '', 'notes_dir = Path(__file__).parent / "notes"', '', 'async def main():', '    async with MCPServerStdio(', '        name="Filesystem",', '        params={', '            "command": "npx",', '            "args": ["-y", "@modelcontextprotocol/server-filesystem", str(notes_dir)],', '        },', '        client_session_timeout_seconds=30,', '    ) as server:', '        agent = Agent(', '            name="Notes Assistant",', '            instructions="Answer questions using the files in the notes folder.",', '            mcp_servers=[server],', '        )', '        result = await Runner.run(agent, "List the files you can see and summarize the newest one.")', '        print(result.final_output)', '', 'asyncio.run(main())'), lang: 'python' },
    { p: '`client_session_timeout_seconds` defaults to 5 seconds. The example raises it to 30, as the example in the SDK\'s MCP docs does. `npx -y` may download the package before the server starts, so the SDK docs recommend installing the package before connecting. One way is `npm install -g @modelcontextprotocol/server-filesystem` and then `"command": "mcp-server-filesystem"` with just the folder in `args`. To give the agent only some of a server\'s tools, pass `tool_filter=create_static_tool_filter(allowed_tool_names=[...])` (import it from `agents.mcp`). For Filesystem, `["read_text_file", "list_directory", "search_files"]` makes it read-only. The SDK docs\' example uses `read_file`. That name still works, but the server marks it deprecated in favor of `read_text_file`. More on this server: [Filesystem MCP server setup](/guides/filesystem-mcp-server-setup/).' },
    { p: 'For a server that runs on the web, use `MCPServerStreamableHttp(name=..., params={"url": "https://...", "headers": {...}})` the same way. With OpenAI\'s Responses models there is also `HostedMCPTool`, where the Responses API connects to a remote MCP server and your code never connects to it. Only connect servers you trust: whatever a tool returns goes straight into the model\'s context.' },

    { h2: '9. See what happened with tracing', id: 'tracing' },
    { p: 'Tracing is on by default. Each run records the model calls, tool calls and handoffs, and you can look through them in the OpenAI Traces dashboard. That shows you why an agent picked a tool or where it got stuck.' },
    { p: 'To switch it off, set `OPENAI_AGENTS_DISABLE_TRACING=1` in the environment, or call `set_tracing_disabled(True)` (from `agents`) at the start of your program. Tracing is unavailable for organizations that use OpenAI\'s APIs under a Zero Data Retention (ZDR) policy.' },

    { h2: 'Common errors', id: 'errors' },
    { ul: [
      '**`ModuleNotFoundError: No module named \'agents\'`:** the virtual environment isn\'t active, or you installed into a different Python. Activate `.venv` and run `pip install openai-agents` again.',
      '**`OpenAIError: Missing credentials. Please pass an \`api_key\`...`:** `OPENAI_API_KEY` isn\'t set in the terminal that runs the script. Set it again after opening a new terminal.',
      '**`MaxTurnsExceeded`:** the agent kept calling tools without finishing. The default limit is 10 turns. Tighten the instructions or tool descriptions, or pass `max_turns=` to `Runner.run` if the task really needs more steps.',
      '**`RuntimeError: AgentRunner.run_sync() cannot be called when an event loop is already running.`:** you called `Runner.run_sync` inside Jupyter or another async program. Use `await Runner.run(...)` instead.',
      '**The MCP server times out on startup:** install the package before connecting, as the SDK docs recommend, and check `node --version` (the Filesystem server has declared Node 24 or newer since v2.0.0).',
    ] },

    { h2: 'Where to go next', id: 'next' },
    { p: 'The SDK repo has runnable examples worth reading next: `examples/basic/hello_world.py`, `examples/basic/tools.py` and `examples/agent_patterns/routing.py`. Guardrails (checks that run on input or output), human approval and voice agents each have their own page in the docs. For a shorter overview of the SDK, how it differs from the regular OpenAI SDK and the JavaScript version, see the [OpenAI Agents SDK listing](/plugins/openai-agents-sdk/). To give your agent more tools through MCP, [the best MCP servers for Claude Code](/guides/best-mcp-servers-for-claude-code/) covers popular servers that work with any MCP client.' },
    { pack: 'agent-builder-pack', toolName: 'the OpenAI Agents SDK', why: 'Not needed for anything in this tutorial. If you go on to design your own agent tools, the pack has framework-agnostic rules for tool design and error handling, plus 12 eval prompt templates for testing an agent. It is not specific to the OpenAI Agents SDK.' },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Is the OpenAI Agents SDK free?' },
    { p: 'The SDK is open source under the MIT license and free to install. You pay for the model calls it makes as normal API usage.' },
    { h3: 'Can I use it with models from other providers?' },
    { p: 'Yes. The models page in the docs covers non-OpenAI providers, including OpenAI-compatible endpoints and the LiteLLM and Any-LLM adapters (both marked beta). Hosted tools such as web search and file search are built-in tools for OpenAI\'s Responses models.' },
    { h3: 'What is the difference between the Agents SDK and the OpenAI Python SDK?' },
    { p: 'The `openai` package sends single requests to the API. The Agents SDK is built on top of it and adds the agent loop: running tools, handoffs, sessions, guardrails and tracing. The [listing](/plugins/openai-agents-sdk/) has a short comparison.' },
    { h3: 'Is there a JavaScript or TypeScript version?' },
    { p: 'Yes, `@openai/agents` on npm, with similar concepts. This tutorial covers the Python package only.' },
  ],
  related: ['openai-agents-sdk', 'filesystem-mcp', 'mcp-inspector'],
  sources: [
    { label: 'OpenAI Agents SDK docs: Quickstart', url: 'https://openai.github.io/openai-agents-python/quickstart/' },
    { label: 'OpenAI Agents SDK docs: Running agents', url: 'https://openai.github.io/openai-agents-python/running_agents/' },
    { label: 'OpenAI Agents SDK docs: Tools', url: 'https://openai.github.io/openai-agents-python/tools/' },
    { label: 'OpenAI Agents SDK docs: Sessions', url: 'https://openai.github.io/openai-agents-python/sessions/' },
    { label: 'OpenAI Agents SDK docs: MCP', url: 'https://openai.github.io/openai-agents-python/mcp/' },
    { label: 'OpenAI Agents SDK docs: Streaming', url: 'https://openai.github.io/openai-agents-python/streaming/' },
    { label: 'OpenAI Agents SDK docs: Tracing', url: 'https://openai.github.io/openai-agents-python/tracing/' },
    { label: 'OpenAI Agents SDK docs: Models', url: 'https://openai.github.io/openai-agents-python/models/' },
    { label: 'openai-agents on PyPI (version and Python requirement)', url: 'https://pypi.org/project/openai-agents/' },
    { label: 'openai/openai-agents-python on GitHub (examples)', url: 'https://github.com/openai/openai-agents-python' },
  ],
};

/* ------------------------------------------------------------------------------------------------------------------ */

const filesystem: Guide = {
  slug: 'filesystem-mcp-server-setup',
  title: 'Filesystem MCP server setup: config, tools, Docker and fixes (v2.1)',
  h1: 'How to set up the Filesystem MCP server',
  description: 'Set up the official Filesystem MCP server in Claude Code, Claude Desktop, Cursor, VS Code or Codex: allowed folders, Windows and Docker configs, read-only mode, its tools and common errors.',
  published: DATE,
  updated: DATE,
  intro: "The Filesystem MCP server (`@modelcontextprotocol/server-filesystem`) is the official reference server that lets an AI client read, write, edit, move and search files, but only inside the folders you allow. This guide covers the setup for each client, how the allowed folders work, read-only and Docker setups, what each tool does and the errors people run into. It is based on the server's README and changelog and the npm package, which was at version 2.1.0 (28 October 2026) when checked on 4 November 2026.",
  blocks: [
    { h2: 'Quick answer', id: 'quick-answer' },
    { ul: [
      '**Needs:** Node.js 24 or newer (since v2.0.0).',
      '**Command:** `npx -y @modelcontextprotocol/server-filesystem /path/to/folder`. Every folder the AI may use goes at the end, as its own argument.',
      '**Claude Code:** `claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/folder`',
      '**Windows:** launch it through `cmd /c npx ...` in JSON configs, as the README does.',
      '**Read-only:** use the Docker image with `,ro` on the mount, or limit the tools in your client.',
    ] },
    { freebie: true },

    { h2: 'Before you start', id: 'before' },
    { p: 'Check your Node version with `node --version`. Version 2.0.0 of the server raised the minimum to Node 24, and the README lists Node 24 or later as the requirement when you run it through `npx`.' },
    { p: 'Then decide which folders to share. The server can only touch the folders you list and what is inside them, but within those it can create, overwrite and move files. Pick a project folder or a notes folder, not your whole home directory.' },

    { h2: 'How allowed folders work', id: 'allowed-directories' },
    { p: 'You pass allowed folders as command-line arguments after the package name. The README calls this the recommended method, and it is the only one that works with every protocol version.' },
    { p: 'There is an older method called Roots, where the client tells the server which folders to use and replaces the command-line list. It is deprecated as of the 2026-07-28 protocol version and only works with 2025-era clients. Don\'t rely on it. Two consequences of starting the server with no folders:' },
    { ul: [
      'With a 2025-era client that doesn\'t support Roots, the server logs the reason, closes the connection and exits with status 1.',
      'With a 2026-07-28 client, the server starts but answers every tool call with an error saying no directories are allowed.',
    ] },
    { p: 'To check what the server thinks it can access, ask the AI to call `list_allowed_directories`. A folder you reached through a symlink is listed twice, once as you typed it and once as its real path.' },

    { h2: 'Set it up in your client', id: 'setup' },
    { h3: 'Claude Code', id: 'claude-code' },
    { code: j('claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/projects/my-app', '', '# more than one folder: add them at the end', 'claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/projects/my-app ~/notes'), lang: 'bash' },
    { p: 'Everything after `--` is the command Claude Code runs. Run `claude mcp list` or `/mcp` to check it connected. More: [the best MCP servers for Claude Code](/guides/best-mcp-servers-for-claude-code/).' },
    { h3: 'Claude Desktop', id: 'claude-desktop' },
    { p: 'Open **Settings → Developer → Edit Config** and add this to `claude_desktop_config.json`, with your own folder paths:' },
    { code: j('{', '  "mcpServers": {', '    "filesystem": {', '      "command": "npx",', '      "args": [', '        "-y",', '        "@modelcontextprotocol/server-filesystem",', '        "/Users/you/Desktop",', '        "/Users/you/Documents/notes"', '      ]', '    }', '  }', '}'), lang: 'json', caption: 'claude_desktop_config.json (macOS)' },
    { p: 'Quit Claude Desktop fully and reopen it. The full walkthrough, including where the file is on each OS, is in [how to add an MCP server to Claude Desktop](/guides/add-mcp-server-to-claude-desktop/).' },
    { h3: 'Windows', id: 'windows' },
    { p: 'On Windows, the README launches `npx` through `cmd /c`. In JSON, every backslash in a path has to be doubled:' },
    { code: j('{', '  "mcpServers": {', '    "filesystem": {', '      "command": "cmd",', '      "args": [', '        "/c",', '        "npx",', '        "-y",', '        "@modelcontextprotocol/server-filesystem",', '        "C:\\\\Users\\\\you\\\\Documents\\\\notes"', '      ]', '    }', '  }', '}'), lang: 'json' },
    { p: 'If the client can\'t start `npx` at all, see [fix spawn npx ENOENT on Windows](/guides/fix-spawn-npx-enoent-windows-mcp/). Version 2.1.0 fixed a bug on case-insensitive file systems (Windows NTFS, default macOS APFS) where a path that spelled the allowed folder\'s name in a different letter case was refused.' },
    { h3: 'Cursor', id: 'cursor' },
    { p: 'Use the same `mcpServers` block as Claude Desktop in `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project). More: [how to add an MCP server to Cursor](/guides/add-mcp-server-to-cursor/).' },
    { h3: 'VS Code (GitHub Copilot)', id: 'vscode' },
    { p: 'VS Code uses `servers` rather than `mcpServers`. `${workspaceFolder}` gives the server whatever folder you have open:' },
    { code: j('{', '  "servers": {', '    "filesystem": {', '      "command": "npx",', '      "args": [', '        "-y",', '        "@modelcontextprotocol/server-filesystem",', '        "${workspaceFolder}"', '      ]', '    }', '  }', '}'), lang: 'json', caption: '.vscode/mcp.json' },
    { p: 'More: [how to add an MCP server to VS Code](/guides/add-mcp-server-to-vs-code/).' },
    { h3: 'Codex', id: 'codex' },
    { code: 'codex mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/you/projects', lang: 'bash' },
    { p: 'Or edit `~/.codex/config.toml` directly. Both are covered in [how to add an MCP server to Codex](/guides/add-mcp-server-to-codex-config-toml/).' },

    { h2: 'Read-only and Docker setups', id: 'docker' },
    { p: 'If you want the AI to look but not touch, there are two ways.' },
    { p: '**Docker with read-only mounts.** The official image is `mcp/filesystem`. Each folder is mounted under `/projects`, and adding `,ro` to a mount makes that folder read-only for the server:' },
    { code: j('{', '  "mcpServers": {', '    "filesystem": {', '      "command": "docker",', '      "args": [', '        "run", "-i", "--rm",', '        "--mount", "type=bind,src=/Users/you/projects/my-app,dst=/projects/my-app",', '        "--mount", "type=bind,src=/Users/you/Documents/reference,dst=/projects/reference,ro",', '        "mcp/filesystem",', '        "/projects"', '      ]', '    }', '  }', '}'), lang: 'json', caption: 'my-app is writable, reference is read-only' },
    { p: 'Inside the container the AI sees paths like `/projects/my-app/README.md`, not your real paths. Docker has to be running before the client starts the server.' },
    { p: '**Only allow the read tools.** If your client lets you switch off individual tools, you can leave only the read tools on. The read-only ones are `read_text_file`, `read_media_file`, `read_multiple_files`, `list_directory`, `list_directory_with_sizes`, `directory_tree`, `search_files`, `get_file_info` and `list_allowed_directories`. Turning off `write_file`, `edit_file`, `move_file` and `create_directory` leaves the AI able to read only. In the OpenAI Agents SDK you can do the same with a tool filter (see [the Agents SDK tutorial](/guides/openai-agents-sdk-python-tutorial/)).' },

    { h2: 'What the tools do', id: 'tools' },
    { ul: [
      '`read_text_file`: reads a file as UTF-8 text. `head` or `tail` (not both) returns only the first or last N lines. The older name `read_file` still works but is deprecated.',
      '`read_media_file`: returns images and audio as base64 with their MIME type. Other files come back as an embedded resource.',
      '`read_multiple_files`: reads several files at once. One failed file doesn\'t stop the rest.',
      '`write_file`: creates a file or overwrites an existing one completely.',
      '`edit_file`: makes targeted edits and returns a git-style diff. `dryRun: true` previews the change without writing it.',
      '`create_directory`: creates a folder, including parent folders. Does nothing if it already exists.',
      '`list_directory` and `list_directory_with_sizes`: list a folder with [FILE] and [DIR] labels. The sizes version can sort by `name` or `size`.',
      '`move_file`: moves or renames. Fails if the destination exists.',
      '`search_files`: finds files and folders by glob pattern. `excludePatterns` skips folders such as `node_modules`.',
      '`directory_tree`: returns the folder structure as JSON, also with `excludePatterns`.',
      '`get_file_info`: size, dates, type, permissions and hard-link count.',
      '`list_allowed_directories`: shows which folders the server may use.',
    ] },
    { p: 'The server marks its tools with MCP hints. The read tools are flagged read-only, and `write_file`, `edit_file` and `move_file` are flagged destructive, so clients that ask before risky actions can tell them apart.' },

    { h2: 'Things worth knowing before you let it write', id: 'caveats' },
    { ul: [
      '**Overwrites aren\'t crash-safe.** Since 1.0.0, `write_file` and `edit_file` write into the existing file instead of swapping in a new copy. The file keeps its permissions and links, but a crash halfway through can leave it partly written. Use git or backups for anything that matters.',
      '**Read-only files are refused** rather than replaced.',
      '**Hard links reach outside the allowed folders.** The folder check looks at the path you pass, not every name a file has. pnpm, for example, hard-links package files into `node_modules` from a shared store, so editing one there changes it everywhere. `get_file_info` shows `hardLinks`; anything above 1 means the file has other names.',
      '**Moving across disks** works for single files since 2.1.0 (copy, then delete the original). Folders still can\'t be moved between disks or mounts; move the files one at a time.',
      '**Big messages close the connection.** Since 2.0.0, a single message over 10 MiB closes the stdio connection.',
    ] },

    { h2: 'Slow or huge folders', id: 'slow-folders' },
    { p: 'Folders synced by cloud storage (macOS `~/Library/CloudStorage`, iCloud Drive) or a slow network drive can stall while the provider fetches file details. Since 2.1.0 the server gives up after 15 seconds with `Filesystem call timed out after 15000 ms` and the path. `search_files` and `directory_tree` also stop with an error after visiting 100,000 entries, instead of returning a partial list.' },
    { p: 'For either error, ask for a narrower folder, or name the slow or large folder in `excludePatterns` (for example `node_modules` or `.git`). Better still, don\'t allow a cloud-synced folder at all if you can point the server at a local copy.' },

    { h2: 'Updating from an older version', id: 'updating' },
    { p: 'The server used date-style versions (2025.x, 2026.x) before switching to normal version numbers at 1.0.0 in October 2026. By version number, 2.1.0 is lower than any 2026.x release, so an existing install pinned to a 2026.x range won\'t update to it. To be sure which version you run, pin it:' },
    { code: 'npx -y @modelcontextprotocol/server-filesystem@2.1.0 /path/to/folder', lang: 'bash' },
    { p: 'What else changed in v2 across the reference servers: [MCP reference servers v2: what changed](/guides/mcp-reference-servers-v2-whats-changed/).' },

    { h2: 'Test it outside your client', id: 'test' },
    { p: 'The [MCP Inspector](/plugins/mcp-inspector/) can start the server and list its tools, which tells you whether a problem is the server or your client config:' },
    { code: 'npx -y @modelcontextprotocol/inspector --cli npx -y @modelcontextprotocol/server-filesystem@2.1.0 /path/to/folder --method tools/list', lang: 'bash' },
    { p: 'You should see the tools listed above. If this works but your client doesn\'t, the problem is in the client config, such as a wrong path or a missing `cmd /c` on Windows.' },

    { h2: 'Troubleshooting', id: 'troubleshooting' },
    { ul: [
      '**The server stops right after starting:** check `node --version` (2.x needs Node 24 or later) and that at least one folder is at the end of `args`. With no folders and a 2025-era client that doesn\'t support Roots, the server exits with status 1. For the client-side error, see [MCP error -32000](/guides/fix-mcp-error-32000-connection-closed/).',
      '**"Access denied - path outside allowed directories":** the AI asked for a path you didn\'t allow. Add the folder to `args`, or have it call `list_allowed_directories` first.',
      '**Every tool call fails saying no directories are allowed:** you started the server without folders and the client uses the 2026-07-28 protocol. Add at least one folder.',
      '**`spawn npx ENOENT` on Windows:** launch `npx` through `cmd /c` as the README does (shown above).',
      '**Timeouts on a cloud-synced folder such as iCloud Drive:** see [slow or huge folders](#slow-folders).',
    ] },

    { h2: 'FAQ', id: 'faq' },
    { h3: 'Is the Filesystem MCP server safe to use?' },
    { p: 'It\'s limited to the folders you list, and v2.0.1 tightened how paths are checked. Within those folders it can overwrite and move files, so share as little as you can, keep the work in git, and use a read-only setup when the AI only needs to read.' },
    { h3: 'Can I give it access to a single file?' },
    { p: 'Allowed directories are folders. With Docker you can mount a single file into `/projects`, which the README shows as an example.' },
    { h3: 'Does it work with clients other than these?' },
    { p: 'It runs locally over stdio, so it needs a client that can start local MCP servers. A client that can only connect to remote servers can\'t start it.' },
  ],
  related: ['filesystem-mcp', 'mcp-inspector', 'claude-code', 'codex-cli'],
  sources: [
    { label: 'Filesystem server README', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem' },
    { label: 'Filesystem server changelog (2.1.0, 2.0.1, 2.0.0, 1.0.0)', url: 'https://github.com/modelcontextprotocol/servers/blob/main/src/filesystem/CHANGELOG.md' },
    { label: 'npm: @modelcontextprotocol/server-filesystem (version and engines)', url: 'https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem' },
    { label: 'MCP specification 2026-07-28: deprecated features (Roots)', url: 'https://modelcontextprotocol.io/specification/2026-07-28/deprecated' },
    { label: 'MCP Inspector CLI README', url: 'https://github.com/modelcontextprotocol/inspector/blob/main/clients/cli/README.md' },
  ],
};

export const TUTORIAL_GUIDES: Guide[] = [agentsSdk, filesystem];
