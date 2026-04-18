"use client";

import { useEffect, useState, useMemo } from "react";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { generateRecommendations, RecommendationMatch } from "@/lib/recommendationEngine";
import { fetchRecommendationMatches, fetchTrendingFallback } from "@/app/actions/recommendations";
import { PlayerTrack } from "@/store/usePlayerStore";
import { RecommendedRow, RecommendedRowSkeleton } from "./RecommendedRow";
import { RefreshCw } from "lucide-react";

export function RecommendationOrchestrator() {
  const { tracks: historyTracks } = useHistoryStore();
  const { favorites } = useLibraryStore();
  
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{ match: RecommendationMatch, tracks: PlayerTrack[] }[]>([]);
  const [stamp, setStamp] = useState(0);

  // Safely mount to prevent SSR hydration errors on Zustand stores
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let isSubscribed = true;
    setIsLoading(true);

    async function loadData() {
      // 1. Generate recommendation vectors natively on the client utilizing strict localized arrays
      const matches = generateRecommendations(historyTracks, favorites);
      
      const toDisplay: { match: RecommendationMatch, tracks: PlayerTrack[] }[] = [];

      try {
        if (matches.length > 0) {
          // 2. Fetch specific matched tags via Secure Server Actions
          const tags = matches.map(m => m.tag);
          const tracksMap = await fetchRecommendationMatches(tags);
          
          matches.forEach(match => {
            if (tracksMap[match.tag] && tracksMap[match.tag].length > 0) {
              toDisplay.push({ match, tracks: tracksMap[match.tag] });
            }
          });
        } 
        
        // 3. Guarantee payload (Trending fallback) if completely empty profile or fetch failed
        if (toDisplay.length === 0) {
           const fallbackTracks = await fetchTrendingFallback();
           toDisplay.push({
             match: { tag: 'trending', reason: 'Because you are new to BeatFlow' },
             tracks: fallbackTracks
           });
        }

      } catch (err) {
        console.error("Recommendations failed:", err);
      }

      if (isSubscribed) {
        setData(toDisplay);
        setIsLoading(false);
      }
    }

    loadData();

    return () => { isSubscribed = false; };
  }, [mounted, stamp]); // We optionally add historyTracks dependency if we want hyper-realtime, but a refresh trigger `stamp` is enough.

  if (!mounted) return null;

  return (
    <div className="flex flex-col space-y-12 w-full pt-4 pb-8 relative">
      <div className="absolute top-0 right-4 md:right-8 z-10 flex">
         <button 
           onClick={() => setStamp(v => v + 1)}
           disabled={isLoading}
           className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 rounded-full text-xs font-bold text-zinc-300 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
         >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
         </button>
      </div>

      {isLoading ? (
        <>
          <RecommendedRowSkeleton />
          <RecommendedRowSkeleton />
        </>
      ) : (
        data.map((block, idx) => {
          // Make the titles visually interesting
          const titles = ["Based On Your Activity", "You Might Like", "Discover New Sounds"];
          const title = titles[idx % titles.length];

          return (
            <RecommendedRow 
              key={`${block.match.tag}-${idx}`}
              title={title}
              reason={block.match.reason}
              tracks={block.tracks}
            />
          );
        })
      )}
    </div>
  );
}
