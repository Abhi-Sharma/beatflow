"use client";

import { usePlayerStore, PlayerTrack } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { Play, Pause, Heart, Download, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { useState } from "react";
import { AddToPlaylistMenu } from "@/components/playlists/AddToPlaylistMenu";
import { TrackCard } from "@/components/track/TrackCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface TrackDetailsClientProps {
  track: PlayerTrack;
  relatedTracks: PlayerTrack[];
}

export function TrackDetailsClient({ track, relatedTracks }: TrackDetailsClientProps) {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = usePlayerStore();
  const { favorites, toggleFavorite } = useLibraryStore();
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  
  const [isLiking, setIsLiking] = useState(false);

  const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
  const isFavorited = Boolean(favorites[`${track.source}-${track.id}`]);

  const handlePlay = () => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
    }
  };

  const handleFavorite = async () => {
    if (!userId) {
      return openSignIn();
    }
    
    toggleFavorite(track.source, String(track.id));
    setIsLiking(true);
    try {
      const result = await toggleFavoriteAction(track);
      if (result?.error) {
        toggleFavorite(track.source, String(track.id));
      }
    } catch {
      toggleFavorite(track.source, String(track.id));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col min-h-screen pb-32 relative"
    >
      {/* Blurred artwork background */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] md:h-[80vh] z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-[80px] opacity-50 scale-150 transform-gpu"
          style={{ backgroundImage: `url(${track.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-background/80 to-background" />
      </div>

      <div className="relative z-10 pt-32 pb-10 px-6 md:px-12 xl:px-24 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="shrink-0 shadow-2xl rounded-md overflow-hidden group w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 aspect-square border border-white/5"
        >
          <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col items-center text-center md:items-start md:text-left gap-2 md:gap-4 text-white"
        >
          <span className="uppercase tracking-widest font-bold text-xs bg-black/30 backdrop-blur-md text-white border border-white/10 self-center md:self-start px-3 py-1 rounded-full hidden md:block">Song</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black drop-shadow-2xl tracking-tighter leading-tight text-white py-1">
            {track.title}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-1 z-10">
            <span className="font-bold text-lg md:text-2xl hover:underline cursor-pointer">{track.artist}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mx-2" />
            <span className="text-gray-300 text-sm md:text-lg font-medium tracking-wide hidden sm:block">Jamendo Audio</span>
          </div>
        </motion.div>
      </div>

      <div className="relative flex flex-col px-6 md:px-12 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 py-6"
        >
          <Button 
            size="icon" 
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 hover:scale-105 transition-all shadow-xl shadow-emerald-900/20 text-black active:scale-95"
            onClick={handlePlay}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-8 h-8 fill-black" />
            ) : (
              <Play className="w-8 h-8 fill-black ml-1" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className={`w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${isFavorited ? 'text-emerald-500' : 'text-gray-400 hover:text-white'}`}
            onClick={handleFavorite}
            disabled={isLiking}
          >
            {isLiking ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Heart className={`w-10 h-10 transition-all duration-300 ${isFavorited ? 'fill-current scale-110 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'scale-100'}`} />
            )}
          </Button>

          <div className="w-12 h-12 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
            <AddToPlaylistMenu track={track} />
          </div>

          {track.downloadUrl && (
            <a 
              href={`/api/download?url=${encodeURIComponent(track.downloadUrl)}&name=${encodeURIComponent(track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3')}`} 
              download={`${track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`}
              rel="noopener noreferrer" 
              title="Download Full Audio"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-gray-400 hover:text-white transition-all hover:bg-white/10 hover:scale-110 active:scale-95"
            >
              <Download className="w-7 h-7" />
            </a>
          )}

          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full text-gray-400 hover:text-white transition-all hover:bg-white/10 hover:scale-110 active:scale-95">
            <Share2 className="w-7 h-7" />
          </Button>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 space-y-6"
        >
          <h2 className="text-2xl font-bold tracking-tight text-white px-2">More Tracks Like This</h2>
          {relatedTracks.length > 0 ? (
            <ScrollArea className="w-full whitespace-nowrap pb-6">
              <div className="flex space-x-6 px-2">
                {relatedTracks.map((relatedTrack) => (
                  <div key={relatedTrack.id} className="w-[180px] sm:w-[220px] shrink-0">
                    <TrackCard track={relatedTrack} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden opacity-0" />
            </ScrollArea>
          ) : (
            <p className="text-gray-400 px-2">No related tracks found.</p>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
}
