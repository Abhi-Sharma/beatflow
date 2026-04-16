import { SearchInterface } from "@/components/search/SearchInterface";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Royalty Free Music | BeatFlow",
  description: "Search across thousands of royalty-free tracks for your videos, vlogs, and streams.",
  alternates: {
    canonical: "/search",
  },
};

export default function SearchPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Search</h1>
      <SearchInterface />
    </div>
  );
}
