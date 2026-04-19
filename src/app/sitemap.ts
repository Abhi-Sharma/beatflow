import { MetadataRoute } from 'next';
import { seoPagesConfig } from "@/lib/seo-pages";
import { curatedPlaylists } from "@/lib/curated-playlists";

const BASE_URL = 'https://beatflow.space';

export async function generateSitemaps() {
  // Bonus: Structure to support splitting if URLs exceed 50k limit
  return [{ id: 0 }];
}

// Helper for generating main static pages
function getMainRoutes(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/search',
    '/free-music',
    '/favorites',
    '/playlists',
    '/collections',
    '/downloads',
    '/recently-played',
    '/account',
    '/privacy',
    '/terms',
    '/contact'
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}

// Helper for SEO landing pages from central data source
function getSeoRoutes(): MetadataRoute.Sitemap {
  return Object.keys(seoPagesConfig).map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
}

// Helper for Playlist pages
function getPlaylistRoutes(): MetadataRoute.Sitemap {
  return curatedPlaylists.map((playlist) => ({
    url: `${BASE_URL}/playlists/${playlist.slug}`,
    lastModified: new Date(playlist.createdAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8, // The prompt requested 0.8 for core pages; playlist directory is core
  }));
}

// Helper to keep legacy category routes
function getCategoryRoutes(): MetadataRoute.Sitemap {
  const categories = [
    'lofi', 'workout', 'study-music', 'chill-vibes', 'gaming',
    'cinematic', 'relaxing', 'vlog', 'new-releases', 'trending'
  ];

  return categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}

// Helper for Track Pages
async function getTrackRoutes(): Promise<MetadataRoute.Sitemap> {
  // Note: Tracks are currently dynamic from an external API (Deezer/Jamendo) 
  // without a complete local cache mapping slugs.
  // If track data gets fully synced to a database source, implement the fetch here:
  
  // Example for future DB source:
  // const tracks = await db.tracks.findMany({ select: { slug: true } });
  // return tracks.map(track => ({
  //   url: `${BASE_URL}/track/${track.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'monthly',
  //   priority: 0.7,
  // }));
  
  return [];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // If we had chunks, we would resolve data based on the id segment.
  
  const dynamicTracks = await getTrackRoutes();

  return [
    ...getMainRoutes(),
    ...getSeoRoutes(),
    ...getPlaylistRoutes(),
    ...getCategoryRoutes(),
    ...dynamicTracks,
  ];
}
