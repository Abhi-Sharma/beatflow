import { SeoFaqData } from "@/lib/seo-pages";

interface SeoFaqProps {
  faqs: SeoFaqData[];
}

export function SeoFaq({ faqs }: SeoFaqProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="px-4 md:px-8 max-w-4xl mx-auto py-12 md:py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
        <p className="text-zinc-400 text-lg">Everything you need to know about using this music.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <details className="group">
               <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-white text-lg hover:text-emerald-400 transition-colors">
                 <span>{faq.question}</span>
                 <span className="transition group-open:rotate-180">
                   <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                 </span>
               </summary>
               <div className="text-zinc-400 px-6 pb-6 text-base leading-relaxed">
                 <p>{faq.answer}</p>
               </div>
            </details>
          </div>
        ))}
      </div>
    </section>
  );
}
