import { TOOL_FAQS } from './faq-data';
const BASE_URL = 'https://toolshub.cyphersol.com';
const DEFAULT_OG_IMAGE = '/images/tools-hub.png';
const DEFAULT_OG_IMAGE_WIDTH = 928;
const DEFAULT_OG_IMAGE_HEIGHT = 269;

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
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: `${title} | MyToolsHub`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
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

export function ToolBreadcrumbSchema({ slug, label }) {
  if (!slug || !label) return null;

  const url = `${BASE_URL}/tools/${slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${BASE_URL}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: label,
        item: url,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ToolWebApplicationSchema({ slug, name, description }) {
  if (!slug || !name) return null;
  const url = `${BASE_URL}/tools/${slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript and a modern browser.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: description || `${name} by MyToolsHub`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
