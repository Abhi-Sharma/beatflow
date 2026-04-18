"use client";

import { usePlayerStore, PlayerTrack } from "@/store/usePlayerStore";
import { Play, Pause, Shuffle, Heart, Share2, Check } from "lucide-react";
import { useState } from "react";

export function PlaylistActions({ tracks }: { tracks: PlayerTrack[] }) {
  const { setQueue, setCurrentTrack, isPlaying, currentTrack, setIsPlaying } = usePlayerStore();
  const [copied, setCopied] = useState(false);

  // Check if exactly this playlist is currently playing by checking if the current track belongs to this list
  const isCurrentPlaylist = currentTrack && tracks.some(t => t.id === currentTrack.id);

  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    if (isCurrentPlaylist) {
      setIsPlaying(!isPlaying);
      return;
    }
    setQueue(tracks);
    setCurrentTrack(tracks[0]);
  };

  const handleShuffle = () => {
    if (tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentTrack(shuffled[0]);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 md:gap-6 py-6">
      <button 
        onClick={handlePlayAll}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
      >
        {isCurrentPlaylist && isPlaying ? (
          <Pause className="w-6 h-6 md:w-7 md:h-7 fill-current" />
        ) : (
          <Play className="w-6 h-6 md:w-7 md:h-7 ml-1 fill-current" />
        )}
      </button>
      <button 
        onClick={handleShuffle}
        className="p-2 md:p-3 text-zinc-400 hover:text-white transition-colors hover:scale-105 active:scale-95"
      >
        <Shuffle className="w-7 h-7 md:w-8 md:h-8" />
      </button>
      <button 
        onClick={() => {}} // User favorites future stub
        className="p-2 md:p-3 text-zinc-400 hover:text-white transition-colors hover:scale-105 active:scale-95"
      >
        <Heart className="w-7 h-7 md:w-8 md:h-8" />
      </button>
      <button 
        onClick={handleShare}
        className="p-2 md:p-3 text-zinc-400 hover:text-white transition-colors hover:scale-105 active:scale-95 ml-auto md:ml-4"
      >
        {copied ? <Check className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" /> : <Share2 className="w-6 h-6 md:w-7 md:h-7" />}
      </button>
    </div>
  );
}
