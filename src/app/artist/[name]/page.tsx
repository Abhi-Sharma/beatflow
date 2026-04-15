import { searchJamendo } from "@/lib/api/jamendo";
import { TrackCard } from "@/components/track/TrackCard";
import type { Metadata } from 'next';
import { PlayerTrack } from "@/store/usePlayerStore";

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).replace(/-/g, ' ');
  return {
    title: `Listen to ${decodedName} - Top Hits & Latest Tracks | BeatFlow`,
    description: `Discover and stream the best songs by ${decodedName}. Listen to trending hits, albums, and royalty-free tracks on BeatFlow.`,
    openGraph: {
      title: `${decodedName} | BeatFlow`,
      description: `Stream top hits by ${decodedName}.`,
      type: "website",
    }
  };
}

export default async function ArtistPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).replace(/-/g, ' ');
  const res = await searchJamendo(decodedName, 20);

  const mapJamendo = (t: any): PlayerTrack => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    downloadUrl: t.audiodownload || undefined,
    source: 'jamendo',
  });

  const tracks = (res.results || []).map(mapJamendo);

  return (
    <div className="space-y-6 animate-in fade-in pb-32">
      <div className="h-64 bg-gradient-to-br from-emerald-500/20 to-background rounded-xl p-8 flex items-end ml-4 mr-4 mt-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight capitalize drop-shadow-lg text-white">{decodedName}</h1>
      </div>
      <div className="px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Top Tracks by {decodedName}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tracks.map((t) => (
            <TrackCard key={`artist-track-${t.id}`} track={t} />
          ))}
          {tracks.length === 0 && <p className="text-zinc-500">No tracks found for this artist.</p>}
        </div>
      </div>
    </div>
  );
}
