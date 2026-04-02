import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';

export const runtime = 'nodejs';

const require = createRequire(import.meta.url);

function normalizeNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildTextElementPayload(rawElement) {
  const text = String(rawElement?.text || '').trim();

  if (!text) {
    throw new Error('Text element content is required.');
  }

  return {
    text,
    pages: String(rawElement?.pages || '1'),
    coordinates: {
      x: normalizeNumber(rawElement?.coordinates?.x, 80),
      y: normalizeNumber(rawElement?.coordinates?.y, 80),
    },
    dimensions: {
      w: normalizeNumber(rawElement?.dimensions?.w, 220),
      h: normalizeNumber(rawElement?.dimensions?.h, 60),
    },
    rotation: normalizeNumber(rawElement?.rotation, 0),
    opacity: normalizeNumber(rawElement?.opacity, 100),
    font_size: normalizeNumber(rawElement?.font_size, 18),
  };
}

export async function POST(request) {
  let tempDir = null;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const elementsRaw = formData.get('elements');

    if (!file) {
      return NextResponse.json({ error: 'No PDF file uploaded.' }, { status: 400 });
    }

    if (!elementsRaw) {
      return NextResponse.json({ error: 'No edit elements provided.' }, { status: 400 });
    }

    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY?.trim();
    const secretKey = process.env.ILOVEPDF_SECRET_KEY?.trim();

    if (!publicKey || !secretKey) {
      return NextResponse.json(
        { error: 'ILOVEPDF_PUBLIC_KEY or ILOVEPDF_SECRET_KEY is missing in .env.local' },
        { status: 500 }
      );
    }

    let parsedElements;

    try {
      parsedElements = JSON.parse(String(elementsRaw));
    } catch {
      return NextResponse.json({ error: 'Invalid elements payload.' }, { status: 400 });
    }

    if (!Array.isArray(parsedElements) || parsedElements.length === 0) {
      return NextResponse.json({ error: 'At least one text element is required.' }, { status: 400 });
    }

    const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
    const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
    const TextModule = require('@ilovepdf/ilovepdf-js-core/tasks/edit/Text');
    const Text = TextModule.default;

    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'edit-pdf-'));
    const tempInputPath = path.join(tempDir, file.name || 'input.pdf');
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(tempInputPath, fileBuffer);

    const instance = new ILovePDFApi(publicKey, secretKey);
    const task = instance.newTask('editpdf');

    await task.start();
    await task.addFile(new ILovePDFFile(tempInputPath));

    for (const rawElement of parsedElements) {
      if (rawElement?.type !== 'text') {
        throw new Error('This first version only supports text elements.');
      }

      task.addElement(new Text(buildTextElementPayload(rawElement)));
    }

    await task.process();
    const output = await task.download();

    return new NextResponse(Buffer.from(output), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="edited.pdf"',
      },
    });
  } catch (error) {
    console.error('Edit PDF error:', error);

    const upstreamError =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.response?.data?.status_message ||
      error?.response?.data?.validation_errors?.join?.(', ');

    return NextResponse.json(
      { error: upstreamError || error.message || 'Failed to edit PDF.' },
      { status: 500 }
    );
  } finally {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }
}
