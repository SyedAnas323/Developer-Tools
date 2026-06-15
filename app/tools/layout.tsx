'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOL_FAQS } from './faq-data';
import { ToolBreadcrumbSchema, ToolWebApplicationSchema } from './metadata';

type ToolContent = {
  title: string;
  steps: string[];
  advantages: string[];
  download?: string;
} | null;

const TOOL_CONTENT: Record<string, ToolContent> = {
  'background-remover': null,
  'edit-pdf': null,
  'favicon-generator': null,
  'image-cropper': null,
  'json-formatter': null,
  'image-compressor': null,
  'image-resizer': null,
  'image-format-converter': null,
  'image-to-pdf': null,
  'pdf-merge': null,
  'pdf-compressor': null,
  'password-generator': null,
  'qr-generator': null,
  'word-counter': null,
  'word-to-pdf': null,
  'youtube-thumbnail': null,
  'youtube-downloader': null,
};

const TOOL_LABELS: Record<string, string> = {
  'background-remover': 'Background Remover',
  'edit-pdf': 'Edit PDF',
  'favicon-generator': 'Favicon Generator',
  'image-compressor': 'Image Compressor',
  'image-cropper': 'Image Cropper',
  'image-format-converter': 'Image Format Converter',
  'image-resizer': 'Image Resizer',
  'image-to-pdf': 'Image To PDF',
  'json-formatter': 'JSON Formatter',
  'password-generator': 'Password Generator',
  'pdf-compressor': 'PDF Compressor',
  'pdf-merge': 'PDF Merge',
  'qr-generator': 'QR Generator',
  'word-counter': 'Word Counter',
  'word-to-pdf': 'Word To PDF',
  'youtube-downloader': 'YouTube Downloader',
  'youtube-thumbnail': 'YouTube Thumbnail Downloader',
};

const RELATED_LINKS: Record<string, Array<{ href: string; anchor: string }>> = {
  'image-compressor': [
    { href: '/tools/image-resizer', anchor: 'resize image online free' },
    { href: '/tools/image-format-converter', anchor: 'convert image format online' },
  ],
  'pdf-compressor': [
    { href: '/tools/image-compressor', anchor: 'compress images online free' },
    { href: '/tools/pdf-merge', anchor: 'merge pdf files online free' },
  ],
  'image-resizer': [
    { href: '/tools/image-compressor', anchor: 'compress image online' },
    { href: '/tools/image-cropper', anchor: 'crop image online free' },
  ],
  'image-format-converter': [
    { href: '/tools/image-compressor', anchor: 'reduce image file size online' },
    { href: '/tools/image-resizer', anchor: 'resize image dimensions in pixels' },
  ],
  'favicon-generator': [
    { href: '/tools/image-format-converter', anchor: 'convert png to ico-friendly format' },
    { href: '/tools/background-remover', anchor: 'remove image background online' },
  ],
  'background-remover': [
    { href: '/tools/image-compressor', anchor: 'compress photos online free' },
    { href: '/tools/favicon-generator', anchor: 'generate favicon online free' },
  ],
  'pdf-merge': [
    { href: '/tools/pdf-compressor', anchor: 'compress pdf online free' },
    { href: '/tools/word-to-pdf', anchor: 'convert word to pdf online' },
  ],
};

function ToolInfoSection({ content }: { content: ToolContent }) {
  if (!content) {
    return null;
  }

  return (
    <section className="mx-auto mt-10 max-w-6xl px-4 pb-12">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">How To Use This Tool</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            {content.steps.map((step, index) => (
              <p key={step}>
                <strong>{index + 1}.</strong> {step}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Advantages Of This Tool</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            {content.advantages.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>

      {content.download && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">How Download Works</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{content.download}</p>
        </div>
      )}
    </section>
  );
}

function ToolFaqSection({ slug }: { slug: string }) {
  const faqItems = TOOL_FAQS[slug as keyof typeof TOOL_FAQS] || [];
  if (!faqItems.length) return null;

  return (
    <section className="mx-auto mt-4 max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">FAQs</h2>
        <div className="mt-4 space-y-4">
          {faqItems.map(([question, answer]) => (
            <article key={question} className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-base font-semibold text-slate-900">{question}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedToolsSection({ slug }: { slug: string }) {
  const links = RELATED_LINKS[slug] || [];
  if (!links.length) return null;

  return (
    <section className="mx-auto mt-4 max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Related Tools</h2>
        <p className="mt-2 text-sm text-slate-600">
          Explore related workflows to complete your task faster.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              {item.anchor}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split('/').filter(Boolean).at(-1) || '';
  const content = TOOL_CONTENT[slug as keyof typeof TOOL_CONTENT];
  const toolLabel = content?.title || TOOL_LABELS[slug] || slug;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      {children}
      {slug !== 'word-counter' && slug !== 'password-generator' && slug !== 'json-formatter' && slug !== 'favicon-generator' && slug !== 'image-cropper' && slug !== 'youtube-thumbnail' && slug !== 'youtube-downloader' ? <ToolBreadcrumbSchema slug={slug} label={toolLabel} /> : null}
      {slug !== 'word-counter' && slug !== 'password-generator' && slug !== 'json-formatter' && slug !== 'favicon-generator' && slug !== 'image-cropper' && slug !== 'youtube-thumbnail' && slug !== 'youtube-downloader' ? (
        <ToolWebApplicationSchema
          slug={slug}
          name={toolLabel}
          description={`Use ${toolLabel} online for free on MyToolsHub. Fast, browser-based workflow with instant results.`}
        />
      ) : null}
      <ToolInfoSection content={content} />
      {slug !== 'pdf-compressor' && slug !== 'pdf-merge' && slug !== 'word-counter' && slug !== 'password-generator' && slug !== 'json-formatter' && slug !== 'favicon-generator' && slug !== 'image-cropper' && slug !== 'youtube-thumbnail' && slug !== 'youtube-downloader' ? <RelatedToolsSection slug={slug} /> : null}
      {slug !== 'image-resizer' && slug !== 'pdf-compressor' && slug !== 'pdf-merge' && slug !== 'word-counter' && slug !== 'word-to-pdf' && slug !== 'image-to-pdf' && slug !== 'qr-generator' && slug !== 'image-format-converter' && slug !== 'password-generator' && slug !== 'json-formatter' && slug !== 'favicon-generator' && slug !== 'image-cropper' && slug !== 'youtube-thumbnail' && slug !== 'youtube-downloader' ? <ToolFaqSection slug={slug} /> : null}
    </div>
  );
}
