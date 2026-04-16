"use client";

import { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Heart, Loader2, ChevronDown } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { AddToPlaylistMenu } from "@/components/playlists/AddToPlaylistMenu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export function Player() {
  const { currentTrack, isPlaying, setIsPlaying, playNext, playPrevious, volume, setVolume } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Handle body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isExpanded]);

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

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleFavorite = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
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
      <div className="h-16 md:h-[90px] bg-zinc-950 border-t border-zinc-900 fixed bottom-[68px] md:bottom-0 left-0 right-0 px-4 md:px-6 flex items-center justify-between z-50">
        <div className="w-1/3 flex items-center gap-4">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800">
            <ListMusic className="w-5 h-5 md:w-6 md:h-6 text-zinc-700" />
          </div>
        </div>
      </div>
    );
  }

  const isFavorited = Boolean(favorites[`${currentTrack.source}-${currentTrack.id}`]);

  return (
    <>
      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        autoPlay={isPlaying}
      />
      
      {/* EXPANDED MOBILE PLAYER FULLSCREEN */}
      <AnimatePresence>
      {isExpanded && (
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 250 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
              setIsExpanded(false);
            }
          }}
          className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col md:hidden pb-8 overflow-hidden touch-none"
        >
          {/* Dynamic Blurred Background for Mobile Fullscreen */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0 bg-cover bg-center blur-[80px] opacity-30 scale-150 transform-gpu"
              style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-zinc-950/90 to-zinc-950" />
          </div>

          <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4 cursor-grab active:cursor-grabbing">
            <button onClick={() => setIsExpanded(false)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
              <ChevronDown className="w-8 h-8" />
            </button>
            <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Now Playing</span>
            <div className="w-8"></div>
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col px-8 pb-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-8 mt-auto border border-zinc-800/50 relative"
            >
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            </motion.div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col min-w-0 pr-4">
                <Link href={`/track/${currentTrack.id}`} onClick={() => setIsExpanded(false)}>
                  <h2 className="text-2xl font-black text-white truncate mb-1 hover:underline">{currentTrack.title}</h2>
                </Link>
                <p className="text-lg text-emerald-400 truncate">{currentTrack.artist}</p>
              </div>
              <button 
                className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full transition-all active:scale-90 ${isFavorited ? 'text-emerald-500' : 'text-zinc-400'}`}
                onClick={handleFavorite}
                disabled={isLiking}
              >
                {isLiking ? <Loader2 className="w-6 h-6 animate-spin" /> : <Heart className={`w-7 h-7 ${isFavorited ? 'fill-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}`} />}
              </button>
            </div>
            
            {/* Mobile Seek Bar */}
            <div className="w-full flex flex-col gap-2 mb-8 mt-auto group">
              <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden w-full flex items-center">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full cursor-pointer relative" 
                  style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                />
                <input 
                  type="range" 
                  min={0} 
                  max={duration || 100} 
                  value={progress} 
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs font-medium text-zinc-400 mt-1">
                <span className="w-12 text-left">{formatTime(progress)}</span>
                <span className="w-12 text-right">{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Mobile Main Controls */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="opacity-80 hover:opacity-100 transition-opacity">
                <AddToPlaylistMenu track={currentTrack} />
              </div>
              <button onClick={playPrevious} className="text-zinc-200 hover:text-white p-2 active:scale-95 transition-transform">
                <SkipBack className="w-10 h-10 fill-current" />
              </button>
              <button onClick={(e) => togglePlay(e)} className="w-[72px] h-[72px] flex items-center justify-center bg-emerald-500 text-black rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-90 hover:scale-105 transition-all">
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              <button onClick={playNext} className="text-zinc-200 hover:text-white p-2 active:scale-95 transition-transform">
                <SkipForward className="w-10 h-10 fill-current" />
              </button>
              <button className="text-zinc-400 p-2 invisible">
                <ListMusic className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* COMPACT PLAYER (Bottom Sticky) */}
      <div 
        className={`h-[72px] md:h-[90px] bg-zinc-950/95 md:bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 focus:outline-none fixed ${isExpanded ? 'hidden md:flex' : 'flex'} bottom-[68px] md:bottom-0 left-0 right-0 px-3 md:px-6 items-center justify-between z-[90] md:z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:cursor-default cursor-pointer`}
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsExpanded(true);
          }
        }}
      >
        {/* SEEK BAR (Mobile + Desktop) */}
        <div className="absolute left-0 right-0 top-0 -mt-[3px] md:-mt-1 h-[3px] md:h-1 group z-[100]">
          <input 
            type="range" 
            min={0} 
            max={duration || 100} 
            value={progress} 
            onChange={handleSeek}
            onClick={(e) => e.stopPropagation()}
            className="w-full absolute inset-0 z-10 opacity-0 cursor-pointer h-6 md:h-2 -top-[10px] md:-top-0.5 touch-none"
          />
          <div className="h-[3px] md:h-1 bg-zinc-800/80 w-full absolute top-0 left-0 rounded-full">
             <div 
               className={`h-full bg-emerald-500 rounded-full transition-all duration-75 ${isPlaying ? 'shadow-[0_0_12px_rgba(16,185,129,0.7)]' : ''}`} 
               style={{ width: `${(progress / (duration || 1)) * 100}%` }}
             ></div>
          </div>
        </div>

        {/* LEFT SECTION */}
        <div className="flex-1 md:flex-none md:w-[30%] flex items-center gap-3 md:gap-4 pl-1 min-w-0">
          <Link href={`/track/${currentTrack.id}`} className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className={`w-[48px] h-[48px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden shadow-lg bg-zinc-800 shrink-0 border-2 border-zinc-700/50 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
               <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover rounded-full" />
               <div className="absolute inset-0 m-auto w-3 h-3 md:w-4 md:h-4 bg-zinc-950 rounded-full border border-zinc-800"></div>
            </div>
          </Link>
          <div className="flex flex-col min-w-0 pr-2 flex-1 md:flex-none">
            <Link href={`/track/${currentTrack.id}`} onClick={(e) => e.stopPropagation()}>
              <span className="font-bold text-sm md:text-base text-zinc-100 truncate md:hover:text-emerald-400 md:hover:underline transition-colors block mb-0.5 md:mb-1">{currentTrack.title}</span>
            </Link>
            <span className="text-[11px] md:text-sm text-emerald-400/80 truncate block">{currentTrack.artist}</span>
          </div>
          <div className="hidden md:flex items-center pr-2 shrink-0">
             <button 
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90 ${isFavorited ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                onClick={(e) => handleFavorite(e)}
                disabled={isLiking}
              >
                {isLiking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-5 h-5 ${isFavorited ? 'fill-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`} />}
             </button>
          </div>
        </div>

        {/* MOBILE CONTROLS (Only Play/Pause & Heart on minified version) */}
        <div className="flex md:hidden items-center gap-4 shrink-0 pr-1">
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isFavorited ? 'text-emerald-500' : 'text-zinc-500'}`}
            onClick={(e) => handleFavorite(e)}
            disabled={isLiking}
          >
            {isLiking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-5 h-5 ${isFavorited ? 'fill-emerald-500' : ''}`} />}
          </button>
          <button onClick={(e) => togglePlay(e)} className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-md active:scale-95 shrink-0">
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-[2px]" />}
          </button>
        </div>

        {/* DESKTOP CENTER CONTROLS */}
        <div className="hidden md:flex w-[40%] flex-col items-center justify-center gap-1.5 relative">
          {isPlaying && (
            <div className="absolute inset-0 m-auto w-16 h-16 bg-emerald-500/10 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          )}
          <div className="flex items-center gap-6">
            <button onClick={playPrevious} className="text-zinc-400 hover:text-white transition p-1 hover:scale-110 active:scale-95">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button onClick={(e) => togglePlay(e)} className="w-11 h-11 flex items-center justify-center bg-emerald-500 text-black rounded-full hover:scale-105 active:scale-95 transition-all shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button onClick={playNext} className="text-zinc-400 hover:text-white transition p-1 hover:scale-110 active:scale-95">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
          <div className="flex items-center gap-3 w-full max-w-lg">
            <span className="text-[11px] font-medium text-zinc-500 w-10 text-right shrink-0">{formatTime(progress)}</span>
            <div className="flex-1 relative group flex items-center cursor-pointer h-3">
              {/* Desktop Progress internal track */}
              <div className="absolute left-0 right-0 h-1 bg-zinc-800 rounded-full overflow-hidden pointer-events-none group-hover:h-1.5 transition-all">
                <div 
                  className="h-full bg-emerald-500 rounded-full group-hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                />
              </div>
              <input 
                type="range" 
                min={0} 
                max={duration || 100} 
                value={progress} 
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[11px] font-medium text-zinc-500 w-10 shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        {/* DESKTOP RIGHT CONTROLS */}
        <div className="hidden md:flex w-[30%] items-center justify-end gap-5 pr-2 md:pr-4">
          <AddToPlaylistMenu track={currentTrack} />
          <button className="text-zinc-400 hover:text-white transition w-8 h-8 flex items-center justify-center">
            <ListMusic className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 w-28 lg:w-32 ml-2 group">
            <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-zinc-400 hover:text-emerald-400 transition">
               {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </>
  );
}
