import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'tracks'; // 'tracks', 'artists'

    let data;

    if (type === 'artists') {
      // Get trending artists via Top Artists on specific popular playlist (Global Top 50)
      // Since client credentials cannot access user top items, we get tracks from Global Top 50 (37i9dQZEVXbMDoHDwVN2tF)
      data = await spotifyFetch('/playlists/37i9dQZEVXbMDoHDwVN2tF');
      if (data && data.tracks) {
        // Extract artists from tracks
        const artistsDict: Record<string, any> = {};
        data.tracks.items.forEach((item: any) => {
          if (item.track && item.track.artists) {
            item.track.artists.forEach((artist: any) => {
              artistsDict[artist.id] = artist;
            });
          }
        });
        
        const artistIds = Object.keys(artistsDict).slice(0, 10).join(',');
        const fullArtists = await spotifyFetch(`/artists?ids=${artistIds}`);
        return NextResponse.json(fullArtists);
      }
    } else {
      // Global Top 50 playlist
      data = await spotifyFetch('/playlists/37i9dQZEVXbMDoHDwVN2tF');
    }

    if (!data) {
       return NextResponse.json({ error: 'Failed to fetch trending data from Spotify' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Spotify trending:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
