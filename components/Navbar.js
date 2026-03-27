'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Tools ki list
  const tools = [
    { name: 'Image Compressor', path: '/tools/image-compressor' },
    { name: 'PDF Compressor', path: '/tools/pdf-compressor' },
    { name: 'QR Generator', path: '/tools/qr-generator' },
    { name: 'YouTube Thumbnail', path: '/tools/youtube-thumbnail' },
    { name: 'Image to PDF', path: '/tools/image-to-pdf' },
    { name: 'JSON Formatter', path: '/tools/json-formatter' },
    { name: 'Password Generator', path: '/tools/password-generator' },
    { name: 'Word Counter', path: '/tools/word-counter' },
    { name: 'Image Resizer', path: '/tools/image-resizer' },
    { name: 'Background Remover', path: '/tools/background-remover' },
    { name: 'Logo Remover', path: '/tools/logo-remover' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Home Link */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🛠️</span>
            <span className="text-xl font-bold text-gray-900">MyTools<span className="text-blue-600">Hub</span></span>
          </Link>

          {/* Desktop Menu (Visible on Large Screens) */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              Home
            </Link>

            {/* Dropdown for Tools */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 inline-flex items-center">
                All Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {/* Dropdown Content */}
              <div className="absolute right-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1 grid grid-cols-1">
                  {tools.map((tool) => (
                    <Link 
                      key={tool.name} 
                      href={tool.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Slide Down) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              Home
            </Link>
            {tools.map((tool) => (
              <Link 
                key={tool.name} 
                href={tool.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
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