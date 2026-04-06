'use client';

import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const canvasRef = useRef(null);

  const downloadQR = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            QR Generator
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Generate QR codes in a more professional interface
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter a URL or text value, preview the QR code instantly, and download it as a PNG
            file when ready.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                URL or text
              </span>
              <input
                type="text"
                placeholder="Enter URL or text here..."
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            {text && (
              <button
                onClick={downloadQR}
                className="mt-4 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Download QR Code
              </button>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Live Preview
            </p>
            <div className="mt-4 flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
              <div
                ref={canvasRef}
                className={`rounded-2xl p-4 ${text ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'bg-transparent'}`}
              >
                {text ? (
                  <QRCodeCanvas value={text} size={220} bgColor="#ffffff" fgColor="#0f172a" level="H" />
                ) : (
                  <div className="flex h-[220px] w-[220px] items-center justify-center text-center text-sm text-slate-400">
                    Enter text or a URL to preview the QR code.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
