"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// We extract props separately since next-themes 14 typing patterns sometimes vary slightly
export function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
