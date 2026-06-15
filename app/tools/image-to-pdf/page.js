'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TOOL_FAQS } from '../faq-data';

const HOW_TO_STEPS = [
  'Upload one or more images from your device.',
  'Check the selected file order and move items if you want a different page sequence.',
  'Click convert to create a PDF from the selected images.',
  'Download the PDF and use it for sharing, printing, or archiving.',
];

const SUPPORTED_ROWS = [
  {
    format: 'JPG',
    bestUseCase: 'Photos, scans, and standard image pages',
    advantages: 'Small file size, universal support, easy conversion',
  },
  {
    format: 'PNG',
    bestUseCase: 'Screenshots, graphics, transparent images',
    advantages: 'Crisp edges, transparency support, strong clarity',
  },
  {
    format: 'WEBP',
    bestUseCase: 'Modern web images and lightweight photo assets',
    advantages: 'Modern compression, small file size, transparency support',
  },
  {
    format: 'PDF',
    bestUseCase: 'Sharing, printing, archiving, and official documents',
    advantages: 'Portable, fixed layout, multi-page support',
  },
];

const IMAGE_VS_PDF_ROWS = [
  {
    feature: 'Sharing',
    imageFile: 'Needs separate file handling',
    pdfDocument: 'Easy to send as one document',
  },
  {
    feature: 'Printing',
    imageFile: 'May require extra steps',
    pdfDocument: 'Print-ready and widely supported',
  },
  {
    feature: 'Security',
    imageFile: 'Easier to edit or replace',
    pdfDocument: 'Better for finalized sharing',
  },
  {
    feature: 'Multi-page support',
    imageFile: 'One image per file',
    pdfDocument: 'Multiple pages in one document',
  },
  {
    feature: 'Organization',
    imageFile: 'Spread across separate files',
    pdfDocument: 'Keeps related pages together',
  },
];

const CONTENT_LENGTH_ROWS = [
  {
    documentType: 'Scanned document',
    recommendedWordCount: 'Not applicable',
    notes: 'Use page count and image clarity instead of word count.',
  },
  {
    documentType: 'Photo collection',
    recommendedWordCount: 'Not applicable',
    notes: 'Focus on page order and print layout.',
  },
  {
    documentType: 'Receipt archive',
    recommendedWordCount: 'Not applicable',
    notes: 'Often converted as image pages inside one PDF for storage.',
  },
  {
    documentType: 'Business file packet',
    recommendedWordCount: 'Not applicable',
    notes: 'Combine files into one PDF for easier review and delivery.',
  },
];

const USE_CASES = [
  {
    title: 'Scanned Documents',
    text: 'Scans often begin as JPG or PNG images. Converting them into PDF makes the file easier to store and share as one document.',
  },
  {
    title: 'Student Assignments',
    text: 'Students can combine photos of notes, homework, or worksheets into a single submission-ready PDF.',
  },
  {
    title: 'Business Reports',
    text: 'Report pages, charts, and supporting images are easier to review when they live in one PDF packet.',
  },
  {
    title: 'Receipts and Invoices',
    text: 'Businesses and freelancers often save receipts and invoices as PDFs for accounting, tax, and record keeping.',
  },
  {
    title: 'Photo Collections',
    text: 'A photo collection becomes easier to send when the images are bundled into one PDF instead of multiple attachments.',
  },
  {
    title: 'Legal Documentation',
    text: 'Legal packets often need stable page order and an easy-to-open format, which is why PDF is preferred.',
  },
  {
    title: 'Government Forms',
    text: 'Forms, notices, and records are often converted into PDFs because the format is portable and consistent.',
  },
];

const BEST_PRACTICES = [
  'Order pages before conversion so the PDF reads in the correct sequence.',
  'Use clear, high-quality source images to avoid blurry pages in the PDF.',
  'Choose JPG for photos and PNG for graphics or screenshots.',
  'Combine related images into one PDF so the final file is easier to manage.',
  'Keep image dimensions large enough for reading and printing.',
  'Archive the final PDF after download so you have one organized copy.',
];

const MISTAKES = [
  'Uploading very low-resolution images that become hard to read in the PDF.',
  'Forgetting to check page order before converting.',
  'Mixing unrelated images into one file when they should stay separate.',
  'Using the wrong format when transparency or clarity matters.',
  'Assuming a PDF is the same as a compressed image archive.',
];

const STUDENT_CARDS = [
  {
    title: 'Homework and Notes',
    text: 'Students often convert handwritten pages, screenshots, and worksheets into one PDF for submission.',
  },
  {
    title: 'Assignments',
    text: 'A combined PDF is easier to upload to LMS platforms than several separate image files.',
  },
  {
    title: 'Project Files',
    text: 'Project pages, diagrams, and reference images stay organized when grouped into a single PDF.',
  },
];

const BUSINESS_CARDS = [
  {
    title: 'Receipts',
    text: 'Receipts are easier to archive and share when they are saved as PDF pages in one file.',
  },
  {
    title: 'Invoices',
    text: 'Invoice images become easier to send to accounting or clients after conversion to PDF.',
  },
  {
    title: 'Reports',
    text: 'Business reports often include images and charts that belong in one portable file.',
  },
];

const ARCHIVE_CARDS = [
  {
    title: 'Long-term Storage',
    text: 'PDF is a stronger long-term format than separate image files when documents need to stay organized.',
  },
  {
    title: 'Easy Retrieval',
    text: 'One PDF file is easier to search, name, and find than a folder full of individual photos.',
  },
  {
    title: 'Better Consistency',
    text: 'A PDF looks the same when reopened later, which makes it ideal for archiving.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/word-to-pdf', label: 'Word To PDF' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/pdf-merge', label: 'PDF Merge' },
  { href: '/tools/edit-pdf', label: 'Edit PDF' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/background-remover', label: 'Background Remover' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
];

function formatFileSize(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[index]}`;
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
              <tr key={row.feature || row.format || row.documentType} className="align-top">
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

export default function ImageToPdf() {
  const inputRef = useRef(null);
  const urlsRef = useRef([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [pdfSize, setPdfSize] = useState(0);
  const [previewItems, setPreviewItems] = useState([]);

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const rebuildPreviews = (nextFiles) => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));

    const nextUrls = nextFiles.map((file) => URL.createObjectURL(file));
    urlsRef.current = nextUrls;
    setPreviewItems(
      nextFiles.map((file, index) => ({
        key: `${file.name}-${file.size}-${index}`,
        name: file.name,
        size: formatFileSize(file.size),
        src: nextUrls[index],
      }))
    );
  };

  const clearAll = () => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = [];

    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setImages([]);
    setPreviewItems([]);
    setLoading(false);
    setError('');
    setDownloadUrl('');
    setPdfSize(0);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleFiles = (event) => {
    const nextFiles = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith('image/') || ['svg'].includes((file.name.split('.').pop() || '').toLowerCase())
    );

    const combined = [...images, ...nextFiles];
    setError('');
    setDownloadUrl('');
    setPdfSize(0);
    setImages(combined);
    rebuildPreviews(combined);
  };

  const removeImage = (targetIndex) => {
    const combined = images.filter((_, index) => index !== targetIndex);
    setImages(combined);
    setDownloadUrl('');
    setPdfSize(0);
    rebuildPreviews(combined);
  };

  const moveImage = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const combined = [...images];
    [combined[index], combined[nextIndex]] = [combined[nextIndex], combined[index]];
    setImages(combined);
    setDownloadUrl('');
    setPdfSize(0);
    rebuildPreviews(combined);
  };

  const totalOriginalSize = images.reduce((sum, file) => sum + file.size, 0);
  const savedBytes = pdfSize ? Math.max(0, totalOriginalSize - pdfSize) : 0;
  const savedPercent = totalOriginalSize && pdfSize ? Math.max(0, Math.round((savedBytes / totalOriginalSize) * 100)) : 0;

  const convertToPdf = async () => {
    if (!images.length) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      images.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/image-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Image to PDF conversion failed.');
      }

      const blob = await response.blob();
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      setPdfSize(blob.size);
    } catch (err) {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentFaqs = TOOL_FAQS['image-to-pdf'] || [];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Convert Image to PDF Online Free - JPG & PNG to PDF | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/image-to-pdf',
    description:
      'Convert JPG, PNG, and other images to PDF files online for free. Combine multiple images into one PDF document instantly. No software, no signup required.',
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
    name: 'Image To PDF Converter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://toolshub.cyphersol.com/tools/image-to-pdf',
    description:
      'Convert images to PDF online for free, create PDF from images, and combine multiple images into one document.',
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
        name: 'Image To PDF',
        item: 'https://toolshub.cyphersol.com/tools/image-to-pdf',
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Convert Images To PDF Online',
    description:
      'Upload one or more images, arrange them in order, convert them to PDF, and download the final document.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Image To PDF Converter',
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
              Image To PDF Converter
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Convert Images To PDF Online Free
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Turn JPG, PNG, and WebP images into one clean PDF document in seconds. Upload a single
              photo, multiple pages, scans, or screenshots, then download a portable PDF that is
              ready for sharing, printing, and long-term storage.
            </p>
          </div>

          <div className="p-8">
            {!images.length && !loading ? (
              <div className="relative">
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
                  onChange={handleFiles}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  id="image-to-pdf-input"
                />
                <label
                  htmlFor="image-to-pdf-input"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-blue-200 bg-blue-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-100/70"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Click to select image files</p>
                  <p className="mt-2 text-sm text-slate-500">
                    JPG, PNG, WebP, and SVG files work best for image to PDF conversion.
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
                <h2 className="text-xl font-bold text-slate-900">Creating PDF from images...</h2>
                <p className="mt-2 text-sm text-slate-500">
                  The tool is arranging the selected images into a PDF document.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-red-600">
                {error}
              </div>
            ) : null}

            {images.length > 0 && !loading ? (
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Selected Images
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-900">{images.length} files ready</h2>
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
                      File Count
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{images.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Total Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">{formatFileSize(totalOriginalSize)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      PDF Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                      {downloadUrl ? formatFileSize(pdfSize) : 'Ready after conversion'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {previewItems.map((preview, index) => (
                    <div
                      key={preview.key}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                            <img src={preview.src} alt={preview.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {index + 1}. {preview.name}
                            </p>
                            <p className="text-xs text-slate-500">{preview.size}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moveImage(index, -1)}
                            disabled={index === 0}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Move Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 1)}
                            disabled={index === previewItems.length - 1}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Move Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
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
                    onClick={convertToPdf}
                    disabled={!images.length || loading}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Convert to PDF
                  </button>
                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      download="converted-images.pdf"
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Download PDF
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
              Image to PDF conversion turns one or more image files into a portable PDF document that
              is easier to share, print, and archive.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Scans, photos, receipts, invoices, assignments, document packets, and any image-based
              workflow that needs one final file.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A PDF document that keeps the selected images organized in order and ready for use.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is An Image To PDF Converter?"
            description="An image to PDF converter creates a PDF document from pictures, scans, screenshots, or mixed image files. It is useful when you want image-based content to behave like a single document instead of a stack of separate files."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is An Image File?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                An image file stores visual data in formats like JPG, PNG, or WEBP. It is best for
                displaying photos, graphics, screenshots, and scanned pages.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is A PDF Document?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A PDF document is a fixed-layout file that keeps pages, images, and text consistent
                across devices, printers, and operating systems.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Why Convert Images To PDF?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Convert images to PDF when you need one portable file, better organization, or a
                document that will stay consistent when shared or printed.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Image to PDF conversion is the process of turning image pages into one document that is
              easier to share and archive. When multiple images are combined, the PDF becomes a
              practical document container instead of a loose set of picture files.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Convert Images To PDF Online"
              description="The workflow is straightforward: upload images, arrange them in order, convert to PDF, and download the document."
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
              title="Benefits Of Converting Images To PDF"
              description="A PDF gives image-based content a more useful document form."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Combines multiple images into one organized document.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Makes sharing and downloading easier than handling many separate images.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Keeps page order and structure more predictable.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Helps create a more professional final file for printing and storage.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Why PDF"
            title="Why PDF Is Better For Document Sharing"
            description="PDF is better for sharing because it behaves like a final document, not a loose image folder."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Portable</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                PDF opens on almost every device, which makes it much easier to send to different
                people and systems.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Fixed Layout</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The document stays visually consistent, which matters when the final file must look
                the same everywhere.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Document-Friendly</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                PDFs are easier to file, print, and archive than a group of separate image files.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="Image to PDF conversion fits many image-heavy document workflows."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {USE_CASES.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Formats"
              title="Image Formats Supported"
              description="Different image formats solve different tasks, and PDF is the final container that brings them together."
            />
            <div className="mt-6">
              <DataTable
                columns={['Format', 'Best Use Case', 'Advantages']}
                rows={SUPPORTED_ROWS}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Comparison"
              title="Image vs PDF"
              description="Images are great for visual display. PDFs are better for document sharing and long-term organization."
            />
            <div className="mt-6">
              <DataTable
                columns={['Feature', 'Image File', 'PDF Document']}
                rows={IMAGE_VS_PDF_ROWS}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="JPG"
              title="JPG To PDF Explained"
              description="JPG to PDF is the most common image-to-document workflow because JPG is a universal photo format."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              JPG is ideal for photos, scans, and camera images because it keeps file sizes
              manageable while remaining widely compatible. When converted to PDF, JPG pages can be
              collected into one document for sharing or archiving without changing the basic visual
              content.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="PNG"
              title="PNG To PDF Explained"
              description="PNG to PDF is useful when image clarity, sharp edges, or transparency matter."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              PNG is popular for screenshots, graphics, diagrams, and images with transparent areas.
              When converted to PDF, the image can sit inside a reliable document container that is
              easier to send, print, and store.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Multiple Pages"
              title="PDF Document Creation From Images"
              description="Creating a PDF from images is not just conversion. It is a document-building process that turns image pages into a single readable file."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Each selected image becomes part of the PDF page sequence. That makes the PDF act like a
              document rather than a folder of images. This is especially useful for scans, receipts,
              worksheets, and multi-page photo sets where the order matters.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Image Based PDFs"
              title="Image-Based PDFs Explained"
              description="An image-based PDF is a PDF where the pages are made from images rather than editable text."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Image-based PDFs are common for scans, screenshots, and photo collections. They are
              easy to share and archive, and they preserve the appearance of the original images in a
              document-friendly format.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Sharing"
              title="Document Sharing Using PDFs"
              description="PDFs make document sharing simpler because recipients open one file instead of a collection of images."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A PDF is a better sharing format when you need the content to stay together and look the
              same everywhere. That is why businesses, students, and government workflows often
              prefer PDF over separate image attachments.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Archive"
              title="Why PDFs Are Preferred For Long-Term Storage"
              description="PDF is widely used for archiving because the file is more document-like and easier to preserve over time."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Long-term storage works better when the file format is stable and easy to reopen later.
              PDF is preferred because it remains readable, organizes pages into one file, and reduces
              the chance that the file will look different in the future.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Detail"
            title="Why Scanned Documents Are Commonly Saved As PDFs"
            description="Scans are often saved as PDFs because the format is better suited to multi-page document handling."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Scanned documents are image-based by nature, but they are usually intended to be read as
            documents, not as separate pictures. Saving scans as PDF keeps the pages together, makes
            them easier to send by email, and supports a familiar file format for official workflows.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Students"
              title="Image To PDF For Students"
              description="Students use image to PDF conversion when they need to submit multiple pages in one file."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              {STUDENT_CARDS.map((item) => (
                <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Business"
              title="Image To PDF For Businesses"
              description="Businesses convert image files to PDF to keep records, invoices, and reports in one stable document."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              {BUSINESS_CARDS.map((item) => (
                <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Archiving"
              title="Image To PDF For Document Archiving"
              description="Archiving gets easier when image files are turned into a single document with a stable page order."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              {ARCHIVE_CARDS.map((item) => (
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
              eyebrow="Mistakes"
              title="Common Conversion Mistakes"
              description="Good source images and good page order matter more than people think."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {MISTAKES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Best Practices For Image To PDF Conversion"
              description="A careful order and clear source images usually create the best result."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {BEST_PRACTICES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Summary"
            title="Benefits Of Combining Multiple Images Into One PDF"
            description="Combining images into one PDF creates one organized file instead of many separate attachments."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Organization</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Related pages stay together in one place, which makes the document easier to manage.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Sharing</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Recipients only need to open one PDF rather than several files.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Printing</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A combined PDF is often easier to print as a complete packet.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="Format Guide"
            description="Different formats serve different roles before and after conversion."
          />
          <div className="mt-6">
            <DataTable
              columns={['Format', 'Best Use Case', 'Advantages']}
              rows={SUPPORTED_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These concise answers are written for AI search systems and quick human reading."
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
