// Open Graph/Twitter tags for /packs/. Title, description and canonical come from page.tsx (kept there; page metadata overrides these).
import { pageMeta } from '../../lib/seo';
const { openGraph, twitter } = pageMeta({ title: 'Prompt & Rules Packs', description: 'Ready-made Cursor rules and prompt packs for AI coding, $5–$20.', path: '/packs/' });
export const metadata = { openGraph, twitter };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
