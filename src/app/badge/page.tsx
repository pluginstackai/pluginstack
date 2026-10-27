import Link from 'next/link';
import { pageMeta } from '../../lib/seo';
import { site } from '../../lib/data';
import { BADGE_ALT, BADGE_PATH, badgeHtml, badgeMarkdown } from '../../lib/badge';
import CodeBlock from '../../components/CodeBlock';

export const metadata = pageMeta({
  title: 'The "Hand-checked on PluginStack" badge',
  description: 'An optional badge makers can add to a README or website to show their tool is listed and hand-checked on PluginStack. Free, with no link-back requirement.',
  path: '/badge/',
});

export default function Page() {
  const example = 'context7';
  return (<article className="max-w-3xl mx-auto py-8 space-y-8 min-w-0">
    <div>
      <span className="text-xs uppercase tracking-widest text-coral-dark dark:text-coral">For makers</span>
      <h1 className="text-4xl font-bold mt-1">The &ldquo;Hand-checked on {site.name}&rdquo; badge</h1>
      <p className="text-slate-700 dark:text-slate-300 mt-4">If your tool has a listing on {site.name}, you can add this small badge to your README or website. It links to your listing, so people can see what the tool does and how to set it up.</p>
      <img src={BADGE_PATH} alt={BADGE_ALT} width={226} height={28} className="mt-5" />
    </div>
    <section className="card space-y-3 text-slate-700 dark:text-slate-300">
      <h2 className="text-xl font-semibold text-navy dark:text-white">It&apos;s optional</h2>
      <p>Listings are free. You don&apos;t have to add the badge, and we never ask for a link back. Leaving it off doesn&apos;t change your listing in any way.</p>
      <p>&ldquo;Hand-checked&rdquo; means a person read the tool&apos;s official docs and checked the setup steps on its listing. The date we last checked is shown at the top of each listing. It isn&apos;t a security audit or an endorsement.</p>
    </section>
    <section className="card space-y-3 min-w-0">
      <h2 className="text-xl font-semibold">Get the code</h2>
      <p className="text-slate-700 dark:text-slate-300">The easiest way: open your tool&apos;s listing and scroll to <strong>Add the badge</strong>. The snippets there already point to your listing. Or copy one of these and swap <code>{example}</code> for your listing&apos;s address.</p>
      <p className="text-xs text-slate-600 dark:text-slate-400">Markdown (for a GitHub README)</p>
      <CodeBlock code={badgeMarkdown(example)} language="markdown" />
      <p className="text-xs text-slate-600 dark:text-slate-400">HTML (for a website)</p>
      <CodeBlock code={badgeHtml(example)} language="html" />
      <p className="text-sm text-slate-700 dark:text-slate-300">The image is a plain SVG served from <code>{site.url.replace(/^https?:\/\//, '')}{BADGE_PATH}</code>. It has no tracking.</p>
    </section>
    <section className="card text-slate-700 dark:text-slate-300">
      <h2 className="text-xl font-semibold text-navy dark:text-white mb-2">Not listed yet?</h2>
      <p>Browse the <Link href="/" className="link">directory</Link> to find your tool. To suggest one, or to fix something on your listing, email <a href={`mailto:${site.contactEmail}`} className="link">{site.contactEmail}</a>.</p>
    </section>
  </article>);
}
