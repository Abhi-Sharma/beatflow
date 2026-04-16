import { MetadataRoute } from 'next';
import { getJamendoCategory } from "@/lib/api/jamendo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = [
    { slug: 'lofi' },
    { slug: 'workout' },
    { slug: 'study-music' },
    { slug: 'chill-vibes' },
    { slug: 'gaming' },
    { slug: 'cinematic' },
    { slug: 'relaxing' },
    { slug: 'vlog' },
    { slug: 'new-releases' },
    { slug: 'trending' }
  ];

  const categoryEntries = categories.map((cat) => ({
    url: `https://beatflow.space/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://beatflow.space',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://beatflow.space/search',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...categoryEntries,
  ];
}
