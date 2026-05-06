'use client';

import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import { TOOL_FAQS } from './faq-data';

const TOOL_CONTENT = {
  'background-remover': {
    title: 'Background Remover',
    steps: [
      'Upload an image from your device.',
      'Wait for the tool to process the image and remove the background.',
      'Preview both the original image and the transparent result.',
    ],
    advantages: [
      'Helps create clean product images and profile pictures quickly.',
      'Shows a before-and-after preview before you save the result.',
      'Lets users download the processed image as a transparent PNG.',
    ],
    download: 'When processing finishes, click the download button to save the PNG file.',
  },
  'edit-pdf': null,
  'favicon-generator': {
    title: 'Favicon Generator',
    steps: [
      'Upload image by drag-and-drop or click upload.',
      'Preview all standard favicon sizes before export.',
      'Set background, padding, and shape options.',
      'Generate package and download all icons in one ZIP file.',
    ],
    advantages: [
      'Creates complete favicon bundle for website and PWA usage.',
      'Saves time with multiple size generation in one click.',
      'Includes HTML snippet and manifest-ready icon files.',
    ],
    download: 'Click generate favicon package to download favicon.ico, PNG sizes, and site.webmanifest in one ZIP.',
  },
  'image-compressor': {
    title: 'Image Compressor',
    steps: [
      'Upload the image you want to reduce in size.',
      'Wait a moment while the tool creates a smaller version.',
      'Compare the original size with the compressed file size.',
    ],
    advantages: [
      'Useful for websites, forms, and faster image sharing.',
      'Keeps the workflow simple with an instant result card.',
      'Helps reduce file size without extra software.',
    ],
    download: 'Use the download button to save the compressed image file.',
  },
  'image-resizer': {
    title: 'Image Resizer',
    steps: [
      'Upload your image and let the tool read its original dimensions.',
      'Enter the width and height you want in pixels.',
      'Click the resize button to generate the updated image.',
    ],
    advantages: [
      'Good for social media, profile images, and custom size requirements.',
      'Shows the original preview before creating the resized version.',
      'Makes it easy to download the final resized image.',
    ],
    download: 'After resizing, click the download button to save the new image.',
  },
  'image-format-converter': {
    title: 'Image Format Converter',
    steps: [
      'Upload an image by click or drag-and-drop.',
      'Preview the uploaded image to confirm it is correct.',
      'Select output format from PNG, JPG, WebP, or AVIF.',
      'Click convert and download the output instantly.',
    ],
    advantages: [
      'Converts common image formats from one simple page.',
      'Keeps workflow fast with instant browser-based processing.',
      'Useful for web optimization, social uploads, and compatibility.',
    ],
    download: 'After conversion, click the download button to save your file in the selected format.',
  },
  'image-cropper': {
    title: 'Image Cropper',
    steps: [
      'Upload image by click or drag-and-drop.',
      'Draw crop area and resize using handles from corners and edges.',
      'Use aspect ratio presets or manual width/height for exact crop.',
      'Preview live result and click crop and download instantly.',
    ],
    advantages: [
      'Gives precise crop control with visual handles and dimmed background.',
      'Supports rotate and flip for quick image adjustments before export.',
      'Runs directly in browser with instant output in multiple formats.',
    ],
    download: 'Select output format (PNG, JPG, or WebP) and use crop and download to save the result.',
  },
  'image-to-pdf': {
    title: 'Image To PDF',
    steps: [
      'Upload one or more images that you want to combine.',
      'Arrange or review the image order if needed.',
      'Create the PDF to merge all selected images into one file.',
    ],
    advantages: [
      'Turns multiple images into a single easy-to-share document.',
      'Useful for notes, scans, and photo collections.',
      'Keeps the conversion flow simple for quick downloads.',
    ],
    download: 'Once the PDF is generated, use the download button to save the file.',
  },
  'json-formatter': {
    title: 'JSON Formatter',
    steps: [
      'Paste raw JSON into the input editor.',
      'Click format to beautify the JSON or minify to compress it.',
      'Review the output panel and copy the result if needed.',
    ],
    advantages: [
      'Makes JSON easier to read and debug.',
      'Helps catch invalid JSON before using it elsewhere.',
      'Useful for developers working with APIs and config files.',
    ],
  },
  'password-generator': {
    title: 'Password Generator',
    steps: [
      'Choose the password length using the slider.',
      'Click generate to create a new secure password.',
      'Copy the generated password and use it where needed.',
    ],
    advantages: [
      'Creates stronger passwords than manually typed ones.',
      'Useful for accounts, apps, and admin dashboards.',
      'Fast way to generate a random password again and again.',
    ],
  },
  'pdf-merge': {
    title: 'PDF Merge',
    steps: [
      'Upload at least two PDF files from your device.',
      'Review the selected files and keep the order you want in the final document.',
      'Click the merge button to combine all PDFs into one file.',
    ],
    advantages: [
      'Helps combine reports, invoices, forms, and multi-part documents quickly.',
      'Creates one final PDF instead of sending many separate files.',
      'Keeps the merge workflow simple and download-ready.',
    ],
    download: 'After the merge finishes, use the download button to save the final merged PDF.',
  },
  'pdf-compressor': {
    title: 'PDF Compressor',
    steps: [
      'Upload the PDF file you want to compress.',
      'Wait while the tool creates a smaller version of the document.',
      'Compare the original size and the compressed size on screen.',
    ],
    advantages: [
      'Helps reduce file size for email, uploads, and storage.',
      'Shows the size savings clearly before download.',
      'Makes PDF optimization easy from one simple page.',
    ],
    download: 'Click the download button to save the compressed PDF.',
  },
  'qr-generator': {
    title: 'QR Generator',
    steps: [
      'Enter the URL, text, or content you want to convert into a QR code.',
      'Generate the QR image and preview it on the page.',
      'Save the QR code for printing, sharing, or scanning.',
    ],
    advantages: [
      'Useful for websites, menus, contact info, and marketing material.',
      'Provides a quick way to create scannable codes online.',
      'Keeps the process simple for both mobile and desktop users.',
    ],
    download: 'Download the generated QR code image when it appears.',
  },
  'word-counter': {
    title: 'Word Counter',
    steps: [
      'Paste or type your text into the editor.',
      'Watch the counts update for words, characters, and more.',
      'Edit the text further if you need to hit a specific limit.',
    ],
    advantages: [
      'Useful for essays, blogs, captions, and SEO content.',
      'Saves time by calculating counts instantly.',
      'Helps writers stay within platform or assignment limits.',
    ],
  },
  'word-to-pdf': {
    title: 'Word To PDF',
    steps: [
      'Upload a valid DOC or DOCX file.',
      'Click convert to generate the PDF version of your document.',
      'Wait for the tool to finish processing the file.',
    ],
    advantages: [
      'Converts editable Word files into shareable PDF format.',
      'Useful for resumes, reports, and printable documents.',
      'Keeps the conversion process simple and direct.',
    ],
    download: 'After conversion, click the download button to save the PDF file.',
  },
  'youtube-downloader': null,
  'youtube-thumbnail': {
    title: 'YouTube Thumbnail Downloader',
    steps: [
      'Paste a valid YouTube video URL into the input field.',
      'Click the button to load available thumbnail versions.',
      'Choose the image quality you want from the available options.',
    ],
    advantages: [
      'Lets users save preview images from YouTube videos quickly.',
      'Offers multiple quality options from one link.',
      'Helpful for research, design references, and content planning.',
    ],
    download: 'Open the quality option you want and save the image to your device.',
  },
};

type ToolContent = {
  title: string;
  steps: string[];
  advantages: string[];
  download?: string;
} | null;

function ToolInfoSection({ content }: { content: ToolContent }) {
  if (!content) {
    return null;
  }

  return (
    <section className="mx-auto mt-10 max-w-6xl px-4 pb-12">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">How To Use This Tool</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            {content.steps.map((step, index) => (
              <p key={step}>
                <strong>{index + 1}.</strong> {step}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Advantages Of This Tool</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            {content.advantages.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>

      {content.download && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">How Download Works</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{content.download}</p>
        </div>
      )}
    </section>
  );
}

function ToolFaqSection({ slug }: { slug: string }) {
  const faqItems = TOOL_FAQS[slug as keyof typeof TOOL_FAQS] || [];
  if (!faqItems.length) return null;

  return (
    <section className="mx-auto mt-4 max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">FAQs</h2>
        <div className="mt-4 space-y-4">
          {faqItems.map(([question, answer]) => (
            <article key={question} className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-base font-semibold text-slate-900">{question}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split('/').filter(Boolean).at(-1) || '';
  const content = TOOL_CONTENT[slug as keyof typeof TOOL_CONTENT];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      {children}
      <ToolInfoSection content={content} />
      <ToolFaqSection slug={slug} />
    </div>
  );
}
