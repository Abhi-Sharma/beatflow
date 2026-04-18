"use server";

import { getJamendoCategory, getJamendoTrending } from "@/lib/api/jamendo";
import { PlayerTrack } from "@/store/usePlayerStore";

const mapJamendo = (t: any): PlayerTrack => ({
  id: t.id,
  title: t.name,
  artist: t.artist_name,
  coverUrl: t.image,
  audioUrl: t.audio,
  downloadUrl: t.audiodownload || undefined,
  duration: t.duration,
  genre: t.musicinfo?.tags?.genres?.[0] || 'Pop',
  source: 'jamendo',
});

// Batch fetch genres dynamically matched from user algorithms without leaking private Jamendo Client ID Keys
export async function fetchRecommendationMatches(tags: string[]): Promise<Record<string, PlayerTrack[]>> {
  if (!tags || tags.length === 0) return {};

  const responses = await Promise.all(
    tags.map(tag => getJamendoCategory(tag, 12)) // Overfetching slightly allows better layout fills
  );

  const parsed: Record<string, PlayerTrack[]> = {};
  tags.forEach((tag, idx) => {
    parsed[tag] = responses[idx].results?.map(mapJamendo) || [];
  });
  
  return parsed;
}

export async function fetchTrendingFallback(): Promise<PlayerTrack[]> {
  const t = await getJamendoTrending(12);
  return t.results?.map(mapJamendo) || [];
}
