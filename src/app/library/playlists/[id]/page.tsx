import { getPlaylistDetails } from "@/app/actions/playlists";
import { TrackCard } from "@/components/track/TrackCard";
import { redirect } from "next/navigation";
import { ListMusic, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getPlaylistDetails(id);

  if (result.error || !result.success) {
    redirect("/library/playlists");
  }

  const { playlist, tracks } = result;

  return (
    <div className="flex flex-col pl-6 pr-6 py-6 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/library/playlists">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="bg-primary/10 p-6 rounded-2xl shadow-sm text-primary flex items-center justify-center">
          <ListMusic className="w-12 h-12" />
        </div>
        <div className="flex flex-col pl-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Playlist</span>
          <h1 className="text-4xl font-extrabold tracking-tight">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-muted-foreground mt-2">{playlist.description}</p>
          )}
          <span className="text-sm font-medium text-muted-foreground mt-2">
            {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-border/50 mb-8" />

      {tracks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="bg-secondary p-4 rounded-full mb-4">
            <ListMusic className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">It's a bit quiet here</h3>
          <p className="text-muted-foreground">
            Search for your favorite tracks and add them to this playlist!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((trackItem: any) => {
            const track = {
              id: trackItem.track_id, 
              source: trackItem.source as "jamendo",
              title: trackItem.title,
              artist: trackItem.artist,
              coverUrl: trackItem.cover_url,
              audioUrl: trackItem.audio_url,
            };
            return (
              <TrackCard key={trackItem.id} track={track} />
            );
          })}
        </div>
      )}
    </div>
  );
}
