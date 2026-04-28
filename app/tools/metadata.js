import { TOOL_FAQS } from './faq-data';
const BASE_URL = 'https://toolshub.cyphersol.com';

export function createToolMetadata({ title, description, keywords, slug }) {
  const keywordList = Array.isArray(keywords) ? keywords : String(keywords || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const url = `${BASE_URL}/tools/${slug}`;

  return {
    title,
    description,
    keywords: keywordList,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'MyToolsHub',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function ToolFaqSchema({ slug }) {
  const faqPairs = TOOL_FAQS[slug] || [];
  if (!faqPairs.length) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqPairs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
