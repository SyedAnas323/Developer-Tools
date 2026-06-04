import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolshub.cyphersol.com'

  const tools = [
    'background-remover',
    'edit-pdf',
    'favicon-generator',
    'image-compressor',
    'image-format-converter',
    'image-cropper',
    'image-resizer',
    'image-to-pdf',
    'json-formatter',
    'password-generator',
    'pdf-compressor',
    'pdf-merge',
    'qr-generator',
    'word-counter',
    'word-to-pdf',
    'youtube-downloader',
    'youtube-thumbnail',
  ];

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogPosts = [
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
  ]
}
