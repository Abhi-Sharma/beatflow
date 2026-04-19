"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Loader2, Music, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackCard } from "@/components/track/TrackCard";
import { PlayerTrack } from "@/store/usePlayerStore";

const SUGGESTIONS = [
  "YouTube vlog music",
  "Sad piano reel",
  "Gym motivation",
  "LoFi coding",
  "Punjabi party",
];

const HISTORY_KEY = "beatflow_ai_history";

export function AIMusicFinder() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PlayerTrack[]>([]);
  const [reason, setReason] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      // Ignored
    }
  }, []);

  const saveHistory = (q: string) => {
    if (!q.trim()) return;
    const newHistory = [q, ...history.filter(h => h !== q)].slice(0, 5);
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      // Ignored
    }
  };

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setQuery(q);
    
    try {
      const res = await fetch("/api/ai-music-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) throw new Error("Search failed");
      
      const data = await res.json();
      setResults(data.tracks || []);
      setReason(data.reason || "");
      setIsFallback(Boolean(data.isFallback));
      saveHistory(q);
    } catch (error) {
      console.error(error);
      setReason("Unable to fetch results right now. Try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const executeChip = (chip: string) => {
    handleSearch(chip);
  };

  return (
    <section className="w-full py-12 px-4 md:px-8 mx-auto max-w-7xl flex flex-col gap-8">
      {/* Header & Input Section */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/20 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>AI Music Finder</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Find Music by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Mood, Vibe</span> or Use Case
        </h2>
        
        <div className="w-full relative flex items-center mt-8 group">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            className="w-full h-14 pl-12 pr-32 bg-zinc-900 border border-zinc-800 rounded-full outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-muted-foreground shadow-lg"
            placeholder="Need cinematic music for travel reel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button 
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="absolute right-1 h-12 rounded-full px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold uppercase tracking-wider text-xs shadow-md"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Find Tracks"}
          </Button>
        </div>

        {/* Chips */}
        <div className="flex flex-col gap-3 w-full">
          {history.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground w-full items-center">
              <span className="flex items-center gap-1 mr-2 text-xs font-semibold"><RefreshCw className="w-3 h-3"/> Recent:</span>
              {history.map((h, i) => (
                <button
                  key={`hist-${i}`}
                  onClick={() => executeChip(h)}
                  className="px-3 py-1 rounded-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors truncate max-w-[200px]"
                >
                  {h}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((chip, i) => (
              <button
                key={`sug-${i}`}
                onClick={() => executeChip(chip)}
                className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-sm shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="flex flex-col gap-6 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-800 pb-4 gap-4 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <Music className="w-5 h-5 text-emerald-400" />
                Results
              </h3>
              {reason && (
                <p className={`text-sm mt-1 flex items-center gap-1.5 justify-center md:justify-start ${isFallback ? 'text-amber-400' : 'text-emerald-400/80'}`}>
                  <Sparkles className="w-3 h-3"/> {reason}
                </p>
              )}
            </div>
          </div>

          {isSearching ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col gap-3 p-4 bg-zinc-900 border border-zinc-800/50 rounded-xl animate-pulse">
                  <div className="aspect-square bg-zinc-800 rounded-md w-full"></div>
                  <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
              {results.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
              <Sparkles className="w-12 h-12 text-zinc-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">No tracks found</h3>
              <p className="text-muted-foreground max-w-md">Try describing a different vibe, genre, or mood to find the perfect music.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
