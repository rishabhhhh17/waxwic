'use client';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Contents = { id: string; quantity: number; item_price: number };

export function track(event: string, params?: Record<string, unknown>, eventID?: string) {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq !== 'function') return;
  if (eventID) {
    window.fbq('track', event, params ?? {}, { eventID });
  } else {
    window.fbq('track', event, params ?? {});
  }
}

export function trackViewContent(args: { content_id: string; value: number; name?: string }) {
  track('ViewContent', {
    content_type: 'product',
    content_ids: [args.content_id],
    content_name: args.name,
    value: args.value,
    currency: 'INR',
  });
}

export function trackAddToCart(args: { content_id: string; value: number; name?: string; quantity: number }) {
  track('AddToCart', {
    content_type: 'product',
    content_ids: [args.content_id],
    contents: [{ id: args.content_id, quantity: args.quantity, item_price: args.value / args.quantity }],
    content_name: args.name,
    value: args.value,
    currency: 'INR',
  });
}

export function trackInitiateCheckout(args: { value: number; contents: Contents[]; num_items: number }) {
  track('InitiateCheckout', {
    content_type: 'product',
    content_ids: args.contents.map((c) => c.id),
    contents: args.contents,
    value: args.value,
    currency: 'INR',
    num_items: args.num_items,
  });
}

export function trackPurchase(args: {
  event_id: string;
  value: number;
  contents: Contents[];
  num_items: number;
}) {
  track(
    'Purchase',
    {
      content_type: 'product',
      content_ids: args.contents.map((c) => c.id),
      contents: args.contents,
      value: args.value,
      currency: 'INR',
      num_items: args.num_items,
    },
    args.event_id,
  );
}
