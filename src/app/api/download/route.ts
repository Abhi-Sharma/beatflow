import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const name = searchParams.get('name') || 'track.mp3';

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch from destination: ${res.statusText}`);
    }

    const headers = new Headers();
    // Force download dialog via strict Content-Disposition
    headers.set('Content-Disposition', `attachment; filename="${name}"`);
    headers.set('Content-Type', 'audio/mpeg');

    return new NextResponse(res.body, { headers });
  } catch (error) {
    console.error('Download Proxy Error:', error);
    return new NextResponse('Download routing failed', { status: 500 });
  }
}
