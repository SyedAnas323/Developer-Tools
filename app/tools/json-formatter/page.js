// 'use client';
// import { useState } from 'react';

// export default function JsonFormatter() {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');

//   const formatJson = () => {
//     try {
//       const parsed = JSON.parse(input);
//       setOutput(JSON.stringify(parsed, null, 2));
//       setError('');
//     } catch (e) {
//       setError('Invalid JSON format!');
//       setOutput('');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <h1 className="text-3xl font-bold text-center mb-6">JSON Formatter</h1>
//       <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
//         <div>
//           <h3 className="mb-2 font-semibold">Input JSON:</h3>
//           <textarea 
//             className="w-full h-96 p-4 border font-mono text-sm"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder='{"name": "John", "age": 30}'
//           />
//         </div>
//         <div>
//           <h3 className="mb-2 font-semibold">Formatted Output:</h3>
//           <textarea 
//             className="w-full h-96 p-4 border font-mono text-sm bg-green-50"
//             value={output}
//             readOnly
//           />
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </div>
//       </div>
//       <div className="text-center mt-4">
//         <button onClick={formatJson} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700">
//           Format / Validate
//         </button>
//       </div>
//     </div>
//   );
// }









'use client';
import { useState } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError('Invalid JSON format! Please check your syntax.');
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError('Invalid JSON format!');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 text-center">
          <div className="inline-block p-3 bg-blue-50 rounded-full mb-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">JSON Formatter</h1>
          <p className="text-gray-500 text-sm mt-1">Validate, beautify, and format your JSON data instantly</p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-center gap-3">
          <button 
            onClick={formatJson} 
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Format
          </button>
          <button 
            onClick={minifyJson} 
            className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition shadow-sm"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
            Minify
          </button>
          <button 
            onClick={clearAll} 
            className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Clear
          </button>
        </div>

        {/* Editors Grid */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Input Side */}
          <div className="relative p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Input</span>
              <span className="text-xs text-gray-400">Paste your JSON here</span>
            </div>
            <textarea 
              className="w-full h-[400px] p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none border border-gray-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "John", "age": 30}'
              spellCheck="false"
            />
          </div>

          {/* Output Side */}
          <div className="relative p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Output</span>
              {output && (
                <button onClick={copyToClipboard} className="text-xs text-blue-600 font-medium hover:underline">
                  {copied ? '✅ Copied!' : '📋 Copy Output'}
                </button>
              )}
            </div>
            
            {error ? (
              <div className="w-full h-[400px] p-4 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-red-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="text-red-600 font-semibold">{error}</p>
                </div>
              </div>
            ) : (
              <textarea 
                className="w-full h-[400px] p-4 bg-gray-800 text-gray-100 font-mono text-sm rounded-lg outline-none resize-none border border-gray-700"
                value={output}
                readOnly
                placeholder="Formatted result will appear here..."
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}