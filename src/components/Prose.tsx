export default function Prose({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (<article className="max-w-2xl mx-auto py-12 text-slate-700 dark:text-slate-300 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:mb-3 [&_a]:underline [&_a]:underline-offset-2">
    <h1 className="text-4xl font-bold text-navy dark:text-white">{title}</h1>
    <p className="text-sm text-slate-500 mt-2 mb-6">Last updated {updated}</p>{children}</article>);
}
