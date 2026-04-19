"use client";

import { useState } from "react";
import { SearchInterface } from "@/components/search/SearchInterface";
import { SpotifySearchInterface } from "@/components/search/SpotifySearchInterface";
import { AIMusicFinder } from "@/components/ai/AIMusicFinder";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<"beatflow" | "spotify">("beatflow");

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full md:w-auto self-start md:self-center bg-zinc-900 rounded-full border border-zinc-800 p-1">
          <TabsList className="bg-transparent border-0 h-10 w-full justify-start rounded-full space-x-1">
            <TabsTrigger 
              value="beatflow" 
              className="rounded-full px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-black transition-all font-bold"
            >
              BeatFlow
            </TabsTrigger>
            <TabsTrigger 
              value="spotify" 
              className="rounded-full px-6 data-[state=active]:bg-[#1DB954] data-[state=active]:text-black transition-all font-bold"
            >
              Spotify
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "beatflow" && (
        <div className="animate-in fade-in duration-300">
          <AIMusicFinder />
          <hr className="my-8 border-zinc-800" />
          <h2 className="text-2xl font-bold tracking-tight mb-6">Or use standard search</h2>
          <SearchInterface />
        </div>
      )}

      {activeTab === "spotify" && (
        <div className="animate-in fade-in duration-300 mt-8">
          <SpotifySearchInterface />
        </div>
      )}
    </div>
  );
}
