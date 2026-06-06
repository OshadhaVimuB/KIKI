"use client";

import Image from "next/image";
import { CreditCard, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { formatCurrency } from "@/lib/utils";
import type { CartItem, CheckoutResult } from "@/lib/types";
import type { Recipient } from "@/components/recipient-form";

export function CheckoutPanel({
  items,
  recipient,
  onRemove,
  onCheckout
}: {
  items: CartItem[];
  recipient: Recipient;
  onRemove: (productId: string) => void;
  onCheckout: (checkout: CheckoutResult) => void;
}) {
  const [loading, setLoading] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const ready = items.length > 0 && recipient.name.trim() && recipient.phone.trim() && recipient.address.trim();

  async function createCheckout() {
    if (!ready) return;
    setLoading(true);
    try {
      const response = await fetch("/api/commerce", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "checkout", items, recipient })
      });
      const payload = await response.json();
      onCheckout(payload.checkout);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl liquid-glass p-5 shrink-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-headline-sm text-primary-container">Selected gifts</h2>
        <span className="text-sm font-black text-gold">{formatCurrency(total)}</span>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-on-surface-variant bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50 text-center">Selected products appear here.</p>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-xl bg-white/50 backdrop-blur-sm p-2 border border-white/60 shadow-sm transition-transform hover:-translate-y-0.5">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-surface-container-low">
                <Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-primary-container">{item.title}</p>
                <p className="text-xs font-semibold text-gold mt-0.5">{formatCurrency(item.price)}</p>
              </div>
              <button type="button" aria-label={`Remove ${item.title}`} onClick={() => onRemove(item.productId)} className="w-8 h-8 flex items-center justify-center rounded-full text-outline hover:bg-error-container hover:text-error transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
      <button 
         type="button" 
         className="mt-5 w-full bg-primary-container text-white font-label-md py-3 px-5 rounded-full liquid-btn flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95" 
         disabled={!ready || loading} 
         onClick={createCheckout}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        Create checkout
      </button>
    </section>
  );
}
