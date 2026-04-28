import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'YouTube Thumbnail Downloader - Save HD Thumbnails Free | MyToolsHub',
  description:
    'Download YouTube video thumbnails in full HD quality instantly. Paste any YouTube URL and save the thumbnail image in multiple resolutions for free. No signup.',
  keywords: ['youtube thumbnail downloader', 'download youtube thumbnail hd', 'youtube thumbnail grabber', 'save youtube thumbnail free', 'get thumbnail from youtube url'],
  slug: 'youtube-thumbnail',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='youtube-thumbnail' />
    </>;
}

