"use client";

import { ProductCard } from "@/components/product-card";
import type { CartItem, ProductSummary } from "@/lib/types";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function ProductCarousel({
  products,
  onInspect,
  onSelect
}: {
  products: ProductSummary[];
  onInspect: (product: ProductSummary) => void;
  onSelect: (item: CartItem) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".product-card-anim", {
      x: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  if (!products.length) return null;

  return (
    <section ref={containerRef} className="space-y-4" aria-label="KIKI recommendations">
      <div className="flex items-end justify-between gap-4 pl-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-container/80 mb-1">Focused shortlist</p>
          <h2 className="text-2xl font-black text-primary-container">KIKI’s top picks</h2>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {products.map((product) => (
          <div key={product.id} className="product-card-anim snap-center shrink-0">
             <ProductCard product={product} onInspect={onInspect} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </section>
  );
}
