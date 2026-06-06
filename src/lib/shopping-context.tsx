"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { ConversationState, CartItem, CheckoutResult } from "@/lib/types";
import type { Recipient } from "@/components/recipient-form";

type ShoppingContextType = {
  state: ConversationState;
  setState: React.Dispatch<React.SetStateAction<ConversationState>>;
  recipient: Recipient;
  setRecipient: React.Dispatch<React.SetStateAction<Recipient>>;
  addItems: (items: CartItem[]) => void;
  removeItem: (productId: string) => void;
};

const initialState: ConversationState = {
  preferences: [],
  selectedProducts: []
};

const initialRecipient: Recipient = {
  name: "",
  phone: "",
  address: "",
  note: ""
};

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConversationState>(initialState);
  const [recipient, setRecipient] = useState<Recipient>(initialRecipient);

  function addItems(items: CartItem[]) {
    setState((current) => {
      const existing = new Set(current.selectedProducts.map((item) => item.productId));
      const nextItems = [...current.selectedProducts, ...items.filter((item) => !existing.has(item.productId))];
      return { ...current, selectedProducts: nextItems };
    });
  }

  function removeItem(productId: string) {
    setState((current) => ({
      ...current,
      selectedProducts: current.selectedProducts.filter((item) => item.productId !== productId)
    }));
  }

  return (
    <ShoppingContext.Provider value={{ state, setState, recipient, setRecipient, addItems, removeItem }}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (context === undefined) {
    throw new Error("useShopping must be used within a ShoppingProvider");
  }
  return context;
}
