'use client';
import { useState } from 'react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState('');

  const generate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-indigo-900 text-white p-8 text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Password Generator</h1>
      
      <div className="bg-white text-black p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between mb-4">
          <label>Length: {length}</label>
          <input type="range" min="6" max="32" value={length} onChange={(e) => setLength(e.target.value)} />
        </div>
        
        <button onClick={generate} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 mb-4">
          Generate Password
        </button>

        {password && (
          <div className="p-4 bg-gray-100 rounded font-mono text-lg break-all">
            {password}
          </div>
        )}
      </div>
    </div>
  );
}