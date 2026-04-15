"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { TrackCard } from "@/components/track/TrackCard";
import { PlayerTrack } from "@/store/usePlayerStore";

export function SearchInterface() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ jamendo: any[] }>({ jamendo: [] });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults({ jamendo: [] });
      return;
    }

    const fetchSearch = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        
        if (!res.ok) {
          throw new Error('API returned an error');
        }
        
        const data = await res.json();
        
        setResults({
          jamendo: Array.isArray(data.jamendo) ? data.jamendo : []
        });
      } catch (error) {
        console.error("Failed to fetch search results", error);
        setResults({ jamendo: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearch();
  }, [debouncedQuery]);

  const mapJamendo = (t: any): PlayerTrack => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    downloadUrl: t.audiodownload || undefined,
    source: 'jamendo',
  });

  const jamendoTracks = results.jamendo.map(mapJamendo);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search Jamendo for tracks, lofi, workout, acoustic..." 
          className="pl-10 h-12 bg-card border-border text-lg rounded-full focus-visible:ring-primary shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && <Loader2 className="absolute right-4 top-3 h-5 w-5 text-muted-foreground animate-spin" />}
      </div>

      {debouncedQuery && (
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-[260px] w-full rounded-xl bg-card animate-pulse border border-border/50" />
              ))}
            </div>
          ) : jamendoTracks.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center bg-card/10 rounded-xl border border-border/30">
              <SearchIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-xl font-medium">No tracks found for "{debouncedQuery}"</p>
              <p className="text-muted-foreground mt-2">Try searching for an artist, song, or clearer keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {jamendoTracks.map((track) => (
                <TrackCard key={`jamendo-${track.id}`} track={track} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
