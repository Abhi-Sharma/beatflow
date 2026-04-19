"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2, Music2 } from "lucide-react";
import { SpotifyCard } from "@/components/spotify/SpotifyCard";

export function SpotifySearchInterface() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(debouncedQuery)}&type=track`);
        if (!res.ok) throw new Error('API returned an error');
        const data = await res.json();
        setResults(data.tracks?.items || []);
      } catch (error) {
        console.error("Failed to fetch Spotify search results", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearch();
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in pb-32">
      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-col md:flex-row gap-4 mb-8 relative">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-3.5 h-6 w-6 text-zinc-500" />
            <Input 
              placeholder="Search Spotify tracks..." 
              className="pl-12 h-14 bg-zinc-900/80 border-[#1DB954]/50 focus-visible:ring-[#1DB954] text-lg rounded-full shadow-lg text-white font-medium backdrop-blur-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading && <Loader2 className="absolute right-5 top-4 h-6 w-6 text-[#1DB954] animate-spin" />}
          </div>
        </div>

        {debouncedQuery ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Music2 className="w-5 h-5 mr-2 text-[#1DB954]"/> Spotify Results
              </h3>
              <span className="text-zinc-500 font-medium">{results.length} tracks</span>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-square w-full rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800/50" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="py-32 text-center flex flex-col items-center justify-center bg-zinc-900/30 rounded-3xl border border-zinc-800/50 backdrop-blur-sm shadow-xl">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-zinc-800">
                  <SearchIcon className="w-10 h-10 text-zinc-600" />
                </div>
                <p className="text-2xl font-black text-white">No tracks found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                {results.map((track) => (
                  <SpotifyCard key={`spotify-${track.id}`} track={track} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl font-black text-zinc-300 mb-4 tracking-tight">Discover on Spotify</h2>
            <p className="text-zinc-500 text-lg max-w-lg">Search for trending tracks globally, and find similar royalty-free hits.</p>
          </div>
        )}
      </div>
    </div>
  );
}
