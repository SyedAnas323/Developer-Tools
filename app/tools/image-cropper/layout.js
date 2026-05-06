import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Image Cropper Online Free - Crop JPG PNG WebP AVIF | MyToolsHub',
  description:
    'Crop images online for free with drag handles, aspect ratio presets, rotate, flip, live preview, and instant download. No signup needed.',
  keywords: [
    'image cropper online free',
    'crop image online',
    'crop jpg png webp',
    'photo crop tool',
    'free image editor',
  ],
  slug: 'image-cropper',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='image-cropper' />
    </>;
}
