import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'YouTube Thumbnail Downloader - Download HD Thumbnails',
  description:
    'Download YouTube thumbnails in max, standard, or high quality from any valid YouTube video URL.',
  keywords: ['youtube thumbnail downloader', 'download youtube thumbnail', 'yt thumbnail saver'],
  slug: 'youtube-thumbnail',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
