import { getJamendoCategory, getJamendoTrending } from "@/lib/api/jamendo";
import { TrackCard } from "@/components/track/TrackCard";
import { PlayerTrack } from "@/store/usePlayerStore";
import { ArrowLeft, Library } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} Music | BeatFlow Premium`,
    description: `Listen to and download free ${title} tracks, curated for you on BeatFlow. No copyright music for creators.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const categoryMap: Record<string, { title: string; tag: string; type: "tag" | "trending" }> = {
    "lofi": { title: "LoFi Beats", tag: "lofi", type: "tag" },
    "workout": { title: "Gym Workout Tracks", tag: "workout", type: "tag" },
    "study-music": { title: "Study & Coding Music", tag: "study", type: "tag" },
    "chill-vibes": { title: "Chill Vibes", tag: "chill", type: "tag" },
    "gaming": { title: "Gaming Music", tag: "gaming", type: "tag" },
    "cinematic": { title: "Cinematic Background", tag: "cinematic", type: "tag" },
    "relaxing": { title: "Relaxing Instrumentals", tag: "relaxing", type: "tag" },
    "vlog": { title: "Vlog Creator Music", tag: "upbeat", type: "tag" },
    "new-releases": { title: "New Releases", tag: "pop", type: "tag" },
    "trending": { title: "Global Trending", tag: "", type: "trending" },
  };

  const config = categoryMap[slug];

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Library className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Category Not Found</h1>
        <p className="text-muted-foreground">We couldn't find the requested music category.</p>
        <Link href="/" className="mt-8">
          <Button variant="default">Return Home</Button>
        </Link>
      </div>
    );
  }

  let dataRes;
  if (config.type === "trending") {
    dataRes = await getJamendoTrending(50);
  } else {
    dataRes = await getJamendoCategory(config.tag, 50); // Deep fetch
  }

  const tracksData = dataRes.results || [];

  const mapJamendo = (t: any): PlayerTrack => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    downloadUrl: t.audiodownload || undefined,
    source: 'jamendo',
  });

  const formattedTracks = tracksData.map(mapJamendo);

  return (
    <div className="flex flex-col h-full pl-6 pr-6 py-6 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 mt-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-zinc-800 transition-colors shrink-0">
            <ArrowLeft className="w-6 h-6 text-zinc-300" />
          </Button>
        </Link>
        <div className="bg-gradient-to-br from-emerald-500/20 to-transparent p-6 rounded-3xl border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
          <Library className="w-12 h-12" />
        </div>
        <div className="flex flex-col pl-2">
          <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-1.5 drop-shadow-sm">Curated Category</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">{config.title}</h1>
          <span className="text-sm font-medium text-zinc-400 mt-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {formattedTracks.length} Premium Tracks
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-emerald-900/50 via-zinc-800 to-transparent mb-10" />

      {formattedTracks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <p className="text-2xl font-bold text-white mb-2">No tracks available</p>
          <p className="text-zinc-400">Jamendo API might be experiencing issues with this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {formattedTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}
