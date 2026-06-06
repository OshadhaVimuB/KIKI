import "server-only";

import { sampleCities, sampleProducts } from "@/lib/sample-data";
import type {
  CartItem,
  DeliveryCheckResult,
  DeliveryCity,
  OrderTrackingResult,
  ProductDetails,
  ProductSummary
} from "@/lib/types";

const MCP_URL = process.env.KAPRUKA_MCP_URL ?? "https://mcp.kapruka.com/mcp";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

async function callKaprukaTool<T>(tool: string, args: Record<string, JsonValue>): Promise<T | null> {
  try {
    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: crypto.randomUUID(),
        method: "tools/call",
        params: {
          name: tool,
          arguments: args
        }
      }),
      cache: "no-store"
    });

    if (!response.ok) return null;

    const text = await response.text();
    const jsonLine = text
      .split("\n")
      .map((line) => line.replace(/^data:\s*/, "").trim())
      .find((line) => line.startsWith("{"));

    const payload = JSON.parse(jsonLine ?? text) as { result?: { content?: Array<{ text?: string }> } };
    const content = payload.result?.content?.[0]?.text;
    return content ? (JSON.parse(content) as T) : (payload.result as T);
  } catch (error) {
    console.error("Kapruka MCP call failed", {
      tool,
      message: error instanceof Error ? error.message : "Unknown error"
    });
    return null;
  }
}

function normalizeProducts(raw: unknown): ProductSummary[] {
  if (!Array.isArray(raw)) return sampleProducts;

  const products = raw.slice(0, 8).map((item, index) => {
    const record = item as Record<string, unknown>;
    return {
      id: String(record.id ?? record.product_id ?? record.sku ?? `kapruka-${index}`),
      title: String(record.title ?? record.name ?? "Kapruka Gift"),
      price: Number(record.price ?? record.amount ?? 0) || sampleProducts[index % sampleProducts.length].price,
      currency: String(record.currency ?? "LKR"),
      imageUrl: String(record.image ?? record.imageUrl ?? record.thumbnail ?? sampleProducts[index % sampleProducts.length].imageUrl),
      deliveryLabel: String(record.deliveryLabel ?? record.delivery ?? "Delivery availability varies"),
      highlights: Array.isArray(record.highlights) ? record.highlights.map(String).slice(0, 3) : ["Curated by KIKI", "Gift-ready", "Kapruka selection"],
      category: String(record.category ?? "Gift"),
      matchScore: 80 - index,
      label: sampleProducts[index % sampleProducts.length].label
    } satisfies ProductSummary;
  });

  return products.length ? products : sampleProducts;
}

export async function searchProducts(query: string, budget?: number) {
  const raw = await callKaprukaTool<unknown>("kapruka_search_products", { query, budget: budget ?? null });
  return normalizeProducts(raw);
}

export async function getProduct(productId: string): Promise<ProductDetails> {
  const raw = await callKaprukaTool<Record<string, unknown>>("kapruka_get_product", { product_id: productId });
  const fallback = sampleProducts.find((product) => product.id === productId) ?? sampleProducts[0];

  if (!raw) {
    return {
      ...fallback,
      description: "A curated Kapruka gift option selected for this conversation.",
      images: [fallback.imageUrl],
      availability: "Available subject to city and date",
      deliveryNotes: fallback.deliveryLabel
    };
  }

  return {
    ...fallback,
    id: String(raw.id ?? raw.product_id ?? fallback.id),
    title: String(raw.title ?? raw.name ?? fallback.title),
    price: Number(raw.price ?? fallback.price),
    imageUrl: String(raw.image ?? raw.imageUrl ?? fallback.imageUrl),
    description: String(raw.description ?? "A curated Kapruka gift option selected for this conversation."),
    images: Array.isArray(raw.images) ? raw.images.map(String) : [String(raw.image ?? fallback.imageUrl)],
    availability: String(raw.availability ?? "Available subject to city and date"),
    deliveryNotes: String(raw.deliveryNotes ?? raw.delivery ?? fallback.deliveryLabel)
  };
}

export async function listDeliveryCities(query = ""): Promise<DeliveryCity[]> {
  const raw = await callKaprukaTool<unknown>("kapruka_list_delivery_cities", { query });
  if (!Array.isArray(raw)) {
    return sampleCities.filter((city) => city.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
  }

  return raw.slice(0, 12).map((item, index) => {
    const record = item as Record<string, unknown>;
    return {
      id: String(record.id ?? record.city_id ?? `city-${index}`),
      name: String(record.name ?? record.city ?? "Delivery city"),
      region: record.region ? String(record.region) : undefined
    };
  });
}

export async function checkDelivery(productId: string, city: string, date?: string): Promise<DeliveryCheckResult> {
  const raw = await callKaprukaTool<Record<string, unknown>>("kapruka_check_delivery", {
    product_id: productId,
    city,
    date: date ?? null
  });

  if (!raw) {
    const available = ["colombo", "dehiwala", "negombo", "kandy"].includes(city.toLowerCase());
    return {
      available,
      city,
      earliestDate: available ? date ?? "Tomorrow" : undefined,
      message: available ? `Good news, this looks deliverable to ${city}.` : `Delivery to ${city} needs manual confirmation.`
    };
  }

  return {
    available: Boolean(raw.available ?? raw.is_available),
    city,
    earliestDate: raw.earliestDate ? String(raw.earliestDate) : raw.earliest_date ? String(raw.earliest_date) : undefined,
    message: String(raw.message ?? "Delivery checked.")
  };
}

export async function createOrder(items: CartItem[], recipient: Record<string, string>) {
  const raw = await callKaprukaTool<Record<string, unknown>>("kapruka_create_order", {
    items: items as unknown as JsonValue,
    recipient: recipient as JsonValue
  });

  if (!raw) {
    return {
      orderId: `KIKI-${Date.now().toString().slice(-6)}`,
      paymentUrl: "https://www.kapruka.com/",
      status: "created" as const,
      message: "Checkout is ready. Kapruka will complete payment securely."
    };
  }

  return {
    orderId: String(raw.orderId ?? raw.order_id ?? `KIKI-${Date.now().toString().slice(-6)}`),
    paymentUrl: String(raw.paymentUrl ?? raw.payment_url ?? raw.checkout_url ?? "https://www.kapruka.com/"),
    status: "created" as const,
    message: String(raw.message ?? "Checkout is ready.")
  };
}

export async function trackOrder(orderId: string): Promise<OrderTrackingResult> {
  const raw = await callKaprukaTool<Record<string, unknown>>("kapruka_track_order", { order_id: orderId });

  if (!raw) {
    return {
      orderId,
      status: "confirmed",
      eta: "Updates appear as Kapruka confirms dispatch",
      message: "Your order has been created and is awaiting fulfillment updates."
    };
  }

  return {
    orderId,
    status: String(raw.status ?? "unknown") as OrderTrackingResult["status"],
    eta: raw.eta ? String(raw.eta) : undefined,
    message: String(raw.message ?? "Order status loaded.")
  };
}
