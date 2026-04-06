import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const runtime = 'nodejs';

function clampNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapFont(fontFamily) {
  switch (fontFamily) {
    case 'Times Roman':
      return StandardFonts.TimesRoman;
    case 'Courier':
      return StandardFonts.Courier;
    default:
      return StandardFonts.Helvetica;
  }
}

function hexToRgb(hex) {
  const cleaned = String(hex || '#111827').replace('#', '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((char) => `${char}${char}`).join('')
    : cleaned;
  const int = parseInt(full, 16);

  return rgb(
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255
  );
}

function hasChanged(block) {
  if (block.isNew) {
    return !block.deleted;
  }

  if (block.deleted) {
    return true;
  }

  return (
    block.text !== block.original?.text ||
    block.x !== block.original?.x ||
    block.y !== block.original?.y ||
    block.width !== block.original?.width ||
    block.height !== block.original?.height ||
    block.fontSize !== block.original?.fontSize ||
    block.fontFamily !== block.original?.fontFamily ||
    block.color !== block.original?.color
  );
}

function getBounds(block, font) {
  const lines = String(block.text || '').split('\n');
  const fontSize = clampNumber(block.fontSize, 14);
  const lineHeight = fontSize * 1.25;
  const width = Math.max(
    ...lines.map((line) => Math.max(font.widthOfTextAtSize(line || ' ', fontSize), 1)),
    clampNumber(block.width, 1)
  );

  return {
    x: clampNumber(block.x, 0),
    y: clampNumber(block.y, 0),
    width,
    height: Math.max(lines.length * lineHeight, clampNumber(block.height, lineHeight)),
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const blocksRaw = formData.get('blocks');

    if (!file) {
      return NextResponse.json({ error: 'No PDF file uploaded.' }, { status: 400 });
    }

    if (!blocksRaw) {
      return NextResponse.json({ error: 'No editable blocks provided.' }, { status: 400 });
    }

    let blocks;

    try {
      blocks = JSON.parse(String(blocksRaw));
    } catch {
      return NextResponse.json({ error: 'Invalid blocks payload.' }, { status: 400 });
    }

    if (!Array.isArray(blocks)) {
      return NextResponse.json({ error: 'Blocks payload must be an array.' }, { status: 400 });
    }

    const sourceBytes = Buffer.from(await file.arrayBuffer());
    const pdfDoc = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
    const fontCache = {};

    async function getFont(fontFamily) {
      const key = mapFont(fontFamily);

      if (!fontCache[key]) {
        fontCache[key] = await pdfDoc.embedFont(key);
      }

      return fontCache[key];
    }

    for (const rawBlock of blocks) {
      const block = {
        ...rawBlock,
        x: clampNumber(rawBlock.x, 0),
        y: clampNumber(rawBlock.y, 0),
        width: clampNumber(rawBlock.width, 40),
        height: clampNumber(rawBlock.height, 20),
        fontSize: clampNumber(rawBlock.fontSize, 14),
        fontFamily: rawBlock.fontFamily || 'Helvetica',
        color: rawBlock.color || '#111827',
        page: clampNumber(rawBlock.page, 1),
      };

      if (!hasChanged(block)) {
        continue;
      }

      const page = pdfDoc.getPage(block.page - 1);

      if (!page) {
        continue;
      }

      const font = await getFont(block.fontFamily);

      if (!block.isNew && block.original) {
        const originalBlock = {
          ...block.original,
          x: clampNumber(block.original.x, block.x),
          y: clampNumber(block.original.y, block.y),
          width: clampNumber(block.original.width, block.width),
          height: clampNumber(block.original.height, block.height),
          fontSize: clampNumber(block.original.fontSize, block.fontSize),
          fontFamily: block.original.fontFamily || block.fontFamily,
        };
        const originalFont = await getFont(originalBlock.fontFamily);
        const bounds = getBounds(originalBlock, originalFont);

        page.drawRectangle({
          x: bounds.x - 8,
          y: bounds.y - bounds.height * 0.2 - 6,
          width: bounds.width + 16,
          height: bounds.height + 12,
          color: rgb(1, 1, 1),
        });
      }

      if (block.deleted) {
        continue;
      }

      const lines = String(block.text || '').split('\n');

      lines.forEach((line, index) => {
        page.drawText(line, {
          x: block.x,
          y: block.y - index * block.fontSize * 1.2,
          size: block.fontSize,
          font,
          color: hexToRgb(block.color),
        });
      });
    }

    const bytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="edited.pdf"',
      },
    });
  } catch (error) {
    console.error('Edit PDF export error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to export PDF.' },
      { status: 500 }
    );
  }
}
