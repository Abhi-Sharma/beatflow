"use client";

import { useEffect, useRef } from "react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useAuth } from "@clerk/nextjs";
import { getUserFavorites } from "@/app/actions/favorites";

interface FavoritesHydratorProps {
  initialFavorites: any[];
}

export function FavoritesHydrator({ initialFavorites }: FavoritesHydratorProps) {
  const setFavorites = useLibraryStore((state) => state.setFavorites);
  const isHydrated = useRef(false);
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (!isHydrated.current && isLoaded) {
      // Map the array of DB favorite objects into the specific `${source}-${track_id}` keys format
      const favoriteKeys = initialFavorites.map(fav => `${fav.source}-${fav.track_id}`);
      setFavorites(favoriteKeys);
      isHydrated.current = true;
    }
  }, [initialFavorites, setFavorites, isLoaded]);

  // Automatically refetch favorites dynamically if the user signs in via modal
  useEffect(() => {
    if (isHydrated.current && userId) {
      async function syncNewSession() {
        const freshFavorites = await getUserFavorites();
        const favoriteKeys = freshFavorites.map((fav: any) => `${fav.source}-${fav.track_id}`);
        setFavorites(favoriteKeys);
      }
      syncNewSession();
    }
  }, [userId, setFavorites]);

  return null;
}
