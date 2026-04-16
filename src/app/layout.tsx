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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeatFlow - Royalty Free Music",
  description: "Discover and download high-quality royalty-free music for your videos, vlogs, and streams. A legal independent creator platform powered by Jamendo.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const favorites = await getUserFavorites();

  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} h-screen overflow-hidden flex bg-background text-foreground`}>
          <FavoritesHydrator initialFavorites={favorites} />
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-28 md:pb-32 flex flex-col relative">
              <div className="flex-1 w-full h-full flex flex-col min-h-0">
                <PageTransition>
                  {children}
                </PageTransition>
              </div>
              <footer className="mt-16 py-8 px-6 text-center text-xs text-zinc-600 flex flex-col items-center justify-center gap-3 border-t border-zinc-900/50 block md:hidden">
                <div className="flex items-center gap-6 font-medium">
                  <Link href="/privacy-policy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-zinc-400 transition-colors">TOS</Link>
                  <Link href="/contact" className="hover:text-zinc-400 transition-colors">Contact</Link>
                </div>
                <div className="tracking-wide">© {new Date().getFullYear()} BeatFlow. Legal Royalty-Free Audio.</div>
              </footer>
            </main>
          </div>
          <Player />
          <MobileBottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
