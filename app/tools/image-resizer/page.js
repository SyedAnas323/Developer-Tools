'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TOOL_FAQS } from '../faq-data';

const HOW_TO_STEPS = [
  'Upload a JPG, PNG, or WebP image from your device.',
  'Choose your target width and height or keep the original aspect ratio.',
  'Select an output format if you want JPG, PNG, or WebP specifically.',
  'Click resize, review the preview, and download the final file.',
];

const SOCIAL_SIZES = [
  {
    platform: 'Facebook',
    recommendedWidth: '1200 px',
    recommendedHeight: '630 px',
    commonUse: 'Link posts, shared articles, ad creatives',
  },
  {
    platform: 'Instagram',
    recommendedWidth: '1080 px',
    recommendedHeight: '1080 px',
    commonUse: 'Feed posts, square creatives, profile-friendly images',
  },
  {
    platform: 'X (Twitter)',
    recommendedWidth: '1600 px',
    recommendedHeight: '900 px',
    commonUse: 'Posts, article cards, promoted visuals',
  },
  {
    platform: 'LinkedIn',
    recommendedWidth: '1200 px',
    recommendedHeight: '627 px',
    commonUse: 'Shared links, company updates, banner-style visuals',
  },
  {
    platform: 'Pinterest',
    recommendedWidth: '1000 px',
    recommendedHeight: '1500 px',
    commonUse: 'Pins, shopping content, visual discovery cards',
  },
  {
    platform: 'YouTube',
    recommendedWidth: '1280 px',
    recommendedHeight: '720 px',
    commonUse: 'Thumbnails, previews, channel branding graphics',
  },
];

const WEBSITE_SIZES = [
  {
    type: 'Hero Banner',
    width: '1920 px',
    height: '1080 px',
    notes: 'Best for large landing page banners and high-resolution hero sections.',
  },
  {
    type: 'Feature Image',
    width: '1600 px',
    height: '900 px',
    notes: 'Good for blog headers, product features, and editorial layouts.',
  },
  {
    type: 'Card Image',
    width: '1200 px',
    height: '800 px',
    notes: 'Works well for content cards, previews, and article thumbnails.',
  },
  {
    type: 'Thumbnail',
    width: '800 px',
    height: '800 px',
    notes: 'Useful for grids, galleries, and smaller promotional blocks.',
  },
  {
    type: 'Logo Slot',
    width: '600 px',
    height: '600 px',
    notes: 'Keeps logos and icons sharp before scaling them down in CSS.',
  },
];

const RESIZE_VS_COMPRESS = [
  {
    feature: 'What changes',
    resize: 'Width and height',
    compress: 'File weight and encoding efficiency',
  },
  {
    feature: 'Main goal',
    resize: 'Fit a layout or platform requirement',
    compress: 'Reduce file size without changing display size',
  },
  {
    feature: 'Best when',
    resize: 'The image is too large or the wrong shape',
    compress: 'The image already fits but is too heavy',
  },
  {
    feature: 'Typical result',
    resize: 'Different pixel dimensions',
    compress: 'Same dimensions, smaller file',
  },
  {
    feature: 'Used together',
    resize: 'Resize first',
    compress: 'Then compress for the lightest final file',
  },
];

const FORMAT_ROWS = [
  {
    format: 'JPG',
    bestUse: 'Photographs, blog images, banners',
    transparency: 'No',
    scaling: 'Good',
  },
  {
    format: 'PNG',
    bestUse: 'Screenshots, logos, transparent graphics',
    transparency: 'Yes',
    scaling: 'Excellent for crisp edges',
  },
  {
    format: 'WebP',
    bestUse: 'Modern web assets, mobile-first pages',
    transparency: 'Yes',
    scaling: 'Excellent with smaller files',
  },
];

const BEST_PRACTICES = [
  'Match the target display area instead of uploading oversized originals.',
  'Keep aspect ratio locked when the layout requires natural proportions.',
  'Use JPG for standard photos and PNG only when transparency or sharp edges matter.',
  'Choose WebP when you want a modern web format with strong efficiency.',
  'Resize before compressing if you also need a smaller file size.',
  'Export one master size for each major platform rather than reusing random dimensions.',
];

const MISTAKES = [
  'Stretching an image into a ratio that does not match the original composition.',
  'Using a huge source file for a small content card or thumbnail slot.',
  'Saving every image as PNG even when JPG or WebP would be lighter.',
  'Resizing after upload without checking the actual display size on the page.',
  'Forgetting that social platforms crop or reframe images differently.',
];

const USE_CASES = [
  {
    title: 'Website Images',
    text: 'Resize images to match the exact area where they will appear. That keeps layouts stable and prevents oversized files from slowing the page down.',
  },
  {
    title: 'Ecommerce Product Photos',
    text: 'Product pages often need the same dimensions across a catalog. Consistent image size makes the store look cleaner and easier to scan.',
  },
  {
    title: 'Blog Images',
    text: 'Editorial content usually uses a repeatable image ratio for featured images, inline visuals, and category thumbnails.',
  },
  {
    title: 'Social Media Posts',
    text: 'Each platform favors a different size, so resizing helps avoid awkward crops, blurry uploads, and empty padding.',
  },
  {
    title: 'Email Attachments',
    text: 'Email images should be small enough to load quickly and light enough to avoid adding unnecessary weight to messages.',
  },
  {
    title: 'Mobile Applications',
    text: 'App screens, onboarding graphics, and preview assets often require exact dimensions for a smooth product experience.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/background-remover', label: 'Background Remover' },
  { href: '/tools/image-cropper', label: 'Image Cropper' },
  { href: '/tools/image-format-converter', label: 'Image Format Converter' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getExtensionFromMime(mimeType, fallback = 'jpg') {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/jpeg') return 'jpg';
  return fallback;
}

function getOutputMime(outputFormat, sourceMimeType) {
  if (outputFormat !== 'original') return outputFormat;
  if (sourceMimeType === 'image/png') return 'image/png';
  if (sourceMimeType === 'image/webp') return 'image/webp';
  return 'image/jpeg';
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
              <tr key={row[columns[0].toLowerCase()] || row.feature || row.type || row.platform} className="align-top">
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

export default function ImageResizer() {
  const inputRef = useRef(null);
  const [image, setImage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [resizedUrl, setResizedUrl] = useState('');
  const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
  const [resizedDimensions, setResizedDimensions] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(1200);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState('original');
  const [originalFileSize, setOriginalFileSize] = useState(0);
  const [resizedFileSize, setResizedFileSize] = useState(0);
  const [sourceMimeType, setSourceMimeType] = useState('image/jpeg');
  const [downloadName, setDownloadName] = useState('resized-image.jpg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, resizedUrl]);

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setImage('');
    setPreviewUrl('');
    setResizedUrl('');
    setOriginalDimensions({ w: 0, h: 0 });
    setResizedDimensions({ w: 0, h: 0 });
    setWidth(1200);
    setHeight(1200);
    setMaintainAspectRatio(true);
    setOutputFormat('original');
    setOriginalFileSize(0);
    setResizedFileSize(0);
    setSourceMimeType('image/jpeg');
    setDownloadName('resized-image.jpg');
    setLoading(false);
    setError('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);

    const url = URL.createObjectURL(file);
    const reader = new FileReader();

    setLoading(true);
    setError('');
    setImage(url);
    setPreviewUrl(url);
    setResizedUrl('');
    setOriginalFileSize(file.size);
    setSourceMimeType(file.type || 'image/jpeg');

    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalDimensions({ w: img.width, h: img.height });
        setResizedDimensions({ w: img.width, h: img.height });
        setLoading(false);
      };
      img.onerror = () => {
        setLoading(false);
        setError('Unable to read this image. Please try a different file.');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (value) => {
    const nextWidth = value === '' ? '' : Number(value);
    setWidth(nextWidth);

    if (maintainAspectRatio && originalDimensions.w && originalDimensions.h && nextWidth !== '') {
      const nextHeight = Math.round((Number(nextWidth) * originalDimensions.h) / originalDimensions.w);
      setHeight(nextHeight);
    }
  };

  const handleHeightChange = (value) => {
    const nextHeight = value === '' ? '' : Number(value);
    setHeight(nextHeight);

    if (maintainAspectRatio && originalDimensions.w && originalDimensions.h && nextHeight !== '') {
      const nextWidth = Math.round((Number(nextHeight) * originalDimensions.w) / originalDimensions.h);
      setWidth(nextWidth);
    }
  };

  const resizeImage = () => {
    if (!image || !width || !height) return;

    setLoading(true);
    setError('');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const targetMime = getOutputMime(outputFormat, sourceMimeType);
    const targetWidth = Number(width);
    const targetHeight = Number(height);

    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (ctx) {
        if (targetMime === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }

      const quality = targetMime === 'image/jpeg' ? 0.92 : undefined;
      const outputUrl = canvas.toDataURL(targetMime, quality);
      const blobSize = Math.round((outputUrl.length * 3) / 4);

      setResizedUrl(outputUrl);
      setResizedFileSize(blobSize);
      setResizedDimensions({ w: targetWidth, h: targetHeight });
      setDownloadName(`resized-image.${getExtensionFromMime(targetMime)}`);
      setLoading(false);
    };

    img.onerror = () => {
      setLoading(false);
      setError('Could not resize this file. Please upload another image.');
    };

    img.src = image;
  };

  const currentFaqs = TOOL_FAQS['image-resizer'] || [];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Resize Image Online Free - Change Image Width & Height | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/image-resizer',
    description:
      'Resize any image to exact dimensions online for free. Change width and height in pixels, maintain aspect ratio, and download JPG, PNG, or WebP.',
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
    name: 'Image Resizer',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://toolshub.cyphersol.com/tools/image-resizer',
    description:
      'Resize images online for free, change image dimensions in pixels, and download an optimized file in JPG, PNG, or WebP.',
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
        name: 'Image Resizer',
        item: 'https://toolshub.cyphersol.com/tools/image-resizer',
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Resize Images Online',
    description:
      'Upload an image, set target dimensions, choose an output format, resize the file, and download the result.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Image Resizer',
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

  const originalPixels = originalDimensions.w && originalDimensions.h
    ? `${originalDimensions.w} x ${originalDimensions.h} px`
    : 'Not loaded yet';
  const resizedPixels = resizedDimensions.w && resizedDimensions.h
    ? `${resizedDimensions.w} x ${resizedDimensions.h} px`
    : 'Not generated yet';
  const savings = originalFileSize && resizedFileSize
    ? Math.max(0, Math.round((1 - resizedFileSize / originalFileSize) * 100))
    : 0;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-600 px-8 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Image Resizer Online
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Free Image Resizer Online
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Resize image dimensions in seconds and keep the workflow clean for website images,
              ecommerce product photos, social posts, and mobile assets. Choose exact pixels, keep
              the aspect ratio, and download the result in a web-ready format.
            </p>
          </div>

          <div className="p-8">
            {!image && !loading ? (
              <div className="relative">
                <input
                  ref={inputRef}
                  id="image-resizer-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <label
                  htmlFor="image-resizer-input"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-indigo-200 bg-indigo-50 px-6 text-center transition hover:border-indigo-400 hover:bg-indigo-100/70"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Click to upload an image</p>
                  <p className="mt-2 text-sm text-slate-500">
                    JPG, PNG, and WebP files work best for resizing.
                  </p>
                </label>
              </div>
            ) : null}

            {loading ? (
              <div className="py-12 text-center">
                <div className="relative mx-auto mb-5 h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Processing image...</h2>
                <p className="mt-2 text-sm text-slate-500">
                  The tool is reading the file and preparing the resized output.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-red-600">
                {error}
              </div>
            ) : null}

            {image && !loading ? (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Original Preview
                      </p>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Upload Another
                      </button>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
                      <img
                        src={previewUrl}
                        alt="Original image preview"
                        className="mx-auto max-h-[320px] rounded-xl object-contain"
                      />
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Original dimensions: {originalPixels}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Resized Result
                    </p>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
                      {resizedUrl ? (
                        <img
                          src={resizedUrl}
                          alt="Resized image preview"
                          className="mx-auto max-h-[320px] rounded-xl object-contain"
                        />
                      ) : (
                        <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                          Choose a size and click resize to generate output.
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Resized dimensions: {resizedPixels}</p>
                  </div>
                </div>

                <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 md:grid-cols-4">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Width
                    </span>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Height
                    </span>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Output Format
                    </span>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    >
                      <option value="original">Auto / Original</option>
                      <option value="image/jpeg">JPG</option>
                      <option value="image/png">PNG</option>
                      <option value="image/webp">WebP</option>
                    </select>
                  </label>

                  <label className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />
                    <span className="text-sm font-medium text-slate-700">Lock aspect ratio</span>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Original Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {formatBytes(originalFileSize)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Resized Size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                      {resizedFileSize ? formatBytes(resizedFileSize) : 'Not ready'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Saved
                    </p>
                    <p className="mt-2 text-2xl font-bold text-indigo-600">
                      {resizedFileSize ? `${savings}% smaller` : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={resizeImage}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Resize Image
                  </button>
                  {resizedUrl ? (
                    <a
                      href={resizedUrl}
                      download={downloadName}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Download Image
                    </a>
                  ) : null}
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Short Answer
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              An image resizer changes width and height so an image fits a specific layout, platform,
              or pixel requirement without guessing.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Website hero images, ecommerce product photos, social media graphics, blog thumbnails,
              and app assets that need exact dimensions.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              The output can stay in the same format or switch to JPG, PNG, or WebP depending on
              what the page, platform, or workflow needs.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is An Image Resizer?"
            description="An image resizer changes the dimensions of an image so the file matches the space where it will be used. That can mean a smaller thumbnail for a card layout, a larger banner for a landing page, or a social post format that avoids awkward cropping."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Image Dimensions Explained</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Image dimensions describe the number of pixels across the width and height of an
                image. A file that is 1200 by 800 pixels contains more visual information than one
                that is 600 by 400 pixels. Bigger numbers usually mean more detail, but they also
                mean a larger file and more work for the browser.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Pixels, Width, and Height</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Pixels are the tiny dots that make up an image. Width measures how many pixels run
                horizontally, while height measures how many run vertically. A resize tool changes
                those values so an image can fit a layout without leaving unnecessary blank space or
                turning into an oversized upload.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The simplest way to think about image resizing is this: the tool changes the pixel
              dimensions so the image fits the destination better. If the width and height match the
              target slot, the page usually looks cleaner and loads more efficiently.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Resize Images Online"
              description="A good resizing workflow starts with the image you already have and ends with dimensions that match the place where the file will appear."
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
              title="Benefits Of Resizing Images"
              description="Resizing helps you control the visual shape of an image, keep designs consistent, and avoid shipping files that are bigger than they need to be."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Improves layout consistency across pages, cards, and galleries.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Reduces the chance of stretching, cropping mistakes, and blurry thumbnails.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Makes uploads easier to manage in CMS platforms and ecommerce stores.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Helps teams prepare the same asset for multiple screen sizes and placements.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Why Size Matters"
            title="Why Image Size Matters"
            description="Image size affects how quickly a page loads, how sharp an image looks, and how much space the file consumes in a design system or media library."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Page Experience</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Large images can delay the first visible part of a page, especially on mobile and
                slower networks.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Visual Fit</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A correct width and height keeps the image aligned with the intended slot, so the
                design looks deliberate rather than forced.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Operational Efficiency</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Smaller and properly sized files are easier to store, transfer, and reuse across
                multiple platforms.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="Image resizing appears in almost every content workflow because platforms, layouts, and devices all expect different pixel dimensions."
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
            eyebrow="Social Sizes"
            title="Standard Image Sizes For Social Media"
            description="Social platforms often display content differently depending on placement. Using the recommended width and height helps reduce awkward cropping and keeps your graphics sharp."
          />
          <div className="mt-6">
            <DataTable
              columns={['Platform', 'Recommended Width', 'Recommended Height', 'Common Use']}
              rows={SOCIAL_SIZES}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Website Sizes"
            title="Standard Image Sizes For Websites"
            description="Website images should match the design slot they occupy. A hero banner, feature image, or card thumbnail each needs a different dimension strategy."
          />
          <div className="mt-6">
            <DataTable columns={['Type', 'Recommended Width', 'Recommended Height', 'Notes']} rows={WEBSITE_SIZES} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="Resize Image vs Compress Image"
            description="These two tasks are related, but they are not the same. Resizing changes the actual pixel dimensions, while compression reduces the file weight."
          />
          <div className="mt-6">
            <DataTable columns={['Feature', 'Resize Image', 'Compress Image']} rows={RESIZE_VS_COMPRESS} />
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">When To Use Each</p>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <div className="text-sm leading-7 text-slate-700">
                <strong className="text-slate-900">Resize</strong> when the image does not fit the
                target space.
              </div>
              <div className="text-sm leading-7 text-slate-700">
                <strong className="text-slate-900">Compress</strong> when the image fits but the file
                is still too heavy.
              </div>
              <div className="text-sm leading-7 text-slate-700">
                <strong className="text-slate-900">Use both</strong> when a large source image needs
                to fit a layout and stay light.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Formats"
            title="JPG vs PNG vs WebP"
            description="Different formats solve different problems. JPG is compact for photos, PNG protects transparency and crisp edges, and WebP often gives the best balance for modern web delivery."
          />
          <div className="mt-6">
            <DataTable
              columns={['Format', 'Best Use', 'Transparency', 'Scaling / Clarity']}
              rows={FORMAT_ROWS}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Best Practices For Image Resizing"
              description="Good resizing is mostly about matching the target environment rather than guessing a random number."
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
              title="Common Mistakes To Avoid"
              description="Most resizing problems happen when the output dimension does not match the real use case."
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

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="SEO"
              title="Image Resizing For SEO"
              description="Search engines do not rank images by size alone, but image dimensions influence speed, usability, and layout stability, which all support better page quality."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <p className="text-sm leading-7 text-slate-600">
              Resizing helps SEO when it prevents oversized files from reaching the browser. That
              matters because heavy images can slow down rendering, especially on mobile. If the
              image fits the slot exactly, browsers do less unnecessary work and users see the page
              sooner. In practical terms, resizing is one of the easiest ways to improve page speed,
              reduce image bloat, and keep content layouts stable.
            </p>
            <div className="mt-4 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                People Also Ask
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Why does image resizing help SEO? Because it reduces the amount of visual data a
                browser must load, which supports faster rendering, cleaner layouts, and a better
                user experience.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Ecommerce"
              title="Image Resizing For Ecommerce"
              description="Ecommerce stores benefit from image resizing because consistent dimensions make product grids, category pages, and listing cards feel more professional."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Store owners usually need one size for thumbnails, another for detail pages, and a
              third for promotional banners. A resize workflow keeps those variants clean and easier
              to manage. It also helps reduce the risk of blurry zoom views or huge image uploads
              that slow the storefront down.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Social Marketing"
              title="Image Resizing For Social Media Marketing"
              description="Social teams often repurpose the same asset for multiple channels. Resizing makes it easier to produce the right version for each platform without distortion."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A post designed for Instagram may need to become a LinkedIn banner, a YouTube thumbnail,
              or a Facebook card. When you resize deliberately, the brand looks consistent and the
              creative stays readable at every size.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are written in a short, direct style so they work for people, search engines, and AI summaries."
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
            description="Use these tools when you want to continue editing, optimize file size, or move into another image workflow."
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
    </main>
  );
}
