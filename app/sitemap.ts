import { MetadataRoute } from 'next';
import { BLOG_POSTS } from './blog/blog-data';
import { HIDDEN_TOOL_SLUGS, TOOL_LABELS } from './tools/tool-seo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolshub.cyphersol.com';

  const tools = Object.keys(TOOL_LABELS).filter((slug) => !HIDDEN_TOOL_SLUGS.has(slug));

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogPosts = [
    'convert-image-to-pdf-and-word-to-pdf-online',
    'what-is-favicon-icon-and-how-to-use',
    'best-free-online-tools-for-pdf-images-productivity',
    'how-to-remove-background-from-image',
    'how-to-edit-pdf-online-free',
    'how-to-generate-favicon-online',
    'how-to-compress-images-online-free',
    'how-to-crop-image-online-free',
    'how-to-resize-image-online',
    'how-to-count-words-online',
    'strong-password-generator-guide',
    'how-to-compress-pdf-free',
    'how-to-merge-pdf-files',
    ...BLOG_POSTS.map((post) => post.slug),
  ];

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...toolRoutes,
    ...blogRoutes,
  ];
}
