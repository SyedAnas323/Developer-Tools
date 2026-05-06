export const metadata = {
  title: 'Feature Request | MyToolsHub',
  description: 'Send feature requests for MyToolsHub tools.',
};

export default function FeatureRequestPage() {
  const email = 'waseemafzal31@gmail.com';
  const subject = encodeURIComponent('Feature Request - MyToolsHub');
  const body = encodeURIComponent(
    'Hello,%0D%0A%0D%0AI want to request a new feature.%0D%0A%0D%0ATool URL (if related):%0D%0AFeature details:%0D%0AWhy this helps:%0D%0A%0D%0AThanks.'
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 text-slate-900">
        <h1 className="text-3xl font-bold">Feature Request</h1>
        <p className="mt-3 text-slate-600">
          Share the feature you want and why it is useful.
        </p>
        <a
          href={`mailto:${email}?subject=${subject}&body=${body}`}
          className="mt-6 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Send Request via Email
        </a>
      </div>
    </main>
  );
}
