'use client';
import { useState } from 'react';

export default function ImageResizer() {
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [resizedUrl, setResizedUrl] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.src = image;
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      setResizedUrl(canvas.toDataURL('image/jpeg'));
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Image Resizer</h1>
      
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      
      {image && (
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <div>
              <label>Width:</label>
              <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="border p-1 w-20 ml-2" />
            </div>
            <div>
              <label>Height:</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="border p-1 w-20 ml-2" />
            </div>
          </div>
          
          <button onClick={resizeImage} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
            Resize Image
          </button>
        </div>
      )}

      {resizedUrl && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Resized Image:</h3>
          <img src={resizedUrl} alt="Resized" className="mx-auto border shadow" />
          <a href={resizedUrl} download="resized-image.jpg" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Download
          </a>
        </div>
      )}
    </div>
  );
}