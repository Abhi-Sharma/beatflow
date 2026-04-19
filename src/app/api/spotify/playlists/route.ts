import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // e.g. 'chill', 'workout'

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Map common frontend vibes to actual Spotify Category IDs if possible, or search for playlists
    const data = await spotifyFetch(`/search?q=${encodeURIComponent(category)}&type=playlist&limit=10`);

    if (!data) {
       return NextResponse.json({ error: 'Failed to fetch playlists from Spotify' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
