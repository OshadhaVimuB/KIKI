"use client";

import Image from "next/image";
import { PackagePlus, Star, Check } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { formatCurrency } from "@/lib/utils";
import type { CartItem, GiftBundle } from "@/lib/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function GiftBundleCard({ bundle, onSelect }: { bundle: GiftBundle; onSelect: (items: CartItem[]) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".bundle-item", {
      y: 30,
      opacity: 0,
      filter: "blur(10px)",
      scale: 0.95,
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.5)"
    });
    
    gsap.to(".liquid-float", {
      y: -8,
      duration: 5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 1,
        from: "random"
      }
    });
  }, { scope: containerRef });

  return (
    <article ref={containerRef} className="min-w-[340px] md:min-w-[420px] max-w-[460px] rounded-[2rem] liquid-glass p-5 md:p-6 shrink-0 snap-center relative flex flex-col">
      <div className="absolute top-4 right-4 bg-gold text-on-secondary-container px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 shadow-sm">
        <Star className="w-4 h-4 fill-current" /> {bundle.occasionFit}% Match
      </div>
      
      <div className="bg-surface-glass backdrop-blur-md px-4 py-2 rounded-full inline-block self-start mb-4 border border-white/30">
        <span className="font-label-sm text-label-sm text-on-surface tracking-widest uppercase">Premium Bundle</span>
      </div>
      
      <h3 className="font-headline-sm md:font-headline-md text-primary-container mb-2">{bundle.title}</h3>
      <p className="font-body-sm text-on-surface-variant mb-6">{bundle.description}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {bundle.products.map((product) => (
          <div key={product.id} className="bundle-item bg-white/40 backdrop-blur-md rounded-2xl p-2 relative group hover:-translate-y-1 transition-transform">
            <div className="absolute top-1 right-1 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center z-10 border border-white/50">
              <Check className="w-3 h-3 text-primary-container" />
            </div>
            <div className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center bg-surface-container-low/50 relative mb-2">
              <Image src={product.imageUrl} alt={product.title} fill sizes="100px" className="object-cover rounded-xl liquid-float" />
            </div>
            <p className="font-body-sm text-xs font-semibold text-primary-container truncate" title={product.title}>{product.title}</p>
            <p className="text-gold font-medium text-xs">{formatCurrency(product.price)}</p>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between gap-4 mt-auto">
        <div>
          <p className="font-headline-sm text-gold">{formatCurrency(bundle.totalPrice)}</p>
        </div>
        
        <button
          type="button"
          className="bg-primary-container text-white font-label-md py-3 px-5 rounded-full liquid-btn flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95"
          onClick={() =>
            onSelect(
              bundle.products.map((product) => ({
                productId: product.id,
                title: product.title,
                quantity: 1,
                price: product.price,
                imageUrl: product.imageUrl
              }))
            )
          }
        >
          <PackagePlus className="h-4 w-4" />
          Select Bundle
        </button>
      </div>
    </article>
  );
}
