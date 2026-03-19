'use client'; // Important: Client side processing ke liye

import { useState } from 'react';
import imageCompression from 'browser-image-compression';

export default function ImageCompressor() {
  const [compressedFile, setCompressedFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setOriginalSize((file.size / 1024).toFixed(2));

    const options = {
      maxSizeMB: 1, // Target size 1MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      setCompressedFile(new File([compressedBlob], file.name, { type: file.type }));
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Image Compressor</h1>
        <p className="text-gray-600 mb-6">Reduce image size without losing quality instantly.</p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 hover:bg-blue-50 transition">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer text-blue-600 font-semibold">
            {loading ? 'Processing...' : 'Click or Drag Image Here'}
          </label>
        </div>

        {/* Results */}
        {compressedFile && (
          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">Original Size: <b>{originalSize} KB</b></p>
            <p className="text-green-800">New Size: <b>{(compressedFile.size / 1024).toFixed(2)} KB</b></p>
            
            <a 
              href={URL.createObjectURL(compressedFile)} 
              download={compressedFile.name}
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Download Compressed Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}