import Link from "next/link";
import { seoPagesConfig } from "@/lib/seo-pages";

interface SeoRelatedProps {
  slugs: string[];
}

export function SeoRelated({ slugs }: SeoRelatedProps) {
  if (!slugs || slugs.length === 0) return null;

  const validSlugs = slugs.map(slug => seoPagesConfig[slug]).filter(Boolean);

  if (validSlugs.length === 0) return null;

  return (
    <section className="px-4 md:px-8 max-w-[1400px] mx-auto py-12">
      <h2 className="text-2xl font-bold text-white mb-6">Explore Related Collections</h2>
      <div className="flex flex-wrap gap-3">
        {validSlugs.map((page) => (
          <Link 
            key={page.slug} 
            href={`/${page.slug}`}
            className="px-5 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-emerald-400 hover:border-zinc-600 transition-all shadow-sm"
          >
            {page.h1}
          </Link>
        ))}
        {/* Link back to search or home for thorough interlinking */}
        <Link 
          href="/search"
          className="px-5 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-emerald-400 hover:border-zinc-600 transition-all shadow-sm"
        >
          Search All Music
        </Link>
      </div>
    </section>
  );
}
