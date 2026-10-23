// Client-safe newsletter copy, tied to site.config.json "emailSendingEnabled" (see lib/resend.ts).
// While sending is paused (no physical mailing address yet, CAN-SPAM), the copy says the newsletter is starting soon.
// Flip emailSendingEnabled to true and the normal "weekly email" copy comes back everywhere.
import site from '../../site.config.json';
export const NEWSLETTER_LIVE = (site as any).emailSendingEnabled === true;

/** Instant freebie download after newsletter subscribe (no marketing email required while sending is paused). */
export const FREEBIE = {
  path: '/freebies/mcp-starter-checklist.md',
  title: 'MCP Starter Setup Checklist',
  homeHeadline: 'Free MCP Starter Checklist',
  homeSubline: 'One page: Inspector smoke-test, Claude Code + Cursor connect steps, and the stdout gotcha. Join the list and download it free.',
  homeCta: 'Send me the checklist',
  homeMicro: 'Instant download + PluginStack Weekly when it launches (starting soon). Unsubscribe anytime.',
  toolHeadline: 'Free: MCP Starter Checklist',
  toolSubline: "After you set this tool up, use the one-page checklist so your next MCP server doesn't fail on first connect.",
  toolCta: 'Get the free checklist',
  toolMicro: 'Markdown download + occasional PluginStack updates. No spam.',
  successLead: "You're on the list. Download your free checklist:",
  upsell: 'Want Claude Code skills and 10 scaffolding prompts that do this for you?',
  upsellCta: 'Agent Builder Rules + Prompts — $15',
  upsellUrl: 'https://pluginstackai.gumroad.com/l/yrxliv',
} as const;

export const NEWSLETTER = NEWSLETTER_LIVE ? {
  homeCta: 'Get weekly picks',
  footer: 'PluginStack Weekly: one email a week with new AI tools, plus occasional offers on our packs.',
  notice: 'Weekly email with new AI tools, plus occasional offers on our packs. Unsubscribe anytime. From PluginStack (pluginstackai@gmail.com).',
  privacy: 'to send PluginStack Weekly, a weekly email with new AI tools, plus occasional offers on our paid packs.',
  sponsor: 'Featured spot in the weekly email.',
  sponsorTitle: 'Newsletter feature',
  subscribed: "You're subscribed. Thanks!",
  inlineTitle: 'Get weekly picks',
  inlineBlurb: 'New AI plugins, MCP servers and setup guides like this one, in one email a week.',
} : {
  homeCta: FREEBIE.homeCta,
  footer: 'PluginStack Weekly (starting soon): one email a week with new AI tools, plus occasional offers on our packs. Join the list now and get the free MCP Starter Checklist.',
  notice: FREEBIE.homeMicro + ' From PluginStack (pluginstackai@gmail.com).',
  privacy: "to send PluginStack Weekly (starting soon; we haven't sent any issues yet), a weekly email with new AI tools, plus occasional offers on our paid packs, and to deliver the free MCP Starter Checklist download.",
  sponsor: 'Featured spot in the weekly email, once PluginStack Weekly launches.',
  sponsorTitle: 'Newsletter feature (coming soon)',
  subscribed: "You're on the list for PluginStack Weekly. We'll email you when the first issue goes out.",
  inlineTitle: FREEBIE.toolHeadline,
  inlineBlurb: FREEBIE.toolSubline,
};
