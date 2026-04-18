"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ListMusic, Disc3, User } from "lucide-react";
import { motion } from "framer-motion";

export function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/playlists", label: "Curated", icon: Disc3 },
    { href: "/library/favorites", label: "Favorites", icon: Heart },
    { href: "/account", label: "Account", icon: User },
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
            className="relative flex flex-col items-center justify-center w-full h-full gap-1 pt-0"
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-active-indicator"
                className="absolute top-0 w-8 h-[3px] bg-emerald-500 rounded-b-full shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div 
              whileTap={{ scale: 0.85, opacity: 0.7 }}
              className={`flex flex-col items-center justify-center gap-1 mt-1 transition-colors ${
                isActive ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform ${isActive ? 'fill-emerald-500/20 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]' : ''}`} />
              <span className={`text-[10px] tracking-wide transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>{link.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
