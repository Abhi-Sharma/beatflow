import { NextResponse } from 'next/server';
import { extractMusicIntent } from '@/lib/aiMusicSearch';
import { searchJamendo, JamendoTrack } from '@/lib/api/jamendo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Extract intents using the high-performance heuristic engine
    const { tags, reason } = extractMusicIntent(query);

    // Query Jamendo with matched tags
    const jamendoRes = await searchJamendo('', 10, 0, tags);

    // Parse to PlayerTrack compliant schema
    let tracks = jamendoRes.results.map((t: JamendoTrack) => ({
      id: t.id,
      title: t.name,
      artist: t.artist_name,
      coverUrl: t.image,
      audioUrl: t.audio,
      downloadUrl: t.audiodownload,
      duration: t.duration,
      genre: tags[0] || 'Unknown',
      source: 'jamendo'
    }));

    // If no tracks matched the exact strict tags, fallback gracefully
    if (tracks.length === 0) {
      const fallbackRes = await searchJamendo('lofi', 8, 0); // lofi serves as great fallback
      tracks = fallbackRes.results.map((t: JamendoTrack) => ({
        id: t.id,
        title: t.name,
        artist: t.artist_name,
        coverUrl: t.image,
        audioUrl: t.audio,
        downloadUrl: t.audiodownload,
        duration: t.duration,
        genre: 'lofi',
        source: 'jamendo'
      }));

      return NextResponse.json({ 
        tracks, 
        reason: 'No perfect match found. Try these similar vibes.', 
        isFallback: true 
      });
    }

    return NextResponse.json({ 
      tracks, 
      reason, 
      isFallback: false 
    });

  } catch (error) {
    console.error('AI Music Search Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
