import mongoose, { Schema, Document } from "mongoose";

export interface IPlaylist extends Document {
  user_id: string;
  name: string;
  description?: string;
  cover_url?: string;
  created_at: Date;
}

const PlaylistSchema = new Schema<IPlaylist>({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: null },
  cover_url: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
});

export const Playlist = mongoose.models.Playlist || mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
