'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';
import { TOOL_FAQS } from '../faq-data';

const HOW_TO_STEPS = [
  'Upload a JPG, PNG, or WebP image from your device.',
  'Let the compressor create a smaller version in your browser.',
  'Compare the original size with the compressed size.',
  'Download the optimized image and use it on your site or campaign.',
];

const FORMAT_ROWS = [
  {
    format: 'JPG',
    bestUse: 'Photographs, blog images, hero banners',
    transparency: 'No',
    compression: 'Excellent',
  },
  {
    format: 'PNG',
    bestUse: 'Logos, graphics, screenshots, transparent images',
    transparency: 'Yes',
    compression: 'Good, but often larger than JPG',
  },
  {
    format: 'WebP',
    bestUse: 'Modern websites, product galleries, mobile-first pages',
    transparency: 'Yes',
    compression: 'Excellent',
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Best for photos',
    jpg: 'Excellent',
    png: 'Good',
    webp: 'Excellent',
  },
  {
    feature: 'Best for transparency',
    jpg: 'No',
    png: 'Yes',
    webp: 'Yes',
  },
  {
    feature: 'Typical file size',
    jpg: 'Small',
    png: 'Large',
    webp: 'Smallest in many cases',
  },
  {
    feature: 'Browser support',
    jpg: 'Universal',
    png: 'Universal',
    webp: 'Modern browsers',
  },
  {
    feature: 'Best use case',
    jpg: 'Web images without transparency',
    png: 'Crisp graphics and cutouts',
    webp: 'Fast-loading web assets',
  },
];

const BEST_PRACTICES = [
  'Resize images to the exact display size before compression.',
  'Use JPG for photos and WebP when your stack supports it.',
  'Keep PNG only when you need transparency or sharp graphics.',
  'Avoid uploading oversized files when a smaller source image is enough.',
  'Compress product images before adding them to ecommerce listings.',
  'Test a few quality settings so you keep the image usable and light.',
];

const MISTAKES = [
  'Compressing a tiny file again and again until the image looks soft.',
  'Using PNG for every photo even when JPG or WebP would be smaller.',
  'Uploading a huge image and expecting compression to solve bad dimensions.',
  'Keeping transparent graphics in JPG, which removes the alpha channel.',
  'Skipping image compression on product pages, blog posts, and landing pages.',
];

const USE_CASES = [
  {
    title: 'Website Hero Images',
    text: 'Hero banners often carry the largest visual files on a page. Compressing them helps keep the first screen fast without changing the design direction.',
  },
  {
    title: 'Blog Images',
    text: 'Blog posts usually contain multiple visuals. Smaller images reduce page weight and keep readers moving through the article.',
  },
  {
    title: 'Product Galleries',
    text: 'Ecommerce galleries need clean visuals and quick loading times. Compression keeps product pages light while preserving enough detail for purchase decisions.',
  },
  {
    title: 'Social Creatives',
    text: 'Social graphics are often reused across platforms. A compressed export is easier to upload, share, and repurpose.',
  },
  {
    title: 'Email Campaigns',
    text: 'Email assets should be compact because large images can slow loading and make campaigns feel heavy on mobile.',
  },
  {
    title: 'Documentation and Thumbnails',
    text: 'Screenshots, thumbnails, and help-center images usually do not need large source files. Compression keeps them crisp but manageable.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/image-compressor', label: 'JPG Compressor' },
  { href: '/tools/image-compressor', label: 'PNG Compressor' },
  { href: '/tools/image-format-converter', label: 'WebP Converter' },
  { href: '/tools/image-format-converter', label: 'Image Converter' },
  { href: '/tools/image-cropper', label: 'Crop Image' },
  { href: '/tools/image-cropper', label: 'Rotate Image' },
  { href: '/tools/image-resizer', label: 'Resize Image Online' },
];

function formatFileSize(bytes) {
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
              <tr key={row.feature} className="align-top">
                <td className="px-5 py-4 font-medium text-slate-900">{row.feature}</td>
                {Object.entries(row)
                  .filter(([key]) => key !== 'feature')
                  .map(([key, value]) => (
                    <td key={key} className="px-5 py-4 text-slate-600">
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

export default function ImageCompressor() {
  const inputRef = useRef(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [previewUrl, downloadUrl]);

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setCompressedFile(null);
    setUploadedImage(null);
    setPreviewUrl('');
    setDownloadUrl('');
    setOriginalSize(0);
    setLoading(false);
    setError('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setLoading(true);
    setError('');
    setCompressedFile(null);
    setUploadedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDownloadUrl('');
    setOriginalSize(file.size);

    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const nextFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type || file.type,
      });

      setCompressedFile(nextFile);
      setDownloadUrl(URL.createObjectURL(nextFile));
    } catch (err) {
      console.error(err);
      setError('Image compression failed. Please try another file.');
    } finally {
      setLoading(false);
    }
  };

  const currentFaqs = TOOL_FAQS['image-compressor'] || [];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Free Image Compressor Online - Reduce JPG, PNG & WebP Size | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/image-compressor',
    description:
      'Compress JPG, PNG and WebP images online for free. Reduce image file size without noticeable quality loss. Fast, secure and easy to use image compression tool.',
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

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Compress Images Online',
    description:
      'Upload an image, let the compressor create a smaller version, compare the result, and download the optimized file.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Image Compressor',
      },
    ],
    step: HOW_TO_STEPS.map((step) => ({
      '@type': 'HowToStep',
      name: step,
      text: step,
    })),
  };

  const originalBytes = originalSize;
  const compressedBytes = compressedFile?.size || 0;
  const savingsBytes = originalBytes > compressedBytes ? originalBytes - compressedBytes : 0;
  const savingsPercent = originalBytes
    ? Math.max(0, Math.round((savingsBytes / originalBytes) * 100))
    : 0;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Image Compressor Online
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Free Image Compressor Online
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Compress JPG, PNG, and WebP images in your browser to reduce file size without
              turning the page into a design mess. It is built for faster websites, lighter
              product pages, and cleaner sharing on mobile.
            </p>
          </div>

          <div className="p-8">
            {!uploadedImage && !loading ? (
              <div className="relative">
                <input
                  ref={inputRef}
                  id="image-compressor-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <label
                  htmlFor="image-compressor-input"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-blue-200 bg-blue-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-100/70"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Click to upload an image</p>
                  <p className="mt-2 text-sm text-slate-500">
                    JPG, PNG, and WebP files work best for compression.
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
                <h2 className="text-xl font-bold text-slate-900">Compressing image...</h2>
                <p className="mt-2 text-sm text-slate-500">
                  The tool is creating a lighter version of your file.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-red-600">
                {error}
              </div>
            ) : null}

            {previewUrl && !loading ? (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Original
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
                        alt="Uploaded preview"
                        className="mx-auto max-h-[320px] rounded-xl object-contain"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Compressed Result
                    </p>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
                      {compressedFile ? (
                        <img
                          src={downloadUrl}
                          alt="Compressed image preview"
                          className="mx-auto max-h-[320px] rounded-xl object-contain"
                        />
                      ) : (
                        <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                          Waiting for compressed output...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {compressedFile ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Original Size
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatFileSize(originalBytes)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Compressed Size
                      </p>
                      <p className="mt-2 text-2xl font-bold text-emerald-600">
                        {formatFileSize(compressedBytes)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Saved
                      </p>
                      <p className="mt-2 text-2xl font-bold text-blue-600">
                        {savingsPercent}% smaller
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  {compressedFile ? (
                    <a
                      href={downloadUrl}
                      download={compressedFile.name}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Download Compressed Image
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Upload New Image
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Short Answer
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use JPG for standard photos, PNG for transparency or crisp graphics, and WebP when
              you want a modern format with strong compression for the web.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Fast-loading blog posts, ecommerce product pages, social creatives, thumbnails, and
              image-heavy landing pages.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A smaller image file that is easier to upload, easier to share, and more suitable for
              websites that care about speed.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is Image Compression?"
            description="Image compression is the process of reducing image file size by removing unnecessary data or storing the image more efficiently. The goal is simple: keep the picture visually useful while making the file lighter for websites, apps, emails, and social platforms."
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Lossy Compression</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Lossy compression removes some image data that most viewers will not notice. It is
                usually the best option for photos, product shots, and blog banners because it can
                produce the smallest file sizes. JPG and WebP commonly use this approach.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Lossless Compression</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Lossless compression keeps all image data intact and reorganizes it more efficiently.
                It is useful when exact detail matters, especially for graphics, screenshots, logos,
                and images that need transparency. PNG often behaves this way.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The practical rule is straightforward: compress photos with JPG or WebP, keep PNG for
              transparency and graphics, and resize before compressing whenever possible. That order
              gives the best balance of quality, speed, and file size.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Compress Images Online"
              description="The best compression workflow is quick, repeatable, and easy to follow. You upload the file, let the tool optimize it, compare the result, and download the lighter version."
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
              title="Benefits Of Using An Image Compressor"
              description="Smaller images do more than save storage. They help pages feel faster, reduce upload friction, and keep your site easier to manage at scale."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Faster page load times for users on mobile and desktop.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Lower bandwidth usage for websites, product catalogs, and file sharing.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Better control over the quality-versus-size tradeoff.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Easier publishing on CMS platforms, email tools, and social channels.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="SEO"
            title="Why Image Compression Matters For SEO"
            description="Image size is one of the easiest ways to improve perceived speed. Search engines care about page experience, and users care even more when a page takes too long to open."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Faster Largest Contentful Paint</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Large image files are often the slowest assets on a page. Compressing them helps the
                visible content load earlier.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Better Mobile Experience</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Mobile visitors often use slower connections. Smaller image files keep pages easier
                to browse and reduce waiting time.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Cleaner Crawl Budget Use</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Efficient pages are easier for search engines to process, especially when many pages
                reuse a large number of images.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              People Also Ask
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The short answer is that image compression supports SEO because it reduces the page
              weight that browsers must download. That often improves load speed, lowers bounce risk,
              and makes content easier to consume on slower devices.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="Image compression is not only for designers. It helps anyone who publishes visual content, from store owners and marketers to bloggers and developers."
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
            title="Supported Formats"
            description="For most web work, JPG, PNG, and WebP cover the majority of use cases. Each format has a different balance of file size, transparency, and image quality."
          />
          <div className="mt-6">
            <DataTable
              columns={['Format', 'Best Use Case', 'Transparency', 'Compression Efficiency']}
              rows={FORMAT_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="JPG vs PNG vs WebP"
            description="When people ask which format is best, the real answer depends on the image content and whether transparency matters. This table gives a quick rule-of-thumb comparison."
          />
          <div className="mt-6">
            <DataTable columns={['Feature', 'JPG', 'PNG', 'WebP']} rows={COMPARISON_ROWS} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Best Practices For Image Optimization"
              description="The strongest results usually come from combining resizing, format choice, and compression in the right order."
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
              title="Frequently Asked Mistakes"
              description="Most compression problems come from the wrong format choice, oversize dimensions, or pushing quality too far down."
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
            eyebrow="Ecommerce"
            title="Image Compression For Ecommerce"
            description="Online stores rely on visual quality, but the fastest product page usually wins. Compression helps product galleries load smoothly without forcing you to sacrifice the image entirely."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Why Stores Use It</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Smaller product images reduce file weight on category pages, product detail pages,
                and homepage banners. That keeps browsing fast and makes mobile shopping feel less
                heavy.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Conversion-Friendly Visuals</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A clean, compressed product image still looks sharp enough for decision-making while
                loading quickly enough to keep shoppers moving through the funnel.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="WordPress"
            title="Image Compression For WordPress"
            description="WordPress sites often accumulate large uploads over time. Compressing before upload is a simple way to control file size and avoid unnecessary weight on every post."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Before Upload</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Compressing first gives you tighter control over quality and size, which is helpful
                for featured images, blog headers, and media libraries that grow quickly.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">After Upload</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Even when a plugin handles optimization later, starting with smaller files usually
                gives better results and keeps your site storage cleaner.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Social Media"
            title="Image Compression For Social Media"
            description="Social platforms compress images too, but it still helps to start with a file that is already optimized. That makes uploads faster and reduces the chance of obvious degradation."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Post Graphics</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Compressed JPG or WebP files work well for feed posts, reels covers, and ad creatives
                because they keep the file light and easy to share.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Story and Ad Assets</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Social assets often need fast iteration. Smaller files help creators test, export,
                and upload variations without waiting around.
              </p>
            </div>
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
            description="Use these tools when you need to adjust the image after compression or move into another visual workflow."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </main>
  );
}
