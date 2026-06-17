import { notFound } from 'next/navigation';
import { ToolSeoPage } from '../seo-page';
import { createToolMetadata } from '../metadata';
import { getToolSeoPage } from '../tool-seo-data';

export function generateMetadata() {
  const page = getToolSeoPage('instagram-downloader');

  if (!page) {
    return {};
  }

  return createToolMetadata({
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    slug: page.slug,
  });
}

export default function InstagramDownloaderPage() {
  const page = getToolSeoPage('instagram-downloader');

  if (!page) {
    notFound();
  }

  return <ToolSeoPage page={page} />;
}
