import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Free Online Image Compressor - Reduce Size Without Losing Quality',
  description:
    'Compress JPG, PNG, and WEBP images online, compare file sizes, and download the smaller image instantly.',
  keywords: ['image compressor', 'compress image', 'reduce image size', 'photo compressor'],
  slug: 'image-compressor',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
