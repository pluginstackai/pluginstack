// Welcome email sent to new newsletter subscribers.
const NAVY = '#0F2350';
const CORAL = '#F26B5B';
import site from '../../site.config.json';
const SITE = 'https://www.pluginstackai.com';
const esc = (t: string) => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
// Postal address for CAN-SPAM. Set "mailingAddress" in site.config.json (e.g. a PO box or virtual mailbox).
// While it's empty, no address line is rendered. TODO(owner): fill it in before sending promotional email.
const ADDRESS = ((site as any).mailingAddress || '').trim();
const WHY = "You're getting this because you signed up for PluginStack Weekly at pluginstackai.com.";


export const WELCOME_SUBJECT = "You're in. Welcome to PluginStack 🔌";

export const welcomeText = (unsubscribeUrl: string) => `Hey, thanks for subscribing!

Every week, PluginStack sends you the best new AI plugins, MCP servers and agent tools, each one checked against official docs, with copy-paste setup so you can try it in minutes.

Here's what you'll get:
- The 3 to 5 most useful new tools of the week, and why they matter
- A quick setup snippet for each one
- The occasional prompt pack or rules pack to speed up your vibe coding

While you wait for the first issue, browse the full showcase at pluginstackai.com (${SITE}).

Have a tool we should feature? Just hit reply, and it comes straight to us.

The PluginStack team

--
PluginStack · ${WHY}
Unsubscribe: ${unsubscribeUrl}
${ADDRESS ? ADDRESS + '\n' : ''}`;

export const welcomeHtml = (unsubscribeUrl: string) => `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f6fa;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fa;padding:24px 0;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${NAVY};font-size:16px;line-height:1.6;">
<tr><td style="background:${NAVY};padding:20px 32px;color:#ffffff;font-size:20px;font-weight:700;">Plugin<span style="color:${CORAL};">Stack</span></td></tr>
<tr><td style="border-top:4px solid ${CORAL};padding:28px 32px;">
<p style="margin:0 0 16px;font-size:18px;font-weight:700;">Hey, thanks for subscribing!</p>
<p style="margin:0 0 16px;">Every week, PluginStack sends you the best new AI plugins, MCP servers and agent tools, each one checked against official docs, with copy-paste setup so you can try it in minutes.</p>
<p style="margin:0 0 8px;font-weight:700;">Here's what you'll get:</p>
<ul style="margin:0 0 16px;padding-left:20px;">
<li>The 3 to 5 most useful new tools of the week, and why they matter</li>
<li>A quick setup snippet for each one</li>
<li>The occasional prompt pack or rules pack to speed up your vibe coding</li>
</ul>
<p style="margin:0 0 16px;">While you wait for the first issue, browse the full showcase at <a href="${SITE}" style="color:${CORAL};font-weight:700;">pluginstackai.com</a>.</p>
<p style="margin:0 0 16px;">Have a tool we should feature? Just hit reply, and it comes straight to us.</p>
<p style="margin:0;">The PluginStack team</p>
</td></tr>
<tr><td style="padding:16px 32px 24px;border-top:1px solid #e5e7eb;font-size:12px;line-height:1.5;color:#64748b;">
<p style="margin:0 0 6px;"><b>PluginStack</b> · ${WHY}</p>
<p style="margin:0 0 6px;"><a href="${esc(unsubscribeUrl)}" style="color:#64748b;">Unsubscribe</a> · <a href="${SITE}/privacy/" style="color:#64748b;">Privacy policy</a></p>
${ADDRESS ? `<p style="margin:0;">${esc(ADDRESS)}</p>` : ''}
</td></tr></table></td></tr></table>
</body></html>`;
