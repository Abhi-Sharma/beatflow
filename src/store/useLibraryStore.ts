import { create } from 'zustand';

interface LibraryStore {
  favorites: Record<string, boolean>; // key: `${source}-${trackId}`
  setFavorites: (favorites: string[]) => void;
  toggleFavorite: (source: string, trackId: string) => void;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  favorites: {},
  setFavorites: (favoritesList) => set({
    favorites: favoritesList.reduce((acc, current) => ({ ...acc, [current]: true }), {})
  }),
  toggleFavorite: (source, trackId) => set((state) => {
    const key = `${source}-${trackId}`;
    const nextFavorites = { ...state.favorites };
    if (nextFavorites[key]) {
      delete nextFavorites[key];
    } else {
      nextFavorites[key] = true;
    }
    return { favorites: nextFavorites };
  }),
}));
