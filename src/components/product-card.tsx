"use client";

import Image from "next/image";
import { CheckCircle2, Eye, Plus, Truck, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CartItem, ProductSummary } from "@/lib/types";

export function ProductCard({
  product,
  onInspect,
  onSelect
}: {
  product: ProductSummary;
  onInspect: (product: ProductSummary) => void;
  onSelect: (item: CartItem) => void;
}) {
  return (
    <article className="grid h-full min-w-[282px] max-w-[282px] grid-rows-[168px_1fr] overflow-hidden rounded-[2rem] liquid-glass transition-all hover:-translate-y-2 group cursor-pointer border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.07)]">
      <div className="relative w-full h-full p-2">
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <Image src={product.imageUrl} alt={product.title} fill sizes="282px" className="object-cover transition-transform group-hover:scale-105 duration-500" />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-primary shadow-sm border border-white/50">{product.label}</span>
      </div>
      <div className="flex min-h-0 flex-col gap-3 px-5 py-4">
        <div>
          <h3 className="line-clamp-2 text-base font-bold text-primary-container">{product.title}</h3>
          <p className="mt-1 text-lg font-black text-gold">{formatCurrency(product.price, product.currency)}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Truck className="h-4 w-4 text-primary" />
          {product.deliveryLabel}
        </div>
        
        <div className="bg-gold/10 w-fit text-on-secondary-container px-2 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-sm border border-gold/30">
           <Star className="w-3 h-3 fill-current" /> {product.matchScore}% Match
        </div>

        <ul className="space-y-1 text-xs text-on-surface-variant mt-2">
          {product.highlights.slice(0, 2).map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-container" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-2">
          <button
            type="button"
            className="bg-primary-container text-white font-label-md py-2.5 px-4 rounded-full liquid-btn flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
            onClick={() =>
              onSelect({
                productId: product.id,
                title: product.title,
                quantity: 1,
                price: product.price,
                imageUrl: product.imageUrl
              })
            }
          >
            <Plus className="h-4 w-4" />
            Select
          </button>
          <button 
             type="button" 
             className="bg-white/50 hover:bg-white/80 border border-white/60 text-primary-container rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-sm"
             aria-label={`View ${product.title}`} 
             onClick={() => onInspect(product)}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
