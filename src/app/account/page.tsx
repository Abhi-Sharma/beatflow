import { auth } from "@clerk/nextjs/server";
import { GuestAccountCTA } from "@/components/account/GuestAccountCTA";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { Metadata } from "next";
import { getUserPlaylists } from "@/app/actions/playlists";
import { getUserHistory } from "@/app/actions/history";
export const metadata: Metadata = {
  title: "Account Overview | BeatFlow",
  description: "Manage your BeatFlow profile, preferences, and account settings.",
};

export default async function AccountPage() {
  const { userId } = await auth();
  const playlists = userId ? await getUserPlaylists() : [];
  const history = userId ? await getUserHistory() : [];

  return (
    <main className="min-h-screen w-full px-4 md:px-8 py-8 md:py-10 max-w-[1400px] mx-auto animate-in fade-in pb-24 duration-500">
      {userId ? <AccountDashboard initialPlaylistsCount={playlists.length} initialHistoryCount={history.length} /> : <GuestAccountCTA />}
    </main>
  );
}
