# Plugin JSON schema (content/plugins/<slug>.json)
slug, name, category, tags[], url, maker, what, who: string(s)
updated: "YYYY-MM-DD" — date the entry was last checked against the official docs (used for "Last checked" and sitemap lastModified)
setup: [{ text: string, code?: string, language?: "bash"|"json"|"powershell"|"markdown"|"text" }]
prompts: string[]  (each rendered as a copyable block)
