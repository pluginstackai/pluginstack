import { site } from './data';

export const BADGE_PATH = '/badge/hand-checked.svg';
export const BADGE_ALT = 'Hand-checked on PluginStack';
const badgeSrc = () => `${site.url}${BADGE_PATH}`;
const listingUrl = (slug: string) => `${site.url}/plugins/${slug}/`;

/** Copy-paste snippets for a tool's README or website. They link to that tool's PluginStack listing. */
export const badgeMarkdown = (slug: string) => `[![${BADGE_ALT}](${badgeSrc()})](${listingUrl(slug)})`;
export const badgeHtml = (slug: string) =>
  `<a href="${listingUrl(slug)}"><img src="${badgeSrc()}" alt="${BADGE_ALT}" width="226" height="28"></a>`;
