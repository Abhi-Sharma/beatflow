import Link from "next/link";
import { Play } from "lucide-react";
import { PlayerTrack, usePlayerStore } from "@/store/usePlayerStore";

export function RecentlyPlayedCard({ track }: { track: any }) {
  const { setCurrentTrack } = usePlayerStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const playerTrack: PlayerTrack = {
      id: String(track.id), // Ensure it's string
      title: track.title,
      artist: track.artist,
      coverUrl: track.coverUrl,
      audioUrl: track.audioUrl,
      source: track.source,
    };
    setCurrentTrack(playerTrack);
  };

  return (
    <Link href={`/track/${track.id}`} className="block group w-full h-full">
      <div className="bg-zinc-900/40 hover:bg-zinc-800/80 rounded-xl p-3 transition-colors flex items-center gap-4 h-full border border-zinc-800/50 shadow-sm relative overflow-hidden group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        
        {/* Artwork */}
        <div className="w-[56px] h-[56px] shrink-0 rounded-md overflow-hidden relative shadow-md">
          <img 
            src={track.coverUrl} 
            alt={track.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <button 
               onClick={handlePlay}
               className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all pointer-events-auto hover:scale-110 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col min-w-0 pr-2 flex-grow justify-center">
          <span className="font-bold text-[15px] text-zinc-100 truncate mb-0.5 group-hover:text-emerald-400 transition-colors">
            {track.title}
          </span>
          <span className="text-[13px] text-zinc-400 truncate">
            {track.artist}
          </span>
        </div>
        
      </div>
    </Link>
  );
}
