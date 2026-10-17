import type { MetadataRoute } from 'next';
import { site } from '../lib/data';
export const dynamic = 'force-static';
// API routes (subscribe, sponsor, unsubscribe) aren't pages; they also send X-Robots-Tag: noindex (next.config.mjs).
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${site.url}/sitemap.xml` }; }
