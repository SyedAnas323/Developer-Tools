import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'JSON Formatter & Validator Online Free - Beautify & Debug JSON | MyToolsHub',
  description:
    'Format, validate, and beautify JSON data instantly online. Detect JSON errors, pretty-print output, and minify JSON in one free tool. No signup required.',
  keywords: ['json formatter online', 'json validator online free', 'beautify json online', 'json pretty print online', 'json minifier online'],
  slug: 'json-formatter',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='json-formatter' />
    </>;
}

