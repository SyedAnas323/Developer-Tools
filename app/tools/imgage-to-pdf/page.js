// 'use client';
// import { useState } from 'react';
// import { jsPDF } from 'jspdf';

// export default function ImageToPdf() {
//   const [images, setImages] = useState([]);

//   const handleFiles = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);
//   };

//   const convertToPdf = () => {
//     if (images.length === 0) return;
//     const doc = new jsPDF();
    
//     images.forEach((img, index) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const imgData = event.target.result;
//         if (index > 0) doc.addPage();
//         doc.addImage(imgData, 'JPEG', 10, 10, 190, 0); // Auto height
//       };
//       reader.readAsDataURL(img);
//     });

//     // Delay to ensure images are processed
//     setTimeout(() => {
//       doc.save('converted-images.pdf');
//     }, 500);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 text-center">
//       <h1 className="text-3xl font-bold mb-6">Image to PDF Converter</h1>
//       <input type="file" multiple accept="image/*" onChange={handleFiles} className="mb-4 border p-2" />
      
//       {images.length > 0 && (
//         <div className="mb-4">
//           <p>{images.length} Images Selected</p>
//           <button onClick={convertToPdf} className="bg-orange-500 text-white px-6 py-2 rounded mt-4 hover:bg-orange-600">
//             Download PDF
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setLoading(true);
    
    const doc = new jsPDF();
    
    // Promise banaya hai taake sab images load hon
    const imagePromises = images.map((img, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgData = event.target.result;
          if (index > 0) doc.addPage();
          doc.addImage(imgData, 'JPEG', 10, 10, 190, 0);
          resolve();
        };
        reader.readAsDataURL(img);
      });
    });

    await Promise.all(imagePromises);
    doc.save('converted-images.pdf');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Image to PDF Converter</h1>
      <input type="file" multiple accept="image/*" onChange={handleFiles} className="mb-4 border p-2" />
      
      {images.length > 0 && (
        <div className="mb-4">
          <p>{images.length} Images Selected</p>
          <button onClick={convertToPdf} disabled={loading} className="bg-orange-500 text-white px-6 py-2 rounded mt-4 hover:bg-orange-600 disabled:bg-gray-400">
            {loading ? 'Creating PDF...' : 'Download PDF'}
          </button>
        </div>
      )}
    </div>
  );
}