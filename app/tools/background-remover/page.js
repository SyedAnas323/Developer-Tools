// 'use client';
// import { useState } from 'react';
// import { removeBackground } from '@imgly/background-removal';

// export default function BackgroundRemover() {
//   const [loading, setLoading] = useState(false);
//   const [resultUrl, setResultUrl] = useState('');

//   const handleRemoveBg = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     try {
//       const blob = await removeBackground(file);
//       const url = URL.createObjectURL(blob);
//       setResultUrl(url);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white p-8 text-center">
//       <h1 className="text-3xl font-bold mb-6">Background Remover</h1>
//       <p className="mb-4 text-gray-300">Upload image, wait a few seconds...</p>
      
//       <input type="file" accept="image/*" onChange={handleRemoveBg} className="mb-4" />
      
//       {loading && <p className="text-xl text-yellow-400 animate-pulse">Processing... Please wait</p>}
      
//       {resultUrl && (
//         <div className="mt-6">
//           <img src={resultUrl} alt="Result" className="mx-auto max-w-md rounded shadow-lg" style={{ backgroundColor: 'white' }} />
//           <br />
//           <a href={resultUrl} download="no-bg.png" className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded">
//             Download
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

export default function BackgroundRemover() {
  return <div className="p-8 text-center">This tool is under maintenance.</div>
}