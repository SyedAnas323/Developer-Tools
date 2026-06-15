'use client';

import Link from 'next/link';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useEffect, useMemo, useRef, useState } from 'react';

const SIZES = [
  { size: 16, use: 'Browser tab', name: 'favicon-16x16.png' },
  { size: 32, use: 'Taskbar / shortcuts', name: 'favicon-32x32.png' },
  { size: 48, use: 'Windows site icon', name: 'favicon-48x48.png' },
  { size: 64, use: 'General purpose', name: 'favicon-64x64.png' },
  { size: 128, use: 'Chrome Web Store', name: 'favicon-128x128.png' },
  { size: 180, use: 'Apple Touch Icon', name: 'apple-touch-icon.png' },
  { size: 192, use: 'Android / PWA', name: 'android-chrome-192x192.png' },
  { size: 512, use: 'PWA splash screen', name: 'android-chrome-512x512.png' },
];

const SIZE_TABLE_ROWS = [
  { size: '16x16', use: 'Browser tab / small UI', note: 'Most common tab icon size for desktop browsers.' },
  { size: '32x32', use: 'Standard favicon display', note: 'Used by many browser UI surfaces and shortcuts.' },
  { size: '48x48', use: 'Windows site icon', note: 'Helps in OS-level icon lists and bookmarks.' },
  { size: '64x64', use: 'General-purpose icon', note: 'Useful for extra clarity and ICO packaging.' },
  { size: '180x180', use: 'Apple touch icon', note: 'Used when iPhone users save a site to the home screen.' },
  { size: '192x192', use: 'Android app / PWA', note: 'Common PWA icon size for Android launchers.' },
  { size: '512x512', use: 'High-resolution app icon', note: 'Used for splash screens, manifests, and large device surfaces.' },
];

const FORMAT_ROWS = [
  { format: 'ICO', advantages: 'Multi-size container, broad legacy support, browser-friendly', useCase: 'Primary favicon file for websites' },
  { format: 'PNG', advantages: 'Sharp edges, transparency, simple delivery', useCase: 'Apple touch icons and web icons' },
  { format: 'SVG', advantages: 'Scalable vector, tiny file size for simple logos', useCase: 'Modern browser delivery and logo-based favicons' },
];

const BROWSER_ROWS = [
  { browser: 'Chrome', support: 'Supports ICO, PNG, SVG, and manifest icons', note: 'Uses multiple surfaces including tabs and bookmarks.' },
  { browser: 'Safari', support: 'Supports PNG and Apple touch icons, plus manifest-based assets', note: 'Home screen icons matter on Apple devices.' },
  { browser: 'Firefox', support: 'Supports ICO and PNG favicon references', note: 'Tab display is usually favicon-first.' },
  { browser: 'Edge', support: 'Supports ICO, PNG, SVG, and PWA manifest icons', note: 'Follows modern Windows and web app icon behavior.' },
  { browser: 'Mobile browsers', support: 'Often use manifest icons and Apple touch icons', note: 'Home screen and app launcher support is important.' },
];

const FAQS = [
  ['What is a favicon generator?', 'A favicon generator creates website icon files in the right sizes and formats so browsers and devices can display your brand correctly.'],
  ['What is a favicon?', 'A favicon is the small icon that represents a website in browser tabs, bookmarks, mobile home screens, and app-style launchers.'],
  ['Why do websites use favicons?', 'Websites use favicons to improve branding, recognition, and the visual identity of a page in browser interfaces.'],
  ['Which format should I use for a favicon?', 'ICO is the classic website favicon format, while PNG and SVG are common for modern browser and device support.'],
  ['Can I create a favicon online for free?', 'Yes. This favicon creator works online for free and generates a complete icon package in one ZIP file.'],
  ['What sizes do I need for a website favicon?', 'At minimum, 16x16 and 32x32 are essential. Many sites also use 180x180, 192x192, and 512x512 for mobile and PWA support.'],
  ['Do favicons help branding?', 'Yes. A consistent favicon makes a site easier to recognize in tabs, bookmarks, and saved shortcuts.'],
  ['Why is PNG useful for favicons?', 'PNG supports transparency and crisp edges, which is ideal for logos and app-style icons.'],
  ['What is an ICO file?', 'An ICO file is a favicon container that can include multiple sizes in one file, which is useful for compatibility.'],
  ['Do mobile devices use favicons?', 'Yes. Mobile devices often use Apple touch icons, manifest icons, and home-screen shortcuts.'],
  ['Can I use SVG for a favicon?', 'Yes. SVG is useful for simple logos and scalable icons when browser support fits your target audience.'],
  ['Should a favicon be square?', 'Yes. Favicons are usually designed as square icons so they scale cleanly across browser and device surfaces.'],
  ['What makes a good favicon design?', 'A good favicon is simple, high-contrast, and readable at very small sizes.'],
  ['Can a favicon improve user experience?', 'Yes. It helps users spot your site faster when multiple tabs are open or when pages are saved.'],
  ['Does a favicon affect SEO?', 'Favicons are not a ranking factor by themselves, but they improve recognition, trust, and user experience.'],
];

const RELATED_TOOLS = [
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/image-format-converter', label: 'Image Format Converter' },
  { href: '/tools/background-remover', label: 'Background Remover' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/json-formatter', label: 'JSON Formatter' },
  { href: '/tools/password-generator', label: 'Password Generator' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

const HOW_TO_STEPS = [
  'Upload a square or near-square logo image in PNG, JPG, WebP, or SVG format.',
  'Choose your background, padding, and shape so the icon reads clearly at small sizes.',
  'Preview the favicon at multiple resolutions to confirm edge clarity and contrast.',
  'Generate the package and download the ZIP with ICO, PNG, and manifest-ready icons.',
];

const BEST_PRACTICES = [
  'Keep the symbol simple so it remains visible at 16x16 and 32x32 sizes.',
  'Use strong contrast between the icon and the background.',
  'Avoid tiny words, thin lines, and overly detailed illustrations.',
  'Create both ICO and PNG assets so browser and device support stays broad.',
  'Match the favicon style to your logo, app icon, or brand mark.',
  'Test the icon on light and dark backgrounds before publishing.',
];

const MISTAKES = [
  'Using a full logo with small text that becomes unreadable in browser tabs.',
  'Choosing a non-square source image that crops awkwardly in icon sizes.',
  'Skipping Apple touch and PWA icon sizes for mobile users.',
  'Using low-contrast colors that disappear in browser chrome.',
  'Uploading a highly detailed image that looks messy when reduced.',
];

const SEO_BENEFITS = [
  {
    title: 'Brand Recognition',
    text: 'A custom favicon helps people instantly identify your website when multiple tabs are open.',
  },
  {
    title: 'User Confidence',
    text: 'A polished favicon makes a site feel more established and easier to trust.',
  },
  {
    title: 'Better Recognition On Mobile',
    text: 'Home screen shortcuts and browser tabs become more consistent when you use the right favicon formats.',
  },
  {
    title: 'Cleaner Browser Experience',
    text: 'Browsers display favicons as visual anchors, making it easier for users to return to your site.',
  },
];

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawIcon(canvas, image, options) {
  const { background, customColor, paddingPct, shape } = options;
  const size = canvas.width;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  if (background === 'white' || background === 'custom') {
    ctx.fillStyle = background === 'white' ? '#ffffff' : customColor;
    ctx.fillRect(0, 0, size, size);
  }

  const pad = Math.floor((paddingPct / 100) * size);
  const drawW = Math.max(1, size - pad * 2);
  const drawH = drawW;
  const dx = (size - drawW) / 2;
  const dy = (size - drawH) / 2;

  ctx.save();
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, drawW / 2, 0, Math.PI * 2);
    ctx.clip();
  } else if (shape === 'rounded') {
    roundRectPath(ctx, dx, dy, drawW, drawH, size * 0.16);
    ctx.clip();
  }

  const fit = Math.min(drawW / image.naturalWidth, drawH / image.naturalHeight);
  const targetW = image.naturalWidth * fit;
  const targetH = image.naturalHeight * fit;
  const ix = dx + (drawW - targetW) / 2;
  const iy = dy + (drawH - targetH) / 2;
  ctx.drawImage(image, ix, iy, targetW, targetH);
  ctx.restore();
}

function buildIcoFromPng(pngBytes, size) {
  const headerSize = 6;
  const entrySize = 16;
  const total = headerSize + entrySize + pngBytes.length;
  const buffer = new ArrayBuffer(total);
  const view = new DataView(buffer);
  const arr = new Uint8Array(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);

  arr[6] = size === 256 ? 0 : size;
  arr[7] = size === 256 ? 0 : size;
  arr[8] = 0;
  arr[9] = 0;
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, pngBytes.length, true);
  view.setUint32(18, headerSize + entrySize, true);

  arr.set(pngBytes, headerSize + entrySize);
  return new Blob([buffer], { type: 'image/x-icon' });
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
              <tr key={row.size || row.format || row.browser} className="align-top">
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

export default function FaviconGeneratorPage() {
  const fileRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageEl, setImageEl] = useState(null);
  const [fileBase, setFileBase] = useState('favicon');
  const [background, setBackground] = useState('transparent');
  const [customColor, setCustomColor] = useState('#0f172a');
  const [paddingPct, setPaddingPct] = useState(0);
  const [shape, setShape] = useState('square');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const previewStyle = useMemo(
    () => ({ background, customColor, paddingPct, shape }),
    [background, customColor, paddingPct, shape]
  );

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function onSelectFile(file) {
    if (!file) return;
    const valid = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!valid.includes(file.type)) {
      setError('Please upload JPG, PNG, WebP, or SVG image.');
      return;
    }
    setError('');
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const nextUrl = URL.createObjectURL(file);
    const nextImage = new window.Image();
    nextImage.onload = () => {
      setImageEl(nextImage);
      setImageUrl(nextUrl);
      setFileBase(file.name.replace(/\.[^/.]+$/, '') || 'favicon');
    };
    nextImage.src = nextUrl;
  }

  async function generatePackage() {
    if (!imageEl) {
      setError('Please upload an image first.');
      return;
    }

    try {
      setBusy(true);
      setError('');
      const zip = new JSZip();
      const iconBuffers = {};

      for (const entry of SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = entry.size;
        canvas.height = entry.size;
        drawIcon(canvas, imageEl, previewStyle);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) continue;
        const bytes = new Uint8Array(await blob.arrayBuffer());
        iconBuffers[entry.size] = bytes;
        zip.file(entry.name, bytes);
      }

      if (iconBuffers[64]) {
        zip.file('favicon.ico', buildIcoFromPng(iconBuffers[64], 64));
      }

      const manifest = {
        name: `${fileBase} favicon pack`,
        short_name: fileBase,
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color:
          background === 'transparent' ? '#ffffff' : background === 'white' ? '#ffffff' : customColor,
        background_color:
          background === 'transparent' ? '#ffffff' : background === 'white' ? '#ffffff' : customColor,
        display: 'standalone',
      };
      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${fileBase}-favicon-pack.zip`);
    } catch {
      setError('Failed to generate favicon package. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Website Icon Creator
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              Favicon Generator Online Free
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Create favicon files for your website, browser tabs, mobile shortcuts, and PWA
              manifests. Upload a logo once, preview the icon in multiple sizes, then download a
              complete favicon pack that includes ICO, PNG, and web-app ready assets.
            </p>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Upload Asset
                  </span>
                  <p className="mt-2 text-sm text-slate-600">Use JPG, PNG, WebP, or SVG</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Upload Image
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
                    className="hidden"
                    onChange={(e) => onSelectFile(e.target.files?.[0])}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Current Style
                  </span>
                  <p className="mt-2 text-sm text-slate-600">Background, padding, and shape controls</p>
                  <p className="mt-4 text-2xl font-bold text-blue-700">{shape}</p>
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {!imageEl ? (
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    onSelectFile(e.dataTransfer.files?.[0]);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="mt-4 rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-white p-8 text-center"
                >
                  <p className="text-lg font-semibold text-slate-900">Drag & drop a logo here</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Square images usually work best for a favicon maker and website icon generator.
                  </p>
                </div>
              ) : null}

              {imageEl ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SIZES.map((entry) => (
                    <div key={entry.size} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="mb-2 text-xs font-semibold text-slate-500">
                        {entry.size}x{entry.size} - {entry.use}
                      </div>
                      <div className="flex min-h-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <FaviconPreview image={imageEl} size={entry.size} options={previewStyle} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Background</h3>
                <div className="mt-3 flex gap-2">
                  {['transparent', 'white', 'custom'].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBackground(bg)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                        background === bg
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
                {background === 'custom' ? (
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="mt-3 h-10 w-full rounded-xl border border-slate-300 bg-white p-1"
                  />
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Padding: {paddingPct}%</h3>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={paddingPct}
                  onChange={(e) => setPaddingPct(Number(e.target.value))}
                  className="mt-3 w-full accent-blue-600"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Shape</h3>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {['square', 'rounded', 'circle'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShape(s)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                        shape === s
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={generatePackage}
                disabled={busy || !imageEl}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? 'Generating...' : 'Download Favicon Package'}
              </button>

              {imageEl ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Output Pack</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Downloaded ZIP includes favicon.ico, PNG variants, Apple touch icon, Android
                    icons, and a site.webmanifest file.
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Short Answer</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">What Is A Favicon Generator?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            A favicon generator is a browser icon creator that turns a logo or brand mark into the
            multiple file sizes and formats a website needs. Instead of manually exporting each size,
            the generator prepares favicon PNG, ICO, and manifest assets that browsers, phones, and
            web apps can use consistently.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is A Favicon?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A favicon is the small icon shown in browser tabs, bookmarks, saved shortcuts, and
                app-like surfaces. It helps people recognize your website faster.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Why Websites Use Favicons</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Websites use favicons for branding, recognition, and a cleaner browser experience when
                multiple tabs or bookmarks are open.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How Favicons Work</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Browsers read favicon references from HTML tags, manifest files, or platform-specific
                icons and display them in different UI surfaces.
              </p>
            </article>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">AI Overview Summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The most useful favicon setup usually includes ICO for compatibility, PNG for
              transparency and clarity, and 180x180, 192x192, and 512x512 icons for Apple and PWA
              surfaces.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Create A Favicon Online"
              description="The process is fast when you choose a simple logo, preview it in multiple sizes, and export the full pack."
            />
            <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
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
              title="Benefits Of Using A Favicon"
              description="A small icon has a surprisingly large effect on recognition and the overall browser experience."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {SEO_BENEFITS.map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Branding"
              title="Why Favicons Matter For Branding"
              description="Favicons are small, but they reinforce the brand every time a user sees your site in a browser."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <p className="text-sm leading-7 text-slate-600">
              Branding works best when a user sees the same icon repeatedly across tabs, bookmarks,
              history, and home screens. A custom favicon makes your site easier to remember and helps
              the browser interface feel polished instead of generic. For many sites, it becomes the
              smallest but most frequent brand touchpoint.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="Favicons appear across websites, applications, and launch surfaces, which makes them useful in many different workflows."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['Business Websites', 'Professional brands use a favicon to look polished in browser tabs and bookmarks.'],
              ['Ecommerce Stores', 'Stores use favicon icons to make shopping tabs easier to find and return to.'],
              ['Blogs', 'Blogs benefit from an icon that helps readers recognize the site quickly.'],
              ['SaaS Applications', 'Web apps often use a favicon to look app-like and more trustworthy.'],
              ['Mobile Web Apps', 'Mobile devices rely on icons for home-screen shortcuts and launchers.'],
              ['Personal Portfolios', 'Creators and freelancers use a favicon as part of their visual identity.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Sizes"
            title="Favicon Sizes Explained"
            description="Different browser and device surfaces use different icon sizes, which is why multiple exports matter."
          />
          <div className="mt-6">
            <DataTable columns={['Favicon Size', 'Recommended Use', 'Note']} rows={SIZE_TABLE_ROWS} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Formats"
            title="ICO vs PNG vs SVG Favicons"
            description="The right format depends on browser compatibility, design style, and how much scalability you need."
          />
          <div className="mt-6">
            <DataTable columns={['Format', 'Advantages', 'Best Use Case']} rows={FORMAT_ROWS} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">ICO</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                ICO is the classic favicon format because it can bundle multiple sizes in one file and
                remains widely recognized by browsers.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">PNG</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                PNG is ideal for transparent, crisp, and highly readable icons, especially when the
                design uses a logo mark or simple symbol.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">SVG</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                SVG is a scalable vector format that works well for modern browsers and simple icons
                that need to look sharp at any size.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Support"
            title="Browser Support For Favicons"
            description="Browsers read favicons in slightly different ways, so a complete favicon pack helps coverage."
          />
          <div className="mt-6">
            <DataTable columns={['Browser', 'Support', 'Notes']} rows={BROWSER_ROWS} />
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Browser favicon support has evolved from a single ICO file to a mix of tab icons, touch
            icons, manifest icons, and home-screen assets. On desktop, the favicon is most visible in
            tabs and bookmarks. On mobile, icons often come from touch icons or manifest files, which
            is why modern site icon generators export several formats together.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Favicon Best Practices"
              description="Good favicon design prioritizes clarity at very small sizes."
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
              title="Common Favicon Mistakes"
              description="Most favicon problems come from using a design that looks fine large but fails at tiny sizes."
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
              eyebrow="SEO"
              title="Favicons For SEO And User Experience"
              description="Favicons are not a ranking signal by themselves, but they improve how users perceive and interact with a site."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A favicon helps users identify your website faster, which can improve browser tab
              recognition, bookmark usage, and the overall professionalism of the site. Those are
              user-experience benefits, and user experience is part of how successful websites build
              trust and keep visitors engaged.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Branding"
              title="Favicons For Brand Recognition"
              description="A custom icon becomes a visual anchor that users remember across sessions and devices."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              When a user sees your icon repeatedly in tabs, history, or saved screens, the brand
              becomes easier to recognize. That repeated exposure supports recall, especially for
              businesses, SaaS products, blogs, and ecommerce sites with active repeat visitors.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Implementation"
            title="Favicon Technology Explained"
            description="Favicons are implemented through a mix of HTML references, manifest files, and platform-specific icon files."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">HTML Implementation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Websites point to favicon files using link tags in the head so browsers can load the
                right asset for tabs and bookmarks.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Manifest Implementation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Web app manifests help browsers and mobile devices know which icons to use for
                standalone app-like experiences.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Mobile Implementation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Mobile devices often use 180x180 or 192x192 icons for home screens and launcher
                surfaces, making those sizes important to include.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise enough for quick readers and detailed enough for AI search extraction."
          />
          <div className="mt-6 space-y-4">
            {FAQS.map(([question, answer]) => (
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
            description="Use these tools to continue your workflow after designing a favicon."
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Favicon Generator Online Free - PNG SVG to Favicon Pack | MyToolsHub',
            url: 'https://toolshub.cyphersol.com/tools/favicon-generator',
            description:
              'Generate full favicon package online free from PNG, JPG, WebP, or SVG. Includes .ico, Apple touch icon, Android icons, and web manifest in one ZIP.',
            isPartOf: {
              '@type': 'WebSite',
              name: 'MyToolsHub',
              url: 'https://toolshub.cyphersol.com',
            },
            inLanguage: 'en',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Favicon Generator',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            url: 'https://toolshub.cyphersol.com/tools/favicon-generator',
            description:
              'Create favicon packs online for free with ICO, PNG, Apple touch, Android, and manifest-ready icons.',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                name: 'Favicon Generator',
                item: 'https://toolshub.cyphersol.com/tools/favicon-generator',
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How To Create A Favicon Online',
            totalTime: 'PT2M',
            step: HOW_TO_STEPS.map((step) => ({
              '@type': 'HowToStep',
              name: step,
              text: step,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
              },
            })),
          }),
        }}
      />
    </main>
  );
}

function FaviconPreview({ image, size, options }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !image) return;
    const canvas = ref.current;
    canvas.width = size;
    canvas.height = size;
    drawIcon(canvas, image, options);
  }, [image, options, size]);

  return <canvas ref={ref} className="h-16 w-16 rounded border border-slate-200 bg-transparent" />;
}
