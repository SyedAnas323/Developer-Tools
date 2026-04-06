import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Logo Remover - Erase Watermarks Online',
  description:
    'Remove logos, watermarks, and unwanted marks from images online and save the cleaned result.',
  keywords: ['logo remover', 'watermark remover', 'erase objects', 'image eraser'],
  slug: 'logo-remover',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
