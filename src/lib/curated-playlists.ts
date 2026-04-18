export interface CuratedPlaylist {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  trackIds: string[]; // For specific tracks if available
  apiQuery: string;   // For dynamic generation
  totalTracks: number;
  createdAt: string;
}

export const curatedPlaylists: CuratedPlaylist[] = [
  {
    id: "p-1001",
    slug: "best-music-for-reels",
    title: "Best Music for Reels",
    description: "Trending, aesthetic, and energetic background music hand-picked for Instagram Reels and TikToks.",
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    tags: ["Reels", "Trending", "Pop"],
    trackIds: [], 
    apiQuery: "pop,upbeat",
    totalTracks: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: "p-1002",
    slug: "lofi-coding-session",
    title: "LoFi Coding Session",
    description: "Deep focus LoFi beats perfectly curated for long programming and study sessions.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tags: ["LoFi", "Study", "Coding"],
    trackIds: [], 
    apiQuery: "lofi",
    totalTracks: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: "p-1003",
    slug: "gaming-montage-pack",
    title: "Gaming Montage Pack",
    description: "High-BPM, aggressive electronic music built for syncing up with your best gaming highlights.",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    tags: ["Gaming", "EDM", "Montage"],
    trackIds: [], 
    apiQuery: "gaming",
    totalTracks: 18,
    createdAt: new Date().toISOString()
  },
  {
    id: "p-1004",
    slug: "travel-vlog-essentials",
    title: "Travel Vlog Essentials",
    description: "Beautiful acoustic strings and worldly ambient tracks dropping you right into the adventure.",
    coverImage: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
    tags: ["Travel", "Acoustic", "Vlog"],
    trackIds: [], 
    apiQuery: "acoustic,world",
    totalTracks: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: "p-1005",
    slug: "chill-study-mix",
    title: "Chill Study Mix",
    description: "Relaxing, quiet, and thought-provoking ambient tracks designed to boost cognition.",
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953eb1f5ba?w=800&q=80",
    tags: ["Chill", "Ambient", "Study"],
    trackIds: [], 
    apiQuery: "chill",
    totalTracks: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: "p-1006",
    slug: "workout-energy-boost",
    title: "Workout Energy Boost",
    description: "Intense, heavy drops to push you through your final set. Royalty-free fitness music.",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    tags: ["Workout", "Gym", "Electronic"],
    trackIds: [], 
    apiQuery: "workout",
    totalTracks: 20,
    createdAt: new Date().toISOString()
  }
];

export function getPlaylistBySlug(slug: string): CuratedPlaylist | undefined {
  return curatedPlaylists.find(p => p.slug === slug);
}
