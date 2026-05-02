'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/products';

const CATEGORIES = ['all', 'woody', 'floral', 'fresh', 'oriental', 'smoky'] as const;
type Cat = (typeof CATEGORIES)[number];

export function ProductsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initial = (searchParams.get('category') ?? 'all') as Cat;
  const [active, setActive] = useState<Cat>(CATEGORIES.includes(initial) ? initial : 'all');

  const filtered = useMemo(() => {
    if (active === 'all') return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  return (
    <>
      <section className="bg-cream py-14 md:py-20 border-b border-line">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="text-[12px] uppercase tracking-widest text-clay">The collection</div>
          <h1 className="font-display text-5xl md:text-6xl text-ink mt-3 leading-tight">All six perfumes.</h1>
          <p className="mt-4 max-w-prose text-ink/75">
            Each tin is hand-poured in batches of 80. Filter by mood — woody, floral, fresh, oriental, smoky.
          </p>
        </div>
      </section>

      <section className="bg-ivory py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={
                  'h-9 px-4 text-[12px] uppercase tracking-wider border transition-colors ' +
                  (active === c
                    ? 'bg-ink text-ivory border-ink'
                    : 'bg-transparent text-ink border-line hover:border-ink')
                }
              >
                {c}
              </button>
            ))}
            <span className="ml-auto text-xs text-smoke tabular-nums">
              {filtered.length} {filtered.length === 1 ? 'perfume' : 'perfumes'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-smoke">No perfumes in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-12">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
