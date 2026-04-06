import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Word to PDF Converter - Convert DOC and DOCX to PDF',
  description:
    'Convert Word documents to PDF online, then download the generated PDF file in one step.',
  keywords: 'word to pdf, docx to pdf, doc to pdf, word converter, convert word document',
  slug: 'word-to-pdf',
});

export default function Layout({ children }) {
  return children;
}
