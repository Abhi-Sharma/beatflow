import Link from "next/link";
import { Home, Search, Library, Music, Heart, ListMusic, User } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border h-full hidden md:flex flex-col shrink-0 z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <Music className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl tracking-tight">BeatFlow</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link href="/search" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
            <Search className="w-5 h-5" />
            Search
          </Link>
          <Link href="/free-music" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
            <Library className="w-5 h-5" />
            Free Music
          </Link>
          <Link href="/playlists" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
            <ListMusic className="w-5 h-5" />
            Collections
          </Link>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Your Library
          </h3>
          <div className="space-y-1">
            <Link href="/library/favorites" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
              <Heart className="w-5 h-5" />
              Favorites
            </Link>
            <Link href="/library/playlists" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
              <ListMusic className="w-5 h-5" />
              Playlists
            </Link>
            <Link href="/account" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
              <User className="w-5 h-5" />
              Account
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="p-5 mt-auto border-t border-border/40 text-[11px] text-zinc-500 flex flex-col gap-2 bg-zinc-950/20">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-medium">
          <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link>
        </div>
        <span className="w-full mt-2 text-zinc-600 tracking-wide">© {new Date().getFullYear()} BeatFlow Legal</span>
      </div>
    </aside>
  );
}
