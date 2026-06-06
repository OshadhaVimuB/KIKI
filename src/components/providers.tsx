"use client";

import { ShoppingProvider } from "@/lib/shopping-context";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ShoppingProvider>
      {children}
    </ShoppingProvider>
  );
}
