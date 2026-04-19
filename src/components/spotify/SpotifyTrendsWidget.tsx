"use client";

import { useEffect, useState } from "react";
import { Music2, ArrowUpRight } from "lucide-react";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";

export function SpotifyTrendsWidget() {
  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    fetch("/api/spotify/trending")
      .then(res => res.json())
      .then(data => {
        if (data?.tracks?.items?.[0]?.track) {
          setTrack(data.tracks.items[0].track);
        }
      })
      .catch(err => console.error("Could not fetch daily trend", err));
  }, []);

  if (!track) return null;

  return (
    <Link href="/search" className="block max-w-sm w-full mx-auto md:mx-0 group">
      <Card className="bg-zinc-900/80 border-zinc-800/80 overflow-hidden relative hover:bg-zinc-800/80 transition-colors">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#1DB954]" />
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-md overflow-hidden relative flex-shrink-0">
            <img src={track.album?.images?.[0]?.url || '/placeholder.jpg'} alt="Trending" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Music2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center rounded-md border text-[10px] py-0 px-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-[#1DB954]/50 text-[#1DB954] bg-[#1DB954]/10">#1 Global Daily</span>
            </div>
            <h4 className="font-bold text-sm text-white truncate">{track.name}</h4>
            <p className="text-xs text-zinc-400 truncate">{track.artists?.[0]?.name}</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-[#1DB954] transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}
