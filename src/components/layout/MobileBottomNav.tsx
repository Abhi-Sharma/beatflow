"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ListMusic } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/library/favorites", label: "Favorites", icon: Heart },
    { href: "/library/playlists", label: "Library", icon: ListMusic },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-900 border-x-0 z-[60] flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');

        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors active:scale-95 ${
              isActive ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon className={`w-[26px] h-[26px] transition-transform ${isActive ? 'fill-emerald-500/20 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`} />
            <span className="text-[10px] font-semibold tracking-wide">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
