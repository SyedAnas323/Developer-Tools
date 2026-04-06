export function createToolMetadata({ title, description, keywords, slug }) {
  const keywordList = Array.isArray(keywords) ? keywords : String(keywords || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywordList,
    alternates: {
      canonical: `/tools/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/tools/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}
