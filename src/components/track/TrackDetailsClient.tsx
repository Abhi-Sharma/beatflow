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
    <div className="flex flex-col min-h-screen pb-32 animate-in fade-in duration-700">
      <div className="relative pt-32 pb-16 px-6 md:px-12 xl:px-24 bg-gradient-to-b from-gray-800 to-background flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        
        <div className="relative z-10 shrink-0 shadow-2xl rounded-sm overflow-hidden group w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 aspect-square">
          <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 text-white">
          <span className="uppercase tracking-widest font-bold text-xs bg-emerald-500/20 text-emerald-400 self-center md:self-start px-2 py-1 rounded hidden md:block">Song</span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black drop-shadow-lg tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {track.title}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-1 md:mt-2">
            <span className="font-bold text-lg md:text-xl hover:underline cursor-pointer">{track.artist}</span>
            <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-gray-400 mx-2" />
            <span className="text-gray-300 text-sm md:text-base font-medium tracking-wide hidden sm:block">Jamendo Audio</span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col px-6 md:px-12 xl:px-24">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 py-8">
          <Button 
            size="icon" 
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 hover:scale-105 transition-all shadow-xl shadow-emerald-900/20"
            onClick={handlePlay}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-8 h-8 fill-black text-black" />
            ) : (
              <Play className="w-8 h-8 fill-black text-black ml-1" />
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
              <Heart className={`w-10 h-10 transition-all duration-300 ${isFavorited ? 'fill-current scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'scale-100'}`} />
            )}
          </Button>

          <div className="w-12 h-12 flex items-center justify-center">
            <AddToPlaylistMenu track={track} />
          </div>

          {track.downloadUrl && (
            <a 
              href={track.downloadUrl} 
              download={`${track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`}
              rel="noopener noreferrer" 
              title="Download Full Audio"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-gray-400 hover:text-white transition-colors hover:bg-accent/50"
            >
              <Download className="w-8 h-8" />
            </a>
          )}

          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full text-gray-400 hover:text-white transition-colors">
            <Share2 className="w-7 h-7" />
          </Button>
        </div>

        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">More Tracks Like This</h2>
          {relatedTracks.length > 0 ? (
            <ScrollArea className="w-full whitespace-nowrap pb-6">
              <div className="flex space-x-6">
                {relatedTracks.map((relatedTrack) => (
                  <div key={relatedTrack.id} className="w-[200px] shrink-0">
                    <TrackCard track={relatedTrack} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden opacity-0" />
            </ScrollArea>
          ) : (
            <p className="text-gray-400">No related tracks found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
