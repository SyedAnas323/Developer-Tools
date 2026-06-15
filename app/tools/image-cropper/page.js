'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const ASPECTS = [
  { key: 'free', label: 'Free', ratio: null },
  { key: '1:1', label: '1:1', ratio: 1 },
  { key: '4:3', label: '4:3', ratio: 4 / 3 },
  { key: '16:9', label: '16:9', ratio: 16 / 9 },
  { key: '3:2', label: '3:2', ratio: 3 / 2 },
  { key: '9:16', label: '9:16', ratio: 9 / 16 },
];

const OUTPUT_FORMATS = [
  { key: 'png', label: 'PNG', mime: 'image/png' },
  { key: 'jpg', label: 'JPG', mime: 'image/jpeg' },
  { key: 'webp', label: 'WebP', mime: 'image/webp' },
];

const HOW_TO_STEPS = [
  'Upload a JPG, PNG, WebP, or AVIF image.',
  'Draw a crop box on the image or choose an aspect ratio preset.',
  'Move or resize the crop area until the composition looks right.',
  'Choose the output format and download the cropped image instantly.',
];

const ASPECT_RATIO_ROWS = [
  { ratio: '1:1', useCase: 'Profile photos, product thumbnails, social posts' },
  { ratio: '4:5', useCase: 'Instagram portrait posts and ecommerce visuals' },
  { ratio: '16:9', useCase: 'Website banners, video thumbnails, landscape headers' },
  { ratio: '9:16', useCase: 'Stories, reels covers, vertical mobile content' },
  { ratio: '3:2', useCase: 'Photography, editorial images, general web usage' },
  { ratio: '2:3', useCase: 'Portrait photography and vertical layouts' },
];

const SOCIAL_DIMENSION_ROWS = [
  { platform: 'Instagram Feed', dimensions: '1:1 or 4:5', note: 'Use cropping to keep the subject centered.' },
  { platform: 'Instagram Story', dimensions: '9:16', note: 'Vertical crop is best for full-screen mobile display.' },
  { platform: 'Facebook Post', dimensions: '1:1 or 1.91:1', note: 'Crop to match feed layout and avoid awkward trimming.' },
  { platform: 'X / Twitter', dimensions: '16:9 or 1:1', note: 'Use crop spacing to keep the focal point visible.' },
  { platform: 'LinkedIn', dimensions: '1.91:1 or 1:1', note: 'Cropped visuals work well for professional content.' },
  { platform: 'Pinterest', dimensions: '2:3 or 1:1', note: 'Tall crops perform well in pin-style layouts.' },
];

const COMPARISON_ROWS = [
  { feature: 'Goal', crop: 'Change framing and visible area', resize: 'Change pixel dimensions', compress: 'Reduce file size' },
  { feature: 'Best For', crop: 'Composition, focus, and platform fit', resize: 'Layout matching and exact size targets', compress: 'Faster load times and smaller storage usage' },
  { feature: 'Quality Impact', crop: 'Keeps selected area only', resize: 'Can keep quality if downscaling', compress: 'May reduce quality depending on compression' },
  { feature: 'Typical Use', crop: 'Product photos, portraits, banners', resize: 'Social posts, thumbnails, web slots', compress: 'Publishing, upload limits, page speed' },
];

const CROPPING_BENEFITS = [
  'Helps the most important part of the image stay in frame.',
  'Improves composition and visual balance for different layouts.',
  'Removes distracting empty space or unwanted edges.',
  'Makes it easier to fit images into platform-specific dimensions.',
  'Supports better product presentation and more polished marketing visuals.',
];

const USE_CASES = [
  { title: 'Social Media Images', text: 'Creators crop posts, stories, and thumbnails so the subject stays centered and readable.' },
  { title: 'Ecommerce Product Photos', text: 'Stores crop product images tightly to present items clearly and consistently in catalogs.' },
  { title: 'Website Banners', text: 'Web teams crop headers and hero images so banners fit cleanly inside page layouts.' },
  { title: 'Blog Images', text: 'Editors crop article images to match editorial styles and featured-image proportions.' },
  { title: 'Marketing Graphics', text: 'Marketers crop ads and campaign visuals to keep the call to action and focal point visible.' },
  { title: 'Profile Pictures', text: 'Profile images are often cropped to a square or circle so faces remain centered.' },
];

const IMAGE_CROPPING_BASICS = [
  {
    title: 'What Is Image Cropping?',
    text: 'Image cropping means trimming the edges of a photo or graphic to change what remains visible in the final frame.',
  },
  {
    title: 'How Cropping Works',
    text: 'The crop area defines the visible portion of the image while the hidden edges are removed from the final output.',
  },
  {
    title: 'Why Cropping Matters',
    text: 'Cropping improves composition, keeps attention on the subject, and helps images fit platform-specific layouts.',
  },
];

const CROP_VS_RESIZE_ROWS = [
  { feature: 'Crop Image', crop: 'Yes', resize: 'No', compress: 'No' },
  { feature: 'Resize Image', crop: 'No', resize: 'Yes', compress: 'No' },
  { feature: 'Compress Image', crop: 'No', resize: 'Sometimes', compress: 'Yes' },
  { feature: 'Best Use Case', crop: 'Composition and framing', resize: 'Exact pixel targets', compress: 'File-size reduction' },
];

const RELATED_TOOLS = [
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/background-remover', label: 'Background Remover' },
  { href: '/tools/image-format-converter', label: 'Image Format Converter' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

const FAQS = [
  ['What is an image cropper?', 'An image cropper is a tool that lets you trim the edges of a photo or graphic to focus on the part you want to keep.'],
  ['Can I crop image online for free?', 'Yes. This online image cropper works free in the browser and does not require signup.'],
  ['Can I crop JPG and PNG files?', 'Yes. JPG, PNG, WebP, and AVIF images can be cropped in modern browsers.'],
  ['What is aspect ratio?', 'Aspect ratio is the relationship between width and height, such as 1:1, 4:5, 16:9, or 9:16.'],
  ['Should I crop or resize first?', 'Usually crop first if you want composition control, then resize if you need an exact final size.'],
  ['Does cropping reduce file size?', 'Cropping can reduce file size because it removes pixels, but compression is still better for smaller output files.'],
  ['Can I crop photos for social media?', 'Yes. Cropping is one of the most common ways to prepare photos for social media platforms.'],
  ['Is crop image dimensions the same as resize?', 'No. Cropping changes the visible area; resizing changes pixel dimensions of the whole image.'],
  ['Can I use it for ecommerce product photos?', 'Yes. Cropping is widely used in ecommerce to keep product shots centered and consistent.'],
  ['Can I crop profile pictures?', 'Yes. Square crops are common for avatars, profile images, and account photos.'],
  ['What format should I download?', 'PNG is ideal for general use, JPG is useful for photos, and WebP can be useful for modern web workflows.'],
  ['Does cropping affect quality?', 'Cropping itself does not blur the image, but enlarging a small crop later can reduce sharpness.'],
  ['Can I crop image dimensions manually?', 'Yes. You can drag the crop box or enter manual width and height values.'],
  ['Why is composition important?', 'Good composition makes the subject clearer, improves visual balance, and helps the image fit the intended platform.'],
  ['Can I crop images for website banners?', 'Yes. Banner-style crops help images fit hero sections, headers, and other web layouts.'],
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
              <tr key={row.ratio || row.platform || row.feature || row.title} className="align-top">
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

export default function ImageCropperPage() {
  const inputRef = useRef(null);
  const stageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageEl, setImageEl] = useState(null);
  const [fileName, setFileName] = useState('cropped-image');
  const [crop, setCrop] = useState(null);
  const [lastCrop, setLastCrop] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [aspectKey, setAspectKey] = useState('free');
  const [manualWidth, setManualWidth] = useState('');
  const [manualHeight, setManualHeight] = useState('');
  const [outputFormat, setOutputFormat] = useState('png');

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const selectedAspect = ASPECTS.find((item) => item.key === aspectKey) || ASPECTS[0];
  const previewSrc = useMemo(() => {
    if (!imageEl || !crop) return '';
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(crop.w));
    canvas.height = Math.max(1, Math.round(crop.h));
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(imageEl, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }, [crop, imageEl]);

  function getPoint(clientX, clientY) {
    const stage = stageRef.current;
    if (!stage || !imageEl) return null;
    const rect = stage.getBoundingClientRect();
    const scaleX = imageEl.naturalWidth / rect.width;
    const scaleY = imageEl.naturalHeight / rect.height;
    return {
      x: clamp((clientX - rect.left) * scaleX, 0, imageEl.naturalWidth),
      y: clamp((clientY - rect.top) * scaleY, 0, imageEl.naturalHeight),
    };
  }

  function readFile(nextFile) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const nextUrl = URL.createObjectURL(nextFile);
    setImageUrl(nextUrl);
    setFileName(nextFile.name.replace(/\.[^/.]+$/, '') || 'cropped-image');
    setCrop(null);
    setLastCrop(null);
    setManualWidth('');
    setManualHeight('');
    setAspectKey('free');
    const img = new window.Image();
    img.onload = () => {
      setImageEl(img);
      const padX = Math.max(4, Math.round(img.naturalWidth * 0.01));
      const padY = Math.max(4, Math.round(img.naturalHeight * 0.01));
      const initialCrop = {
        x: padX,
        y: padY,
        w: Math.max(1, img.naturalWidth - padX * 2),
        h: Math.max(1, img.naturalHeight - padY * 2),
      };
      setCrop(initialCrop);
      setLastCrop(initialCrop);
      setManualWidth(String(Math.round(initialCrop.w)));
      setManualHeight(String(Math.round(initialCrop.h)));
    };
    img.src = nextUrl;
  }

  function onPointerDown(event, mode) {
    const p = getPoint(event.clientX, event.clientY);
    if (!p) return;
    if (mode === 'new') {
      setDragState({ mode: 'new', startX: p.x, startY: p.y });
      return;
    }
    if (!crop) return;
    setDragState({
      mode,
      startX: p.x,
      startY: p.y,
      cropStart: { ...crop },
    });
  }

  function applyAspect(nextCrop) {
    if (!selectedAspect.ratio || !imageEl) return nextCrop;
    const ratio = selectedAspect.ratio;
    let w = nextCrop.w;
    let h = nextCrop.h;
    if (w / h > ratio) w = h * ratio;
    else h = w / ratio;
    return {
      ...nextCrop,
      w: clamp(w, 1, imageEl.naturalWidth - nextCrop.x),
      h: clamp(h, 1, imageEl.naturalHeight - nextCrop.y),
    };
  }

  function onPointerMove(event) {
    if (!dragState || !imageEl) return;
    const p = getPoint(event.clientX, event.clientY);
    if (!p) return;

    if (dragState.mode === 'new') {
      const x = Math.min(dragState.startX, p.x);
      const y = Math.min(dragState.startY, p.y);
      const w = Math.abs(p.x - dragState.startX);
      const h = Math.abs(p.y - dragState.startY);
      if (w < 2 || h < 2) return;
      const withAspect = applyAspect({ x, y, w, h });
      setCrop(withAspect);
      setManualWidth(String(Math.round(withAspect.w)));
      setManualHeight(String(Math.round(withAspect.h)));
      return;
    }

    const start = dragState.cropStart;
    if (!start) return;
    let next = { ...start };
    const dx = p.x - dragState.startX;
    const dy = p.y - dragState.startY;

    if (dragState.mode === 'move') {
      next.x = clamp(start.x + dx, 0, imageEl.naturalWidth - start.w);
      next.y = clamp(start.y + dy, 0, imageEl.naturalHeight - start.h);
    } else {
      const right = start.x + start.w;
      const bottom = start.y + start.h;
      if (dragState.mode.includes('n')) {
        next.y = clamp(start.y + dy, 0, bottom - 1);
        next.h = bottom - next.y;
      }
      if (dragState.mode.includes('s')) {
        next.h = clamp(start.h + dy, 1, imageEl.naturalHeight - start.y);
      }
      if (dragState.mode.includes('w')) {
        next.x = clamp(start.x + dx, 0, right - 1);
        next.w = right - next.x;
      }
      if (dragState.mode.includes('e')) {
        next.w = clamp(start.w + dx, 1, imageEl.naturalWidth - start.x);
      }
      next = applyAspect(next);
    }
    setCrop(next);
    setManualWidth(String(Math.round(next.w)));
    setManualHeight(String(Math.round(next.h)));
  }

  function onPointerUp() {
    if (crop) setLastCrop(crop);
    setDragState(null);
  }

  function applyManualSize() {
    if (!crop || !imageEl) return;
    const w = clamp(Number(manualWidth) || crop.w, 1, imageEl.naturalWidth - crop.x);
    const h = clamp(Number(manualHeight) || crop.h, 1, imageEl.naturalHeight - crop.y);
    const next = applyAspect({ ...crop, w, h });
    setCrop(next);
    setLastCrop(next);
  }

  async function cropAndDownload() {
    if (!imageEl || !crop) {
      alert('Please select a crop area first.');
      return;
    }
    const out = OUTPUT_FORMATS.find((f) => f.key === outputFormat) || OUTPUT_FORMATS[0];
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(crop.w));
    canvas.height = Math.max(1, Math.round(crop.h));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(imageEl, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, out.mime, out.key === 'jpg' ? 0.92 : undefined));
    if (!blob) {
      alert('Crop failed. Please try again.');
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}-cropped.${out.key}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function rotate(direction) {
    if (!imageEl) return;
    const canvas = document.createElement('canvas');
    const isRight = direction === 'right';
    canvas.width = imageEl.naturalHeight;
    canvas.height = imageEl.naturalWidth;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((isRight ? 90 : -90) * (Math.PI / 180));
    ctx.drawImage(imageEl, -imageEl.naturalWidth / 2, -imageEl.naturalHeight / 2);
    canvas.toBlob((blob) => {
      if (!blob) return;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const nextUrl = URL.createObjectURL(blob);
      const nextImg = new window.Image();
      nextImg.onload = () => {
        setImageEl(nextImg);
        setImageUrl(nextUrl);
        setCrop(null);
        setLastCrop(null);
      };
      nextImg.src = nextUrl;
    }, 'image/png');
  }

  function flip(horizontal) {
    if (!imageEl) return;
    const canvas = document.createElement('canvas');
    canvas.width = imageEl.naturalWidth;
    canvas.height = imageEl.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.translate(horizontal ? canvas.width : 0, horizontal ? 0 : canvas.height);
    ctx.scale(horizontal ? -1 : 1, horizontal ? 1 : -1);
    ctx.drawImage(imageEl, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const nextUrl = URL.createObjectURL(blob);
      const nextImg = new window.Image();
      nextImg.onload = () => {
        setImageEl(nextImg);
        setImageUrl(nextUrl);
        setCrop(null);
        setLastCrop(null);
      };
      nextImg.src = nextUrl;
    }, 'image/png');
  }

  function resetAll() {
    setCrop(null);
    setLastCrop(null);
    setManualWidth('');
    setManualHeight('');
    setAspectKey('free');
  }

  function undoMove() {
    if (!lastCrop) return;
    setCrop(lastCrop);
    setManualWidth(String(Math.round(lastCrop.w)));
    setManualHeight(String(Math.round(lastCrop.h)));
  }

  const overlayStyle = crop && imageEl ? {
    left: `${(crop.x / imageEl.naturalWidth) * 100}%`,
    top: `${(crop.y / imageEl.naturalHeight) * 100}%`,
    width: `${(crop.w / imageEl.naturalWidth) * 100}%`,
    height: `${(crop.h / imageEl.naturalHeight) * 100}%`,
  } : null;

  const handleMap = [
    { key: 'nw', cls: '-left-2 -top-2 cursor-nwse-resize' },
    { key: 'n', cls: 'left-1/2 -top-2 -translate-x-1/2 cursor-ns-resize' },
    { key: 'ne', cls: '-right-2 -top-2 cursor-nesw-resize' },
    { key: 'e', cls: '-right-2 top-1/2 -translate-y-1/2 cursor-ew-resize' },
    { key: 'se', cls: '-right-2 -bottom-2 cursor-nwse-resize' },
    { key: 's', cls: 'left-1/2 -bottom-2 -translate-x-1/2 cursor-ns-resize' },
    { key: 'sw', cls: '-left-2 -bottom-2 cursor-nesw-resize' },
    { key: 'w', cls: '-left-2 top-1/2 -translate-y-1/2 cursor-ew-resize' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <h1 className="text-3xl font-bold text-slate-900">Image Cropper</h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload image, select crop area with handles, preview live result, then crop and download instantly.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section>
            {!imageUrl ? (
              <div
                onDrop={(event) => {
                  event.preventDefault();
                  readFile(event.dataTransfer.files?.[0]);
                }}
                onDragOver={(event) => event.preventDefault()}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.avif,image/*"
                  className="hidden"
                  onChange={(event) => readFile(event.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-sm font-semibold text-slate-700 hover:border-blue-400"
                >
                  Drag & drop or click to upload (JPG, PNG, WebP, AVIF)
                </button>
              </div>
            ) : null}

            {imageUrl ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-100 p-3">
                <div
                  ref={stageRef}
                  className="relative mx-auto w-full max-w-3xl touch-none overflow-hidden rounded-xl bg-black/70"
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerUp}
                  onPointerDown={(event) => {
                    if (event.target === stageRef.current || event.target.tagName === 'IMG') {
                      onPointerDown(event, 'new');
                    }
                  }}
                >
                  <img src={imageUrl} alt="Crop source" className="block h-auto w-full select-none" draggable={false} />
                  {overlayStyle ? (
                    <>
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 bg-black/55"
                        style={{ height: overlayStyle.top }}
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/55"
                        style={{
                          top: `calc(${overlayStyle.top} + ${overlayStyle.height})`,
                        }}
                      />
                      <div
                        className="pointer-events-none absolute left-0 bg-black/55"
                        style={{
                          top: overlayStyle.top,
                          width: overlayStyle.left,
                          height: overlayStyle.height,
                        }}
                      />
                      <div
                        className="pointer-events-none absolute right-0 bg-black/55"
                        style={{
                          top: overlayStyle.top,
                          left: `calc(${overlayStyle.left} + ${overlayStyle.width})`,
                          height: overlayStyle.height,
                        }}
                      />
                      <div
                        style={overlayStyle}
                        className="absolute border-[3px] border-white"
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          onPointerDown(event, 'move');
                        }}
                      >
                        {handleMap.map((h) => (
                          <button
                            key={h.key}
                            type="button"
                            className={`absolute h-6 w-6 rounded-full border-2 border-white bg-blue-500 ${h.cls}`}
                            onPointerDown={(event) => {
                              event.stopPropagation();
                              onPointerDown(event, h.key);
                            }}
                          />
                        ))}
                        <div className="absolute left-3 top-3 rounded bg-black/70 px-3 py-1 text-sm font-semibold text-white">
                          {Math.round(crop.w)} x {Math.round(crop.h)} px
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">Preview</h2>
              <div className="mt-3 flex min-h-[140px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2">
                {previewSrc ? <img src={previewSrc} alt="Cropped preview" className="max-h-36 rounded object-contain" /> : <span className="text-xs text-slate-500">Select crop area to preview</span>}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">Aspect Ratio</h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {ASPECTS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setAspectKey(item.key)}
                    className={`rounded-xl border px-2 py-2 text-xs font-semibold ${aspectKey === item.key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">Manual Size (px)</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input value={manualWidth} onChange={(e) => setManualWidth(e.target.value)} placeholder="Width" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                <input value={manualHeight} onChange={(e) => setManualHeight(e.target.value)} placeholder="Height" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <button type="button" onClick={applyManualSize} className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Apply Size
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">Flip & Rotate</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => flip(true)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Flip H</button>
                <button type="button" onClick={() => flip(false)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Flip V</button>
                <button type="button" onClick={() => rotate('left')} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Rotate Left</button>
                <button type="button" onClick={() => rotate('right')} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Rotate Right</button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">Download</h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {OUTPUT_FORMATS.map((fmt) => (
                  <button
                    key={fmt.key}
                    type="button"
                    onClick={() => setOutputFormat(fmt.key)}
                    className={`rounded-xl border px-2 py-2 text-xs font-semibold ${outputFormat === fmt.key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={cropAndDownload} className="mt-3 w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Crop & Download
              </button>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={undoMove} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Undo</button>
                <button type="button" onClick={resetAll} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Reset</button>
              </div>
            </div>
          </aside>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Short Answer</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">What Is An Image Cropper?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            An image cropper is a photo cropper and image cropping tool that lets you trim the edges
            of a picture so the most important part stays in frame. Cropping changes composition,
            not just size, which makes it different from resizing or compression. A good online image
            cropper helps you crop JPG, crop PNG, and crop photo online for social media, ecommerce,
            blogs, and website design.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {IMAGE_CROPPING_BASICS.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">AI Overview Summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Cropping is best used when you need better framing, a different aspect ratio, or a
              tighter visual focus. Resizing changes pixel dimensions, while compression lowers file
              size.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Crop Images Online"
              description="Use the crop box, handles, and ratio presets to frame the subject before downloading."
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
              title="Benefits Of Cropping Images"
              description="Cropping helps the subject stand out and makes content fit the intended platform better."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {CROPPING_BENEFITS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Composition"
            title="Detailed Explanation Of Image Composition"
            description="Composition is the arrangement of elements inside the frame and is one of the main reasons cropping matters."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Subject Focus', 'Cropping can move the subject closer to center or into a stronger position inside the frame.'],
              ['Negative Space', 'Removing extra empty space helps the viewer focus on the main subject instead of distractions.'],
              ['Visual Balance', 'Good framing makes images feel intentional, balanced, and better suited to the target layout.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="Image cropping is used everywhere an image needs better framing or a different visual ratio."
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

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Ratios"
            title="Common Aspect Ratios Explained"
            description="Aspect ratio is the relationship between width and height. Matching the ratio to the platform avoids awkward cropping later."
          />
          <div className="mt-6">
            <DataTable columns={['Aspect Ratio', 'Common Use Case']} rows={ASPECT_RATIO_ROWS} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Dimensions"
            title="Social Media Image Dimensions"
            description="Different platforms crop images differently, so the best crop image dimensions depend on where the content will appear."
          />
          <div className="mt-6">
            <DataTable columns={['Platform', 'Common Dimensions', 'Note']} rows={SOCIAL_DIMENSION_ROWS} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Comparison"
              title="Crop Image vs Resize Image"
              description="Cropping and resizing are often used together, but they do different jobs in the workflow."
            />
            <div className="mt-6">
              <DataTable columns={['Feature', 'Crop Image', 'Resize Image']} rows={CROP_VS_RESIZE_ROWS} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Comparison"
              title="Crop Image vs Compress Image"
              description="Cropping changes the visible area, while compression reduces file size by optimizing the image data."
            />
            <div className="mt-6">
              <DataTable
                columns={['Feature', 'Crop Image', 'Compress Image']}
                rows={[
                  { feature: 'Purpose', crop: 'Changes framing', compress: 'Reduces file size' },
                  { feature: 'Quality', crop: 'Keeps selected area', compress: 'May lower quality if strong compression is used' },
                  { feature: 'Best Use', crop: 'Composition and platform fit', compress: 'Faster loading and storage savings' },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Format"
            title="Crop Image For Different Platforms"
            description="Cropping for the platform matters because each surface frames the image in a different way."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Social Media', 'Use square, portrait, or vertical crops so the subject stays visible in feed layouts and stories.'],
              ['Ecommerce', 'Crop product images consistently so catalogs look clean and professional across device sizes.'],
              ['Websites', 'Use wide crops for banners and hero sections, and center the subject inside the visible frame.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Ecommerce"
              title="How Ecommerce Stores Crop Product Photos"
              description="Stores crop product images to keep catalog grids aligned and product detail pages polished."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Product cropping is usually focused on consistency. Stores often center the item,
              remove unnecessary whitespace, and use matching aspect ratios so the gallery looks
              uniform across a collection. Clean framing can improve product visibility and the
              overall shopping experience.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Social"
              title="How Social Media Creators Use Cropping"
              description="Creators crop images to keep faces, text, and key objects inside the safe area of each platform."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Social content works better when the crop matches the platform. A portrait crop may
              work for stories, while a square crop can fit grid posts and profile previews. Cropping
              is often the step that turns a good image into a platform-ready post.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Best Practices"
            title="Best Practices For Image Cropping"
            description="Simple framing rules help your crops look better across websites, stores, and social platforms."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              'Keep the main subject away from the edge unless the design intentionally needs a tight crop.',
              'Use the platform aspect ratio before exporting when the destination has fixed dimensions.',
              'Crop around the story you want to tell, not just the part that happens to be centered in the original image.',
              'Check faces, product labels, and text so no important detail gets cut off.',
              'Review the crop in both mobile and desktop contexts when the image will be reused widely.',
              'If the image is too small, avoid cropping too aggressively because enlargement can reduce sharpness.',
            ].map((item) => (
              <article key={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-7 text-slate-600">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Mistakes"
            title="Common Cropping Mistakes"
            description="Most cropping issues come from cutting too close, ignoring the platform, or over-cropping the subject."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              'Cropping too tightly and cutting off heads, hands, or product edges.',
              'Choosing the wrong aspect ratio for the destination platform.',
              'Ignoring composition and leaving the main subject off-center.',
              'Using crop to try to fix a blurred or low-resolution source image.',
              'Not checking how the crop looks after the final export.',
              'Confusing cropping with resizing or compression.',
            ].map((item) => (
              <article key={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-7 text-slate-600">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="SEO"
              title="Image Cropping For Social Media"
              description="Social crops help posts look intentional and make sure the strongest visual element stays in frame."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Social media image cropping improves post quality by matching the layout rules of each
              platform. A clean crop can make the difference between a clipped-looking image and a
              professional post that feels designed for the feed. The crop should protect the subject,
              important text, and any brand mark.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="SEO"
              title="Image Cropping For Website Design"
              description="Website design uses cropping to fit banners, cards, hero sections, and profile visuals into fixed layouts."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Web designers crop assets to fit grids and responsive components. A hero banner may need
              a wide crop, while a team profile image may need a square crop. Proper framing keeps the
              page visually balanced and prevents awkward image cutoffs.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Summary"
            title="Benefits Of Proper Image Framing And Composition"
            description="Good framing makes images easier to understand, more balanced, and more useful across platforms."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Cropping is one of the simplest ways to improve image composition. It helps photographers,
            ecommerce teams, and content creators guide the viewer’s attention to the subject that
            matters most. When the crop matches the platform and the framing is balanced, the image
            looks more polished and performs better in real-world use.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
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

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Related Tools"
            title="Related Tools"
            description="Use these tools to continue the image and document workflow."
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Image Cropper Online Free - Crop JPG PNG WebP AVIF | MyToolsHub',
              url: 'https://toolshub.cyphersol.com/tools/image-cropper',
              description:
                'Crop images online for free with drag handles, aspect ratio presets, rotate, flip, live preview, and instant download. No signup needed.',
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
              name: 'Image Cropper',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              url: 'https://toolshub.cyphersol.com/tools/image-cropper',
              description:
                'Crop JPG, PNG, WebP, and AVIF images online for free with aspect ratio presets and instant download.',
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
                  name: 'Image Cropper',
                  item: 'https://toolshub.cyphersol.com/tools/image-cropper',
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
              name: 'How To Crop Images Online',
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
      </div>
    </main>
  );
}
