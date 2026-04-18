import Link from "next/link";
import { Play, Disc3 } from "lucide-react";
import { CuratedPlaylist } from "@/lib/curated-playlists";

export function PlaylistCard({ playlist }: { playlist: CuratedPlaylist }) {
  return (
    <Link href={`/playlists/${playlist.slug}`}>
      <div className="group bg-zinc-900/40 rounded-2xl p-4 md:p-5 border border-zinc-800/50 hover:bg-zinc-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20 cursor-pointer h-full flex flex-col relative overflow-hidden">
        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 shadow-lg bg-zinc-800 border border-zinc-700/50">
          <img 
            src={playlist.coverImage} 
            alt={playlist.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95">
              <Play className="w-6 h-6 ml-1 fill-current" />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-bold text-base md:text-lg text-white mb-2 truncate group-hover:text-emerald-400 transition-colors">{playlist.title}</h3>
          <p className="text-xs md:text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-3 flex-1 group-hover:text-zinc-300 transition-colors">{playlist.description}</p>
          
          <div className="flex items-center text-[10px] md:text-xs font-semibold text-zinc-500 mt-auto uppercase tracking-wider gap-1.5 group-hover:text-emerald-500/80 transition-colors">
             <Disc3 className="w-3.5 h-3.5" />
             {playlist.totalTracks} Tracks
          </div>
        </div>
      </div>
    </Link>
  );
}
