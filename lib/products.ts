export type Variant = {
  id: string;
  label: string;
  weight_g: number;
  price_paise: number;
  stock_count: number;
  sku: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'woody' | 'floral' | 'fresh' | 'oriental' | 'smoky';
  notes: { top: string[]; heart: string[]; base: string[] };
  base_price: number;
  compare_at_price?: number;
  images: { src: string; alt: string }[];
  ingredients: string[];
  highlights: string[];
  longevity_hours: number;
  variants: Variant[];
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  rating_count: number;
};

export const PRODUCTS: Product[] = [
  {
    id: 'kashmir',
    slug: 'kashmir',
    name: 'Kashmir',
    tagline: 'Saffron, oud, & rose otto.',
    description:
      'A deep, slow-burning warmth pulled from a Himalayan winter. Saffron threads steeped over rose otto, finished with smoked oud. Wears close to the skin and lasts the full day.',
    category: 'oriental',
    notes: {
      top: ['Saffron', 'Pink Pepper'],
      heart: ['Rose Otto', 'Cardamom'],
      base: ['Smoked Oud', 'Vetiver', 'Amber'],
    },
    base_price: 690,
    compare_at_price: 850,
    images: [
      { src: '/images/kashmir.jpg', alt: 'Waxwic Kashmir solid perfume tin on linen' },
      { src: '/images/lifestyle-2.jpg', alt: 'Waxwic perfume tin held in hand' },
    ],
    ingredients: [
      'Cosmetic-grade beeswax',
      'Organic jojoba oil',
      'Fractionated coconut oil',
      'Vitamin E',
      'IFRA-compliant fragrance',
    ],
    highlights: ['8–10 hour wear', 'Pocket-sized tin', 'Travel-safe — TSA approved', 'Cruelty free'],
    longevity_hours: 9,
    variants: [
      { id: 'kashmir-8g', label: '8g tin', weight_g: 8, price_paise: 69000, stock_count: 60, sku: 'WW-KSH-08' },
      { id: 'kashmir-15g', label: '15g tin', weight_g: 15, price_paise: 119000, stock_count: 40, sku: 'WW-KSH-15' },
    ],
    is_active: true,
    is_featured: true,
    rating: 4.8,
    rating_count: 184,
  },
  {
    id: 'coastline',
    slug: 'coastline',
    name: 'Coastline',
    tagline: 'Sea salt, neroli, & vetiver.',
    description:
      'A clean, bright fragrance built around the smell of a stone wall facing the sea. Salt-tinged neroli over green vetiver — the kind of scent that reads composed at noon and softer by dusk.',
    category: 'fresh',
    notes: {
      top: ['Sea Salt', 'Bergamot'],
      heart: ['Neroli', 'White Tea'],
      base: ['Vetiver', 'Driftwood', 'Musk'],
    },
    base_price: 590,
    compare_at_price: 750,
    images: [
      { src: '/images/coastline.jpg', alt: 'Waxwic Coastline tin on stone surface' },
      { src: '/images/lifestyle-1.jpg', alt: 'Waxwic perfume tins arranged on a tray' },
    ],
    ingredients: [
      'Cosmetic-grade beeswax',
      'Organic jojoba oil',
      'Fractionated coconut oil',
      'Vitamin E',
      'IFRA-compliant fragrance',
    ],
    highlights: ['6–8 hour wear', 'Unisex', 'Handpoured in small batches', 'No alcohol — kind on skin'],
    longevity_hours: 7,
    variants: [
      { id: 'coastline-8g', label: '8g tin', weight_g: 8, price_paise: 59000, stock_count: 80, sku: 'WW-CST-08' },
      { id: 'coastline-15g', label: '15g tin', weight_g: 15, price_paise: 99000, stock_count: 50, sku: 'WW-CST-15' },
    ],
    is_active: true,
    is_featured: true,
    rating: 4.7,
    rating_count: 142,
  },
  {
    id: 'library',
    slug: 'library',
    name: 'Library',
    tagline: 'Sandalwood, leather, & vanilla.',
    description:
      'Old paper, polished wood, the after-smell of a fountain pen. Mysore sandalwood over soft leather, sweetened with a thread of bourbon vanilla. A quiet scent that rewards close company.',
    category: 'woody',
    notes: {
      top: ['Black Tea', 'Tonka'],
      heart: ['Sandalwood', 'Iris'],
      base: ['Soft Leather', 'Bourbon Vanilla', 'Cedar'],
    },
    base_price: 720,
    compare_at_price: 890,
    images: [
      { src: '/images/library.jpg', alt: 'Waxwic Library tin on a wooden desk' },
      { src: '/images/tin.jpg', alt: 'Waxwic tin close-up' },
    ],
    ingredients: [
      'Cosmetic-grade beeswax',
      'Organic jojoba oil',
      'Mysore sandalwood absolute',
      'Vitamin E',
      'IFRA-compliant fragrance',
    ],
    highlights: ['10–12 hour wear', 'Vegan beeswax alternative on request', 'Leak-proof brass tin', 'Made in India'],
    longevity_hours: 11,
    variants: [
      { id: 'library-8g', label: '8g tin', weight_g: 8, price_paise: 72000, stock_count: 45, sku: 'WW-LIB-08' },
      { id: 'library-15g', label: '15g tin', weight_g: 15, price_paise: 124000, stock_count: 30, sku: 'WW-LIB-15' },
    ],
    is_active: true,
    is_featured: true,
    rating: 4.9,
    rating_count: 211,
  },
  {
    id: 'ember',
    slug: 'ember',
    name: 'Ember',
    tagline: 'Incense, smoke, & dark amber.',
    description:
      'Dry incense smoke caught on a wool jacket. A slow base of dark amber and labdanum, with just enough black pepper at the top to keep it from going sweet. Built for the cold months.',
    category: 'smoky',
    notes: {
      top: ['Black Pepper', 'Cinnamon Bark'],
      heart: ['Frankincense', 'Myrrh'],
      base: ['Dark Amber', 'Labdanum', 'Birch Tar'],
    },
    base_price: 750,
    images: [
      { src: '/images/ember.jpg', alt: 'Waxwic Ember tin near a candle flame' },
      { src: '/images/lifestyle-2.jpg', alt: 'Waxwic perfume tin in winter setting' },
    ],
    ingredients: [
      'Cosmetic-grade beeswax',
      'Organic jojoba oil',
      'Frankincense resin',
      'Vitamin E',
      'IFRA-compliant fragrance',
    ],
    highlights: ['10–12 hour wear', 'Cold-weather formula', 'Smoke-forward — sample first', 'Refillable tin'],
    longevity_hours: 11,
    variants: [
      { id: 'ember-8g', label: '8g tin', weight_g: 8, price_paise: 75000, stock_count: 35, sku: 'WW-EMB-08' },
      { id: 'ember-15g', label: '15g tin', weight_g: 15, price_paise: 129000, stock_count: 22, sku: 'WW-EMB-15' },
    ],
    is_active: true,
    is_featured: false,
    rating: 4.7,
    rating_count: 98,
  },
  {
    id: 'wildflower',
    slug: 'wildflower',
    name: 'Wildflower',
    tagline: 'Jasmine, mimosa, & green stem.',
    description:
      'A meadow at first light. Indian jasmine sambac and mimosa absolute over green crushed stems and a quiet musk. Reads bright on warm skin and softens as the day goes on.',
    category: 'floral',
    notes: {
      top: ['Bergamot', 'Crushed Green Leaves'],
      heart: ['Jasmine Sambac', 'Mimosa'],
      base: ['White Musk', 'Soft Hay'],
    },
    base_price: 620,
    compare_at_price: 780,
    images: [
      { src: '/images/wildflower.jpg', alt: 'Waxwic Wildflower tin among dried flowers' },
      { src: '/images/lifestyle-1.jpg', alt: 'Waxwic perfume tins styled on a tray' },
    ],
    ingredients: [
      'Cosmetic-grade beeswax',
      'Organic jojoba oil',
      'Jasmine sambac absolute',
      'Vitamin E',
      'IFRA-compliant fragrance',
    ],
    highlights: ['7–9 hour wear', 'Soft sillage — close to skin', 'Spring/summer favourite', 'Cruelty free'],
    longevity_hours: 8,
    variants: [
      { id: 'wildflower-8g', label: '8g tin', weight_g: 8, price_paise: 62000, stock_count: 70, sku: 'WW-WLD-08' },
      { id: 'wildflower-15g', label: '15g tin', weight_g: 15, price_paise: 105000, stock_count: 40, sku: 'WW-WLD-15' },
    ],
    is_active: true,
    is_featured: true,
    rating: 4.6,
    rating_count: 127,
  },
  {
    id: 'monsoon',
    slug: 'monsoon',
    name: 'Monsoon',
    tagline: 'Wet earth, vetiver, & green cardamom.',
    description:
      'The first rain on dry soil — petrichor, in plain English. Built around Haitian vetiver and green cardamom, with a soft top of rain-washed bamboo. The scent of relief.',
    category: 'fresh',
    notes: {
      top: ['Bamboo', 'Wet Stone'],
      heart: ['Green Cardamom', 'Galbanum'],
      base: ['Haitian Vetiver', 'Wet Earth Accord', 'Soft Moss'],
    },
    base_price: 640,
    images: [
      { src: '/images/monsoon.jpg', alt: 'Waxwic Monsoon tin on damp moss' },
      { src: '/images/coastline.jpg', alt: 'Waxwic perfume tin in greenery' },
    ],
    ingredients: [
      'Cosmetic-grade beeswax',
      'Organic jojoba oil',
      'Haitian vetiver',
      'Vitamin E',
      'IFRA-compliant fragrance',
    ],
    highlights: ['7–9 hour wear', 'Earthy, not sweet', 'Made in small monsoon-season batches', 'Refillable tin'],
    longevity_hours: 8,
    variants: [
      { id: 'monsoon-8g', label: '8g tin', weight_g: 8, price_paise: 64000, stock_count: 55, sku: 'WW-MNS-08' },
      { id: 'monsoon-15g', label: '15g tin', weight_g: 15, price_paise: 109000, stock_count: 32, sku: 'WW-MNS-15' },
    ],
    is_active: true,
    is_featured: false,
    rating: 4.7,
    rating_count: 86,
  },
];

export function getActiveProducts(): Product[] {
  return PRODUCTS.filter((p) => p.is_active);
}

export function getFeaturedProducts(n = 4): Product[] {
  return PRODUCTS.filter((p) => p.is_active && p.is_featured).slice(0, n);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug && p.is_active);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id && p.is_active);
}

export function getRelatedProducts(slug: string, n = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return getActiveProducts().slice(0, n);
  return getActiveProducts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => (a.category === current.category ? -1 : 1) - (b.category === current.category ? -1 : 1))
    .slice(0, n);
}

export function getMinVariantPaise(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price_paise));
}

export function findVariant(productId: string, variantId: string) {
  const p = getProductById(productId);
  if (!p) return undefined;
  return p.variants.find((v) => v.id === variantId);
}
