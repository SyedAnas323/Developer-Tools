import { NextResponse } from 'next/server';
import { runILovePdfTask } from '../ilovepdf';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files').filter(Boolean);

    if (files.length < 2) {
      return NextResponse.json(
        { error: 'Please upload at least two PDF files to merge.' },
        { status: 400 }
      );
    }

    const invalidFile = files.find((file) => file.type !== 'application/pdf');
    if (invalidFile) {
      return NextResponse.json(
        { error: `Only PDF files are allowed. Invalid file: ${invalidFile.name}` },
        { status: 400 }
      );
    }

    const mergedPdf = await runILovePdfTask('merge', files);

    return new NextResponse(mergedPdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF merge error:', error);
    return NextResponse.json(
      { error: error.message || 'PDF merge failed.' },
      { status: 500 }
    );
  }
}
