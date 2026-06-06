import { NextResponse } from "next/server";
import { z } from "zod";

import { checkDelivery, createOrder, getProduct, listDeliveryCities, trackOrder } from "@/lib/kapruka";

const commerceSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("cities"), query: z.string().default("") }),
  z.object({ action: z.literal("product"), productId: z.string().min(1) }),
  z.object({ action: z.literal("delivery"), productId: z.string().min(1), city: z.string().min(2), date: z.string().optional() }),
  z.object({
    action: z.literal("checkout"),
    items: z
      .array(
        z.object({
          productId: z.string(),
          title: z.string(),
          quantity: z.number(),
          price: z.number(),
          imageUrl: z.string()
        })
      )
      .min(1),
    recipient: z.record(z.string())
  }),
  z.object({ action: z.literal("track"), orderId: z.string().min(1) })
]);

export async function POST(request: Request) {
  const parsed = commerceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid commerce request." }, { status: 400 });
  }

  if (parsed.data.action === "cities") {
    return NextResponse.json({ cities: await listDeliveryCities(parsed.data.query) });
  }

  if (parsed.data.action === "product") {
    return NextResponse.json({ product: await getProduct(parsed.data.productId) });
  }

  if (parsed.data.action === "delivery") {
    return NextResponse.json({
      delivery: await checkDelivery(parsed.data.productId, parsed.data.city, parsed.data.date)
    });
  }

  if (parsed.data.action === "checkout") {
    return NextResponse.json({
      checkout: await createOrder(parsed.data.items, parsed.data.recipient)
    });
  }

  return NextResponse.json({ order: await trackOrder(parsed.data.orderId) });
}
