import { NextResponse } from 'next/server';
import { findVariant, getProductById } from '@/lib/products';
import { razorpay } from '@/lib/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Item = { product_id: string; variant_id: string; qty: number };

type Body = {
  customer: { name: string; email: string; phone: string };
  shipping: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Item[];
  event_id: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!body.items?.length) return NextResponse.json({ error: 'empty_cart' }, { status: 400 });
  if (!body.customer?.email || !body.customer?.phone || !body.customer?.name) {
    return NextResponse.json({ error: 'missing_customer' }, { status: 400 });
  }

  let amount_paise = 0;
  const enriched: Array<Item & { unit_paise: number; name: string; variant_label: string; slug: string }> = [];

  for (const it of body.items) {
    const product = getProductById(it.product_id);
    const variant = findVariant(it.product_id, it.variant_id);
    if (!product || !variant) {
      return NextResponse.json({ error: 'unknown_item', detail: it }, { status: 400 });
    }
    const qty = Math.max(1, Math.min(99, Number(it.qty) || 1));
    amount_paise += variant.price_paise * qty;
    enriched.push({
      ...it,
      qty,
      unit_paise: variant.price_paise,
      name: product.name,
      variant_label: variant.label,
      slug: product.slug,
    });
  }

  if (amount_paise <= 0) return NextResponse.json({ error: 'zero_total' }, { status: 400 });

  const receipt = `WW-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  try {
    const order = await razorpay().orders.create({
      amount: amount_paise,
      currency: 'INR',
      receipt,
      notes: {
        customer_name: body.customer.name,
        customer_email: body.customer.email,
        customer_phone: body.customer.phone,
        shipping: JSON.stringify(body.shipping),
        items: JSON.stringify(enriched),
        event_id: body.event_id,
      },
    });

    return NextResponse.json({
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt,
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'razorpay_create_failed', detail: (e as Error).message },
      { status: 502 },
    );
  }
}
