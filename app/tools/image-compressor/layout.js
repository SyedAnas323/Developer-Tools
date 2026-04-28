import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Compress Images Online Free - Reduce File Size Without Losing Quality | MyToolsHub',
  description:
    'Compress JPG, PNG, and WebP images online for free. Reduce image file size by up to 80% without visible quality loss. No signup required. Fast and easy.',
  keywords: ['compress image online free', 'reduce image file size', 'image compressor online', 'compress jpg online free', 'compress png without losing quality'],
  slug: 'image-compressor',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='image-compressor' />
    </>;
}

