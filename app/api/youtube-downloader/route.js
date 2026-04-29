import { NextResponse } from 'next/server';

const RAPID_API_URL =
  'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink';
export const runtime = 'nodejs';

function getRapidApiKey() {
  return (
    process.env.RAPID_API_KEY?.trim() ||
    process.env.RAPIDAPI_KEY?.trim() ||
    process.env.YOUTUBE_RAPID_API_KEY?.trim() ||
    ''
  );
}

function normalizeMedia(media, index) {
  return {
    id: `${media.type || 'media'}-${media.quality || index}-${index}`,
    url: media.url || '',
    type: media.type || 'file',
    extension: media.extension || '',
    quality: media.quality || media.type || `file-${index + 1}`,
    width: media.width || null,
    height: media.height || null,
    dataSize: media.data_size || null,
    duration: media.duration || null,
  };
}

export async function POST(request) {
  try {
    const rapidApiKey = getRapidApiKey();

    if (!rapidApiKey) {
      return NextResponse.json(
        {
          error: true,
          message: 'Something went wrong. Please try again.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const inputUrl = String(body?.url || '').trim();

    if (!inputUrl) {
      return NextResponse.json(
        { error: true, message: 'Please enter a video URL.' },
        { status: 400 }
      );
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(inputUrl);
    } catch {
      return NextResponse.json(
        { error: true, message: 'Please enter a valid URL.' },
        { status: 400 }
      );
    }

    const allowedHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'];

    if (!allowedHosts.includes(parsedUrl.hostname)) {
      return NextResponse.json(
        {
          error: true,
          message: 'This tool currently supports YouTube links only.',
        },
        { status: 400 }
      );
    }

    const upstreamResponse = await fetch(RAPID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey,
      },
      body: JSON.stringify({ url: inputUrl }),
      cache: 'no-store',
    });

    const rawText = await upstreamResponse.text();
    let upstreamData = null;

    try {
      upstreamData = rawText ? JSON.parse(rawText) : null;
    } catch {
      upstreamData = null;
    }

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          error: true,
          message: 'Something went wrong. Please try again.',
        },
        { status: upstreamResponse.status }
      );
    }

    const medias = Array.isArray(upstreamData?.medias)
      ? upstreamData.medias.map(normalizeMedia).filter((item) => item.url)
      : [];

    return NextResponse.json({
      error: Boolean(upstreamData?.error),
      source: upstreamData?.source || 'youtube',
      url: upstreamData?.url || inputUrl,
      id: upstreamData?.id || '',
      uniqueId: upstreamData?.unique_id || '',
      author: upstreamData?.author || '',
      title: upstreamData?.title || 'Untitled Video',
      thumbnail: upstreamData?.thumbnail || '',
      duration: upstreamData?.duration || 0,
      type: upstreamData?.type || 'single',
      medias,
      message:
        medias.length > 0
          ? ''
          : 'No downloadable media links were returned for this video.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
