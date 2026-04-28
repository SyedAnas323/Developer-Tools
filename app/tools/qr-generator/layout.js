import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Free QR Code Generator - Create QR Codes for URL, Text & WiFi | MyToolsHub',
  description:
    'Generate free QR codes instantly for URLs, text, email, phone numbers, or WiFi credentials. Download in PNG format. No signup, no watermark, 100% free.',
  keywords: ['qr code generator free', 'create qr code online', 'qr code generator for url', 'wifi qr code generator', 'free qr code no signup'],
  slug: 'qr-generator',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='qr-generator' />
    </>;
}

