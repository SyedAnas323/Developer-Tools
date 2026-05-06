export const metadata = {
  title: 'FAQ | MyToolsHub',
  description: 'Frequently asked questions about MyToolsHub tools.',
};

const faqs = [
  {
    q: 'Are all tools free to use?',
    a: 'Yes, MyToolsHub tools are free to use.',
  },
  {
    q: 'Do I need to sign up?',
    a: 'No signup is required for regular tool usage.',
  },
  {
    q: 'Are my files stored permanently?',
    a: 'Files are processed for the task and are not intended for permanent storage.',
  },
  {
    q: 'Can I use these tools on mobile?',
    a: 'Yes, tools are accessible on both desktop and mobile browsers.',
  },
  {
    q: 'How can I report an issue?',
    a: 'Use the Report Bug page or email support directly.',
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 text-slate-900">
        <h1 className="text-3xl font-bold">FAQ</h1>
        <div className="mt-6 space-y-4">
          {faqs.map((item) => (
            <article key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">{item.q}</h2>
              <p className="mt-2 text-slate-600">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
