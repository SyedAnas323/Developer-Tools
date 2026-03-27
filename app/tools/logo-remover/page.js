
'use client';
import { useState, useRef, useEffect } from 'react';

export default function LogoRemover() {
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Ye function tab chalega jab image state update hogi
  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.src = image;
    img.onload = () => {
      // Canvas size set karo
      const maxWidth = 800;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Image draw karo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Eraser mode set karo
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 40; // Brush size
      ctx.strokeStyle = 'rgba(0,0,0,1)'; // Color for destination-out
    };
  }, [image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result); // Isse useEffect trigger hoga
    };
    reader.readAsDataURL(file);
  };

  // Mouse Events for Drawing
  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'logo-removed.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const clearCanvas = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 text-center">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Logo Remover</h1>
        <p className="text-gray-500 mb-6">Upload image and paint over the logo to erase it.</p>

        {/* Hidden Input */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
          ref={fileInputRef} 
          id="logoUpload"
        />

        {!image ? (
          // Upload Button
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 rounded-lg p-10 hover:border-blue-500 transition bg-blue-50/50 cursor-pointer"
          >
            <label htmlFor="logoUpload" className="text-blue-600 font-semibold text-lg cursor-pointer">
              Click to Upload Image
            </label>
          </div>
        ) : (
          // Canvas Area
          <div className="space-y-4">
            {/* Checkerboard Background for Transparency */}
            <div 
              className="inline-block border rounded shadow overflow-hidden relative cursor-crosshair"
              style={{ background: 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 16px 16px' }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                className="block" // 'block' to remove bottom spacing
              />
            </div>
            
            <div className="flex justify-center gap-4 pt-4">
              <button 
                onClick={downloadImage} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Download PNG
              </button>
              <button 
                onClick={clearCanvas} 
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}







