import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Free Image Compressor Online - Reduce JPG, PNG & WebP Size | MyToolsHub',
  description:
    'Compress JPG, PNG and WebP images online for free. Reduce image file size without noticeable quality loss with this fast online image compressor and photo compressor.',
  keywords: [
    'image compressor',
    'image compressor online',
    'online image compressor',
    'compress image online',
    'image optimizer',
    'reduce image size',
    'compress jpg',
    'compress png',
    'compress webp',
    'free image compressor',
    'photo compressor',
    'optimize images for web',
  ],
  slug: 'image-compressor',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='image-compressor' />
    </>;
}

