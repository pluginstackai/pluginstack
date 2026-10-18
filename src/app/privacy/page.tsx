import { pageMeta } from '../../lib/seo';
import Prose from '../../components/Prose';
import { site } from '../../lib/data';
import { NEWSLETTER } from '../../lib/email-copy';
export const metadata = pageMeta({ title: 'Privacy Policy', description: `How ${site.name} collects and uses your information.`, path: '/privacy/' });
export default function Page() {
  const addr = site.mailingAddress?.trim();
  return (<Prose title="Privacy Policy" updated="October 18, 2026">
    <p>{site.name} is a free directory of AI plugins, MCP servers and agent tools, run by Kyle in Colorado, USA. This page explains, in plain English, what we collect and what we do with it.</p>
    <h2>What we collect</h2>
    <ul>
      <li><b>Your email address</b>, when you sign up for the newsletter, join the Get unstuck waitlist, or ask about sponsorship.</li>
      <li><b>Anything you type in the optional note field</b> (for example “what's broken” on the waitlist, or your company name on the sponsor form).</li>
      <li><b>Your IP address</b>, briefly and in memory only, to rate-limit signups and block spam. We don't store it in a database.</li>
      <li>Standard server logs kept by our hosting provider. We don't use advertising trackers or sell data.</li>
    </ul>
    <h2>Why we use it</h2>
    <ul>
      <li><b>Newsletter:</b> {NEWSLETTER.privacy}</li>
      <li><b>Waitlist:</b> to tell you when the Get unstuck service opens and to understand your problem.</li>
      <li><b>Sponsor form:</b> to reply to your sponsorship enquiry.</li>
    </ul>
    <p>Joining the waitlist or sending the sponsor form doesn't sign you up for the newsletter.</p>
    <h2>Who processes it for us</h2>
    <ul>
      <li><a href="https://resend.com/legal/privacy-policy">Resend</a>: stores our contact lists and sends our emails.</li>
      <li><a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a>: hosts this website and provides our CDN and DNS.</li>
      <li>Google (Gmail): our business inbox, where waitlist and sponsor messages are delivered.</li>
      <li>When our packs go on sale, Gumroad will handle payments as the seller of record; we never see your card details.</li>
    </ul>
    <h2>How long we keep it</h2>
    <p>We keep your email for as long as you're subscribed or on the waitlist. If you unsubscribe, we keep a record that you opted out so we don't email you again. Ask us to delete it and we will.</p>
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
    <p>{site.name}, Kyle, Colorado, USA. Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>{addr ? <> · Mail: {addr}</> : null}</p>
  </Prose>);
}
