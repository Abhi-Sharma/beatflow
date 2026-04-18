import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface SeoHeroProps {
  h1: string;
  heroCopy: string;
  tags: string[];
}

export function SeoHero({ h1, heroCopy, tags }: SeoHeroProps) {
  return (
    <section className="px-4 md:px-8 mt-6">
      <div className="min-h-[30rem] md:min-h-[36rem] rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-b border-zinc-800 flex flex-col justify-center relative overflow-hidden shadow-2xl mx-auto max-w-[1400px]">
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent opacity-70 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-zinc-700/50">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white leading-tight">
             {h1}
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl drop-shadow mb-10 font-medium leading-relaxed max-w-2xl mx-auto">
            {heroCopy}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="#tracks" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-base font-bold transition-all focus-visible:outline-none ring-offset-background bg-emerald-500 text-black hover:bg-emerald-400 h-14 px-10 py-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95">
              Browse Free Tracks
            </Link>
            <Link href="/" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-base font-bold transition-all focus-visible:outline-none ring-offset-background bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 h-14 px-10 py-2 hover:scale-105 active:scale-95">
              Go to Homepage
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-zinc-500">
            <ShieldCheck className="w-5 h-5 text-emerald-500/80" />
            <span className="text-sm font-semibold">100% Creator Safe & Royalty-Free</span>
          </div>
        </div>
      </div>
    </section>
  );
}
