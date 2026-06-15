'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TOOL_FAQS } from '../faq-data';

const HOW_TO_STEPS = [
  'Upload at least two PDF files from your device.',
  'Arrange the files in the exact order you want them to appear in the final document.',
  'Click merge and wait while the tool combines the PDFs into one file.',
  'Download the merged PDF and use it for sharing, storage, or submission.',
];

const SCENARIO_ROWS = [
  {
    scenario: 'Business reports',
    whyMerge: 'Keeps related pages in one document for approvals and sharing.',
    benefit: 'Faster review and simpler file management.',
  },
  {
    scenario: 'Contracts',
    whyMerge: 'Combines agreements, annexes, and supporting pages into a single packet.',
    benefit: 'Less back-and-forth and fewer attachment mistakes.',
  },
  {
    scenario: 'Student submissions',
    whyMerge: 'Puts notes, scans, and assignment pages together before upload.',
    benefit: 'Cleaner submissions and fewer portal issues.',
  },
  {
    scenario: 'Government documents',
    whyMerge: 'Groups forms, notices, and records into organized bundles.',
    benefit: 'Easier archiving and public access.',
  },
  {
    scenario: 'Legal packets',
    whyMerge: 'Keeps exhibits, filings, and evidence pages in one sequence.',
    benefit: 'More consistent case management.',
  },
  {
    scenario: 'Project handoffs',
    whyMerge: 'Combines specs, mockups, and approvals into one deliverable.',
    benefit: 'Fewer files to track and less confusion.',
  },
];

const MERGE_VS_COMPRESS_ROWS = [
  {
    feature: 'What changes',
    merge: 'Combines multiple PDF files into one',
    compress: 'Reduces the size of one PDF file',
  },
  {
    feature: 'Main purpose',
    merge: 'Organization and document consolidation',
    compress: 'Smaller file size and easier delivery',
  },
  {
    feature: 'Best when',
    merge: 'You have several PDFs that belong together',
    compress: 'You have one PDF that is too large',
  },
  {
    feature: 'Output',
    merge: 'A single multi-source PDF',
    compress: 'A lighter version of the same PDF',
  },
  {
    feature: 'Use together',
    merge: 'First merge related documents',
    compress: 'Then compress if the merged file is too large',
  },
];

const ZIP_VS_MERGE_ROWS = [
  {
    feature: 'What it does',
    merge: 'Creates one readable PDF document',
    zip: 'Packages files into a compressed archive',
  },
  {
    feature: 'Can a viewer read it directly?',
    merge: 'Yes, the PDF opens normally',
    zip: 'No, the archive must be extracted first',
  },
  {
    feature: 'Best for',
    merge: 'Final documents, contracts, reports, submissions',
    zip: 'Sending multiple different files together',
  },
  {
    feature: 'Document order',
    merge: 'Preserves the chosen PDF sequence',
    zip: 'Does not create a combined reading order',
  },
  {
    feature: 'When to use',
    merge: 'When one final document is needed',
    zip: 'When file bundling matters more than readability',
  },
];

const ORGANIZING_STEPS = [
  'Rename files in the same sequence you want them read.',
  'Group pages by topic, department, or submission section.',
  'Remove duplicate pages before merging if they are no longer needed.',
  'Check that each PDF opens correctly before upload.',
  'Keep the cover page first when the document needs a polished front page.',
];

const BEST_PRACTICES = [
  'Always confirm the file order before you merge.',
  'Use clear file names so you can identify the final source sequence.',
  'Combine only documents that belong together.',
  'Compress the merged file afterward if the output becomes too large.',
  'Keep one master archive copy of the final merged PDF.',
  'Use the same merge order every time for repeated business workflows.',
];

const MISTAKES = [
  'Uploading files in the wrong sequence and assuming the tool will guess the order.',
  'Merging unrelated documents into one file and creating confusion later.',
  'Using ZIP when the goal is a readable PDF document.',
  'Forgetting to compress after merging if the final file is still large.',
  'Leaving duplicate pages or outdated pages inside the final packet.',
];

const BUSINESS_CARDS = [
  {
    title: 'Operations',
    text: 'Teams merge internal reports, SOPs, and handoff documents so stakeholders receive one clear file instead of a bundle of attachments.',
  },
  {
    title: 'Finance',
    text: 'Invoices, receipts, and monthly statements are easier to archive when they are merged into one PDF packet.',
  },
  {
    title: 'Sales',
    text: 'Proposals, pricing sheets, and supporting documents are often combined before sending to prospects or clients.',
  },
];

const STUDENT_CARDS = [
  {
    title: 'Coursework',
    text: 'Students often combine notes, worksheet scans, and assignments into one upload for a learning platform.',
  },
  {
    title: 'Research',
    text: 'Research papers, citations, appendices, and figures can be merged into a single submission file.',
  },
  {
    title: 'Portfolios',
    text: 'Academic portfolios and project showcases are easier to share as one final PDF document.',
  },
];

const LEGAL_CARDS = [
  {
    title: 'Contract Packs',
    text: 'Legal teams combine agreements, exhibits, and signed pages so the file stays in one review order.',
  },
  {
    title: 'Case Materials',
    text: 'Evidence pages and supporting filings are easier to handle when they are merged into a structured PDF.',
  },
  {
    title: 'Filing Bundles',
    text: 'Merging helps build clear, submission-ready packets for court and compliance workflows.',
  },
];

const CLOUD_CARDS = [
  {
    title: 'One File, One Link',
    text: 'A merged PDF is easier to share through cloud drives because recipients only need to open one document.',
  },
  {
    title: 'Cleaner Folders',
    text: 'Document libraries stay more organized when related files are consolidated into a single file.',
  },
  {
    title: 'Easier Versioning',
    text: 'Teams can store one final version instead of managing several separate PDFs for the same task.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/edit-pdf', label: 'Edit PDF' },
  { href: '/tools/word-to-pdf', label: 'Word To PDF' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/background-remover', label: 'Background Remover' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

function formatBytes(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(2)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
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
              <tr key={row.feature || row.scenario} className="align-top">
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

export default function PdfMergeTool() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [mergedSize, setMergedSize] = useState(0);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const clearAll = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setLoading(false);
    setError('');
    setDownloadUrl('');
    setMergedSize(0);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleFiles = (event) => {
    const nextFiles = Array.from(event.target.files || []).filter(
      (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    setFiles((current) => [...current, ...nextFiles]);
    setError('');
    setDownloadUrl('');
    setMergedSize(0);
  };

  const removeFile = (targetIndex) => {
    setFiles((current) => current.filter((_, index) => index !== targetIndex));
    setDownloadUrl('');
    setMergedSize(0);
  };

  const moveFile = (index, direction) => {
    setFiles((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDownloadUrl('');
    setMergedSize(0);
  };

  const totalOriginalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const estimatedMergedBytes = mergedSize || totalOriginalBytes;
  const savedBytes = mergedSize ? Math.max(0, totalOriginalBytes - mergedSize) : 0;
  const savedPercent = totalOriginalBytes && mergedSize
    ? Math.max(0, Math.round((savedBytes / totalOriginalBytes) * 100))
    : 0;

  const mergePdfs = async () => {
    if (files.length < 2) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/pdf-merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'PDF merge failed.');
      }

      const blob = await response.blob();
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      setMergedSize(blob.size);
    } catch (err) {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentFaqs = TOOL_FAQS['pdf-merge'] || [];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Merge PDF Files Online Free - Combine Multiple PDFs Into One | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/pdf-merge',
    description:
      'Merge multiple PDF files into one document online for free. Combine PDFs in any order instantly. No software, no signup, and no watermark on the output.',
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
    name: 'PDF Merger',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://toolshub.cyphersol.com/tools/pdf-merge',
    description:
      'Merge PDF files online for free, combine PDF documents into one readable file, and keep the chosen order intact.',
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Merge PDF Files Online',
    description:
      'Upload at least two PDF files, reorder them if needed, merge them into one file, and download the combined document.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'PDF Merger',
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
              PDF Merger Online
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Merge PDF Files Online Free
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Combine PDF files into one organized document with a simple browser-based workflow.
              Keep your file order intact, join related pages into a single packet, and download the
              merged PDF without extra software or signup friction.
            </p>
          </div>

          <div className="p-8">
            {!files.length && !loading ? (
              <div className="relative">
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  onChange={handleFiles}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  id="pdf-merge-input"
                />
                <label
                  htmlFor="pdf-merge-input"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-blue-200 bg-blue-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-100/70"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M8 7h8M8 11h8M8 15h5M7 3h7l5 5v13a1 1 0 01-1 1H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Click to select PDF files</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Choose at least two PDFs to merge into one file.
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
                <h2 className="text-xl font-bold text-slate-900">Merging PDFs...</h2>
                <p className="mt-2 text-sm text-slate-500">
                  The tool is combining the selected documents into one PDF.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-red-600">
                {error}
              </div>
            ) : null}

            {files.length > 0 && !loading ? (
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Selected Files
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-900">{files.length} PDFs ready</h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Add More
                      </button>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Total Files
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{files.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Original Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">{formatBytes(totalOriginalBytes)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Merged Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                      {downloadUrl ? formatBytes(estimatedMergedBytes) : 'Ready after merge'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {index + 1}. {file.name}
                          </p>
                          <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moveFile(index, -1)}
                            disabled={index === 0}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Move Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveFile(index, 1)}
                            disabled={index === files.length - 1}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Move Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={mergePdfs}
                    disabled={files.length < 2 || loading}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Merge PDFs
                  </button>
                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      download="merged.pdf"
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Download Merged PDF
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Add PDFs
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
              A PDF merger combines separate PDF files into one readable document so related pages
              can be shared, archived, or submitted as a single packet.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Business files, contracts, reports, student submissions, legal packets, and project
              handoffs that need one final document.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A single merged PDF that keeps the selected file order and opens normally in any PDF
              reader.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is A PDF Merger?"
            description="A PDF merger is a tool that joins multiple PDF files into one document. It is used when separate files belong together and you want one clean, ordered packet instead of several attachments."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How It Works</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The merger reads each PDF, keeps the page content intact, and places the documents in
                the order you select. The result is one combined PDF that preserves the original
                pages rather than rebuilding the content from scratch.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Why Combine?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Combine PDF documents when related pages need to travel together. That can mean a
                report with an appendix, a contract with exhibits, or a student submission with
                supporting pages. One file is easier to open, archive, and review.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              PDF merging is about document organization, not compression. If the goal is to turn
              several related PDFs into one readable file, a merger is the correct tool. If the goal
              is to make a single PDF smaller, use compression afterward.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Workflow"
            title="How To Merge PDF Files Online"
            description="The cleanest merge workflow is simple: upload, order, merge, and download. The key detail is making sure the file order is correct before you press the merge button."
          />
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            {HOW_TO_STEPS.map((step, index) => (
              <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Benefits"
            title="Benefits Of Using A PDF Merger"
            description="Merging files creates fewer attachments, clearer document packets, and a smoother experience for recipients."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Cleaner Sharing</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                One merged document is easier to email, upload, and forward than a pile of separate
                PDFs.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Better Organization</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Related pages stay together, which makes archiving and later review much easier.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Less Document Friction</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                People open one file, not several. That reduces confusion and improves workflow speed.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="The best merge use cases are the ones where several PDFs belong together in a single reading order."
          />
          <div className="mt-6">
            <DataTable columns={['Scenario', 'Why Merge PDFs', 'Benefit']} rows={SCENARIO_ROWS} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Organizing"
              title="Organizing Documents Before Merging"
              description="A little preparation before merging saves time later and reduces the chance of mistakes."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <ol className="space-y-3 text-sm leading-7 text-slate-600">
              {ORGANIZING_STEPS.map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Comparison"
              title="PDF Merger vs PDF Compressor"
              description="These tools solve different problems. Merging organizes documents, while compression reduces the size of one document."
            />
            <div className="mt-6">
              <DataTable
                columns={['Feature', 'PDF Merge', 'PDF Compression']}
                rows={MERGE_VS_COMPRESS_ROWS}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="ZIP"
              title="PDF Merger vs ZIP Archive"
              description="ZIP archives package files together, but they do not create one readable PDF document."
            />
            <div className="mt-6">
              <DataTable columns={['Feature', 'PDF Merge', 'ZIP Archive']} rows={ZIP_VS_MERGE_ROWS} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Best Practices For PDF Merging"
              description="The best results come from keeping the file order clear and only combining documents that belong together."
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
              title="Common Mistakes"
              description="Most merge problems come from order confusion, duplicate pages, or using the wrong tool for the job."
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
              eyebrow="Business"
              title="PDF Merging For Businesses"
              description="Businesses use PDF merging to keep document workflows organized across departments and clients."
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
              title="PDF Merging For Students"
              description="Students often need one final file for coursework, notes, and research materials."
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
              eyebrow="Legal"
              title="PDF Merging For Legal Workflows"
              description="Legal teams rely on strict page order, so merging helps keep exhibits and filings together in one packet."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {LEGAL_CARDS.map((item) => (
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
              title="PDF Merging For Cloud Storage"
              description="Cloud storage gets cleaner when related PDFs are combined into a single document."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {CLOUD_CARDS.map((item) => (
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
              eyebrow="Compression"
              title="When To Compress After Merging"
              description="Merging and compression are complementary steps. Merge first when the document should become one file, then compress if the final size is still too large."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This is especially helpful when several large scans are merged into one packet. The
              merge step solves the organization problem, while the compression step solves the file
              size problem. Together, they create a document that is both readable and practical to
              share.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Short Answer"
              title="When Should You Use PDF Merge?"
              description="Use PDF merge when the files belong together and the recipient should open one document instead of several separate attachments."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              That applies to contracts, reports, assignments, legal filings, project packs, and any
              other workflow where document order matters more than individual file separation.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise, practical, and written to work well in AI search results."
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
