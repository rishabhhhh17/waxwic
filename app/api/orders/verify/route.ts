import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fireCapiPurchase } from '@/lib/meta';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  event_id: string;
  customer: { name: string; email: string; phone: string };
  items: { product_id: string; variant_id: string; qty: number }[];
  amount: number;
};

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: 'not_configured' }, { status: 500 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(razorpay_signature, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false, error: 'bad_signature' }, { status: 400 });
  }

  // Fire CAPI Purchase from server (browser also fires Purchase with the same event_id for dedup)
  try {
    await fireCapiPurchase({
      event_id: body.event_id,
      email: body.customer?.email,
      phone: body.customer?.phone,
      value: (body.amount ?? 0) / 100,
      currency: 'INR',
      content_ids: body.items.map((i) => i.product_id),
      contents: body.items.map((i) => ({
        id: i.product_id,
        quantity: i.qty,
        item_price: 0, // server doesn't trust client; webhook fills with truth
      })),
      num_items: body.items.reduce((acc, i) => acc + i.qty, 0),
    });
  } catch {}

  return NextResponse.json({ ok: true });
}
