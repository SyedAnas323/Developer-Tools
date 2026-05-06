export const metadata = {
  title: 'Report Bug | MyToolsHub',
  description: 'Report a bug for any MyToolsHub tool.',
};

export default function ReportBugPage() {
  const email = 'waseemafzal31@gmail.com';
  const subject = encodeURIComponent('Bug Report - MyToolsHub');
  const body = encodeURIComponent(
    'Hello,%0D%0A%0D%0AI want to report a bug.%0D%0A%0D%0ATool URL:%0D%0ABug details:%0D%0ASteps to reproduce:%0D%0AScreenshot (optional):%0D%0A%0D%0AThanks.'
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 text-slate-900">
        <h1 className="text-3xl font-bold">Report Bug</h1>
        <p className="mt-3 text-slate-600">
          Found an issue? Send complete details so we can fix it quickly.
        </p>
        <a
          href={`mailto:${email}?subject=${subject}&body=${body}`}
          className="mt-6 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Report via Email
        </a>
      </div>
    </main>
  );
}
