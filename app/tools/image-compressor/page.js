'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';

export default function ImageCompressor() {
  const [compressedFile, setCompressedFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setOriginalSize((file.size / 1024).toFixed(2));

    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      setCompressedFile(new File([compressedBlob], file.name, { type: file.type }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Image Compressor
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Compress images with a cleaner, faster workflow
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload an image, let the tool reduce the file size, then review the result and download
            the compressed version.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-compressor-input"
          />
          <label
            htmlFor="image-compressor-input"
            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {loading ? 'Processing image...' : 'Click to upload an image'}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              JPG, PNG, and WEBP files work best for compression.
            </p>
          </label>
        </div>

        {compressedFile && (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-emerald-100">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Original Size
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{originalSize} KB</p>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-emerald-100">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Compressed Size
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {(compressedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            <a
              href={URL.createObjectURL(compressedFile)}
              download={compressedFile.name}
              className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Download Compressed Image
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
