import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Heart, ListMusic, Smartphone, History, Music } from "lucide-react";

export function GuestAccountCTA() {
  const benefits = [
    { label: "Save your favorite tracks", icon: Heart },
    { label: "Create custom playlists", icon: ListMusic },
    { label: "Sync completely across all devices", icon: Smartphone },
    { label: "Track your recently played history", icon: History },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] py-12 px-4">
      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <Music className="w-8 h-8 text-emerald-500" />
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 text-center">
        Join BeatFlow
      </h1>
      
      <p className="text-zinc-400 text-base md:text-lg text-center max-w-md mb-10 leading-relaxed font-medium">
        Sign up for free to unlock the ultimate premium creator audio experience.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto mb-16">
        <SignUpButton mode="modal"><button className="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]">Sign Up for Free</button></SignUpButton>
        <SignInButton mode="modal"><button className="w-full sm:w-auto px-10 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95">Log In</button></SignInButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div key={idx} className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/50 p-4 md:p-5 rounded-2xl hover:bg-zinc-800/60 transition-colors">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm md:text-base font-semibold text-zinc-200">{benefit.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
