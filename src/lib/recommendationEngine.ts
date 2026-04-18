import { PlayerTrack } from "@/store/usePlayerStore";

// Heuristic maps for expanding musical taste profiles
const HEURISTIC_MAPS: Record<string, string[]> = {
  "lofi": ["chill", "study", "relaxing", "jazz"],
  "gaming": ["electronic", "edm", "bass", "trap", "dubstep"],
  "vlog": ["upbeat", "pop", "happy", "summer", "acoustic"],
  "cinematic": ["epic", "orchestral", "trailer", "soundtrack", "dramatic"],
  "podcast": ["background", "corporate", "ambient", "minimal"],
  "workout": ["energy", "rock", "hiphop", "dance", "electronic"],
  "chill": ["lofi", "ambient", "lounge", "downtempo"],
  "pop": ["dance", "upbeat", "vlog", "electronic"],
};

export interface RecommendationMatch {
  tag: string;
  reason: string;
}

export function generateRecommendations(history: PlayerTrack[], favorites: Record<string, any>): RecommendationMatch[] {
  const matches: RecommendationMatch[] = [];
  const processedTags = new Set<string>();

  // Extract relevant signals
  const allTracks = [
    ...history,
    ...Object.values(favorites || {}).map(f => f.track) // Extract track data from favorites if formatted this way. Wait, favorites is usually just string -> boolean, we need tracks.
  ].filter(t => !!t) as PlayerTrack[];

  if (allTracks.length === 0) return []; // Fallback to trending

  // Calculate highest incidence genres natively
  const genreCounts: Record<string, number> = {};
  allTracks.forEach(t => {
    let rawGenre = String(t.genre || "pop").toLowerCase().trim();
    // Normalize generic names
    if (rawGenre.includes('rock')) rawGenre = 'rock';
    else if (rawGenre.includes('electronic') || rawGenre.includes('edm')) rawGenre = 'electronic';
    else if (rawGenre.includes('lofi') || rawGenre.includes('lo-fi')) rawGenre = 'lofi';
    
    genreCounts[rawGenre] = (genreCounts[rawGenre] || 0) + 1;
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);

  // Inject heuristic derivations based on top 3 genres
  sortedGenres.slice(0, 3).forEach(([dominantGenre]) => {
    const suggestions = HEURISTIC_MAPS[dominantGenre];
    if (suggestions) {
      // Pick 2 random derivatives
      const selected = suggestions.sort(() => 0.5 - Math.random()).slice(0, 2);
      selected.forEach(tag => {
        if (!processedTags.has(tag)) {
          processedTags.add(tag);
          matches.push({
            tag,
            reason: `Because you listen to ${dominantGenre.charAt(0).toUpperCase() + dominantGenre.slice(1)} music`
          });
        }
      });
    } else {
      if (!processedTags.has(dominantGenre)) {
         processedTags.add(dominantGenre);
         matches.push({
           tag: dominantGenre,
           reason: `Trending in your taste`
         });
      }
    }
  });

  // Guarantee at least something returns mapped
  if (matches.length === 0) {
    matches.push({ tag: 'chill', reason: 'Recommended For You' });
    matches.push({ tag: 'electronic', reason: 'Trending In Your Taste' });
  }

  return matches;
}
