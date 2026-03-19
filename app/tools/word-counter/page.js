'use client';
import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Word & Character Counter</h1>
      
      <div className="max-w-3xl mx-auto">
        <textarea 
          className="w-full h-64 p-4 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 text-lg"
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="flex justify-around mt-6 bg-white p-4 rounded shadow">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{wordCount}</p>
            <p className="text-gray-500">Words</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{charCount}</p>
            <p className="text-gray-500">Characters</p>
          </div>
        </div>
      </div>
    </div>
  );
}