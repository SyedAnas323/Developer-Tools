import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Resize Image Online Free - Change Image Width & Height | MyToolsHub',
  description:
    'Resize any image to exact dimensions online for free. Change width and height in pixels, maintain aspect ratio, and download JPG or PNG. No signup needed.',
  keywords: ['resize image online free', 'change image size online', 'image resizer pixels', 'resize jpg online', 'scale image without losing quality'],
  slug: 'image-resizer',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='image-resizer' />
    </>;
}

