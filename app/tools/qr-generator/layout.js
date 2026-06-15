import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Free QR Code Generator - Create QR Codes for URL, Text & WiFi | MyToolsHub',
  description:
    'Generate free QR codes instantly for URLs, text, email, phone numbers, or WiFi credentials. Download in PNG format. No signup, no watermark, 100% free.',
  keywords: [
    'qr code generator',
    'create qr code',
    'free qr code generator',
    'qr code maker',
    'generate qr code',
    'qr code creator',
    'online qr generator',
    'business qr code',
    'url qr code generator',
    'wifi qr code generator',
    'qr code for website',
    'qr code for business',
    'custom qr code',
    'dynamic qr code',
  ],
  slug: 'qr-generator',
});

export default function Layout({ children }) {
  return <>{children}</>;
}

