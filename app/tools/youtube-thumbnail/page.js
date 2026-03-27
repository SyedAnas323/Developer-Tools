// 'use client';
// import { useState } from 'react';

// export default function YoutubeThumbnail() {
//   const [url, setUrl] = useState('');
//   const [thumbnails, setThumbnails] = useState(null);

//   const extractId = (url) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   const getThumbnail = () => {
//     const videoId = extractId(url);
//     if (videoId) {
//       setThumbnails({
//         max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
//         hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
//       });
//     } else {
//       alert('Invalid YouTube URL');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8 text-center">
//       <h1 className="text-3xl font-bold mb-6">YouTube Thumbnail Downloader</h1>
//       <div className="max-w-md mx-auto flex gap-2">
//         <input 
//           type="text" 
//           placeholder="Paste YouTube URL here..." 
//           onChange={(e) => setUrl(e.target.value)}
//           className="flex-1 p-3 rounded text-black"
//         />
//         <button onClick={getThumbnail} className="bg-red-600 px-6 py-3 rounded font-bold hover:bg-red-700">Get</button>
//       </div>

//       {thumbnails && (
//         <div className="mt-8 space-y-4">
//           <h3 className="text-xl">Max Resolution:</h3>
//           <img src={thumbnails.max} alt="Thumbnail" className="mx-auto rounded shadow-lg" />
//           <a href={thumbnails.max} download target="_blank" rel="noreferrer" className="inline-block bg-blue-600 px-6 py-2 rounded mt-2 hover:bg-blue-700">
//             Download Image
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }




'use client';
import { useState } from 'react';

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState(null);
  const [error, setError] = useState('');

  const extractId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnail = () => {
    const videoId = extractId(url);
    if (videoId) {
      setError('');
      setThumbnails({
        max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      });
    } else {
      setError('Invalid YouTube URL. Please paste a valid link.');
      setThumbnails(null);
    }
  };

  return (
    // Light Background with Subtle Pattern
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      
      {/* Main White Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-red-500 to-red-600">
          <div className="inline-block p-3 bg-white/20 backdrop-blur rounded-full mb-4">
             {/* YouTube Icon */}
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Thumbnail Downloader</h1>
          <p className="text-red-100 text-sm">Download high-quality thumbnails from any video</p>
        </div>

        {/* Input Section */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Paste YouTube URL here (e.g. https://youtube.com/watch?v=...)" 
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-4 rounded-xl border border-gray-200 text-gray-800 text-base outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            <button 
              onClick={getThumbnail} 
              className="bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              Get HD
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}

          {/* Results Section */}
          {thumbnails && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Preview</h3>
              
              {/* Image Container with Film Strip Effect */}
              <div className="relative bg-gray-800 p-2 rounded-xl shadow-inner">
                <img 
                    src={thumbnails.max} 
                    alt="YouTube Thumbnail" 
                    className="w-full rounded-lg shadow-md mx-auto" 
                />
              </div>

              {/* Download Options */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* HD Download */}
                 <a 
                    href={thumbnails.max} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
                  >
                    <span>Max Quality</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </a>

                  {/* SD Download */}
                  <a 
                    href={thumbnails.sd} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    <span>Standard</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </a>

                  {/* HQ Download */}
                  <a 
                    href={thumbnails.hq} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    <span>High Quality</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </a>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">Right click on image and "Save As" to download</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}