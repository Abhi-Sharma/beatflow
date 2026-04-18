"use server";

import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import { History } from "@/models/History";
import { PlayerTrack } from "@/store/usePlayerStore";

// Add track to DB, update 'played_at' if it already exists, keeping history <= 50
export async function logTrackHistory(track: PlayerTrack) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await connectToDatabase();
    const safeTrackId = String(track.id);

    // Update existing track or create new one
    await History.findOneAndUpdate(
      {
        user_id: userId,
        source: track.source,
        track_id: safeTrackId
      },
      {
        title: track.title || 'Unknown Title',
        artist: track.artist || 'Unknown Artist',
        cover_url: track.coverUrl || null,
        audio_url: track.audioUrl || null,
        played_at: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Clean up older tracks (keep only 50 most recent)
    const count = await History.countDocuments({ user_id: userId });
    if (count > 50) {
      const recordsToKeep = await History.find({ user_id: userId })
        .sort({ played_at: -1 })
        .limit(50)
        .select('_id');
      
      const idsToKeep = recordsToKeep.map(r => r._id);
      await History.deleteMany({
        user_id: userId,
        _id: { $nin: idsToKeep }
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to log track history:", error);
    return { error: `DB Error: ${error.message}` };
  }
}

// Fetch history for the logged-in user
export async function getUserHistory() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    await connectToDatabase();
    const docs = await History.find({ user_id: userId })
      .sort({ played_at: -1 })
      .limit(50)
      .lean();

    return docs.map(doc => ({
      id: doc.track_id,
      title: doc.title,
      artist: doc.artist,
      coverUrl: doc.cover_url,
      audioUrl: doc.audio_url,
      source: doc.source,
      playedAt: doc.played_at.toISOString()
    }));
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
}

// Sync guest history batch to DB
export async function syncGuestHistory(tracks: PlayerTrack[]) {
  const { userId } = await auth();
  if (!userId || !tracks || tracks.length === 0) return { success: false };

  try {
    await connectToDatabase();
    
    // We process sequentially or in parallel?
    // Using bulkWrite for efficiency, assuming 'played_at' is either Date.now() or slightly earlier.
    const ops = tracks.map((track, i) => {
      // we mock 'played_at' by slightly offsetting so order is preserved if they bulk insert
      const offsetMs = (tracks.length - i) * 1000;
      return {
        updateOne: {
          filter: { user_id: userId, source: track.source, track_id: String(track.id) },
          update: { 
            $set: {
              title: track.title || 'Unknown Title',
              artist: track.artist || 'Unknown Artist',
              cover_url: track.coverUrl || null,
              audio_url: track.audioUrl || null,
              // don't overwrite played_at if exists
            },
            $setOnInsert: {
               played_at: new Date(Date.now() - offsetMs)
            }
          },
          upsert: true
        }
      };
    });

    await History.bulkWrite(ops, { ordered: false });

    // Clean up older tracks
    const count = await History.countDocuments({ user_id: userId });
    if (count > 50) {
      const recordsToKeep = await History.find({ user_id: userId })
        .sort({ played_at: -1 })
        .limit(50)
        .select('_id');
      
      const idsToKeep = recordsToKeep.map(r => r._id);
      await History.deleteMany({
        user_id: userId,
        _id: { $nin: idsToKeep }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to sync guest history:", error);
    return { error: "Failed to sync" };
  }
}
