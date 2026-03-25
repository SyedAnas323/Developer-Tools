import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyToolsHub',
    short_name: 'ToolsHub',
    description: 'A collection of free developer tools',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb', // Blue color
    icons: [
      {
        src: '/favicon.ico', // Aapke public folder mein icon hona chahiye
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}