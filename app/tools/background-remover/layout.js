import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Free Background Remover Online - Remove Background From Image | MyToolsHub',
  description:
    'Remove background from image files online for free. Create transparent PNG images, clean product photos, and social media cutouts in seconds with AI.',
  keywords: [
    'background remover',
    'background remover online',
    'free background remover',
    'remove background from image',
    'remove image background',
    'transparent background maker',
    'photo background remover',
    'ai background remover',
  ],
  slug: 'background-remover',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='background-remover' />
    </>;
}

