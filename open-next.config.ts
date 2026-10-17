import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site is fully prerendered (SSG, no ISR/revalidate), so serve prerendered pages from Workers static assets.
// No R2/KV needed. `opennextjs-cloudflare deploy/upload/preview` populate this cache automatically.
export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache, enableCacheInterception: true });
