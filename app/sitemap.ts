// app/sitemap.ts
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // Apni website ka base URL yahan likhein (jab deploy karoge to ye change hoga)
  const baseUrl = 'https://your-domain.com' 

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

  // Tool pages ka map
  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
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