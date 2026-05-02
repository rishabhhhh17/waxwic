'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/products';
import { useCart } from '@/lib/cart-store';
import { formatINR, formatINRRupees } from '@/lib/utils';
import { trackAddToCart } from '@/lib/analytics/meta-pixel';

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const v = product.variants[0];

  const onQuickAdd = () => {
    add({
      product_id: product.id,
      variant_id: v.id,
      slug: product.slug,
      name: product.name,
      variant_label: v.label,
      unit_price_paise: v.price_paise,
      image: product.images[0].src,
    });
    trackAddToCart({
      content_id: product.id,
      value: v.price_paise / 100,
      name: product.name,
      quantity: 1,
    });
  };

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-cream overflow-hidden">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-xl text-ink leading-tight">{product.name}</h3>
            <p className="text-sm text-smoke mt-0.5 truncate">{product.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm text-ink">{formatINRRupees(product.base_price)}</div>
            {product.compare_at_price && (
              <div className="text-xs text-smoke line-through">
                {formatINRRupees(product.compare_at_price)}
              </div>
            )}
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-label={`Quick add ${product.name}`}
        onClick={onQuickAdd}
        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-ivory/95 text-ink shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-ink hover:text-ivory"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
