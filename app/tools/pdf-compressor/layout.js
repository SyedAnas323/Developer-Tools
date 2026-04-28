import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Compress PDF Online Free - Reduce PDF File Size Fast | MyToolsHub',
  description:
    'Compress PDF files online for free in seconds. Make PDFs smaller for email, uploading, and sharing without losing text or image quality. No signup needed.',
  keywords: ['compress pdf online', 'reduce pdf file size', 'pdf compressor free online', 'make pdf smaller online', 'compress pdf for email free'],
  slug: 'pdf-compressor',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='pdf-compressor' />
    </>;
}

