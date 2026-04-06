'use client';

import { useEffect, useRef, useState } from 'react';

export default function LogoRemover() {
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = image;
    img.onload = () => {
      const maxWidth = 800;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 40;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    };
  }, [image]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => setImage(loadEvent.target.result);
    reader.readAsDataURL(file);
  };

  const startDrawing = (event) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    canvasRef.current.getContext('2d').closePath();
    setIsDrawing(false);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'logo-removed.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const clearCanvas = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Logo Remover
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Remove simple logos and marks in a cleaner workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload an image, paint over the logo area on the canvas, and download the cleaned PNG
            result when you are done.
          </p>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
          id="logo-upload"
        />

        {!image ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <label
              htmlFor="logo-upload"
              className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-900">Click to upload an image</p>
              <p className="mt-2 text-sm text-slate-500">
                After upload, paint over the area you want to erase.
              </p>
            </label>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div
              className="inline-block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              style={{ background: 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 16px 16px' }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                className="block cursor-crosshair"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadImage}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Download PNG
              </button>
              <button
                onClick={clearCanvas}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
