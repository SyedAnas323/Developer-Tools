// // 

// 'use client';

// import { useState } from 'react';
// import { QRCodeSVG } from 'qrcode.react';

// export default function QRGenerator() {
//   const [text, setText] = useState('');

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
//       <h1 className="text-4xl font-bold mb-8">QR Code Generator</h1>
      
//       <input 
//         type="text"
//         placeholder="Enter URL or Text..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         // YAHAN changes kiye hain: bg-gray-800 aur placeholder-white
//         className="p-4 w-full max-w-md rounded-lg bg-gray-800 text-white placeholder-white text-lg outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
//       />

//       {/* QR Code Display */}
//       <div className="mt-8 bg-white p-4 rounded-lg shadow-lg">
//         {text ? (
//           <QRCodeSVG value={text} size={200} />
//         ) : (
//           <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-400">
//             Waiting for input...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








'use client';

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Canvas use karne se download karna asaan hota hai

export default function QRGenerator() {
  const [text, setText] = useState('');
  const canvasRef = useRef(null);

  // Download Function
  const downloadQR = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'qrcode.png'; // File name
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    // Gradient Background (Image wali tarah)
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 flex flex-col items-center justify-center">
      
      {/* White Card Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center transition-all duration-300 hover:scale-[1.01]">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Code Generator</h1>
        <p className="text-gray-500 mb-6">Generate your QR code instantly</p>

        {/* Input Field */}
        <input 
          type="text"
          placeholder="Enter URL or Text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-4 w-full rounded-xl border border-gray-200 text-gray-800 text-lg outline-none focus:ring-2 focus:ring-blue-500 transition mb-6"
        />

        {/* QR Code Display Area */}
        <div className="flex justify-center mb-6">
          <div 
            ref={canvasRef} 
            className={`p-4 rounded-xl inline-block transition-all duration-300 ${text ? 'bg-white border shadow-sm' : 'bg-gray-50 border-dashed border-2 border-gray-200'}`}
          >
            {text ? (
              <QRCodeCanvas 
                value={text} 
                size={180} 
                bgColor={"#ffffff"} 
                fgColor={"#000000"} 
                level={"H"} // High quality
                includeMargin={false} 
              />
            ) : (
              <div className="w-[180px] h-[180px] flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg>
                <span className="text-sm font-medium">Waiting for input...</span>
              </div>
            )}
          </div>
        </div>

        {/* Download Button (Sirf tab dikhega jab text hoga) */}
        {text && (
          <button 
            onClick={downloadQR}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download QR Code
          </button>
        )}
        
      </div>
    </div>
  );
}