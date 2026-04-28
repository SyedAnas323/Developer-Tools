import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Convert Word to PDF Free Online - DOCX to PDF Converter | MyToolsHub',
  description:
    'Convert Word documents (.doc, .docx) to PDF online for free. Preserve formatting, fonts, and layout perfectly. Fast conversion, no signup, no watermark.',
  keywords: ['word to pdf converter free', 'convert docx to pdf online', 'doc to pdf free no signup', 'word document to pdf download', 'convert microsoft word to pdf'],
  slug: 'word-to-pdf',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='word-to-pdf' />
    </>;
}

