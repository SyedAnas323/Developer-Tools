'use client';

import Link from 'next/link';
import { useState } from 'react';

const tools = [
  { name: 'Image Compressor', path: '/tools/image-compressor' },
  { name: 'PDF Compressor', path: '/tools/pdf-compressor' },
  { name: 'QR Code Generator', path: '/tools/qr-generator' },
  { name: 'YouTube Thumbnail', path: '/tools/youtube-thumbnail' },
  { name: 'Image to PDF', path: '/tools/image-to-pdf' },
  { name: 'JSON Formatter', path: '/tools/json-formatter' },
  { name: 'Password Generator', path: '/tools/password-generator' },
  { name: 'Word Counter', path: '/tools/word-counter' },
  { name: 'Image Resizer', path: '/tools/image-resizer' },
  { name: 'Image Format Converter', path: '/tools/image-format-converter' },
  { name: 'Image Cropper', path: '/tools/image-cropper' },
  { name: 'Favicon Generator', path: '/tools/favicon-generator' },
  { name: 'Background Remover', path: '/tools/background-remover' },
  { name: 'Word to PDF', path: '/tools/word-to-pdf' },
  { name: 'Edit PDF', path: '/tools/edit-pdf' },
  { name: 'PDF Merge', path: '/tools/pdf-merge' },
  { name: 'Youtube Downloader', path: '/tools/youtube-downloader' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-400 text-base font-black text-white shadow-lg shadow-blue-200">
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
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Home
            </Link>

            <div className="relative group">
              <button className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                All Tools
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="invisible absolute right-0 top-12 z-50 max-h-96 w-72 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Open Any Tool
                </div>
                <div className="grid gap-1">
                  {tools.map((tool) => (
                    <Link
                      key={tool.path}
                      href={tool.path}
                      className="rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block rounded-2xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              Home
            </Link>

            {tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                onClick={() => setIsOpen(false)}
                className="block rounded-2xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
