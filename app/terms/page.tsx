export const metadata = {
  title: 'Terms of Use | MyToolsHub',
  description: 'Terms of use for MyToolsHub free online tools.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 text-slate-900">
        <h1 className="text-3xl font-bold">Terms of Use</h1>
        <p className="mt-3 text-slate-600">Last updated: May 6, 2026</p>

        <div className="mt-6 space-y-4 text-slate-700">
          <p>By using MyToolsHub, you agree to use the tools lawfully and responsibly.</p>
          <p>Do not upload illegal, harmful, or copyrighted material without permission.</p>
          <p>Tools are provided as-is without warranties of uninterrupted service.</p>
          <p>We may update or remove tools and policies at any time.</p>
        </div>
      </div>
    </main>
  );
}
