'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { formatINR } from '@/lib/utils';
import { trackInitiateCheckout } from '@/lib/analytics/meta-pixel';
import { applyCoupon, type CouponApplied } from '@/lib/coupons';

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

type Form = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

const empty: Form = {
  name: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalPaise, clear } = useCart();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponApplied | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = totalPaise();
  const payable = useMemo(() => {
    if (!appliedCoupon) return subtotal;
    const re = applyCoupon(subtotal, appliedCoupon.code);
    return re ? re.payable_paise : subtotal;
  }, [subtotal, appliedCoupon]);

  useEffect(() => {
    if (lines.length === 0) return;
    const contents = lines.map((l) => ({
      id: l.product_id,
      quantity: l.qty,
      item_price: l.unit_price_paise / 100,
    }));
    trackInitiateCheckout({
      value: payable / 100,
      contents,
      num_items: lines.reduce((a, l) => a + l.qty, 0),
    });
  }, [lines, payable]);

  function onApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setCouponError(null);
    const trimmed = couponInput.trim();
    if (!trimmed) return;
    const result = applyCoupon(subtotal, trimmed);
    if (!result) {
      setCouponError('Code not recognised.');
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(result);
  }

  function onRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  }

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate(): boolean {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Indian 10-digit mobile';
    if (!form.line1.trim()) e.line1 = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state.trim()) e.state = 'Required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit PIN';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    if (lines.length === 0) return;
    if (!RAZORPAY_KEY) {
      setPaymentError('Payment is not configured yet. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to .env.local.');
      return;
    }
    setSubmitting(true);
    setPaymentError(null);

    const event_id = `pur_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const items = lines.map((l) => ({
      product_id: l.product_id,
      variant_id: l.variant_id,
      qty: l.qty,
      slug: l.slug,
      name: l.name,
      variant_label: l.variant_label,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          shipping: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          items,
          event_id,
          coupon_code: appliedCoupon?.code ?? null,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Could not create order');
      }
      const order = (await res.json()) as {
        razorpay_order_id: string;
        amount: number;
        currency: string;
        subtotal_paise: number;
        discount_paise: number;
        coupon: { code: string; percent: number; description: string; bumped_to_min: boolean } | null;
      };

      const Rzp = window.Razorpay;
      if (!Rzp) {
        setPaymentError('Razorpay script failed to load. Please refresh.');
        setSubmitting(false);
        return;
      }

      const rzp = new Rzp({
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Waxwic',
        description: `${lines.length} item${lines.length === 1 ? '' : 's'}${order.coupon ? ` · ${order.coupon.code}` : ''}`,
        order_id: order.razorpay_order_id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { event_id, coupon: order.coupon?.code ?? '' },
        theme: { color: '#1B1A17' },
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verify = await fetch('/api/orders/verify', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                ...resp,
                event_id,
                customer: form,
                items,
                amount: order.amount,
              }),
            });
            if (!verify.ok) throw new Error('verification failed');

            const payload = {
              event_id,
              order_id: resp.razorpay_order_id,
              payment_id: resp.razorpay_payment_id,
              total_paise: order.amount,
              subtotal_paise: order.subtotal_paise,
              discount_paise: order.discount_paise,
              coupon: order.coupon,
              customer: { name: form.name, email: form.email },
              shipping: form,
              lines,
            };
            try {
              sessionStorage.setItem(
                `fb_purchase_${resp.razorpay_order_id}`,
                JSON.stringify(payload),
              );
            } catch {}
            clear();
            router.push(
              `/order-confirmation/${encodeURIComponent(resp.razorpay_order_id)}?p=${encodeURIComponent(resp.razorpay_payment_id)}`,
            );
          } catch (err) {
            setPaymentError('Payment captured but verification failed — please email hello@waxwic.in.');
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });
      rzp.open();
    } catch (err) {
      setPaymentError((err as Error).message || 'Something went wrong');
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <section className="bg-ivory min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <h1 className="font-display text-4xl text-ink">Your cart is empty.</h1>
          <p className="mt-3 text-ink/70">Pick a perfume first, then come back.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-ink text-ivory text-[12px] uppercase tracking-wider"
          >
            Shop perfumes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <section className="bg-ivory pt-10 pb-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8 grid md:grid-cols-[1fr_360px] gap-10">
          <div>
            <h1 className="font-display text-4xl text-ink">Checkout</h1>
            <p className="mt-1 text-sm text-smoke">All fields required unless marked optional.</p>

            <form className="mt-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
              <fieldset>
                <legend className="text-[12px] uppercase tracking-widest text-smoke mb-4">Contact</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" value={form.name} onChange={update('name')} error={errors.name} />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    error={errors.email}
                  />
                  <Field
                    label="Mobile (10 digits)"
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    error={errors.phone}
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-[12px] uppercase tracking-widest text-smoke mb-4">Shipping address</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Address line 1" value={form.line1} onChange={update('line1')} error={errors.line1} />
                  <Field
                    label="Address line 2 (optional)"
                    value={form.line2}
                    onChange={update('line2')}
                  />
                  <Field label="City" value={form.city} onChange={update('city')} error={errors.city} />
                  <Field label="State" value={form.state} onChange={update('state')} error={errors.state} />
                  <Field
                    label="PIN code"
                    value={form.pincode}
                    onChange={update('pincode')}
                    error={errors.pincode}
                  />
                </div>
              </fieldset>

              {paymentError && (
                <div className="border border-clay/40 bg-clay/5 text-clay text-sm px-4 py-3">
                  {paymentError}
                </div>
              )}

              <button
                type="button"
                onClick={handlePay}
                disabled={submitting}
                className="w-full h-12 bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90 disabled:opacity-50"
              >
                {submitting ? 'Working…' : `Pay ${formatINR(payable)}`}
              </button>
              <p className="text-xs text-smoke">
                You&rsquo;ll be redirected to Razorpay&rsquo;s secure modal. We never see or store card details.
              </p>
            </form>
          </div>

          <aside className="bg-cream p-6 h-fit">
            <h2 className="font-display text-2xl">Order summary</h2>
            <ul className="mt-5 space-y-4 divide-y divide-line">
              {lines.map((l) => (
                <li key={l.variant_id} className="pt-4 first:pt-0 flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 bg-ivory">
                    <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base text-ink truncate">{l.name}</div>
                    <div className="text-xs text-smoke">{l.variant_label} × {l.qty}</div>
                  </div>
                  <div className="text-sm tabular-nums">{formatINR(l.unit_price_paise * l.qty)}</div>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-5 border-t border-line">
              {appliedCoupon ? (
                <div className="flex items-start justify-between gap-2 bg-ivory border border-moss/30 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-widest text-moss font-medium">
                      {appliedCoupon.code} · {appliedCoupon.percent}% off
                    </div>
                    <div className="text-xs text-smoke truncate">{appliedCoupon.description}</div>
                    {appliedCoupon.bumped_to_min && (
                      <div className="text-[11px] text-smoke mt-1">
                        Razorpay minimum &#8377;1 applied.
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onRemoveCoupon}
                    className="text-xs text-smoke hover:text-ink uppercase tracking-wider shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={onApplyCoupon} className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest text-smoke">Discount code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        if (couponError) setCouponError(null);
                      }}
                      placeholder="WAX15"
                      className="flex-1 h-10 px-3 bg-ivory border border-line focus:border-ink outline-none text-sm uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      disabled={!couponInput.trim()}
                      className="h-10 px-4 bg-ink text-ivory text-[11px] uppercase tracking-wider hover:bg-ink/90 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <div className="text-xs text-clay">{couponError}</div>}
                </form>
              )}
            </div>

            <div className="mt-5 pt-5 border-t border-line space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-smoke">Subtotal</span>
                <span className="tabular-nums">{formatINR(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-moss">
                  <span>Discount ({appliedCoupon.percent}%)</span>
                  <span className="tabular-nums">&minus; {formatINR(subtotal - payable)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-smoke">Shipping</span>
                <span>Calculated by Razorpay</span>
              </div>
              <div className="flex justify-between font-display text-lg pt-3">
                <span>Total</span>
                <span className="tabular-nums">{formatINR(payable)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-smoke">{props.label}</span>
      <input
        type={props.type ?? 'text'}
        value={props.value}
        onChange={props.onChange}
        className={
          'mt-1.5 w-full h-11 px-3 bg-ivory border outline-none transition-colors ' +
          (props.error ? 'border-clay' : 'border-line focus:border-ink')
        }
      />
      {props.error && <span className="mt-1 block text-xs text-clay">{props.error}</span>}
    </label>
  );
}
