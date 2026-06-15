'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TOOL_FAQS } from '../faq-data';

const HOW_TO_STEPS = [
  'Upload a DOC or DOCX file from your device.',
  'Wait while the tool converts the Word document into PDF.',
  'Review the converted file and confirm the output looks correct.',
  'Download the PDF and use it for sharing, printing, or archiving.',
];

const USE_CASE_ROWS = [
  {
    useCase: 'Business documents',
    whyConvert: 'PDFs keep letters, memos, and internal documents consistent across devices.',
    benefit: 'Clean sharing and predictable formatting.',
  },
  {
    useCase: 'Contracts and agreements',
    whyConvert: 'Legal-style documents need fixed layout and easy distribution.',
    benefit: 'More reliable viewing and printing.',
  },
  {
    useCase: 'Invoices',
    whyConvert: 'A PDF invoice is easier to send, store, and print than a working file.',
    benefit: 'Professional presentation and portability.',
  },
  {
    useCase: 'Reports and proposals',
    whyConvert: 'Reports often include charts, tables, and formatting that should stay unchanged.',
    benefit: 'Consistent appearance for clients and teams.',
  },
  {
    useCase: 'Student assignments',
    whyConvert: 'Teachers and LMS platforms usually prefer a stable file format for submissions.',
    benefit: 'Fewer upload and formatting issues.',
  },
  {
    useCase: 'Resumes and CVs',
    whyConvert: 'Recruiters want a resume that looks the same on every screen and printer.',
    benefit: 'Better presentation and compatibility.',
  },
  {
    useCase: 'Government forms',
    whyConvert: 'Forms need a fixed structure so people can open, fill, and archive them reliably.',
    benefit: 'Official-looking, shareable documents.',
  },
];

const WORD_VS_PDF_ROWS = [
  {
    feature: 'Editable status',
    wordDocument: 'Editable',
    pdf: 'Fixed layout',
  },
  {
    feature: 'Compatibility',
    wordDocument: 'Best in Word processors',
    pdf: 'Opens reliably in almost any viewer',
  },
  {
    feature: 'Formatting consistency',
    wordDocument: 'Can shift across devices or software',
    pdf: 'Usually stays the same everywhere',
  },
  {
    feature: 'Security',
    wordDocument: 'More open to editing',
    pdf: 'Better for finalized sharing',
  },
  {
    feature: 'Print readiness',
    wordDocument: 'Good, but depends on software settings',
    pdf: 'Excellent for direct printing',
  },
];

const DOC_DOCX_ROWS = [
  {
    format: 'DOC',
    bestUseCase: 'Older Word files and legacy document workflows',
    notes: 'The classic Microsoft Word format, still used in many offices and archives.',
  },
  {
    format: 'DOCX',
    bestUseCase: 'Modern Word documents and everyday editing',
    notes: 'XML-based format used by modern Microsoft Word versions and many other editors.',
  },
  {
    format: 'PDF',
    bestUseCase: 'Sharing, printing, archiving, and official documents',
    notes: 'Fixed-layout format that keeps the document looking consistent across devices.',
  },
];

const PDF_BENEFITS = [
  {
    title: 'Portability',
    text: 'PDFs open on almost every device and operating system, so they travel well between desktop, mobile, and cloud workflows.',
  },
  {
    title: 'Formatting Preservation',
    text: 'Fonts, spacing, images, and page layout are more likely to remain stable once a Word file becomes a PDF.',
  },
  {
    title: 'Print Reliability',
    text: 'PDFs are widely accepted by printers and print-ready systems because the layout is fixed.',
  },
  {
    title: 'Archiving',
    text: 'A PDF is ideal for long-term storage because the document looks the same when reopened later.',
  },
  {
    title: 'Official Sharing',
    text: 'Contracts, forms, resumes, and reports often look more professional as PDFs than as editable Word files.',
  },
  {
    title: 'Security and Finalization',
    text: 'PDF is a better format for finalized documents that should not be changed casually.',
  },
];

const BEST_PRACTICES = [
  'Check your Word file for spelling, headings, and spacing before converting.',
  'Use DOCX when possible for modern compatibility and cleaner source formatting.',
  'Keep images and tables properly aligned so the PDF output stays neat.',
  'Use standard fonts where possible to reduce layout shifts during conversion.',
  'Review page breaks in Word before converting if the document needs exact pagination.',
  'Save a final editable copy of the Word file before exporting the PDF.',
];

const MISTAKES = [
  'Converting an unfinished draft and then editing the PDF instead of the Word file.',
  'Using unsupported fonts or unusual spacing that may shift during conversion.',
  'Forgetting to check page breaks before exporting a multi-page document.',
  'Assuming the PDF will behave like a Word file after conversion.',
  'Uploading a corrupted or password-protected file without checking it first.',
];

const BUSINESS_CARDS = [
  {
    title: 'Letters and memos',
    text: 'Businesses convert letters and internal memos to PDF so teams can share the same version without layout changes.',
  },
  {
    title: 'Reports and briefings',
    text: 'Reports often contain charts and tables that benefit from a stable final format.',
  },
  {
    title: 'Client-facing files',
    text: 'Proposals and presentations look more polished when exported as PDFs before sending.',
  },
];

const STUDENT_CARDS = [
  {
    title: 'Assignments',
    text: 'Students submit work in PDF so teachers can open the file with the same layout the student saw.',
  },
  {
    title: 'Research papers',
    text: 'Research papers stay easier to review when the formatting is locked in place.',
  },
  {
    title: 'Thesis and reports',
    text: 'Long documents are simpler to archive and share after they are converted to PDF.',
  },
];

const PROFESSIONAL_CARDS = [
  {
    title: 'Resumes',
    text: 'PDF is the preferred format for resumes because it protects the layout from software differences.',
  },
  {
    title: 'CVs',
    text: 'Academic and professional CVs are easier to trust when they are exported as PDF.',
  },
  {
    title: 'Portfolios',
    text: 'Designers, writers, and consultants often deliver portfolios in PDF for easy viewing and printing.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/pdf-merge', label: 'PDF Merge' },
  { href: '/tools/edit-pdf', label: 'Edit PDF' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/word-counter', label: 'Word Counter' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
];

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || '';
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
              <tr key={row.feature || row.format || row.useCase} className="align-top">
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

export default function WordToPdfConverter() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [convertedSize, setConvertedSize] = useState(0);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setLoading(false);
    setDownloadUrl('');
    setError('');
    setConvertedSize(0);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    setError('');

    if (!selected) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    const ext = getExtension(selected.name);
    const isValid = validTypes.includes(selected.type) || ext === 'doc' || ext === 'docx';

    if (!isValid) {
      setError('Please select a valid Word file.');
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      setError('File size is too large. Max 50MB is allowed.');
      return;
    }

    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setFile(selected);
    setDownloadUrl('');
    setConvertedSize(0);
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'word-to-pdf');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errData = await response.json();
          throw new Error(errData.error || 'Conversion failed');
        }

        throw new Error((await response.text()) || 'Conversion failed');
      }

      const blob = await response.blob();
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      setConvertedSize(blob.size);
    } catch (err) {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentFaqs = TOOL_FAQS['word-to-pdf'] || [];

  const originalSize = file ? formatBytes(file.size) : 'Not uploaded yet';
  const pdfSize = convertedSize ? formatBytes(convertedSize) : 'Not generated yet';
  const savedBytes = file && convertedSize ? Math.max(0, file.size - convertedSize) : 0;
  const savedPercent = file && convertedSize ? Math.max(0, Math.round((savedBytes / file.size) * 100)) : 0;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Convert Word to PDF Free Online - DOCX to PDF Converter | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/word-to-pdf',
    description:
      'Convert Word documents (.doc, .docx) to PDF online for free. Preserve formatting, fonts, and layout perfectly. Fast conversion, no signup, no watermark.',
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
    name: 'Word To PDF Converter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://toolshub.cyphersol.com/tools/word-to-pdf',
    description:
      'Convert Word documents to PDF online for free, save Word as PDF, and keep the formatting consistent.',
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
        name: 'Word To PDF',
        item: 'https://toolshub.cyphersol.com/tools/word-to-pdf',
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Convert Word To PDF Online',
    description:
      'Upload a Word document, convert it to PDF, review the file, and download the result.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Word To PDF Converter',
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
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Word To PDF Converter
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Convert Word To PDF Online Free
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Turn DOC and DOCX files into PDF documents in a fast, browser-based workflow.
              Preserve formatting, keep layouts consistent, and save Word as PDF for sharing,
              printing, and archiving without needing desktop software.
            </p>
          </div>

          <div className="p-8">
            {!file && !loading ? (
              <div className="relative">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  id="word-to-pdf-input"
                />
                <label
                  htmlFor="word-to-pdf-input"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-blue-200 bg-blue-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-100/70"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M7 7h10M7 11h10M7 15h6m7-10v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h10l4 4z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    Click to upload your Word file
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Supported formats: DOC and DOCX. Max file size: 50MB.
                  </p>
                </label>
              </div>
            ) : null}

            {loading ? (
              <div className="py-12 text-center">
                <div className="relative mx-auto mb-5 h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Converting Word to PDF...</h2>
                <p className="mt-2 text-sm text-slate-500">
                  The document is being converted and formatted for PDF output.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-red-600">
                {error}
              </div>
            ) : null}

            {file && !loading ? (
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Selected File
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-900">{file.name}</h2>
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

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Input Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{originalSize}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Output Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                      {downloadUrl ? pdfSize : 'Ready after conversion'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Result
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">
                      {downloadUrl ? `${savedPercent}% smaller` : 'Waiting'}
                    </p>
                  </div>
                </div>

                {downloadUrl ? (
                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Converted PDF Ready
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      The PDF version of your Word document is ready to download. Use it for sharing,
                      printing, or archiving.
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleConvert}
                    disabled={!file || loading}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Converting...' : 'Convert Now'}
                  </button>

                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      download="converted.pdf"
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Download PDF
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Short Answer
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Word to PDF conversion turns editable Word files into fixed-layout PDFs that are easier
              to share, print, and archive.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              DOC and DOCX documents, resumes, reports, contracts, assignments, and official files
              that need a stable layout.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A portable PDF document that keeps your formatting much more consistently than a Word
              file across devices and applications.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is A Word To PDF Converter?"
            description="A Word to PDF converter changes a text document into a PDF file so the layout becomes fixed and easier to share across devices. It is used when you need a document to look the same for everyone who opens it."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is A Word Document?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A Word document is an editable text file created in Microsoft Word or a compatible
                editor. It is designed for writing, revising, and formatting content while the user
                continues to make changes.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is A PDF File?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A PDF is a portable document format that preserves the layout, fonts, spacing, and
                page structure. It is meant for reading, printing, and sharing rather than editing.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Why Convert Word To PDF?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Convert Word to PDF when you need the document to look consistent for other people,
                keep formatting stable, or send a final version that is ready to open and print.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Word files are best for editing, while PDFs are best for sharing final versions. A Word
              to PDF converter bridges that gap by freezing the document layout into a portable
              format that is easier to open, review, and archive.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Convert Word To PDF Online"
              description="The process is simple: upload the Word file, convert it, review the result, and download the PDF."
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
              title="Benefits Of Converting Word To PDF"
              description="PDF output gives your document a more predictable and shareable final form."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Preserves the general look and feel of the original document.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Makes the file easier to share with people using different software.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Helps create a final version for printing or archiving.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Reduces accidental editing compared with an editable Word file.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Why PDF"
            title="Why PDF Is Preferred For Sharing Documents"
            description="PDF is the preferred format for sharing because it is portable, fixed-layout, and easy to open across devices."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PDF_BENEFITS.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="People convert Word files to PDF for practical reasons: stable formatting, portable sharing, and better final delivery."
          />
          <div className="mt-6">
            <DataTable columns={['Use Case', 'Why Convert', 'Benefit']} rows={USE_CASE_ROWS} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Comparison"
              title="Word vs PDF"
              description="Word documents are built for editing, while PDFs are built for stable sharing and viewing."
            />
            <div className="mt-6">
              <DataTable
                columns={['Feature', 'Word Document', 'PDF']}
                rows={WORD_VS_PDF_ROWS}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Formats"
              title="DOC vs DOCX Explained"
              description="DOC and DOCX are both Word formats, but they behave differently in modern editing workflows."
            />
            <div className="mt-6">
              <DataTable columns={['Format', 'Best Use Case', 'Notes']} rows={DOC_DOCX_ROWS} />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Formatting"
            title="Document Formatting Preservation"
            description="One of the biggest reasons people save Word as PDF is to preserve the formatting that was carefully built in the original document."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Formatting preservation means that headings, spacing, margins, tables, images, and page
            breaks stay close to the source layout. That matters when you are sending a document to a
            client, recruiter, teacher, or public office. A PDF helps the document appear more
            consistent than an editable file, especially when the recipient uses different software
            or fonts.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Business"
              title="Word To PDF For Businesses"
              description="Businesses convert Word files to PDF because the final file is easier to send, review, and store."
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
              title="Word To PDF For Students"
              description="Students rely on PDF to keep their work readable and compatible when submitting assignments."
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

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Professional"
            title="Word To PDF For Professional Documents"
            description="Professional files usually need to look polished and stay consistent. PDF is the preferred final format for that reason."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PROFESSIONAL_CARDS.map((item) => (
              <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Best Practices For Word To PDF Conversion"
              description="A careful source file usually produces a better PDF than a rushed draft."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {BEST_PRACTICES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Mistakes"
              title="Common Conversion Mistakes"
              description="Most conversion problems come from unfinished source documents or layout details that were not checked before export."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {MISTAKES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Need To Know"
              title="Why Businesses Convert Word Files To PDF"
              description="Businesses convert Word files to PDF to make sure the final version looks the same for everyone and is easy to share or print."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              When a document leaves the editing stage, PDF is usually the better final format.
              Business teams use it for contracts, memos, proposals, and reports because the PDF
              format is easier to trust as a final record.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Students"
              title="Why Students Submit PDFs"
              description="Students submit PDFs because teachers and LMS platforms can open them consistently and the formatting stays stable."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A PDF reduces the chance of font problems, spacing issues, or layout shifts when an
              assignment is opened on another computer. That makes submission cleaner and more
              professional.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Resumes"
              title="Why Resumes Should Be Sent As PDFs"
              description="Resumes should be sent as PDFs so the layout looks polished and does not break on different devices or applicant tracking systems."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A resume is often judged by first impression and readability. PDF helps keep the design
              fixed so recruiters see the same formatting the candidate intended. It is also easier to
              print and archive as a final document.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Official"
              title="Why PDFs Are Preferred For Official Documents"
              description="Official documents need a stable, printable, and portable format that behaves consistently across systems."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              PDFs are preferred for official documents because they preserve layout, reduce accidental
              editing, and look reliable in archiving systems. Forms, notices, statements, and signed
              documents all benefit from that fixed structure.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Printing"
            title="Benefits Of PDF For Printing And Archiving"
            description="PDF is widely used for printing and archiving because it keeps the document stable over time."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Printing</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                PDF is a reliable print format because it locks in margins, page breaks, and layout
                details so the printed result matches the intended design.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Archiving</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                PDFs are easier to archive because they remain readable and visually stable long after
                the original editing session is over.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are short, useful, and structured for AI search and quick reading."
          />
          <div className="mt-6 space-y-4">
            {currentFaqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                  <span className="flex items-center justify-between gap-4">
                    {question}
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Related Tools"
            title="Related Tools"
            description="Continue the document workflow with these related utilities."
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
