// 
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-domain.com' // Isko baad mein apna link dena

  const tools = [
    'image-compressor',
    'pdf-compressor',
    'qr-generator',
    'youtube-thumbnail',
    'image-to-pdf',
    'json-formatter',
    'password-generator',
    'word-counter',
    'image-resizer',
    'background-remover',
  ];

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const, // "as const" zaroori hai
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    ...toolRoutes,
  ]
}