import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fireCapiPurchase } from '@/lib/meta';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'not_configured' }, { status: 500 });

  const signature = req.headers.get('x-razorpay-signature');
  if (!signature) return NextResponse.json({ error: 'missing_signature' }, { status: 400 });

  const raw = await req.text();
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'bad_signature' }, { status: 400 });
  }

  let event: { event?: string; payload?: Record<string, unknown> } = {};
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = event.event ?? '';
  if (name !== 'payment.captured' && name !== 'order.paid') {
    return NextResponse.json({ ignored: name }, { status: 200 });
  }

  type RzpPayment = {
    id: string;
    order_id: string;
    amount: number;
    email?: string;
    contact?: string;
    notes?: Record<string, string>;
  };
  type RzpOrder = { id: string; amount: number; notes?: Record<string, string> };

  const payment = (event.payload as { payment?: { entity?: RzpPayment } } | undefined)?.payment?.entity;
  const order = (event.payload as { order?: { entity?: RzpOrder } } | undefined)?.order?.entity;
  const notes = payment?.notes ?? order?.notes ?? {};
  const event_id = notes.event_id ?? payment?.id ?? order?.id ?? `evt_${Date.now()}`;
  const value = ((payment?.amount ?? order?.amount ?? 0) as number) / 100;

  let items: { id: string; quantity: number; item_price: number }[] = [];
  let content_ids: string[] = [];
  try {
    const parsed = notes.items ? JSON.parse(notes.items) : [];
    type Line = { product_id: string; qty: number; unit_paise?: number };
    items = (parsed as Line[]).map((l) => ({
      id: l.product_id,
      quantity: l.qty,
      item_price: (l.unit_paise ?? 0) / 100,
    }));
    content_ids = items.map((i) => i.id);
  } catch {}

  try {
    await fireCapiPurchase({
      event_id,
      email: notes.customer_email,
      phone: notes.customer_phone,
      value,
      currency: 'INR',
      content_ids,
      contents: items,
      num_items: items.reduce((acc, i) => acc + i.quantity, 0),
    });
  } catch {}

  return NextResponse.json({ ok: true });
}
