'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';

type Tool = {
  name: string;
  path: string;
  desc: string;
  icon: string;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsToolsMenuOpen(false);
  };
  const tools: Tool[] = [
    {
      name: 'Image Compressor',
      path: '/tools/image-compressor',
      desc: 'Reduce image file size without losing quality.',
      icon: '🖼️',
    },
    {
      name: 'PDF Compressor',
      path: '/tools/pdf-compressor',
      desc: 'Compress PDF files to make them smaller for email.',
      icon: '📄',
    },
    {
      name: 'QR Code Generator',
      path: '/tools/qr-generator',
      desc: 'Create QR codes for URLs, text, or WiFi instantly.',
      icon: '📱',
    },
    {
      name: 'YouTube Thumbnail',
      path: '/tools/youtube-thumbnail',
      desc: 'Download high-quality thumbnails from any YouTube video.',
      icon: '▶️',
    },
    {
      name: 'Image to PDF',
      path: '/tools/image-to-pdf',
      desc: 'Convert JPG and PNG images into a single PDF file.',
      icon: '📸',
    },
    {
      name: 'JSON Formatter',
      path: '/tools/json-formatter',
      desc: 'Validate, beautify, and format JSON data easily.',
      icon: '{ }',
    },
    {
      name: 'Password Generator',
      path: '/tools/password-generator',
      desc: 'Create strong and secure random passwords instantly.',
      icon: '🔑',
    },
    {
      name: 'Word Counter',
      path: '/tools/word-counter',
      desc: 'Count words, characters, and sentences in your text.',
      icon: '📝',
    },
    {
      name: 'Image Resizer',
      path: '/tools/image-resizer',
      desc: 'Resize images to specific dimensions (width & height).',
      icon: '↔️',
    },
    {
      name: 'Image Format Converter',
      path: '/tools/image-format-converter',
      desc: 'Convert images between PNG, JPG, WebP, and AVIF formats.',
      icon: '🔄',
    },
    {
      name: 'Image Cropper',
      path: '/tools/image-cropper',
      desc: 'Crop images with drag handles, aspect ratio presets, and live preview.',
      icon: '✂️',
    },
    {
      name: 'Favicon Generator',
      path: '/tools/favicon-generator',
      desc: 'Generate favicon.ico, PNG sizes, and web manifest in one ZIP package.',
      icon: '⭐',
    },
    {
      name: 'Background Remover',
      path: '/tools/background-remover',
      desc: 'Remove background from images automatically using AI.',
      icon: '🧼',
    },
    {
      name: 'Word to PDF',
      path: '/tools/word-to-pdf',
      desc: 'Convert Word documents to PDF files.',
      icon: '📄',
    },
    {
      name: 'Edit PDF',
      path: '/tools/edit-pdf',
      desc: 'Add text elements to your PDF using iLovePDF.',
      icon: '✏️',
    },
    {
      name: 'PDF Merge',
      path: '/tools/pdf-merge',
      desc: 'Merge multiple PDF files into one document.',
      icon: '🗂️',
    },
    {
      name: 'Youtube Downloader',
      path: '/tools/youtube-downloader',
      desc: 'Download YouTube videos in various formats.',
      icon: '⬇️',
    },
  ];

  const toolCount = tools.length;
  const toolNames = tools.map((tool) => tool.name).join(', ');
  const aboutBlogs = [
    {
      title: 'How to compress PDF files without losing clarity',
      excerpt:
        'Shrink large PDF documents for email, forms, and uploads while keeping the pages easy to read.',
      image: '/images/blog-pdf-compress.svg',
      href: '/tools/pdf-compressor',
    },
    {
      title: 'Convert image collections into a clean PDF in minutes',
      excerpt:
        'Turn JPG and PNG files into one organized PDF document for sharing, printing, or storage.',
      image: '/images/blog-image-pdf.svg',
      href: '/tools/image-to-pdf',
    },
    {
      title: 'Edit PDF sections with a faster visual workflow',
      excerpt:
        'Update text, add new blocks, and prepare a polished export from one focused editing screen.',
      image: '/images/blog-edit-pdf.svg',
      href: '/tools/edit-pdf',
    },
    {
      title: 'Find and save YouTube media from one simple page',
      excerpt:
        'Paste a video link, review the available media options, and move quickly to the format you need.',
      image: '/images/blog-youtube-download.svg',
      href: '/tools/youtube-downloader',
    },
  ];
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

  const visibleTools = useMemo(() => {
    if (!normalizedQuery) {
      return tools;
    }

    const scoreTool = (tool: Tool) => {
      const name = tool.name.toLowerCase();
      const desc = tool.desc.toLowerCase();

      if (name.startsWith(normalizedQuery)) return 3;
      if (name.includes(normalizedQuery)) return 2;
      if (desc.includes(normalizedQuery)) return 1;
      return 0;
    };

    return [...tools]
      .map((tool) => ({ tool, score: scoreTool(tool) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
      .map(({ tool }) => tool);
  }, [normalizedQuery, tools]);

  const faqItems = [
    {
      question: 'Is MyToolsHub free to use?',
      answer:
        'Yes. All tools are free to use with no signup requirement for standard usage.',
    },
    {
      question: 'Do I need to install any software?',
      answer:
        'No. All tools run directly in your browser, so you do not need to install anything.',
    },
    {
      question: 'Can I use these tools on mobile devices?',
      answer:
        'Yes. MyToolsHub tools are accessible on desktop and mobile browsers.',
    },
    {
      question: 'Are my files stored permanently?',
      answer:
        'No. Files are processed for the task and are not intended for permanent storage on the platform.',
    },
    {
      question: 'Which tasks can I complete on MyToolsHub?',
      answer:
        'You can compress files, convert documents, merge PDFs, generate QR codes, format JSON, and use many other utility tools.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="bg-slate-50 font-sans text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-400 text-lg font-black text-white shadow-lg shadow-blue-200">
                MT
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight text-slate-900">
                  MyTools<span className="text-blue-600">Hub</span>
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Utility Workspace
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={scrollToTop}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Home
              </button>
              <a
                href="#about"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                About
              </a>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsToolsMenuOpen((prev) => !prev)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  All Tools
                </button>
                {isToolsMenuOpen ? (
                  <div className="absolute right-0 top-12 max-h-96 w-72 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
                    <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                      Open Any Tool
                    </div>
                    <div className="grid gap-1">
                      {tools.map((tool) => (
                        <Link
                          key={tool.path}
                          href={tool.path}
                          onClick={() => setIsToolsMenuOpen(false)}
                          className="rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {toolCount}+ Free Tools
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pb-3 md:hidden">
            <button
              type="button"
              onClick={scrollToTop}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Home
            </button>
            <a
              href="#about"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              About
            </a>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsToolsMenuOpen((prev) => !prev)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                All Tools
              </button>
              {isToolsMenuOpen ? (
                <div className="absolute left-1/2 top-12 z-50 max-h-96 w-72 -translate-x-1/2 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
                  <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Open Any Tool
                  </div>
                  <div className="grid gap-1">
                    {tools.map((tool) => (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        onClick={() => setIsToolsMenuOpen(false)}
                        className="rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
                ) : null}
            </div>
            <div className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {toolCount}+ Free Tools
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.30),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.34),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.26),_transparent_30%),linear-gradient(135deg,_#dbe8ff_0%,_#cfd9ff_42%,_#d9f3ff_100%)] px-4 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-10 top-10 h-36 w-36 rounded-full bg-blue-400/55 blur-3xl" />
          <div className="absolute right-10 top-16 h-48 w-48 rounded-full bg-indigo-400/55 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-40 w-40 rounded-full bg-cyan-300/45 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Fast, useful, and ready in one place
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              A more polished home for your everyday online tools
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Compress files, convert documents, generate QR codes, clean images, and handle quick
              utility tasks from one professional workspace built for speed and clarity.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#tools"
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Explore All Tools
              </a>
              <div className="rounded-2xl border border-white/70 bg-white/75 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
                No signup, no clutter, just the tools you need.
              </div>
            </div>

              <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">{toolCount}+</p>
                <p className="mt-1 text-sm text-slate-500">Practical tools</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Free</p>
                <p className="mt-1 text-sm text-slate-500">No signup needed</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Quick</p>
                <p className="mt-1 text-sm text-slate-500">Simple workflows</p>
                </div>
              </div>
            </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#fbfdff_52%,_#f1f6ff_100%)] px-5 py-8 shadow-[0_30px_80px_-45px_rgba(37,99,235,0.38)] sm:px-8 lg:px-10 lg:py-10">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Tool Library
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Browse the full collection</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Open the tool you need, finish the task quickly, and move on without unnecessary
                clutter.
              </p>
            </div>
            <div className="w-full max-w-md">
              <label className="sr-only" htmlFor="tool-search">
                Search tools
              </label>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <input
                  id="tool-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any tool by name..."
                  className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTools.map((tool) => (
              <Link
                href={tool.path}
                key={tool.name}
                className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    {tool.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                      {tool.name}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{tool.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {normalizedQuery && visibleTools.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center text-sm text-slate-500">
              No tool matched "{deferredSearchQuery}". Try another name like `PDF`, `Image`, or
              `YouTube`.
            </div>
          ) : null}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fbff_46%,_#eef4ff_100%)] shadow-[0_30px_80px_-45px_rgba(37,99,235,0.45)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                About ToolsHub
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                One workspace for the online tasks you need most
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                MyToolsHub brings together practical tools for file conversion, compression,
                formatting, editing, downloading, and quick productivity work. Instead of opening
                different websites for every small task, you can handle everything from one clean
                place with a faster and more focused workflow.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">What You Can Do</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Compress files, convert Word documents and images into PDF, merge PDF files,
                    remove image backgrounds, clean logos, generate QR codes, format JSON, resize
                    images, count words, create passwords, edit PDFs, download YouTube media, and
                    save YouTube thumbnails in seconds.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Why It Helps</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    The platform is designed to save time, reduce clutter, and keep everyday tasks
                    simple. You get fast actions, easy navigation, professional layouts, and tools
                    that are ready to use without unnecessary complexity.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
                      Available Tools
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{toolCount}+</p>
                  </div>
                  <div className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200">
                    Daily Utility Suite
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{toolNames}</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl shadow-slate-200">
                <h3 className="text-xl font-semibold">Benefits Of Using ToolsHub</h3>
                <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-200">
                  <p>Fast access to multiple tools from one homepage.</p>
                  <p>Cleaner workflows for conversion, download, editing, and formatting tasks.</p>
                  <p>Professional white-theme interface that is easy to browse and use.</p>
                  <p>Helpful tool pages with clear instructions, benefits, and download guidance.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/80 px-6 py-8 lg:px-10 lg:py-10">
            <div className="mb-6 flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
                Guides & Ideas
              </p>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Explore practical ways to use ToolsHub
              </h3>
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                These quick guide cards highlight useful workflows across compression, conversion,
                editing, and downloading tasks.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {aboutBlogs.map((blog) => (
                <article
                  key={blog.title}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                  </div>

                  <div className="flex min-h-[250px] flex-col p-6">
                    <h4 className="text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900">
                      {blog.title}
                    </h4>
                    <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{blog.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">FAQs</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-6 grid gap-4">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </section>

      <footer className="border-t border-slate-200 bg-white py-8" />
    </main>
  );
}
