import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlayerTrack } from './usePlayerStore';

export interface HistoryTrack extends PlayerTrack {
  playedAt: string;
}

interface HistoryStore {
  tracks: HistoryTrack[];
  addTrack: (track: PlayerTrack) => void;
  setTracks: (tracks: HistoryTrack[]) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      tracks: [],
      addTrack: (track) => set((state) => {
        // Remove track if it already exists, then push to top
        const filtered = state.tracks.filter(
          (t) => !(t.id === track.id && t.source === track.source)
        );
        
        const historyTrack: HistoryTrack = {
          ...track,
          playedAt: new Date().toISOString(),
        };

        const newTracks = [historyTrack, ...filtered].slice(0, 50); // Keep max 50
        return { tracks: newTracks };
      }),
      setTracks: (tracks) => set({ tracks }),
      clearHistory: () => set({ tracks: [] })
    }),
    {
      name: 'beatflow-guest-history',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
