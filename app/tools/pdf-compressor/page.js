'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TOOL_FAQS } from '../faq-data';

const HOW_TO_STEPS = [
  'Upload the PDF file you want to compress.',
  'Let the tool process the document and create a smaller version.',
  'Check the original size and compressed size on screen.',
  'Download the optimized PDF and use it for email, storage, or uploads.',
];

const COMPRESSION_LEVEL_ROWS = [
  {
    level: 'Low',
    reduction: 'Small',
    qualityImpact: 'Minimal',
    bestUseCase: 'Text-heavy business files, contracts, forms',
  },
  {
    level: 'Medium',
    reduction: 'Balanced',
    qualityImpact: 'Low to moderate',
    bestUseCase: 'Reports, presentations, student assignments',
  },
  {
    level: 'High',
    reduction: 'Strong',
    qualityImpact: 'Noticeable on image-heavy pages',
    bestUseCase: 'Large scanned PDFs, archive copies, heavy attachments',
  },
];

const PDF_VS_ZIP_ROWS = [
  {
    feature: 'What it changes',
    pdfCompression: 'Reduces the size of one PDF document',
    zipCompression: 'Bundles files into an archive',
  },
  {
    feature: 'Best for',
    pdfCompression: 'Sending one smaller document',
    zipCompression: 'Grouping many files together',
  },
  {
    feature: 'Keeps PDF readable',
    pdfCompression: 'Yes',
    zipCompression: 'No, it only wraps the file',
  },
  {
    feature: 'Email use',
    pdfCompression: 'Great for one large PDF',
    zipCompression: 'Useful when sending multiple attachments',
  },
  {
    feature: 'When to use',
    pdfCompression: 'When the file itself is too large',
    zipCompression: 'When file count matters more than file size',
  },
];

const METHOD_ROWS = [
  {
    method: 'Image Compression',
    explanation: 'Shrinks embedded scans and photos inside the PDF.',
    impact: 'Often the biggest size savings.',
  },
  {
    method: 'Font Optimization',
    explanation: 'Keeps only the font data the document needs.',
    impact: 'Helps text-heavy PDFs stay light.',
  },
  {
    method: 'Metadata Removal',
    explanation: 'Removes extra author, editing, and system information.',
    impact: 'Saves small but useful amounts of space.',
  },
  {
    method: 'Object Compression',
    explanation: 'Rewrites PDF objects more efficiently.',
    impact: 'Improves structure without changing content.',
  },
];

const BUSINESS_CARDS = [
  {
    title: 'Invoices and Billing',
    text: 'Smaller invoices are easier to email to clients and archive in finance systems without wasting storage.',
  },
  {
    title: 'Contracts and Proposals',
    text: 'Teams often share contract drafts many times. Compression keeps the workflow fast and the attachment light.',
  },
  {
    title: 'Reports and Presentations',
    text: 'Large decks and reports often contain charts and graphics. Compression helps them move faster through approvals.',
  },
];

const STUDENT_CARDS = [
  {
    title: 'Assignments',
    text: 'Students often need to upload homework or project files to LMS platforms that prefer smaller PDFs.',
  },
  {
    title: 'Research Papers',
    text: 'Research papers with figures and references can get heavy, so compression helps before submission.',
  },
  {
    title: 'Portfolios',
    text: 'Portfolios with multiple pages benefit from a compact file that is easy to share with instructors or employers.',
  },
];

const EMAIL_CARDS = [
  {
    title: 'Faster Sending',
    text: 'Smaller PDFs attach more quickly and reduce the chance of hitting mailbox limits.',
  },
  {
    title: 'Better Delivery',
    text: 'Lean attachments are easier for recipients to open on mobile and slower connections.',
  },
  {
    title: 'Cleaner Workflow',
    text: 'One compressed file is simpler to manage than a large attachment that needs extra handling.',
  },
];

const STORAGE_CARDS = [
  {
    title: 'Less Space Used',
    text: 'Compression lowers the amount of cloud storage consumed by archived documents.',
  },
  {
    title: 'Faster Sync',
    text: 'Smaller files sync more quickly between devices and cloud services.',
  },
  {
    title: 'Easier Sharing',
    text: 'A reduced file is easier to pass around in shared folders, links, and team drives.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/pdf-merge', label: 'PDF Merge' },
  { href: '/tools/edit-pdf', label: 'Edit PDF' },
  { href: '/tools/word-to-pdf', label: 'Word To PDF' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/background-remover', label: 'Background Remover' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.feature || row.level || row.method} className="align-top">
                {Object.values(row).map((value, index) => (
                  <td
                    key={`${value}-${index}`}
                    className={`px-5 py-4 text-slate-600 ${index === 0 ? 'font-medium text-slate-900' : ''}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PdfCompressor() {
  const inputRef = useRef(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setPdfInfo(null);
    setLoading(false);
    setFileName('');
    setError('');
    setDownloadUrl('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const compressPdf = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setLoading(true);
    setError('');
    setPdfInfo(null);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf-compressor', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('PDF compression failed. Please try again.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setPdfInfo({
        name: file.name,
        originalSize: file.size,
        newSize: blob.size,
        downloadUrl: url,
      });
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try another PDF file.');
    } finally {
      setLoading(false);
    }
  };

  const currentFaqs = TOOL_FAQS['pdf-compressor'] || [];

  const originalSize = pdfInfo ? formatBytes(pdfInfo.originalSize) : 'Not uploaded yet';
  const compressedSize = pdfInfo ? formatBytes(pdfInfo.newSize) : 'Not generated yet';
  const savedBytes = pdfInfo ? Math.max(0, pdfInfo.originalSize - pdfInfo.newSize) : 0;
  const savedPercent = pdfInfo && pdfInfo.originalSize
    ? Math.max(0, Math.round((savedBytes / pdfInfo.originalSize) * 100))
    : 0;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Compress PDF Online Free - Reduce PDF File Size Fast | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/pdf-compressor',
    description:
      'Compress PDF files online for free in seconds. Make PDFs smaller for email, uploading, and sharing without losing text or image quality. No signup needed.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'MyToolsHub',
      url: 'https://toolshub.cyphersol.com',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://toolshub.cyphersol.com/images/tools-hub.png',
      width: 928,
      height: 269,
    },
    inLanguage: 'en',
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PDF Compressor',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://toolshub.cyphersol.com/tools/pdf-compressor',
    description:
      'Compress PDF files online for free, reduce PDF file size, and download a smaller document for sharing or storage.',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://toolshub.cyphersol.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://toolshub.cyphersol.com/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'PDF Compressor',
        item: 'https://toolshub.cyphersol.com/tools/pdf-compressor',
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Compress PDF Files Online',
    description:
      'Upload a PDF file, let the tool reduce the file size, review the output, and download the smaller PDF.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'PDF Compressor',
      },
    ],
    step: HOW_TO_STEPS.map((step) => ({
      '@type': 'HowToStep',
      name: step,
      text: step,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: currentFaqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-slate-900 via-red-700 to-orange-500 px-8 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              PDF Compressor Online
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Compress PDF Online Free
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Reduce PDF size in a browser-based workflow built for email attachments, business
              documents, student submissions, scanned files, and cloud uploads. Keep the document
              readable while making it smaller, lighter, and easier to share.
            </p>
          </div>

          <div className="p-8">
            {!pdfInfo && !loading ? (
              <div className="relative">
                <input
                  ref={inputRef}
                  id="pdf-compressor-input"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={compressPdf}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <label
                  htmlFor="pdf-compressor-input"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-red-200 bg-red-50 px-6 text-center transition hover:border-red-400 hover:bg-red-100/70"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600 shadow-sm ring-1 ring-red-100">
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Click to upload a PDF</p>
                  <p className="mt-2 text-sm text-slate-500">
                    PDF files only. Larger files usually show the biggest savings.
                  </p>
                </label>
              </div>
            ) : null}

            {loading ? (
              <div className="py-12 text-center">
                <div className="relative mx-auto mb-5 h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-4 border-red-200" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Compressing PDF...</h2>
                <p className="mt-2 text-sm text-slate-500">
                  The tool is optimizing the document structure and creating a smaller file.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-red-600">
                {error}
              </div>
            ) : null}

            {pdfInfo && !loading ? (
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        File Ready
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-900">{fileName}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Upload Another
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Original PDF
                    </p>
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm leading-7 text-slate-600">
                        {fileName} is the source document uploaded for compression.
                      </p>
                      <p className="mt-4 text-3xl font-bold text-slate-900">{originalSize}</p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Compressed PDF
                    </p>
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-sm leading-7 text-slate-600">
                        The optimized file is ready to download and use for sharing, archiving, or
                        uploading.
                      </p>
                      <p className="mt-4 text-3xl font-bold text-emerald-600">{compressedSize}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Saved
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                      {savedBytes ? formatBytes(savedBytes) : '—'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Reduction
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {savedPercent ? `${savedPercent}% smaller` : '—'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Status
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">Ready</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={pdfInfo.downloadUrl}
                    download={`compressed_${pdfInfo.name}`}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Download Compressed PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Upload New PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Short Answer
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A PDF compressor reduces document size by optimizing images, fonts, metadata, and
              internal objects so the file is easier to email, upload, and store.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Scanned documents, reports, invoices, presentations, contracts, and student files that
              need to be smaller without becoming unreadable.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              The output is a lighter PDF file that keeps the document structure intact while
              reducing unnecessary weight.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is A PDF Compressor?"
            description="A PDF compressor is a file optimization tool that reduces the size of a PDF document while trying to preserve readability and layout. It is used when a file is too large for email, cloud upload limits, document portals, or storage workflows."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How PDF Compression Works</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A PDF file is made of pages, text, images, fonts, objects, and metadata. Compression
                looks for places where the document can be rewritten more efficiently. Embedded
                images can be downsampled, repeated objects can be simplified, and metadata can be
                trimmed so the file uses less space without changing the core content.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Types Of PDF Compression</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                PDF compression is usually a mix of image compression, font optimization, metadata
                reduction, and object-level cleanup. Image-heavy PDFs benefit most from image
                compression, while text-heavy PDFs often shrink through structural and font
                optimization.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              PDFs get smaller when the document is made more efficient internally. The biggest
              savings usually come from shrinking embedded images, and the safest improvements often
              come from reducing redundant fonts and metadata.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Structure"
            title="Why PDFs Become Large"
            description="PDF files become heavy for predictable reasons. The format is flexible, but that flexibility can increase file size when too much visual or structural data is embedded."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Embedded Images</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Scanned pages, screenshots, and charts often add the most weight because high
                resolution images take more space than text.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Fonts And Subsets</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                PDFs may embed font files so the document displays correctly everywhere, but that
                extra font data increases the total size.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Metadata And Objects</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Editing history, author data, object structures, and other metadata can add hidden
                bloat over time.
              </p>
            </article>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              PDF File Structure
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              A PDF is built from pages that reference text blocks, images, fonts, annotations, and a
              cross-reference structure that tells the reader where each object lives. When those
              objects are large or repeated, the final file grows quickly. Compressing the document
              reduces the weight of those objects rather than changing the visible content itself.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Compress PDF Files Online"
              description="The workflow is simple: upload the PDF, let the tool process it, review the sizes, and download the smaller file."
            />
            <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              {HOW_TO_STEPS.map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Benefits"
              title="Benefits Of Compressing PDF Files"
              description="Smaller PDFs are easier to send, store, and share. They also reduce the friction that often slows down document-heavy teams."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Faster email attachments and fewer upload failures.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Less cloud storage usage and simpler document archiving.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Better workflow speed for students, teams, and clients.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Easier sharing in portals that enforce file size limits.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Methods"
            title="PDF Compression Methods"
            description="Most PDF compression engines combine several methods to reduce file size without destroying readability."
          />
          <div className="mt-6">
            <DataTable columns={['Method', 'Explanation', 'Impact']} rows={METHOD_ROWS} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Levels"
            title="PDF Compression Levels Explained"
            description="Compression levels show how aggressively the file is reduced. The right choice depends on the content and how much quality you can comfortably trade for a smaller file."
          />
          <div className="mt-6">
            <DataTable
              columns={['Compression Level', 'File Size Reduction', 'Quality Impact', 'Best Use Case']}
              rows={COMPRESSION_LEVEL_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="High Compression vs Low Compression"
            description="Low compression keeps more visual fidelity. High compression shrinks the file more aggressively, which can be useful when the original PDF is far too large."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Low Compression</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Best when you need to keep the document close to the original appearance. It is
                commonly used for contracts, text-heavy business files, and documents that will be
                reviewed on screens or printed later.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">High Compression</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Best when the document is too large for email, storage, or upload portals. This is
                useful for scans and image-heavy PDFs where size matters more than perfect visual
                fidelity.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <DataTable
              columns={['Feature', 'Low Compression', 'High Compression']}
              rows={[
                {
                  feature: 'File size reduction',
                  low: 'Moderate',
                  high: 'Strong',
                },
                {
                  feature: 'Quality impact',
                  low: 'Very low',
                  high: 'More noticeable',
                },
                {
                  feature: 'Best for',
                  low: 'Business and legal documents',
                  high: 'Scans, heavy reports, archive copies',
                },
              ]}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="ZIP"
            title="PDF Compression vs ZIP Compression"
            description="These two tools solve different problems. One makes a PDF itself smaller. The other just packages files together."
          />
          <div className="mt-6">
            <DataTable columns={['Feature', 'PDF Compression', 'ZIP Compression']} rows={PDF_VS_ZIP_ROWS} />
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              When To Use Each
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <p className="text-sm leading-7 text-slate-700">
                Use PDF compression when a single document is too large and you need the file itself
                to become lighter.
              </p>
              <p className="text-sm leading-7 text-slate-700">
                Use ZIP compression when you are sending multiple files together and do not need to
                change the documents themselves.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Business"
              title="PDF Compression For Business"
              description="Businesses use PDF compression to keep workflows moving across finance, operations, sales, legal, and support teams."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {BUSINESS_CARDS.map((item) => (
                <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Students"
              title="PDF Compression For Students"
              description="Students often need a smaller file before uploading assignments or sharing study material through learning platforms."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {STUDENT_CARDS.map((item) => (
                <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Email"
              title="PDF Compression For Email Attachments"
              description="Reducing PDF size before sending email improves delivery speed and lowers the chance of hitting attachment limits."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {EMAIL_CARDS.map((item) => (
                <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Cloud"
              title="PDF Compression For Cloud Storage"
              description="Cloud storage gets expensive and messy when documents are oversized. Compression helps keep libraries manageable and sharing links lighter."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {STORAGE_CARDS.map((item) => (
                <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Why Businesses Care"
              title="How Businesses Optimize PDFs"
              description="Organizations usually compress PDFs as part of document workflows, not as a one-off task."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Businesses optimize PDFs by standardizing document templates, compressing scanned
              uploads before sharing, trimming extra metadata from finalized files, and choosing a
              compression level that keeps documents readable for clients and internal teams. That
              reduces email friction, cuts storage costs, and makes approval workflows faster.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Students"
              title="How Students Reduce Assignment File Sizes"
              description="Students often need to submit assignments through portals that enforce size limits."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Students reduce assignment file sizes by exporting pages at reasonable resolution,
              avoiding unnecessary images, and compressing the final PDF before submission. That helps
              with essays, research papers, portfolios, and project reports that might otherwise be
              too large to upload on time.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Government"
            title="How Government Organizations Manage Large PDF Documents"
            description="Government teams often handle forms, notices, manuals, and public records at scale, so file size management matters."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Government organizations manage large PDFs by setting document standards, compressing
            scans before archiving, and keeping public-facing files light enough for citizens on
            slower devices. That improves access, reduces server load, and makes large repositories
            easier to maintain over time.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Mistakes"
            title="Common PDF Compression Mistakes"
            description="Most compression problems come from trying to shrink a file too aggressively or using the wrong source document."
          />
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Compressing a scanned PDF so aggressively that text or charts become hard to read.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Forgetting that image-heavy pages usually shrink more than text-only pages.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Using ZIP when the actual PDF needs to be smaller for upload or email.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Expecting every file to compress equally, even when source quality differs.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Keeping duplicate oversized PDFs in cloud storage instead of optimizing them first.
            </li>
          </ul>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Best Practices"
            title="Best Practices For PDF Optimization"
            description="The best PDF results come from balancing size reduction and readability."
          />
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Compress scanned documents after ensuring the scan resolution is actually necessary.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Keep text-based files readable by choosing a balanced compression level.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Remove pages or images you do not need before compression.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Use compression before emailing, before cloud uploads, and before portal submissions.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              Archive a lighter copy of finalized documents for long-term storage.
            </li>
          </ul>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise enough for people and structured enough for AI search systems."
          />
          <div className="mt-6 space-y-4">
            {currentFaqs.map(([question, answer]) => (
              <article key={question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Related Tools"
            title="Related Tools"
            description="Move to the next step in your document workflow with these related utilities."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </main>
  );
}
