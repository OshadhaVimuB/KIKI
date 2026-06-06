export type Role = "user" | "assistant";

export type ConversationState = {
  occasion?: string;
  relationship?: string;
  budget?: number;
  deliveryCity?: string;
  deliveryDate?: string;
  urgency?: "same-day" | "next-day" | "flexible";
  preferences: string[];
  selectedProducts: CartItem[];
  checkout?: CheckoutResult;
  order?: OrderTrackingResult;
};

export type ProductSummary = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  deliveryLabel: string;
  highlights: string[];
  category: string;
  matchScore: number;
  label: "Most Romantic" | "Best Value" | "Most Popular" | "Fastest Delivery";
};

export type ProductDetails = ProductSummary & {
  description: string;
  images: string[];
  availability: string;
  deliveryNotes: string;
};

export type DeliveryCity = {
  id: string;
  name: string;
  region?: string;
};

export type DeliveryCheckResult = {
  available: boolean;
  earliestDate?: string;
  city: string;
  message: string;
};

export type CartItem = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl: string;
};

export type GiftBundle = {
  id: string;
  title: string;
  description: string;
  products: ProductSummary[];
  totalPrice: number;
  occasionFit: number;
  deliveryReady: boolean;
};

export type CheckoutResult = {
  orderId: string;
  paymentUrl: string;
  status: "created" | "pending" | "failed";
  message: string;
};

export type OrderTrackingResult = {
  orderId: string;
  status: "created" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "unknown";
  eta?: string;
  message: string;
};

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  products?: ProductSummary[];
  bundles?: GiftBundle[];
};

export type ChatResponse = {
  message: ChatMessage;
  state: ConversationState;
  suggestions: string[];
};
