import { create } from 'zustand';

export interface PlayerTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  downloadUrl?: string;
  duration?: number;
  genre?: string;
  source: 'jamendo' | 'spotify';
}

interface PlayerStore {
  currentTrack: PlayerTrack | null;
  queue: PlayerTrack[];
  isPlaying: boolean;
  volume: number;
  setCurrentTrack: (track: PlayerTrack) => void;
  setQueue: (queue: PlayerTrack[]) => void;
  addToQueue: (track: PlayerTrack) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  setQueue: (queue) => set({ queue }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  playNext: () => set((state) => {
    // Basic queue logic
    if (state.queue.length === 0) return state;
    const currentIndex = state.currentTrack ? state.queue.findIndex(t => t.id === state.currentTrack?.id) : -1;
    if (currentIndex >= 0 && currentIndex < state.queue.length - 1) {
      return { currentTrack: state.queue[currentIndex + 1], isPlaying: true };
    }
    return state;
  }),
  playPrevious: () => set((state) => {
    if (state.queue.length === 0) return state;
    const currentIndex = state.currentTrack ? state.queue.findIndex(t => t.id === state.currentTrack?.id) : -1;
    if (currentIndex > 0) {
      return { currentTrack: state.queue[currentIndex - 1], isPlaying: true };
    }
    return state;
  }),
}));
