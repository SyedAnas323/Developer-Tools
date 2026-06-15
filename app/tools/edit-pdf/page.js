'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const FONT_OPTIONS = [
  'Helvetica',
  'Helvetica Bold',
  'Times Roman',
  'Times Roman Bold',
  'Courier',
  'Courier Bold',
];
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

function normalizeFontFamily(fontName = '') {
  const normalized = String(fontName).toLowerCase();

  if (normalized.includes('times')) {
    return normalized.includes('bold') ? 'Times Roman Bold' : 'Times Roman';
  }

  if (normalized.includes('courier')) {
    return normalized.includes('bold') ? 'Courier Bold' : 'Courier';
  }

  return normalized.includes('bold') ? 'Helvetica Bold' : 'Helvetica';
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
        fontFamily: normalizeFontFamily(item.fontName),
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
    const primaryFont = sorted[0]?.fontFamily || 'Helvetica';

    return {
      id: makeId(),
      page: 1,
      text,
      x: first.x,
      y: clamp(first.y, 0, pageHeight),
      width: Math.max(last.x + last.width - first.x, 30),
      height: Math.max(...sorted.map((token) => token.height), fontSize * 1.15),
      fontSize,
      fontFamily: primaryFont,
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
        fontFamily: primaryFont,
        color: '#111827',
        tokenCount: sorted.length,
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

function getPreviewOverlayStyle(block, pageHeight, zoom, isSelected) {
  const top = (pageHeight - block.y - block.height) * zoom;
  const left = block.x * zoom;
  const minWidth = Math.max(block.width * zoom, 24);
  const minHeight = Math.max(block.height * zoom, block.fontSize * 1.35 * zoom);
  const changed = hasChanged(block);
  const showWhiteCover = changed && !block.isNew;

  return {
    top,
    left,
    minWidth,
    minHeight,
    fontSize: block.fontSize * zoom,
    lineHeight: `${block.fontSize * 1.2 * zoom}px`,
    color: block.deleted ? 'transparent' : block.color,
    fontFamily: block.fontFamily,
    whiteSpace: 'pre-wrap',
    backgroundColor: block.deleted
      ? 'rgba(255,255,255,0.98)'
      : showWhiteCover
        ? 'rgba(255,255,255,0.94)'
        : isSelected
          ? 'rgba(239,246,255,0.55)'
      : 'transparent',
  };
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.feature || row.title} className="align-top">
                {Object.values(row).map((value, index) => (
                  <td
                    key={`${value}-${index}`}
                    className={`px-5 py-4 text-slate-600 ${index === 0 ? 'font-medium text-slate-900' : ''}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PDF_EDITOR_FEATURES = [
  {
    title: 'Add Text To PDF',
    text: 'Insert new text anywhere on the page for updates, labels, notes, or form-style editing.',
  },
  {
    title: 'Edit Existing Content',
    text: 'Select extracted text blocks and change the wording, font size, position, or color.',
  },
  {
    title: 'Add Images',
    text: 'Place logos, signatures, icons, or supporting visuals into the document layout.',
  },
  {
    title: 'Highlight Text',
    text: 'Mark important lines so reviewers can quickly scan contracts, forms, and reports.',
  },
  {
    title: 'Annotate Documents',
    text: 'Use notes and markup to explain changes or request feedback from collaborators.',
  },
  {
    title: 'Add Signatures',
    text: 'Add a visual signature for approvals, acknowledgements, or routine sign-off workflows.',
  },
  {
    title: 'Reorder Pages',
    text: 'Move pages or structure sections so the final document reads in the right sequence.',
  },
];

const PDF_EDITOR_BENEFITS = [
  'Keeps the original PDF format intact while giving you practical editing control.',
  'Reduces the need to convert files back and forth between formats.',
  'Helps teams make quick updates without rebuilding documents from scratch.',
  'Supports cleaner collaboration when multiple people review the same file.',
  'Works well for everyday corrections, annotations, and small layout adjustments.',
];

const PDF_EDITOR_USE_CASES = [
  {
    title: 'Business Documents',
    text: 'Teams update proposals, memos, policies, and client deliverables without recreating the whole file.',
  },
  {
    title: 'Contracts',
    text: 'Legal and business users add notes, change fields, and mark revisions before final approval.',
  },
  {
    title: 'Reports',
    text: 'Analysts and managers can correct labels, update summaries, and add supporting context.',
  },
  {
    title: 'Forms',
    text: 'Forms can be filled, marked, or prepared for the next reviewer in the workflow.',
  },
  {
    title: 'Student Assignments',
    text: 'Students can annotate feedback, fix cover pages, and prepare submission-ready PDFs.',
  },
  {
    title: 'Government Documents',
    text: 'Public forms and notices often require stamps, comments, or page-level corrections.',
  },
  {
    title: 'Legal Documents',
    text: 'Lawyers and paralegals use markup, highlights, and signatures during review cycles.',
  },
];

const PDF_EDITOR_TABLE_ROWS = [
  {
    feature: 'Editing',
    editor: 'Directly edits PDF text blocks and layout elements',
    word: 'Best for rewriting full documents',
  },
  {
    feature: 'Formatting',
    editor: 'Keeps the PDF structure while updating selected objects',
    word: 'Reflows content like a document draft',
  },
  {
    feature: 'Sharing',
    editor: 'Produces a final PDF ready for sharing or archival',
    word: 'Usually exported to PDF before sending',
  },
  {
    feature: 'Security',
    editor: 'Preserves document format and can support controlled markup workflows',
    word: 'Native document may be easier to modify',
  },
  {
    feature: 'Collaboration',
    editor: 'Useful for comments, annotations, and small edits',
    word: 'Better for co-authoring and drafting',
  },
];

const PDF_EDITOR_TIMELINE = [
  'Upload the PDF file that needs changes.',
  'Select the text block, annotation, or page area you want to update.',
  'Add text, adjust existing content, or place visual markups where needed.',
  'Review the live preview to confirm spacing and readability.',
  'Generate the final PDF and download the edited file.',
];

const EDITING_PRACTICES = [
  'Work from a clean source PDF whenever possible so text blocks are easier to select.',
  'Keep edits focused and avoid changing the whole file if only a small section needs revision.',
  'Use annotations for review comments and signatures for approval steps.',
  'Check page flow after changes so headers, tables, and footers still read well.',
  'Export and review the result before sending it to clients or stakeholders.',
];

const EDITING_MISTAKES = [
  'Trying to rewrite a heavily scanned PDF without checking text readability first.',
  'Using a word processor when the final deliverable must stay in PDF format.',
  'Adding too many overlapping markups and making the page harder to read.',
  'Ignoring font consistency and spacing after inserting new text.',
  'Skipping the final review before download or sharing.',
];

const EDITING_BLOCKS = [
  {
    title: 'How PDF Editing Works',
    text: 'A PDF editor usually identifies text blocks, page objects, and annotation layers, then lets you update them without rebuilding the entire file.',
  },
  {
    title: 'What Are Annotations?',
    text: 'Annotations are review marks such as highlights, notes, comments, arrows, and callouts used to explain changes or request action.',
  },
  {
    title: 'What Are Digital Signatures?',
    text: 'Digital signatures are approval marks used to show that a document was reviewed, accepted, or formally signed in a digital workflow.',
  },
];

const EDIT_PDF_FAQS = [
  [
    'What is a PDF editor?',
    'A PDF editor is a tool that lets you add text, mark up pages, move content, and make practical changes to a PDF file.',
  ],
  [
    'Can I edit PDF files online?',
    'Yes. An online PDF editor works in the browser, so you can upload a PDF, make changes, and download the updated file.',
  ],
  [
    'Can I add text to a PDF?',
    'Yes. You can place new text on top of a PDF to fill forms, add notes, or update missing information.',
  ],
  [
    'Can I edit existing text in a PDF?',
    'You can edit selected text blocks when the PDF contains readable text data. Scanned PDFs often need extra cleanup first.',
  ],
  [
    'Can I annotate a PDF?',
    'Yes. Highlighting, comments, underlines, and callouts are common PDF annotation tools.',
  ],
  [
    'Can I add a signature to a PDF?',
    'Yes. Many PDF editors let you insert a signature image or signature field for approval workflows.',
  ],
  [
    'Is online PDF editing free?',
    'This tool is offered free in the browser so you can make everyday edits without installing desktop software.',
  ],
  [
    'What PDF files are easiest to edit?',
    'Text-based PDFs are easiest because the editor can recognize lines and paragraph blocks more reliably.',
  ],
  [
    'Can I reorder PDF pages?',
    'Yes. Page-level editing is useful when a file needs a different reading order or revised structure.',
  ],
  [
    'What is the difference between annotation and editing?',
    'Editing changes the content itself, while annotation adds marks or comments without rewriting the original message.',
  ],
  [
    'Why are PDF signatures important?',
    'Signatures help show approval, reduce confusion, and make digital workflows easier to track.',
  ],
  [
    'Can students use a PDF editor?',
    'Yes. Students commonly use PDF editors to mark feedback, fix details, and prepare assignment files.',
  ],
  [
    'Can businesses use PDF editors?',
    'Yes. Businesses use them to update contracts, reports, forms, and client-facing documents quickly.',
  ],
  [
    'Are PDF editors useful for legal documents?',
    'Yes. Legal teams use them for review marks, signatures, and controlled changes on formal documents.',
  ],
  [
    'What should I do before exporting a PDF?',
    'Check text placement, page order, and markup visibility, then generate a final copy for download.',
  ],
];

const RELATED_TOOLS = [
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/pdf-merge', label: 'PDF Merge' },
  { href: '/tools/word-to-pdf', label: 'Word To PDF' },
  { href: '/tools/image-to-pdf', label: 'Image To PDF' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/word-counter', label: 'Word Counter' },
];

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
        const deviceScale = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 1) : 1;
        const viewport = page.getViewport({ scale: zoom });
        const renderViewport = page.getViewport({ scale: zoom * deviceScale });
        const context = canvas.getContext('2d');

        canvas.width = renderViewport.width;
        canvas.height = renderViewport.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        if (!disposed) {
          await page.render({ canvasContext: context, viewport: renderViewport }).promise;
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

    const inheritedBlock =
      selectedBlock ||
      blocks
        .filter((block) => block.page === currentPage && !block.deleted)
        .sort((a, b) => Math.abs(a.y - (pageMeta.height - 100)) - Math.abs(b.y - (pageMeta.height - 100)))[0] ||
      null;

    const newBlock = {
      id: makeId(),
      page: currentPage,
      text: 'New text',
      x: inheritedBlock ? inheritedBlock.x : 72,
      y: inheritedBlock ? inheritedBlock.y - Math.max(inheritedBlock.fontSize * 1.4, 28) : pageMeta.height - 100,
      width: inheritedBlock ? inheritedBlock.width : 180,
      height: inheritedBlock ? inheritedBlock.height : 28,
      fontSize: inheritedBlock ? inheritedBlock.fontSize : 18,
      fontFamily: inheritedBlock ? inheritedBlock.fontFamily : 'Helvetica',
      color: inheritedBlock ? inheritedBlock.color : '#111827',
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
      const message = 'Something went wrong. Please try again.';
      setError(message);
      alert(message);
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
                            const showOverlayText = shouldShowOverlayText(block);
                            const isSelected = selectedId === block.id;

                            return (
                              <div
                                key={block.id}
                                onMouseDown={(event) => startDrag(event, block)}
                                onClick={() => {
                                  setSelectedId(block.id);
                                  setCurrentPage(block.page);
                                }}
                                className={`absolute rounded-md border px-1 py-0.5 text-left shadow-sm ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50/30'
                                    : showOverlayText
                                      ? 'border-amber-300 bg-amber-50/55'
                                      : 'border-transparent bg-transparent hover:border-slate-300/80 hover:bg-slate-100/20'
                                } ${dragging ? 'cursor-grabbing' : 'cursor-move'}`}
                                style={getPreviewOverlayStyle(block, page.height, zoom, isSelected)}
                              >
                                {block.deleted ? ' ' : showOverlayText ? block.text : ' '}
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

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Short Answer</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">What Is A PDF Editor?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              A PDF editor is a tool that lets you modify PDF content without rebuilding the document
              from scratch. It is used to add text, annotate pages, place signatures, highlight
              important lines, update small mistakes, and prepare files for review or sharing.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is A PDF File?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A PDF file is a fixed-layout document format designed to look the same across devices,
                browsers, and operating systems. That makes PDFs ideal for forms, reports, contracts,
                manuals, and other documents that need consistent presentation.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How PDF Editing Works</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The editor identifies text blocks and page objects, then lets you update or overlay
                content in place. For review work, it can also add annotation layers without changing
                the original document structure.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Why PDF Editing Is Important</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                PDF editing matters because teams often need to fix details, sign pages, or add
                comments after a file is already exported. A fast editor saves time and keeps the
                workflow inside the PDF format.
              </p>
            </article>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Edit PDF Files Online"
              description="The usual flow is upload, select content, make edits, review the result, and download the final file."
            />
            <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {PDF_EDITOR_TIMELINE.map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Benefits"
              title="Benefits Of Editing PDFs"
              description="Online editing keeps work moving when you need a quick update instead of a complete rewrite."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {PDF_EDITOR_BENEFITS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Features"
            title="Features Of A PDF Editor"
            description="Most practical PDF editors focus on small, useful changes rather than forcing a full document rebuild."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PDF_EDITOR_FEATURES.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Explanation"
            title="Detailed Explanation Of PDF Editing"
            description="Editing, annotations, and signatures solve different document tasks, so it helps to understand each one clearly."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {EDITING_BLOCKS.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Use Cases"
            title="Common Use Cases"
            description="PDF editing shows up in nearly every document workflow where a file needs a quick revision."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PDF_EDITOR_USE_CASES.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="PDF Editor vs Word Processor"
            description="A PDF editor keeps you in the final document format, while a word processor is better for drafting and rewriting from scratch."
          />
          <div className="mt-6">
            <DataTable columns={['Feature', 'PDF Editor', 'Word Processor']} rows={PDF_EDITOR_TABLE_ROWS} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Best Practices"
              title="PDF Editing Best Practices"
              description="Good editing habits help keep the document readable, professional, and ready to share."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {EDITING_PRACTICES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Mistakes"
              title="Common PDF Editing Mistakes"
              description="These mistakes usually happen when the editor is used for the wrong kind of change or the file is not reviewed before download."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {EDITING_MISTAKES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Business"
              title="PDF Editing For Businesses"
              description="Businesses rely on PDFs when documents must stay consistent across teams and clients."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <p className="text-sm leading-7 text-slate-600">
              Companies use PDF editing to update proposals, revise policy text, insert comments, and
              add signatures before sending documents out for approval. Online editing is especially
              useful when teams need a fast turnaround without installing desktop software.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Students"
              title="PDF Editing For Students"
              description="Students often need to annotate assignments, fix cover pages, or prepare submission-ready files."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <p className="text-sm leading-7 text-slate-600">
              Students use PDF editing to add feedback notes, highlight study material, and correct
              small document issues before final submission. It is also helpful for presentations,
              lab reports, and signed forms that must stay in PDF format.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Legal"
              title="PDF Editing For Legal Documents"
              description="Legal teams need careful markup because their files often carry review history and approval steps."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <p className="text-sm leading-7 text-slate-600">
              Legal professionals use annotations, signatures, highlights, and page management to
              keep contracts and case files organized. Even small edits need to be easy to review,
              which is why PDF is still the preferred format for many legal workflows.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Summary"
            title="Benefits Of Online PDF Editing"
            description="Editing in the browser keeps the workflow simple for everyday document updates."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Online PDF editing helps users make small corrections, annotate documents, and prepare
            files for sharing without moving between multiple apps. That reduces friction for
            business teams, students, and legal users who need a fast and reliable way to finish
            document tasks.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise enough for quick readers and detailed enough for AI search extraction."
          />
          <div className="mt-6 space-y-4">
            {EDIT_PDF_FAQS.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                  <span className="flex items-center justify-between gap-4">
                    {question}
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Related Tools"
            title="Related Tools"
            description="Continue the document workflow with the tools below."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Edit PDF Online Free - Add Text to PDF Files Instantly | MyToolsHub',
            url: 'https://toolshub.cyphersol.com/tools/edit-pdf',
            description:
              'Add text, annotations, and labels to any PDF file online for free. Edit PDF documents without Adobe Acrobat - works in your browser, no signup required.',
            isPartOf: {
              '@type': 'WebSite',
              name: 'MyToolsHub',
              url: 'https://toolshub.cyphersol.com',
            },
            inLanguage: 'en',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Edit PDF',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            url: 'https://toolshub.cyphersol.com/tools/edit-pdf',
            description:
              'Edit PDF files online for free by adding text, annotations, and signatures directly in your browser.',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://toolshub.cyphersol.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Tools',
                item: 'https://toolshub.cyphersol.com/tools',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Edit PDF',
                item: 'https://toolshub.cyphersol.com/tools/edit-pdf',
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How To Edit PDF Files Online',
            totalTime: 'PT2M',
            step: PDF_EDITOR_TIMELINE.map((step) => ({
              '@type': 'HowToStep',
              name: step,
              text: step,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: EDIT_PDF_FAQS.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
