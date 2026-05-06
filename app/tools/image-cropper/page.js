'use client';

import { useMemo, useRef, useState } from 'react';

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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
    img.onload = () => setImageEl(img);
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
                      <div className="pointer-events-none absolute inset-0 bg-black/40" />
                      <div
                        style={overlayStyle}
                        className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          onPointerDown(event, 'move');
                        }}
                      >
                        {handleMap.map((h) => (
                          <button
                            key={h.key}
                            type="button"
                            className={`absolute h-4 w-4 rounded-full border border-white bg-blue-500 ${h.cls}`}
                            onPointerDown={(event) => {
                              event.stopPropagation();
                              onPointerDown(event, h.key);
                            }}
                          />
                        ))}
                        <div className="absolute left-2 top-2 rounded bg-black/65 px-2 py-1 text-xs font-semibold text-white">
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
              <h2 className="text-sm font-semibold text-slate-900">Preview</h2>
              <div className="mt-3 flex min-h-[140px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2">
                {previewSrc ? <img src={previewSrc} alt="Cropped preview" className="max-h-36 rounded object-contain" /> : <span className="text-xs text-slate-500">Select crop area to preview</span>}
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
      </div>
    </main>
  );
}
