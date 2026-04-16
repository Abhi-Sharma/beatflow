export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-16 h-16 mb-4">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
        {/* Inner spinning ring */}
        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        {/* Subtle inner pulse */}
        <div className="absolute inset-2 bg-emerald-500/20 rounded-full animate-pulse"></div>
      </div>
      <p className="text-emerald-400 font-medium tracking-widest uppercase text-xs animate-pulse">Loading...</p>
    </div>
  );
}
