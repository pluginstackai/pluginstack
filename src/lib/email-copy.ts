// Client-safe newsletter copy, tied to site.config.json "emailSendingEnabled" (see lib/resend.ts).
// While sending is paused (no physical mailing address yet, CAN-SPAM), the copy says the newsletter is starting soon.
// Flip emailSendingEnabled to true and the normal "weekly email" copy comes back everywhere.
import site from '../../site.config.json';
export const NEWSLETTER_LIVE = (site as any).emailSendingEnabled === true;
export const NEWSLETTER = NEWSLETTER_LIVE ? {
  homeCta: 'Get weekly picks',
  footer: 'PluginStack Weekly: one email a week with new AI tools, plus occasional offers on our packs.',
  notice: 'Weekly email with new AI tools, plus occasional offers on our packs. Unsubscribe anytime. From PluginStack (pluginstackai@gmail.com).',
  privacy: 'to send PluginStack Weekly, a weekly email with new AI tools, plus occasional offers on our paid packs.',
  sponsor: 'Featured spot in the weekly email.',
  sponsorTitle: 'Newsletter feature',
  subscribed: "You're subscribed. Thanks!",
} : {
  homeCta: 'Join the list',
  footer: 'PluginStack Weekly (starting soon): one email a week with new AI tools, plus occasional offers on our packs. Join the list now and get the first issue.',
  notice: "Join the list for PluginStack Weekly (starting soon). We'll email you once a week when it launches, plus occasional offers on our packs. Unsubscribe anytime. From PluginStack (pluginstackai@gmail.com).",
  privacy: "to send PluginStack Weekly (starting soon; we haven't sent any issues yet), a weekly email with new AI tools, plus occasional offers on our paid packs.",
  sponsor: 'Featured spot in the weekly email, once PluginStack Weekly launches.',
  sponsorTitle: 'Newsletter feature (coming soon)',
  subscribed: "You're on the list for PluginStack Weekly. We'll email you when the first issue goes out.",
};
