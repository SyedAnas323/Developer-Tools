'use client';

import { useMemo, useState } from 'react';

const FORMAT_OPTIONS = ['png', 'jpg', 'webp', 'avif'];

function mimeFromFormat(format) {
  if (format === 'jpg') return 'image/jpeg';
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  return 'image/avif';
}

export default function ImageFormatConverterPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const outputName = useMemo(() => {
    if (!file) return `converted.${selectedFormat}`;
    const base = file.name.replace(/\.[^/.]+$/, '');
    const ext = selectedFormat === 'jpg' ? 'jpg' : selectedFormat;
    return `${base}.${ext}`;
  }, [file, selectedFormat]);

  function clearResult() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  }

  function handleSelectFile(nextFile) {
    if (!nextFile) return;

    if (!nextFile.type.startsWith('image/')) {
      const message = 'Please upload a valid image file.';
      setError(message);
      alert(message);
      return;
    }

    setError('');
    clearResult();
    setFile(nextFile);

    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target?.result || '');
    reader.readAsDataURL(nextFile);
  }

  function onInputChange(event) {
    const nextFile = event.target.files?.[0];
    handleSelectFile(nextFile);
  }

  function onDrop(event) {
    event.preventDefault();
    const nextFile = event.dataTransfer.files?.[0];
    handleSelectFile(nextFile);
  }

  async function handleConvert() {
    if (!file || !previewUrl) return;

    setLoading(true);
    setError('');
    clearResult();

    try {
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const mimeType = mimeFromFormat(selectedFormat);
      const blob = await new Promise((resolve) => {
        const quality = selectedFormat === 'jpg' || selectedFormat === 'webp' ? 0.9 : undefined;
        canvas.toBlob((resultBlob) => resolve(resultBlob), mimeType, quality);
      });

      if (!blob) {
        throw new Error('Conversion failed');
      }

      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      const message = 'Selected format is not supported on this browser. Please try another format.';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Image Format Converter
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Convert PNG, JPG, WebP, and AVIF instantly
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload an image, preview it, select output format, and download your converted file in one click.
          </p>
        </div>

        <div
          onDrop={onDrop}
          onDragOver={(event) => event.preventDefault()}
          className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-format-converter-input"
            onChange={onInputChange}
          />
          <label
            htmlFor="image-format-converter-input"
            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900">Drag & drop image here or click to upload</p>
            <p className="mt-2 text-sm text-slate-500">Supports PNG, JPG, WebP, AVIF, and other common image types</p>
          </label>
        </div>

        {previewUrl ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
              <div className="max-h-[420px] overflow-hidden rounded-2xl bg-slate-100 p-2">
                <img src={previewUrl} alt="Preview" className="mx-auto max-h-[400px] rounded-lg object-contain" />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">Choose output format</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FORMAT_OPTIONS.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(format);
                      clearResult();
                    }}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold uppercase transition ${
                      selectedFormat === format
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConvert}
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Converting...' : 'Convert & Download'}
              </button>

              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={outputName}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Download {selectedFormat.toUpperCase()}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

