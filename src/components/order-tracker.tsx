"use client";

import { ExternalLink, Loader2, PackageCheck } from "lucide-react";
import { useState } from "react";

import type { CheckoutResult, OrderTrackingResult } from "@/lib/types";

export function OrderTracker({ checkout }: { checkout?: CheckoutResult }) {
  const [tracking, setTracking] = useState<OrderTrackingResult | null>(null);
  const [loading, setLoading] = useState(false);

  if (!checkout) return null;

  async function track() {
    if (!checkout) return;
    setLoading(true);
    try {
      const response = await fetch("/api/commerce", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "track", orderId: checkout.orderId })
      });
      const payload = await response.json();
      setTracking(payload.order);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl liquid-glass p-5 mt-4 shrink-0">
      <div className="mb-3 flex items-center gap-2">
        <PackageCheck className="h-6 w-6 text-primary-container" />
        <h2 className="font-headline-sm text-primary-container">Checkout ready</h2>
      </div>
      <p className="text-sm font-medium text-on-surface-variant mb-5 bg-white/40 p-3 rounded-xl border border-white/50">{checkout.message}</p>
      <div className="grid grid-cols-2 gap-3">
        <button 
           type="button" 
           className="bg-primary-container text-white font-label-md py-2.5 px-4 rounded-full liquid-btn flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
           onClick={() => window.open(checkout.paymentUrl, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="h-4 w-4" />
          Pay
        </button>
        <button 
           type="button" 
           className="bg-white/50 hover:bg-white/80 border border-white/60 text-primary-container font-label-md py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm" 
           onClick={track} 
           disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
          Track
        </button>
      </div>
      {tracking && <p className="mt-4 text-sm font-semibold text-primary-container bg-primary-fixed/50 p-3 rounded-xl border border-primary-fixed-dim/30">{tracking.message}</p>}
    </section>
  );
}
