'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { formatINR } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, close, lines, setQty, remove, totalPaise } = useCart();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close cart overlay"
        onClick={close}
        className="absolute inset-0 bg-ink/50"
      />
      <aside
        role="dialog"
        aria-label="Cart"
        className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory flex flex-col"
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-line">
          <h2 className="font-display text-2xl">Your cart</h2>
          <button onClick={close} aria-label="Close cart" className="p-2">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="font-display text-3xl text-ink">Empty for now.</div>
            <p className="mt-3 text-sm text-smoke max-w-xs">
              You haven&rsquo;t picked a scent yet. Try Coastline if you&rsquo;re new — it&rsquo;s our easy first.
            </p>
            <Link
              href="/products"
              onClick={close}
              className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90"
            >
              Shop perfumes
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-line">
              {lines.map((l) => (
                <div key={l.variant_id} className="py-4 flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 bg-cream">
                    <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-display text-lg text-ink truncate">{l.name}</div>
                        <div className="text-xs text-smoke">{l.variant_label}</div>
                      </div>
                      <button
                        onClick={() => remove(l.variant_id)}
                        className="text-xs text-smoke hover:text-ink uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-line">
                        <button
                          onClick={() => setQty(l.variant_id, l.qty - 1)}
                          className="h-9 w-9 flex items-center justify-center hover:bg-cream"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="h-9 px-3 flex items-center text-sm tabular-nums">{l.qty}</div>
                        <button
                          onClick={() => setQty(l.variant_id, l.qty + 1)}
                          className="h-9 w-9 flex items-center justify-center hover:bg-cream"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-sm tabular-nums">
                        {formatINR(l.unit_price_paise * l.qty)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line px-6 py-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-smoke">Subtotal</span>
                <span className="tabular-nums">{formatINR(totalPaise())}</span>
              </div>
              <div className="text-xs text-smoke">Shipping calculated at checkout.</div>
              <Link
                href="/checkout"
                onClick={close}
                className="block w-full text-center h-12 leading-[3rem] bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90"
              >
                Checkout · {formatINR(totalPaise())}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
