import { NextResponse } from 'next/server';

function sanitizeFilename(value) {
  return String(value || 'download')
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

function contentTypeFromExtension(extension) {
  switch (String(extension || '').toLowerCase()) {
    case 'mp3':
      return 'audio/mpeg';
    case 'm4a':
      return 'audio/mp4';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    default:
      return 'application/octet-stream';
  }
}

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    const filename = sanitizeFilename(searchParams.get('filename'));
    const extension = String(searchParams.get('extension') || '').toLowerCase();

    if (!fileUrl) {
      return NextResponse.json(
        { error: true, message: 'Missing file URL.' },
        { status: 400 }
      );
    }

    let parsed;

    try {
      parsed = new URL(fileUrl);
    } catch {
      return NextResponse.json(
        { error: true, message: 'Invalid file URL.' },
        { status: 400 }
      );
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json(
        { error: true, message: 'Unsupported file URL.' },
        { status: 400 }
      );
    }

    const upstreamResponse = await fetch(parsed.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      return NextResponse.json(
        {
          error: true,
          message: `Unable to download file. Source responded with ${upstreamResponse.status}.`,
        },
        { status: 502 }
      );
    }

    const finalName = extension
      ? `${filename || 'download'}.${extension}`
      : filename || 'download';

    const headers = new Headers();
    headers.set(
      'Content-Type',
      upstreamResponse.headers.get('content-type') || contentTypeFromExtension(extension)
    );
    headers.set('Content-Disposition', `attachment; filename="${finalName}"`);
    headers.set('Cache-Control', 'no-store');

    const contentLength = upstreamResponse.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new Response(upstreamResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: true, message: error.message || 'Failed to proxy download.' },
      { status: 500 }
    );
  }
}
