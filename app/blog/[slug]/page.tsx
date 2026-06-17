import { notFound } from 'next/navigation';
import { BlogArticlePage } from '../blog-article-page';
import { getBlogPost } from '../blog-data';

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | MyToolsHub Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://toolshub.cyphersol.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogArticlePage post={post} />;
}
