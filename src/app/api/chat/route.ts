import { NextResponse } from "next/server";
import { z } from "zod";

import { askGroq } from "@/lib/groq";
import { searchProducts } from "@/lib/kapruka";
import { buildRecommendations, inferStateFromText, nextSuggestions } from "@/lib/recommendations";
import type { ChatResponse, ConversationState } from "@/lib/types";

const chatSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  state: z
    .object({
      occasion: z.string().optional(),
      relationship: z.string().optional(),
      budget: z.number().optional(),
      deliveryCity: z.string().optional(),
      deliveryDate: z.string().optional(),
      urgency: z.enum(["same-day", "next-day", "flexible"]).optional(),
      preferences: z.array(z.string()).default([]),
      selectedProducts: z.array(z.any()).default([]),
      checkout: z.any().optional(),
      order: z.any().optional()
    })
    .default({ preferences: [], selectedProducts: [] })
});

const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  bucket.count += 1;
  return bucket.count <= 30;
}

function fallbackReply(input: string, state: ConversationState, hasRecommendations: boolean) {
  const lower = input.toLowerCase();
  if (lower.includes("surprise")) {
    return "I love a surprise mission. I pulled together a couple of gift bundles that feel complete without making you overthink it.";
  }

  if (!state.relationship) {
    return "Tell me who this is for and I’ll narrow it down properly. The best gifts start with the person, not the catalog.";
  }

  if (!state.budget) {
    return `Nice, a gift for ${state.relationship}. What budget should I stay inside?`;
  }

  if (!state.deliveryCity) {
    return "Great. I have a few strong picks now. Which city should I check delivery for?";
  }

  if (hasRecommendations) {
    return "Based on your budget, recipient, and delivery needs, these are the options I’d focus on first.";
  }

  return "I’m with you. Give me one more detail and I’ll turn this into a focused shortlist.";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please pause for a moment." }, { status: 429 });
  }

  const parsed = chatSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please send a valid message." }, { status: 400 });
  }

  const state = inferStateFromText(parsed.data.message, parsed.data.state as ConversationState);

  const systemPrompt = `You are KIKI, Kapruka's warm, confident AI shopping concierge. Be concise, helpful, lightly playful, and recommendation-oriented. Do not mention implementation details.
If the user asks a question that is out of scope or unrelated to shopping or gifts, politely pivot the conversation back to Kapruka's store and recommend searching for trending gifts or a specific category. Do not answer general knowledge questions.`;

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Conversation state: ${JSON.stringify(state)}\nLatest user message: ${parsed.data.message}` }
  ];

  const tools = [
    {
      type: "function",
      function: {
        name: "searchProducts",
        description: "Search the Kapruka store for products to recommend based on the user's intent.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query, e.g. 'chocolate cake' or 'flowers for mom'" },
            budget: { type: "number", description: "Optional budget in LKR" }
          },
          required: ["query"]
        }
      }
    }
  ];

  let aiMessage = await askGroq(messages, tools);
  let products: any[] = [];
  let bundles: any[] = [];

  if (aiMessage?.tool_calls?.length) {
    const call = aiMessage.tool_calls[0];
    if (call.function.name === "searchProducts") {
      try {
        const args = JSON.parse(call.function.arguments);
        const searchedProducts = await searchProducts(args.query, args.budget ?? state.budget);
        
        const recommended = buildRecommendations(state, searchedProducts);
        products = recommended.products;
        bundles = recommended.bundles;

        messages.push(aiMessage);
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          name: "searchProducts",
          content: JSON.stringify(products.slice(0, 4).map((p: any) => ({ title: p.title, price: p.price, category: p.category })))
        });

        // Get final conversational text
        aiMessage = await askGroq(messages);
      } catch (e) {
        console.error("Tool execution failed", e);
      }
    }
  }

  const responseText = aiMessage?.content?.trim() ?? fallbackReply(parsed.data.message, state, products.length > 0);

  const response: ChatResponse = {
    message: {
      id: crypto.randomUUID(),
      role: "assistant",
      content: responseText,
      products,
      bundles: parsed.data.message.toLowerCase().includes("surprise") || parsed.data.message.toLowerCase().includes("bundle") ? bundles : []
    },
    state,
    suggestions: nextSuggestions(state)
  };

  return NextResponse.json(response);
}
