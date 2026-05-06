import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Image Format Converter Online Free - PNG, JPG, WebP, AVIF | MyToolsHub',
  description:
    'Convert image formats online for free. Switch between PNG, JPG, WebP, and AVIF with instant preview and download. No signup needed.',
  keywords: ['image format converter', 'png to jpg', 'jpg to webp', 'webp to avif', 'convert image online free'],
  slug: 'image-format-converter',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='image-format-converter' />
    </>;
}

