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





// 'use client';
// import { useState } from 'react';
// import { jsPDF } from 'jspdf';

// export default function ImageToPdf() {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleFiles = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);
//   };

//   // Improved Logic using Promises (Reliable)
//   const convertToPdf = async () => {
//     if (images.length === 0) return;
//     setLoading(true);

//     const doc = new jsPDF();
    
//     // Create promises for all images
//     const imagePromises = images.map((img, index) => {
//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           const imgData = event.target.result;
          
//           // Add new page for subsequent images
//           if (index > 0) doc.addPage();
          
//           // Add image to fit page width
//           doc.addImage(imgData, 'JPEG', 10, 10, 190, 0); // Auto height
//           resolve();
//         };
//         reader.readAsDataURL(img);
//       });
//     });

//     // Wait for all images to process
//     await Promise.all(imagePromises);
    
//     // Save PDF
//     doc.save('converted-images.pdf');
//     setLoading(false);
//   };

//   const removeImage = (indexToRemove) => {
//     setImages(images.filter((_, index) => index !== indexToRemove));
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 py-12 px-4">
//       <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Header */}
//         <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-orange-500 to-red-500">
//           <div className="inline-block p-3 bg-white/20 backdrop-blur rounded-full mb-4">
//             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-1">Image to PDF</h1>
//           <p className="text-orange-100 text-sm">Convert multiple images into a single PDF file</p>
//         </div>

//         <div className="p-8">
          
//           {/* Upload Area */}
//           <div className="relative">
//             <input 
//               type="file" 
//               multiple 
//               accept="image/*" 
//               onChange={handleFiles} 
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
//               id="imgToPdfInput" 
//             />
//             <label 
//               htmlFor="imgToPdfInput" 
//               className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors duration-300"
//             >
//               <svg className="w-12 h-12 mb-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
//               <p className="text-orange-600 font-semibold text-lg">Click to select Images</p>
//               <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP allowed</p>
//             </label>
//           </div>

//           {/* Image Previews */}
//           {images.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
//                 Selected Images ({images.length})
//               </h3>
//               <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
//                 {images.map((img, index) => (
//                   <div key={index} className="relative group">
//                     <img 
//                       src={URL.createObjectURL(img)} 
//                       alt={`preview ${index}`} 
//                       className="w-full h-24 object-cover rounded-lg shadow-sm border"
//                     />
//                     {/* Delete Button */}
//                     <button 
//                       onClick={() => removeImage(index)}
//                       className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
//                     >
//                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
//                     </button>
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                       {index + 1}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Download Button */}
//               <button 
//                 onClick={convertToPdf} 
//                 disabled={loading}
//                 className="mt-8 w-full bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition shadow-lg shadow-red-500/30 disabled:bg-gray-400 flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
//                     Download PDF
//                   </>
//                 )}
//               </button>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }