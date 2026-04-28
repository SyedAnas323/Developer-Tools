import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Merge PDF Files Online Free - Combine Multiple PDFs Into One | MyToolsHub',
  description:
    'Merge multiple PDF files into one document online for free. Combine PDFs in any order instantly. No software, no signup, and no watermark on the output.',
  keywords: ['merge pdf files online free', 'combine pdf files online', 'pdf merger free no signup', 'join pdf documents online', 'merge multiple pdfs into one'],
  slug: 'pdf-merge',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='pdf-merge' />
    </>;
}

