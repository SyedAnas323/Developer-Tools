import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Word Counter Online Free - Count Words, Characters & Sentences | MyToolsHub',
  description:
    'Count words, characters, sentences, and paragraphs in your text instantly. Free online word counter for writers, students, and SEO professionals. No signup.',
  keywords: [
    'word counter',
    'word count tool',
    'count words online',
    'online word counter',
    'character counter',
    'word checker',
    'text statistics',
    'count characters',
    'essay word counter',
    'paragraph counter',
    'sentence counter',
    'online character counter',
    'free word counter',
  ],
  slug: 'word-counter',
});

export default function Layout({ children }) {
  return <>{children}</>;
}

