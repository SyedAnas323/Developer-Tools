'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TOOL_FAQS } from '../faq-data';

const CONTENT_LENGTH_ROWS = [
  {
    contentType: 'SEO article',
    recommendedWordCount: '1,200-2,500 words',
    notes: 'Best for in-depth pages that need topical coverage and examples.',
  },
  {
    contentType: 'Blog post',
    recommendedWordCount: '800-1,800 words',
    notes: 'Common for editorial articles, tutorials, and evergreen content.',
  },
  {
    contentType: 'Landing page',
    recommendedWordCount: '400-1,200 words',
    notes: 'Enough to explain the offer clearly without creating clutter.',
  },
  {
    contentType: 'Product description',
    recommendedWordCount: '50-250 words',
    notes: 'Short, precise copy works best for ecommerce listings and catalogs.',
  },
  {
    contentType: 'Email',
    recommendedWordCount: '50-500 words',
    notes: 'Short subject lines, concise previews, and focused body copy are easier to read.',
  },
  {
    contentType: 'Academic essay',
    recommendedWordCount: '500-3,000+ words',
    notes: 'Depends on the assignment, level, and the required evidence depth.',
  },
];

const CHARACTER_LIMIT_ROWS = [
  {
    platform: 'Twitter / X',
    characterLimit: '280 characters',
    recommendedLength: 'Under 240 characters for room to spare',
  },
  {
    platform: 'Instagram caption',
    characterLimit: '2,200 characters',
    recommendedLength: 'Around 125-300 characters for scannability',
  },
  {
    platform: 'Facebook post',
    characterLimit: 'No strict universal limit',
    recommendedLength: '40-80 words for concise updates',
  },
  {
    platform: 'LinkedIn post',
    characterLimit: 'No strict universal limit',
    recommendedLength: '150-300 words for professional posts',
  },
  {
    platform: 'YouTube description',
    characterLimit: '5,000 characters',
    recommendedLength: '200-400 words depending on the video',
  },
  {
    platform: 'Meta description',
    characterLimit: 'Around 155-160 characters',
    recommendedLength: '145-155 characters for safe display',
  },
  {
    platform: 'Title tag',
    characterLimit: 'Around 50-60 characters',
    recommendedLength: '50-58 characters for better snippet control',
  },
];

const WORD_COUNT_VS_CHARACTER_ROWS = [
  {
    feature: 'What it measures',
    wordCount: 'Number of words in the text',
    characterCount: 'Number of letters, spaces, and punctuation marks',
  },
  {
    feature: 'Best for',
    wordCount: 'Essay length, article length, script length',
    characterCount: 'Social posts, meta descriptions, titles, bios',
  },
  {
    feature: 'Easy to compare across languages',
    wordCount: 'Moderate',
    characterCount: 'More exact for short copy',
  },
  {
    feature: 'Useful for long-form content',
    wordCount: 'Yes',
    characterCount: 'Sometimes, but less intuitive',
  },
  {
    feature: 'Useful for short-form copy',
    wordCount: 'Not always',
    characterCount: 'Yes',
  },
];

const USE_CASES = [
  {
    title: 'Academic Writing',
    text: 'Students and researchers use word counters to stay within essay requirements, thesis limits, and assignment guidelines.',
  },
  {
    title: 'Student Assignments',
    text: 'Class essays, reflections, and reports often need minimum or maximum word counts, so a counter helps confirm the length quickly.',
  },
  {
    title: 'Essay Writing',
    text: 'Essay writers use the tool to track introductions, body sections, and conclusions without overshooting the brief.',
  },
  {
    title: 'Blog Writing',
    text: 'Bloggers use word count to balance depth and readability while keeping the article structured and useful.',
  },
  {
    title: 'SEO Content Writing',
    text: 'SEO writers use the count to build topical coverage, compare page length, and keep content aligned with intent.',
  },
  {
    title: 'Copywriting',
    text: 'Ad copy, landing page copy, and product messaging often need tight length control, especially when conversions depend on clarity.',
  },
  {
    title: 'Social Media Content',
    text: 'Captions, bios, and post copy must fit platform constraints, so quick count checks reduce editing time.',
  },
  {
    title: 'Email Marketing',
    text: 'Subject lines, previews, and campaign copy benefit from a character and word check before send.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/pdf-merge', label: 'PDF Merge' },
  { href: '/tools/word-to-pdf', label: 'Word To PDF' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/password-generator', label: 'Password Generator' },
  { href: '/tools/json-formatter', label: 'JSON Formatter' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
];

function countWords(text) {
  const matches = text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
}

function countCharacters(text) {
  return text.length;
}

function countCharactersNoSpaces(text) {
  return text.replace(/\s/g, '').length;
}

function countParagraphs(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\n\s*\n+/).filter((part) => part.trim().length > 0).length;
}

function countSentences(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
    return Array.from(segmenter.segment(trimmed)).filter((part) => part.segment.trim().length > 0).length;
  }

  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches ? matches.filter((part) => part.trim().length > 0).length : 0;
}

function estimateReadingTime(words) {
  return Math.max(1, Math.ceil(words / 200));
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.feature || row.contentType || row.platform} className="align-top">
                {Object.values(row).map((value, index) => (
                  <td
                    key={`${value}-${index}`}
                    className={`px-5 py-4 text-slate-600 ${index === 0 ? 'font-medium text-slate-900' : ''}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function WordCounter() {
  const [text, setText] = useState('');

  const words = countWords(text);
  const characters = countCharacters(text);
  const charactersNoSpaces = countCharactersNoSpaces(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const readingTime = estimateReadingTime(words);
  const avgWordsPerSentence = sentences ? (words / sentences).toFixed(1) : '0.0';

  const currentFaqs = TOOL_FAQS['word-counter'] || [];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Word Counter Online Free - Count Words, Characters & Sentences | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/word-counter',
    description:
      'Count words, characters, sentences, and paragraphs in your text instantly. Free online word counter for writers, students, and SEO professionals. No signup.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'MyToolsHub',
      url: 'https://toolshub.cyphersol.com',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://toolshub.cyphersol.com/images/tools-hub.png',
      width: 928,
      height: 269,
    },
    inLanguage: 'en',
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Word Counter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://toolshub.cyphersol.com/tools/word-counter',
    description:
      'Count words online, count characters, and analyze sentences and paragraphs with a free word counter.',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://toolshub.cyphersol.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://toolshub.cyphersol.com/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Word Counter',
        item: 'https://toolshub.cyphersol.com/tools/word-counter',
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Count Words Online',
    description:
      'Paste text into the word counter, review the statistics, and use the results to meet length requirements.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Word Counter',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Paste or type your text',
        text: 'Paste or type your content into the text box.',
      },
      {
        '@type': 'HowToStep',
        name: 'Review the statistics',
        text: 'Check word count, character count, sentence count, and paragraph count.',
      },
      {
        '@type': 'HowToStep',
        name: 'Edit the content',
        text: 'Trim, expand, or restructure the text until it matches your target length.',
      },
      {
        '@type': 'HowToStep',
        name: 'Use the results',
        text: 'Apply the statistics to essays, SEO content, social posts, or email copy.',
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: currentFaqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 px-8 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Online Word Counter
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Free Word Counter Online
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Count words online, check characters, track sentences, and measure paragraphs in one
              place. This word count tool is built for students, SEO writers, bloggers, marketers,
              and anyone who needs accurate text statistics without extra setup.
            </p>
          </div>

          <div className="p-8">
            <label htmlFor="word-counter-input" className="mb-3 block text-sm font-semibold text-slate-700">
              Paste or type your text
            </label>
            <div className="relative">
              <textarea
                id="word-counter-input"
                className="h-80 w-full resize-none rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-base leading-7 text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white"
                placeholder="Start typing or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {text ? (
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
                >
                  Clear Text
                </button>
              ) : null}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Words</p>
                <p className="mt-2 text-4xl font-extrabold text-cyan-700">{words}</p>
              </div>
              <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                  Characters
                </p>
                <p className="mt-2 text-4xl font-extrabold text-blue-700">{characters}</p>
              </div>
              <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  No Spaces
                </p>
                <p className="mt-2 text-4xl font-extrabold text-emerald-700">{charactersNoSpaces}</p>
              </div>
              <div className="rounded-[1.5rem] border border-violet-100 bg-violet-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                  Sentences
                </p>
                <p className="mt-2 text-4xl font-extrabold text-violet-700">{sentences}</p>
              </div>
              <div className="rounded-[1.5rem] border border-orange-100 bg-orange-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  Paragraphs
                </p>
                <p className="mt-2 text-4xl font-extrabold text-orange-700">{paragraphs}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Reading Time
                </p>
                <p className="mt-2 text-4xl font-extrabold text-slate-900">{readingTime}m</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Average Words Per Sentence
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{avgWordsPerSentence}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Text Status
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {text.trim() ? 'Ready for analysis' : 'Waiting for text'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Short Answer
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A word counter measures how much text you have written by counting words, characters,
              sentences, and paragraphs in real time.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Essays, blog posts, SEO content, captions, email copy, scripts, reports, and any text
              that needs a length check.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Clear text statistics that help you keep writing within the right limits.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is A Word Counter?"
            description="A word counter is a text analysis tool that tells you how long a piece of writing is. It can show words, characters, sentences, and paragraphs, which makes it useful for writing that must meet a target length or platform limit."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Word Count Explained</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Word count is the number of words in your text. Writers use it to estimate length,
                balance sections, and meet assignment or editorial requirements. It is the most
                common measure for articles, essays, and long-form content.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Character Count Explained</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Character count measures letters, numbers, punctuation, and spaces. It is especially
                important for titles, meta descriptions, social posts, bios, and any platform that
                limits text length by characters rather than words.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Sentence Count Explained</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Sentence count estimates how many complete thoughts are in your text. It helps writers
                understand rhythm, structure, and readability, especially in blog posts, essays, and
                product copy.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Paragraph Count Explained</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Paragraph count tracks blocks of text separated by blank lines. It helps writers
                organize ideas into sections so the content is easier to scan and edit.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-cyan-100 bg-cyan-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The simplest way to think about text statistics is this: words show length, characters
              show space usage, sentences show flow, and paragraphs show structure. Together they
              give writers a better picture of how readable and how long the content really is.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Count Words Online"
              description="Count words online in a few simple steps: paste the text, review the results, and edit until the length matches your target."
            />
            <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-semibold text-slate-900">1.</span> Paste or type your text into the box.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-semibold text-slate-900">2.</span> Check the live stats for words, characters, sentences, and paragraphs.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-semibold text-slate-900">3.</span> Edit the text if you need to stay within a limit.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-semibold text-slate-900">4.</span> Use the statistics for essays, SEO content, email copy, or social posts.
              </li>
            </ol>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Benefits"
              title="Benefits Of Using A Word Counter"
              description="A good word count tool saves time, reduces guesswork, and makes writing easier to control."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Helps writers stay within length requirements without manual counting.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Makes editing easier by showing whether text is too short or too long.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Supports SEO, academic writing, copywriting, and social publishing.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Gives a fast overview of word count, character count, and text structure.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Why It Matters"
            title="Why Word Count Matters"
            description="Word count matters because different formats have different limits, and long-form writing still needs structure to stay readable."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Clarity</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Word count helps you see whether your text has enough detail or whether it needs to be
                tightened.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Compliance</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Essays, meta descriptions, title tags, and captions often have strict limits that are
                easier to manage with a counter.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Readability</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Sentence and paragraph counts reveal whether the content feels balanced or too dense
                for the intended audience.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="A word counter is useful anywhere length, rhythm, or structure matters."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {USE_CASES.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="Word Count vs Character Count"
            description="Word count and character count answer different questions. One measures meaning-packed units, and the other measures exact text length."
          />
          <div className="mt-6">
            <DataTable columns={['Feature', 'Word Count', 'Character Count']} rows={WORD_COUNT_VS_CHARACTER_ROWS} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Writing Limits"
            title="Common Writing Limits"
            description="These limits are useful when you write for platforms, search snippets, and social networks."
          />
          <div className="mt-6">
            <DataTable
              columns={['Platform', 'Character Limit', 'Recommended Length']}
              rows={CHARACTER_LIMIT_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Content Length"
            title="Recommended Word Counts By Content Type"
            description="Different content types need different levels of depth. Use the table below as a practical guide rather than a rigid rule."
          />
          <div className="mt-6">
            <DataTable
              columns={['Content Type', 'Recommended Word Count', 'Notes']}
              rows={CONTENT_LENGTH_ROWS}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="SEO"
              title="Word Count For SEO"
              description="SEO writers use word counters to keep pages long enough to cover the topic properly without drifting into filler."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Word count matters for SEO because it helps you balance depth, topical coverage, and
              readability. A page that is too short may not answer the search intent fully, while a
              page that is too long can become unfocused. The best SEO pages usually have enough
              words to explain the topic, include related entities, and answer common questions in a
              structured way.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Academic"
              title="Word Count For Academic Writing"
              description="Students and researchers use word counts to keep essays, reports, and dissertations within assignment expectations."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Academic writing often has minimums, maximums, or recommended ranges. A word counter
              helps you plan introductions, arguments, evidence, and conclusions so the paper fits
              the brief. It also helps with editing, since trimming a few words per sentence can make
              a long piece much easier to read.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Blogging"
              title="Word Count For Blog Posts"
              description="Bloggers use word counters to keep posts on target while still covering the topic in enough detail."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Blog posts do not need a fixed number of words, but they do need enough content to be
              useful. A word counter helps writers decide when an article is long enough to explain a
              concept and when it has become repetitive. It also helps compare multiple posts so the
              site stays consistent.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Social"
              title="Word Count For Social Media"
              description="Social media managers need character counts and short word counts to keep posts clean and platform-friendly."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Social media copy works best when it is direct. Word counters help reduce overshooting
              a post, bio, caption, or ad limit. They also help teams keep brand messages concise
              across multiple channels and avoid unnecessary truncation.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Best Practices For Content Writing"
              description="Good writing uses length as a tool, not a guess."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Write with a target length in mind before you start editing.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Use paragraph breaks to make long content easier to scan.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Check both word count and character count when format limits matter.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Trim repeated ideas instead of cutting useful context.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Match sentence length to the audience and the reading context.
              </li>
            </ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Mistakes"
              title="Common Mistakes To Avoid"
              description="Word count is most useful when you avoid these common editing problems."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Writing too long and then forcing a weak ending to reach the target.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Using character count when the assignment is clearly measured in words.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Ignoring paragraph structure and ending up with dense blocks of text.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Forgetting that punctuation and spaces matter for character-based limits.
              </li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Short Answer"
              title="How Do Writers Use Word Counters?"
              description="Writers use word counters to check length, adjust structure, and keep text aligned with the required format."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              SEO writers use them to compare article lengths and keep pages balanced. Students use
              them to meet assignment rules. Bloggers use them to make posts easy to skim. Marketers
              use them to stay within headline, ad, or email limits. Social media managers use them to
              avoid truncation and keep captions readable.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Summary"
              title="Content Length Recommendations"
              description="The ideal length depends on the job: a landing page, essay, or product page each needs a different amount of text."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Length recommendations are not strict rules. They help you decide how much detail is
              appropriate for the format. A blog post may need depth and examples, while a product
              description needs only enough words to explain the benefits and key features. A word
              counter keeps those decisions measurable.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are written in a direct, structured style for people and AI search systems."
          />
          <div className="mt-6 space-y-4">
            {currentFaqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                  <span className="flex items-center justify-between gap-4">
                    {question}
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Related Tools"
            title="Related Tools"
            description="Move to the next task in your workflow with these related utilities."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </main>
  );
}
