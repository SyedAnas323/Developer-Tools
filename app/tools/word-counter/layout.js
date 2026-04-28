import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Word Counter Online Free - Count Words, Characters & Sentences | MyToolsHub',
  description:
    'Count words, characters, sentences, and paragraphs in your text instantly. Free online word counter for writers, students, and SEO professionals. No signup.',
  keywords: ['word counter online', 'character counter free', 'count words in text online', 'word count checker free', 'sentence counter online'],
  slug: 'word-counter',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='word-counter' />
    </>;
}

