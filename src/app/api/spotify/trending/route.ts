import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

const fallbackData = {
  tracks: {
    items: [
      {
        track: {
          id: "fallback-1",
          name: "Midnight Vibes (Fallback)",
          artists: [{ name: "BeatFlow Artist" }],
          album: { name: "Trending", images: [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" }] },
          preview_url: null,
          duration_ms: 210000,
        }
      },
      {
        track: {
          id: "fallback-2",
          name: "Neon Dreams (Fallback)",
          artists: [{ name: "BeatFlow Audio" }],
          album: { name: "Trending", images: [{ url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" }] },
          preview_url: null,
          duration_ms: 185000,
        }
      }
    ]
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'tracks'; 

    let data;

    if (type === 'artists') {
      data = await spotifyFetch('/browse/new-releases?limit=10');
      if (data && !data.error && data.albums) {
        // Mocking artist shape from new releases
        const artists = data.albums.items.map((album: any) => album.artists[0]).slice(0, 10);
        return NextResponse.json({ artists: { items: artists } });
      }
    } else {
      data = await spotifyFetch('/browse/new-releases?limit=10');
      
      if (data && !data.error && data.albums) {
        // Spotify /browse/new-releases returns albums not tracks. 
        // We will map them to the track shape our frontend expects.
        const mappedItems = data.albums.items.map((album: any) => ({
          track: {
            id: album.id, // Using album ID as track ID since we just use it for mapping
            name: album.name,
            artists: album.artists,
            album: album,
            preview_url: null, // New releases endpoint doesn't return track previews directly
            duration_ms: 180000,
            external_urls: album.external_urls
          }
        }));

        return NextResponse.json({
          tracks: {
            items: mappedItems
          }
        });
      }
    }

    if (!data || data.error) {
       console.warn("Spotify API returned error, serving fallback data.", data);
       return NextResponse.json(fallbackData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Spotify trending:', error);
    return NextResponse.json(fallbackData);
  }
}

