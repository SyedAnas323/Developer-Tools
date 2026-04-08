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

function isRedirectCandidate(hostname) {
  const host = String(hostname || '').toLowerCase();
  return (
    host.includes('googlevideo.com') ||
    host.includes('youtube.com') ||
    host.includes('youtu.be') ||
    host.includes('tiktokcdn.com') ||
    host.includes('musical.ly')
  );
}

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

    let upstreamResponse = await fetch(parsed.toString(), {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.youtube.com/',
        Origin: 'https://www.youtube.com',
        Range: 'bytes=0-',
      },
      cache: 'no-store',
      redirect: 'follow',
    });

    if ((upstreamResponse.status === 401 || upstreamResponse.status === 403) && isRedirectCandidate(parsed.hostname)) {
      return NextResponse.redirect(parsed.toString(), 307);
    }

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
