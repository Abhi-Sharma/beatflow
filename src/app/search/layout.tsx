import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Royalty Free Music & Spotify Discovery | BeatFlow",
  description: "Search across thousands of royalty-free tracks for your videos, discovery trending Spotify hits, and find the perfect sound.",
  alternates: {
    canonical: "/search",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
