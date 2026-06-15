import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Compress PDF Online Free - Reduce PDF File Size Fast | MyToolsHub',
  description:
    'Compress PDF files online for free in seconds. Make PDFs smaller for email, uploading, and sharing without losing text or image quality. No signup needed.',
  keywords: [
    'pdf compressor',
    'compress pdf',
    'compress pdf online',
    'reduce pdf size',
    'reduce pdf file size',
    'free pdf compressor',
    'online pdf compressor',
    'make pdf smaller',
    'shrink pdf file',
    'pdf file optimizer',
    'compress large pdf',
  ],
  slug: 'pdf-compressor',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='pdf-compressor' />
    </>;
}

