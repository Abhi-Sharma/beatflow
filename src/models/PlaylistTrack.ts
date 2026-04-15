import mongoose, { Schema, Document } from "mongoose";

export interface IPlaylistTrack extends Document {
  playlist_id: mongoose.Types.ObjectId;
  source: string;
  track_id: string;
  title: string;
  artist: string;
  cover_url?: string;
  audio_url?: string;
  added_at: Date;
}

const PlaylistTrackSchema = new Schema<IPlaylistTrack>({
  playlist_id: { type: Schema.Types.ObjectId, ref: 'Playlist', required: true },
  source: { type: String, required: true },
  track_id: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  cover_url: { type: String, default: null },
  audio_url: { type: String, default: null },
  added_at: { type: Date, default: Date.now }
});

// A unique combination to prevent duplicating tracks in a playlist
PlaylistTrackSchema.index({ playlist_id: 1, source: 1, track_id: 1 }, { unique: true });

export const PlaylistTrack = mongoose.models.PlaylistTrack || mongoose.model<IPlaylistTrack>("PlaylistTrack", PlaylistTrackSchema);
