import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'track,artist,playlist';

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const data = await spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=20`);

    if (!data) {
       return NextResponse.json({ error: 'Failed to search Spotify' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
