import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Image to PDF Converter - Convert JPG to PDF Online',
  description:
    'Convert JPG and PNG images to PDF online, arrange pages, and download one combined PDF file.',
  keywords: ['image to pdf', 'jpg to pdf', 'convert image to pdf', 'photo to pdf'],
  slug: 'image-to-pdf',
});

export default function Layout({ children}) {
  return <>{children}</>;
}
