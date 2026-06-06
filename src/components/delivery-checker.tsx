"use client";

import { Loader2, MapPin, Truck } from "lucide-react";
import { useEffect, useState } from "react";

import type { CartItem, DeliveryCheckResult, DeliveryCity } from "@/lib/types";

export function DeliveryChecker({ selectedItems, onCity }: { selectedItems: CartItem[]; onCity: (city: string) => void }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<DeliveryCity[]>([]);
  const [result, setResult] = useState<DeliveryCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetch("/api/commerce", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "cities", query })
      })
        .then((response) => response.json())
        .then((payload) => setCities(payload.cities ?? []))
        .catch(() => setCities([]));
    }, 200);

    return () => window.clearTimeout(timer);
  }, [query]);

  async function check(city = query) {
    if (!selectedItems[0] || !city.trim()) return;
    setLoading(true);
    setResult(null);
    onCity(city.trim());
    try {
      const response = await fetch("/api/commerce", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "delivery", productId: selectedItems[0].productId, city: city.trim() })
      });
      const payload = await response.json();
      setResult(payload.delivery);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl liquid-glass p-5 shrink-0">
      <div className="mb-4 flex items-center gap-2">
        <Truck className="h-6 w-6 text-primary-container" />
        <h2 className="font-headline-sm text-primary-container">Delivery check</h2>
      </div>
      <div className="flex gap-3">
        <label className="sr-only" htmlFor="delivery-city">
          Delivery city
        </label>
        <input
          id="delivery-city"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="City, e.g. Colombo"
          className="min-w-0 flex-1 rounded-xl border border-white/70 bg-white/40 backdrop-blur-sm px-4 py-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 shadow-inner"
        />
        <button 
           type="button" 
           onClick={() => check()} 
           disabled={!selectedItems.length || loading}
           className="bg-white/50 hover:bg-white/80 border border-white/60 text-primary-container font-label-md py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          Check
        </button>
      </div>
      {cities.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {cities.slice(0, 4).map((city) => (
            <button 
               key={city.id} 
               type="button" 
               className="bg-white/30 hover:bg-white/60 border border-white/40 text-on-surface-variant font-label-md py-1.5 px-3 rounded-full transition-colors whitespace-nowrap shadow-sm"
               onClick={() => check(city.name)}
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
      {result && (
        <p className={result.available ? "mt-4 text-sm font-semibold text-primary-container bg-primary-fixed/50 p-3 rounded-xl border border-primary-fixed-dim/30" : "mt-4 text-sm font-semibold text-error bg-error-container/50 p-3 rounded-xl border border-error/20"}>{result.message}</p>
      )}
    </section>
  );
}
