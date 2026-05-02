import { Suspense } from 'react';
import { getActiveProducts } from '@/lib/products';
import { ProductsClient } from './products-client';

export const metadata = {
  title: 'Shop solid perfumes — Waxwic',
  description: 'All six waxwic solid perfumes. Woody, floral, fresh, smoky.',
};

export default function ProductsPage() {
  const products = getActiveProducts();
  return (
    <Suspense fallback={null}>
      <ProductsClient products={products} />
    </Suspense>
  );
}
