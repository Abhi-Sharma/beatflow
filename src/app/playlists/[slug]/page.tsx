import { getPlaylistBySlug, curatedPlaylists } from "@/lib/curated-playlists";
import { getJamendoCategory } from "@/lib/api/jamendo";
import { PlayerTrack } from "@/store/usePlayerStore";
import { notFound } from "next/navigation";
import { PlaylistActions } from "@/components/playlists/PlaylistActions";
import { PlaylistTrackRow } from "@/components/playlists/PlaylistTrackRow";
import { PlaylistCard } from "@/components/playlists/PlaylistCard";
import { Metadata } from 'next';
import Image from "next/image"; // optional improvement, though standard img used successfully before. We'll use img for consistency.

export async function generateStaticParams() {
  return curatedPlaylists.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const playlist = getPlaylistBySlug(slug);
  
  if (!playlist) return {};

  return {
    title: `${playlist.title} | Curated Playlist | BeatFlow`,
    description: playlist.description,
    openGraph: {
      title: playlist.title,
      description: playlist.description,
      images: [{ url: playlist.coverImage }],
      type: "music.playlist",
    }
  };
}

export default async function PlaylistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const playlist = getPlaylistBySlug(slug);
  
  if (!playlist) {
    notFound();
  }

  // Dynamic fetch leveraging the apiQuery parameter configured in the curated playlist definition
  const res = await getJamendoCategory(playlist.apiQuery, playlist.totalTracks || 25);

  const mapJamendo = (t: any): PlayerTrack => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    downloadUrl: t.audiodownload || undefined,
    duration: t.duration,
    source: 'jamendo',
  });

  const tracks = (res.results || []).map(mapJamendo);

  // If zero tracks returned, we'll gracefully show an empty state, but it should populate
  const displayTotal = tracks.length;
  // Calculate total seconds for display (optional)
  const totalSeconds = tracks.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div className="animate-in fade-in pb-24 w-full">
      {/* Header Profile Section (Spotify Style) */}
      <div className="relative pt-16 md:pt-24 pb-8 md:pb-12 px-4 md:px-8 mt-6">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-b-3xl">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-[100px] opacity-30 transform-gpu scale-150"
            style={{ backgroundImage: `url(${playlist.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 max-w-[1400px] mx-auto pt-8">
          <div className="w-56 h-56 md:w-60 md:h-60 shrink-0 shadow-2xl shadow-black/50 bg-zinc-800 rounded-xl overflow-hidden border border-white/10 group">
             <img 
               src={playlist.coverImage} 
               alt={playlist.title} 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
             />
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-0">
             <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-300 mb-2 md:mb-3 flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
               Curated Public Playlist
             </span>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 md:mb-6 line-clamp-2 md:line-clamp-none drop-shadow-lg leading-tight md:leading-none">
               {playlist.title}
             </h1>
             <p className="text-zinc-300 text-sm md:text-base font-medium max-w-2xl mb-4 md:mb-5 leading-relaxed drop-shadow">
               {playlist.description}
             </p>
             
             <div className="flex items-center gap-2 text-sm text-zinc-400 font-semibold mb-2">
               <span className="text-white hover:underline cursor-pointer">BeatFlow Sound</span>
               <span>•</span>
               <span>{displayTotal} tracks</span>
               {totalMinutes > 0 && (
                 <>
                   <span>•</span>
                   <span>{totalMinutes > 60 ? `${Math.floor(totalMinutes / 60)} hr ${totalMinutes % 60} min` : `${totalMinutes} min`}</span>
                 </>
               )}
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Playback Actions Bar */}
        <div className="relative z-20 -mt-2 mb-6">
          <PlaylistActions tracks={tracks} />
        </div>

        {/* Tracks List */}
        <div className="flex flex-col pb-8">
          <div className="grid grid-cols-[32px_1fr_40px] md:grid-cols-[40px_1fr_1fr_80px] gap-2 md:gap-4 px-2 md:px-4 py-2 border-b border-zinc-800/60 text-xs md:text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wider sticky top-0 bg-background/95 backdrop-blur-md z-10 pt-4">
            <div className="text-center">#</div>
            <div>Title</div>
            <div className="hidden md:block">Artist</div>
            <div className="text-right">Time</div>
          </div>
          
          <div className="space-y-1">
            {tracks.length > 0 ? (
              tracks.map((t, idx) => (
                <PlaylistTrackRow key={`curated-${playlist.slug}-${t.id}`} track={t} index={idx} allTracks={tracks} />
              ))
            ) : (
              <div className="py-12 text-center text-zinc-500">
                 No tracks found in this collection.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Playlists Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 md:mt-20 border-t border-zinc-800/60 pt-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">More Like This</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {curatedPlaylists
            .filter((p) => p.slug !== playlist.slug)
            .sort(() => 0.5 - Math.random()) // Randomize slightly for dynamic feel
            .slice(0, 5) // Show top 5
            .map((relatedPlaylist) => (
              <PlaylistCard key={`related-${relatedPlaylist.id}`} playlist={relatedPlaylist} />
            ))}
        </div>
      </div>
    </div>
  );
}
