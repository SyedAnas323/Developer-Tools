// 'use client';
// import { useState } from 'react';

// export default function WordCounter() {
//   const [text, setText] = useState('');

//   const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
//   const charCount = text.length;

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-3xl font-bold text-center mb-6">Word & Character Counter</h1>
      
//       <div className="max-w-3xl mx-auto">
//         <textarea 
//           className="w-full h-64 p-4 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 text-lg"
//           placeholder="Start typing or paste your text here..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
        
//         <div className="flex justify-around mt-6 bg-white p-4 rounded shadow">
//           <div className="text-center">
//             <p className="text-4xl font-bold text-blue-600">{wordCount}</p>
//             <p className="text-gray-500">Words</p>
//           </div>
//           <div className="text-center">
//             <p className="text-4xl font-bold text-green-600">{charCount}</p>
//             <p className="text-gray-500">Characters</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';
import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  // Calculations
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  // Sentence count: splitting by . ? !
  const sentenceCount = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  // Paragraph count: splitting by line breaks
  const paragraphCount = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;

  const clearText = () => setText('');

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-cyan-500 to-blue-600">
          <div className="inline-block p-3 bg-white/20 backdrop-blur rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Word Counter</h1>
          <p className="text-blue-100 text-sm">Analyze your text in real-time</p>
        </div>

        <div className="p-8">
          {/* Textarea */}
          <div className="relative">
            <textarea 
              className="w-full h-80 p-6 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg text-gray-700 resize-none transition"
              placeholder="Start typing or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {text && (
              <button 
                onClick={clearText}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                title="Clear Text"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            
            {/* Words */}
            <div className="bg-blue-50 p-5 rounded-xl text-center border border-blue-100 hover:shadow-md transition">
              <p className="text-4xl font-extrabold text-blue-600 mb-1">{wordCount}</p>
              <p className="text-gray-600 font-medium text-sm">Words</p>
            </div>

            {/* Characters */}
            <div className="bg-green-50 p-5 rounded-xl text-center border border-green-100 hover:shadow-md transition">
              <p className="text-4xl font-extrabold text-green-600 mb-1">{charCount}</p>
              <p className="text-gray-600 font-medium text-sm">Characters</p>
            </div>

            {/* Sentences */}
            <div className="bg-purple-50 p-5 rounded-xl text-center border border-purple-100 hover:shadow-md transition">
              <p className="text-4xl font-extrabold text-purple-600 mb-1">{sentenceCount}</p>
              <p className="text-gray-600 font-medium text-sm">Sentences</p>
            </div>

            {/* Paragraphs */}
            <div className="bg-orange-50 p-5 rounded-xl text-center border border-orange-100 hover:shadow-md transition">
              <p className="text-4xl font-extrabold text-orange-600 mb-1">{paragraphCount}</p>
              <p className="text-gray-600 font-medium text-sm">Paragraphs</p>
            </div>

          </div>

          {/* Footer Info */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Approximate reading time: {Math.ceil(wordCount / 200)} min
          </p>
        </div>
      </div>
    </div>
  );
}