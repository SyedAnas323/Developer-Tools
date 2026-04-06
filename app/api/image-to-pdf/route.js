import { NextResponse } from 'next/server';
import { runILovePdfTask } from '../ilovepdf';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]);

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files').filter(Boolean);

    if (!files.length) {
      return NextResponse.json({ error: 'Please upload at least one image.' }, { status: 400 });
    }

    const invalidFile = files.find((file) => !ALLOWED_TYPES.has(file.type));
    if (invalidFile) {
      return NextResponse.json(
        { error: `Unsupported file format: ${invalidFile.name}` },
        { status: 400 }
      );
    }

    const pdfBuffer = await runILovePdfTask('imagepdf', files);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="converted-images.pdf"',
      },
    });
  } catch (error) {
    console.error('Image to PDF error:', error);
    return NextResponse.json(
      { error: error.message || 'Image to PDF conversion failed.' },
      { status: 500 }
    );
  }
}
