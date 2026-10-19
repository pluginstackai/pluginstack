import Prose from '../../components/Prose';
import { site } from '../../lib/data';
export const metadata = { title: 'Terms of Service', description: `The terms for using ${site.name}: the free directory, third-party tools, packs, the newsletter, warranty and liability limits.`, alternates: { canonical: '/terms/' } };
export default function Page() {
  return (<Prose title="Terms of Service" updated="October 19, 2026">
    <p>These terms apply when you use {site.url.replace('https://', '')} and anything we sell. By using the site, you agree to them.</p>
    <h2>The directory</h2>
    <p>The plugin pages are free to read. We check them against official docs, but tools change fast. Information is provided “as is”, and we can't promise any third-party tool will work as described. Always review commands before you run them, especially anything that touches your files, accounts or payments.</p>
    <h2>Third-party tools</h2>
    <p>The tools we list are made by other companies. Your use of them is governed by their own terms. {site.name} is independent and not affiliated with or endorsed by the listed companies; trademarks belong to their owners.</p>
    <h2 id="packs">Packs: license &amp; refunds</h2>
    <ul>
      <li>You get a personal and commercial-use license to use pack contents in your own projects and your clients' projects.</li>
      <li>You may not resell, redistribute or share the pack files themselves.</li>
      <li>Payments are handled by Gumroad. Refunds follow the policy shown on each product page.</li>
    </ul>
    <h2>Newsletter</h2>
    <p>The newsletter is free. You can unsubscribe anytime using the link in any email.</p>
    <h2>No warranty and limits on liability</h2>
    <p>To the extent the law allows, the site and packs come without warranties, and {site.name} isn't liable for indirect or consequential losses. Our total liability for any claim is limited to what you paid us in the last 12 months.</p>
    <h2>Governing law</h2>
    <p>These terms are governed by the laws of the State of Colorado, USA.</p>
    <h2>Changes and contact</h2>
    <p>We may update these terms and will change the date above when we do. Questions: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.</p>
  </Prose>);
}
