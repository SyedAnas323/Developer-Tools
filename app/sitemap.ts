import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // Jab aap deploy karenge to isko apna live link dena (e.g., https://your-app.vercel.app)
  const baseUrl = 'https://developer-tools-uz59.vercel.app' 

  // Aapke saare tools
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

  // Tools ka mapping
  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Final Sitemap
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