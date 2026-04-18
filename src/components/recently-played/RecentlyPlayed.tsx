"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useHistoryStore } from "@/store/useHistoryStore";
import { getUserHistory } from "@/app/actions/history";
import { RecentlyPlayedCard } from "./RecentlyPlayedCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { History, Loader2 } from "lucide-react";

export function RecentlyPlayed() {
  const { userId, isLoaded } = useAuth();
  const guestTracks = useHistoryStore(state => state.tracks);
  const [dbTracks, setDbTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Poll or trigger when userId changes
  useEffect(() => {
    if (!isLoaded) return;
    let isMounted = true;
    
    if (userId) {
      getUserHistory().then((tracks) => {
        if (isMounted) {
          setDbTracks(tracks);
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
    
    return () => { isMounted = false; }
  }, [userId, isLoaded]);

  // Optionally listen to custom events if we need instant UI updates after playing on the same page
  // But Zustand updates guestTracks instantly. For dbTracks, we might want to refresh when currentTrack changes.
  // This is a minimal implementation relying on remount/navigate.

  const tracksToDisplay = userId ? dbTracks : guestTracks;

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500/50" />
      </div>
    );
  }

  if (tracksToDisplay.length === 0) {
    return (
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto mt-6 mb-12 animate-in fade-in">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center mb-6 pl-2">
          <History className="w-6 h-6 md:w-8 md:h-8 mr-3 text-emerald-400" />
          Recently Played
        </h2>
        
        <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900 border border-zinc-800 rounded-2xl w-full">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-200 mb-2">No recently played tracks yet</h3>
          <p className="text-zinc-400">Start listening to build your history.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 px-4 md:px-8 max-w-[1400px] mx-auto mt-6 mb-12 animate-in fade-in transition-all">
      <div className="flex items-center justify-between group px-2">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center drop-shadow-md">
          <History className="w-6 h-6 md:w-8 md:h-8 mr-3 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          Recently Played
        </h2>
      </div>
      <ScrollArea className="w-full pb-6">
        <div className="flex space-x-4 md:space-x-5 px-2">
          {tracksToDisplay.map((track: any) => (
            <div key={track.id} className="w-[260px] md:w-[320px] shrink-0 h-[80px]">
              <RecentlyPlayedCard track={track} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden opacity-0" />
      </ScrollArea>
    </section>
  );
}
