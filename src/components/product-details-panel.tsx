"use client";

import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { formatCurrency } from "@/lib/utils";
import type { ProductDetails, ProductSummary } from "@/lib/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function ProductDetailsPanel({ product, onClose }: { product?: ProductSummary; onClose: () => void }) {
  const [details, setDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (product && panelRef.current) {
      gsap.fromTo(panelRef.current, 
        { x: "100%", opacity: 0 }, 
        { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, { dependencies: [product], scope: panelRef });

  const handleClose = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (!product) return;
    const productId = product.id;

    async function loadProductDetails() {
      setLoading(true);
      setDetails(null);
      try {
        const response = await fetch("/api/commerce", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "product", productId })
        });
        const payload = await response.json();
        setDetails(payload.product);
      } catch {
        setDetails(null);
      } finally {
        setLoading(false);
      }
    }

    void loadProductDetails();
  }, [product]);

  if (!product) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={handleClose} />
      <aside ref={panelRef} className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/80 backdrop-blur-2xl p-6 shadow-[[-20px_0_40px_rgba(0,0,0,0.1)]] sm:rounded-l-[2rem] border-l border-white/50" aria-label="Product details">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline-sm text-primary-container">Product details</h2>
          <button type="button" aria-label="Close product details" onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-primary-container border border-white/60 shadow-sm transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        {loading ? (
          <div className="flex h-72 items-center justify-center text-on-surface-variant font-medium">
            <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
            Loading details...
          </div>
        ) : (
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pb-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-container-low shadow-inner border border-white/60">
              <Image src={(details ?? product).imageUrl} alt={(details ?? product).title} fill sizes="420px" className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-container/80">{(details ?? product).category}</p>
              <h3 className="mt-2 text-2xl font-black text-primary-container leading-tight">{(details ?? product).title}</h3>
              <p className="mt-3 text-2xl font-black text-gold">{formatCurrency((details ?? product).price, (details ?? product).currency)}</p>
            </div>
            <p className="text-sm leading-relaxed text-on-surface-variant bg-white/40 p-4 rounded-xl border border-white/50">
              {details?.description ?? "A carefully selected Kapruka product. Delivery and availability are checked before checkout."}
            </p>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
              <p className="font-bold text-primary-container mb-1">Delivery</p>
              <p className="text-on-surface-variant">{details?.deliveryNotes ?? product.deliveryLabel}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
