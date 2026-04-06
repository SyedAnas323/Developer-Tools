'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const FONT_OPTIONS = ['Helvetica', 'Times Roman', 'Courier'];
const HISTORY_LIMIT = 30;

let pdfJsLoaderPromise = null;

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `block-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function cloneBlocks(blocks) {
  return JSON.parse(JSON.stringify(blocks));
}

function loadPdfJs() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('PDF.js can only load in browser.'));
  }

  if (window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }

  if (!pdfJsLoaderPromise) {
    pdfJsLoaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/pdf.min.js';
      script.async = true;
      script.onload = () => {
        if (!window.pdfjsLib) {
          reject(new Error('PDF.js failed to load.'));
          return;
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js.'));
      document.head.appendChild(script);
    });
  }

  return pdfJsLoaderPromise;
}

function groupTextItems(items, pageHeight) {
  const tokens = items
    .filter((item) => item.str && item.str.trim())
    .map((item) => {
      const [, , , , x, y] = item.transform;
      const fontSize = Math.max(10, Math.round(Math.abs(item.transform[0] || item.height || 12)));

      return {
        text: item.str,
        x,
        y,
        width: item.width || Math.max(item.str.length * fontSize * 0.42, 12),
        height: item.height || fontSize,
        fontSize,
      };
    })
    .sort((a, b) => {
      if (Math.abs(b.y - a.y) > 3) {
        return b.y - a.y;
      }

      return a.x - b.x;
    });

  const lines = [];

  for (const token of tokens) {
    const current = lines[lines.length - 1];

    if (!current || Math.abs(current.anchorY - token.y) > Math.max(6, token.fontSize * 0.45)) {
      lines.push({ anchorY: token.y, tokens: [token] });
      continue;
    }

    current.tokens.push(token);
  }

  return lines.map((line) => {
    const sorted = line.tokens.sort((a, b) => a.x - b.x);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const text = sorted.map((token) => token.text).join(' ');
    const fontSize = Math.max(
      12,
      Math.round(sorted.reduce((sum, token) => sum + token.fontSize, 0) / sorted.length)
    );

    return {
      id: makeId(),
      page: 1,
      text,
      x: first.x,
      y: clamp(first.y, 0, pageHeight),
      width: Math.max(last.x + last.width - first.x, 30),
      height: Math.max(...sorted.map((token) => token.height), fontSize * 1.15),
      fontSize,
      fontFamily: 'Helvetica',
      color: '#111827',
      deleted: false,
      isNew: false,
      original: {
        text,
        x: first.x,
        y: clamp(first.y, 0, pageHeight),
        width: Math.max(last.x + last.width - first.x, 30),
        height: Math.max(...sorted.map((token) => token.height), fontSize * 1.15),
        fontSize,
        fontFamily: 'Helvetica',
        color: '#111827',
      },
    };
  });
}

function hasChanged(block) {
  if (block.isNew) {
    return !block.deleted;
  }

  if (block.deleted) {
    return true;
  }

  return (
    block.text !== block.original.text ||
    block.x !== block.original.x ||
    block.y !== block.original.y ||
    block.width !== block.original.width ||
    block.height !== block.original.height ||
    block.fontSize !== block.original.fontSize ||
    block.fontFamily !== block.original.fontFamily ||
    block.color !== block.original.color
  );
}

function shouldShowOverlayText(block) {
  return block.isNew || hasChanged(block);
}

export default function EditPdfPage() {
  const [fileName, setFileName] = useState('');
  const [pdfBytes, setPdfBytes] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [dragging, setDragging] = useState(false);

  const pdfRef = useRef(null);
  const canvasRefs = useRef({});
  const pageRefs = useRef({});
  const dragRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedBlock = useMemo(
    () => blocks.find((block) => block.id === selectedId && !block.deleted) || null,
    [blocks, selectedId]
  );

  const pageBlocks = useMemo(
    () => blocks.filter((block) => block.page === currentPage && !block.deleted),
    [blocks, currentPage]
  );

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  useEffect(() => {
    const handleMove = (event) => {
      if (!dragRef.current) {
        return;
      }

      const { id, pageNumber, offsetX, offsetY } = dragRef.current;
      const pageMeta = pages.find((page) => page.pageNumber === pageNumber);
      const pageElement = pageRefs.current[pageNumber];

      if (!pageMeta || !pageElement) {
        return;
      }

      const rect = pageElement.getBoundingClientRect();
      const nextX = clamp((event.clientX - rect.left - offsetX) / zoom, 0, pageMeta.width);
      const nextY = clamp(pageMeta.height - ((event.clientY - rect.top - offsetY) / zoom), 0, pageMeta.height);

      setBlocks((prev) =>
        prev.map((block) =>
          block.id === id ? { ...block, x: Math.round(nextX), y: Math.round(nextY) } : block
        )
      );
    };

    const handleUp = () => {
      dragRef.current = null;
      setDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [pages, zoom]);

  useEffect(() => {
    if (!pdfRef.current || !pages.length) {
      return;
    }

    let disposed = false;

    async function renderPages() {
      for (const pageMeta of pages) {
        const canvas = canvasRefs.current[pageMeta.pageNumber];

        if (!canvas) {
          continue;
        }

        const page = await pdfRef.current.getPage(pageMeta.pageNumber);
        const viewport = page.getViewport({ scale: zoom });
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        if (!disposed) {
          await page.render({ canvasContext: context, viewport }).promise;
        }
      }
    }

    renderPages();

    return () => {
      disposed = true;
    };
  }, [pages, zoom]);

  function pushHistory(snapshot) {
    setUndoStack((prev) => [...prev.slice(-(HISTORY_LIMIT - 1)), cloneBlocks(snapshot)]);
    setRedoStack([]);
  }

  function commitBlocks(updater, options = {}) {
    setBlocks((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;

      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        pushHistory(prev);
      }

      return next;
    });

    if (Object.prototype.hasOwnProperty.call(options, 'selectedId')) {
      setSelectedId(options.selectedId);
    }
  }

  async function loadFile(file) {
    setLoading(true);
    setError('');
    setUndoStack([]);
    setRedoStack([]);
    setSelectedId(null);
    setCurrentPage(1);

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl('');
    }

    try {
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;

      pdfRef.current = pdf;
      setPdfBytes(arrayBuffer);
      setSourceFile(file);
      setFileName(file.name);

      const nextPages = [];
      const nextBlocks = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1 });
        const textContent = await page.getTextContent();
        const extracted = groupTextItems(textContent.items, viewport.height).map((block) => ({
          ...block,
          page: pageNumber,
        }));

        nextPages.push({
          pageNumber,
          width: viewport.width,
          height: viewport.height,
        });

        nextBlocks.push(...extracted);
      }

      setPages(nextPages);
      setBlocks(nextBlocks);
      setSelectedId(nextBlocks[0]?.id || null);
    } catch (err) {
      console.error(err);
      setError('PDF load nahin hui. Text-based PDF files is tool mein best work karti hain.');
    } finally {
      setLoading(false);
    }
  }

  async function handleFile(file) {
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    await loadFile(file);
  }

  function updateSelectedBlock(patch) {
    if (!selectedId) {
      return;
    }

    commitBlocks((prev) =>
      prev.map((block) => (block.id === selectedId ? { ...block, ...patch } : block))
    );
  }

  function addBlock() {
    if (!pages.length) {
      return;
    }

    const pageMeta = pages.find((page) => page.pageNumber === currentPage);

    if (!pageMeta) {
      return;
    }

    const newBlock = {
      id: makeId(),
      page: currentPage,
      text: 'New text',
      x: 72,
      y: pageMeta.height - 100,
      width: 180,
      height: 28,
      fontSize: 18,
      fontFamily: 'Helvetica',
      color: '#2563eb',
      deleted: false,
      isNew: true,
      original: null,
    };

    commitBlocks((prev) => [...prev, newBlock], { selectedId: newBlock.id });
  }

  function deleteSelected() {
    if (!selectedId) {
      return;
    }

    commitBlocks(
      (prev) => prev.map((block) => (block.id === selectedId ? { ...block, deleted: true } : block)),
      { selectedId: null }
    );
  }

  function undo() {
    if (!undoStack.length) {
      return;
    }

    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, cloneBlocks(blocks)]);
    setUndoStack((prev) => prev.slice(0, -1));
    setBlocks(previous);
    setSelectedId(previous.find((block) => !block.deleted)?.id || null);
  }

  function redo() {
    if (!redoStack.length) {
      return;
    }

    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, cloneBlocks(blocks)]);
    setRedoStack((prev) => prev.slice(0, -1));
    setBlocks(next);
    setSelectedId(next.find((block) => !block.deleted)?.id || null);
  }

  function startDrag(event, block) {
    event.stopPropagation();
    setSelectedId(block.id);
    setCurrentPage(block.page);

    const pageMeta = pages.find((page) => page.pageNumber === block.page);
    const pageElement = pageRefs.current[block.page];

    if (!pageMeta || !pageElement) {
      return;
    }

    const rect = pageElement.getBoundingClientRect();
    const left = block.x * zoom;
    const top = (pageMeta.height - block.y - block.height) * zoom;

    dragRef.current = {
      id: block.id,
      pageNumber: block.page,
      offsetX: event.clientX - rect.left - left,
      offsetY: event.clientY - rect.top - top,
    };

    setDragging(true);
  }

  async function exportPdf() {
    if (!sourceFile || !pdfBytes) {
      return;
    }

    setExporting(true);
    setError('');

    try {
      const formData = new FormData();
      const changedBlocks = blocks.filter((block) => hasChanged(block));

      formData.append('file', sourceFile);
      formData.append('blocks', JSON.stringify(changedBlocks));

      const response = await fetch('/api/edit-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let message = 'PDF export nahin hui. Dobara try karein.';

        try {
          const data = await response.json();
          if (data?.error) {
            message = data.error;
          }
        } catch {
          const text = await response.text();
          if (text) {
            message = text;
          }
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      const nextUrl = URL.createObjectURL(blob);
      setDownloadUrl(nextUrl);
    } catch (err) {
      console.error(err);
      setError(err.message || 'PDF export nahin hui. Dobara try karein.');
    } finally {
      setExporting(false);
    }
  }

  const totalPages = pages.length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit PDF</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Simple PDF editor jahan aap text blocks ko edit, add, delete aur move kar sakte hain.
            Final file generate hone ke baad aap usay download bhi kar sakte hain.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Upload PDF</h2>
              <div
                onDrop={(event) => {
                  event.preventDefault();
                  handleFile(event.dataTransfer.files?.[0]);
                }}
                onDragOver={(event) => event.preventDefault()}
                className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xs font-semibold ring-1 ring-slate-200">
                  PDF
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {fileName || 'Drop PDF here or choose file'}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {loading ? 'Loading...' : 'Choose PDF'}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Editor Controls</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button type="button" onClick={addBlock} disabled={!pages.length} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                  Add Text
                </button>
                <button type="button" onClick={deleteSelected} disabled={!selectedBlock} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                  Delete
                </button>
                <button type="button" onClick={undo} disabled={!undoStack.length} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                  Undo
                </button>
                <button type="button" onClick={redo} disabled={!redoStack.length} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                  Redo
                </button>
              </div>

              {selectedBlock ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Editable Text</label>
                    <textarea
                      value={selectedBlock.text}
                      onChange={(event) => updateSelectedBlock({ text: event.target.value })}
                      className="min-h-[120px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Font Size</label>
                      <input
                        type="number"
                        value={selectedBlock.fontSize}
                        onChange={(event) => updateSelectedBlock({ fontSize: Math.max(8, Number(event.target.value) || 8) })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Font Family</label>
                      <select
                        value={selectedBlock.fontFamily}
                        onChange={(event) => updateSelectedBlock({ fontFamily: event.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      >
                        {FONT_OPTIONS.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">X Position</label>
                      <input
                        type="number"
                        value={Math.round(selectedBlock.x)}
                        onChange={(event) => updateSelectedBlock({ x: Number(event.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Y Position</label>
                      <input
                        type="number"
                        value={Math.round(selectedBlock.y)}
                        onChange={(event) => updateSelectedBlock({ y: Number(event.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Color</label>
                    <input
                      type="color"
                      value={selectedBlock.color}
                      onChange={(event) => updateSelectedBlock({ color: event.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-300 px-2 py-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  PDF block select karein, phir us ki line edit karein.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Export & Download</h2>
              <p className="mt-2 text-sm text-slate-600">
                Jab aap editing complete kar lein to final PDF generate karein aur phir download karein.
              </p>
              <button
                type="button"
                onClick={exportPdf}
                disabled={!pages.length || exporting}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {exporting ? 'Generating PDF...' : 'Generate Final PDF'}
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`edited-${fileName || 'document.pdf'}`}
                  className="mt-3 block w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Download Edited PDF
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Har line ya section yahan se select karke edit ki ja sakti hai. Block ko drag bhi kar sakte hain.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setZoom((prev) => clamp(prev - 0.1, 0.7, 2))} className="rounded-lg border border-slate-300 px-3 py-1 text-sm">-</button>
                <span className="min-w-[60px] text-center text-sm text-slate-600">{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom((prev) => clamp(prev + 0.1, 0.7, 2))} className="rounded-lg border border-slate-300 px-3 py-1 text-sm">+</button>
              </div>
            </div>

            {totalPages > 0 && (
              <div className="mb-4 flex items-center gap-3">
                <button type="button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage <= 1} className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">
                  Prev
                </button>
                <div className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
                  Page {currentPage} / {totalPages}
                </div>
                <button type="button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages} className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">
                  Next
                </button>
              </div>
            )}

            <div className="max-h-[calc(100vh-210px)] overflow-auto rounded-2xl bg-slate-100 p-4">
              {!pages.length && (
                <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                  Upload a PDF to start editing.
                </div>
              )}

              <div className="space-y-6">
                {pages.map((page) => {
                  const currentBlocks = blocks.filter((block) => block.page === page.pageNumber && !block.deleted);

                  return (
                    <div
                      key={page.pageNumber}
                      className={`mx-auto ${currentPage === page.pageNumber ? 'ring-2 ring-blue-400' : ''}`}
                      style={{ width: page.width * zoom }}
                    >
                      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                        Page {page.pageNumber}
                      </div>

                      <div
                        ref={(node) => {
                          pageRefs.current[page.pageNumber] = node;
                        }}
                        className="relative overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm"
                        style={{ width: page.width * zoom, height: page.height * zoom }}
                      >
                        <canvas
                          ref={(node) => {
                            canvasRefs.current[page.pageNumber] = node;
                          }}
                          className="block"
                        />

                        <div className="absolute inset-0">
                          {currentBlocks.map((block) => {
                            const top = (page.height - block.y - block.height) * zoom;
                            const showOverlayText = shouldShowOverlayText(block);
                            const left = block.x * zoom;

                            return (
                              <div
                                key={block.id}
                                onMouseDown={(event) => startDrag(event, block)}
                                onClick={() => {
                                  setSelectedId(block.id);
                                  setCurrentPage(block.page);
                                }}
                                className={`absolute rounded-md border px-1 py-0.5 text-left shadow-sm ${
                                  selectedId === block.id
                                    ? 'border-blue-500 bg-blue-50/30'
                                    : showOverlayText
                                      ? 'border-amber-300 bg-amber-50/55'
                                      : 'border-transparent bg-transparent hover:border-slate-300/80 hover:bg-slate-100/20'
                                } ${dragging ? 'cursor-grabbing' : 'cursor-move'}`}
                                style={{
                                  top,
                                  left,
                                  minWidth: Math.max(block.width * zoom, 24),
                                  minHeight: Math.max(block.height * zoom, block.fontSize * 1.35 * zoom),
                                  fontSize: block.fontSize * zoom,
                                  lineHeight: `${block.fontSize * 1.2 * zoom}px`,
                                  color: showOverlayText ? block.color : 'transparent',
                                  fontFamily: block.fontFamily,
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                {showOverlayText ? block.text : ' '}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">How To Use This Tool</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p><strong>1.</strong> PDF upload karein.</p>
              <p><strong>2.</strong> Preview mein kisi line ya text block ko select karein.</p>
              <p><strong>3.</strong> Left panel se text edit, add, delete, font size aur position update karein.</p>
              <p><strong>4.</strong> Preview mein block ko drag karke nayi jagah le ja sakte hain.</p>
              <p><strong>5.</strong> Final result ke liye <strong>Generate Final PDF</strong> par click karein aur phir download karein.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Advantages Of This Tool</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p><strong>Simple UI:</strong> Complex design ke baghair clean aur professional editing experience.</p>
              <p><strong>Editable Sections:</strong> Extracted text blocks ko line-by-line ya section-wise update kar sakte hain.</p>
              <p><strong>Add / Delete Support:</strong> Naya text add karein ya purana block delete karein.</p>
              <p><strong>Live Preview:</strong> Changes foran preview panel mein nazar aati hain.</p>
              <p><strong>Download Ready:</strong> Final edited PDF generate karke download kar sakte hain.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
