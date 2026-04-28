import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Edit PDF Online Free - Add Text to PDF Files Instantly | MyToolsHub',
  description:
    'Add text, annotations, and labels to any PDF file online for free. Edit PDF documents without Adobe Acrobat - works in your browser, no signup required.',
  keywords: ['edit pdf online free', 'add text to pdf free', 'pdf editor no signup', 'annotate pdf online', 'fill pdf form online free'],
  slug: 'edit-pdf',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='edit-pdf' />
    </>;
}

