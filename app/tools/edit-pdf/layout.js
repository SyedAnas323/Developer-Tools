import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Edit PDF Online - Add, Update, and Export PDF Text',
  description:
    'Upload a PDF, edit visible text blocks, add new content, preview changes, and download the updated PDF file online.',
  keywords: [
    'edit pdf online',
    'pdf editor',
    'edit pdf free',
    'pdf text editor',
    'download edited pdf',
  ],
  slug: 'edit-pdf',
});

export default function EditPdfLayout({ children }) {
  return children;
}
