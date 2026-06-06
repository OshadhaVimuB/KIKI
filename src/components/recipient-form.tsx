"use client";

import { UserRound } from "lucide-react";

export type Recipient = {
  name: string;
  phone: string;
  address: string;
  note: string;
};

export function RecipientForm({ value, onChange }: { value: Recipient; onChange: (recipient: Recipient) => void }) {
  function update(key: keyof Recipient, next: string) {
    onChange({ ...value, [key]: next });
  }

  return (
    <section className="rounded-2xl liquid-glass p-5 shrink-0">
      <div className="mb-4 flex items-center gap-2">
        <UserRound className="h-6 w-6 text-primary-container" />
        <h2 className="font-headline-sm text-primary-container">Recipient</h2>
      </div>
      <div className="grid gap-3">
        <input aria-label="Recipient name" value={value.name} onChange={(event) => update("name", event.target.value)} placeholder="Recipient name" className="w-full rounded-xl border border-white/70 bg-white/40 backdrop-blur-sm px-4 py-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 shadow-inner" />
        <input aria-label="Recipient phone" value={value.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Phone number" className="w-full rounded-xl border border-white/70 bg-white/40 backdrop-blur-sm px-4 py-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 shadow-inner" />
        <textarea aria-label="Recipient address" value={value.address} onChange={(event) => update("address", event.target.value)} placeholder="Delivery address" className="min-h-24 w-full rounded-xl border border-white/70 bg-white/40 backdrop-blur-sm px-4 py-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 shadow-inner" />
        <input aria-label="Gift note" value={value.note} onChange={(event) => update("note", event.target.value)} placeholder="Gift note" className="w-full rounded-xl border border-white/70 bg-white/40 backdrop-blur-sm px-4 py-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 shadow-inner" />
      </div>
    </section>
  );
}
