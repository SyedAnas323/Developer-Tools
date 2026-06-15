'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { TOOL_FAQS } from '../faq-data';

const HOW_TO_STEPS = [
  'Enter a URL, text, email, phone number, or WiFi value.',
  'Preview the QR code to confirm the content is correct.',
  'Download the QR code as a PNG image.',
  'Print it, share it, or place it on a website, menu, or product label.',
];

const QR_TYPES = [
  {
    type: 'URL QR Codes',
    purpose: 'Send users to a website, landing page, or product page.',
    exampleUseCase: 'A QR code on a poster that opens a campaign page.',
  },
  {
    type: 'Text QR Codes',
    purpose: 'Display a plain text message when scanned.',
    exampleUseCase: 'A QR code that shows instructions or a short note.',
  },
  {
    type: 'Email QR Codes',
    purpose: 'Open an email draft with a recipient and message.',
    exampleUseCase: 'A support QR code that starts a help request.',
  },
  {
    type: 'Phone Number QR Codes',
    purpose: 'Open the phone dialer with a number prefilled.',
    exampleUseCase: 'A contact card or support desk poster.',
  },
  {
    type: 'WiFi QR Codes',
    purpose: 'Connect a phone to a wireless network quickly.',
    exampleUseCase: 'A cafe or office WiFi login sticker.',
  },
  {
    type: 'Location QR Codes',
    purpose: 'Open a map location or place pin.',
    exampleUseCase: 'An event venue or store address sign.',
  },
  {
    type: 'vCard QR Codes',
    purpose: 'Share contact details in a scannable business card format.',
    exampleUseCase: 'A business card that saves a phone, email, and company name.',
  },
];

const STATIC_VS_DYNAMIC_ROWS = [
  {
    feature: 'Editability',
    staticQrCode: 'Fixed after creation',
    dynamicQrCode: 'Can be updated later',
  },
  {
    feature: 'Tracking',
    staticQrCode: 'No built-in tracking',
    dynamicQrCode: 'Can support scan tracking',
  },
  {
    feature: 'Analytics',
    staticQrCode: 'Usually none',
    dynamicQrCode: 'Often available through a platform',
  },
  {
    feature: 'Cost',
    staticQrCode: 'Usually free',
    dynamicQrCode: 'Often paid or subscription-based',
  },
  {
    feature: 'Business Use',
    staticQrCode: 'Simple use cases and small projects',
    dynamicQrCode: 'Campaigns, reporting, and long-term marketing',
  },
];

const DESIGN_RECOMMENDATIONS = [
  'Keep the QR code high contrast, usually dark code on a light background.',
  'Leave a clean quiet zone around the code so scanners can detect it.',
  'Use a size large enough for the distance from which people will scan it.',
  'Test the QR code on multiple phones before printing it on materials.',
  'Avoid adding busy patterns behind the code if you want a reliable scan.',
  'Use a short, clean destination URL when possible.',
];

const SCANNING_TIPS = [
  'Hold the phone camera steady and let it focus on the code.',
  'Keep enough light on the QR code so the modules remain visible.',
  'Avoid folding or bending printed QR codes.',
  'Make sure the code is large enough for the scan distance.',
  'Check that the destination link opens correctly before distributing the code.',
];

const SECURITY_TIPS = [
  'Point the QR code to a trusted destination.',
  'Test the final code before sharing it publicly.',
  'Use branded landing pages when the code is part of a campaign.',
  'Avoid redirect chains that could reduce trust or create scanning friction.',
  'Keep content short when the QR code stores plain text or contact details.',
];

const RELATED_TOOLS = [
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/pdf-merge', label: 'PDF Merge' },
  { href: '/tools/word-to-pdf', label: 'Word To PDF' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/background-remover', label: 'Background Remover' },
  { href: '/tools/word-counter', label: 'Word Counter' },
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
              <tr key={row.feature || row.type} className="align-top">
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

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState('url');
  const [size, setSize] = useState(240);
  const [foreground, setForeground] = useState('#0f172a');
  const [background, setBackground] = useState('#ffffff');
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const currentFaqs = TOOL_FAQS['qr-generator'] || [];

  const payload = text.trim();

  const downloadQR = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Free QR Code Generator - Create QR Codes for URL, Text & WiFi | MyToolsHub',
    url: 'https://toolshub.cyphersol.com/tools/qr-generator',
    description:
      'Generate free QR codes instantly for URLs, text, email, phone numbers, or WiFi credentials. Download in PNG format. No signup, no watermark, 100% free.',
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
    name: 'QR Code Generator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://toolshub.cyphersol.com/tools/qr-generator',
    description:
      'Create QR codes online for URLs, text, email, phone numbers, WiFi details, and more.',
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
        name: 'QR Generator',
        item: 'https://toolshub.cyphersol.com/tools/qr-generator',
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Create A QR Code Online',
    description:
      'Enter content, preview the QR code, choose design settings, and download the finished code.',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'QR Code Generator',
      },
    ],
    step: HOW_TO_STEPS.map((step) => ({
      '@type': 'HowToStep',
      name: step,
      text: step,
    })),
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
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              QR Code Maker
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Free QR Code Generator Online
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Create QR codes online for websites, business cards, menus, product packaging, and
              WiFi sharing. This QR code generator gives you a fast preview, simple design controls,
              and a PNG download that is ready for print or digital use.
            </p>
          </div>

          <div className="p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Content Type
                  </span>
                  <select
                    value={qrType}
                    onChange={(e) => setQrType(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="url">URL QR Code</option>
                    <option value="text">Text QR Code</option>
                    <option value="email">Email QR Code</option>
                    <option value="phone">Phone Number QR Code</option>
                    <option value="wifi">WiFi QR Code</option>
                    <option value="location">Location QR Code</option>
                    <option value="vcard">vCard QR Code</option>
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    URL or text
                  </span>
                  <textarea
                    placeholder="Enter URL, text, WiFi credentials, or contact details here..."
                    value={text}
                    onChange={(event) => {
                      setText(event.target.value);
                      setError('');
                    }}
                    className="min-h-[180px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                {error ? (
                  <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Size</span>
                    <input
                      type="range"
                      min="160"
                      max="320"
                      step="10"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="mt-2 text-xs text-slate-500">{size}px preview size</p>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      QR Detail Level
                    </span>
                    <select
                      defaultValue="H"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="L">Low</option>
                      <option value="M">Medium</option>
                      <option value="Q">High</option>
                      <option value="H">Highest</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Foreground Color
                    </span>
                    <input
                      type="color"
                      value={foreground}
                      onChange={(e) => setForeground(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Background Color
                    </span>
                    <input
                      type="color"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2"
                    />
                  </label>
                </div>

                {payload ? (
                  <button
                    onClick={downloadQR}
                    className="mt-4 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Download QR Code
                  </button>
                ) : null}
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Live Preview
                </p>
                <div className="mt-4 flex min-h-[360px] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50">
                  <div
                    ref={canvasRef}
                    className={`rounded-2xl p-4 ${payload ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'bg-transparent'}`}
                  >
                    {payload ? (
                      <QRCodeCanvas
                        value={payload}
                        size={size}
                        bgColor={background}
                        fgColor={foreground}
                        level="H"
                        includeMargin
                      />
                    ) : (
                      <div className="flex h-[240px] w-[240px] items-center justify-center text-center text-sm text-slate-400">
                        Enter a URL or text to preview the QR code.
                      </div>
                    )}
                  </div>
                </div>
                {payload ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                    <strong className="text-slate-900">Preview content:</strong> {payload}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Short Answer
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A QR code generator turns text, links, or contact data into a scannable code that
              opens content instantly on a mobile device.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Best For
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Websites, business cards, menus, packaging, events, WiFi sharing, and marketing
              campaigns that need a fast scan path.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A PNG QR code image that you can download, print, or place on a page, poster, or label.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Definition"
            title="What Is A QR Code Generator?"
            description="A QR code generator is a tool that creates a scannable square code from data such as a URL, email address, phone number, WiFi login, location, or plain text."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is A QR Code?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A QR code is a two-dimensional barcode made of black and white modules. It stores data
                that a camera or scanner can read quickly.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How QR Codes Work</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The code encodes information in a matrix pattern. When scanned, the phone decodes the
                pattern and opens the stored content, such as a website or contact card.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">QR Code Technology Explained</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                QR technology uses position markers, alignment patterns, and error correction so the
                code can still be read even if it is slightly damaged or printed in a small size.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              QR codes are compact data containers designed for fast scanning. A QR code generator
              turns a human-readable destination, like a link or contact detail, into a machine-readable
              symbol that mobile cameras can decode in seconds.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Create A QR Code Online"
              description="Creating a QR code is simple: enter the content, verify it, and download the final image."
            />
            <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              {HOW_TO_STEPS.map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Benefits"
              title="Benefits Of Using QR Codes"
              description="QR codes connect offline materials with online actions without forcing people to type a long address."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Reduces typing friction and speeds up user access.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Works on printed materials, packaging, signage, and digital screens.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Supports marketing, contact sharing, and customer onboarding.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                Creates a bridge between physical media and mobile actions.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Scanning"
            title="QR Code Scanning Explained"
            description="Scanning a QR code is simple for mobile users because camera apps and built-in scanners can read the code without manual typing."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            A phone camera detects the square pattern, focuses on the code, and decodes the stored
            information. If the code contains a URL, the phone opens the website. If it stores WiFi
            credentials, the phone can join the network. If it stores contact data, the phone can
            display or save the contact details.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="QR codes are used anywhere a fast scan is better than manual typing."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {QR_TYPES.map((item) => (
              <article key={item.type} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.type}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.purpose}</p>
                <p className="mt-3 text-xs text-slate-500">{item.exampleUseCase}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Static vs Dynamic"
              title="Static QR Codes vs Dynamic QR Codes"
              description="Static and dynamic QR codes serve different business needs."
            />
            <div className="mt-6">
              <DataTable
                columns={['Feature', 'Static QR Code', 'Dynamic QR Code']}
                rows={STATIC_VS_DYNAMIC_ROWS}
              />
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Short Answer
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Static QR codes are best when the destination will not change. Dynamic QR codes are
                better when you want to edit the destination later or measure performance through scan
                data.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Types"
              title="Types Of QR Codes"
              description="Each QR code type serves a different purpose, from business communication to location sharing."
            />
            <div className="mt-6 space-y-4">
              {QR_TYPES.map((item) => (
                <article key={item.type} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-base font-semibold text-slate-900">{item.type}</h4>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    <strong className="text-slate-900">Purpose:</strong> {item.purpose}
                  </p>
                  <p className="text-sm leading-7 text-slate-600">
                    <strong className="text-slate-900">Example:</strong> {item.exampleUseCase}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Business"
              title="QR Codes For Business"
              description="Businesses use QR codes to reduce friction and guide customers to a specific action."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Customer Access</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Direct people to landing pages, support forms, or product details quickly.
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Brand Experience</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Place QR codes on cards, flyers, and packaging to create a branded scan path.
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Operational Use</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Use QR codes for inventory, menus, manuals, and internal document access.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Marketing"
              title="QR Codes For Marketing"
              description="Marketers use QR codes to connect print, packaging, outdoor media, and digital campaigns."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Campaign Links</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Drive traffic from posters, ads, and brochures directly to campaign pages.
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Lead Capture</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Send people to forms, discount pages, and email signup destinations.
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Offline To Online</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Bridge physical media and online engagement through a single scan.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Ecommerce"
              title="QR Codes For Ecommerce"
              description="Ecommerce stores use QR codes to drive traffic, support products, and improve packaging value."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Product Packaging</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Add QR codes to packaging so customers can reach support or product details.
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Promotions</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Send shoppers to discounts, bundles, or special landing pages.
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Support Links</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Guide customers to setup instructions, warranty pages, and help content.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Design"
              title="Best Practices For QR Code Design"
              description="Good QR design improves scan speed and reduces user frustration."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {DESIGN_RECOMMENDATIONS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Mistakes"
              title="Common QR Code Mistakes"
              description="Most QR issues come from design choices, poor contrast, or broken destinations."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {[
                'Using too little contrast between the code and background.',
                'Printing the code too small for the scan distance.',
                'Linking to a page that no longer exists.',
                'Adding too much decoration that makes the code hard to read.',
                'Forgetting to test the code on multiple phones.',
              ].map((item) => (
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
              eyebrow="Scanning"
              title="QR Code Scanning Tips"
              description="A QR code should be easy for a camera to detect and decode."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {SCANNING_TIPS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Security"
              title="QR Code Security Best Practices"
              description="QR codes are useful, but users still need to trust where the code goes."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {SECURITY_TIPS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise enough for search users and structured enough for AI citations."
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
            description="Continue the workflow with these related utilities."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
