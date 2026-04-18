import { ShieldCheck, DownloadCloud, DollarSign, Video, Camera, Lock, Star } from "lucide-react";
import { SeoBenefitData } from "@/lib/seo-pages";

interface SeoFeaturesProps {
  benefits: SeoBenefitData[];
}

const IconMap: Record<string, any> = {
  shield: ShieldCheck,
  download: DownloadCloud,
  money: DollarSign,
  youtube: Video,
  instagram: Camera,
  lock: Lock,
  star: Star
};

export function SeoFeatures({ benefits }: SeoFeaturesProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="px-4 md:px-8 max-w-[1400px] mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, idx) => {
          const Icon = IconMap[benefit.icon] || ShieldCheck;
          
          return (
            <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 hover:bg-zinc-800/80 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 border border-emerald-500/20">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
