import { getJamendoTrack, getJamendoTrending } from "@/lib/api/jamendo";
import { notFound } from "next/navigation";
import { TrackDetailsClient } from "@/components/track/TrackDetailsClient";
import { PlayerTrack } from "@/store/usePlayerStore";
import { Metadata } from "next";

export const revalidate = 3600; // Cache this route for an hour

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const track = await getJamendoTrack(id);
  
  if (!track) {
    return {
      title: "Track Not Found | BeatFlow",
    };
  }

  const title = `${track.name} - Free Download & Stream | BeatFlow`;
  const desc = `Download and stream ${track.name} by ${track.artist_name} for free on BeatFlow. Royalty-free music for creators.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/track/${id}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://beatflow.space/track/${id}`,
      type: "music.song",
      images: track.image ? [{ url: track.image, width: 600, height: 600 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: track.image ? [track.image] : [],
    },
  };
}

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
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: track.name,
    byArtist: {
      "@type": "MusicGroup",
      name: track.artist_name,
    },
    duration: track.duration ? `PT${track.duration}S` : undefined,
    image: track.image,
    url: `https://beatflow.space/track/${track.id}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackDetailsClient 
        track={formattedTrack} 
        relatedTracks={mappedRelated} 
      />
    </>
  );
}
