'use client';

import { useState } from 'react';

const defaultElement = {
  text: 'Approved',
  pages: '1',
  coordinates: { x: 80, y: 80 },
  dimensions: { w: 220, h: 60 },
  rotation: 0,
  opacity: 100,
  text_align: 'left',
  font_family: 'Arial Unicode MS',
  font_size: 18,
  font_style: 'null',
  font_color: '#000000',
  letter_spacing: 0,
  underline_text: false,
};

export default function EditPdfPage() {
  const [file, setFile] = useState(null);
  const [element, setElement] = useState(defaultElement);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');

  const updateElement = (key, value) => {
    setElement((prev) => ({ ...prev, [key]: value }));
  };

  const updateNestedField = (group, key, value) => {
    setElement((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError('');
    setDownloadUrl(null);

    if (!selected) {
      return;
    }

    if (selected.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      setError('File size too large. Max 50MB allowed.');
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'elements',
      JSON.stringify([
        {
          type: 'text',
          ...element,
        },
      ])
    );

    try {
      const res = await fetch('/api/edit-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to edit PDF.');
        }

        throw new Error((await res.text()) || 'Failed to edit PDF.');
      }

      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit PDF</h1>
        <p className="text-slate-600 mb-8">
          Add text to your PDF using iLovePDF. This first version supports text elements only.
        </p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Upload PDF</h2>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-file-input"
              />
              <label htmlFor="pdf-file-input" className="cursor-pointer block">
                <div className="text-5xl mb-3">PDF</div>
                <p className="font-medium text-slate-700">
                  {file ? file.name : 'Click to select PDF file'}
                </p>
                <p className="text-sm text-slate-500 mt-1">Max file size: 50MB</p>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Text Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Text</label>
                <input
                  type="text"
                  value={element.text}
                  onChange={(e) => updateElement('text', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Page</label>
                  <input
                    type="text"
                    value={element.pages}
                    onChange={(e) => updateElement('pages', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Font Size</label>
                  <input
                    type="number"
                    value={element.font_size}
                    onChange={(e) => updateElement('font_size', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">X</label>
                  <input
                    type="number"
                    value={element.coordinates.x}
                    onChange={(e) => updateNestedField('coordinates', 'x', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Y</label>
                  <input
                    type="number"
                    value={element.coordinates.y}
                    onChange={(e) => updateNestedField('coordinates', 'y', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Width</label>
                  <input
                    type="number"
                    value={element.dimensions.w}
                    onChange={(e) => updateNestedField('dimensions', 'w', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Height</label>
                  <input
                    type="number"
                    value={element.dimensions.h}
                    onChange={(e) => updateNestedField('dimensions', 'h', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Opacity</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={element.opacity}
                    onChange={(e) => updateElement('opacity', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rotation</label>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={element.rotation}
                    onChange={(e) => updateElement('rotation', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Font Family</label>
                  <select
                    value={element.font_family}
                    onChange={(e) => updateElement('font_family', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option>Arial Unicode MS</option>
                    <option>Arial</option>
                    <option>Verdana</option>
                    <option>Courier</option>
                    <option>Times New Roman</option>
                    <option>Comic Sans MS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Text Align</label>
                  <select
                    value={element.text_align}
                    onChange={(e) => updateElement('text_align', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Font Style</label>
                  <select
                    value={element.font_style}
                    onChange={(e) => updateElement('font_style', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="null">Regular</option>
                    <option value="Bold">Bold</option>
                    <option value="Italic">Italic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Font Color</label>
                  <input
                    type="color"
                    value={element.font_color}
                    onChange={(e) => updateElement('font_color', e.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-300 px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold disabled:bg-slate-300 hover:bg-blue-700 transition"
          >
            {loading ? 'Editing PDF...' : 'Edit PDF Now'}
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download="edited.pdf"
              className="w-full rounded-lg bg-green-600 text-white py-3 font-semibold text-center hover:bg-green-700 transition"
            >
              Download Edited PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
