import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'JSON Formatter & Validator - Beautify JSON Online',
  description:
    'Format, validate, beautify, and minify JSON online with a clean editor and instant output preview.',
  keywords: ['json formatter', 'json validator', 'beautify json', 'json parser'],
  slug: 'json-formatter',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
