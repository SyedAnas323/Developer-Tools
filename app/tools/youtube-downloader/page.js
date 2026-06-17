'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

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

function DownloadStatusBanner({ status }) {
  if (!status) {
    return null;
  }

  const isDone = status.phase === 'done';
  const isActive = !isDone;

  return (
    <div
      className={`fixed left-1/2 top-4 z-[60] w-[min(92vw,760px)] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl ${
        isDone
          ? 'border-emerald-200/80 bg-gradient-to-r from-emerald-50/95 via-white/95 to-cyan-50/95 text-slate-900'
          : 'border-slate-200/80 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-blue-900/95 text-white'
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${isDone ? 'bg-emerald-400' : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400'}`} />
      <div className="flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <div
          className={`mt-0.5 flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${
            isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-white/10 text-sky-300'
          }`}
        >
          {isDone ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 6" />
            </svg>
          ) : (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" className="opacity-25" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-500/90">
              {isDone ? 'Download complete' : 'Downloading'}
            </p>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-white/10 text-sky-200'}`}>
              {status.progress}%
            </span>
          </div>

          <p className={`mt-2 text-sm sm:text-[15px] ${isDone ? 'text-slate-700' : 'text-slate-100'}`}>
            {status.message}
          </p>

          {isActive ? (
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                <span>{status.step}</span>
                <span className="tabular-nums">{status.progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 transition-all duration-300 ease-out"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Sent to browser downloads
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.feature || row.format || row.resolution || row.platform} className="align-top">
                {Object.values(row).map((value, index) => (
                  <td
                    key={`${value}-${index}`}
                    className={`px-5 py-4 text-slate-600 ${index === 0 ? 'font-medium text-slate-900' : ''}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FORMAT_ROWS = [
  { format: 'MP4', bestUseCase: 'Universal playback and broad device support', advantages: 'Small file size, high compatibility, good for offline viewing' },
  { format: 'WEBM', bestUseCase: 'Web-friendly playback and modern browsers', advantages: 'Efficient compression, lightweight delivery, modern codec support' },
  { format: 'MOV', bestUseCase: 'Apple workflows and editing handoff', advantages: 'Useful for post-production, editing, and Apple ecosystem compatibility' },
  { format: 'AVI', bestUseCase: 'Legacy desktop playback and archival needs', advantages: 'Wide legacy support, simple structure, older software compatibility' },
];

const QUALITY_ROWS = [
  { resolution: '360p', qualityLevel: 'Basic', typicalUsage: 'Low-bandwidth viewing and small screens' },
  { resolution: '480p', qualityLevel: 'Standard', typicalUsage: 'General offline access and balanced file size' },
  { resolution: '720p', qualityLevel: 'HD', typicalUsage: 'Clear playback for laptops and tablets' },
  { resolution: '1080p', qualityLevel: 'Full HD', typicalUsage: 'High-detail viewing and larger screens' },
  { resolution: '4K', qualityLevel: 'Ultra HD', typicalUsage: 'Maximum detail when the source video supports it' },
];

const RESOLUTION_DETAIL_ROWS = [
  { resolution: '360p', qualityLevel: 'Low', typicalUsage: 'Fast preview, low storage, limited connectivity' },
  { resolution: '480p', qualityLevel: 'Medium', typicalUsage: 'Balanced offline access and smaller downloads' },
  { resolution: '720p', qualityLevel: 'Good', typicalUsage: 'Solid viewing quality for everyday use' },
  { resolution: '1080p', qualityLevel: 'Very good', typicalUsage: 'Clear playback for most modern screens' },
  { resolution: '4K', qualityLevel: 'Highest', typicalUsage: 'Archival reference, large-screen playback, pro use' },
];

const BENEFITS = [
  'Lets you save video online for offline viewing when you have permission to do so.',
  'Helps students keep educational content available when internet access is limited.',
  'Makes research and archiving easier by storing reference clips locally.',
  'Supports content planning when teams need a local copy for review and analysis.',
  'Works as a simple media downloader without a complicated workflow.',
];

const USE_CASES = [
  {
    title: 'Offline Learning',
    text: 'Students and learners save lectures, tutorials, and course clips so they can review material without a connection.',
  },
  {
    title: 'Educational Content',
    text: 'Teachers and trainers use downloaded video files for classroom preparation, lesson planning, and reference.',
  },
  {
    title: 'Research Purposes',
    text: 'Researchers archive videos that support citations, media studies, or historical documentation.',
  },
  {
    title: 'Content Archiving',
    text: 'Teams keep local copies of approved or licensed videos for future review and internal reference.',
  },
  {
    title: 'Personal Media Collections',
    text: 'Users who have permission to store media can organize a local library for personal offline access.',
  },
  {
    title: 'Travel And Limited Connectivity',
    text: 'Travelers download allowed videos before flights, commutes, or trips where internet access may be limited.',
  },
];

const BEST_PRACTICES = [
  'Download videos only when you have permission or a lawful right to store them offline.',
  'Choose the smallest quality that still fits your viewing purpose and device.',
  'Keep filenames descriptive so you can find media again later.',
  'Store videos in folders by topic, creator, project, or date.',
  'Archive source details so you remember where the file came from.',
  'Review format compatibility before moving files between devices.',
];

const MISTAKES = [
  'Downloading files without checking whether offline saving is allowed.',
  'Choosing a high resolution when a smaller one would save storage and time.',
  'Using vague filenames like video1.mp4 that are hard to organize later.',
  'Mixing personal, research, and project files in one folder.',
  'Ignoring the difference between video format and video resolution.',
];

const STORAGE_GUIDE = [
  {
    title: 'Folder Structure',
    text: 'Use topic-based folders, such as lectures, references, campaigns, or travel clips, to keep media easy to browse.',
  },
  {
    title: 'File Naming',
    text: 'Add the topic, date, and resolution in the filename so the file remains identifiable outside the browser.',
  },
  {
    title: 'Backup Strategy',
    text: 'Keep an additional copy in cloud storage or an external drive if the files are important for work or study.',
  },
];

const DOWNLOAD_BASICS = [
  {
    title: 'How Online Video Downloading Works',
    text: 'The downloader reads the video URL, identifies available media streams, and returns accessible file options to the browser.',
  },
  {
    title: 'Understanding Video Formats',
    text: 'Video formats such as MP4, WEBM, MOV, and AVI store audio and video data in different ways, which affects compatibility and file size.',
  },
  {
    title: 'Why People Save Videos Offline',
    text: 'Offline access helps users watch, study, archive, and review content when the connection is slow, absent, or unreliable.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/youtube-thumbnail', label: 'YouTube Thumbnail Downloader' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/image-cropper', label: 'Image Cropper' },
  { href: '/tools/image-format-converter', label: 'Image Format Converter' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

const FAQS = [
  ['What is a YouTube downloader?', 'A YouTube downloader is a video downloader tool that helps users save allowed videos or audio for offline access.'],
  ['Can I download online videos for free?', 'This tool is provided free in the browser, but you should only save videos when you have permission or a lawful right to do so.'],
  ['What is an online video downloader?', 'An online video downloader works in the browser and returns downloadable media options without installing desktop software.'],
  ['What formats are common for video downloads?', 'MP4, WEBM, MOV, and AVI are common video file formats used for playback, editing, and archiving.'],
  ['Which video resolution is best?', 'The best resolution depends on your screen size, storage limit, and whether you want faster downloads or sharper playback.'],
  ['Can I download video in HD?', 'If the source video and the available stream allow it, HD options such as 720p or 1080p may be available.'],
  ['Why is MP4 so common?', 'MP4 is popular because it offers broad compatibility across devices, browsers, and media players.'],
  ['Should I save videos in the highest quality?', 'Not always. Choose the highest quality only when you need the extra detail and can afford the storage size.'],
  ['Can students use downloaded educational content?', 'Yes. Students often save permitted lectures and tutorials for offline study and revision.'],
  ['Can researchers archive videos?', 'Yes. Researchers may store lawful copies of reference material for analysis, note-taking, and documentation.'],
  ['What is the difference between format and resolution?', 'Format is the file container, while resolution describes the number of pixels in the video.'],
  ['Can travelers use offline video access?', 'Yes. Offline video access is helpful on planes, trains, and other low-connectivity trips.'],
  ['Are downloaded files easy to organize?', 'Yes. Clear filenames and topic-based folders make downloaded media much easier to manage.'],
  ['Is this tool useful for media management?', 'Yes. It can help you create a local media library for lawful offline access and reference use.'],
  ['Should I keep backup copies?', 'If the video files matter for study, work, or reference, keeping a backup is a good practice.'],
];

function DownloadCard({ item, title, detailLine, subLine, onDownload, isDownloading }) {
  return (
    <button
      key={item.id}
      type="button"
      onClick={() => onDownload(item, title)}
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

export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const clearDownloadStatusTimer = useRef(null);
  const progressTickTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (clearDownloadStatusTimer.current) {
        window.clearTimeout(clearDownloadStatusTimer.current);
        clearDownloadStatusTimer.current = null;
      }
      if (progressTickTimer.current) {
        window.clearInterval(progressTickTimer.current);
        progressTickTimer.current = null;
      }
    };
  }, []);

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
    } catch {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(item, title) {
    const downloadUrl = buildDownloadUrl(item, title, 'download');
    setDownloadingId(item.id);
    setError('');
    const fallbackName = `${title || 'youtube-file'}-${item.quality || item.type || 'download'}${
      item.extension ? `.${item.extension}` : ''
    }`;

    try {
      if (clearDownloadStatusTimer.current) {
        window.clearTimeout(clearDownloadStatusTimer.current);
        clearDownloadStatusTimer.current = null;
      }
      if (progressTickTimer.current) {
        window.clearInterval(progressTickTimer.current);
        progressTickTimer.current = null;
      }

      setDownloadStatus({
        phase: 'starting',
        progress: 8,
        step: 'Preparing file',
        message: `Launching ${fallbackName} in your browser download tray.`,
      });

      progressTickTimer.current = window.setInterval(() => {
        setDownloadStatus((current) => {
          if (!current || current.phase === 'done') {
            return current;
          }

          const nextProgress = Math.min((current.progress || 0) + 12, 92);
          const nextStep =
            nextProgress < 35
              ? 'Preparing file'
              : nextProgress < 70
                ? 'Sending to browser'
                : 'Finalizing download';

          return {
            ...current,
            phase: 'active',
            progress: nextProgress,
            step: nextStep,
          };
        });
      }, 180);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fallbackName;
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        if (progressTickTimer.current) {
          window.clearInterval(progressTickTimer.current);
          progressTickTimer.current = null;
        }
        setDownloadStatus({
          phase: 'done',
          title: 'Download complete',
          progress: 100,
          step: 'Completed',
          message: `${fallbackName} is now in your browser downloads.`,
        });
      }, 1200);

      clearDownloadStatusTimer.current = window.setTimeout(() => {
        setDownloadStatus(null);
        clearDownloadStatusTimer.current = null;
      }, 5000);
    } catch {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      alert(message);
    } finally {
      setDownloadingId('');
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <DownloadStatusBanner status={downloadStatus} />
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              YouTube Downloader
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Download online videos for lawful offline access
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Paste a YouTube link, check the available video and audio options, and save allowed
              media for offline viewing, learning, research, or reference. This online video
              downloader keeps the workflow simple and organized.
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
        </section>

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
                  <div className="flex min-h-[220px] items-center justify-center text-sm text-slate-500">
                    No thumbnail
                  </div>
                )}
              </div>

              <div className="mt-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  {result.source || 'youtube'}
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {result.title}
                </h2>
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
                          subLine={
                            item.width && item.height
                              ? `${item.width} x ${item.height}`
                              : 'Resolution not provided'
                          }
                          onDownload={handleDownload}
                          isDownloading={downloadingId === item.id}
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
                          onDownload={handleDownload}
                          isDownloading={downloadingId === item.id}
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
                <p><strong>3.</strong> Review the title, thumbnail, duration, and available media types.</p>
                <p><strong>4.</strong> Select a video or audio format that suits your offline use case.</p>
                <p><strong>5.</strong> Save the file for lawful offline access, study, reference, or archiving.</p>
                <p><strong>6.</strong> Use reset if you want to check another permitted video URL.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Benefits Of Using A Video Downloader</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {BENEFITS.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">How Audio And Video Downloads Work</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>Video links appear in the video section with the available quality levels listed first.</p>
                <p>Audio links appear separately when the source provides an audio stream.</p>
                <p>Each card shows the format, estimated size, and extra metadata when available.</p>
                <p>Clicking a card opens the download flow for that specific media option.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Why People Save Videos Offline</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {[
                  'Offline learning when the internet is slow or unavailable.',
                  'Video review during travel, commuting, or low-connectivity situations.',
                  'Research and archiving for lawful study materials or reference clips.',
                  'Media management when teams need local review copies for planning.',
                ].map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Short Answer</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">What Is A Video Downloader?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            A video downloader is an online media downloader that helps users save allowed video
            files for offline use. The tool identifies downloadable media streams, shows available
            formats and qualities, and lets you store the file on your device for later viewing or
            reference.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {DOWNLOAD_BASICS.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">AI Overview Summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Video downloading is most useful for lawful offline access, education, research, and
              media management. The most practical format for broad compatibility is usually MP4,
              while WEBM, MOV, and AVI can be useful for specific workflows.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Download Videos Online"
              description="The workflow is simple when you only download videos you have permission to save offline."
            />
            <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {[
                'Copy the video URL from the browser or the share menu.',
                'Paste the link into the downloader input field.',
                'Click Get Download Links to retrieve the available media options.',
                'Review the quality, format, and size before choosing a file.',
                'Save the file to your device for offline viewing or reference.',
              ].map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Use Cases"
              title="Common Use Cases"
              description="Video downloads are useful for learning, archiving, research, and keeping permitted media available offline."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {USE_CASES.map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Formats"
            title="Popular Video Formats Explained"
            description="Different containers suit different devices, editing workflows, and media libraries."
          />
          <div className="mt-6">
            <DataTable
              columns={['Format', 'Best Use Case', 'Advantages']}
              rows={FORMAT_ROWS}
            />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ['MP4', 'MP4 is widely supported and is usually the safest choice for offline playback across devices.'],
              ['WEBM', 'WEBM is a modern web format that is efficient and common in browser-focused workflows.'],
              ['MOV', 'MOV is often used in Apple workflows and video editing handoffs.'],
              ['AVI', 'AVI remains useful for legacy playback and older desktop software.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Resolution"
            title="Video Quality Explained"
            description="Video resolution affects clarity, file size, and how well the video fits a specific screen or purpose."
          />
          <div className="mt-6">
            <DataTable
              columns={['Resolution', 'Quality Level', 'Typical Usage']}
              rows={QUALITY_ROWS}
            />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['360p', 'A basic option for fast playback and lower data use.'],
              ['480p', 'A balanced choice for everyday offline viewing.'],
              ['720p', 'A solid HD option for most laptops and tablets.'],
              ['1080p', 'Full HD clarity for sharper playback and bigger screens.'],
              ['4K', 'The highest-detail option when the source video provides it.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Video Downloader Best Practices"
              description="Good media habits help you stay organized and keep storage under control."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {BEST_PRACTICES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Mistakes"
              title="Common Downloading Mistakes"
              description="Most problems come from choosing the wrong quality or losing track of downloaded files."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {MISTAKES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Storage"
            title="Managing Downloaded Media"
            description="Downloaded videos are easier to use when they are labeled, sorted, and backed up properly."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STORAGE_GUIDE.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Organization"
              title="Video Storage And Organization"
              description="A stable folder system keeps offline media easy to review and reuse later."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Group videos by subject, project, source, or date. Clear naming conventions make it
              easier to spot duplicates, find the right version, and distinguish between SD, HD, and
              higher-resolution files. This matters when you manage large offline media collections.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Summary"
              title="Benefits Of Offline Video Access"
              description="Offline media access helps people learn, travel, research, and review content without relying on constant connectivity."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Offline access is valuable for study sessions, training libraries, travel planning, and
              reference collections. When you save allowed videos locally, you can watch them again
              even if the network is slow, interrupted, or unavailable.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Video Formats"
            title="Detailed Explanation Of Video File Formats"
            description="File formats affect compatibility, compression, and how the media behaves across devices and editors."
          />
          <div className="mt-6">
            <DataTable
              columns={['Format', 'Best Use Case', 'Advantages']}
              rows={FORMAT_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Resolution"
            title="Detailed Explanation Of Video Resolutions"
            description="Resolution describes how many pixels are in the video image and strongly affects clarity."
          />
          <div className="mt-6">
            <DataTable
              columns={['Resolution', 'Quality Level', 'Typical Usage']}
              rows={RESOLUTION_DETAIL_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Usage"
            title="How Students, Researchers, And Travelers Use Offline Media"
            description="Offline video access supports study, archiving, and mobility when live streaming is not practical."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Students', 'Save permitted lectures and tutorials for revision without depending on internet access.'],
              ['Researchers', 'Archive reference clips, public talks, and permitted source material for later review.'],
              ['Travelers', 'Prepare offline videos before flights, road trips, or other low-connectivity situations.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise enough for quick readers and detailed enough for AI search extraction."
          />
          <div className="mt-6 space-y-4">
            {FAQS.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                  <span className="flex items-center justify-between gap-4">
                    {question}
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm mt-8">
          <SectionHeading
            eyebrow="Related Tools"
            title="Related Tools"
            description="Continue the workflow with tools that support media, documents, and productivity."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'YouTube Video Downloader Online - Save Videos in MP4 Free | MyToolsHub',
            url: 'https://toolshub.cyphersol.com/tools/youtube-downloader',
            description:
              'Download YouTube videos online in MP4 format at various quality levels. Paste a YouTube URL and save the video to your device instantly. Free tool, no signup.',
            isPartOf: {
              '@type': 'WebSite',
              name: 'MyToolsHub',
              url: 'https://toolshub.cyphersol.com',
            },
            inLanguage: 'en',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'YouTube Downloader',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            url: 'https://toolshub.cyphersol.com/tools/youtube-downloader',
            description:
              'Download allowed YouTube videos online in MP4 and other media formats for offline access and lawful personal use.',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://toolshub.cyphersol.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Tools',
                item: 'https://toolshub.cyphersol.com/tools',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'YouTube Downloader',
                item: 'https://toolshub.cyphersol.com/tools/youtube-downloader',
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How To Download Videos Online',
            totalTime: 'PT2M',
            step: [
              'Copy the URL of a video you have permission to save offline.',
              'Paste the URL into the downloader field.',
              'Click Get Download Links to fetch the available options.',
              'Choose a video or audio format and quality level.',
              'Save the file for offline viewing, study, or reference.',
            ].map((step) => ({
              '@type': 'HowToStep',
              name: step,
              text: step,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
