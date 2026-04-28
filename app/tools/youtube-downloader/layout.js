import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'YouTube Video Downloader Online - Save Videos in MP4 Free | MyToolsHub',
  description:
    'Download YouTube videos online in MP4 format at various quality levels. Paste a YouTube URL and save the video to your device instantly. Free tool, no signup.',
  keywords: ['youtube video downloader', 'download youtube video mp4', 'save youtube video online', 'youtube to mp4 free', 'download youtube shorts'],
  slug: 'youtube-downloader',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='youtube-downloader' />
    </>;
}

