import { getJamendoCategory, getJamendoTrending } from "@/lib/api/jamendo";
import { TrackCard } from "@/components/track/TrackCard";
import { PlayerTrack } from "@/store/usePlayerStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function Home() {
  const [
    trending,
    study,
    workout,
    chill,
    gaming,
    cinematic,
    vlog,
    relaxing,
    lofi,
    newReleases
  ] = await Promise.all([
    getJamendoTrending(12),
    getJamendoCategory("study", 12),
    getJamendoCategory("workout", 12),
    getJamendoCategory("chill", 12),
    getJamendoCategory("gaming", 12),
    getJamendoCategory("cinematic", 12),
    getJamendoCategory("upbeat", 12), // mapping vlog to upbeat
    getJamendoCategory("relaxing", 12),
    getJamendoCategory("lofi", 12),
    getJamendoCategory("pop", 12) // mapping new releases to general popular pop
  ]);

  const mapJamendo = (t: any): PlayerTrack => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    downloadUrl: t.audiodownload || undefined,
    source: 'jamendo',
  });

  const categories = [
    { title: "Trending Now", slug: "trending", tracks: trending.results?.map(mapJamendo) || [] },
    { title: "Study & Coding Music", slug: "study-music", tracks: study.results?.map(mapJamendo) || [] },
    { title: "Gym Workout Tracks", slug: "workout", tracks: workout.results?.map(mapJamendo) || [] },
    { title: "Chill Vibes", slug: "chill-vibes", tracks: chill.results?.map(mapJamendo) || [] },
    { title: "Gaming Music", slug: "gaming", tracks: gaming.results?.map(mapJamendo) || [] },
    { title: "Cinematic Background", slug: "cinematic", tracks: cinematic.results?.map(mapJamendo) || [] },
    { title: "Vlog Creator Music", slug: "vlog", tracks: vlog.results?.map(mapJamendo) || [] },
    { title: "Relaxing Instrumentals", slug: "relaxing", tracks: relaxing.results?.map(mapJamendo) || [] },
    { title: "LoFi Beats", slug: "lofi", tracks: lofi.results?.map(mapJamendo) || [] },
    { title: "New Releases", slug: "new-releases", tracks: newReleases.results?.map(mapJamendo) || [] },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-32">
      <section>
        <div className="min-h-[32rem] py-24 px-8 md:px-12 rounded-3xl bg-gradient-to-tr from-emerald-950 via-gray-900 to-black border-b border-emerald-900/50 flex flex-col justify-center relative overflow-hidden shadow-2xl mx-4 mt-6">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 max-w-4xl">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-4 shadow-sm border border-emerald-500/20">Creator Safe</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 md:mb-6 drop-shadow-xl text-white leading-tight">
              Royalty-Free Music,<br className="hidden md:block"/> Legal to Stream & Download
            </h1>
            <p className="text-gray-300 max-w-2xl text-lg md:text-xl lg:text-2xl drop-shadow mb-8 md:mb-10 font-medium leading-relaxed">
              Explore 100% royalty-free independent tracks. Secure the perfect beat for your content creation legally and effortlessly.
            </p>
            <div className="flex gap-4">
              <Link href="/search" className="inline-flex items-center justify-center rounded-full text-base md:text-lg font-bold transition-all focus-visible:outline-none ring-offset-background bg-emerald-500 text-black hover:bg-emerald-400 h-12 md:h-14 px-8 md:px-10 py-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95">
                Browse Tracks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {categories.map((category, index) => {
        if (category.tracks.length === 0) return null;
        return (
           <section key={index} className="space-y-5 px-6 md:px-8">
            <div className="flex items-center justify-between group">
              <Link href={`/category/${category.slug}`}>
                <h2 className="text-3xl font-extrabold tracking-tight text-white transition-colors hover:text-emerald-400 cursor-pointer flex items-center group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  {category.title}
                  <ChevronRight className="ml-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h2>
              </Link>
            </div>
            <ScrollArea className="w-full whitespace-nowrap pb-6">
              <div className="flex space-x-6">
                {category.tracks.map((track) => (
                  <div key={track.id} className="w-[240px] md:w-[280px] shrink-0">
                    <TrackCard track={track} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden opacity-0" />
            </ScrollArea>
          </section>
        );
      })}
    </div>
  );
}
