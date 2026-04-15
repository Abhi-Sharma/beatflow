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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeatFlow - Premium Music Streaming",
  description: "Listen to the best mainstream and royalty-free music.",
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
            <main className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-28 md:pb-32">
              {children}
            </main>
          </div>
          <Player />
          <MobileBottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
