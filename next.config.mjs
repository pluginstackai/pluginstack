/** @type {import('next').NextConfig} */
// No `output: 'export'`: Vercel runs /api/* as serverless functions; all pages remain statically generated.
export default { images: { unoptimized: true }, trailingSlash: true };
