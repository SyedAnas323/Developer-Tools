import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Image Resizer Online - Resize Photos for Free',
  description:
    'Resize images to custom dimensions online, preview the updated image, and download the resized file quickly.',
  keywords: ['image resizer', 'resize photo', 'change image size', 'picture resizer'],
  slug: 'image-resizer',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
