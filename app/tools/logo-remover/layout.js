import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Remove Logo & Watermark from Image Free Online | MyToolsHub',
  description:
    'Erase logos and watermarks from images automatically online. Clean up images for design, testing, or editing purposes. Free tool, no signup required.',
  keywords: ['remove logo from image free', 'watermark remover online', 'erase watermark from photo', 'logo eraser online free', 'remove text from image online'],
  slug: 'logo-remover',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='logo-remover' />
    </>;
}

