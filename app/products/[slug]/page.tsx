import { notFound } from 'next/navigation';
import { getActiveProducts, getProductBySlug, getRelatedProducts } from '@/lib/products';
import { PdpClient } from './pdp-client';

export async function generateStaticParams() {
  return getActiveProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProductBySlug(params.slug);
  if (!p) return { title: 'Not found — Waxwic' };
  return {
    title: `${p.name} solid perfume — Waxwic`,
    description: p.tagline,
    openGraph: {
      title: `${p.name} — Waxwic`,
      description: p.tagline,
      images: p.images.slice(0, 1).map((i) => i.src),
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  const related = getRelatedProducts(params.slug, 3);
  return <PdpClient product={product} related={related} />;
}
