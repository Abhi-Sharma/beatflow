export interface AIQueryMatch {
  tags: string[];
  reason: string;
}

export function extractMusicIntent(query: string): AIQueryMatch {
  const q = query.toLowerCase();
  
  // High-performance heuristic map covering most user intentions
  const keywordMap: Record<string, string[]> = {
    cinematic: ['cinematic', 'movie', 'epic', 'trailer', 'orchestral', 'film', 'dramatic', 'score'],
    sad: ['sad', 'emotional', 'crying', 'depressed', 'melancholy', 'heartbreak', 'tear'],
    lofi: ['lofi', 'lo-fi', 'coding', 'study', 'relax', 'night', 'chill', 'lounge', 'homework'],
    workout: ['workout', 'gym', 'hype', 'pump', 'energy', 'run', 'lifting', 'fitness', 'training', 'muscle'],
    gaming: ['gaming', 'twitch', 'stream', 'montage', 'fps', 'electronic', 'edm', 'dubstep', 'bass', 'trap'],
    vlog: ['vlog', 'travel', 'youtube', 'happy', 'sunny', 'lifestyle', 'acoustic', 'upbeat', 'vacation'],
    dance: ['dance', 'party', 'wedding', 'punjabi', 'club', 'pop', 'house', 'groove'],
    focus: ['focus', 'concentration', 'work', 'ambient', 'minimal', 'brain'],
    rock: ['rock', 'metal', 'guitar', 'indie', 'heavy']
  };

  const matchedTags = new Set<string>();
  
  // Extract tags based on keywords
  for (const [tag, synonyms] of Object.entries(keywordMap)) {
    for (const syn of synonyms) {
      if (q.includes(syn)) {
        matchedTags.add(tag);
      }
    }
  }

  const tagsArr = Array.from(matchedTags).slice(0, 3); // Max 3 tags for better Jamendo matches
  
  if (tagsArr.length > 0) {
    const displayTags = tagsArr.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ');
    return {
      tags: tagsArr,
      reason: `Matches your ${displayTags} vibe`
    };
  } else {
    // Extract single generic words if they exist just in case
    const genericTags = q.split(' ').filter(w => w.length > 3).slice(0, 2);
    if (genericTags.length > 0) {
      return {
        tags: genericTags,
        reason: `Trending ${genericTags[0]} tracks`
      };
    }

    // Default fallback
    return {
      tags: ['chill', 'pop'],
      reason: 'Recommended for you'
    };
  }
}
