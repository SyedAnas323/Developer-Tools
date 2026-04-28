import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Convert Image to PDF Online Free - JPG & PNG to PDF | MyToolsHub',
  description:
    'Convert JPG, PNG, and other images to PDF files online for free. Combine multiple images into one PDF document instantly. No software, no signup required.',
  keywords: ['convert image to pdf', 'jpg to pdf online free', 'png to pdf converter', 'multiple images to pdf', 'photo to pdf free online'],
  slug: 'image-to-pdf',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='image-to-pdf' />
    </>;
}

