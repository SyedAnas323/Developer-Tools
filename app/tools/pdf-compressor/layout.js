import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Free PDF Compressor Online - Reduce PDF Size',
  description:
    'Compress PDF files online, compare original and compressed sizes, and download the smaller PDF instantly.',
  keywords: ['pdf compressor', 'compress pdf', 'reduce pdf size', 'pdf optimizer'],
  slug: 'pdf-compressor',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
