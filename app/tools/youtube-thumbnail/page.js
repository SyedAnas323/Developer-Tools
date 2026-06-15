'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const THUMBNAIL_ROWS = [
  { type: 'Default Thumbnail', resolution: '120x90', useCase: 'Fallback preview and basic legacy display' },
  { type: 'Medium Quality', resolution: '320x180', useCase: 'Common preview size for thumbnails and embeds' },
  { type: 'High Quality', resolution: '480x360', useCase: 'Clearer display for quick sharing and analysis' },
  { type: 'Standard Definition', resolution: '640x480', useCase: 'Good balance of size and visibility' },
  { type: 'Maximum Resolution', resolution: 'Usually highest available', useCase: 'Best option for download and reuse' },
];

const SIZE_ROWS = [
  { size: 'Default Thumbnail', use: 'Fallback and legacy display', note: 'Often available when higher-resolution versions are missing.' },
  { size: 'Medium Quality', use: 'General preview', note: 'Works well for most quick grabs and reference use.' },
  { size: 'High Quality', use: 'Sharper preview', note: 'Useful for design review, research, and content planning.' },
  { size: 'Standard Definition', use: 'Balanced output', note: 'Provides a larger preview with broad usefulness.' },
  { size: 'Maximum Resolution', use: 'Best available quality', note: 'Usually the preferred choice for HD thumbnail download.' },
];

const HD_ROWS = [
  { feature: 'Resolution', standard: 'Lower or mid-range', hd: 'Highest available version' },
  { feature: 'Clarity', standard: 'Good for quick previews', hd: 'Better for reuse and analysis' },
  { feature: 'Use Case', standard: 'General browsing and lightweight needs', hd: 'Marketing, thumbnails, research, and reference saving' },
  { feature: 'Visual Detail', standard: 'Less detail at larger sizes', hd: 'More detail and better text readability' },
];

const THUMBNAIL_BENEFITS = [
  'Lets creators save youtube thumbnail images quickly from any valid video URL.',
  'Helps analysts review competing thumbnails and study click-through design patterns.',
  'Makes it easier to extract youtube thumbnails in multiple resolutions for comparison.',
  'Supports marketers who need thumbnail images for presentations or campaign planning.',
  'Works as a thumbnail downloader online without extra software or signup.',
];

const USE_CASES = [
  { title: 'Content Creators', text: 'Creators save their own thumbnails to review design, contrast, and readability before publishing.' },
  { title: 'Digital Marketers', text: 'Marketers grab thumbnails to evaluate campaign angles, visual hooks, and CTR patterns.' },
  { title: 'Graphic Designers', text: 'Designers use thumbnail images as references when building video cover art and channel visuals.' },
  { title: 'Social Media Managers', text: 'Managers collect thumbnails for content libraries, previews, and cross-platform planning.' },
  { title: 'Researchers and Educators', text: 'Researchers and teachers use thumbnail grabs for study examples, lectures, and media analysis.' },
  { title: 'Competitor Analysis', text: 'Competitor thumbnails help teams study layout, text hierarchy, branding, and visual trends.' },
];

const DESIGN_BEST_PRACTICES = [
  'Keep the subject centered or intentionally offset for stronger composition.',
  'Use high contrast so the thumbnail remains readable at small sizes.',
  'Keep text short and large enough to read on mobile screens.',
  'Make the thumbnail visually consistent with the channel or brand identity.',
  'Avoid clutter so the viewer immediately understands the main topic.',
];

const DESIGN_MISTAKES = [
  'Using tiny text that becomes unreadable in the small preview.',
  'Placing too many objects into one thumbnail image.',
  'Ignoring contrast and making the design look flat or washed out.',
  'Saving a thumbnail without checking it at small display sizes.',
  'Using visuals that do not match the content of the video.',
];

const MARKETING_BENEFITS = [
  'Thumbnails are often the first visual signal a user sees before clicking a video.',
  'A well-designed thumbnail can raise click-through rate by making the content look more relevant and appealing.',
  'Marketers compare thumbnails to identify common styles, colors, and text patterns that stand out in a feed.',
  'High-resolution thumbnails are useful in decks, reports, and content planning documents.',
];

const RELATED_TOOLS = [
  { href: '/tools/youtube-downloader', label: 'YouTube Downloader' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/image-cropper', label: 'Image Cropper' },
  { href: '/tools/image-format-converter', label: 'Image Format Converter' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

const FAQS = [
  ['What is a YouTube thumbnail downloader?', 'A YouTube thumbnail downloader lets you extract and save the thumbnail image from a YouTube video in different resolutions.'],
  ['Can I download a YouTube thumbnail for free?', 'Yes. This thumbnail downloader online works free in the browser without signup.'],
  ['What is the best thumbnail size?', 'Maximum resolution is usually the best choice if you want the sharpest available image.'],
  ['Can I save YouTube thumbnails in HD?', 'Yes. HD thumbnail download is possible when the video has higher-resolution preview images available.'],
  ['What is a YouTube thumbnail extractor?', 'A YouTube thumbnail extractor pulls the thumbnail image from the video URL and provides direct image links.'],
  ['Can I get thumbnails from any video URL?', 'Most valid YouTube URLs can be used, as long as the video has accessible thumbnail images.'],
  ['Do thumbnails help with CTR?', 'Yes. Thumbnails influence click-through rate because they are a major part of the first impression on YouTube.'],
  ['Can I use thumbnails for research?', 'Yes. Thumbnail images are useful for content analysis, competitor research, and creative planning.'],
  ['What are the common thumbnail resolutions?', 'Common options include default, medium, HD, SD, and maximum resolution variants.'],
  ['Is the thumbnail image downloadable directly?', 'Yes. You can open the thumbnail image or save it directly after extraction.'],
  ['Are YouTube thumbnails good for marketing?', 'Yes. Marketers use thumbnails as references for campaign style, messaging, and visual hooks.'],
  ['Can I use thumbnails in presentations?', 'Yes. High-quality thumbnails are commonly used in reports, decks, and planning slides.'],
  ['What is the difference between standard and HD thumbnails?', 'HD thumbnails are larger and clearer, while standard thumbnails are smaller and often lighter.'],
  ['Can I use this on mobile?', 'Yes. The tool works in modern mobile browsers as well as desktop browsers.'],
  ['Are thumbnails stored permanently?', 'Generated or fetched content is not intended for permanent storage on the platform.'],
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
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
              <tr key={row.type || row.feature || row.size || row.platform} className="align-top">
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

function extractId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function YoutubeThumbnailPage() {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState(null);
  const [error, setError] = useState('');
  const [activeUrl, setActiveUrl] = useState('');

  const videoId = useMemo(() => extractId(url), [url]);

  const getThumbnail = () => {
    if (videoId) {
      setError('');
      const next = {
        max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      };
      setThumbnails(next);
      setActiveUrl(next.max);
    } else {
      setError('Invalid YouTube URL. Please paste a valid link.');
      setThumbnails(null);
      setActiveUrl('');
    }
  };

  const downloadCurrent = () => {
    if (!activeUrl) return;
    const a = document.createElement('a');
    a.href = activeUrl;
    a.download = 'youtube-thumbnail.jpg';
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-8 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Thumbnail Downloader
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              YouTube Thumbnail Downloader
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Download YouTube thumbnails in multiple resolutions, including HD and maximum
              available quality. Paste a video URL, extract the thumbnail image, preview it instantly,
              and save the thumbnail for design, analysis, or reference use.
            </p>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.08fr_0.92fr] lg:p-8">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="Paste YouTube URL here"
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={getThumbnail}
                  className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Get HD
                </button>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Preview
                </h2>
                {thumbnails ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-2">
                    <img
                      src={activeUrl}
                      alt="YouTube thumbnail preview"
                      className="w-full rounded-xl shadow-md"
                    />
                  </div>
                ) : (
                  <div className="mt-4 flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                    Paste a YouTube URL to preview the thumbnail
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-semibold text-slate-900">Download Options</h2>
                <div className="mt-4 grid gap-3">
                  {thumbnails ? (
                    [
                      ['Maximum Resolution', thumbnails.max, 'bg-slate-900 text-white'],
                      ['Standard Definition', thumbnails.sd, 'bg-red-600 text-white'],
                      ['High Quality', thumbnails.hq, 'bg-slate-200 text-slate-800'],
                      ['Medium Quality', thumbnails.mq, 'bg-slate-100 text-slate-800'],
                    ].map(([label, href, cls]) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setActiveUrl(href)}
                        className={`rounded-xl px-4 py-3 text-center text-sm font-semibold transition hover:opacity-90 ${cls}`}
                      >
                        {label}
                      </a>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-slate-600">
                      After extraction, choose from default, medium quality, high quality, standard
                      definition, or maximum resolution thumbnail images.
                    </p>
                  )}
                </div>
                {thumbnails ? (
                  <button
                    type="button"
                    onClick={downloadCurrent}
                    className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Save YouTube Thumbnail
                  </button>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-semibold text-slate-900">Current URL Status</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {videoId
                    ? 'Valid YouTube video detected. Extracted thumbnail links are ready.'
                    : 'Enter a valid video URL to generate the thumbnail links.'}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Short Answer</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            What Is A YouTube Thumbnail Downloader?
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            A YouTube thumbnail downloader is a thumbnail extractor that reads a video URL and
            exposes the thumbnail image in multiple resolution options. It is often used to download
            YouTube thumbnail images for analysis, design reference, marketing, or simple preview
            saving. The tool works by pulling the thumbnail URL that YouTube publishes for each video.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              ['What Is A YouTube Thumbnail?', 'A thumbnail is the preview image shown before a video is played. It is the visual hook that often determines whether users click.'],
              ['Why YouTube Thumbnails Matter', 'Thumbnails strongly affect click-through rate because viewers notice the image before they read the title.'],
              ['How Thumbnail Extraction Works', 'The downloader converts a YouTube video ID into image URLs and lets you open or save the available resolutions.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-red-100 bg-red-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">AI Overview Summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Thumbnail extraction is the process of converting a YouTube URL into direct thumbnail
              image links. Creators, marketers, and analysts use it to save YouTube thumbnails in
              standard or HD quality without extra software.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Download A YouTube Thumbnail"
              description="The process is quick: paste the URL, extract the thumbnail, preview the image, and save the version you need."
            />
            <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {[
                'Copy the YouTube video URL from the browser or mobile app.',
                'Paste it into the downloader field and click Get HD.',
                'Review the extracted thumbnail preview and available sizes.',
                'Choose the thumbnail version you want to save.',
                'Download or open the image in a new tab for saving.',
              ].map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Benefits"
              title="Benefits Of Using A YouTube Thumbnail Downloader"
              description="Thumbnail download tools help save time when you need thumbnails for research, planning, or design reference."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {THUMBNAIL_BENEFITS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Technology"
            title="Detailed Explanation Of YouTube Thumbnail Technology"
            description="YouTube generates multiple thumbnail files for each video so different devices and surfaces can display the preview efficiently."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Thumbnail Storage', 'A YouTube video ID maps to a set of thumbnail image URLs that are published by the platform.'],
              ['Resolution Options', 'Different quality versions exist so browsers and devices can choose an image that fits their needs.'],
              ['Display Surfaces', 'Thumbnails can appear on video pages, embeds, search results, and external preview use cases.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="Thumbnail images are valuable across content, marketing, design, and research workflows."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            eyebrow="Sizes"
            title="YouTube Thumbnail Sizes Explained"
            description="Different thumbnail sizes can be used for previewing, saving, and sharing depending on the use case."
          />
          <div className="mt-6">
            <DataTable columns={['Thumbnail Type', 'Resolution', 'Best Use Case']} rows={THUMBNAIL_ROWS} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="HD vs Standard YouTube Thumbnails"
            description="HD thumbnails usually offer sharper detail and better readability, especially on large screens and in design workflows."
          />
          <div className="mt-6">
            <DataTable columns={['Feature', 'Standard Thumbnail', 'HD Thumbnail']} rows={HD_ROWS} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Resolution"
              title="Detailed Explanation Of Thumbnail Resolution Options"
              description="YouTube thumbnail savers often expose several versions because not every video has the same quality set."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {SIZE_ROWS.map((item) => (
                <article key={item.size} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-900">{item.size}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.use}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{item.note}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Marketing"
              title="How Marketers Use Thumbnails In Campaigns"
              description="Thumbnail images are often studied and reused as planning references in content campaigns and creative testing."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {MARKETING_BENEFITS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="CTR"
            title="Why Thumbnails Impact Click-Through Rate"
            description="The thumbnail is often the first thing a viewer notices, which makes it a major factor in click behavior."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Click-through rate, or CTR, is strongly affected by the thumbnail because people decide
            whether a video looks relevant, interesting, or trustworthy before they start reading
            the title in detail. Creators study shapes, colors, facial expressions, text size, and
            composition to see what makes a thumbnail feel more clickable.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="Best Practices For YouTube Thumbnails"
              description="Good thumbnails are simple, high contrast, and readable even when they are very small."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {DESIGN_BEST_PRACTICES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Mistakes"
              title="Common Thumbnail Design Mistakes"
              description="The most common problems are clutter, low contrast, and text that is too small to read."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {DESIGN_MISTAKES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="SEO"
              title="YouTube Thumbnails For SEO"
              description="Thumbnails support SEO indirectly by improving visibility, relevance, and click-through behavior."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Thumbnails do not rank videos on their own, but they influence whether a searcher or
              suggested-viewer clicks the video. Better CTR can help a video perform better in
              YouTube’s recommendation ecosystem, which is why thumbnail testing matters for search
              and discovery workflows.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Branding"
              title="YouTube Thumbnails For Marketing"
              description="Marketing teams use thumbnails to communicate the topic, tone, and promise of a video at a glance."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A strong thumbnail acts like ad creative for a video. It highlights the topic, sets
              expectations, and gives a visual cue that supports the message of the campaign. Marketers
              often use downloaded thumbnails to compare creative styles across channels and campaigns.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Trends"
            title="YouTube Thumbnail Trends"
            description="Thumbnail trends change with platform behavior, audience preferences, and creator style."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Large Text', 'Short, bold words are often used to make the video topic instantly clear.'],
              ['Face-Forward Layouts', 'Creators often use expressive faces to draw attention and build curiosity.'],
              ['High Contrast Design', 'Bright highlights, bold edges, and contrasting colors help the thumbnail stand out.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise enough for quick readers and detailed enough for AI search extraction."
          />
          <div className="mt-6 space-y-4">
            {FAQS.map(([question, answer]) => (
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
            description="Continue the workflow with tools that support video, image, and content tasks."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'YouTube Thumbnail Downloader - Save HD Thumbnails Free | MyToolsHub',
              url: 'https://toolshub.cyphersol.com/tools/youtube-thumbnail',
              description:
                'Download YouTube video thumbnails in full HD quality instantly. Paste any YouTube URL and save the thumbnail image in multiple resolutions for free. No signup.',
              isPartOf: {
                '@type': 'WebSite',
                name: 'MyToolsHub',
                url: 'https://toolshub.cyphersol.com',
              },
              inLanguage: 'en',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'YouTube Thumbnail Downloader',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              url: 'https://toolshub.cyphersol.com/tools/youtube-thumbnail',
              description:
                'Download YouTube thumbnails online for free in multiple resolutions, including HD and maximum quality.',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
                  name: 'YouTube Thumbnail Downloader',
                  item: 'https://toolshub.cyphersol.com/tools/youtube-thumbnail',
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: 'How To Download A YouTube Thumbnail',
              totalTime: 'PT1M',
              step: [
                'Copy the YouTube video URL.',
                'Paste the URL into the thumbnail downloader.',
                'Click Get HD to extract thumbnail links.',
                'Preview and choose the thumbnail size you need.',
                'Open or save the thumbnail image.',
              ].map((step) => ({
                '@type': 'HowToStep',
                name: step,
                text: step,
              })),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map(([question, answer]) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: answer,
                },
              })),
            }),
          }}
        />
      </div>
    </main>
  );
}
