import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Favicon Generator Online Free - PNG SVG to Favicon Pack | MyToolsHub',
  description:
    'Generate full favicon package online free from PNG, JPG, WebP, or SVG. Includes .ico, Apple touch icon, Android icons, and web manifest in one ZIP.',
  keywords: [
    'favicon generator free',
    'favicon ico creator',
    'generate favicon zip',
    'apple touch icon generator',
    'pwa icon generator',
  ],
  slug: 'favicon-generator',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='favicon-generator' />
    </>;
}
