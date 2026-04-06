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
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-3 text-3xl font-bold text-slate-900">Password Generator</h1>
        <p className="mb-8 text-sm text-slate-600">
          Generate a strong password instantly with a simple white-theme interface.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-5 flex items-center justify-between gap-4 text-slate-700">
            <label className="font-medium">Length: {length}</label>
            <input
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-40 accent-blue-600"
            />
          </div>
        
          <button onClick={generate} className="mb-4 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
            Generate Password
          </button>

          {password && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-lg break-all text-slate-900">
              {password}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
