import EmailForm from '../../components/EmailForm';
export const metadata = { title: 'Get unstuck: vibe-coded app rescue', description: 'Your AI-built app broke? Join the waitlist for a human-plus-AI rescue service.', alternates: { canonical: '/get-unstuck/' } };
export default function Page() {
  return (<div className="max-w-2xl mx-auto py-12 text-center"><span className="text-xs uppercase tracking-widest text-coral-dark dark:text-coral">Coming soon</span>
    <h1 className="text-4xl md:text-5xl font-bold mt-2">Vibe-coded app stuck?</h1>
    <p className="text-slate-600 dark:text-slate-400 mt-4">Build won't pass, auth is broken, the agent keeps going in circles. We'll help untangle it and get you shipping again.</p>
    <ul className="text-left card mt-8 space-y-2 text-slate-700 dark:text-slate-300"><li>🛠 Fix broken builds & deploys</li><li>🔐 Untangle auth, database & payments</li><li>🧹 Clean up AI-generated spaghetti</li></ul>
    <div className="mt-8"><EmailForm list="waitlist" cta="Join waitlist" extra="What's broken? (optional)" /></div></div>);
}
