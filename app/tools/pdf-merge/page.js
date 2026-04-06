'use client';

import { useState } from 'react';

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

export default function PdfMergeTool() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFiles = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    setFiles(nextFiles);
    setError('');
    setDownloadUrl('');
  };

  const removeFile = (targetIndex) => {
    setFiles((current) => current.filter((_, index) => index !== targetIndex));
    setDownloadUrl('');
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/pdf-merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'PDF merge failed.');
      }

      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || 'PDF merge failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            PDF Merge
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Merge multiple PDF files into one final document
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload at least two PDF files, keep them in the selected order, and combine them into
            a single downloadable PDF using your iLovePDF keys.
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
            accept=".pdf,application/pdf"
            onChange={handleFiles}
            className="hidden"
            id="pdf-merge-input"
          />
          <label
            htmlFor="pdf-merge-input"
            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7h8M8 11h8M8 15h5M7 3h7l5 5v13a1 1 0 01-1 1H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900">Click to select PDF files</p>
            <p className="mt-2 text-sm text-slate-500">Choose at least two PDFs to merge.</p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Selected PDF Files ({files.length})
              </h2>
              <button
                type="button"
                onClick={mergePdfs}
                disabled={files.length < 2 || loading}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Merging PDFs...' : 'Merge PDFs'}
              </button>
            </div>

            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {index + 1}. {file.name}
                    </p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="merged.pdf"
                className="inline-flex rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                Download Merged PDF
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
