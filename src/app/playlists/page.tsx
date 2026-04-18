import { curatedPlaylists } from "@/lib/curated-playlists";
import { Metadata } from "next";
import { PlaylistCard } from "@/components/playlists/PlaylistCard";

export const metadata: Metadata = {
  title: "Curated Playlists | BeatFlow",
  description: "Browse premium curated playlists on BeatFlow.",
};

export default function PlaylistsDirectoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in pb-12 w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">Curated Collections</h1>
        <p className="text-zinc-400 text-base md:text-lg">Premium editorial playlists tailored for your creative flow.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {curatedPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}
