import { getJamendoCategory, getJamendoTrending } from "@/lib/api/jamendo";
import { TrackCard } from "@/components/track/TrackCard";
import { PlayerTrack } from "@/store/usePlayerStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ChevronRight, CheckCircle2, ShieldCheck, DownloadCloud, Radio, Mail } from "lucide-react";

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
    getJamendoCategory("pop", 12) // mapping new releases to pop
  ]);

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

  const trendingTracks = trending.results?.map(mapJamendo) || [];

  const premiumCategories = [
    { title: "Vlog Music", slug: "vlog", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80" },
    { title: "Cinematic", slug: "cinematic", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80" },
    { title: "LoFi", slug: "lofi", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80" },
    { title: "Gaming", slug: "gaming", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80" },
    { title: "Podcast", slug: "podcast", image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80" },
    { title: "Workout", slug: "workout", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
    { title: "Chill", slug: "chill", image: "https://images.unsplash.com/photo-1529156069898-49953eb1f5ba?w=800&q=80" },
    { title: "Travel", slug: "travel", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80" },
  ];

  const rowCategories = [
    { title: "Study & Coding Music", slug: "study-music", tracks: study.results?.map(mapJamendo) || [] },
    { title: "New Releases", slug: "new-releases", tracks: newReleases.results?.map(mapJamendo) || [] },
    { title: "Relaxing Instrumentals", slug: "relaxing", tracks: relaxing.results?.map(mapJamendo) || [] },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-32">
      <section className="px-4 md:px-8 mt-6">
        <div className="min-h-[36rem] md:min-h-[40rem] rounded-3xl bg-gradient-to-br from-emerald-950 via-zinc-950 to-black border-b border-emerald-900/30 flex flex-col justify-center relative overflow-hidden shadow-2xl mx-auto max-w-[1400px]">
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-6 shadow-sm border border-emerald-500/20 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4" />
              Creator Safe
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 drop-shadow-2xl text-white leading-[1.1]">
              Elevate Your Content <br className="hidden md:block"/> With <span className="text-emerald-400">Premium Music</span>
            </h1>
            
            <p className="text-zinc-300 max-w-2xl text-lg md:text-xl lg:text-2xl drop-shadow mb-10 font-medium leading-relaxed">
              Find the perfect royalty-free soundtrack for your videos, streams, and podcasts. Cleared for monetization globally.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/search" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-base md:text-lg font-bold transition-all focus-visible:outline-none ring-offset-background bg-emerald-500 text-black hover:bg-emerald-400 h-14 px-10 py-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95">
                Find Music for Your Video
              </Link>
              <Link href="/search?filter=free" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-base md:text-lg font-bold transition-all focus-visible:outline-none ring-offset-background bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 h-14 px-10 py-2 hover:scale-105 active:scale-95">
                Browse Free Tracks
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-sm md:text-base font-semibold text-zinc-300">Royalty-Free Music</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-sm md:text-base font-semibold text-zinc-300">Safe for Creators</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <DownloadCloud className="w-6 h-6 text-emerald-400" />
                <span className="text-sm md:text-base font-semibold text-zinc-300">Instant Download</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Radio className="w-6 h-6 text-emerald-400" />
                <span className="text-sm md:text-base font-semibold text-zinc-300">Stream Online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Category Cards */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-6 px-2">
          Browse by Vibe
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {premiumCategories.map((cat, idx) => (
            <Link href={`/category/${cat.slug}`} key={idx} className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[3/2] block shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md flex items-center group-hover:text-emerald-400 transition-colors">
                  {cat.title}
                  <ChevronRight className="ml-1 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      {trendingTracks.length > 0 && (
        <section className="space-y-5 px-4 md:px-8 max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between group px-2">
            <Link href={`/category/trending`}>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white transition-colors hover:text-emerald-400 cursor-pointer flex items-center group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                Trending This Week
                <ChevronRight className="ml-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </h2>
            </Link>
          </div>
          <ScrollArea className="w-full whitespace-nowrap pb-6">
            <div className="flex space-x-4 md:space-x-6 px-2">
              {trendingTracks.map((track) => (
                <div key={track.id} className="w-[160px] md:w-[240px] shrink-0">
                  <TrackCard track={track} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden opacity-0" />
          </ScrollArea>
        </section>
      )}

      {/* Other Categories Rows */}
      {rowCategories.map((category, index) => {
        if (category.tracks.length === 0) return null;
        return (
           <section key={index} className="space-y-5 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between group px-2">
              <Link href={`/category/${category.slug}`}>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white transition-colors hover:text-emerald-400 cursor-pointer flex items-center group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  {category.title}
                  <ChevronRight className="ml-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h2>
              </Link>
            </div>
            <ScrollArea className="w-full whitespace-nowrap pb-6">
              <div className="flex space-x-4 md:space-x-6 px-2">
                {category.tracks.map((track) => (
                  <div key={track.id} className="w-[160px] md:w-[240px] shrink-0">
                    <TrackCard track={track} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden opacity-0" />
            </ScrollArea>
          </section>
        );
      })}

      {/* Email Capture Section */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto pt-8">
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <Mail className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Fresh Royalty-Free Tracks Weekly</h2>
            <p className="text-zinc-400 text-lg mb-8">
              Join 50,000+ creators. We'll send you hand-picked music directly to your inbox so you never run out of inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-zinc-950 border border-zinc-700/50 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              />
              <button 
                type="submit" 
                className="bg-emerald-500 text-black font-bold px-8 py-4 rounded-full hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
