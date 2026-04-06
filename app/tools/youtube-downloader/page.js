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

function buildDownloadUrl(item, title) {
  const params = new URLSearchParams({
    url: item.url,
    filename: `${title || 'youtube-file'}-${item.quality || item.type || 'download'}`,
    extension: item.extension || '',
  });

  return `/api/youtube-downloader/file?${params.toString()}`;
}

export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I use this YouTube downloader?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Paste a valid YouTube URL, click Get Download Links, review the available formats, and click the audio or video option you want to download.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I download both audio and video files?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The tool can show separate video and audio download options when they are available for the selected YouTube URL.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the benefits of this downloader?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It is simple to use, shows multiple file options, lets users choose audio or video, and helps download files quickly from one clean page.',
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
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
                <p>Clicking a card starts the download for the selected format.</p>
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

        {result && (
          <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
              <div className="overflow-hidden rounded-2xl bg-slate-100">
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

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  {result.source || 'youtube'}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{result.title}</h2>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
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

                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Video Downloads</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {videoMedias.length > 0 ? (
                        videoMedias.map((item) => (
                          <a
                            key={item.id}
                            href={buildDownloadUrl(item, result.title)}
                            className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                          >
                            <div className="text-sm font-semibold text-slate-900">{item.quality}</div>
                            <div className="mt-1 text-xs text-slate-600">
                              {item.extension?.toUpperCase() || 'FILE'} - {formatBytes(item.dataSize)}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {item.width && item.height
                                ? `${item.width} x ${item.height}`
                                : 'Resolution not provided'}
                            </div>
                          </a>
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
                          <a
                            key={item.id}
                            href={buildDownloadUrl(item, result.title)}
                            className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                          >
                            <div className="text-sm font-semibold text-slate-900">{item.quality}</div>
                            <div className="mt-1 text-xs text-slate-600">
                              {item.extension?.toUpperCase() || 'FILE'} - {formatDuration(item.duration)}
                            </div>
                          </a>
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
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
