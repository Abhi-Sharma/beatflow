"use client";

import { useUser, SignOutButton, useClerk } from "@clerk/nextjs";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import { Heart, ListMusic, History, Edit, Key, LogOut, Settings, Bell, Paintbrush } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export function AccountDashboard({ initialPlaylistsCount = 0, initialHistoryCount = 0 }: { initialPlaylistsCount?: number, initialHistoryCount?: number }) {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const { favorites } = useLibraryStore();
  const { tracks } = useHistoryStore();
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isLoaded || !user) return <div className="h-[50vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" /></div>;

  const joinDate = new Date(user.createdAt!).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const favCount = mounted && favorites ? Object.keys(favorites).length : 0;
  const historyCount = initialHistoryCount;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <img 
          src={user.imageUrl} 
          alt={user.fullName || "User"} 
          className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl border-4 border-zinc-800 z-10"
        />
        <div className="flex flex-col items-center md:items-start z-10 text-center md:text-left">
          <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase mb-2">Premium Member</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">{user.fullName}</h1>
          <p className="text-zinc-400 font-medium mb-4">{user.primaryEmailAddress?.emailAddress}</p>
          <div className="bg-zinc-800/80 px-4 py-1.5 rounded-full text-xs font-semibold text-zinc-300">
            Joined {joinDate}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        
        <div className="space-y-8">
          
          {/* Stats Overview */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Your Activity</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/library/favorites" className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-zinc-800/80 transition-colors group cursor-pointer">
                <Heart className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-3xl font-black text-white">{favCount}</span>
                <span className="text-xs text-zinc-500 font-bold uppercase mt-1">Favorites</span>
              </Link>
              <Link href="/" className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-zinc-800/80 transition-colors group cursor-pointer">
                <History className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-3xl font-black text-white">{historyCount}</span>
                <span className="text-xs text-zinc-500 font-bold uppercase mt-1">Recently Played</span>
              </Link>
              <Link href="/library/playlists" className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-zinc-800/80 transition-colors group cursor-pointer col-span-2 md:col-span-1">
                <ListMusic className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-3xl font-black text-white">{initialPlaylistsCount}</span>
                <span className="text-xs text-zinc-500 font-bold uppercase mt-1">Playlists</span>
              </Link>
            </div>
          </section>

          {/* Preferences */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Preferences</h2>
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl divide-y divide-zinc-800/60">
              <div 
                onClick={() => mounted && setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-between p-5 hover:bg-zinc-800/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-800 rounded-xl"><Paintbrush className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <h3 className="text-white font-semibold">Theme</h3>
                    <p className="text-sm text-zinc-400">Toggle the aesthetic</p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full capitalize">
                  {mounted ? theme : 'Dark'}
                </div>
              </div>
              <div className="flex items-center justify-between p-5 hover:bg-zinc-800/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-800 rounded-xl"><Settings className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <h3 className="text-white font-semibold">Auto Play</h3>
                    <p className="text-sm text-zinc-400">Play similar tracks indefinitely</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative shadow-inner"><div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" /></div>
              </div>
              <div className="flex items-center justify-between p-5 hover:bg-zinc-800/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-800 rounded-xl"><Bell className="w-5 h-5 text-zinc-400" /></div>
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">Email Notifications <span className="bg-zinc-800 text-[10px] px-2 py-0.5 rounded text-zinc-300">WIP</span></h3>
                    <p className="text-sm text-zinc-400">Updates from top creators</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-zinc-800 rounded-full relative shadow-inner"><div className="absolute left-1 top-1 w-4 h-4 bg-zinc-600 rounded-full" /></div>
              </div>
            </div>
          </section>

        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4">
          <button 
            onClick={() => openUserProfile()}
            className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold p-4 rounded-2xl flex items-center justify-between transition-all group scale-100 active:scale-95 duration-200 shadow-sm hover:shadow-md"
          >
            <span className="flex items-center gap-3"><Edit className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" /> Edit Profile</span>
          </button>
          
          <button 
            onClick={() => openUserProfile()}
            className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold p-4 rounded-2xl flex items-center justify-between transition-all group scale-100 active:scale-95 duration-200 shadow-sm hover:shadow-md relative overflow-hidden"
          >
            <span className="flex items-center gap-3"><Key className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" /> Manage Security</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-1 rounded">Clerk</span>
          </button>
          
          <div className="pt-4 mt-4 border-t border-zinc-800/50">
            <SignOutButton>
              <button className="w-full bg-transparent border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 font-bold p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>

      </div>
    </div>
  );
}
