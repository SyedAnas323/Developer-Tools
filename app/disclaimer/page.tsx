export const metadata = {
  title: 'Disclaimer | MyToolsHub',
  description: 'Disclaimer for MyToolsHub free online tools.',
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 text-slate-900">
        <h1 className="text-3xl font-bold">Disclaimer</h1>
        <p className="mt-3 text-slate-600">Last updated: May 6, 2026</p>

        <div className="mt-6 space-y-4 text-slate-700">
          <p>MyToolsHub provides utility tools for informational and productivity purposes.</p>
          <p>We do not guarantee absolute accuracy, completeness, or uninterrupted availability.</p>
          <p>Users are responsible for verifying output before official, legal, or business use.</p>
          <p>External links and third-party services are governed by their own policies.</p>
        </div>
      </div>
    </main>
  );
}
