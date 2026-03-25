import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://developer-tools-uz59.vercel.app/' // Apna live link yahan dalna
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/'], // API routes ko index na kare
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // Sitemap ka link
  }
}