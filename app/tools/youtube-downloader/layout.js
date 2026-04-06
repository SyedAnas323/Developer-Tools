import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'YouTube Downloader - Download YouTube Video and Audio',
  description:
    'Paste a YouTube URL, choose a video or audio format, and download the file quickly from one clean page.',
  keywords: [
    'youtube downloader',
    'download youtube video',
    'download youtube audio',
    'youtube mp4 downloader',
    'youtube mp3 downloader',
    'online youtube downloader',
  ],
  slug: 'youtube-downloader',
});

export default function YoutubeDownloaderLayout({ children }) {
  return children;
}
