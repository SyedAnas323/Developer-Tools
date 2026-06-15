import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'JSON Formatter & Validator Online Free - Beautify & Debug JSON | MyToolsHub',
  description:
    'Format, validate, and beautify JSON data instantly online. Detect JSON errors, pretty-print output, and minify JSON in one free tool. No signup required.',
  keywords: [
    'json formatter',
    'json beautifier',
    'format json online',
    'json formatter online',
    'json validator',
    'json parser',
    'json pretty print',
    'beautify json',
    'online json formatter',
    'json editor',
    'format json data',
    'validate json',
    'json formatting tool',
    'json viewer',
  ],
  slug: 'json-formatter',
});

export default function Layout({ children }) {
  return <>{children}</>;
}

