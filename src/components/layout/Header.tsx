import { HistoryNavigation } from "@/components/layout/HistoryNavigation";
import { Suspense } from "react";

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0 border-b border-white/5 shadow-sm">
      <div className="flex items-center gap-2">
        <Suspense fallback={<div className="w-[72px] h-9" />}>
          <HistoryNavigation />
        </Suspense>
      </div>

      <div className="flex items-center gap-4">
        {/* Intentionally left blank. Authentication moved exclusively to the /account route matching Spotify architecture */}
      </div>
    </header>
  );
}
