'use client';
import { useState } from 'react';

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState(null);

  const extractId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnail = () => {
    const videoId = extractId(url);
    if (videoId) {
      setThumbnails({
        max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      });
    } else {
      alert('Invalid YouTube URL');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">YouTube Thumbnail Downloader</h1>
      <div className="max-w-md mx-auto flex gap-2">
        <input 
          type="text" 
          placeholder="Paste YouTube URL here..." 
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-3 rounded text-black"
        />
        <button onClick={getThumbnail} className="bg-red-600 px-6 py-3 rounded font-bold hover:bg-red-700">Get</button>
      </div>

      {thumbnails && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl">Max Resolution:</h3>
          <img src={thumbnails.max} alt="Thumbnail" className="mx-auto rounded shadow-lg" />
          <a href={thumbnails.max} download target="_blank" rel="noreferrer" className="inline-block bg-blue-600 px-6 py-2 rounded mt-2 hover:bg-blue-700">
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}