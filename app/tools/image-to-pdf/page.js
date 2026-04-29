'use client';

import { useMemo, useState } from 'react';

function formatFileSize(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return 'Unknown size';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[index]}`;
}

export default function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const previews = useMemo(
    () =>
      images.map((file) => ({
        key: `${file.name}-${file.size}`,
        name: file.name,
        size: formatFileSize(file.size),
        src: URL.createObjectURL(file),
      })),
    [images]
  );

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    setError('');
    setDownloadUrl('');
    setImages(files);
  };

  const removeImage = (targetIndex) => {
    setImages((current) => current.filter((_, index) => index !== targetIndex));
    setDownloadUrl('');
  };

  const convertToPdf = async () => {
    if (!images.length) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      images.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/image-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Image to PDF conversion failed.');
      }

      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Image To PDF
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Convert JPG, PNG, SVG, and WEBP images into one PDF
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload one or more images, review the selected files, and generate a downloadable PDF
            using your existing iLovePDF integration.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
            onChange={handleFiles}
            className="hidden"
            id="image-to-pdf-input"
          />
          <label
            htmlFor="image-to-pdf-input"
            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900">Click to select image files</p>
            <p className="mt-2 text-sm text-slate-500">
              Supported formats: JPG, PNG, SVG, WEBP
            </p>
          </label>
        </div>

        {previews.length > 0 && (
          <div className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Selected Images ({previews.length})
              </h2>
              <button
                type="button"
                onClick={convertToPdf}
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Generating PDF...' : 'Convert to PDF'}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previews.map((preview, index) => (
                <div key={preview.key} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                    <img src={preview.src} alt={preview.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{preview.name}</p>
                      <p className="text-xs text-slate-500">{preview.size}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="converted-images.pdf"
                className="inline-flex rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                Download PDF
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
