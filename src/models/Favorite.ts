import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  user_id: string;
  source: string;
  track_id: string;
  title: string;
  artist: string;
  cover_url?: string;
  audio_url?: string;
  created_at: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  user_id: { type: String, required: true },
  source: { type: String, required: true, enum: ['jamendo'] },
  track_id: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  cover_url: { type: String, default: null },
  audio_url: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
});

// A unique combination to prevent duplicating favorites for the same track
FavoriteSchema.index({ user_id: 1, source: 1, track_id: 1 }, { unique: true });

export const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", FavoriteSchema);
