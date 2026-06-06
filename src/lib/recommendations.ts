import { clamp } from "@/lib/utils";
import type { ConversationState, GiftBundle, ProductSummary } from "@/lib/types";
import { makeBundles, sampleProducts } from "@/lib/sample-data";

export function inferStateFromText(input: string, previous: ConversationState): ConversationState {
  const text = input.toLowerCase();
  const next: ConversationState = {
    ...previous,
    preferences: [...previous.preferences],
    selectedProducts: [...previous.selectedProducts]
  };

  const budgetMatch = text.match(/(?:rs\.?|lkr|under|below|budget)\s*[, ]*(\d[\d,]*)/i) ?? text.match(/(\d[\d,]*)\s*(?:rs|lkr)/i);
  if (budgetMatch) next.budget = Number(budgetMatch[1].replace(/,/g, ""));

  const occasions = ["birthday", "anniversary", "wedding", "graduation", "valentine", "mother", "father", "corporate", "thank you"];
  const occasion = occasions.find((item) => text.includes(item));
  if (occasion) next.occasion = occasion === "mother" ? "Mother's Day or mom gift" : occasion;

  const relationships = ["girlfriend", "boyfriend", "mom", "mother", "dad", "father", "wife", "husband", "friend", "boss", "client", "teacher"];
  const relationship = relationships.find((item) => text.includes(item));
  if (relationship) next.relationship = relationship;

  if (text.includes("tomorrow")) next.urgency = "next-day";
  if (text.includes("today") || text.includes("same day") || text.includes("same-day")) next.urgency = "same-day";
  if (text.includes("colombo")) next.deliveryCity = "Colombo";
  if (text.includes("kandy")) next.deliveryCity = "Kandy";
  if (text.includes("galle")) next.deliveryCity = "Galle";

  for (const preference of ["flowers", "cake", "chocolate", "hamper", "fruit", "premium", "romantic"]) {
    if (text.includes(preference) && !next.preferences.includes(preference)) {
      next.preferences.push(preference);
    }
  }

  return next;
}

export function rankProducts(products: ProductSummary[], state: ConversationState) {
  return [...products]
    .map((product) => {
      let score = product.matchScore;
      if (state.budget && product.price <= state.budget) score += 7;
      if (state.budget && product.price > state.budget) score -= Math.min(18, Math.ceil((product.price - state.budget) / 1000));
      if (state.urgency === "same-day" && product.deliveryLabel.toLowerCase().includes("same")) score += 8;
      if (state.relationship?.includes("mom") && product.category.toLowerCase().includes("fruit")) score += 7;
      if (state.relationship?.includes("girlfriend") && product.category.toLowerCase().includes("flowers")) score += 8;
      if (state.preferences.some((preference) => product.title.toLowerCase().includes(preference) || product.category.toLowerCase().includes(preference))) score += 6;
      return { ...product, matchScore: clamp(score, 55, 99) };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

export function buildRecommendations(state: ConversationState, products = sampleProducts) {
  const ranked = rankProducts(products, state);
  const bundles: GiftBundle[] = makeBundles(ranked.length >= 3 ? ranked : products);

  return { products: ranked, bundles };
}

export function nextSuggestions(state: ConversationState) {
  if (!state.relationship) return ["It's for my mom", "It's for my girlfriend", "It's for a client"];
  if (!state.budget) return ["Under Rs. 7,000", "Around Rs. 10,000", "Premium is okay"];
  if (!state.deliveryCity) return ["Deliver to Colombo", "Deliver to Kandy", "Can it arrive tomorrow?"];
  return ["Show me the safest choice", "Build a bundle", "Check delivery"];
}
