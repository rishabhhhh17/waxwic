'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { trackPurchase } from '@/lib/analytics/meta-pixel';

type StoredPayload = {
  event_id: string;
  order_id: string;
  payment_id: string;
  total_paise: number;
  subtotal_paise?: number;
  discount_paise?: number;
  coupon?: { code: string; percent: number; description: string; bumped_to_min: boolean } | null;
  customer: { name: string; email: string };
  shipping: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  lines: {
    product_id: string;
    variant_id: string;
    name: string;
    variant_label: string;
    unit_price_paise: number;
    qty: number;
    image: string;
  }[];
};

export function ConfirmationClient({ orderId }: { orderId: string }) {
  const params = useSearchParams();
  const paymentId = params.get('p');
  const [payload, setPayload] = useState<StoredPayload | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    try {
      const raw = sessionStorage.getItem(`fb_purchase_${orderId}`);
      if (!raw) return;
      const data = JSON.parse(raw) as StoredPayload;
      setPayload(data);
      trackPurchase({
        event_id: data.event_id,
        value: data.total_paise / 100,
        contents: data.lines.map((l) => ({
          id: l.product_id,
          quantity: l.qty,
          item_price: l.unit_price_paise / 100,
        })),
        num_items: data.lines.reduce((acc, l) => acc + l.qty, 0),
      });
      sessionStorage.removeItem(`fb_purchase_${orderId}`);
    } catch {}
  }, [orderId]);

  return (
    <section className="bg-ivory min-h-[70vh] py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="flex items-center gap-3 text-moss">
          <CheckCircle2 size={28} />
          <span className="text-[12px] uppercase tracking-widest font-medium">Order placed</span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-ink mt-4 leading-tight">Thank you.</h1>
        <p className="mt-4 text-ink/75 max-w-prose leading-relaxed">
          Save this page or screenshot it &mdash; your order ID is your reference. We hand-pour, label and ship within 2 working days. If anything goes off-script, write to <a href="mailto:hello@waxwic.in" className="underline decoration-clay underline-offset-4">hello@waxwic.in</a> with this order ID.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-6 bg-cream p-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-smoke">Order ID</div>
            <div className="font-mono text-sm break-all">{orderId}</div>
          </div>
          {paymentId && (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-smoke">Payment ID</div>
              <div className="font-mono text-sm break-all">{paymentId}</div>
            </div>
          )}
          {payload && (
            <>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-smoke">Customer</div>
                <div className="text-sm">{payload.customer.name}</div>
                <div className="text-xs text-smoke">{payload.customer.email}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-smoke">Shipping to</div>
                <div className="text-sm leading-snug">
                  {payload.shipping.line1}
                  {payload.shipping.line2 ? `, ${payload.shipping.line2}` : ''}<br />
                  {payload.shipping.city}, {payload.shipping.state} {payload.shipping.pincode}
                </div>
              </div>
            </>
          )}
        </div>

        {payload && (
          <div className="mt-8">
            <h2 className="font-display text-2xl mb-4">In your order</h2>
            <ul className="divide-y divide-line border-y border-line">
              {payload.lines.map((l) => (
                <li key={l.variant_id} className="py-4 flex gap-4 items-center">
                  <div className="relative h-16 w-16 bg-cream">
                    <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg text-ink truncate">{l.name}</div>
                    <div className="text-xs text-smoke">{l.variant_label} × {l.qty}</div>
                  </div>
                  <div className="text-sm tabular-nums">{formatINR(l.unit_price_paise * l.qty)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 text-sm">
              {typeof payload.subtotal_paise === 'number' && payload.coupon && (
                <>
                  <div className="flex justify-between text-smoke">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatINR(payload.subtotal_paise)}</span>
                  </div>
                  <div className="flex justify-between text-moss">
                    <span>Discount ({payload.coupon.code} · {payload.coupon.percent}%)</span>
                    <span className="tabular-nums">&minus; {formatINR(payload.discount_paise ?? 0)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-display text-xl pt-2">
                <span>Total paid</span>
                <span className="tabular-nums">{formatINR(payload.total_paise)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 bg-cream p-6">
          <div className="text-[11px] uppercase tracking-widest text-smoke mb-2">What happens next</div>
          <ol className="space-y-2 text-sm text-ink/80 leading-relaxed list-decimal pl-5">
            <li>Your tin is hand-poured and labelled within 2 working days.</li>
            <li>We ship via BlueDart / Delhivery; metro orders typically arrive in 3 days.</li>
            <li>Email <a href="mailto:hello@waxwic.in" className="underline decoration-clay underline-offset-4">hello@waxwic.in</a> with this order ID for tracking.</li>
          </ol>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-12 px-7 bg-ink text-ivory text-[12px] uppercase tracking-wider"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
