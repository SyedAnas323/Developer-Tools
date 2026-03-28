'use client';
import { useState } from 'react';

export default function ImageResizer() {
  const [image, setImage] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [resizedUrl, setResizedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.src = ev.target.result;
        img.onload = () => {
          // Set preview and auto-fill dimensions
          setImage(ev.target.result);
          setWidth(img.width);
          setHeight(img.height);
          setOriginalDimensions({ w: img.width, h: img.height });
          setResizedUrl(''); // Reset previous result
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = () => {
    if (!image) return;
    setLoading(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.src = image;
    img.onload = () => {
      canvas.width = parseInt(width);
      canvas.height = parseInt(height);
      ctx.drawImage(img, 0, 0, parseInt(width), parseInt(height));
      setResizedUrl(canvas.toDataURL('image/jpeg'));
      setLoading(false);
    };
  };

  const resetAll = () => {
    setImage(null);
    setResizedUrl('');
    setWidth(500);
    setHeight(500);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="inline-block p-3 bg-white/20 backdrop-blur rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Image Resizer</h1>
          <p className="text-purple-100 text-sm">Resize your photos to exact dimensions instantly</p>
        </div>

        <div className="p-8">
          {/* Upload Area (Visible if no image) */}
          {!image ? (
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                id="imgResizeInput" 
              />
              <label 
                htmlFor="imgResizeInput" 
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
              >
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-lg text-gray-600"><span className="text-purple-600 font-semibold">Click to upload</span></p>
                <p className="text-sm text-gray-400">JPG, PNG, WEBP</p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Original Preview */}
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Original Preview</p>
                <div className="inline-block p-2 bg-gray-50 rounded-lg border">
                  <img src={image} alt="Original" className="max-h-40 rounded shadow-sm mx-auto" />
                </div>
                <p className="text-xs text-gray-500 mt-1">{originalDimensions.w} x {originalDimensions.h} px</p>
              </div>

              {/* Resize Controls */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Width:</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => setWidth(e.target.value)} 
                    className="w-24 p-2 border border-gray-200 rounded-lg text-center font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                
                <span className="text-2xl font-bold text-gray-300">×</span>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Height:</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)} 
                    className="w-24 p-2 border border-gray-200 rounded-lg text-center font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <span className="text-xs text-gray-400">Pixels (px)</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={resizeImage} 
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Resize Image'}
                </button>
                <button 
                  onClick={resetAll} 
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Upload New
                </button>
              </div>

              {/* Result */}
              {resizedUrl && (
                <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100">
                  <h3 className="text-center font-bold text-green-800 mb-3 text-sm uppercase tracking-wider">Resize Complete!</h3>
                  <div className="bg-white p-2 rounded-lg shadow-inner mb-4">
                    <img src={resizedUrl} alt="Resized" className="mx-auto rounded max-h-60" />
                  </div>
                  <a 
                    href={resizedUrl} 
                    download="resized-image.jpg" 
                    className="flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Image
                  </a>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}