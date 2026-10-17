// Open Graph/Twitter tags for /terms/. Title, description and canonical come from page.tsx (kept there; page metadata overrides these).
import { pageMeta } from '../../lib/seo';
import { site } from '../../lib/data';
const { openGraph, twitter } = pageMeta({ title: 'Terms of Service', description: `The terms for using ${site.name}: the free directory, third-party tools, packs, the newsletter, warranty and liability limits.`, path: '/terms/' });
export const metadata = { openGraph, twitter };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
