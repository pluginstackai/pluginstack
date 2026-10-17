import Prose from '../../components/Prose';
import { site } from '../../lib/data';
export const metadata = { title: 'Disclosures', description: `How ${site.name} handles sponsorships, affiliate links and independence.`, alternates: { canonical: '/disclosures/' } };
export default function Page() {
  return (<Prose title="Disclosures" updated="October 16, 2026">
    <h2>Not affiliated</h2>
    <p><b>Not affiliated with or endorsed by the listed companies; trademarks belong to their owners.</b> {site.name} is an independent site. We mention product names only to describe what each tool is and what it works with.</p>
    <h2>Sponsorships</h2>
    <ul>
      <li>Sponsors pay for placement in the site-wide banner and the newsletter.</li>
      <li>Every paid placement is labeled: the banner reads “Sponsored · sponsor name”, and newsletter features have a “SPONSORED” label at the top of the block.</li>
      <li>Sponsorship doesn't affect which tools we pick or what we say about them. Sponsors don't get to review or edit our directory pages.</li>
      <li>Sponsored posts on X will use X's paid-partnership label and say “Sponsored” or “#ad”.</li>
    </ul>
    <h2>Affiliate links</h2>
    <p>Right now we don't use affiliate links. If we add any, the link will be marked “(affiliate)” next to it, and it means we may earn a commission if you buy, at no extra cost to you. Affiliate deals don't affect what we feature.</p>
    <h2>Our own products</h2>
    <p>We sell our own prompt and rules packs. When we mention them in the newsletter or on the site, it's because they're ours.</p>
    <h2>How we check pages</h2>
    <p>Directory pages are checked against official docs. Tools change often, so if something is out of date, tell us at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.</p>
  </Prose>);
}
