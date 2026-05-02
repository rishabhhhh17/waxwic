import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

function sha256(value: string) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export type CapiPurchasePayload = {
  event_id: string;
  event_time?: number;
  email?: string;
  phone?: string;
  fbp?: string;
  fbc?: string;
  client_user_agent?: string;
  client_ip_address?: string;
  value: number;
  currency: string;
  content_ids: string[];
  contents: { id: string; quantity: number; item_price: number }[];
  num_items: number;
  event_source_url?: string;
};

export async function fireCapiPurchase(p: CapiPurchasePayload) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return { skipped: true as const, reason: 'pixel_or_token_missing' };
  }

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: 'Purchase',
        event_time: p.event_time ?? Math.floor(Date.now() / 1000),
        event_id: p.event_id,
        action_source: 'website',
        event_source_url: p.event_source_url,
        user_data: {
          em: p.email ? [sha256(p.email)] : undefined,
          ph: p.phone ? [sha256(p.phone.replace(/\D/g, ''))] : undefined,
          fbp: p.fbp,
          fbc: p.fbc,
          client_ip_address: p.client_ip_address,
          client_user_agent: p.client_user_agent,
        },
        custom_data: {
          currency: p.currency,
          value: p.value,
          content_type: 'product',
          content_ids: p.content_ids,
          contents: p.contents,
          num_items: p.num_items,
        },
      },
    ],
  };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, body: text };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
