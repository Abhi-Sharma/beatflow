"use client";

import { Play, Heart, Loader2, Download } from "lucide-react";
import { usePlayerStore, PlayerTrack } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { useState } from "react";
import { AddToPlaylistMenu } from "@/components/playlists/AddToPlaylistMenu";
import Link from "next/link";

interface TrackCardProps {
  track: PlayerTrack;
}

export function TrackCard({ track }: TrackCardProps) {
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

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      return openSignIn();
    }
    
    toggleFavorite(track.source, String(track.id));
    
    setIsLiking(true);
    try {
      const result = await toggleFavoriteAction(track);
      if (result?.error) {
        console.error("Backend Error:", result.error);
        toggleFavorite(track.source, String(track.id));
      }
    } catch (error) {
      console.error("Network Error:", error);
      toggleFavorite(track.source, String(track.id));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card/50 hover:bg-secondary/50 border-transparent transition-all hover:shadow-xl cursor-default">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="relative aspect-square rounded-md overflow-hidden bg-secondary">
          <Link href={`/track/${track.id}`}>
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
            />
          </Link>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <Button 
              size="icon" 
              variant="default" 
              className="rounded-full w-12 h-12 shadow-[0_0_15px_rgba(16,185,129,0.5)] bg-emerald-500 hover:bg-emerald-400 hover:scale-105 transition-transform pointer-events-auto"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePlay(); }}
            >
              <Play className={`w-6 h-6 fill-current ${isCurrentlyPlaying ? "text-black" : "text-black ml-1"}`} />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-start mt-2">
          <div className="flex-1 truncate pr-2">
            <Link href={`/track/${track.id}`} className="hover:underline">
              <h4 className="font-semibold text-sm truncate text-foreground">{track.title}</h4>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
          </div>
          <div className="flex items-center z-10 space-x-1 shrink-0">
            <AddToPlaylistMenu track={track} />
            
            {track.downloadUrl && (
              <a 
                href={`/api/download?url=${encodeURIComponent(track.downloadUrl)}&name=${encodeURIComponent(track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3')}`} 
                download={`${track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`} 
                rel="noopener noreferrer" 
                title="Download Free Track" 
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent/50 h-8 w-8 text-muted-foreground hover:text-emerald-400"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 transition-all duration-300 hover:scale-110 active:scale-95 ${isFavorited ? 'text-emerald-500 hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={handleFavorite}
              disabled={isLiking}
            >
              {isLiking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorited ? 'fill-current scale-110 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]' : 'scale-100'}`} />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
