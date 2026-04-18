import { getJamendoCategory } from "@/lib/api/jamendo";
import { TrackCard } from "@/components/track/TrackCard";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { PlayerTrack } from "@/store/usePlayerStore";
import { getSeoPage, seoPagesConfig } from "@/lib/seo-pages";

import { SeoHero } from "@/components/seo/SeoHero";
import { SeoFeatures } from "@/components/seo/SeoFeatures";
import { SeoFaq } from "@/components/seo/SeoFaq";
import { SeoRelated } from "@/components/seo/SeoRelated";

export async function generateStaticParams() {
  // Prerender all configured SEO pages
  return Object.keys(seoPagesConfig).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pageData = getSeoPage(slug);
  
  if (!pageData) {
    return {};
  }
  
  return {
    title: pageData.title,
    description: pageData.description,
    alternates: {
      canonical: `https://beatflow.space/${slug}`,
    },
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: `https://beatflow.space/${slug}`,
      siteName: "BeatFlow",
      locale: "en_US",
      type: "website",
    }
  };
}

export default async function GenericSEOPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = getSeoPage(slug);
  
  if (!pageData) {
    notFound();
  }

  // Fetch Music
  const res = await getJamendoCategory(pageData.apiQuery, 20);

  const mapJamendo = (t: any): PlayerTrack => ({
    id: t.id,
    title: t.name,
    artist: t.artist_name,
    coverUrl: t.image,
    audioUrl: t.audio,
    downloadUrl: t.audiodownload || undefined,
    source: 'jamendo',
  });

  const tracks = (res.results || []).map(mapJamendo);

  // JSON-LD Generation
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pageData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://beatflow.space/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": pageData.h1,
        "item": `https://beatflow.space/${slug}`
      }
    ]
  };

  return (
    <div className="animate-in fade-in pb-12 w-full">
      {/* JSON-LD Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero Section */}
      <SeoHero h1={pageData.h1} heroCopy={pageData.heroCopy} tags={pageData.tags} />

      {/* Benefits Overview */}
      <SeoFeatures benefits={pageData.benefits} />

      {/* Curated Tracks Grid */}
      <section id="tracks" className="px-4 md:px-8 max-w-[1400px] mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">Curated {pageData.h1}</h2>
            <p className="text-zinc-400">Stream and download the best tracks instantly.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {tracks.length > 0 ? (
            tracks.map((t) => (
              <TrackCard key={`seo-track-${t.id}`} track={t} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
              No tracks currently found matching this specific vibe. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* FAQ Accordion */}
      <SeoFaq faqs={pageData.faqs} />

      {/* Related Internal Interlinking */}
      <SeoRelated slugs={pageData.relatedSlugs} />
      
    </div>
  );
}
