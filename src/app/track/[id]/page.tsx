import { getJamendoTrack, getJamendoTrending } from "@/lib/api/jamendo";
import { notFound } from "next/navigation";
import { TrackDetailsClient } from "@/components/track/TrackDetailsClient";
import { PlayerTrack } from "@/store/usePlayerStore";

export const revalidate = 3600; // Cache this route for an hour

export default async function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const track = await getJamendoTrack(id);
  
  if (!track) {
    return notFound();
  }
  
  // Fetch trending/popular tracks to simulate 'related' content
  const relatedResponse = await getJamendoTrending(15);
  const relatedTracksData = relatedResponse.results || [];
  
  const mapJamendo = (t: any): PlayerTrack => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    downloadUrl: t.audiodownload || undefined,
    source: "jamendo" as const,
  });

  const formattedTrack = mapJamendo(track);
  
  // Exclude current track from related
  const filteredRelated = relatedTracksData.filter((t: any) => t.id !== track.id);
  const mappedRelated = filteredRelated.map(mapJamendo);
  
  return (
    <TrackDetailsClient 
      track={formattedTrack} 
      relatedTracks={mappedRelated} 
    />
  );
}
