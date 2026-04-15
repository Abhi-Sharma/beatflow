import { getJamendoFreeMusic } from "@/lib/api/jamendo";
import { TrackCard } from "@/components/track/TrackCard";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  if (!slug.startsWith("free-") || !slug.endsWith("-music")) {
    return {};
  }
  
  const mood = slug.replace("free-", "").replace("-music", "").replace(/-/g, ' ');
  
  return {
    title: `Free Royalty-Free ${mood} Music | BeatFlow`,
    description: `Download and listen to the best free no-copyright ${mood} music for your videos, vlogs, and streams.`,
    openGraph: {
      title: `Free ${mood} Music | BeatFlow`,
      description: `Royalty-free ${mood} background music.`,
      type: "website",
    }
  };
}

export default async function GenericSEOPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!slug.startsWith("free-") || !slug.endsWith("-music")) {
    notFound();
  }

  const mood = slug.replace("free-", "").replace("-music", "");
  const res = await getJamendoFreeMusic(mood, 30);

  const mapJamendo = (t: any) => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    source: 'jamendo' as const,
  });

  const tracks = (res.results || []).map(mapJamendo);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="h-64 bg-gradient-to-br from-primary/20 to-background rounded-xl p-8 flex items-end">
        <div>
          <h1 className="text-5xl font-bold tracking-tight capitalize drop-shadow-lg text-foreground mb-2">Free {mood.replace(/-/g, ' ')} Music</h1>
          <p className="text-muted-foreground text-lg">Top royalty-free {mood} tracks for creators.</p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tracks.map((t) => (
            <TrackCard key={`free-track-${t.id}`} track={t} />
          ))}
          {tracks.length === 0 && <p className="text-muted-foreground">No tracks found for this mood.</p>}
        </div>
      </div>
    </div>
  );
}
