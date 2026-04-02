// // // app/page.tsx
// import Link from 'next/link';

// export default function Home() {
//   // Tools ki list
//   const tools = [
//     { name: 'Image Compressor', 
//       path: '/tools/image-compressor', 
//       desc: 'Compress images without losing quality.' 
//     },
//     { name: 'PDF Compressor', 
//       path: '/tools/pdf-compressor', 
//       desc: 'Reduce PDF file size online.' 
//     },
//     { name: 'QR Code Generator', 
//       path: '/tools/qr-generator', 
//       desc: 'Create QR codes for URLs instantly.' 
//     },

//       { 
//       name: 'Image Compressor', 
//       path: '/tools/image-compressor', 
//       desc: 'Reduce image file size without losing quality.' 
//     },
//     { 
//       name: 'PDF Compressor', 
//       path: '/tools/pdf-compressor', 
//       desc: 'Compress PDF files to make them smaller for email.' 
//     },
//     { 
//       name: 'QR Code Generator', 
//       path: '/tools/qr-generator', 
//       desc: 'Create QR codes for URLs, text, or WiFi instantly.' 
//     },
//     { 
//       name: 'YouTube Thumbnail', 
//       path: '/tools/youtube-thumbnail', 
//       desc: 'Download high-quality thumbnails from any YouTube video.' 
//     },
//     { 
//       name: 'Image to PDF', 
//       path: '/tools/image-to-pdf', 
//       desc: 'Convert JPG and PNG images into a single PDF file.' 
//     },
//     { 
//       name: 'JSON Formatter', 
//       path: '/tools/json-formatter', 
//       desc: 'Validate, beautify, and format JSON data easily.' 
//     },
//     { 
//       name: 'Password Generator', 
//       path: '/tools/password-generator', 
//       desc: 'Create strong and secure random passwords instantly.' 
//     },
//     { 
//       name: 'Word Counter', 
//       path: '/tools/word-counter', 
//       desc: 'Count words, characters, and sentences in your text.' 
//     },
//     { 
//       name: 'Image Resizer', 
//       path: '/tools/image-resizer', 
//       desc: 'Resize images to specific dimensions (width & height).' 
//     },
//     { 
//       name: 'Background Remover', 
//       path: '/tools/background-remover', 
//       desc: 'Remove background from images automatically using AI.' 
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">
//           My MicroSaaS Tools
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Select a tool below to get started.
//         </p>

//         {/* Tools ki Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {tools.map((tool) => (
//             <Link 
//               href={tool.path} 
//               key={tool.name}
//               className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200"
//             >
//               <h2 className="text-2xl font-semibold text-blue-600 mb-2">{tool.name}</h2>
//               <p className="text-gray-500">{tool.desc}</p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }


// app/page.tsx
import Link from 'next/link';

export default function Home() {
  // Cleaned Tools List with Icons
  const tools = [
    { 
      name: 'Image Compressor', 
      path: '/tools/image-compressor', 
      desc: 'Reduce image file size without losing quality.', 
      icon: '🖼️' 
    },
    { 
      name: 'PDF Compressor', 
      path: '/tools/pdf-compressor', 
      desc: 'Compress PDF files to make them smaller for email.', 
      icon: '📄' 
    },
    { 
      name: 'QR Code Generator', 
      path: '/tools/qr-generator', 
      desc: 'Create QR codes for URLs, text, or WiFi instantly.', 
      icon: '📱' 
    },
    { 
      name: 'YouTube Thumbnail', 
      path: '/tools/youtube-thumbnail', 
      desc: 'Download high-quality thumbnails from any YouTube video.', 
      icon: '▶️' 
    },
    { 
      name: 'Image to PDF', 
      path: '/tools/image-to-pdf', 
      desc: 'Convert JPG and PNG images into a single PDF file.', 
      icon: '📸' 
    },
    { 
      name: 'JSON Formatter', 
      path: '/tools/json-formatter', 
      desc: 'Validate, beautify, and format JSON data easily.', 
      icon: '{ }' 
    },
    { 
      name: 'Password Generator', 
      path: '/tools/password-generator', 
      desc: 'Create strong and secure random passwords instantly.', 
      icon: '🔑' 
    },
    { 
      name: 'Word Counter', 
      path: '/tools/word-counter', 
      desc: 'Count words, characters, and sentences in your text.', 
      icon: '📝' 
    },
    { 
      name: 'Image Resizer', 
      path: '/tools/image-resizer', 
      desc: 'Resize images to specific dimensions (width & height).', 
      icon: '↔️' 
    },
    { 
      name: 'Background Remover', 
      path: '/tools/background-remover', 
      desc: 'Remove background from images automatically using AI.', 
      icon: '✂️' 
    },
        { 
      name: 'Logo Remover', 
      path: '/tools/logo-remover', 
      desc: 'Erase logos and watermarks from images instantly.', 
      icon: '🎨' 
    },
     { 
      name: 'Word to PDF', 
      path: '/tools/word-to-pdf', 
      desc: 'Convert Word documents to PDF files.', 
      icon: '📄' 
    },
    {
      name: 'Edit PDF',
      path: '/tools/edit-pdf',
      desc: 'Add text elements to your PDF using iLovePDF.',
      icon: 'Edit'
    },
      { 
      name: 'Youtube Downloader', 
      path: '/tools/youtube-downloader', 
      desc: 'Download YouTube videos in various formats.', 
      icon: '▶️' 
    },
  ];

  return (
    <main className="bg-slate-50 font-sans">
      
      {/* 1. Professional Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              <span className="text-xl font-bold text-gray-900">MyTools<span className="text-blue-600">Hub</span></span>
            </div>
            {/* <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <span>Made with Next.js</span>
            </div> */}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
           Online Developer Tools
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
          Boost your productivity with our collection of free, fast, and secure tools. No signup required.
        </p>
      </div>

      {/* 3. Tools Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10">
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link 
              href={tool.path} 
              key={tool.name}
              className="group relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400"
            >
              <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl group-hover:bg-blue-600 transition-colors duration-300">
                  {tool.icon}
                </div>
                
                {/* Text Content */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
              
              {/* Arrow Indicator (Visible on Hover) */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        {/* <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} MyToolsHub. All rights reserved. Built for Speed.</p>
        </div> */}
      </footer>

    </main>
  );
}
