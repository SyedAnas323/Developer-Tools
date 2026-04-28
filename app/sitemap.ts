import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolshub.cyphersol.com'

  const tools = [
    'background-remover',
    'edit-pdf',
    'image-compressor',
    'image-resizer',
    'image-to-pdf',
    'json-formatter',
    'logo-remover',
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

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...toolRoutes,
  ]
}
