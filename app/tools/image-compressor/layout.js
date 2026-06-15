import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Free Image Compressor Online - Reduce JPG, PNG & WebP Size | MyToolsHub',
  description:
    'Compress JPG, PNG and WebP images online for free. Reduce image file size without noticeable quality loss. Fast, secure and easy to use image compression tool.',
  keywords: [
    'image compressor',
    'image compressor online',
    'compress image online',
    'reduce image size',
    'compress jpg',
    'compress png',
    'compress webp',
    'free image compressor',
  ],
  slug: 'image-compressor',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='image-compressor' />
    </>;
}

