'use client';

import { useRef, useState } from 'react';

const HOW_TO_STEPS = [
  'Upload a JPG, PNG, or WebP image from your device.',
  'Let the AI background remover detect the subject and remove the background.',
  'Review the original preview and the transparent result side by side.',
  'Download the output as a transparent PNG and use it on your page, store, or campaign.',
];

const TRANSPARENT_FORMAT_ROWS = [
  {
    feature: 'Transparency',
    png: 'Yes',
    jpg: 'No',
    webp: 'Yes',
  },
  {
    feature: 'Best use case',
    png: 'Transparent cutouts, logos, product shots',
    jpg: 'Flat images with solid backgrounds',
    webp: 'Modern web delivery with smaller files',
  },
  {
    feature: 'File size',
    png: 'Usually larger',
    jpg: 'Usually smaller',
    webp: 'Often smaller than PNG and JPG',
  },
  {
    feature: 'Edge quality',
    png: 'Excellent',
    jpg: 'Good on photos, not ideal for cutouts',
    webp: 'Excellent for web-ready assets',
  },
  {
    feature: 'Recommended after background removal',
    png: 'Best default',
    jpg: 'Only if transparency is not needed',
    webp: 'Good for web use when transparency is supported',
  },
];

const MANUAL_VS_AI_ROWS = [
  {
    feature: 'Speed',
    manual: 'Slow and hands-on',
    ai: 'Fast and automatic',
  },
  {
    feature: 'Control',
    manual: 'High pixel-level control',
    ai: 'Enough control for most product and portrait images',
  },
  {
    feature: 'Best for',
    manual: 'Complex edge cases and detailed retouching',
    ai: 'Everyday product photos, portraits, and social assets',
  },
  {
    feature: 'Learning curve',
    manual: 'Requires editing skills',
    ai: 'Simple upload-and-download workflow',
  },
  {
    feature: 'Output speed',
    manual: 'Minutes to hours',
    ai: 'Seconds',
  },
];

const COMMON_USE_CASES = [
  {
    title: 'Ecommerce Product Photography',
    text: 'Product photos need clean edges, consistent backgrounds, and fast delivery. Background removal helps turn a busy camera shot into a clean, reusable product cutout that can be placed on white, gray, or branded layouts.',
  },
  {
    title: 'Online Stores',
    text: 'Online stores use transparent images to keep catalogs visually consistent. A transparent background maker helps match product cards, banners, and landing pages without reshooting the product.',
  },
  {
    title: 'Amazon Product Images',
    text: 'Amazon product images often need a clean subject on a neutral background. Removing the background before upload can make the image more marketplace-friendly and easier to adapt for thumbnails and detail pages.',
  },
  {
    title: 'Etsy Listings',
    text: 'Etsy sellers use transparent PNGs for handmade products, mockups, digital goods, and promotional graphics. A clean cutout keeps the product at the center of the listing.',
  },
  {
    title: 'Shopify Stores',
    text: 'Shopify stores often mix product shots, lifestyle images, and banner graphics. Background removal makes it easier to create a unified storefront with better visual consistency across pages.',
  },
  {
    title: 'Social Media Content',
    text: 'Social posts, story graphics, and ad creatives often work better when the subject is isolated. A photo background remover lets you place the subject on fresh color blocks, gradients, or text layouts.',
  },
  {
    title: 'Graphic Design',
    text: 'Designers use transparent cutouts in posters, landing pages, mockups, thumbnails, and layered compositions. A clean subject gives more freedom when building the final design.',
  },
  {
    title: 'Marketing Materials',
    text: 'Ads, flyers, catalogs, and sales decks often need a clean product cutout instead of a busy background. That makes the message stronger and the visual hierarchy easier to control.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'What is a background remover?',
    a: 'A background remover is a tool that separates the main subject from the background so you can create a cleaner image with transparency or a replacement backdrop.',
  },
  {
    q: 'How does an AI background remover work?',
    a: 'AI background removal detects the subject, traces the edges, and removes the surrounding background with minimal manual cleanup.',
  },
  {
    q: 'Is this background remover free?',
    a: 'Yes. You can remove background from image files for free directly in your browser.',
  },
  {
    q: 'Can I make an image transparent?',
    a: 'Yes. The output is designed as a transparent PNG, which is the standard format for clean cutouts.',
  },
  {
    q: 'Can I remove white background from image files?',
    a: 'Yes. White backgrounds are one of the most common cases for background eraser tools because product photos and profile photos often need a cleaner look.',
  },
  {
    q: 'Which file formats are supported?',
    a: 'Common upload formats such as JPG, PNG, and WebP are supported on most modern browsers.',
  },
  {
    q: 'Should I use PNG or JPG after background removal?',
    a: 'Use PNG when transparency matters. Use JPG only when the image will have a solid background and you want a smaller file size.',
  },
  {
    q: 'Can I use it for ecommerce product images?',
    a: 'Yes. Transparent product images are widely used in ecommerce, marketplace listings, ads, and catalog pages.',
  },
  {
    q: 'Does background removal reduce quality?',
    a: 'The subject is kept as sharp as possible, but the final quality also depends on the original image resolution and edge clarity.',
  },
  {
    q: 'Can I remove photo background online on mobile?',
    a: 'Yes. The tool works in modern mobile browsers as well as desktop browsers.',
  },
  {
    q: 'Is the output a transparent PNG?',
    a: 'Yes. Transparent PNG is the standard export when you need a cutout that can sit on any background.',
  },
  {
    q: 'Can I use the result on Amazon, Etsy, or Shopify?',
    a: 'Yes. Transparent product images are especially useful for ecommerce platforms that need clean, reusable visuals.',
  },
  {
    q: 'What is the difference between manual editing and AI background removal?',
    a: 'Manual editing gives pixel-level control but takes longer. AI background removal is faster and suitable for most everyday images.',
  },
  {
    q: 'Which images work best with background removal?',
    a: 'Images with clear subjects and visible edge contrast, such as product photos, portraits, and isolated objects, usually produce the cleanest output.',
  },
  {
    q: 'Do uploaded files stay on the site permanently?',
    a: 'Files are processed for the task and are not intended for permanent storage on the platform.',
  },
];

const RELATED_TOOLS = [
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/image-cropper', label: 'Image Cropper' },
  { href: '/tools/image-format-converter', label: 'Image Format Converter' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

export default function BackgroundRemover() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');

  const handleReset = () => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setLoading(false);
    setOriginalImage('');
    setResultUrl('');
    setError('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveBg = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setLoading(true);
    setError('');
    setResultUrl('');

    const reader = new FileReader();
    reader.onload = (ev) => setOriginalImage(ev.target.result);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/removebg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Free Background Remover Online - Remove Background From Image | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/background-remover',
    description:
      'Remove background from image files online for free. Create transparent PNG images, clean product photos, and social media cutouts in seconds with AI.',
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
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Remove Background From An Image Online',
    description:
      'Upload an image, let the tool remove the background, review the transparent result, and download the file.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Background Remover',
      },
    ],
    step: HOW_TO_STEPS.map((step) => ({
      '@type': 'HowToStep',
      name: step,
      text: step,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 px-8 py-10 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/30">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5c4.4 0 8 3.1 9.3 7-1.3 3.9-4.9 7-9.3 7s-8-3.1-9.3-7C4 8.1 7.6 5 12 5zm0 4a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
              AI Background Remover
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Free Background Remover Online
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
              Remove background from image files in seconds and download a clean transparent PNG.
              It is built for product photos, portraits, and social media cutouts without a complex
              editing workflow.
            </p>
          </div>

          <div className="p-8">
            {!resultUrl && !loading ? (
              <div className="relative">
                <input
                  ref={inputRef}
                  id="bgRemoverInput"
                  type="file"
                  accept="image/*"
                  onChange={handleRemoveBg}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <label
                  htmlFor="bgRemoverInput"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-purple-200 bg-purple-50 px-6 text-center transition hover:border-purple-400 hover:bg-purple-100/70"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-purple-600 shadow-sm ring-1 ring-purple-100">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    Click to upload an image
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    JPG, PNG, and WebP files work best for background removal.
                  </p>
                </label>
              </div>
            ) : null}

            {loading ? (
              <div className="py-12 text-center">
                <div className="relative mx-auto mb-5 h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-200" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">AI Processing...</h2>
                <p className="mt-2 text-sm text-slate-500">
                  The tool is detecting the subject and creating a transparent PNG.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-red-600">
                {error}
              </div>
            ) : null}

            {resultUrl && !loading ? (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Original
                    </p>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
                      <img
                        src={originalImage}
                        alt="Original image preview"
                        className="mx-auto max-h-[320px] rounded-xl object-contain"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Transparent Result
                    </p>
                    <div
                      className="mt-4 inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-3"
                      style={{
                        background:
                          'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 16px 16px',
                      }}
                    >
                      <img
                        src={resultUrl}
                        alt="Image with background removed"
                        className="mx-auto max-h-[320px] rounded-xl object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={resultUrl}
                    download="transparent-background.png"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Download PNG
                  </a>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Upload New Image
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Short Answer</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use a transparent PNG when you need the subject to sit on a new background. Use JPG when transparency is not needed and file size matters more. Use WebP when you want a modern, web-friendly format with strong compression.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Best For</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Ecommerce product shots, portraits, logo cutouts, ad creatives, thumbnails, and store banners that need a cleaner visual hierarchy.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Output</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              The typical export is a transparent PNG image that can be placed on any background without leaving a visible box around the subject.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
              Definition
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">What Is A Background Remover?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A background remover is a tool that isolates the subject in an image and removes everything behind it. The purpose is simple: turn a busy photo into a clean cutout that can be reused across websites, product catalogs, ads, and design layouts. For most users, the value is not just visual cleanliness. It is the ability to reuse the same subject on different backgrounds without editing the file again.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              In modern workflows, background removal is often the first step before resizing, compressing, or converting the image into a different format. That is why a photo background remover is useful for ecommerce teams, creators, marketers, and designers who need faster asset production.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How Background Removal Works</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Background removal works by separating the subject from the surrounding pixels. A good tool looks for contrast, shape boundaries, color changes, and edge details such as hair, product outlines, and transparent surfaces. Once the subject is identified, the background is removed and the remaining subject is placed on a transparent canvas.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                If the original image has a strong subject and a clear backdrop, the output is usually cleaner. Complex scenes with shadows, reflections, or overlapping objects can still be processed, but the cleaner the source file, the better the cutout.
              </p>
            </article>

            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">AI Background Removal Technology</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                AI background removal uses pattern recognition and subject detection to automate what used to take manual tracing. Instead of drawing around the subject by hand, the model predicts where the subject ends and the background begins. That makes it useful for high-volume workflows where speed matters more than pixel-by-pixel retouching.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                This is why AI background remover tools are popular in ecommerce and advertising. They let teams produce more transparent background images in less time, which reduces bottlenecks for product launches, campaign updates, and content publishing.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Steps</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">How To Remove Background From An Image Online</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            The ideal online background remover should make the process straightforward from upload to download. A clean workflow matters because users often need results quickly for store updates, social posts, or product listings.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <ol className="space-y-4 text-sm leading-7 text-slate-600">
                {HOW_TO_STEPS.map((step, index) => (
                  <li key={step}>
                    <strong className="text-slate-900">{index + 1}.</strong> {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What To Check Before Downloading</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>• The subject edges are clean enough for the intended use.</li>
                <li>• The transparent background does not include stray shadows or leftover pixels.</li>
                <li>• The image still looks sharp at the size you plan to publish.</li>
                <li>• The final format is PNG when you need transparency.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Benefits</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Benefits Of Using A Background Remover</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['Faster content production', 'Create reusable cutouts without spending time tracing each edge by hand.'],
              ['Cleaner product presentation', 'Remove visual clutter so the product or subject stands out immediately.'],
              ['Better ad flexibility', 'Reuse the same subject across banners, ads, and landing pages with different backdrops.'],
              ['More consistent branding', 'Place transparent images on branded backgrounds and templates without mismatched edges.'],
              ['Less editing overhead', 'Reduce the number of design passes needed before publishing an asset.'],
              ['Useful for teams and solo creators', 'One workflow works for stores, agencies, freelancers, and social creators.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Why It Matters</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Why Background Removal Matters</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Background removal matters because the background often carries more visual noise than the subject itself. When the scene behind the subject is unnecessary, it can distract from the product, slow down the design process, and make the page harder to scan. Removing that background gives you a cleaner subject that can be reused across multiple layouts, which is especially important when the same file needs to work on a product page, in an ad, and in a marketplace listing.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 p-5">
              <strong className="block text-sm font-semibold text-purple-600">Short answer</strong>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Remove the background when the subject is the main thing users should see.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 p-5">
              <strong className="block text-sm font-semibold text-purple-600">Best outcome</strong>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                A transparent background image that fits into any design system.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 p-5">
              <strong className="block text-sm font-semibold text-purple-600">Business value</strong>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Faster publishing, cleaner creative, and more consistent presentation.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Use Cases</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Common Use Cases</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {COMMON_USE_CASES.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Transparent Background
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Transparent Background Explained</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            A transparent background image does not have a filled backdrop behind the subject. Instead, the empty parts of the file contain transparency information, often called the alpha channel. That is why transparent PNGs can sit cleanly on top of a colored website section, a product card, or a marketing banner without showing a white box around the subject.
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            In visual design, transparent PNG images are valuable because they are flexible. A logo cutout can be dropped onto dark, light, or patterned backgrounds. A product cutout can be reused on a landing page, in a marketplace listing, or inside a presentation slide. For many teams, this flexibility is the real reason to make image transparent in the first place.
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-purple-100 bg-purple-50 p-5 text-sm leading-7 text-slate-700">
            <strong className="text-slate-900">Short answer:</strong> Transparent PNG is the most reliable format after background removal because it preserves transparency and keeps the subject reusable across layouts.
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Formats
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">PNG vs JPG For Background Removal</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            After background removal, the format you choose affects how the image behaves on your site. PNG is usually the best default because it supports transparency. JPG is useful when the image will sit on a solid background and file size needs to stay lower. WebP can be a strong modern choice for web delivery, but transparency and browser support should still be considered.
          </p>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Feature</th>
                    <th className="px-5 py-4 font-semibold">PNG</th>
                    <th className="px-5 py-4 font-semibold">JPG</th>
                    <th className="px-5 py-4 font-semibold">WebP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {TRANSPARENT_FORMAT_ROWS.map((row) => (
                    <tr key={row.feature}>
                      <td className="px-5 py-4 font-medium text-slate-900">{row.feature}</td>
                      <td className="px-5 py-4 text-slate-600">{row.png}</td>
                      <td className="px-5 py-4 text-slate-600">{row.jpg}</td>
                      <td className="px-5 py-4 text-slate-600">{row.webp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Comparison
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Manual Background Removal vs AI Background Removal</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Manual editing still has a role when a file needs surgical cleanup, but AI background removal wins on speed and consistency for most everyday images. For ecommerce teams and creators, the main advantage is that the tool can process more files in less time while keeping the workflow simple.
          </p>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Feature</th>
                    <th className="px-5 py-4 font-semibold">Manual Editing</th>
                    <th className="px-5 py-4 font-semibold">AI Background Remover</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {MANUAL_VS_AI_ROWS.map((row) => (
                    <tr key={row.feature}>
                      <td className="px-5 py-4 font-medium text-slate-900">{row.feature}</td>
                      <td className="px-5 py-4 text-slate-600">{row.manual}</td>
                      <td className="px-5 py-4 text-slate-600">{row.ai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            <strong className="text-slate-900">Practical rule:</strong> use AI for fast background removal on product photos, portraits, and ad creatives, then use manual editing only when you need extra refinement around difficult edges.
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Best Practices
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Best Practices For Background Removal</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            <li className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Use images with clear subject contrast so the AI can detect edges more cleanly.
            </li>
            <li className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Choose PNG for transparent output when the subject needs to work on multiple backgrounds.
            </li>
            <li className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Resize oversized images before publishing so the final image stays efficient.
            </li>
            <li className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Check the final cutout on a page background, not just on a neutral preview canvas.
            </li>
            <li className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Keep product edges visible and avoid excessively cropped source files.
            </li>
            <li className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Export with the intended use case in mind: ecommerce, social, ads, or design.
            </li>
          </ul>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Mistakes
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Common Mistakes To Avoid</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Using JPG When Transparency Is Needed</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                JPG is not the right export when the image needs to sit on different backgrounds. If transparency matters, PNG is the safer choice.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Starting With A Low-Quality Source</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Background removal cannot fully recover detail that was never present in the source image. A higher-quality input usually gives a better cutout.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Ignoring Edge Details</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Hair, glass, reflections, and thin product edges can create cleanup issues. Review the output closely before using it in a final design.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Skipping Final Size Checks</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                A cutout may look good in preview but still be too large for the page. Check final dimensions before publishing or uploading to a store.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Ecommerce
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Background Removal For Ecommerce</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Ecommerce stores use transparent backgrounds to increase conversion because clean product presentation reduces friction. When the product is isolated, the shopper can focus on shape, color, and detail instead of visual clutter. Transparent backgrounds also make it easier to build consistent category grids, banner promos, and retargeting creatives.
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            For stores with many SKUs, AI background removal saves time by turning raw product shots into ready-to-use cutouts. That helps teams scale faster when they launch new items, refresh catalog images, or create campaign-specific visuals for seasonal promotions.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Social
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Background Removal For Social Media</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Social media content benefits from transparent subjects because the image can be placed on a branded background, gradient, or post template without a visible box around it. That makes it easier to build thumbnails, story graphics, announcement cards, and promo posts that look intentional.
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Marketers often use transparent cutouts to create fast variations of the same creative for multiple channels. A transparent subject can be moved across different layouts without redoing the asset from scratch.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Marketing
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Background Removal For Marketing</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Marketing teams use transparent product images in ads because the subject can be dropped into a message-heavy layout without competing against the copy. That is useful for product launches, offer ads, landing page banners, and presentation slides. It also makes it easier to produce variants for testing.
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            When a campaign needs a clean visual hierarchy, background removal helps the subject stay dominant. The design becomes easier to read, and the image can support the message instead of distracting from it.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            These answers are written for quick reading, search snippets, and AI search systems that prefer direct, structured responses.
          </p>
          <div className="mt-6 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
            Related Tools
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Related Tools</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Move from background removal into resizing, cropping, compression, and conversion without leaving the tools area.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_TOOLS.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
              >
                {tool.label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </main>
  );
}
