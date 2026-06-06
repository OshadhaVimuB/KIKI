import type { DeliveryCity, GiftBundle, ProductSummary } from "@/lib/types";

export const sampleCities: DeliveryCity[] = [
  { id: "colombo", name: "Colombo", region: "Western Province" },
  { id: "dehiwala", name: "Dehiwala", region: "Western Province" },
  { id: "kandy", name: "Kandy", region: "Central Province" },
  { id: "galle", name: "Galle", region: "Southern Province" },
  { id: "negombo", name: "Negombo", region: "Western Province" },
  { id: "jaffna", name: "Jaffna", region: "Northern Province" }
];

export const sampleProducts: ProductSummary[] = [
  {
    id: "kiki-rose-cake",
    title: "Rose Garden Cake and Fresh Flowers",
    price: 9450,
    currency: "LKR",
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80",
    deliveryLabel: "Tomorrow in Colombo",
    highlights: ["Celebration-ready", "Includes fresh roses", "Gift message available"],
    category: "Cake + Flowers",
    matchScore: 94,
    label: "Most Romantic"
  },
  {
    id: "kiki-choco-bloom",
    title: "Chocolate Bloom Gift Hamper",
    price: 6850,
    currency: "LKR",
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
    deliveryLabel: "Same-day eligible",
    highlights: ["Premium chocolates", "Compact and elegant", "Great for office delivery"],
    category: "Hamper",
    matchScore: 89,
    label: "Best Value"
  },
  {
    id: "kiki-orchid-box",
    title: "Orchid Luxe Keepsake Box",
    price: 11800,
    currency: "LKR",
    imageUrl: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=80",
    deliveryLabel: "2-day delivery",
    highlights: ["Long-lasting flowers", "Premium presentation", "Memorable keepsake"],
    category: "Flowers",
    matchScore: 86,
    label: "Most Popular"
  },
  {
    id: "kiki-fruit-grace",
    title: "Fruit Basket with Greeting Card",
    price: 5200,
    currency: "LKR",
    imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80",
    deliveryLabel: "Fastest route today",
    highlights: ["Thoughtful and practical", "Healthy option", "Ideal for parents"],
    category: "Fruit Basket",
    matchScore: 83,
    label: "Fastest Delivery"
  }
];

export function makeBundles(products = sampleProducts): GiftBundle[] {
  const [romantic, value, popular, fast] = products;

  return [
    {
      id: "romantic-evening",
      title: "Romantic Evening Bundle",
      description: "Cake, flowers, and a sweet note for a gift that feels complete.",
      products: [romantic, value].filter(Boolean),
      totalPrice: [romantic, value].filter(Boolean).reduce((sum, product) => sum + product.price, 0),
      occasionFit: 96,
      deliveryReady: true
    },
    {
      id: "family-celebration",
      title: "Family Celebration Bundle",
      description: "A warm, shareable combination for birthdays and family gatherings.",
      products: [fast, popular].filter(Boolean),
      totalPrice: [fast, popular].filter(Boolean).reduce((sum, product) => sum + product.price, 0),
      occasionFit: 90,
      deliveryReady: true
    }
  ];
}
