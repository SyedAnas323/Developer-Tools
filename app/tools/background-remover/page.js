

// 'use client';
// import { useState } from 'react';

// export default function BackgroundRemover() {
//   const [loading, setLoading] = useState(false);
//   const [originalImage, setOriginalImage] = useState(null);
//   const [resultUrl, setResultUrl] = useState('');
//   const [error, setError] = useState('');

//   const handleRemoveBg = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Reset states
//     setLoading(true);
//     setError('');
//     setResultUrl('');
    
//     // Show original preview
//     const reader = new FileReader();
//     reader.onload = (ev) => setOriginalImage(ev.target.result);
//     reader.readAsDataURL(file);

//     try {
//       // DYNAMIC IMPORT: Library sirf browser mein load hogi
//       const { removeBackground } = await import('@imgly/background-removal');

//       // AI Background Removal
//       const blob = await removeBackground(file);
//       const url = URL.createObjectURL(blob);
//       setResultUrl(url);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to process image. Try a smaller image or check console.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 py-12 px-4">
//       <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Header */}
//         <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-purple-600 to-pink-500">
//           <div className="inline-block p-3 bg-white/20 backdrop-blur rounded-full mb-4">
//             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-1">Background Remover</h1>
//           <p className="text-purple-100 text-sm">100% Automatic AI Processing</p>
//         </div>

//         <div className="p-8">
//           {!resultUrl && !loading && (
//              <div className="relative">
//               <input 
//                 type="file" 
//                 accept="image/*" 
//                 onChange={handleRemoveBg} 
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
//                 id="bgRemoverInput" 
//               />
//               <label 
//                 htmlFor="bgRemoverInput" 
//                 className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-200 rounded-xl cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors duration-300"
//               >
//                 <svg className="w-10 h-10 mb-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
//                 <p className="text-purple-600 font-semibold text-lg">Upload Image</p>
//                 <p className="text-sm text-gray-400 mt-1">AI will remove background automatically</p>
//               </label>
//             </div>
//           )}

//           {loading && (
//             <div className="text-center py-16">
//               <div className="relative w-20 h-20 mx-auto mb-6">
//                 <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full"></div>
//                 <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2">Processing...</h3>
//               <p className="text-gray-500 text-sm">AI is analyzing your image. Please wait.</p>
              
//               {originalImage && (
//                 <div className="mt-6 opacity-50">
//                    <p className="text-xs text-gray-400 mb-2">Original Image</p>
//                    <img src={originalImage} className="max-h-32 mx-auto rounded" alt="Preview" />
//                 </div>
//               )}
//             </div>
//           )}

//           {error && (
//             <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
//               {error}
//             </div>
//           )}

//           {resultUrl && !loading && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center">
//                     <p className="text-xs font-bold text-gray-400 uppercase mb-2">Original</p>
//                     <img src={originalImage} className="rounded-lg shadow border mx-auto max-h-60 object-contain" alt="Original" />
//                 </div>
//                 <div className="text-center">
//                     <p className="text-xs font-bold text-gray-400 uppercase mb-2">Removed Background</p>
//                     {/* Checkerboard pattern for transparency */}
//                     <div className="rounded-lg shadow border inline-block mx-auto" style={{ background: 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 16px 16px' }}>
//                         <img src={resultUrl} className="max-h-60 rounded-lg object-contain" alt="Result" />
//                     </div>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <a 
//                   href={resultUrl} 
//                   download="no-background.png" 
//                   className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
//                   Download PNG
//                 </a>
                
//                 <button 
//                   onClick={() => { setResultUrl(''); setOriginalImage(null); }} 
//                   className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
//                 >
//                   Upload New
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }











// export default function BackgroundRemover() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
//       <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Background Remover</h1>
//         <p className="text-gray-600">This tool is currently under maintenance.</p>
//         <p className="text-sm text-gray-400 mt-2">Please check back later.</p>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState, useRef, useEffect } from 'react';

export default function BackgroundRemover() {
  const [image, setImage] = useState(null);
  const [brushSize, setBrushSize] = useState(50);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const fileInputRef = useRef(null);

  // Canvas Setup when image loads
  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const img = new Image();
    img.src = image;
    
    img.onload = () => {
      // Set canvas size to image size (but cap max width for UI)
      const maxWidth = 800;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Setup Eraser Tool
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      contextRef.current = ctx;
    };
  }, [image, brushSize]);

  // Drawing Logic
  let isDrawing = false;

  const startDrawing = (e) => {
    isDrawing = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing = false;
    if(contextRef.current) contextRef.current.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate mouse position relative to canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = contextRef.current;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'background-removed.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const reset = () => {
    setImage(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-purple-600 to-pink-500">
          <h1 className="text-3xl font-bold text-white mb-1">Background Remover</h1>
          <p className="text-purple-100 text-sm">Paint over the background to erase it</p>
        </div>

        <div className="p-8">
          {!image ? (
             <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                id="bgRemoverInput" 
              />
              <label 
                htmlFor="bgRemoverInput" 
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-200 rounded-xl cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors duration-300"
              >
                <svg className="w-10 h-10 mb-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-purple-600 font-semibold text-lg">Upload Image</p>
                <p className="text-xs text-gray-400 mt-1">No API Key needed</p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Brush Size:</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full md:w-32"
                  />
                  <span className="text-sm font-bold text-purple-600 w-12">{brushSize}px</span>
                </div>
                <div className="text-xs text-gray-400 hidden md:block">
                  * Paint on the image to erase pixels
                </div>
              </div>

              {/* Canvas Container */}
              <div 
                className="relative mx-auto border rounded-lg shadow-inner overflow-hidden bg-[length:20px_20px] bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_50%,#e5e7eb_50%,#e5e7eb_75%,transparent_75%,transparent)]"
                style={{ maxHeight: '500px', display: 'inline-block' }}
              >
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onMouseLeave={stopDrawing}
                  className="cursor-crosshair block max-w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3">
                <button 
                  onClick={downloadImage} 
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download PNG
                </button>
                <button 
                  onClick={reset} 
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Upload New Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




