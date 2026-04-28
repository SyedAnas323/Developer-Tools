'use client';

import { useMemo, useState } from 'react';

function formatBytes(bytes) {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value <= 0) {
    return 'Unknown size';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDuration(seconds) {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value <= 0) {
    return 'Unknown duration';
  }

  const mins = Math.floor(value / 60);
  const secs = value % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function buildDownloadUrl(item, title, mode = 'fetch') {
  const params = new URLSearchParams({
    url: item.url,
    filename: `${title || 'youtube-file'}-${item.quality || item.type || 'download'}`,
    extension: item.extension || '',
    mode,
  });

  return `/api/youtube-downloader/file?${params.toString()}`;
}

function DownloadIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}

async function saveResponseAsDownload(response, fallbackName) {
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const contentDisposition = response.headers.get('content-disposition') || '';
  const match = contentDisposition.match(/filename="([^"]+)"/i);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = match?.[1] || fallbackName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const videoMedias = useMemo(
    () => (result?.medias || []).filter((item) => item.type === 'video'),
    [result]
  );

  const audioMedias = useMemo(
    () => (result?.medias || []).filter((item) => item.type === 'audio'),
    [result]
  );

  function DownloadCard({ item, title, detailLine, subLine }) {
    const isDownloading = downloadingId === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleDownload(item, title)}
        className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">{item.quality}</div>
            <div className="mt-1 text-xs text-slate-600">{detailLine}</div>
            {subLine ? <div className="mt-1 text-xs text-slate-500">{subLine}</div> : null}
          </div>
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600">
            {isDownloading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
              </svg>
            ) : (
              <DownloadIcon />
            )}
          </span>
        </div>
        <div className="mt-3 text-xs font-medium text-blue-600">
          {isDownloading ? 'Downloading...' : 'Click to download'}
        </div>
      </button>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/youtube-downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.message || 'Unable to fetch video details.');
      }

      setResult(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(item, title) {
    const downloadUrl = buildDownloadUrl(item, title, 'fetch');
    setDownloadingId(item.id);
    setError('');
    const fallbackName = `${title || 'youtube-file'}-${item.quality || item.type || 'download'}${
      item.extension ? `.${item.extension}` : ''
    }`;

    try {
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (response.status === 409 && data?.message === 'Direct download blocked by source') {
          throw new Error(
            'This video host is blocking live server downloads on Vercel. The file link can be detected, but the source server is refusing a reliable forced download.'
          );
        }

        throw new Error(data?.message || 'Download failed.');
      }

      await saveResponseAsDownload(response, fallbackName);
    } catch (downloadError) {
      setError(downloadError.message || 'Download failed.');
    } finally {
      setDownloadingId('');
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              YouTube Downloader
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Paste a YouTube URL and download audio or video files
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Paste a YouTube link, choose the format you want, and download video or audio files
              in a simple and clean interface.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                YouTube video URL
              </span>
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Fetching Links...' : 'Get Download Links'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUrl('');
                  setResult(null);
                  setError('');
                }}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Reset
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {result && (
          <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto max-w-3xl">
              <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                {result.thumbnail ? (
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-slate-500">
                    No thumbnail
                  </div>
                )}
              </div>

              <div className="mt-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  {result.source || 'youtube'}
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{result.title}</h2>
                <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Author: {result.author || 'Unknown'}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Duration: {formatDuration(result.duration)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Type: {result.type || 'single'}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Video Downloads</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {videoMedias.length > 0 ? (
                      videoMedias.map((item) => (
                        <DownloadCard
                          key={item.id}
                          item={item}
                          title={result.title}
                          detailLine={`${item.extension?.toUpperCase() || 'FILE'} - ${formatBytes(item.dataSize)}`}
                          subLine={item.width && item.height
                            ? `${item.width} x ${item.height}`
                            : 'Resolution not provided'}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No video links found.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Audio Downloads</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {audioMedias.length > 0 ? (
                      audioMedias.map((item) => (
                        <DownloadCard
                          key={item.id}
                          item={item}
                          title={result.title}
                          detailLine={`${item.extension?.toUpperCase() || 'FILE'} - ${formatDuration(item.duration)}`}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No audio links found.</p>
                    )}
                  </div>
                </div>

                {result.message && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {result.message}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">How To Use This Tool</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p><strong>1.</strong> Paste a valid YouTube video URL into the input field.</p>
                <p><strong>2.</strong> Click <strong>Get Download Links</strong> to load the available options.</p>
                <p><strong>3.</strong> Check the title, thumbnail, and file quality options shown below.</p>
                <p><strong>4.</strong> Click any video card to download a video file.</p>
                <p><strong>5.</strong> Click any audio card to download an audio file.</p>
                <p><strong>6.</strong> Use the reset button if you want to clear the current result and try another link.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Advantages Of This Tool</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>It is simple and easy to use for both audio and video downloads.</p>
                <p>It shows multiple quality options so users can choose the file they need.</p>
                <p>It keeps the download experience clean by separating video and audio sections.</p>
                <p>It helps users review the title, preview image, and duration before downloading.</p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">How Audio And Video Downloads Work</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>Video files appear in the Video Downloads section with available quality options.</p>
                <p>Audio files appear in the Audio Downloads section when audio formats are available.</p>
                <p>Each card shows the file type, quality, and extra details like size or duration.</p>
                <p>Clicking a card starts the download flow for the selected format.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Why Users Like This Tool</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>It works from a single page without a complicated process.</p>
                <p>It gives a fast way to move from a YouTube URL to a downloadable file.</p>
                <p>It is useful for users who want quick access to audio or video formats in one place.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
