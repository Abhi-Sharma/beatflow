import { Metadata } from "next";
import { getJamendoCategory } from "@/lib/api/jamendo";
import { TrackCard } from "@/components/track/TrackCard";
import { PlayerTrack } from "@/store/usePlayerStore";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";

export const revalidate = 86400; // Cache for 24 hours (static-like)

const SEO_PAGES: Record<string, any> = {
  "youtube-shorts": {
    title: "Free Music for YouTube Shorts | No Copyright Beats",
    description: "Download the best royalty-free music for YouTube Shorts. Perfect trending 60-second background tracks for creators to boost engagement legally.",
    h1: "Free Music for YouTube Shorts",
    subtitle: "High-energy, engaging tracks designed specifically for vertical short-form content. 100% royalty-free and safe from copyright strikes.",
    tag: "upbeat"
  },
  "vlog-background": {
    title: "Free Vlog Background Music | Monetization Safe",
    description: "Premium vlog background music free for content creators. Upbeat, cinematic, and chill tracks completely safe for YouTube monetization.",
    h1: "Free Vlog Background Music",
    subtitle: "Provide the perfect vibe for your daily life vlogs with high-quality background tracks perfectly mixed for voiceover compatibility.",
    tag: "vlog"
  },
  "gaming": {
    title: "Royalty Free Gaming Music | Electronic & Epic",
    description: "Epic royalty-free gaming music for Twitch streams and let's play videos. Find energetic EDM and trap tracks for your next stream.",
    h1: "Royalty Free Gaming Music",
    subtitle: "Level up your gaming content with high-octane electronic tracks, synthwave, and epic beats crafted for gamers and streamers.",
    tag: "gaming"
  },
  "podcast-intro": {
    title: "Podcast Intro Music Free | Professional & Catchy",
    description: "Catchy and professional podcast intro music free to download. Start your show with the perfect royalty-free theme song.",
    h1: "Free Podcast Intro Music",
    subtitle: "Make a memorable first impression with our curated selection of short, punchy instrumental tracks ideal for podcast intros and transitions.",
    tag: "ambient"
  }
};

interface SEOPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: SEOPageProps): Promise<Metadata> {
  const pageData = SEO_PAGES[params.slug];
  
  if (!pageData) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: pageData.title,
    description: pageData.description,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(SEO_PAGES).map((slug) => ({
    slug,
  }));
}

export default async function SEOLandingPage({ params }: SEOPageProps) {
  const pageData = SEO_PAGES[params.slug];
  
  if (!pageData) {
    notFound();
  }

  // Fetch some tracks based on the tag
  const searchResults = await getJamendoCategory(pageData.tag, 20);

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

  const tracks = searchResults.results?.map(mapJamendo) || [];

  return (
    <div className="min-h-screen bg-black animate-in fade-in pb-32">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent opacity-70 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Clear for Monetization
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            {pageData.h1}
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {pageData.subtitle}
          </p>
        </div>
      </section>

      {/* Breadcrumbs & Results */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 -mt-6 relative z-20">
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-8 bg-zinc-900/80 w-max px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/free-music" className="hover:text-white transition-colors">Free Music</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-300">{pageData.h1}</span>
        </div>

        {tracks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {tracks.map((track) => (
              <TrackCard key={`seo-${track.id}`} track={track} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
             <p className="text-zinc-400">Loading premium tracks...</p>
          </div>
        )}
      </section>

      <section className="max-w-[1000px] mx-auto px-6 mt-24">
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center prose prose-invert mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Why Download from BeatFlow?</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
               As a creator, getting a copyright strike is the worst. We've built an exclusive library of royalty-free music that guarantees you will never have to worry about copyright claims or takedown notices. Whether you upload to YouTube, TikTok, or stream on Twitch, our high-quality music is 100% legal to use and completely free.
            </p>
         </div>
      </section>
    </div>
  );
}
