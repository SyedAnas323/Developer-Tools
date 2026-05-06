import { NextResponse } from 'next/server';
import { runILovePdfTask } from '../ilovepdf';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Please upload a PDF file.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported.' }, { status: 400 });
    }

    // iLovePDF supports: recommended, low, extreme
    // "extreme" gives strongest size reduction.
    const compressedPdf = await runILovePdfTask('compress', [file], {
      compression_level: 'extreme',
    });

    return new NextResponse(compressedPdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF compression error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

