'use client';

import { useState } from 'react';

export default function WordToPdfConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    setError('');

    if (!selected) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!validTypes.includes(selected.type)) {
      setError('Please select a valid Word file.');
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      setError('File size is too large. Max 50MB is allowed.');
      return;
    }

    setFile(selected);
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'word-to-pdf');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errData = await response.json();
          throw new Error(errData.error || 'Conversion failed');
        }

        throw new Error((await response.text()) || 'Conversion failed');
      }

      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Word To PDF
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Convert Word documents into polished PDF files
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload a DOC or DOCX file, generate the PDF version, and download the converted file
            from the same page.
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
            accept=".doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="word-to-pdf-input"
          />
          <label
            htmlFor="word-to-pdf-input"
            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 7h10M7 11h10M7 15h6m7-10v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h10l4 4z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {file ? file.name : 'Click to upload your Word file'}
            </p>
            <p className="mt-2 text-sm text-slate-500">Supported formats: DOC, DOCX. Max file size: 50MB.</p>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleConvert}
            disabled={!file || loading}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Converting...' : 'Convert Now'}
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download="converted.pdf"
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
