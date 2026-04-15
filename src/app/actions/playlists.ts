"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/mongoose";
import { Playlist } from "@/models/Playlist";

export async function createPlaylistAction(name: string, description: string = '') {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await connectToDatabase();
    
    const newPlaylist = await Playlist.create({
      user_id: userId,
      name,
      description
    });

    revalidatePath('/library/playlists');
    
    return { 
      success: true, 
      data: {
        id: newPlaylist._id.toString(),
        name: newPlaylist.name,
        description: newPlaylist.description,
        created_at: newPlaylist.created_at
      } 
    };
  } catch (error: any) {
    console.error("Failed to create playlist", error);
    return { error: `DB Error: ${error.message}` };
  }
}

export async function getUserPlaylists() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    await connectToDatabase();
    
    const docs = await Playlist.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();

    return docs.map(doc => ({
      id: doc._id.toString(),
      user_id: doc.user_id,
      name: doc.name,
      description: doc.description,
      cover_url: doc.cover_url,
      created_at: doc.created_at
    }));
  } catch (error) {
    console.error("Failed to fetch playlists from MongoDB", error);
    return [];
  }
}

export async function addTrackToPlaylistAction(playlistId: string, track: any) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await connectToDatabase();
    
    // Validate playlist ownership securely
    const playlist = await Playlist.findOne({ _id: playlistId, user_id: userId });
    if (!playlist) return { error: "Playlist not found or access denied" };

    const safeTrackId = String(track.id);

    // Dynamic import to prevent circle dependencies if models not fully loaded
    const { PlaylistTrack } = require("@/models/PlaylistTrack");

    await PlaylistTrack.create({
      playlist_id: playlistId,
      source: track.source,
      track_id: safeTrackId,
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      cover_url: track.coverUrl || null,
      audio_url: track.audioUrl || null
    });

    revalidatePath(`/library/playlists/${playlistId}`);
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: "Track already exists in this playlist" };
    }
    console.error("Failed to add track", error);
    return { error: `DB Error: ${error.message}` };
  }
}

export async function removeTrackFromPlaylistAction(playlistId: string, trackDocId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await connectToDatabase();
    
    const playlist = await Playlist.findOne({ _id: playlistId, user_id: userId });
    if (!playlist) return { error: "Playlist not found or access denied" };

    const { PlaylistTrack } = require("@/models/PlaylistTrack");
    await PlaylistTrack.deleteOne({ _id: trackDocId, playlist_id: playlistId });

    revalidatePath(`/library/playlists/${playlistId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove track", error);
    return { error: `DB Error: ${error.message}` };
  }
}

export async function getPlaylistDetails(playlistId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await connectToDatabase();
    
    const playlist = await Playlist.findOne({ _id: playlistId, user_id: userId }).lean() as any;
    if (!playlist) return { error: "Playlist not found" };

    const { PlaylistTrack } = require("@/models/PlaylistTrack");
    const tracks = await PlaylistTrack.find({ playlist_id: playlistId })
      .sort({ added_at: -1 })
      .lean();

    return {
      success: true,
      playlist: {
        id: playlist._id.toString(),
        name: playlist.name,
        description: playlist.description,
        cover_url: playlist.cover_url,
        created_at: playlist.created_at
      },
      tracks: tracks.map((doc: any) => ({
        id: doc._id.toString(),
        playlist_id: doc.playlist_id.toString(),
        source: doc.source,
        track_id: String(doc.track_id),
        title: doc.title,
        artist: doc.artist,
        cover_url: doc.cover_url,
        audio_url: doc.audio_url,
        added_at: doc.added_at
      }))
    };
  } catch (error: any) {
    console.error("Failed to fetch playlist details", error);
    return { error: "Failed to load playlist details" };
  }
}
