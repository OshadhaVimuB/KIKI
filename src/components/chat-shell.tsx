"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Send, ShoppingBag, UserRound } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { GiftBundleCard } from "@/components/gift-bundle-card";
import { KikiTypingIndicator } from "@/components/kiki-typing-indicator";
import { Mascot } from "@/components/mascot";
import { MessageBubble } from "@/components/message-bubble";
import { ProductCarousel } from "@/components/product-carousel";
import { ProductDetailsPanel } from "@/components/product-details-panel";
import { PromptSuggestions } from "@/components/prompt-suggestions";
import { DynamicBackground } from "@/components/dynamic-background";
import { useShopping } from "@/lib/shopping-context";
import type { ChatMessage, ChatResponse, ProductSummary } from "@/lib/types";

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "I've noticed some great trends in tech and home goods this week. Are we looking for something specific or just browsing ideas?"
};

const starterSuggestions = ["Birthday Gift", "Anniversary", "Treat Myself"];

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [suggestions, setSuggestions] = useState(starterSuggestions);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | undefined>();
  const [showSplash, setShowSplash] = useState(true);
  
  const { state, setState, addItems } = useShopping();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItemsCount = state.selectedProducts.length;

  useGSAP(() => {
    if (!showSplash && containerRef.current) {
      gsap.from(".message-appear", {
        y: 20,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.5)"
      });
    }
  }, { dependencies: [showSplash, messages.length], scope: containerRef });

  useEffect(() => {
    if (!splashRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".kiki-splash-mark", { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.75, ease: "back.out(1.8)" });
      gsap.to(".kiki-splash-text", { opacity: 1, y: 0, delay: 0.2, duration: 0.55, ease: "power2.out" });
    }, splashRef);
    const timer = window.setTimeout(() => setShowSplash(false), 1300);
    return () => {
      ctx.revert();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(value: string) {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, state })
      });

      if (!response.ok) throw new Error("Chat request failed");

      const payload = (await response.json()) as ChatResponse;
      setState((current) => ({ ...payload.state, selectedProducts: current.selectedProducts, checkout: current.checkout }));
      setSuggestions(payload.suggestions);
      setMessages((current) => [...current, payload.message]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I hit a small snag reaching the shopping service. Your choices are still here, and we can try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col font-body-md text-body-md" ref={containerRef}>
      <DynamicBackground />
      
      <AnimatePresence>
        {showSplash && (
          <motion.div
            ref={splashRef}
            className="fixed inset-0 z-50 grid place-items-center bg-surface-bright"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-label="KIKI loading"
          >
            <div className="grid place-items-center gap-4">
              <div className="kiki-splash-mark opacity-0">
                <Mascot />
              </div>
              <p className="kiki-splash-text translate-y-3 text-lg font-black opacity-0">KIKI is getting the gifts ready</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-12 py-3 bg-white/20 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 w-full max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-[0_4px_10px_rgba(64,41,112,0.1)] bg-white/80 border-2 border-white/60">
              <Mascot />
            </div>
            <div>
              <h1 className="font-headline-sm text-primary-container leading-none">KIKI</h1>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">AI Shopping Concierge</p>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            {selectedItemsCount > 0 && (
              <Link href="/checkout" className="flex items-center gap-2 bg-primary-container text-white px-4 py-2 rounded-full shadow-md hover:bg-primary transition-colors liquid-btn">
                 <ShoppingBag className="w-4 h-4" />
                 <span className="font-label-md">{selectedItemsCount} Items</span>
              </Link>
            )}
            <button aria-label="User avatar" className="w-10 h-10 rounded-full bg-surface-container-highest/50 backdrop-blur-md flex items-center justify-center text-primary hover:bg-surface-variant transition-colors border border-white/40 shadow-sm">
              <UserRound className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col h-full w-full pt-[70px] relative z-10">
        
        {/* Chat Container */}
        <section className="flex-1 flex flex-col min-w-0 h-full relative">
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto w-full relative">
            <div className="flex flex-col gap-6 p-4 md:p-8 w-full max-w-[1200px] mx-auto pb-[180px]">
              {messages.map((message) => (
                <div key={message.id} className="message-appear">
                  <MessageBubble message={message} />
                  {message.products && message.products.length > 0 && (
                    <div className="mt-4">
                      <ProductCarousel products={message.products} onInspect={setSelectedProduct} onSelect={(item) => addItems([item])} />
                    </div>
                  )}
                  {message.bundles && message.bundles.length > 0 && (
                    <div className="mt-4 flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
                      {message.bundles.map((bundle) => (
                        <GiftBundleCard key={bundle.id} bundle={bundle} onSelect={addItems} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && <div className="message-appear"><KikiTypingIndicator /></div>}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent pt-10 pb-4 md:pb-8 px-4 pointer-events-none z-20">
            <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center pointer-events-auto">
              <PromptSuggestions suggestions={suggestions} onSelect={(value) => void sendMessage(value)} />
              <form onSubmit={submit} className="relative w-full flex items-center bg-white/70 backdrop-blur-2xl border border-white/80 rounded-full shadow-[0_8px_32px_rgba(31,38,135,0.1)] focus-within:ring-2 focus-within:ring-primary/50 overflow-hidden mt-3">
                <input
                  id="kiki-message"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask KIKI..."
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body-md text-body-md placeholder-outline py-4 px-6 outline-none"
                />
                <button type="submit" disabled={loading || !input.trim()} aria-label="Send Message" className="pr-4 pl-2 text-primary hover:text-primary-container transition-colors disabled:opacity-50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <Send className="w-5 h-5" />
                  </div>
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      <ProductDetailsPanel product={selectedProduct} onClose={() => setSelectedProduct(undefined)} />
    </div>
  );
}
