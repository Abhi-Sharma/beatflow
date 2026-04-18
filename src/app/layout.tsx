import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Player } from "@/components/player/Player";
import { FavoritesHydrator } from "@/components/providers/FavoritesHydrator";
import { getUserFavorites } from "@/app/actions/favorites";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import Link from "next/link";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://beatflow.space"),
  title: "BeatFlow - Royalty Free Music for Creators",
  description: "Discover and download high-quality royalty-free music for your videos, vlogs, and streams. A legal independent creator platform powered by Jamendo.",
  openGraph: {
    title: "BeatFlow - Royalty Free Music for Creators",
    description: "Discover and download high-quality royalty-free music for your videos, vlogs, and streams.",
    url: "https://beatflow.space",
    siteName: "BeatFlow",
    images: [
      {
        url: "https://beatflow.space/icon.png", // Assuming icon.png is used as a fallback hero, ideally use an og-image.png
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeatFlow - Royalty Free Music for Creators",
    description: "Discover and download high-quality royalty-free music for your videos, vlogs, and streams.",
    creator: "@beatflow", // Update if there's an actual twitter handle
    images: ["https://beatflow.space/icon.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const favorites = await getUserFavorites();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BeatFlow",
    url: "https://beatflow.space",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://beatflow.space/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BeatFlow",
    url: "https://beatflow.space",
    logo: "https://beatflow.space/icon.png",
  };

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
        </head>
        <body className={`${inter.className} h-screen overflow-hidden flex bg-background text-foreground`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <NextTopLoader color="#10b981" showSpinner={false} height={3} />
          <FavoritesHydrator initialFavorites={favorites} />
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
            <Header />
            <main className="w-full grow overflow-y-auto overflow-x-hidden pt-6 pb-28 md:pb-32 flex flex-col relative">
              <div className="w-full grow shrink-0 flex flex-col min-h-0">
                <PageTransition>
                  {children}
                </PageTransition>
              </div>
              <footer className="w-full mt-auto mt-12 py-5 md:py-6 border-t border-zinc-900/50 shrink-0">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
                  <div className="text-zinc-500 text-xs md:text-sm order-2 md:order-1 text-center md:text-left">
                    © {new Date().getFullYear()} BeatFlow. Legal Royalty-Free Audio.
                  </div>
                  <div className="flex items-center justify-center flex-wrap gap-5 md:gap-6 text-xs md:text-sm font-medium text-zinc-500 order-1 md:order-2">
                    <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
                    <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
                  </div>
                </div>
              </footer>
            </main>
          </div>
            <Player />
            <MobileBottomNav />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
