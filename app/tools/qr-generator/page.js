'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRGenerator() {
  const [text, setText] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">QR Code Generator</h1>
      
      <input 
        type="text"
        placeholder="Enter URL or Text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-4 w-full max-w-md rounded-lg text-black text-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* QR Code Display */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow-lg">
        {text ? (
          <QRCodeSVG value={text} size={200} />
        ) : (
          <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-400">
            Waiting for input...
          </div>
        )}
      </div>
    </div>
  );
}