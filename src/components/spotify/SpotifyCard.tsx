"use client";

import { Play, Heart, Clock, ExternalLink, Sparkles, Music2 } from "lucide-react";
import { usePlayerStore, PlayerTrack } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { useState } from "react";
import Link from "next/link";

interface SpotifyCardProps {
  track: any;
}

export function SpotifyCard({ track }: SpotifyCardProps) {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = usePlayerStore();
  const { favorites, toggleFavorite } = useLibraryStore();
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  
  const [isLiking, setIsLiking] = useState(false);

  const durationMs = track.duration_ms;
  const durationText = durationMs 
    ? `${Math.floor(durationMs / 60000)}:${((durationMs % 60000) / 1000).toFixed(0).padStart(2, '0')}`
    : '';

  const playerTrack: PlayerTrack = {
    id: track.id,
    title: track.name,
    artist: track.artists?.[0]?.name || 'Unknown Artist',
    coverUrl: track.album?.images?.[0]?.url || '',
    audioUrl: track.preview_url || '',
    duration: track.preview_url ? 30 : Math.floor(durationMs / 1000), // Spotify previews are 30s
    genre: 'Spotify',
    source: 'spotify',
  };

  const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
  const isFavorited = Boolean(favorites[`spotify-${track.id}`]);

  const handlePlay = () => {
    if (!track.preview_url) {
      handleOpenSpotify(new Event('click') as any);
      return;
    }
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(playerTrack);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      return openSignIn();
    }
    
    toggleFavorite('spotify', String(track.id));
    setIsLiking(true);
    try {
      await toggleFavoriteAction(playerTrack);
    } catch (error) {
      console.error("Network Error:", error);
      toggleFavorite('spotify', String(track.id)); // revert
    } finally {
      setIsLiking(false);
    }
  };

  const handleOpenSpotify = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Smart Bridge
    alert(`SMART BRIDGE: Opening Spotify...\n\nIf you like this vibe, try searching BeatFlow for '${track.artists?.[0]?.name}' or similar royalty-free tracks!`);
    setTimeout(() => {
      window.open(track.external_urls?.spotify, '_blank');
    }, 500);
  };

  return (
    <Card className="group relative overflow-hidden bg-zinc-900 border border-zinc-800/50 transition-all hover:bg-zinc-800 hover:shadow-2xl hover:-translate-y-1 hover:shadow-emerald-500/10 cursor-default h-full flex flex-col">
      <CardContent className="p-4 flex flex-col gap-3 flex-grow">
        <div className="relative aspect-square rounded-md overflow-hidden bg-black/50">
          <div className="absolute top-2 right-2 z-10">
            <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/20 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-[#1DB954] border border-[#1DB954]/20 flex items-center gap-1 shadow-md">
               <Music2 className="w-3 h-3" /> Spotify
            </span>
          </div>
          
          {durationText && (
            <div className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-medium text-white flex items-center gap-1 border border-white/10">
              <Clock className="w-3 h-3 text-zinc-300" />
              {durationText}
            </div>
          )}
          
          <img 
            src={playerTrack.coverUrl || '/images/placeholder.jpg'} 
            alt={playerTrack.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            {track.preview_url ? (
               <Button 
                size="icon" 
                variant="default" 
                className="rounded-full w-12 h-12 shadow-[0_0_20px_rgba(29,185,84,0.4)] bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 transition-transform pointer-events-auto"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePlay(); }}
              >
                <Play className={`w-6 h-6 fill-current ${isCurrentlyPlaying ? "text-black" : "text-black ml-1"}`} />
              </Button>
            ) : (
               <Button 
                size="sm" 
                className="rounded-full shadow-[0_0_20px_rgba(29,185,84,0.4)] bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 transition-transform pointer-events-auto text-black font-bold px-4"
                onClick={handleOpenSpotify}
              >
                Open in Spotify
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-start mt-1 flex-grow">
          <div className="flex-1 truncate pr-2">
            <h4 className="font-semibold text-sm truncate text-white" title={playerTrack.title}>{playerTrack.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-zinc-400 truncate" title={playerTrack.artist}>{playerTrack.artist}</p>
            </div>
            {track.album?.name && (
              <p className="text-[10px] text-zinc-500 truncate mt-0.5" title={track.album.name}>{track.album.name}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50 mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
            onClick={(e) => {
               e.preventDefault();
               alert(`SMART BRIDGE: Check out BeatFlow tracks like '${playerTrack.artist}'!\nSearch from the main search page.`);
               window.location.href = `/search?q=${encodeURIComponent(playerTrack.artist)}`;
            }}
          >
            <Sparkles className="w-3 h-3 mr-1" /> Similar Free
          </Button>
          
          <div className="flex items-center space-x-1">
             <Button 
                variant="ghost" 
                size="icon" 
                title="Open in Spotify"
                className="h-8 w-8 text-zinc-400 hover:text-[#1DB954] transition-colors"
                onClick={handleOpenSpotify}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 transition-all duration-300 hover:scale-110 active:scale-95 ${isFavorited ? 'text-emerald-500 hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-zinc-400 hover:text-white'}`}
              onClick={handleFavorite}
              disabled={isLiking}
            >
              <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorited ? 'fill-current scale-110 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]' : 'scale-100'}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
