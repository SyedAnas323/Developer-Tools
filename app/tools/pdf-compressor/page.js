'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfCompressor() {
  const [pdfInfo, setPdfInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const compressPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Basic compression logic (removing duplicates etc. happens on save)
    const compressedBytes = await pdfDoc.save();

    // Create Blob for download
    const blob = new Blob([compressedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    setPdfInfo({
      name: file.name,
      originalSize: (file.size / 1024).toFixed(2),
      newSize: (compressedBytes.byteLength / 1024).toFixed(2),
      downloadUrl: url
    });
    setLoading(false);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">PDF Compressor</h1>
      <input type="file" accept=".pdf" onChange={compressPdf} />
      
      {loading && <p>Compressing...</p>}

      {pdfInfo && (
        <div className="mt-6 p-4 bg-green-100 rounded inline-block">
          <p>Original: {pdfInfo.originalSize} KB</p>
          <p>Compressed: {pdfInfo.newSize} KB</p>
          <a href={pdfInfo.downloadUrl} download={`compressed_${pdfInfo.name}`} className="text-blue-600 underline block mt-2">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}