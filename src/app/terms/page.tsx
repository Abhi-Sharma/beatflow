import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32 prose prose-invert prose-emerald animate-in fade-in">
      <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
      <p className="text-zinc-500 mb-8 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-zinc-800 pb-2">1. Legal Content Disclaimer</h2>
      <p className="text-zinc-300 leading-relaxed max-w-3xl">
        BeatFlow is not a mainstream music piracy replication application. It strictly does not provide copyrighted commercial material. BeatFlow functions entirely as a visualization interface for legal, independent, royalty-free music exploiting the public Jamendo API dataset.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-zinc-800 pb-2">2. Acceptable Use Policy</h2>
      <p className="text-zinc-300 leading-relaxed max-w-3xl">
        You explicitly agree not to reverse engineer the Jamendo API calls made by the application for abusive mass downloading scripts, nor hold BeatFlow accountable for third-party DMCA takedowns originating intrinsically from Jamendo's backend structural changes.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-zinc-800 pb-2">3. Termination</h2>
      <p className="text-zinc-300 leading-relaxed max-w-3xl">
        We reserve the absolute right to suspend or block any account seen abusing the platform infrastructure or attempting to illegally manipulate our routing database.
      </p>
    </div>
  );
}
