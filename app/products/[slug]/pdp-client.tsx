'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import type { Product } from '@/lib/products';
import { useCart } from '@/lib/cart-store';
import { formatINR } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { trackAddToCart, trackViewContent } from '@/lib/analytics/meta-pixel';

export function PdpClient({ product, related }: { product: Product; related: Product[] }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const add = useCart((s) => s.add);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackViewContent({
      content_id: product.id,
      value: variant.price_paise / 100,
      name: product.name,
    });
  }, [product.id, product.name, variant.price_paise]);

  const onAdd = () => {
    add({
      product_id: product.id,
      variant_id: variant.id,
      slug: product.slug,
      name: product.name,
      variant_label: variant.label,
      unit_price_paise: variant.price_paise,
      image: product.images[0].src,
      qty,
    });
    trackAddToCart({
      content_id: product.id,
      value: (variant.price_paise * qty) / 100,
      name: product.name,
      quantity: qty,
    });
  };

  return (
    <>
      <section className="bg-ivory pt-8 pb-14">
        <div className="mx-auto max-w-6xl px-5 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="relative aspect-[4/5] bg-cream overflow-hidden">
              <Image
                src={product.images[activeImg].src}
                alt={product.images[activeImg].alt}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={
                      'relative h-20 w-20 bg-cream overflow-hidden border ' +
                      (activeImg === i ? 'border-ink' : 'border-transparent')
                    }
                    aria-label={`Show image ${i + 1}`}
                  >
                    <Image src={img.src} alt={img.alt} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:pt-4">
            <div className="text-[12px] uppercase tracking-widest text-clay">{product.category}</div>
            <h1 className="font-display text-5xl md:text-6xl text-ink mt-3 leading-tight">{product.name}</h1>
            <p className="mt-2 text-lg text-ink/70">{product.tagline}</p>

            <div className="mt-5 flex items-center gap-3 text-sm">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(product.rating) ? 'fill-clay text-clay' : 'text-line'}
                  />
                ))}
              </div>
              <span className="tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-smoke">· {product.rating_count} reviews</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <div className="font-display text-3xl text-ink tabular-nums">{formatINR(variant.price_paise)}</div>
              {product.compare_at_price && (
                <div className="text-smoke line-through tabular-nums">
                  &#8377;{product.compare_at_price}
                </div>
              )}
            </div>

            <p className="mt-6 text-ink/80 leading-relaxed max-w-prose">{product.description}</p>

            <div className="mt-8">
              <div className="text-[12px] uppercase tracking-widest text-smoke mb-3">Size</div>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={
                      'h-11 px-5 text-sm border transition-colors ' +
                      (variantId === v.id
                        ? 'bg-ink text-ivory border-ink'
                        : 'bg-transparent text-ink border-line hover:border-ink')
                    }
                  >
                    {v.label} · {formatINR(v.price_paise)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-stretch gap-3">
              <div className="inline-flex items-center border border-ink/20">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-12 w-12 flex items-center justify-center hover:bg-cream"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <div className="h-12 px-4 flex items-center text-sm tabular-nums w-10 justify-center">{qty}</div>
                <button
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="h-12 w-12 flex items-center justify-center hover:bg-cream"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={onAdd}
                className="flex-1 h-12 bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90 transition-colors"
              >
                Add to cart · {formatINR(variant.price_paise * qty)}
              </button>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-ink/80">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 rounded-full bg-clay shrink-0" /> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="text-[12px] uppercase tracking-widest text-clay">The accord</div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mt-2">How it unfolds.</h2>

          <div className="mt-10 grid sm:grid-cols-3 gap-8 sm:gap-10">
            <div>
              <div className="text-xs uppercase tracking-widest text-smoke mb-2">Top</div>
              <ul className="space-y-1.5 text-ink">
                {product.notes.top.map((n) => <li key={n} className="font-display text-xl">{n}</li>)}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-smoke mb-2">Heart</div>
              <ul className="space-y-1.5 text-ink">
                {product.notes.heart.map((n) => <li key={n} className="font-display text-xl">{n}</li>)}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-smoke mb-2">Base</div>
              <ul className="space-y-1.5 text-ink">
                {product.notes.base.map((n) => <li key={n} className="font-display text-xl">{n}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-smoke mb-3">Ingredients</div>
              <ul className="space-y-1.5 text-ink/80 text-sm leading-relaxed">
                {product.ingredients.map((i) => <li key={i}>· {i}</li>)}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-smoke mb-3">Wear</div>
              <p className="text-ink/80 text-sm leading-relaxed">
                Roughly {product.longevity_hours} hours on warm skin, slightly less on cooler skin. Dab to pulse
                points — wrist, behind the ear, base of the throat. Reapply once mid-day if you want it to carry into
                the evening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-ivory py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-3xl md:text-4xl text-ink">You may also like</h2>
              <Link href="/products" className="text-sm text-ink hover:text-clay">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
