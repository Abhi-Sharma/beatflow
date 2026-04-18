"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HistoryNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [history, setHistory] = useState({ stack: [] as string[], index: -1 });
  const isNavigating = useRef(false);

  useEffect(() => {
    const currentUrl = `${pathname}${searchParams ? '?' + searchParams.toString() : ''}`;

    if (isNavigating.current) {
      isNavigating.current = false;
      return;
    }

    setHistory(prev => {
      const { stack, index } = prev;
      
      // Detected Native Browser Back
      if (index > 0 && stack[index - 1] === currentUrl) {
        return { stack, index: index - 1 };
      }
      
      // Detected Native Browser Forward
      if (index < stack.length - 1 && stack[index + 1] === currentUrl) {
        return { stack, index: index + 1 };
      }
      
      // Check if perfectly identical (no-op)
      if (stack[index] === currentUrl) return prev;
      
      // Otherwise, it's a fresh route push. Splice any forward paths and append.
      const newStack = stack.slice(0, index + 1);
      newStack.push(currentUrl);
      return { stack: newStack, index: newStack.length - 1 };
    });
  }, [pathname, searchParams]);

  const canGoBack = history.index > 0;
  const canGoForward = history.index < history.stack.length - 1;

  const handleBack = () => {
    if (canGoBack) {
      isNavigating.current = true;
      setHistory(prev => ({ ...prev, index: prev.index - 1 }));
      router.back();
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      isNavigating.current = true;
      setHistory(prev => ({ ...prev, index: prev.index + 1 }));
      router.forward();
    }
  };

  return (
    <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
      <button 
        onClick={handleBack}
        disabled={!canGoBack}
        className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-black/60 transition-all duration-300 
          ${canGoBack 
            ? 'text-zinc-200 hover:text-white hover:bg-black/90 hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.02)] hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]' 
            : 'text-zinc-500 opacity-40 cursor-not-allowed hidden md:flex'}`}
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 relative right-[1px]" />
      </button>
      
      <button 
        onClick={handleForward}
        disabled={!canGoForward}
         className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-black/60 transition-all duration-300 
          ${canGoForward 
            ? 'text-zinc-200 hover:text-white hover:bg-black/90 hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.02)] hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]' 
            : 'text-zinc-500 opacity-40 cursor-not-allowed hidden md:flex'}`}
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 relative left-[1px]" />
      </button>
    </div>
  );
}
