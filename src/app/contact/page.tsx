export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32 animate-in fade-in">
      <h1 className="text-4xl font-black mb-6 text-white tracking-tight">Contact Support</h1>
      <p className="text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed">
        For application support, bug reports, or legal inquiries regarding DMCA routing, please explicitly reach out.
      </p>
      
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-2xl shadow-xl max-w-lg">
        <h3 className="text-xl font-bold mb-3 text-emerald-400">Email Support</h3>
        <p className="text-zinc-300 font-medium tracking-wide">abhisharma.rediffmail@gmail.com</p>
        <div className="mt-8 p-4 bg-zinc-950 rounded-xl border border-zinc-800/50">
          <p className="text-sm text-zinc-500 leading-relaxed">
            <strong className="text-zinc-300">Important Note:</strong> If you are an artist and wish to have a track removed, please seamlessly contact Jamendo Support directly. Their API inherently dictates global availability across BeatFlow, and any changes automatically cascade down to us.
          </p>
        </div>
      </div>
    </div>
  );
}
