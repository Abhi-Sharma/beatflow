"use client";

import { PlayerTrack } from "@/store/usePlayerStore";
import { TrackCard } from "@/components/track/TrackCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface RecommendedRowProps {
  title: string;
  reason: string;
  tracks: PlayerTrack[];
}

export function RecommendedRow({ title, reason, tracks }: RecommendedRowProps) {
  if (!tracks || tracks.length === 0) return null;

  return (
    <section className="space-y-4 px-4 md:px-8 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col px-2 mb-1">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 group cursor-default">
          <Sparkles className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
          {title}
        </h2>
        <span className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mt-1">
          {reason}
        </span>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-6">
        <div className="flex space-x-4 md:space-x-6 px-2 pt-2">
          {tracks.map((track) => (
            <div key={track.id} className="w-[160px] md:w-[240px] shrink-0">
              <TrackCard track={track} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden opacity-0" />
      </ScrollArea>
    </section>
  );
}

export function RecommendedRowSkeleton() {
  return (
    <section className="space-y-4 px-4 md:px-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col px-2 mb-1">
        <div className="w-64 h-8 bg-zinc-900 rounded-lg animate-pulse" />
        <div className="w-48 h-4 bg-zinc-900 rounded-lg animate-pulse mt-2" />
      </div>
      <div className="flex space-x-4 md:space-x-6 px-2 overflow-hidden pointer-events-none pb-6">
         {[1, 2, 3, 4, 5].map((idx) => (
           <div key={idx} className="w-[160px] md:w-[240px] shrink-0 space-y-3">
             <div className="w-full aspect-square bg-zinc-900 rounded-2xl animate-pulse" />
             <div className="w-3/4 h-4 bg-zinc-900 rounded animate-pulse" />
             <div className="w-1/2 h-4 bg-zinc-900 rounded animate-pulse" />
           </div>
         ))}
      </div>
    </section>
  );
}
