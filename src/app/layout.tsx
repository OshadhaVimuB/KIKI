import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "KIKI | AI Shopping Concierge",
  description: "A conversational shopping concierge for Kapruka gifts."
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={cn(jakarta.variable, "min-h-screen bg-surface-container-low font-sans text-on-surface antialiased")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
