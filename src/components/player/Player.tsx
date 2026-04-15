"use client";

import { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Heart, Loader2 } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { AddToPlaylistMenu } from "@/components/playlists/AddToPlaylistMenu";
import Link from "next/link";

export function Player() {
  const { currentTrack, isPlaying, setIsPlaying, playNext, playPrevious, volume, setVolume } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const { favorites, toggleFavorite } = useLibraryStore();
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setProgress(val);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleFavorite = async () => {
    if (!currentTrack) return;
    if (!userId) {
      return openSignIn();
    }
    
    toggleFavorite(currentTrack.source, String(currentTrack.id));
    setIsLiking(true);
    try {
      const result = await toggleFavoriteAction(currentTrack);
      if (result?.error) {
        toggleFavorite(currentTrack.source, String(currentTrack.id));
      }
    } catch {
      toggleFavorite(currentTrack.source, String(currentTrack.id));
    } finally {
      setIsLiking(false);
    }
  };

  if (!currentTrack) {
    return (
      <div className="h-16 md:h-28 bg-zinc-950 border-t border-zinc-900 fixed bottom-[68px] md:bottom-0 left-0 right-0 px-4 md:px-6 flex items-center justify-between z-50">
        <div className="w-1/3 flex items-center gap-4">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-zinc-900 rounded-md flex items-center justify-center">
            <ListMusic className="w-5 h-5 md:w-6 md:h-6 text-zinc-700" />
          </div>
        </div>
      </div>
    );
  }

  const isFavorited = Boolean(favorites[`${currentTrack.source}-${currentTrack.id}`]);

  return (
    <div className="h-[72px] md:h-28 bg-zinc-950/95 md:bg-zinc-950 backdrop-blur-xl md:backdrop-blur-none border-t border-zinc-900 fixed bottom-[68px] md:bottom-0 left-0 right-0 px-3 md:px-6 flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:shadow-none">
      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        autoPlay={isPlaying}
      />

      {/* LEFT SECTION (Mobile: Flex-1 takes remaining space) */}
      <div className="flex-1 md:flex-none md:w-[30%] flex items-center gap-3 md:gap-4 pl-1 min-w-0">
        <Link href={`/track/${currentTrack.id}`} className="shrink-0 group">
          <div className="w-[48px] h-[48px] md:w-16 md:h-16 rounded-md overflow-hidden shadow-lg bg-zinc-800">
            <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-300" />
          </div>
        </Link>
        <div className="flex flex-col min-w-0 pr-2 flex-1 md:flex-none">
          <Link href={`/track/${currentTrack.id}`}>
            <span className="font-bold text-sm md:text-base hover:text-emerald-400 hover:underline cursor-pointer truncate text-zinc-100 block transition-colors leading-tight mb-0.5 md:mb-1">{currentTrack.title}</span>
          </Link>
          <span className="text-[11px] md:text-sm text-zinc-400 truncate">{currentTrack.artist}</span>
        </div>
        <div className="hidden md:flex items-center shrink-0">
           <button 
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isFavorited ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
              onClick={handleFavorite}
              disabled={isLiking}
            >
              {isLiking ? (
                 <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                 <Heart className={`w-4 h-4 ${isFavorited ? 'fill-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`} />
              )}
           </button>
        </div>
      </div>

      {/* MOBILE CONTROLS (Only visible on small screens) */}
      <div className="flex md:hidden items-center gap-3 shrink-0 pr-1">
        <button 
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isFavorited ? 'text-emerald-500' : 'text-zinc-500'}`}
          onClick={handleFavorite}
          disabled={isLiking}
        >
          {isLiking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-5 h-5 ${isFavorited ? 'fill-emerald-500' : ''}`} />}
        </button>
        <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-md active:scale-95">
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-[2px]" />}
        </button>
      </div>

      {/* DESKTOP CENTER CONTROLS (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/3 flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <button onClick={playPrevious} className="text-zinc-400 hover:text-white transition p-1">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button onClick={togglePlay} className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shrink-0 shadow-lg">
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-[2px]" />}
          </button>
          <button onClick={playNext} className="text-zinc-400 hover:text-white transition p-1">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="text-[11px] font-medium text-zinc-400 w-8 text-right shrink-0">{formatTime(progress)}</span>
          <input 
            type="range" 
            min={0} 
            max={duration || 100} 
            value={progress} 
            onChange={handleSeek}
            className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-emerald-500 transition-colors"
          />
          <span className="text-[11px] font-medium text-zinc-400 w-8 shrink-0">{formatTime(duration)}</span>
        </div>
      </div>

      {/* DESKTOP RIGHT CONTROLS (Hidden on Mobile) */}
      <div className="hidden md:flex w-[30%] items-center justify-end gap-5 pr-4 md:pr-8">
        <AddToPlaylistMenu track={currentTrack} />
        <button className="text-zinc-400 hover:text-white transition w-8 h-8 flex items-center justify-center">
          <ListMusic className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 w-28 lg:w-32 ml-2 group">
          <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-zinc-400 hover:text-white transition">
             {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white group-hover:accent-emerald-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
