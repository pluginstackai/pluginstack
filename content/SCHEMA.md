# Plugin JSON schema (content/plugins/<slug>.json)
slug, name, category, tags[], url, maker, what, who: string(s)
demo (optional): { youtubeId, title, channel, channelUrl } — official demo video, embedded click-to-load from youtube-nocookie.com. Only videos from the tool's official YouTube channel (or linked from its official site/docs/README), embeddable (YouTube oEmbed returns 200; author_name/author_url = the official channel), current and about this tool. Never download or re-host. Omit if none qualifies.
updated: "YYYY-MM-DD" — date the entry was last checked against the official docs (used for "Last checked" and sitemap lastModified)
setup: [{ text: string, code?: string, language?: "bash"|"json"|"powershell"|"markdown"|"text" }]
prompts: string[]  (each rendered as a copyable block)
