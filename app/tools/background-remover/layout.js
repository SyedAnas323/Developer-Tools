import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Background Remover - Remove Image Background Online',
  description:
    'Remove image backgrounds online, preview the result, and download a transparent PNG in a few clicks.',
  keywords: ['background remover', 'remove background', 'bg remover', 'transparent background'],
  slug: 'background-remover',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
