'use client';
import { useState } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError('Invalid JSON format!');
      setOutput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">JSON Formatter</h1>
      <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
        <div>
          <h3 className="mb-2 font-semibold">Input JSON:</h3>
          <textarea 
            className="w-full h-96 p-4 border font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "John", "age": 30}'
          />
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Formatted Output:</h3>
          <textarea 
            className="w-full h-96 p-4 border font-mono text-sm bg-green-50"
            value={output}
            readOnly
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      <div className="text-center mt-4">
        <button onClick={formatJson} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700">
          Format / Validate
        </button>
      </div>
    </div>
  );
}