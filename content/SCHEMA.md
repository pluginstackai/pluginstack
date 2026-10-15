# Plugin JSON schema (content/plugins/<slug>.json)
slug, name, category, tags[], url, maker, what, who: string(s)
setup: [{ text: string, code?: string, language?: "bash"|"json"|"powershell"|"markdown"|"text" }]
prompts: string[]  (each rendered as a copyable block)
