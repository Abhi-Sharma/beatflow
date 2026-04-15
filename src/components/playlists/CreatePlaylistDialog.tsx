"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2 } from "lucide-react";
import { createPlaylistAction } from "@/app/actions/playlists";
import { useAuth, useClerk } from "@clerk/nextjs";

interface CreatePlaylistDialogProps {
  children?: React.ReactNode;
  variant?: "outline" | "default" | "ghost" | "secondary";
  className?: string;
  buttonText?: string;
}

export function CreatePlaylistDialog({ children, variant = "default", className, buttonText = "Create Playlist" }: CreatePlaylistDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      return openSignIn();
    }
    
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const result = await createPlaylistAction(name, description);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setIsSuccess(false);
          setName("");
          setDescription("");
        }, 1000);
      } else {
        console.error(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger render={children as React.ReactElement} />
      ) : (
        <DialogTrigger render={<Button variant={variant} className={className} />}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 animate-in zoom-in duration-300">
            <div className="rounded-full bg-green-500/20 p-3 mb-4">
              <div className="rounded-full bg-green-500 p-2 text-white shadow-lg shadow-green-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Playlist Created!</DialogTitle>
            <DialogDescription className="text-center">
              Your new playlist is ready for tracks.
            </DialogDescription>
          </div>
        ) : (
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create Playlist</DialogTitle>
              <DialogDescription>
                Add a new playlist to organize your favorite tracks.
              </DialogDescription>
            </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Mix"
                required
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none">
                Description (Optional)
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vibes for the weekend"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
