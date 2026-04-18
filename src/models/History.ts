import mongoose, { Schema, Document } from "mongoose";

export interface IHistory extends Document {
  user_id: string;
  source: string;
  track_id: string;
  title: string;
  artist: string;
  cover_url?: string;
  audio_url?: string;
  played_at: Date;
}

const HistorySchema = new Schema<IHistory>({
  user_id: { type: String, required: true },
  source: { type: String, required: true, enum: ['jamendo'] },
  track_id: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  cover_url: { type: String, default: null },
  audio_url: { type: String, default: null },
  played_at: { type: Date, default: Date.now }
});

// Create index for efficient querying by user
HistorySchema.index({ user_id: 1, played_at: -1 });
// Create a unique index for user + track, so we can update played_at instead of duplicating
HistorySchema.index({ user_id: 1, source: 1, track_id: 1 }, { unique: true });

export const History = mongoose.models.History || mongoose.model<IHistory>("History", HistorySchema);
