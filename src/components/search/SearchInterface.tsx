"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2, SlidersHorizontal, X } from "lucide-react";
import { TrackCard } from "@/components/track/TrackCard";
import { PlayerTrack } from "@/store/usePlayerStore";
import { Button } from "@/components/ui/button";

const GENRES = ["All", "Cinematic", "LoFi", "Hip Hop", "Electronic", "Ambient", "Rock", "Pop", "Jazz"];
const MOODS = ["All", "Happy", "Sad", "Energetic", "Chill", "Dark", "Epic"];
const DURATIONS = ["Any", "Under 1 min", "1-3 mins", "3-5 mins", "Over 5 mins"];
const BPMS = ["Any", "Slow", "Medium", "Fast"];
const VOCALS = ["Any", "Instrumental Only", "Has Vocals"];

export function SearchInterface() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ jamendo: any[] }>({ jamendo: [] });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter States
  const [activeGenre, setActiveGenre] = useState("All");
  const [activeMood, setActiveMood] = useState("All");
  const [activeDuration, setActiveDuration] = useState("Any");
  const [activeBpm, setActiveBpm] = useState("Any");
  const [activeVocal, setActiveVocal] = useState("Any");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle body scroll when mobile filter is open
  useEffect(() => {
    if (isFiltersOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFiltersOpen]);

  useEffect(() => {
    // If no text query and no tag filters applied, maybe don't fetch or fetch default recent
    const fetchSearch = async () => {
      setIsLoading(true);
      try {
        // We simulate sending filters by appending them to the query if they aren't "All"/"Any"
        // Jamendo API actually supports tags parameter
        let tags = [];
        if (activeGenre !== "All") tags.push(activeGenre.toLowerCase());
        if (activeMood !== "All") tags.push(activeMood.toLowerCase());
        const tagParam = tags.length > 0 ? `&tags=${tags.join(',')}` : '';
        const qParam = debouncedQuery ? `q=${encodeURIComponent(debouncedQuery)}` : `q=`;

        // If completely empty, just fetch some default or trending
        if (!debouncedQuery && tags.length === 0) {
          setResults({ jamendo: [] });
          setIsLoading(false);
          return;
        }

        // Ideally we hit an API that accepts these, for now we hit existing /api/search
        // The existing /api/search probably uses standard jamendo search. 
        // We'll append tags to query if they exist so it at least narrows down.
        const combinedQuery = `${debouncedQuery} ${tags.join(' ')}`.trim();
        const res = await fetch(`/api/search?q=${encodeURIComponent(combinedQuery)}`);
        
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
  }, [debouncedQuery, activeGenre, activeMood, activeDuration, activeBpm, activeVocal]);

  const mapJamendo = (t: any): PlayerTrack => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    downloadUrl: t.audiodownload || undefined,
    duration: t.duration,
    genre: t.musicinfo?.tags?.genres?.[0] || 'Pop',
    source: 'jamendo',
  });

  const jamendoTracks = results.jamendo.map(mapJamendo);

  const FilterSection = ({ title, options, active, setActive }: { title: string, options: string[], active: string, setActive: (a: string) => void }) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button 
            key={opt}
            onClick={() => setActive(opt)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === opt 
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="p-1">
      <FilterSection title="Genre" options={GENRES} active={activeGenre} setActive={setActiveGenre} />
      <FilterSection title="Mood" options={MOODS} active={activeMood} setActive={setActiveMood} />
      <FilterSection title="Duration" options={DURATIONS} active={activeDuration} setActive={setActiveDuration} />
      <FilterSection title="BPM" options={BPMS} active={activeBpm} setActive={setActiveBpm} />
      <FilterSection title="Vocal / Instrumental" options={VOCALS} active={activeVocal} setActive={setActiveVocal} />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in pb-32">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-24 bg-zinc-950/50 p-6 rounded-3xl border border-zinc-900 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">Filters</h2>
          </div>
          <SidebarContent />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-col md:flex-row gap-4 mb-8 relative">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-3.5 h-6 w-6 text-zinc-500" />
            <Input 
              placeholder="Search tracks, artists, or keywords..." 
              className="pl-12 h-14 bg-zinc-900/80 border-zinc-800 text-lg rounded-full focus-visible:ring-emerald-500 shadow-lg text-white font-medium backdrop-blur-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading && <Loader2 className="absolute right-5 top-4 h-6 w-6 text-emerald-500 animate-spin" />}
          </div>
          
          <Button 
            onClick={() => setIsFiltersOpen(true)}
            className="lg:hidden h-14 w-14 shrink-0 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 flex items-center justify-center shadow-lg"
          >
            <SlidersHorizontal className="w-6 h-6" />
          </Button>
        </div>

        {/* RESULTS GRID */}
        {(debouncedQuery || activeGenre !== "All" || activeMood !== "All") ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Search Results</h3>
              <span className="text-zinc-500 font-medium">{jamendoTracks.length} tracks</span>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-square w-full rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800/50" />
                ))}
              </div>
            ) : jamendoTracks.length === 0 ? (
              <div className="py-32 text-center flex flex-col items-center justify-center bg-zinc-900/30 rounded-3xl border border-zinc-800/50 backdrop-blur-sm shadow-xl">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-zinc-800">
                  <SearchIcon className="w-10 h-10 text-zinc-600" />
                </div>
                <p className="text-2xl font-black text-white">No tracks found</p>
                <p className="text-zinc-400 mt-3 max-w-md text-lg">Try adjusting your filters or use simpler keywords to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                {jamendoTracks.map((track) => (
                  <TrackCard key={`jamendo-${track.id}`} track={track} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl font-black text-zinc-300 mb-4 tracking-tight">Find Your Perfect Sound</h2>
            <p className="text-zinc-500 text-lg max-w-lg">Search above or apply filters to discover high-quality, royalty-free tracks for your next project.</p>
          </div>
        )}
      </div>

      {/* MOBILE SLIDE-UP FILTER DRAWER */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsFiltersOpen(false)}
          />
          <div className="relative bg-zinc-950 border-t border-zinc-800 rounded-t-3xl h-[85vh] flex flex-col animate-in slide-in-from-bottom-[100%] duration-300">
            <div className="flex items-center justify-between p-6 border-b border-zinc-900">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                Filters
              </h2>
              <button 
                onClick={() => setIsFiltersOpen(false)}
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <SidebarContent />
            </div>
            
            <div className="p-6 border-t border-zinc-900 bg-zinc-950 w-full flex items-center gap-4 pb-12">
              <Button 
                onClick={() => {
                  setActiveGenre("All");
                  setActiveMood("All");
                  setActiveDuration("Any");
                  setActiveBpm("Any");
                  setActiveVocal("Any");
                }}
                className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 rounded-full h-14 font-bold text-lg"
              >
                Reset
              </Button>
              <Button 
                onClick={() => setIsFiltersOpen(false)}
                className="flex-[2] bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-full h-14 font-bold text-lg"
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
