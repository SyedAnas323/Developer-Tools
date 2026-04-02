// 'use client';

// import { useState } from 'react';

// export default function PdfWordConverter() {
//   const [file, setFile] = useState(null);
//   const [mode, setMode] = useState('pdf-to-word'); // 'pdf-to-word' ya 'word-to-pdf'
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (selected) {
//       // Check file type
//       const validTypes = mode === 'pdf-to-word' 
//         ? ['application/pdf'] 
//         : ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      
//       if (!validTypes.includes(selected.type)) {
//         alert(mode === 'pdf-to-word' ? 'Please select PDF file' : 'Please select Word file');
//         return;
//       }
//       setFile(selected);
//       setDownloadUrl(null);
//     }
//   };

//   const handleConvert = async () => {
//     if (!file) return;

//     setLoading(true);

//     const paths = ['/api/convert', '/api/removebg/convert'];
//     let res = null;
//     let errorData = null;

//     try {
//       for (const path of paths) {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('mode', mode);

//         res = await fetch(path, {
//           method: 'POST',
//           body: formData,
//         });

//         if (res.ok) break;
        
//       if (!res.ok) {
//         try {
//           errorData = await res.json();
//         } catch (e) {
//           errorData = { error: res.statusText };
//         }
//       }
//       }

//       if (!res || !res.ok) {
//         const errorMsg = errorData?.error || errorData?.message || 'Conversion failed';
//         throw new Error(errorMsg);
//       }

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       setDownloadUrl(url);
//     } catch (err) {
//       console.error('Conversion error:', err);
//       alert('Conversion failed: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-2">PDF ↔ Word Converter</h1>
//       <p className="text-gray-600 mb-6">Convert PDF to Word or Word to PDF easily</p>

//       {/* Mode Toggle */}
//       <div className="flex gap-4 mb-6 bg-gray-100 p-1 rounded-lg">
//         <button
//           onClick={() => { setMode('pdf-to-word'); setFile(null); setDownloadUrl(null); }}
//           className={`flex-1 py-2 px-4 rounded-md transition ${
//             mode === 'pdf-to-word' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
//           }`}
//         >
//           PDF to Word
//         </button>
//         <button
//           onClick={() => { setMode('word-to-pdf'); setFile(null); setDownloadUrl(null); }}
//           className={`flex-1 py-2 px-4 rounded-md transition ${
//             mode === 'word-to-pdf' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
//           }`}
//         >
//           Word to PDF
//         </button>
//       </div>

//       {/* File Upload */}
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-500 transition">
//         <input
//           type="file"
//           accept={mode === 'pdf-to-word' ? '.pdf' : '.doc,.docx'}
//           onChange={handleFileChange}
//           className="hidden"
//           id="file-input"
//         />
//         <label htmlFor="file-input" className="cursor-pointer">
//           <div className="text-4xl mb-2">📄</div>
//           <p className="text-gray-600">
//             {file ? file.name : `Click to select ${mode === 'pdf-to-word' ? 'PDF' : 'Word'} file`}
//           </p>
//         </label>
//       </div>

//       {/* Convert Button */}
//       <button
//         onClick={handleConvert}
//         disabled={!file || loading}
//         className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-blue-700 transition"
//       >
//         {loading ? 'Converting...' : 'Convert Now'}
//       </button>

//       {/* Download Button */}
//       {downloadUrl && (
//         <a
//           href={downloadUrl}
//           download={mode === 'pdf-to-word' ? 'converted.docx' : 'converted.pdf'}
//           className="block w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition"
//         >
//           ⬇ Download File
//         </a>
//       )}
//     </div>
//   );
// }


'use client';

import { useState } from 'react';

export default function WordToPdfConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError('');

    if (selected) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

      if (!validTypes.includes(selected.type)) {
        setError('Please select a Word file');
        return;
      }

      if (selected.size > 50 * 1024 * 1024) {
        setError('File size too large. Max 50MB allowed.');
        return;
      }

      setFile(selected);
      setDownloadUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'word-to-pdf');

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errData = await res.json();
          throw new Error(errData.error || 'Conversion failed');
        }
        const errText = await res.text();
        throw new Error(errText || 'Conversion failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl p-8 bg-white shadow-none rounded-xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Word → PDF Converter</h1>
        <p className="text-gray-600 mb-6">Convert your Word documents to PDF online for free</p>

        {error && (
          <div className="bg-white border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-gray-400 transition cursor-pointer bg-white">
          <input
            type="file"
            accept=".doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer block">
            <div className="text-5xl mb-2">📄</div>
            <p className="text-gray-700 font-medium">
              {file ? file.name : 'Click to select Word file'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Max file size: 50MB</p>
          </label>
        </div>

        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-blue-700 transition"
        >
          {loading ? 'Converting...' : 'Convert Now'}
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download="converted.pdf"
            className="block w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition"
          >
            ⬇ Download PDF
          </a>
        )}
      </div>
    </div>
  );
}
