import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'PDF Merge Tool - Combine Multiple PDF Files Online',
  description:
    'Merge multiple PDF files online, keep them in order, and download one combined PDF document.',
  keywords: ['pdf merge', 'merge pdf', 'combine pdf files', 'pdf joiner'],
  slug: 'pdf-merge',
});

export default function PdfMergeLayout({ children }) {
  return children;
}
