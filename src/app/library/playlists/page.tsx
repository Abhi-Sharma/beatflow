import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Music, ListMusic, Play } from "lucide-react";
import { getUserPlaylists } from "@/app/actions/playlists";
import { CreatePlaylistDialog } from "@/components/playlists/CreatePlaylistDialog";
import Link from "next/link";
import { RecentlyPlayed } from "@/components/recently-played/RecentlyPlayed";

export default async function PlaylistsPage() {
  const playlists = await getUserPlaylists();

  return (
    <div className="space-y-6">
      <div className="-mx-4 md:-mx-8 print:hidden">
        <RecentlyPlayed />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Playlists</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your custom collections of tracks.
          </p>
        </div>
        <div className="hidden md:block">
          <CreatePlaylistDialog />
        </div>
      </div>

      {playlists.length === 0 ? (
        <Card className="bg-card w-full mt-8 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-secondary/50 p-4 rounded-full mb-4">
              <Music className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2 text-2xl">No Playlists Yet</CardTitle>
            <CardDescription className="max-w-md mx-auto mb-6">
              You haven't created any playlists. Start organizing your favorite tracks from Deezer and Jamendo into collections.
            </CardDescription>
            <CreatePlaylistDialog buttonText="Create Your First Playlist" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
          {playlists.map((playlist: any) => (
            <Link key={playlist.id} href={`/library/playlists/${playlist.id}`}>
              <Card className="group relative overflow-hidden bg-card/50 hover:bg-secondary/50 border-transparent transition-all hover:shadow-xl cursor-pointer">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="relative aspect-square rounded-md overflow-hidden bg-secondary flex items-center justify-center">
                    {playlist.cover_url ? (
                      <img 
                        src={playlist.cover_url} 
                        alt={playlist.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <ListMusic className="w-16 h-16 text-muted-foreground/50 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/50" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="rounded-full w-12 h-12 shadow-lg bg-primary hover:scale-105 transition-transform flex items-center justify-center">
                        <Play className="w-6 h-6 fill-current text-background ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col truncate pr-2">
                    <h4 className="font-semibold text-sm truncate text-foreground">{playlist.name}</h4>
                    <p className="text-xs text-muted-foreground truncate hover:underline">
                      {playlist.description || "Playlist"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
