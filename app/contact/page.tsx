import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | MyToolsHub',
  description: 'Contact MyToolsHub for support, complaints, and requests.',
};

export default function ContactPage() {
  const email = 'waseemafzal31@gmail.com';
  const subject = encodeURIComponent('MyToolsHub Support Request');
  const body = encodeURIComponent(
    'Hello MyToolsHub Team,%0D%0A%0D%0APlease help me with:%0D%0A%0D%0ATool URL:%0D%0AIssue/Request:%0D%0A%0D%0AThanks.'
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 text-slate-900">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-3 text-slate-600">
        For any complaint, support issue, or request, email us directly.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Support Email</p>
        <p className="mt-1 text-lg font-semibold">{email}</p>
        <a
          href={`mailto:${email}?subject=${subject}&body=${body}`}
          className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Send Email
        </a>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        You can also use <Link className="text-blue-600 underline" href="/report-bug">Report Bug</Link> and{' '}
        <Link className="text-blue-600 underline" href="/feature-request">Feature Request</Link> pages.
      </div>
      </div>
    </main>
  );
}
