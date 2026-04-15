"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/mongoose";
import { Favorite } from "@/models/Favorite";

export async function toggleFavoriteAction(track: any) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await connectToDatabase();
    const safeTrackId = String(track.id);

    const existing = await Favorite.findOne({
      user_id: userId,
      source: track.source,
      track_id: safeTrackId
    });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
    } else {
      await Favorite.create({
        user_id: userId,
        source: track.source,
        track_id: safeTrackId,
        title: track.title || 'Unknown Title',
        artist: track.artist || 'Unknown Artist',
        cover_url: track.coverUrl || null,
        audio_url: track.audioUrl || null
      });
    }

    revalidatePath('/library/favorites');
    return { success: true };
  } catch (error: any) {
    console.error("DB Toggle Error:", error);
    return { error: `DB Error: ${error.message}` };
  }
}

export async function getUserFavorites() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    await connectToDatabase();
    
    const docs = await Favorite.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();

    return docs.map(doc => ({
      id: doc._id.toString(),
      user_id: doc.user_id,
      source: doc.source,
      track_id: String(doc.track_id),
      title: doc.title,
      artist: doc.artist,
      cover_url: doc.cover_url,
      audio_url: doc.audio_url,
      created_at: doc.created_at
    }));
  } catch (error) {
    console.error("Failed to fetch favorites from MongoDB", error);
    return [];
  }
}
