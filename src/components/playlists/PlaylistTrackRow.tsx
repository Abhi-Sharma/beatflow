"use client";

import { usePlayerStore, PlayerTrack } from "@/store/usePlayerStore";
import { Play, Pause } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useLibraryStore } from "@/store/useLibraryStore";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { useState } from "react";

export function PlaylistTrackRow({ track, index, allTracks }: { track: PlayerTrack, index: number, allTracks: PlayerTrack[] }) {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, setQueue } = usePlayerStore();
  const { favorites, toggleFavorite } = useLibraryStore();
  const { userId } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const isActive = currentTrack?.id === track.id;

  const handlePlayRow = () => {
    if (isActive) {
      setIsPlaying(!isPlaying);
    } else {
      setQueue(allTracks);
      setCurrentTrack(track);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return; // Add auth wall if you want
    toggleFavorite(track.source, String(track.id));
    setIsLiking(true);
    try {
      await toggleFavoriteAction(track);
    } finally {
      setIsLiking(false);
    }
  };

  const isFavorited = Boolean(favorites[`${track.source}-${track.id}`]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "--:--";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div 
      onClick={handlePlayRow}
      className={`group flex items-center grid grid-cols-[32px_1fr_40px] md:grid-cols-[40px_1fr_1fr_80px] gap-2 md:gap-4 px-2 md:px-4 py-2.5 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'}`}
    >
      <div className="flex justify-center items-center h-full text-zinc-400 font-medium w-full">
        <span className="group-hover:hidden block">{isActive ? <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" /> : index + 1}</span>
        <button className="hidden group-hover:flex items-center justify-center text-white">
          {isActive && isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
      </div>

      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800 rounded shadow-md overflow-hidden shrink-0">
          {track.coverUrl && <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-col min-w-0">
          <span className={`truncate md:text-base text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-zinc-100 group-hover:text-white'}`}>{track.title}</span>
          <span className="truncate text-xs md:text-sm text-zinc-400 md:hidden">{track.artist}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center min-w-0 pr-4">
        <span className="text-sm text-zinc-400 truncate hover:text-zinc-200 hover:underline">{track.artist}</span>
      </div>

      <div className="flex items-center justify-end gap-3 md:gap-6 pr-2 relative text-zinc-400">
        <button 
           onClick={handleFavorite} 
           disabled={isLiking}
           className={`md:opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 ${isFavorited ? 'opacity-100 text-emerald-500 fill-emerald-500' : 'hover:text-white'} `}
        >
          <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorited ? 'fill-emerald-500' : ''}`} />
        </button>
        <span className="text-sm tabular-nums w-[40px] text-right">{formatTime(track.duration || 0)}</span>
      </div>
    </div>
  );
}
