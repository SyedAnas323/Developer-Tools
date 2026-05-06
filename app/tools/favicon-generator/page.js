'use client';

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

  const previewStyle = useMemo(() => ({ background, customColor, paddingPct, shape }), [background, customColor, paddingPct, shape]);

  function onSelectFile(file) {
    if (!file) return;
    const valid = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!valid.includes(file.type)) {
      alert('Please upload JPG, PNG, WebP, or SVG image.');
      return;
    }
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
      alert('Please upload an image first.');
      return;
    }
    try {
      setBusy(true);
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
        theme_color: background === 'transparent' ? '#ffffff' : background === 'white' ? '#ffffff' : customColor,
        background_color: background === 'transparent' ? '#ffffff' : background === 'white' ? '#ffffff' : customColor,
        display: 'standalone',
      };
      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${fileBase}-favicon-pack.zip`);
    } catch {
      alert('Failed to generate favicon package. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Favicon Generator</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create complete favicon pack instantly</h1>
        <p className="mt-2 text-sm text-slate-600">Upload once, preview all standard sizes, then download full ZIP package.</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
            className="hidden"
            onChange={(e) => onSelectFile(e.target.files?.[0])}
          />
          <div
            onDrop={(e) => {
              e.preventDefault();
              onSelectFile(e.dataTransfer.files?.[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center"
          >
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Upload Image
            </button>
            <p className="mt-3 text-sm text-slate-600">Drag & drop or click to upload (JPG, PNG, WebP, SVG)</p>
            <p className="mt-1 text-xs font-medium text-amber-600">Tip: Square images work best</p>
          </div>
        </div>

        {imageEl ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Preview All Sizes</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SIZES.map((entry) => {
                  const canvasId = `preview-${entry.size}`;
                  return (
                    <div key={entry.size} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="mb-2 text-xs font-semibold text-slate-500">{entry.size}x{entry.size} - {entry.use}</div>
                      <div className="flex min-h-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <FaviconPreview id={canvasId} image={imageEl} size={entry.size} options={previewStyle} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Background</h3>
                <div className="mt-3 flex gap-2">
                  {['transparent', 'white', 'custom'].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBackground(bg)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold ${background === bg ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
                {background === 'custom' ? (
                  <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="mt-3 h-10 w-full rounded-xl border border-slate-300 bg-white p-1" />
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Padding: {paddingPct}%</h3>
                <input type="range" min={0} max={20} value={paddingPct} onChange={(e) => setPaddingPct(Number(e.target.value))} className="mt-3 w-full" />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Shape</h3>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {['square', 'rounded', 'circle'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShape(s)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold ${shape === s ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={generatePackage} disabled={busy} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {busy ? 'Generating...' : 'Generate Favicon Package'}
              </button>
            </aside>
          </div>
        ) : null}

      </div>
    </main>
  );
}

function FaviconPreview({ id, image, size, options }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !image) return;
    const canvas = ref.current;
    canvas.width = size;
    canvas.height = size;
    drawIcon(canvas, image, options);
  }, [image, options, size]);

  return <canvas id={id} ref={ref} className="h-16 w-16 rounded border border-slate-200 bg-transparent" />;
}
