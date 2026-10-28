import { pageMeta } from '../../lib/seo';
import Prose from '../../components/Prose';
import { site } from '../../lib/data';
import { NEWSLETTER } from '../../lib/email-copy';
export const metadata = pageMeta({ title: 'Privacy Policy', description: `How ${site.name} collects and uses your information.`, path: '/privacy/' });
export default function Page() {
  const addr = site.mailingAddress?.trim();
  return (<Prose title="Privacy Policy" updated="October 28, 2026">
    <p>{site.name} is a free directory of AI plugins, MCP servers and agent tools, run by {site.name} and based in the USA. This page explains, in plain English, what we collect and what we do with it.</p>
    <h2>What we collect</h2>
    <ul>
      <li><b>Your email address</b>, when you sign up for the newsletter, join the Get unstuck waitlist, or ask about sponsorship.</li>
      <li><b>Your order details, if you buy a pack</b>: Gumroad shares your email address, name (if given), what you bought, the price paid and your country with us so we can deliver and support your purchase. We never see your card or bank details.</li>
      <li><b>Anything you type in the optional note field</b> (for example “what's broken” on the waitlist, or your company name on the sponsor form).</li>
      <li><b>Your IP address</b>, briefly and in memory only, to rate-limit signups and block spam. We don't store it in a database.</li>
      <li><b>Anonymous, aggregate site statistics</b> via <a href="https://www.cloudflare.com/web-analytics/">Cloudflare Web Analytics</a>, a privacy-first analytics tool: it uses no cookies, doesn't track you across sites or build a profile of you, and only gives us totals such as page views, referring sites, country, and device/browser type.</li>
      <li>Standard server logs kept by our hosting provider. We don't use advertising trackers, cookies for tracking, or sell data. (The Gumroad checkout on the packs page is run by Gumroad; see below.)</li>
    </ul>
    <h2>Why we use it</h2>
    <ul>
      <li><b>Newsletter:</b> {NEWSLETTER.privacy}</li>
      <li><b>Waitlist:</b> to tell you when the Get unstuck service opens and to understand your problem.</li>
      <li><b>Sponsor form:</b> to reply to your sponsorship enquiry.</li>
      <li><b>Pack orders:</b> to deliver your pack, answer support and refund requests, and keep records we're required to keep.</li>
    </ul>
    <p>Joining the waitlist or sending the sponsor form doesn't sign you up for the newsletter.</p>
    <h2>Who processes it for us</h2>
    <ul>
      <li><a href="https://resend.com/legal/privacy-policy">Resend</a>: stores our contact lists and sends our emails.</li>
      <li><a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a>: hosts this website, provides our CDN and DNS, and provides our cookieless Web Analytics.</li>
      <li>Google (Gmail): our business inbox, where waitlist and sponsor messages are delivered.</li>
      <li><a href="https://gumroad.com/privacy">Gumroad</a>: runs checkout and payments for our packs as the seller of record, and delivers your files. We never see your card details.</li>
    </ul>
    <h2>Buying a pack (Gumroad checkout)</h2>
    <p>Our packs are sold through Gumroad. The packs page loads Gumroad's checkout script (gumroad.js) from gumroad.com, so Gumroad receives information such as your IP address and the page you're on when you visit that page, and may store data on your device. When you click a Buy button, Gumroad's checkout opens over the page (or on gumroad.com) and Gumroad collects your payment and contact details directly. Checkout and payments are handled by Gumroad, and <a href="https://gumroad.com/privacy">Gumroad's privacy policy</a> applies to what Gumroad collects.</p>
    <h2>Embedded YouTube videos</h2>
    <p>Some listing pages include an official demo video from YouTube (owned by Google), embedded in YouTube's privacy-enhanced mode (youtube-nocookie.com). The video player loads from YouTube only when you click play. Until then the page shows only a preview image, which your browser fetches from YouTube's image server (i.ytimg.com) when you scroll to it; we don't send it the page address. Once you click play, YouTube receives information such as your IP address and the page you're on, may store data on your device, and <a href="https://policies.google.com/privacy">Google's privacy policy</a> applies.</p>
    <h2>How long we keep it</h2>
    <p>We keep your email for as long as you're subscribed or on the waitlist. If you unsubscribe, we keep a record that you opted out so we don't email you again. Ask us to delete it and we will. Pack order records are kept as long as tax and accounting rules require.</p>
    <h2>Your choices</h2>
    <ul>
      <li><b>Unsubscribe</b> anytime with the link at the bottom of every email.</li>
      <li><b>Access or delete your data:</b> email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> and we'll handle it, usually within a few days.</li>
      <li>If you're in the EU/UK, you also have the right to object, to correct your data, and to complain to your local data protection authority.</li>
    </ul>
    <h2>Children</h2>
    <p>This site isn't directed at children under 13, and we don't knowingly collect their information.</p>
    <h2>Changes</h2>
    <p>If we change this policy, we'll update the date at the top of this page.</p>
    <h2>Contact</h2>
    <p>{site.name}, based in the USA. Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>{addr ? <> · Mail: {addr}</> : null}</p>
  </Prose>);
}
