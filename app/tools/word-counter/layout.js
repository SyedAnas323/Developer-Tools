import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Word Counter Tool - Count Words & Characters',
  description:
    'Count words, characters, sentences, and paragraphs online with a simple live word counter tool.',
  keywords: ['word counter', 'character count', 'word count tool', 'letter counter'],
  slug: 'word-counter',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
