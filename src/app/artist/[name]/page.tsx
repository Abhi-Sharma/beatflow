import { searchDeezer } from "@/lib/api/deezer";
import { TrackCard } from "@/components/track/TrackCard";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const name = params.name.replace(/-/g, ' ');
  return {
    title: `Listen to ${name} - Top Hits & Latest Tracks | BeatFlow`,
    description: `Discover and stream the best songs by ${name}. Listen to trending hits, albums, and royalty-free tracks on BeatFlow.`,
    openGraph: {
      title: `${name} | BeatFlow`,
      description: `Stream top hits by ${name}.`,
      type: "website",
    }
  };
}

export default async function ArtistPage({ params }: { params: { name: string } }) {
  const name = params.name.replace(/-/g, ' ');
  const deezerRes = await searchDeezer(`artist:"${name}"`, 20);

  const mapDeezer = (t: any) => ({
    id: t.id.toString(),
    title: t.title,
    artist: t.artist.name,
    coverUrl: t.album.cover_medium,
    audioUrl: t.preview,
    source: 'deezer' as const,
  });

  const tracks = (deezerRes.data || []).map(mapDeezer);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="h-64 bg-gradient-to-br from-primary/40 to-background rounded-xl p-8 flex items-end">
        <h1 className="text-5xl font-bold tracking-tight capitalize drop-shadow-lg">{name}</h1>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Top Tracks by {name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tracks.map((t) => (
            <TrackCard key={`artist-track-${t.id}`} track={t} />
          ))}
          {tracks.length === 0 && <p className="text-muted-foreground">No tracks found for this artist.</p>}
        </div>
      </div>
    </div>
  );
}
