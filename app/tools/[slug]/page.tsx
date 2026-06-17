import { notFound } from 'next/navigation';
import { ToolSeoPage } from '../seo-page';
import { getToolSeoPage } from '../tool-seo-data';
import { createToolMetadata } from '../metadata';

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;
  const page = getToolSeoPage(slug);

  if (!page) {
    return {};
  }

  return createToolMetadata({
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    slug,
  });
}

export default async function ToolSeoRoutePage({ params }: PageProps) {
  const { slug } = params;
  const page = getToolSeoPage(slug);

  if (!page) {
    notFound();
  }

  return <ToolSeoPage page={page} />;
}
