"use client";

import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SpotifyCard } from "./SpotifyCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type TabValue = "trending" | "popular-playlists" | "top-artists" | "chill-picks" | "workout-hits";

export function SpotifySection() {
  const [activeTab, setActiveTab] = useState<TabValue>("trending");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab: TabValue) => {
    setLoading(true);
    try {
      let res;
      if (tab === "trending") {
        res = await fetch("/api/spotify/trending");
        const json = await res.json();
        // Extract tracks from playlist response
        setData(json.tracks?.items?.map((item: any) => item.track).filter(Boolean) || []);
      } else if (tab === "chill-picks") {
        res = await fetch("/api/spotify/playlists?category=chill");
        const json = await res.json();
        // Just extract tracks from the first playlist for demo, or show playlists directly?
        // Let's search tracks instead of playlists to render SpotifyCards
        res = await fetch("/api/spotify/search?q=chill&type=track");
        const jsonSearch = await res.json();
        setData(jsonSearch.tracks?.items || []);
      } else if (tab === "workout-hits") {
        res = await fetch("/api/spotify/search?q=workout%20motivation&type=track");
        const json = await res.json();
        setData(json.tracks?.items || []);
      } else if (tab === "top-artists") {
        res = await fetch("/api/spotify/search?q=global%20top&type=track");
        const json = await res.json();
        setData(json.tracks?.items || []);
      } else if (tab === "popular-playlists") {
         res = await fetch("/api/spotify/search?q=popular&type=track");
        const json = await res.json();
        setData(json.tracks?.items || []);
      }
    } catch (error) {
      console.error("Error fetching Spotify data", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 md:px-8 max-w-[1400px] mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center group">
            Discover on <span className="ml-2 text-[#1DB954] flex items-center">Spotify <Music2 className="w-6 h-6 ml-1 mb-1" /></span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-1">Explore trending music around the globe</p>
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full md:w-auto overflow-x-auto">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="trending" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">Trending Tracks</TabsTrigger>
            <TabsTrigger value="popular-playlists" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">Popular</TabsTrigger>
            <TabsTrigger value="chill-picks" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">Chill Picks</TabsTrigger>
            <TabsTrigger value="workout-hits" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">Workout Hits</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <ScrollArea className="w-full whitespace-nowrap pb-6">
          <div className="flex space-x-4 md:space-x-6 px-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-[160px] md:w-[240px] shrink-0 h-[280px]">
                <Skeleton className="w-full h-full bg-zinc-800 rounded-xl" />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden opacity-0" />
        </ScrollArea>
      ) : data.length === 0 ? (
        <div className="py-12 text-center bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
          <p className="text-zinc-400">No tracks found. Please check your connection or Spotify API keys.</p>
        </div>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap pb-6">
          <div className="flex space-x-4 md:space-x-6 px-2">
            {data.map((track: any) => (
              <div key={track.id} className="w-[160px] md:w-[240px] shrink-0">
                <SpotifyCard track={track} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden opacity-0" />
        </ScrollArea>
      )}
    </section>
  );
}
