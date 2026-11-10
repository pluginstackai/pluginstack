import EmailForm from './EmailForm';
import { GUIDE_NEWSLETTER } from '../lib/email-copy';

/** Plain newsletter signup used on every guide page (existing /api/subscribe newsletter list). */
export default function GuideNewsletter({ id }: { id: string }) {
  return (
    <section aria-labelledby={id} className="card">
      <h2 id={id} className="text-lg font-semibold">{GUIDE_NEWSLETTER.title}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">{GUIDE_NEWSLETTER.blurb}</p>
      <EmailForm list="newsletter" cta={GUIDE_NEWSLETTER.cta} microcopy={GUIDE_NEWSLETTER.micro} />
    </section>
  );
}
