'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { TOOL_FAQS } from '../faq-data';

const HOW_TO_STEPS = [
  'Upload a JPG, PNG, WebP, GIF, BMP, or TIFF image.',
  'Preview the file and select your desired output format.',
  'Convert the image and review the output before downloading.',
  'Save the converted file and use it for web, design, or publishing tasks.',
];

const FORMAT_GUIDE_ROWS = [
  {
    format: 'JPG',
    bestUseCase: 'Photos, web images, and smaller file sizes',
    advantages: 'Universal support, compact files, simple delivery',
  },
  {
    format: 'PNG',
    bestUseCase: 'Logos, screenshots, transparent graphics',
    advantages: 'Lossless quality, transparency support, crisp edges',
  },
  {
    format: 'WEBP',
    bestUseCase: 'Modern websites and performance-focused assets',
    advantages: 'Smaller files, strong compression, transparency support',
  },
  {
    format: 'GIF',
    bestUseCase: 'Simple animations and lightweight graphics',
    advantages: 'Animation support, broad compatibility',
  },
  {
    format: 'BMP',
    bestUseCase: 'Legacy workflows and uncompressed image handling',
    advantages: 'Simple structure, broad software support in older tools',
  },
  {
    format: 'TIFF',
    bestUseCase: 'High-quality printing and archival use',
    advantages: 'High fidelity, flexible workflows, professional imaging',
  },
];

const JPG_PNG_WEBP_ROWS = [
  {
    feature: 'Compression',
    jpg: 'Lossy',
    png: 'Lossless',
    webp: 'Lossy or lossless',
  },
  {
    feature: 'Transparency',
    jpg: 'No',
    png: 'Yes',
    webp: 'Yes',
  },
  {
    feature: 'Typical file size',
    jpg: 'Small',
    png: 'Larger',
    webp: 'Often smallest for web',
  },
  {
    feature: 'Best use case',
    jpg: 'Photographs and standard images',
    png: 'Graphics, logos, screenshots',
    webp: 'Web performance and modern delivery',
  },
  {
    feature: 'Compatibility',
    jpg: 'Universal',
    png: 'Universal',
    webp: 'Modern browser support',
  },
];

const WHEN_TO_USE = [
  {
    title: 'Use JPG',
    text: 'Use JPG for photos, blog images, and product pictures where file size matters and transparency is not needed.',
  },
  {
    title: 'Use PNG',
    text: 'Use PNG for logos, screenshots, graphics, and any image that needs sharp edges or transparency.',
  },
  {
    title: 'Use WEBP',
    text: 'Use WEBP when you want excellent compression for websites, especially for performance-focused pages.',
  },
  {
    title: 'Convert Between Formats',
    text: 'Convert between formats when the destination platform, design need, or performance goal changes.',
  },
];

const USE_CASES = [
  {
    title: 'Website Optimization',
    text: 'Website owners convert images into efficient formats to reduce page weight and keep pages loading quickly.',
  },
  {
    title: 'Social Media Content',
    text: 'Creators convert images for platform-specific requirements, post clarity, and file-size limits.',
  },
  {
    title: 'Graphic Design',
    text: 'Designers switch between PNG, JPG, WebP, and TIFF depending on the project and delivery format.',
  },
  {
    title: 'Ecommerce Product Images',
    text: 'Stores use image conversion to balance product clarity, speed, and compatibility across product pages.',
  },
  {
    title: 'Mobile Applications',
    text: 'App teams choose the image type that best fits icons, onboarding graphics, and responsive assets.',
  },
  {
    title: 'Printing and Publishing',
    text: 'Publishers and print workflows often rely on high-quality formats like PNG or TIFF for final delivery.',
  },
];

const BEST_PRACTICES = [
  'Choose the output format based on the final use case, not just the source file type.',
  'Use WebP for web performance when browser support is acceptable.',
  'Use PNG when transparency or crisp detail matters more than file size.',
  'Use JPG for photos and images that do not need transparency.',
  'Keep source files at a high enough resolution before converting.',
  'Preview the result if the destination is a website, presentation, or print layout.',
];

const MISTAKES = [
  'Converting a photo to PNG when the only goal is a smaller file.',
  'Using JPG for a logo that needs transparency.',
  'Saving a web asset in BMP or TIFF when the page needs a lighter file.',
  'Assuming the same format is right for every platform.',
  'Ignoring browser and device support when choosing advanced formats.',
];

const SEO_CARDS = [
  {
    title: 'Performance',
    text: 'Modern formats like WebP often help pages load faster and use less bandwidth.',
  },
  {
    title: 'Consistency',
    text: 'Format conversion helps content teams standardize images across a website or CMS.',
  },
  {
    title: 'Quality Control',
    text: 'Different formats let you balance size, transparency, and clarity more precisely.',
  },
];

const ECOMMERCE_CARDS = [
  {
    title: 'Product Pages',
    text: 'Stores choose formats that keep product images sharp while loading quickly on category and detail pages.',
  },
  {
    title: 'Thumbnails',
    text: 'Smaller thumbnail files make browsing easier for shoppers.',
  },
  {
    title: 'Brand Assets',
    text: 'Logos and banners often need PNG or WebP depending on the display use case.',
  },
];

const DEV_CARDS = [
  {
    title: 'Front-End Performance',
    text: 'Developers convert image assets to formats that reduce page weight and improve perceived speed.',
  },
  {
    title: 'Responsive Delivery',
    text: 'Different screens and breakpoints often benefit from different image types and sizes.',
  },
  {
    title: 'CMS Workflows',
    text: 'A conversion tool helps teams standardize uploads before they go into a content system.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/background-remover', label: 'Background Remover' },
  { href: '/tools/image-cropper', label: 'Image Cropper' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

function formatBytes(bytes) {
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

function mimeFromFormat(format) {
  if (format === 'jpg') return 'image/jpeg';
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  return 'image/avif';
}

function extFromFormat(format) {
  if (format === 'jpg') return 'jpg';
  if (format === 'png') return 'png';
  if (format === 'webp') return 'webp';
  return 'avif';
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
              <tr key={row.feature || row.format || row.title} className="align-top">
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

export default function ImageFormatConverterPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [convertedSize, setConvertedSize] = useState(0);
  const inputRef = useRef(null);

  const currentFaqs = TOOL_FAQS['image-format-converter'] || [];

  const outputName = useMemo(() => {
    if (!file) return `converted.${extFromFormat(selectedFormat)}`;
    const base = file.name.replace(/\.[^/.]+$/, '');
    return `${base}.${extFromFormat(selectedFormat)}`;
  }, [file, selectedFormat]);

  const clearResult = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
    setConvertedSize(0);
  };

  const clearAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setDownloadUrl('');
    setConvertedSize(0);
    setFile(null);
    setPreviewUrl('');
    setError('');
    setLoading(false);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  function handleSelectFile(nextFile) {
    if (!nextFile) return;

    if (!nextFile.type.startsWith('image/')) {
      const message = 'Please upload a valid image file.';
      setError(message);
      return;
    }

    setError('');
    clearResult();
    setFile(nextFile);

    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target?.result || '');
    reader.readAsDataURL(nextFile);
  }

  function onInputChange(event) {
    const nextFile = event.target.files?.[0];
    handleSelectFile(nextFile);
  }

  function onDrop(event) {
    event.preventDefault();
    const nextFile = event.dataTransfer.files?.[0];
    handleSelectFile(nextFile);
  }

  async function handleConvert() {
    if (!file || !previewUrl) return;

    setLoading(true);
    setError('');
    clearResult();

    try {
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const mimeType = mimeFromFormat(selectedFormat);
      const blob = await new Promise((resolve) => {
        const quality = selectedFormat === 'jpg' || selectedFormat === 'webp' ? 0.9 : undefined;
        canvas.toBlob((resultBlob) => resolve(resultBlob), mimeType, quality);
      });

      if (!blob) {
        throw new Error('Conversion failed');
      }

      setDownloadUrl(URL.createObjectURL(blob));
      setConvertedSize(blob.size);
    } catch {
      const message = 'Selected format is not supported on this browser. Please try another format.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Image Format Converter Online Free - PNG, JPG, WebP, AVIF | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/image-format-converter',
    description:
      'Convert image formats online for free. Switch between PNG, JPG, WebP, and AVIF with instant preview and download. No signup needed.',
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
    name: 'Image Format Converter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://toolshub.cyphersol.com/tools/image-format-converter',
    description:
      'Convert image formats online for free, switch between JPG, PNG, WebP, GIF, BMP, and TIFF, and download the converted file instantly.',
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
        name: 'Image Format Converter',
        item: 'https://toolshub.cyphersol.com/tools/image-format-converter',
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Convert Image Formats Online',
    description:
      'Upload an image, select an output format, convert the file, and download the result.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Image Format Converter',
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

  const selectedFileSize = file ? formatBytes(file.size) : '0 B';
  const resultFileSize = convertedSize ? formatBytes(convertedSize) : 'Not ready yet';
  const savedBytes = file && convertedSize ? Math.max(0, file.size - convertedSize) : 0;
  const savedPercent = file && convertedSize ? Math.max(0, Math.round((savedBytes / file.size) * 100)) : 0;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Image File Converter
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Free Image Format Converter Online
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Convert image format online for web, design, ecommerce, and publishing workflows.
              Switch between JPG, PNG, WebP, GIF, BMP, and TIFF with an easy preview, then download
              the converted file in a format that fits your project.
            </p>
          </div>

          <div className="p-8">
            {!previewUrl ? (
              <div
                onDrop={onDrop}
                onDragOver={(event) => event.preventDefault()}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6"
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-format-converter-input"
                  onChange={onInputChange}
                />
                <label
                  htmlFor="image-format-converter-input"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-white px-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    Drag & drop image here or click to upload
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Supports PNG, JPG, WebP, GIF, BMP, TIFF, and other common image types
                  </p>
                </label>
              </div>
            ) : null}

            {previewUrl ? (
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Preview
                  </p>
                  <div className="max-h-[420px] overflow-hidden rounded-2xl bg-slate-100 p-2">
                    <img src={previewUrl} alt="Preview" className="mx-auto max-h-[400px] rounded-lg object-contain" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Original Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{selectedFileSize}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Output Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">{resultFileSize}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Result
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">
                      {downloadUrl ? `${savedPercent}% smaller` : 'Ready to convert'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">Choose output format</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['jpg', 'png', 'webp', 'avif'].map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => {
                          setSelectedFormat(format);
                          clearResult();
                        }}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold uppercase transition ${
                          selectedFormat === format
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleConvert}
                    disabled={loading}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Converting...' : 'Convert & Download'}
                  </button>

                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      download={outputName}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Download {selectedFormat.toUpperCase()}
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
              An image format converter changes one file type into another so the image better fits
              a website, app, design file, or print workflow.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Photos, graphics, logos, screenshots, web assets, ecommerce images, and publishing
              workflows that need a different file type.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A converted image file that can be downloaded and used immediately.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is An Image Format Converter?"
            description="An image format converter changes a file from one image type to another. It is used when you need a different balance of compression, transparency, compatibility, or quality for the same visual content."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is An Image Format?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                An image format is the structure used to store visual data. JPG, PNG, WebP, GIF, BMP,
                and TIFF all store image content differently, which affects file size and quality.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Why Convert Image Formats?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Convert image formats when you need better compatibility, transparency, smaller files,
                or a format that fits web, design, or print requirements.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How Image Conversion Works</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The image is decoded into pixel data and then re-encoded in the selected format. That
                process changes compression, transparency handling, and compatibility characteristics.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Image format conversion is not just renaming a file extension. The process rewrites the
              image data into a different structure, which can improve performance, preserve
              transparency, or make the image easier to use in a specific workflow.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Convert Image Formats Online"
              description="The workflow is simple: upload, preview, choose the output format, convert, and download."
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
              title="Benefits Of Using An Image Converter"
              description="Format conversion helps you match image files to the task instead of forcing one format to do everything."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Improves compatibility for different websites, apps, and editors.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Lets you control transparency, quality, and file size more precisely.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Helps teams standardize files before publishing or uploading to a CMS.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Supports faster web delivery when modern formats like WebP are used.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Lossy vs Lossless"
            title="Detailed Explanation Of Image Formats"
            description="Image formats usually fall into lossy or lossless categories, and that choice changes how much detail and file size you get."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Lossy Image Formats</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Lossy formats remove some data to make the file smaller. JPG and many WebP files use
                lossy compression, which is ideal for photographs and web delivery.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Lossless Image Formats</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Lossless formats keep the image data intact. PNG and some WebP files are lossless and
                are often better for logos, screenshots, and graphics with sharp edges.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="Image conversion is useful anywhere file size, quality, or compatibility matters."
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

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Formats"
            title="Supported Image Formats"
            description="Each image format has a different role in editing, publishing, and delivery."
          />
          <div className="mt-6">
            <DataTable
              columns={['Format', 'Best Use Case', 'Advantages']}
              rows={FORMAT_GUIDE_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="JPG vs PNG vs WEBP"
            description="These are the most important formats for most web and content workflows."
          />
          <div className="mt-6">
            <DataTable
              columns={['Feature', 'JPG', 'PNG', 'WEBP']}
              rows={JPG_PNG_WEBP_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="When To Use"
            title="When To Use Each Image Format"
            description="Choose the output format according to the end goal, not the source format."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {WHEN_TO_USE.map((item) => (
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
              eyebrow="SEO"
              title="Image Format Conversion For SEO"
              description="Websites benefit from converting image formats because the right format can reduce file size and speed up page delivery."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {SEO_CARDS.map((item) => (
                <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Ecommerce"
              title="Image Conversion For Ecommerce"
              description="Stores use image conversion to balance clarity, load speed, and compatibility across product galleries."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {ECOMMERCE_CARDS.map((item) => (
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
              eyebrow="Web Development"
              title="Image Conversion For Web Development"
              description="Developers use image conversion to improve performance, standardize assets, and fit responsive layouts."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {DEV_CARDS.map((item) => (
                <article key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="WEBP"
              title="Benefits Of WEBP For SEO And Page Speed"
              description="WebP is often the best balance of modern compression and practical browser support."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              WebP is useful for page speed because it often produces smaller files than JPG or PNG
              while still supporting transparency. That can reduce image transfer size, improve
              perceived load speed, and help teams publish lighter pages without losing too much
              visual quality.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Best Practices For Image Conversion"
              description="A good conversion workflow starts with the right source file and the right output choice."
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
              description="These mistakes usually happen when format choice does not match the final use case."
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

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Summary"
            title="How Website Owners Optimize Image Formats"
            description="Website owners choose formats strategically to control page speed, compatibility, and visual quality."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The most common pattern is simple: use JPG for photos, PNG for logos and transparency,
            and WebP for modern websites where speed matters. Developers often prepare multiple image
            versions so each page can use the format that best matches the device, browser support,
            and rendering goal.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Ecommerce"
              title="How Ecommerce Stores Choose Image Formats"
              description="Ecommerce teams balance image clarity with page speed because product pages need both."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <p className="text-sm leading-7 text-slate-600">
              Ecommerce stores usually choose JPG for product photography, PNG for graphics and
              logos, and WebP when they want the smallest practical file for web delivery. The right
              format helps product grids load faster while keeping the shopping experience visually
              strong.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Performance"
              title="How Developers Use Image Conversion For Performance Optimization"
              description="Developers use conversion to reduce image bytes without changing the visual intent of the design."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <p className="text-sm leading-7 text-slate-600">
              Developers often convert source images into efficient web-ready formats, then pair that
              with responsive sizing and compression. This improves page speed, lowers bandwidth use,
              and helps ensure the image still looks good on multiple screen sizes.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise enough for quick readers and detailed enough for AI search extraction."
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
            description="Use these tools to continue the workflow after conversion."
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
