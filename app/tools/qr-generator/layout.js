import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Free QR Code Generator - Create QR Codes Online',
  description:
    'Create QR codes for URLs, text, and other content online, preview them instantly, and download the QR image.',
  keywords: ['qr code generator', 'create qr code', 'free qr code', 'qr maker'],
  slug: 'qr-generator',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
