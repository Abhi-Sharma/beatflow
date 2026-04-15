"use client";

import { useState, useEffect } from "react";
import { Plus, Check, Loader2, Music4 } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserPlaylists, addTrackToPlaylistAction, createPlaylistAction } from "@/app/actions/playlists";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddToPlaylistMenuProps {
  track: any;
  triggerClassName?: string;
}

export function AddToPlaylistMenu({ track, triggerClassName }: AddToPlaylistMenuProps) {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [addedTo, setAddedTo] = useState<string | null>(null);

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (open && userId) {
      loadPlaylists();
    }
  }, [open, userId]);

  const loadPlaylists = async () => {
    setIsLoading(true);
    const data = await getUserPlaylists();
    setPlaylists(data || []);
    setIsLoading(false);
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setIsCreating(true);
    try {
      const created = await createPlaylistAction(newPlaylistName, "");
      if (created.success && created.data) {
        setNewPlaylistName("");
        await loadPlaylists();
        handleAdd(created.data.id);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleAdd = async (playlistId: string) => {
    if (!userId) return;

    setAddingTo(playlistId);
    try {
      const result = await addTrackToPlaylistAction(playlistId, track);
      if (result.success || result.error === "Track already exists in this playlist") {
        setAddedTo(playlistId);
        setTimeout(() => setAddedTo(null), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddingTo(null);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      e.preventDefault();
      openSignIn();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button 
          variant="ghost" 
          size="icon" 
          className={`transition-all hover:text-emerald-400 ${triggerClassName || ''}`}
          onClick={handleTriggerClick}
        >
          <Plus className="w-5 h-5" />
        </Button>
      } />
      <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-md bg-zinc-950 border-zinc-800 p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-zinc-900/50 border-b border-zinc-900">
          <DialogTitle className="text-xl font-bold tracking-tight text-white mb-4">Add to Playlist</DialogTitle>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-zinc-800 shadow-md">
              {track?.coverUrl ? (
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <Music4 className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0 pr-4">
              <span className="font-bold text-white truncate text-lg">{track?.title || 'Unknown Track'}</span>
              <span className="text-zinc-400 text-sm truncate">{track?.artist || 'Unknown Artist'}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 flex flex-col h-[60vh] max-h-[400px]">
          <form onSubmit={handleCreateAndAdd} className="flex gap-2 mb-4 shrink-0">
            <Input 
              placeholder="New playlist name..." 
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500 rounded-md"
            />
            <Button type="submit" disabled={isCreating || !newPlaylistName.trim()} className="bg-emerald-500 text-black hover:bg-emerald-400 shrink-0">
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create & Add"}
            </Button>
          </form>

          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="flex flex-col gap-1.5 px-1 py-1">
              {isLoading ? (
                <div className="py-12 flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500/50" />
                </div>
              ) : playlists.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <p>You don't have any playlists.</p>
                  <p className="text-sm">Create one above to get started.</p>
                </div>
              ) : (
                playlists.map((playlist) => {
                  const isAdding = addingTo === playlist.id;
                  const isAdded = addedTo === playlist.id;
                  
                  return (
                    <button
                      key={playlist.id}
                      onClick={() => handleAdd(playlist.id)}
                      disabled={isAdding || isAdded}
                      className="flex items-center justify-between w-full text-left p-3 rounded-md transition-all hover:bg-zinc-900/80 active:scale-[0.98] group cursor-pointer border border-transparent hover:border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="truncate font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {playlist.name}
                      </span>
                      {isAdding ? (
                         <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                      ) : isAdded ? (
                        <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Added
                        </div>
                      ) : (
                         <Plus className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
