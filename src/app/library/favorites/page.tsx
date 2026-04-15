import { getUserFavorites } from "@/app/actions/favorites";
import { TrackCard } from "@/components/track/TrackCard";
import { PlayerTrack } from "@/store/usePlayerStore";
import { Heart } from "lucide-react";

export default async function FavoritesPage() {
  const favorites = await getUserFavorites();

  const mapFavorite = (f: any): PlayerTrack => ({
    id: f.track_id,
    title: f.title,
    artist: f.artist,
    coverUrl: f.cover_url,
    audioUrl: f.audio_url,
    source: f.source as 'jamendo',
  });

  const tracks = favorites.map(mapFavorite);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/30 rounded-md shadow-lg flex items-center justify-center">
          <Heart className="w-10 h-10 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground">{tracks.length} songs</p>
        </div>
      </div>
      
      <div className="mt-8">
        {tracks.length === 0 ? (
          <p className="text-muted-foreground">You haven't favorited any songs yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tracks.map((track) => (
              <TrackCard key={`${track.source}-${track.id}`} track={track} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
