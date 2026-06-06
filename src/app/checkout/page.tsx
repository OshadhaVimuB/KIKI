"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleDot } from "lucide-react";

import { useShopping } from "@/lib/shopping-context";
import { DeliveryChecker } from "@/components/delivery-checker";
import { RecipientForm } from "@/components/recipient-form";
import { CheckoutPanel } from "@/components/checkout-panel";
import { OrderTracker } from "@/components/order-tracker";
import { DynamicBackground } from "@/components/dynamic-background";

export default function CheckoutPage() {
  const { state, setState, recipient, setRecipient, removeItem } = useShopping();

  return (
    <div className="min-h-screen font-body-md text-on-surface antialiased flex flex-col items-center p-4 md:p-12 relative overflow-hidden">
      <DynamicBackground />
      
      {/* Progress Indicator / Header */}
      <div className="fixed top-0 left-0 w-full z-50 p-4 flex justify-center pointer-events-none">
        <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-4 pointer-events-auto relative shadow-sm">
          <Link href="/" className="absolute -left-32 glass-panel rounded-full px-4 py-2 flex items-center gap-2 hover:bg-white/60 transition-colors hidden md:flex text-primary-container">
             <ArrowLeft className="w-4 h-4" />
             <span className="font-label-md">Chat</span>
          </Link>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gold" />
            <span className="font-label-caps text-on-surface">CART</span>
          </div>
          <div className="w-8 h-[2px] bg-white/50"></div>
          <div className="flex items-center gap-2">
            <CircleDot className="w-5 h-5 text-primary-container" />
            <span className="font-label-caps text-primary-container">CHECKOUT</span>
          </div>
        </div>
      </div>
      
      <div className="w-full flex md:hidden justify-start z-50 relative mt-16 mb-4">
          <Link href="/" className="glass-panel rounded-full px-4 py-2 flex items-center gap-2 hover:bg-white/60 transition-colors text-primary-container">
             <ArrowLeft className="w-4 h-4" />
             <span className="font-label-md">Back to Chat</span>
          </Link>
      </div>

      <main className="w-full max-w-5xl glass-panel rounded-3xl p-6 md:p-10 flex flex-col gap-8 relative mt-4 md:mt-20 z-10 shadow-glass">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/40 pb-6 gap-4">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary-container">Complete Order</h1>
            <p className="font-body-md text-on-surface-variant mt-2">Almost there, let's finalize the details.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary Section */}
          <section className="flex flex-col gap-6 order-2 md:order-1">
             <h2 className="font-label-caps text-on-surface-variant px-1">ORDER SUMMARY</h2>
             <CheckoutPanel 
                items={state.selectedProducts}
                recipient={recipient}
                onRemove={removeItem}
                onCheckout={(checkout) => setState((current) => ({ ...current, checkout }))}
             />
             <OrderTracker checkout={state.checkout} />
          </section>

          {/* Delivery Form Section */}
          <section className="flex flex-col gap-6 order-1 md:order-2">
             <h2 className="font-label-caps text-on-surface-variant px-1">DELIVERY DETAILS</h2>
             <DeliveryChecker 
                 selectedItems={state.selectedProducts} 
                 onCity={(city) => setState((current) => ({ ...current, deliveryCity: city }))} 
             />
             <RecipientForm value={recipient} onChange={setRecipient} />
          </section>
        </div>
      </main>
    </div>
  );
}
