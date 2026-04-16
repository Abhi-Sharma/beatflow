"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex-1 w-full h-full flex flex-col">{children}</div>;
  }

  // Pure entrance animation. AnimatePresence is extremely unstable in Next.js App Router layouts
  // without heavily complex FrozenRouter implementations. This guarantees a buttery smooth page entrance.
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 15, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.35, 
        ease: [0.22, 1, 0.36, 1] as const 
      }}
      className="flex-1 w-full flex flex-col min-w-0"
    >
      {children}
    </motion.div>
  );
}
