import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Remove Background from Image Free - AI Background Eraser | MyToolsHub',
  description:
    'Remove the background from any image automatically using AI. Get a transparent PNG in seconds - perfect for product photos, profile pictures, and design work. Free.',
  keywords: ['remove background from image free', 'background remover online', 'transparent background maker', 'remove bg free no signup', 'erase background from photo ai'],
  slug: 'background-remover',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='background-remover' />
    </>;
}

