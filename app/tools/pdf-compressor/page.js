// 'use client';

// import { useState } from 'react';
// import { PDFDocument } from 'pdf-lib';

// export default function PdfCompressor() {
//   const [pdfInfo, setPdfInfo] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const compressPdf = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     const arrayBuffer = await file.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(arrayBuffer);

//     // Basic compression logic (removing duplicates etc. happens on save)
//     const compressedBytes = await pdfDoc.save();

//     // Create Blob for download
//     const blob = new Blob([compressedBytes], { type: 'application/pdf' });
//     const url = URL.createObjectURL(blob);

//     setPdfInfo({
//       name: file.name,
//       originalSize: (file.size / 1024).toFixed(2),
//       newSize: (compressedBytes.byteLength / 1024).toFixed(2),
//       downloadUrl: url
//     });
//     setLoading(false);
//   };

//   return (
//     <div className="p-10 text-center">
//       <h1 className="text-2xl font-bold mb-4">PDF Compressor</h1>
//       <input type="file" accept=".pdf" onChange={compressPdf} />
      
//       {loading && <p>Compressing...</p>}

//       {pdfInfo && (
//         <div className="mt-6 p-4 bg-green-100 rounded inline-block">
//           <p>Original: {pdfInfo.originalSize} KB</p>
//           <p>Compressed: {pdfInfo.newSize} KB</p>
//           <a href={pdfInfo.downloadUrl} download={`compressed_${pdfInfo.name}`} className="text-blue-600 underline block mt-2">
//             Download PDF
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }




'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfCompressor() {
  const [pdfInfo, setPdfInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(''); // File name show karne ke liye

  const compressPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setFileName(file.name); // File name set karein
    setPdfInfo(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Compression Logic
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfInfo({
        name: file.name,
        originalSize: (file.size / 1024 / 1024).toFixed(2),
        newSize: (compressedBytes.byteLength / 1024 / 1024).toFixed(2),
        downloadUrl: url
      });
    } catch (err) {
      console.error(err);
      alert('Error compressing PDF. Please try another file.');
    }
    setLoading(false);
  };

  return (
    // Main Background Light Grey
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      
      {/* White Card Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 text-center border-b border-gray-100">
          <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
             {/* PDF Icon */}
            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF Compressor</h1>
          <p className="text-gray-500">Reduce file size while keeping quality intact.</p>
        </div>

        {/* Upload Section */}
        <div className="p-8">
          <div className="relative">
            {/* Hidden Input */}
            <input 
              type="file" 
              accept=".pdf" 
              onChange={compressPdf} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              id="pdfInput" 
            />
            
            {/* Styled Upload Box */}
            <label 
              htmlFor="pdfInput" 
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300"
            >
              {loading ? (
                <div className="flex flex-col items-center">
                   {/* Spinner */}
                  <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-blue-600 font-semibold">Compressing...</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-4 text-lg text-gray-600">
                    <span className="text-blue-600 font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="mt-1 text-sm text-gray-400">PDF files only</p>
                </div>
              )}
            </label>
          </div>

          {/* Results Section */}
          {pdfInfo && (
            <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-100">
              <div className="flex justify-between items-center mb-4 text-center">
                <div className="w-2/5">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Original</p>
                  <p className="text-2xl font-bold text-gray-800">{pdfInfo.originalSize} MB</p>
                </div>
                
                <div className="w-1/5 flex justify-center text-green-500">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>

                <div className="w-2/5">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">New Size</p>
                  <p className="text-2xl font-bold text-green-600">{pdfInfo.newSize} MB</p>
                </div>
              </div>

              <p className="text-center text-green-700 font-medium mb-4 bg-green-100 py-2 rounded-lg">
                🎉 Saved {(pdfInfo.originalSize - pdfInfo.newSize).toFixed(2)} MB
              </p>
              
              <a 
                href={pdfInfo.downloadUrl} 
                download={`compressed_${pdfInfo.name}`} 
                className="flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Compressed PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}